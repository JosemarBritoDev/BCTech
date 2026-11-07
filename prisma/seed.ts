import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";

import { PrismaClient } from "../src/generated/prisma/client";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error(
    "DATABASE_URL não definida. Copie .env.example para .env e configure a conexão PostgreSQL.",
  );
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

type SeedProduct = {
  slug: string;
  name: string;
  description: string;
  status: "ACTIVE" | "BETA" | "DEMO";
  demoUrl: string;
  repositoryUrl: string;
};

const products: SeedProduct[] = [
  {
    slug: "bcmodas",
    name: "BCModas",
    description:
      "Gestão completa para o varejo de moda: catálogo, estoque, vendas e relacionamento com clientes.",
    status: "ACTIVE",
    demoUrl: "https://bcmodas.britoscode.tech",
    repositoryUrl: "https://github.com/JosemarBritoDev/BCModas",
  },
  {
    slug: "bc-health",
    name: "BC Health",
    description:
      "Plataforma de gestão clínica com prontuário eletrônico, agenda de atendimentos e indicadores de saúde.",
    status: "BETA",
    demoUrl: "https://bchealth.britoscode.tech",
    repositoryUrl: "https://github.com/JosemarBritoDev/BCHealth",
  },
  {
    slug: "bctech-core",
    name: "BCTech Core",
    description:
      "Núcleo do ecossistema BritosCode: identidade, tenants, assinaturas, suporte e ambientes de demonstração.",
    status: "ACTIVE",
    demoUrl: "https://bctech.britoscode.tech",
    repositoryUrl: "https://github.com/JosemarBritoDev/BCTech",
  },
];

async function main() {
  for (const product of products) {
    await prisma.saasProduct.upsert({
      where: { slug: product.slug },
      update: { ...product },
      create: { ...product },
    });

    console.log(`✔ Produto sincronizado: ${product.name} (${product.slug})`);
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error("✖ Falha ao executar o seed:", error);
    await prisma.$disconnect();
    process.exit(1);
  });
