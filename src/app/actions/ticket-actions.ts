"use server";

import { revalidatePath } from "next/cache";

import type { DataSource } from "@/app/actions/saas-actions";
import { queryDatabase } from "@/lib/prisma";

export type TicketPriorityValue = "LOW" | "MEDIUM" | "HIGH";
export type TicketStatusValue = "OPEN" | "IN_PROGRESS" | "RESOLVED";

export type TicketView = {
  id: string;
  protocol: string;
  title: string;
  description: string;
  status: TicketStatusValue;
  priority: TicketPriorityValue;
  tenantName: string;
  productName: string;
  createdAt: string;
};

export type CreateTicketInput = {
  product: string;
  priority: TicketPriorityValue;
  title: string;
  description: string;
};

export type CreateTicketResult =
  | { ok: true; ticket: TicketView; source: DataSource }
  | { ok: false; error: string };

export type TicketListResult = {
  tickets: TicketView[];
  openCount: number;
  inProgressCount: number;
  resolvedCount: number;
  source: DataSource;
};

const validPriorities: TicketPriorityValue[] = ["LOW", "MEDIUM", "HIGH"];

const productSlugByName: Record<string, string> = {
  "bc health": "bc-health",
  bcmodas: "bcmodas",
  "bctech core": "bctech-core",
  "material checkout": "material-checkout",
};

const productNameBySlug: Record<string, string> = {
  "bc-health": "BC Health",
  bcmodas: "BCModas",
  "bctech-core": "BCTech Core",
  "material-checkout": "Material Checkout",
};

function toProtocol(id: string) {
  const normalized = id.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();

  return `SUP-${normalized.slice(-6)}`;
}

function resolveProductSlug(product: string) {
  const normalized = product.trim().toLowerCase();

  return productSlugByName[normalized] ?? normalized;
}

function resolveProductName(product: string) {
  const slug = resolveProductSlug(product);

  return productNameBySlug[slug] ?? product.trim();
}

function mapTicket(ticket: {
  id: string;
  title: string;
  description: string;
  status: TicketStatusValue;
  priority: TicketPriorityValue;
  createdAt: Date;
  tenant: { name: string };
  saasProduct: { name: string };
}): TicketView {
  return {
    id: ticket.id,
    protocol: toProtocol(ticket.id),
    title: ticket.title,
    description: ticket.description,
    status: ticket.status,
    priority: ticket.priority,
    tenantName: ticket.tenant.name,
    productName: ticket.saasProduct.name,
    createdAt: ticket.createdAt.toISOString(),
  };
}

function countTickets(tickets: TicketView[]) {
  return tickets.reduce(
    (counts, ticket) => {
      if (ticket.status === "OPEN") {
        counts.openCount += 1;
      } else if (ticket.status === "IN_PROGRESS") {
        counts.inProgressCount += 1;
      } else {
        counts.resolvedCount += 1;
      }

      return counts;
    },
    { openCount: 0, inProgressCount: 0, resolvedCount: 0 },
  );
}

function getMockTickets(): TicketView[] {
  return [
    {
      id: "seed-ticket-vida-plena-001",
      protocol: toProtocol("seed-ticket-vida-plena-001"),
      title: "Erro ao emitir relatório de atendimentos",
      description:
        "O relatório mensal de atendimentos retorna erro 500 ao filtrar por convênio.",
      status: "IN_PROGRESS",
      priority: "HIGH",
      tenantName: "Clínica Vida Plena",
      productName: "BC Health",
      createdAt: "2026-11-06T13:20:00.000Z",
    },
    {
      id: "seed-ticket-aurora-001",
      protocol: toProtocol("seed-ticket-aurora-001"),
      title: "Dúvida sobre ficha técnica de estamparia",
      description:
        "Precisamos adicionar campos personalizados na ficha técnica de estamparia.",
      status: "OPEN",
      priority: "MEDIUM",
      tenantName: "Ateliê Aurora",
      productName: "BCModas",
      createdAt: "2026-11-05T09:45:00.000Z",
    },
    {
      id: "seed-ticket-bem-estar-001",
      protocol: toProtocol("seed-ticket-bem-estar-001"),
      title: "Segunda via de cobrança",
      description:
        "Solicitamos a segunda via da fatura em atraso para regularização do contrato.",
      status: "OPEN",
      priority: "HIGH",
      tenantName: "Rede Bem-Estar",
      productName: "BCTech Core",
      createdAt: "2026-11-04T16:10:00.000Z",
    },
  ];
}

