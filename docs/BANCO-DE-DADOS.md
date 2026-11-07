# Banco de dados

## Prisma

O projeto usa **Prisma 7** com o generator `prisma-client`, que emite o client
tipado em `src/generated/prisma` (diretório ignorado pelo Git).

- Schema: `prisma/schema.prisma`
- Configuração: `prisma.config.ts`
- Provider: `postgresql`
- Migrations: `prisma/migrations`

### Scripts

```bash
npm run db:generate   # gera o Prisma Client
npm run db:migrate    # cria/aplica migrations em desenvolvimento
npm run db:push       # sincroniza o schema sem migration (prototipação)
npm run db:studio     # abre o Prisma Studio
```

### Fluxo de alteração de schema

1. Edite `prisma/schema.prisma`.
2. Rode `npm run db:migrate -- --name nome_da_migration`.
3. Revise o SQL gerado em `prisma/migrations`.
4. Faça commit do schema e da migration juntos.

## Supabase

O Supabase fornece o PostgreSQL gerenciado e serviços de autenticação/storage.

- Configure `DATABASE_URL` com a connection string do projeto (Settings → Database).
- Use `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY` no browser.
- `SUPABASE_SERVICE_ROLE_KEY` é **somente servidor** — nunca use com prefixo
  `NEXT_PUBLIC_` nem exponha no client.

### Cliente Supabase

Crie o cliente apenas no servidor até que haja necessidade de sessão no browser:

```ts
// src/lib/supabase.ts (exemplo)
import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);
```

## Prisma Client em runtime

No Prisma 7, o PostgreSQL usa driver adapter. O projeto já inclui
`@prisma/adapter-pg`; registre-o na instanciação do client:

```ts
// src/lib/prisma.ts (exemplo)
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });

export const prisma = new PrismaClient({ adapter });
```

## Seed

O seed fica em `prisma/seed.ts` e é registrado em `prisma.config.ts`:

```ts
migrations: {
  path: "prisma/migrations",
  seed: "tsx prisma/seed.ts",
}
```

```bash
npm run db:seed
```

O script é idempotente (`upsert` por `slug`) e popula BCModas, BC Health e
BCTech Core. Consulte [`DATABASE_SCHEMA.md`](./DATABASE_SCHEMA.md).
