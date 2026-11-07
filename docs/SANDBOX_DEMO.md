# Sandbox de Demonstração

Arquitetura dos ambientes de demonstração isolados do ecossistema **BCTech /
BritosCode HQ**, incluindo a rotina de reset automático de banco via cron.

## Objetivos

- Permitir que prospects testem cada produto SaaS sem cadastro prévio.
- Garantir isolamento total entre sandbox ↔ sandbox e sandbox ↔ produção.
- Manter dados de demonstração previsíveis e sempre limpos.
- Excluir automaticamente ambientes expirados, controlando custo.
- Oferecer reset determinístico e auditável, acionado por cron.

## Modelo de dados

A entidade `DemoSandbox` (`prisma/schema.prisma`) registra cada ambiente:

| Campo | Descrição |
| --- | --- |
| `id` | Identificador interno (`cuid()`) |
| `saasProductId` | Produto demonstrável |
| `tenantSlug` | Slug único do sandbox por produto (usado na URL) |
| `expiresAt` | TTL do ambiente |
| `isClean` | `true` somente após um reset bem-sucedido |
| `createdAt` | Data de criação |

Restrição `@@unique([saasProductId, tenantSlug])` garante um slug por produto.

## Estratégia de isolamento

### Recomendado — schema PostgreSQL dedicado

Cada sandbox recebe um schema próprio no PostgreSQL:

```
sandbox_bcmodas_demo1234
sandbox_bchealth_demo5678
```

Vantagens:

- Isolamento forte (sem vazamento por cláusula `WHERE` esquecida).
- `DROP SCHEMA ... CASCADE` realiza a limpeza de forma atômica e barata.
- Possibilita clonar o schema base (`schema_template_<produto>`) rapidamente.

Fluxo de provisionamento:

1. Valida o slug e cria o registro `DemoSandbox` com `isClean = false`.
2. `CREATE SCHEMA` (ou `CREATE SCHEMA ... TEMPLATE` a partir do template).
3. Aplica migrations/DDL do produto no schema.
4. Executa o seed de demonstração.
5. Libera acesso em `https://<tenantSlug>.demo.britoscode.tech`.
6. Marca `isClean = true`.

### Alternativa — RLS por `tenant_id`

Quando não for possível criar schemas por limitação do provedor, usar uma coluna
`sandbox_id`/`tenant_id` em todas as tabelas + Row Level Security no Supabase.
O isolamento depende de políticas corretas — maior risco operacional.

> O BCTech adota **schema dedicado** por padrão. A alternativa com RLS é fallback.

### O que nunca é compartilhado

- Credenciais, chaves e buckets de produção.
- Dados reais de tenants, usuários e assinaturas.
- Integrações de billing (Asaas) e e-mails transacionais reais.

## Ciclo de vida

```text
                  provisionamento
solicitação ──────────────────────► ACTIVE (isClean=true)
                                        │
                     TTL (expiresAt)    │ reset periódico
                                        ▼
                                   RESET (cron)
                                        │
                                        ▼
                                   EXPIRADO → teardown (DROP SCHEMA)
```

- **Criação:** sob demanda, com rate limit por IP/sessão.
- **TTL padrão:** 24 h (configurável por produto via `expiresAt`).
- **Reset periódico:** diário (dados sempre frescos) — ver cron abaixo.
- **Teardown:** ao expirar, `DROP SCHEMA ... CASCADE` e remoção do registro.

## Rotina de reset via cron

### Contrato do endpoint

`POST /api/cron/reset-sandboxes`

- Autenticação: `Authorization: Bearer ${CRON_SECRET}` (ou header `x-cron-secret`).
- Idempotente: pode ser executado mais de uma vez sem efeitos colaterais.
- Processa em lotes para evitar timeout.

```ts
// src/app/api/cron/reset-sandboxes/route.ts (referência)
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const maxDuration = 300;

export async function POST(request: Request) {
  const secret = process.env.CRON_SECRET;

  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  // 1. Seleciona sandboxes com expiresAt <= now() ou marcados para reset.
  // 2. Para cada um: DROP SCHEMA sandbox_<slug> CASCADE (se expirado)
  //    ou TRUNCATE + reseed (se apenas reset).
  // 3. Atualiza isClean e remove registros expirados.
  // 4. Registra métricas (processados, falhas, duração).

  return NextResponse.json({ ok: true });
}
```

> A implementação real deve usar o Prisma Client com o adapter PostgreSQL e
> transações por sandbox, além de logs estruturados.

### Agendamento na Vercel

`vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/cron/reset-sandboxes",
      "schedule": "0 3 * * *"
    }
  ]
}
```

> A Vercel envia automaticamente o header `Authorization` quando `CRON_SECRET`
> está configurado no projeto.

### Agendamento no Render

Criar um **Cron Job** apontando para o endpoint:

```bash
curl -fsS -X POST https://bctech.britoscode.tech/api/cron/reset-sandboxes \
  -H "Authorization: Bearer $CRON_SECRET"
```

Expressão recomendada: `0 3 * * *` (diariamente às 03:00 UTC).

### Frequências sugeridas

| Rotina | Frequência | Ação |
| --- | --- | --- |
| Reset de dados demo | Diária | `TRUNCATE` + reseed dos sandboxes ativos |
| Teardown de expirados | A cada hora | `DROP SCHEMA` e remoção do registro |
| Sanidade (`isClean=false`) | A cada 15 min | Reprovisiona sandboxes inconsistentes |

## Segurança

- `CRON_SECRET` forte, rotacionável e exclusivo de servidor.
- Endpoint responde `401` sem segredo válido e não revela detalhes internos.
- Rate limit na criação de sandboxes (por IP + sessão).
- Nunca usar a `SUPABASE_SERVICE_ROLE_KEY` no client.
- Sanitizar `tenantSlug` (`^[a-z0-9-]{3,40}$`) antes de montar nomes de schema.
- Nomes de schema sempre parametrizados/validados; nunca interpolar input cru em SQL.
- Logs sem PII; mascarar e-mails e documentos.

## Observabilidade

- Métricas: sandboxes ativos, resets executados, falhas, tempo médio de reset.
- Alertas: reset com falha 2x consecutivas; sandbox preso em `isClean=false`.
- Auditoria: registrar `sandboxId`, ação, duração e resultado.

## Checklist de implementação

- [ ] Schema template por produto versionado.
- [ ] Serviço de provisionamento com validação de slug.
- [ ] Endpoint de cron protegido por `CRON_SECRET`.
- [ ] `vercel.json` e/ou Cron Job no Render configurados.
- [ ] Rotina de teardown com `DROP SCHEMA ... CASCADE`.
- [ ] Rate limit e captcha na solicitação de demo.
- [ ] Monitoramento e alertas ativos.
- [ ] Documentação de runbook para incidentes.
