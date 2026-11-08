"use server";

import type { DataSource } from "@/app/actions/saas-actions";
import { queryDatabase } from "@/lib/prisma";

export type AdminBillingStatus =
  | "ACTIVE"
  | "OVERDUE"
  | "INACTIVE"
  | "CANCELLED"
  | "TRIAL"
  | "NONE";

export type AdminTenantRow = {
  id: string;
  name: string;
  document: string;
  products: string[];
  plan: string;
  mrr: number;
  status: AdminBillingStatus;
};

export type AdminMetrics = {
  mrrTotal: number;
  activeSubscriptions: number;
  totalClients: number;
  activeClients: number;
  overdueClients: number;
  openTickets: number;
  highPriorityTickets: number;
};

export type AdminSnapshot = {
  metrics: AdminMetrics;
  tenants: AdminTenantRow[];
  source: DataSource;
};

function getMockAdminSnapshot(): AdminSnapshot {
  const tenants: AdminTenantRow[] = [
    {
      id: "mock-vida-plena",
      name: "Clínica Vida Plena",
      document: "12.345.678/0001-90",
      products: ["BC Health"],
      plan: "Growth",
      mrr: 489,
      status: "ACTIVE",
    },
    {
      id: "mock-atelie-aurora",
      name: "Ateliê Aurora",
      document: "98.765.432/0001-10",
      products: ["BCModas"],
      plan: "Pro",
      mrr: 349,
      status: "ACTIVE",
    },
    {
      id: "mock-rede-bem-estar",
      name: "Rede Bem-Estar",
      document: "45.678.901/0001-23",
      products: ["BC Health", "BCTech Core"],
      plan: "Enterprise",
      mrr: 1290,
      status: "OVERDUE",
    },
    {
      id: "mock-monte-carlo",
      name: "Confecção Monte Carlo",
      document: "31.222.333/0001-44",
      products: ["BCModas"],
      plan: "Starter",
      mrr: 199,
      status: "TRIAL",
    },
    {
      id: "mock-studio-hera",
      name: "Studio Hera",
      document: "55.444.333/0001-22",
      products: ["BCModas"],
      plan: "Pro",
      mrr: 0,
      status: "CANCELLED",
    },
  ];

  return {
    metrics: {
      mrrTotal: 42890,
      activeSubscriptions: 128,
      totalClients: 128,
      activeClients: 124,
      overdueClients: 3,
      openTickets: 14,
      highPriorityTickets: 5,
    },
    tenants,
    source: "mock",
  };
}

export async function getAdminSnapshot(): Promise<AdminSnapshot> {
  const snapshot = await queryDatabase(async (prisma) => {
    const [
      mrrAggregate,
      activeSubscriptions,
      totalClients,
      activeClients,
      overdueClients,
      openTickets,
      highPriorityTickets,
      tenantRecords,
    ] = await Promise.all([
      prisma.subscription.aggregate({
        where: { status: "ACTIVE" },
        _sum: { amount: true },
      }),
      prisma.subscription.count({ where: { status: "ACTIVE" } }),
      prisma.tenant.count(),
      prisma.tenant.count({
        where: { subscriptions: { some: { status: "ACTIVE" } } },
      }),
      prisma.tenant.count({
        where: { subscriptions: { some: { status: "OVERDUE" } } },
      }),
      prisma.ticket.count({
        where: { status: { in: ["OPEN", "IN_PROGRESS"] } },
      }),
      prisma.ticket.count({
        where: {
          status: { in: ["OPEN", "IN_PROGRESS"] },
          priority: "HIGH",
        },
      }),
      prisma.tenant.findMany({
        take: 10,
        orderBy: { createdAt: "asc" },
        select: {
          id: true,
          name: true,
          document: true,
          subscriptions: {
            select: {
              status: true,
              planName: true,
              amount: true,
              saasProduct: { select: { name: true } },
            },
          },
        },
      }),
    ]);

    const tenants: AdminTenantRow[] = tenantRecords.map((tenant) => {
      const activeSubscriptionsByTenant = tenant.subscriptions.filter(
        (subscription) => subscription.status === "ACTIVE",
      );

      let status: AdminBillingStatus = "NONE";

      if (
        tenant.subscriptions.some(
          (subscription) => subscription.status === "OVERDUE",
        )
      ) {
        status = "OVERDUE";
      } else if (activeSubscriptionsByTenant.length > 0) {
        status = "ACTIVE";
      } else if (
        tenant.subscriptions.some(
          (subscription) => subscription.status === "CANCELLED",
        )
      ) {
        status = "CANCELLED";
      } else if (tenant.subscriptions.length > 0) {
        status = "INACTIVE";
      }

      const primarySubscription =
        activeSubscriptionsByTenant[0] ??
        tenant.subscriptions.find(
          (subscription) => subscription.status === "OVERDUE",
        ) ??
        tenant.subscriptions[0];

      return {
        id: tenant.id,
        name: tenant.name,
        document: tenant.document,
        products: [
          ...new Set(
            tenant.subscriptions.map(
              (subscription) => subscription.saasProduct.name,
            ),
          ),
        ],
        plan: primarySubscription?.planName ?? "Sem plano",
        mrr: activeSubscriptionsByTenant.reduce(
          (total, subscription) => total + Number(subscription.amount),
          0,
        ),
        status,
      };
    });

    return {
      metrics: {
        mrrTotal: Number(mrrAggregate._sum.amount ?? 0),
        activeSubscriptions,
        totalClients,
        activeClients,
        overdueClients,
        openTickets,
        highPriorityTickets,
      },
      tenants,
      source: "database" as const,
    };
  });

  return snapshot ?? getMockAdminSnapshot();
}
