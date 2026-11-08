"use server";

import { queryDatabase } from "@/lib/prisma";

export type DataSource = "database" | "mock";

export type SaasProductView = {
  id: string;
  slug: string;
  name: string;
  description: string;
  status: "ACTIVE" | "BETA" | "DEMO";
  demoUrl: string | null;
  repositoryUrl: string | null;
};

export type DemoEnvironmentView = {
  id: string;
  tenantSlug: string;
  productSlug: string;
  productName: string;
  demoUrl: string | null;
  expiresAt: string;
  isClean: boolean;
};

export type SaasCatalog = {
  products: SaasProductView[];
  demos: DemoEnvironmentView[];
  totals: {
    activeProducts: number;
    demos: number;
    activeClients: number;
  };
  source: DataSource;
};

function addDays(days: number) {
  const date = new Date();
  date.setDate(date.getDate() + days);

  return date.toISOString();
}

function getMockCatalog(): SaasCatalog {
  const products: SaasProductView[] = [
    {
      id: "mock-bcmodas",
      slug: "bcmodas",
      name: "BCModas",
      description:
        "Do pedido à expedição: controle produção, fichas técnicas, estoque, estamparia e financeiro em uma única plataforma.",
      status: "ACTIVE",
      demoUrl: "https://bcmodas.britoscode.tech",
      repositoryUrl: "https://github.com/JosemarBritoDev/BCModas",
    },
    {
      id: "mock-bc-health",
      slug: "bc-health",
      name: "BC Health",
      description:
        "Agenda, prontuário eletrônico, faturamento e indicadores clínicos com conformidade LGPD e multi-unidade.",
      status: "ACTIVE",
      demoUrl: "https://bchealth.britoscode.tech",
      repositoryUrl: "https://github.com/JosemarBritoDev/BCHealth",
    },
    {
      id: "mock-bctech-core",
      slug: "bctech-core",
      name: "BCTech Core",
      description:
        "Núcleo do ecossistema BritosCode: identidade, tenants, assinaturas, suporte e ambientes de demonstração.",
      status: "BETA",
      demoUrl: "https://bctech.britoscode.tech",
      repositoryUrl: "https://github.com/JosemarBritoDev/BCTech",
    },
  ];

  const demos: DemoEnvironmentView[] = [
    {
      id: "mock-demo-bc-health",
      tenantSlug: "vida-plena-demo",
      productSlug: "bc-health",
      productName: "BC Health",
      demoUrl: "https://bchealth.britoscode.tech",
      expiresAt: addDays(14),
      isClean: true,
    },
    {
      id: "mock-demo-bcmodas",
      tenantSlug: "atelie-aurora-demo",
      productSlug: "bcmodas",
      productName: "BCModas",
      demoUrl: "https://bcmodas.britoscode.tech",
      expiresAt: addDays(9),
      isClean: true,
    },
    {
      id: "mock-demo-core",
      tenantSlug: "bctech-demo",
      productSlug: "bctech-core",
      productName: "BCTech Core",
      demoUrl: "https://bctech.britoscode.tech",
      expiresAt: addDays(21),
      isClean: false,
    },
  ];

  return {
    products,
    demos,
    totals: {
      activeProducts: products.length,
      demos: demos.length,
      activeClients: 128,
    },
    source: "mock",
  };
}

export async function getSaasCatalog(): Promise<SaasCatalog> {
  const catalog = await queryDatabase(async (prisma) => {
    const [products, demos, activeClients] = await Promise.all([
      prisma.saasProduct.findMany({
        where: { status: { in: ["ACTIVE", "BETA"] } },
        orderBy: { createdAt: "asc" },
        select: {
          id: true,
          slug: true,
          name: true,
          description: true,
          status: true,
          demoUrl: true,
          repositoryUrl: true,
        },
      }),
      prisma.demoSandbox.findMany({
        where: { expiresAt: { gt: new Date() } },
        orderBy: { expiresAt: "asc" },
        select: {
          id: true,
          tenantSlug: true,
          expiresAt: true,
          isClean: true,
          saasProduct: {
            select: {
              slug: true,
              name: true,
              demoUrl: true,
            },
          },
        },
      }),
      prisma.tenant.count({
        where: { subscriptions: { some: { status: "ACTIVE" } } },
      }),
    ]);

    return {
      products,
      demos: demos.map((demo) => ({
        id: demo.id,
        tenantSlug: demo.tenantSlug,
        productSlug: demo.saasProduct.slug,
        productName: demo.saasProduct.name,
        demoUrl: demo.saasProduct.demoUrl,
        expiresAt: demo.expiresAt.toISOString(),
        isClean: demo.isClean,
      })),
      totals: {
        activeProducts: products.length,
        demos: demos.length,
        activeClients,
      },
      source: "database" as const,
    };
  });

  return catalog ?? getMockCatalog();
}