function getMockTicketList(): TicketListResult {
  const tickets = getMockTickets();

  return {
    tickets,
    ...countTickets(tickets),
    source: "mock",
  };
}

function createMockTicket(input: CreateTicketInput): TicketView {
  const id = `mock-${Date.now().toString(36)}`;

  return {
    id,
    protocol: toProtocol(id),
    title: input.title.trim(),
    description: input.description.trim(),
    status: "OPEN",
    priority: input.priority,
    tenantName: "Clínica Vida Plena (demo)",
    productName: resolveProductName(input.product),
    createdAt: new Date().toISOString(),
  };
}

export async function createTicket(
  input: CreateTicketInput,
): Promise<CreateTicketResult> {
  const title = input.title?.trim() ?? "";
  const description = input.description?.trim() ?? "";

  if (title.length < 3) {
    return {
      ok: false,
      error: "Informe um assunto com pelo menos 3 caracteres.",
    };
  }

  if (description.length < 10) {
    return {
      ok: false,
      error: "Descreva o problema com pelo menos 10 caracteres.",
    };
  }

  if (!validPriorities.includes(input.priority)) {
    return { ok: false, error: "Prioridade inválida." };
  }

  const result = await queryDatabase(async (prisma) => {
    const product = await prisma.saasProduct.findFirst({
      where: {
        OR: [
          { slug: resolveProductSlug(input.product) },
          { name: { equals: input.product.trim(), mode: "insensitive" } },
        ],
      },
      select: { id: true },
    });

    if (!product) {
      return {
        kind: "error" as const,
        message:
          "Produto não encontrado no catálogo. Selecione um SaaS disponível.",
      };
    }

    const tenant =
      (await prisma.tenant.findFirst({
        where: { document: "12.345.678/0001-90" },
        select: { id: true },
      })) ??
      (await prisma.tenant.findFirst({
        orderBy: { createdAt: "asc" },
        select: { id: true },
      }));

    if (!tenant) {
      return {
        kind: "error" as const,
        message:
          "Nenhum tenant cadastrado para receber o chamado. Execute o seed do banco.",
      };
    }

    const ticket = await prisma.ticket.create({
      data: {
        tenantId: tenant.id,
        saasProductId: product.id,
        title,
        description,
        priority: input.priority,
      },
      include: {
        tenant: { select: { name: true } },
        saasProduct: { select: { name: true } },
      },
    });

    return { kind: "created" as const, ticket: mapTicket(ticket) };
  });

  if (!result) {
    return {
      ok: true,
      ticket: createMockTicket({ ...input, title, description }),
      source: "mock",
    };
  }

  if (result.kind === "error") {
    return { ok: false, error: result.message };
  }

  revalidatePath("/portal");

  return { ok: true, ticket: result.ticket, source: "database" };
}

export async function listTickets(): Promise<TicketListResult> {
  const result = await queryDatabase(async (prisma) => {
    const [tickets, openCount, inProgressCount, resolvedCount] =
      await Promise.all([
        prisma.ticket.findMany({
          take: 20,
          orderBy: { createdAt: "desc" },
          include: {
            tenant: { select: { name: true } },
            saasProduct: { select: { name: true } },
          },
        }),
        prisma.ticket.count({ where: { status: "OPEN" } }),
        prisma.ticket.count({ where: { status: "IN_PROGRESS" } }),
        prisma.ticket.count({ where: { status: "RESOLVED" } }),
      ]);

    return {
      tickets: tickets.map(mapTicket),
      openCount,
      inProgressCount,
      resolvedCount,
      source: "database" as const,
    };
  });

  return result ?? getMockTicketList();
}
