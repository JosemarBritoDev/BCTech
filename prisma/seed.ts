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
    status: "ACTIVE",
    demoUrl: "https://bchealth.britoscode.tech",
    repositoryUrl: "https://github.com/JosemarBritoDev/BCHealth",
  },
  {
    slug: "bctech-core",
    name: "BCTech Core",
    description:
      "Núcleo do ecossistema BritosCode: identidade, tenants, assinaturas, suporte e ambientes de demonstração.",
    status: "BETA",
    demoUrl: "https://bctech.britoscode.tech",
    repositoryUrl: "https://github.com/JosemarBritoDev/BCTech",
  },
];

type SeedTenant = {
  key: string;
  name: string;
  document: string;
};

const tenants: SeedTenant[] = [
  {
    key: "vida-plena",
    name: "Clínica Vida Plena",
    document: "12.345.678/0001-90",
  },
  {
    key: "atelie-aurora",
    name: "Ateliê Aurora",
    document: "98.765.432/0001-10",
  },
  {
    key: "rede-bem-estar",
    name: "Rede Bem-Estar",
    document: "45.678.901/0001-23",
  },
];

type SeedSubscription = {
  id: string;
  tenantKey: string;
  productSlug: string;
  planName: string;
  amount: number;
  status: "ACTIVE" | "INACTIVE" | "OVERDUE" | "CANCELLED";
  asaasCustomerId: string;
  asaasSubscriptionId: string;
  currentPeriodEnd: Date;
};

const subscriptions: SeedSubscription[] = [
  {
    id: "seed-sub-vida-plena-bchealth",
    tenantKey: "vida-plena",
    productSlug: "bc-health",
    planName: "Growth",
    amount: 489,
    status: "ACTIVE",
    asaasCustomerId: "cus_demo_vida_plena",
    asaasSubscriptionId: "sub_demo_vida_plena",
    currentPeriodEnd: new Date("2026-12-10T00:00:00.000Z"),
  },
  {
    id: "seed-sub-atelie-aurora-bcmodas",
    tenantKey: "atelie-aurora",
    productSlug: "bcmodas",
    planName: "Pro",
    amount: 349,
    status: "ACTIVE",
    asaasCustomerId: "cus_demo_atelie_aurora",
    asaasSubscriptionId: "sub_demo_atelie_aurora",
    currentPeriodEnd: new Date("2026-12-05T00:00:00.000Z"),
  },
  {
    id: "seed-sub-rede-bem-estar-core",
    tenantKey: "rede-bem-estar",
    productSlug: "bctech-core",
    planName: "Enterprise",
    amount: 1290,
    status: "OVERDUE",
    asaasCustomerId: "cus_demo_rede_bem_estar",
    asaasSubscriptionId: "sub_demo_rede_bem_estar",
    currentPeriodEnd: new Date("2026-11-01T00:00:00.000Z"),
  },
];

type SeedTicket = {
  id: string;
  tenantKey: string;
  productSlug: string;
  title: string;
  description: string;
  status: "OPEN" | "IN_PROGRESS" | "RESOLVED";
  priority: "LOW" | "MEDIUM" | "HIGH";
};

const tickets: SeedTicket[] = [
  {
    id: "seed-ticket-vida-plena-001",
    tenantKey: "vida-plena",
    productSlug: "bc-health",
    title: "Erro ao emitir relatório de atendimentos",
    description:
      "O relatório mensal de atendimentos retorna erro 500 ao filtrar por convênio.",
    status: "IN_PROGRESS",
    priority: "HIGH",
  },
  {
    id: "seed-ticket-aurora-001",
    tenantKey: "atelie-aurora",
    productSlug: "bcmodas",
    title: "Dúvida sobre ficha técnica de estamparia",
    description:
      "Precisamos adicionar campos personalizados na ficha técnica de estamparia.",
    status: "OPEN",
    priority: "MEDIUM",
  },
  {
    id: "seed-ticket-bem-estar-001",
    tenantKey: "rede-bem-estar",
    productSlug: "bctech-core",
    title: "Segunda via de cobrança",
    description:
      "Solicitamos a segunda via da fatura em atraso para regularização do contrato.",
    status: "OPEN",
    priority: "HIGH",
  },
];

async function seedProducts() {
  const records = new Map<string, string>();

  for (const product of products) {
    const record = await prisma.saasProduct.upsert({
      where: { slug: product.slug },
      update: { ...product },
      create: { ...product },
    });

    records.set(product.slug, record.id);
    console.log(`✔ Produto sincronizado: ${product.name} (${product.slug})`);
  }

  return records;
}

async function seedTenants() {
  const records = new Map<string, string>();

  for (const tenant of tenants) {
    const record = await prisma.tenant.upsert({
      where: { document: tenant.document },
      update: { name: tenant.name },
      create: { name: tenant.name, document: tenant.document },
    });

    records.set(tenant.key, record.id);
    console.log(`✔ Tenant sincronizado: ${tenant.name}`);
  }

  return records;
}

async function seedSubscriptions(
  productIds: Map<string, string>,
  tenantIds: Map<string, string>,
) {
  for (const subscription of subscriptions) {
    const tenantId = tenantIds.get(subscription.tenantKey);
    const saasProductId = productIds.get(subscription.productSlug);

    if (!tenantId || !saasProductId) {
      throw new Error(`Referência inválida no seed da assinatura ${subscription.id}`);
    }

    await prisma.subscription.upsert({
      where: { id: subscription.id },
      update: {
        tenantId,
        saasProductId,
        planName: subscription.planName,
        amount: subscription.amount,
        status: subscription.status,
        asaasCustomerId: subscription.asaasCustomerId,
        asaasSubscriptionId: subscription.asaasSubscriptionId,
        currentPeriodEnd: subscription.currentPeriodEnd,
      },
      create: {
        id: subscription.id,
        tenantId,
        saasProductId,
        planName: subscription.planName,
        amount: subscription.amount,
        status: subscription.status,
        asaasCustomerId: subscription.asaasCustomerId,
        asaasSubscriptionId: subscription.asaasSubscriptionId,
        currentPeriodEnd: subscription.currentPeriodEnd,
      },
    });

    console.log(`✔ Assinatura sincronizada: ${subscription.id}`);
  }
}

async function seedTickets(
  productIds: Map<string, string>,
  tenantIds: Map<string, string>,
) {
  for (const ticket of tickets) {
    const tenantId = tenantIds.get(ticket.tenantKey);
    const saasProductId = productIds.get(ticket.productSlug);

    if (!tenantId || !saasProductId) {
      throw new Error(`Referência inválida no seed do chamado ${ticket.id}`);
    }

    await prisma.ticket.upsert({
      where: { id: ticket.id },
      update: {
        tenantId,
        saasProductId,
        title: ticket.title,
        description: ticket.description,
        status: ticket.status,
        priority: ticket.priority,
      },
      create: {
        id: ticket.id,
        tenantId,
        saasProductId,
        title: ticket.title,
        description: ticket.description,
        status: ticket.status,
        priority: ticket.priority,
      },
    });

    console.log(`✔ Chamado sincronizado: ${ticket.id}`);
  }
}

async function main() {
  const productIds = await seedProducts();
  const tenantIds = await seedTenants();

  await seedSubscriptions(productIds, tenantIds);
  await seedTickets(productIds, tenantIds);
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
