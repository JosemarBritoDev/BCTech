import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowUpRight,
  Boxes,
  CircleAlert,
  CircleCheck,
  Clock,
  CreditCard,
  Download,
  ExternalLink,
  Gauge,
  HeartPulse,
  LayoutDashboard,
  LifeBuoy,
  Mail,
  MessageCircle,
  Package,
  Receipt,
  Shirt,
  ShoppingCart,
  Wallet,
} from "lucide-react";

import {
  getSaasCatalog,
  type SaasProductView,
} from "@/app/actions/saas-actions";
import {
  listTickets,
  type TicketPriorityValue,
  type TicketStatusValue,
} from "@/app/actions/ticket-actions";
import { DashboardShell, type DashboardNavItem } from "@/components/dashboard-shell";
import { StatusBadge, type StatusTone } from "@/components/status-badge";
import { TicketForm } from "@/components/ticket-form";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Portal do Cliente",
  description:
    "Área do cliente BCTech: SaaS contratados, faturas, segunda via e suporte.",
  robots: { index: false, follow: false },
};

const nav: DashboardNavItem[] = [
  { label: "Visão geral", href: "#top", icon: LayoutDashboard, active: true },
  { label: "Meus SaaS", href: "#saas", icon: Package },
  { label: "Faturas", href: "#faturas", icon: Receipt },
  { label: "Suporte", href: "#suporte", icon: LifeBuoy },
];

const productIcons: Record<string, typeof HeartPulse> = {
  "bc-health": HeartPulse,
  bcmodas: Shirt,
  "bctech-core": Boxes,
  "material-checkout": ShoppingCart,
};

const portalPlans: Record<string, string> = {
  "bc-health": "Growth · Clínica",
  bcmodas: "Pro · Varejo",
  "bctech-core": "Core · Incluído no plano",
  "material-checkout": "Beta · Lista de espera",
};

const productStatusMeta: Record<
  SaasProductView["status"],
  { label: string; tone: StatusTone }
> = {
  ACTIVE: { label: "Ativo", tone: "accent" },
  BETA: { label: "Beta", tone: "brand" },
  DEMO: { label: "Demo", tone: "brand" },
};

const ticketStatusMeta: Record<
  TicketStatusValue,
  { label: string; tone: StatusTone }
> = {
  OPEN: { label: "Aberto", tone: "amber" },
  IN_PROGRESS: { label: "Em andamento", tone: "brand" },
  RESOLVED: { label: "Resolvido", tone: "accent" },
};

const priorityMeta: Record<
  TicketPriorityValue,
  { label: string; tone: StatusTone }
> = {
  LOW: { label: "Baixa", tone: "zinc" },
  MEDIUM: { label: "Média", tone: "brand" },
  HIGH: { label: "Alta", tone: "red" },
};

const billingSummary = [
  {
    label: "Plano atual",
    value: "Growth",
    hint: "R$ 489,00 / mês",
    icon: Wallet,
    badge: { label: "Ativo", tone: "accent" as StatusTone },
  },
  {
    label: "Próxima fatura",
    value: "R$ 489,00",
    hint: "Vence em 10/11/2026",
    icon: CreditCard,
    badge: { label: "Em aberto", tone: "amber" as StatusTone },
  },
];

type Invoice = {
  id: string;
  period: string;
  due: string;
  amount: string;
  status: string;
  tone: StatusTone;
};

const invoices: Invoice[] = [
  {
    id: "2026-012",
    period: "Novembro/2026",
    due: "10/11/2026",
    amount: "R$ 489,00",
    status: "Em aberto",
    tone: "amber",
  },
  {
    id: "2026-011",
    period: "Outubro/2026",
    due: "10/10/2026",
    amount: "R$ 489,00",
    status: "Paga",
    tone: "accent",
  },
  {
    id: "2026-010",
    period: "Setembro/2026",
    due: "10/09/2026",
    amount: "R$ 489,00",
    status: "Paga",
    tone: "accent",
  },
  {
    id: "2026-009",
    period: "Agosto/2026",
    due: "10/08/2026",
    amount: "R$ 489,00",
    status: "Paga",
    tone: "accent",
  },
];

const channels = [
  {
    icon: MessageCircle,
    label: "WhatsApp",
    value: "(11) 99999-9999",
    hint: "Seg–Sex, 9h às 18h",
    href: "https://wa.me/5511999999999",
  },
  {
    icon: Mail,
    label: "E-mail",
    value: "suporte@britoscode.tech",
    hint: "Resposta em até 4h úteis",
    href: "mailto:suporte@britoscode.tech",
  },
  {
    icon: Clock,
    label: "SLA contratado",
    value: "4 horas úteis",
    hint: "Incidentes críticos: 1h",
    href: "https://status.britoscode.tech",
  },
];

