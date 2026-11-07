# Ambiente

## Pré-requisitos

| Ferramenta | Versão mínima |
| --- | --- |
| Node.js | 20 LTS |
| npm | 10 |
| Git | 2.40 |

## Instalação

```bash
npm install
cp .env.example .env
```

Preencha o `.env` com a connection string do PostgreSQL/Supabase e as chaves do
Supabase. O arquivo `.env` é ignorado pelo Git.

## Execução

```bash
npm run dev        # http://localhost:3000
npm run build      # build de produção
npm run start      # servidor de produção
npm run lint       # ESLint
npm run typecheck  # TypeScript sem emitir arquivos
```

## Variáveis de ambiente

| Variável | Escopo | Obrigatória | Descrição |
| --- | --- | --- | --- |
| `DATABASE_URL` | servidor | sim | Connection string PostgreSQL usada pelo Prisma |
| `NEXT_PUBLIC_SUPABASE_URL` | browser/servidor | sim | URL do projeto Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | browser/servidor | sim | Chave anônima pública do Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | servidor | não | Chave administrativa (nunca expor no client) |

## Git

- Remoto: `origin` → https://github.com/JosemarBritoDev/BCTech.git
- Branch principal: `main`
- `docs/` é versionado; `node_modules/`, `.next/`, `.env` e `src/generated/` não são.
