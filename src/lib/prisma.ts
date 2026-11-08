import { PrismaPg } from "@prisma/adapter-pg";

import { PrismaClient } from "@/generated/prisma/client";

const connectionString = process.env.DATABASE_URL;

/**
 * Indica se existe uma DATABASE_URL configurada.
 * A URL pode existir e ainda assim o banco estar indisponível — por isso as
 * consultas sempre passam por `queryDatabase`, que trata falhas de conexão.
 */
export const isDatabaseConfigured = Boolean(connectionString);

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

function createPrismaClient() {
  if (!connectionString) {
    throw new Error(
      "DATABASE_URL não definida. Copie .env.example para .env e configure a conexão PostgreSQL.",
    );
  }

  const adapter = new PrismaPg({ connectionString });

  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["warn"] : [],
  });
}

/**
 * Retorna a instância única do Prisma Client no runtime do servidor.
 * Em desenvolvimento, reutiliza a instância entre hot reloads para evitar
 * múltiplos pools de conexão com o PostgreSQL.
 */
export function getPrismaClient(): PrismaClient | null {
  if (!connectionString) {
    return null;
  }

  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = createPrismaClient();
  }

  return globalForPrisma.prisma;
}

/**
 * Executa uma consulta com fallback seguro: se o banco não estiver
 * configurado ou a conexão falhar, retorna `null` para que a camada de
 * Server Actions use os dados de demonstração.
 */
export async function queryDatabase<T>(
  operation: (client: PrismaClient) => Promise<T>,
): Promise<T | null> {
  const client = getPrismaClient();

  if (!client) {
    return null;
  }

  try {
    return await operation(client);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    const summary =
      message
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean)
        .at(-1) ?? message;

    console.warn(
      `[prisma] Consulta indisponível, usando fallback de demonstração: ${summary}`,
    );

    return null;
  }
}
