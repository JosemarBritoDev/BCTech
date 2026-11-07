# Arquitetura

## Visão geral

O BCTech é uma aplicação **full-stack monolítica modular** baseada no App Router do
Next.js 15. A camada de apresentação e as rotas de servidor vivem no mesmo projeto,
enquanto o acesso a dados é isolado pelo Prisma ORM.

```
Navegador
   │
   ▼
Next.js 15 (App Router / React Server Components)
   │
   ├── src/app          → rotas, layouts e páginas
   ├── src/lib          → utilitários e integrações (Supabase, Prisma, cn)
   │
   ▼
Prisma ORM ──► PostgreSQL (Supabase)
```

## Stack

| Camada | Tecnologia |
| --- | --- |
| Framework | Next.js 15.5 (App Router, Turbopack) |
| Linguagem | TypeScript 5 (modo `strict`) |
| Estilo | Tailwind CSS 4 + `tailwind-merge` + `clsx` |
| Ícones | `lucide-react` |
| ORM | Prisma 7 (`prisma-client` generator) |
| Banco | PostgreSQL (Supabase) |
| SDK | `@supabase/supabase-js` |
| Qualidade | ESLint 9 + `eslint-config-next` |

## Estrutura de pastas

```
.
├── docs/                     # Documentação técnica (versionada)
├── prisma/
│   └── schema.prisma         # Modelos e datasource
├── public/                   # Assets estáticos
├── src/
│   ├── app/                  # App Router
│   │   ├── globals.css
│   │   ├── layout.tsx        # Layout raiz e metadados
│   │   └── page.tsx          # Página inicial
│   ├── generated/            # Prisma Client gerado (ignorado no Git)
│   └── lib/
│       └── utils.ts          # Utilitário cn()
├── .env.example              # Referência de variáveis (versionado)
├── .gitignore
├── next.config.ts
├── prisma.config.ts          # Configuração do Prisma 7
└── tsconfig.json
```

## Convenções

- **Alias de importação:** `@/*` aponta para `src/*`.
- **Componentes:** React Server Components por padrão; use `"use client"` apenas
  quando houver interatividade.
- **Utilitário de classes:** sempre use `cn()` em vez de concatenar strings.
- **Acesso a dados:** concentre consultas no servidor (Server Components, Server
  Actions ou Route Handlers). Nunca exponha segredos com prefixo `NEXT_PUBLIC_`.
- **Nomenclatura:** arquivos em `kebab-case`, componentes em `PascalCase`.

## Fluxo de desenvolvimento

1. Crie a branch a partir de `main`: `git switch -c feat/minha-feature`.
2. Desenvolva com `npm run dev`.
3. Valide com `npm run lint` e `npm run typecheck`.
4. Abra o Pull Request para `main`.