export default async function PortalPage() {
  const [catalog, ticketList] = await Promise.all([
    getSaasCatalog(),
    listTickets(),
  ]);

  const saasProducts = catalog.products.map((product) => {
    const meta = productStatusMeta[product.status];

    return {
      name: product.name,
      description: product.description,
      icon: productIcons[product.slug] ?? Boxes,
      plan: portalPlans[product.slug] ?? "Plano BritosCode",
      status: meta.label,
      tone: meta.tone,
      url: product.demoUrl ?? "#suporte",
      lastAccess: product.demoUrl
        ? "Ambiente disponível"
        : "Fale com o suporte",
    };
  });

  const summary = [
    ...billingSummary,
    {
      label: "Chamados abertos",
      value: String(ticketList.openCount),
      hint:
        ticketList.inProgressCount > 0
          ? `${ticketList.inProgressCount} em andamento · SLA de 4h úteis`
          : "SLA de 4h úteis",
      icon: LifeBuoy,
      badge:
        ticketList.openCount > 0
          ? { label: "Ação necessária", tone: "amber" as StatusTone }
          : { label: "Em dia", tone: "accent" as StatusTone },
    },
  ];

  return (
    <DashboardShell
      user={{
        name: "Dra. Marina Costa",
        role: "Administradora · Clínica Vida Plena",
        initials: "MC",
      }}
      nav={nav}
      title="Portal do Cliente"
      subtitle="Clínica Vida Plena · Tenant #T-0042"
      badge="Demo"
    >
      <div className="mx-auto max-w-6xl space-y-8">
        {/* Saudação */}
        <section className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm text-brand">Bem-vinda de volta</p>
            <h2 className="mt-1 text-2xl font-semibold tracking-tight text-zinc-50 sm:text-3xl">
              Olá, Dra. Marina 👋
            </h2>
            <p className="mt-1 text-sm text-zinc-400">
              Acompanhe seus produtos, faturas e chamados em um só lugar.
            </p>
          </div>
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-zinc-800 bg-surface px-3 py-1.5 text-[11px] text-zinc-400">
            <Gauge className="size-3.5 text-accent" aria-hidden="true" />
            {catalog.source === "database"
              ? "Dados sincronizados via Prisma"
              : "Dados de demonstração · banco indisponível"}
          </span>
        </section>

        {/* Resumo */}
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {summary.map((card) => {
            const Icon = card.icon;

            return (
              <article
                key={card.label}
                className="rounded-2xl border border-zinc-800 bg-surface p-5 transition-colors hover:border-brand/40"
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="grid size-10 place-items-center rounded-xl border border-zinc-800 bg-surface-elevated text-brand">
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <StatusBadge label={card.badge.label} tone={card.badge.tone} />
                </div>
                <p className="mt-4 text-xs font-medium uppercase tracking-[0.16em] text-zinc-500">
                  {card.label}
                </p>
                <p className="mt-1 text-2xl font-semibold tracking-tight text-zinc-50">
                  {card.value}
                </p>
                <p className="mt-1 text-xs text-zinc-500">{card.hint}</p>
              </article>
            );
          })}
        </section>

        {/* SaaS contratados */}
        <section id="saas" className="scroll-mt-28">
          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold tracking-tight text-zinc-100">
                Meus SaaS
              </h2>
              <p className="mt-1 text-sm text-zinc-500">
                Produtos contratados e atalhos de acesso direto.
              </p>
            </div>
            <Link
              href="#faturas"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-brand transition-colors hover:text-fuchsia-300"
            >
              Gerenciar assinaturas
              <ArrowUpRight className="size-4" aria-hidden="true" />
            </Link>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {saasProducts.map((product) => {
              const Icon = product.icon;

              return (
                <article
                  key={product.name}
                  className="group relative overflow-hidden rounded-2xl border border-zinc-800 bg-surface p-6 transition-all hover:border-brand/50"
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className="grid size-11 place-items-center rounded-xl border border-zinc-800 bg-surface-elevated text-brand">
                      <Icon className="size-5" aria-hidden="true" />
                    </span>
                    <StatusBadge label={product.status} tone={product.tone} />
                  </div>

                  <h3 className="mt-5 text-lg font-semibold text-zinc-50">
                    {product.name}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-zinc-400">
                    {product.description}
                  </p>

                  <dl className="mt-5 grid grid-cols-2 gap-3 border-t border-zinc-800/70 pt-4 text-xs">
                    <div>
                      <dt className="text-zinc-500">Plano</dt>
                      <dd className="mt-1 font-medium text-zinc-200">{product.plan}</dd>
                    </div>
                    <div>
                      <dt className="text-zinc-500">Último acesso</dt>
                      <dd className="mt-1 font-medium text-zinc-200">
                        {product.lastAccess}
                      </dd>
                    </div>
                  </dl>

                  <div className="mt-6 flex flex-col gap-2 sm:flex-row">
                    <a
                      href={product.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand/90"
                    >
                      Acessar produto
                      <ExternalLink className="size-4" aria-hidden="true" />
                    </a>
                    <Link
                      href="#suporte"
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-800 px-4 py-2.5 text-sm font-medium text-zinc-300 transition-colors hover:border-brand/40 hover:text-brand"
                    >
                      Suporte
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* Faturas */}
        <section id="faturas" className="scroll-mt-28">
          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold tracking-tight text-zinc-100">
                Faturas recentes
              </h2>
              <p className="mt-1 text-sm text-zinc-500">
                Histórico de cobranças e download da 2ª via.
              </p>
            </div>
            <Link
              href="#faturas"
              className="inline-flex w-fit items-center gap-2 rounded-xl border border-zinc-800 bg-surface px-3.5 py-2 text-sm font-medium text-zinc-200 transition-colors hover:border-brand/40 hover:text-brand"
            >
              <CreditCard className="size-4" aria-hidden="true" />
              Central de cobranças
            </Link>
          </div>

          <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-surface">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[680px] text-left text-sm">
                <caption className="sr-only">
                  Faturas recentes da Clínica Vida Plena
                </caption>
                <thead className="border-b border-zinc-800 bg-surface-elevated/60 text-xs uppercase tracking-[0.14em] text-zinc-500">
                  <tr>
                    <th scope="col" className="px-5 py-3 font-medium">
                      Fatura
                    </th>
                    <th scope="col" className="px-5 py-3 font-medium">
                      Competência
                    </th>
                    <th scope="col" className="px-5 py-3 font-medium">
                      Vencimento
                    </th>
                    <th scope="col" className="px-5 py-3 font-medium">
                      Valor
                    </th>
                    <th scope="col" className="px-5 py-3 font-medium">
                      Status
                    </th>
                    <th scope="col" className="px-5 py-3 text-right font-medium">
                      Ação
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/70">
                  {invoices.map((invoice) => (
                    <tr
                      key={invoice.id}
                      className="transition-colors hover:bg-surface-elevated/40"
                    >
                      <td className="px-5 py-4 font-mono text-xs text-zinc-300">
                        #{invoice.id}
                      </td>
                      <td className="px-5 py-4 text-zinc-300">{invoice.period}</td>
                      <td className="px-5 py-4 text-zinc-400">{invoice.due}</td>
                      <td className="px-5 py-4 font-medium text-zinc-100">
                        {invoice.amount}
                      </td>
                      <td className="px-5 py-4">
                        <StatusBadge label={invoice.status} tone={invoice.tone} />
                      </td>
                      <td className="px-5 py-4 text-right">
                        <a
                          href="#faturas"
                          className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-800 px-2.5 py-1.5 text-xs font-medium text-zinc-300 transition-colors hover:border-brand/40 hover:text-brand"
                        >
                          <Download className="size-3.5" aria-hidden="true" />
                          2ª via
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex flex-col gap-2 border-t border-zinc-800/70 px-5 py-4 text-xs text-zinc-500 sm:flex-row sm:items-center sm:justify-between">
              <span className="inline-flex items-center gap-1.5">
                <CircleAlert className="size-3.5 text-amber-300" aria-hidden="true" />
                A fatura #2026-012 vence em 10/11/2026.
              </span>
              <span className="inline-flex items-center gap-1.5">
                <CircleCheck className="size-3.5 text-accent" aria-hidden="true" />
                Pagamentos processados via Asaas.
              </span>
            </div>
          </div>
        </section>

        {/* Suporte */}
        <section id="suporte" className="scroll-mt-28">
          <div className="mb-4">
            <h2 className="text-lg font-semibold tracking-tight text-zinc-100">
              Central de suporte
            </h2>
            <p className="mt-1 text-sm text-zinc-500">
              Abra um chamado rápido ou fale com a equipe pelos canais oficiais.
            </p>
          </div>

          <div className="grid gap-4 lg:grid-cols-[1.35fr_0.65fr]">
            <div className="rounded-2xl border border-zinc-800 bg-surface p-6">
              <div className="mb-5 flex items-center gap-2">
                <span className="grid size-9 place-items-center rounded-lg bg-brand/10 text-brand">
                  <LifeBuoy className="size-4.5" aria-hidden="true" />
                </span>
                <div>
                  <h3 className="text-sm font-semibold text-zinc-100">
                    Abertura de chamado
                  </h3>
                  <p className="text-xs text-zinc-500">
                    Priorize e descreva o problema da sua operação.
                  </p>
                </div>
              </div>
              <TicketForm />
            </div>

            <div className="rounded-2xl border border-zinc-800 bg-surface p-6">
              <h3 className="text-sm font-semibold text-zinc-100">
                Canais de atendimento
              </h3>
              <p className="mt-1 text-xs text-zinc-500">
                Atendimento humano, sem robôs de triagem.
              </p>

              <ul className="mt-5 space-y-3">
                {channels.map((channel) => {
                  const Icon = channel.icon;

                  return (
                    <li key={channel.label}>
                      <a
                        href={channel.href}
                        target={channel.href.startsWith("http") ? "_blank" : undefined}
                        rel={channel.href.startsWith("http") ? "noreferrer" : undefined}
                        className="group flex items-start gap-3 rounded-xl border border-zinc-800/80 bg-background/40 p-3 transition-colors hover:border-brand/40"
                      >
                        <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-brand/10 text-brand">
                          <Icon className="size-4" aria-hidden="true" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block text-xs text-zinc-500">
                            {channel.label}
                          </span>
                          <span className="block truncate text-sm font-medium text-zinc-200">
                            {channel.value}
                          </span>
                          <span className="block text-[11px] text-zinc-500">
                            {channel.hint}
                          </span>
                        </span>
                      </a>
                    </li>
                  );
                })}
              </ul>

              <a
                href="https://status.britoscode.tech"
                target="_blank"
                rel="noreferrer"
                className="mt-5 inline-flex items-center gap-1.5 text-xs font-medium text-accent transition-colors hover:text-emerald-300"
              >
                Ver status dos sistemas
                <ArrowUpRight className="size-3.5" aria-hidden="true" />
              </a>
            </div>
          </div>

          <div className="mt-4 overflow-hidden rounded-2xl border border-zinc-800 bg-surface">
            <div className="flex flex-col gap-2 border-b border-zinc-800 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-sm font-semibold text-zinc-100">
                  Chamados recentes
                </h3>
                <p className="mt-0.5 text-xs text-zinc-500">
                  Histórico consultado na tabela Ticket via Prisma.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2 text-[11px] text-zinc-500">
                <span className="rounded-full border border-amber-400/25 bg-amber-400/5 px-2.5 py-1 text-amber-300">
                  {ticketList.openCount} abertos
                </span>
                <span className="rounded-full border border-brand/25 bg-brand/5 px-2.5 py-1 text-brand">
                  {ticketList.inProgressCount} em andamento
                </span>
                <span className="rounded-full border border-accent/25 bg-accent/5 px-2.5 py-1 text-accent">
                  {ticketList.resolvedCount} resolvidos
                </span>
              </div>
            </div>

            {ticketList.tickets.length > 0 ? (
              <ul className="divide-y divide-zinc-800/70">
                {ticketList.tickets.slice(0, 6).map((ticket) => {
                  const status = ticketStatusMeta[ticket.status];
                  const priority = priorityMeta[ticket.priority];

                  return (
                    <li
                      key={ticket.id}
                      className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-zinc-100">
                          {ticket.title}
                        </p>
                        <p className="mt-1 truncate text-xs text-zinc-500">
                          {ticket.productName} · {ticket.tenantName} ·{" "}
                          <span className="font-mono">{ticket.protocol}</span> ·{" "}
                          {formatDate(ticket.createdAt, {
                            day: "2-digit",
                            month: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                      <div className="flex shrink-0 flex-wrap items-center gap-2">
                        <StatusBadge label={priority.label} tone={priority.tone} />
                        <StatusBadge label={status.label} tone={status.tone} />
                      </div>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="px-5 py-6 text-sm text-zinc-500">
                Nenhum chamado registrado ainda.
              </p>
            )}
          </div>
        </section>
      </div>
    </DashboardShell>
  );
}
