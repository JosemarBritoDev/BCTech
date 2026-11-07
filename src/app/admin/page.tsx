import type { Metadata } from "next";
import Link from "next/link";
import {
  Activity,
  ArrowUpRight,
  Building,
  CircleAlert,
  CircleCheck,
  CircleDollarSign,
  Container,
  Cpu,
  ExternalLink,
  Gauge,
  HardDrive,
  LayoutDashboard,
  MemoryStick,
  Server,
  Ticket,
  TrendingUp,
  Users,
  Wallet,
} from "lucide-react";

import { DashboardShell, type DashboardNavItem } from "@/components/dashboard-shell";
import { StatusBadge, type StatusTone } from "@/components/status-badge";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Painel Admin ERP",
  description:
    "Dashboard do fundador: MRR, clientes, instâncias em produção e saúde da infraestrutura.",
  robots: { index: false, follow: false },
};

const nav: DashboardNavItem[] = [
  { label: "Visão geral", href: "#top", icon: LayoutDashboard, active: true },
  { label: "Clientes", href: "#clientes", icon: Building },
  { label: "Infraestrutura", href: "#infra", icon: Server },
];

const metrics = [
  {
    label: "MRR Total",
    value: "R$ 42.890",
    change: "+12,4%",
    hint: "vs. mês anterior",
    icon: CircleDollarSign,
    tone: "accent" as StatusTone,
    trend: "up",
  },
  {
    label: "Clientes ativos",
    value: "128",
    change: "+8",
    hint: "novos este mês",
    icon: Users,
    tone: "accent" as StatusTone,
    trend: "up",
  },
  {
    label: "Instâncias em produção",
    value: "37",
    change: "+3",
    hint: "containers ativos",
    icon: Server,
    tone: "accent" as StatusTone,
    trend: "up",
  },
  {
    label: "Chamados abertos",
    value: "14",
    change: "5 de alta prioridade",
    hint: "SLA médio de 3h12",
    icon: Ticket,
    tone: "amber" as StatusTone,
    trend: "flat",
  },
];

const revenue = [
  { month: "Dez", value: 44 },
  { month: "Jan", value: 48 },
  { month: "Fev", value: 47 },
  { month: "Mar", value: 53 },
  { month: "Abr", value: 58 },
  { month: "Mai", value: 57 },
  { month: "Jun", value: 63 },
  { month: "Jul", value: 67 },
  { month: "Ago", value: 72 },
  { month: "Set", value: 74 },
  { month: "Out", value: 81 },
  { month: "Nov", value: 88 },
];

const goals = [
  { label: "MRR até R$ 50 mil", current: "R$ 42.890", percent: 86, tone: "brand" },
  { label: "20 novos clientes", current: "13 / 20", percent: 65, tone: "accent" },
  { label: "Churn abaixo de 2%", current: "1,4%", percent: 93, tone: "accent" },
];

const tenants = [
  {
    name: "Clínica Vida Plena",
    segment: "Clínica",
    products: ["BC Health"],
    plan: "Growth",
    mrr: "R$ 489",
    status: "Ativo",
    tone: "accent" as StatusTone,
  },
  {
    name: "Ateliê Aurora",
    segment: "Moda",
    products: ["BCModas"],
    plan: "Pro",
    mrr: "R$ 349",
    status: "Ativo",
    tone: "accent" as StatusTone,
  },
  {
    name: "Rede Bem-Estar",
    segment: "Clínica",
    products: ["BC Health", "BCTech Core"],
    plan: "Enterprise",
    mrr: "R$ 1.290",
    status: "Inadimplente",
    tone: "red" as StatusTone,
  },
  {
    name: "Confecção Monte Carlo",
    segment: "Confecção",
    products: ["BCModas"],
    plan: "Starter",
    mrr: "R$ 199",
    status: "Trial",
    tone: "brand" as StatusTone,
  },
  {
    name: "Studio Hera",
    segment: "Estamparia",
    products: ["BCModas"],
    plan: "Pro",
    mrr: "R$ 349",
    status: "Cancelado",
    tone: "zinc" as StatusTone,
  },
];

const nodes = [
  {
    name: "vps-bc-prod-01",
    region: "São Paulo · BR",
    uptime: "99,99%",
    containers: 12,
    status: "Operacional",
    tone: "accent" as StatusTone,
    metrics: [
      { label: "CPU", value: 38, icon: Cpu },
      { label: "Memória", value: 62, icon: MemoryStick },
      { label: "Disco", value: 41, icon: HardDrive },
    ],
  },
  {
    name: "vps-bc-prod-02",
    region: "Frankfurt · DE",
    uptime: "99,97%",
    containers: 9,
    status: "Atenção",
    tone: "amber" as StatusTone,
    metrics: [
      { label: "CPU", value: 71, icon: Cpu },
      { label: "Memória", value: 78, icon: MemoryStick },
      { label: "Disco", value: 55, icon: HardDrive },
    ],
  },
  {
    name: "vps-bc-edge-01",
    region: "Edge · Cloudflare",
    uptime: "100%",
    containers: 4,
    status: "Operacional",
    tone: "accent" as StatusTone,
    metrics: [
      { label: "CPU", value: 12, icon: Cpu },
      { label: "Memória", value: 24, icon: MemoryStick },
      { label: "Disco", value: 18, icon: HardDrive },
    ],
  },
];

const containers = [
  { name: "bctech-web", image: "bctech:latest", uptime: "12d 4h", status: "Running" },
  { name: "bcmodas-app", image: "bcmodas:2.4.1", uptime: "34d 9h", status: "Running" },
  { name: "bchealth-app", image: "bchealth:1.9.0", uptime: "8d 2h", status: "Running" },
  { name: "postgres-primary", image: "supabase/postgres:15", uptime: "61d 11h", status: "Running" },
  { name: "nginx-edge", image: "nginx:alpine", uptime: "12d 4h", status: "Running" },
  { name: "worker-billing", image: "bctech-worker:1.2.0", uptime: "3d 6h", status: "Restarting" },
];

function barColor(value: number) {
  return value >= 80 ? "bg-amber-400" : "bg-accent";
}

export default function AdminPage() {
  return (
    <DashboardShell
      user={{
        name: "Josemar Brito",
        role: "Fundador · BritosCode.tech",
        initials: "JB",
      }}
      nav={nav}
      title="Painel Admin ERP"
      subtitle="Visão do negócio · BritosCode HQ"
      badge="Founder"
    >
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Cabeçalho */}
        <section className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm text-brand">Centro de comando</p>
            <h2 className="mt-1 text-2xl font-semibold tracking-tight text-zinc-50 sm:text-3xl">
              Visão do negócio
            </h2>
            <p className="mt-1 text-sm text-zinc-400">
              Receita, clientes e saúde operacional do ecossistema em tempo real.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-surface px-3 py-1.5 text-xs text-zinc-400">
              <Activity className="size-3.5 text-accent" aria-hidden="true" />
              Atualizado há 2 min
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-surface px-3 py-1.5 text-xs text-zinc-400">
              Últimos 30 dias
            </span>
          </div>
        </section>

        {/* Métricas */}
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {metrics.map((metric) => {
            const Icon = metric.icon;

            return (
              <article
                key={metric.label}
                className="group rounded-2xl border border-zinc-800 bg-surface p-5 transition-colors hover:border-brand/40"
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="grid size-10 place-items-center rounded-xl border border-zinc-800 bg-surface-elevated text-brand">
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <span
                    className={cn(
                      "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium",
                      metric.trend === "up"
                        ? "border-accent/30 bg-accent/10 text-accent"
                        : "border-amber-400/30 bg-amber-400/10 text-amber-300",
                    )}
                  >
                    {metric.trend === "up" ? (
                      <ArrowUpRight className="size-3" aria-hidden="true" />
                    ) : (
                      <CircleAlert className="size-3" aria-hidden="true" />
                    )}
                    {metric.change}
                  </span>
                </div>
                <p className="mt-4 text-xs font-medium uppercase tracking-[0.16em] text-zinc-500">
                  {metric.label}
                </p>
                <p className="mt-1 text-2xl font-semibold tracking-tight text-zinc-50">
                  {metric.value}
                </p>
                <p className="mt-1 text-xs text-zinc-500">{metric.hint}</p>
              </article>
            );
          })}
        </section>

        {/* Receita + metas */}
        <section className="grid gap-4 lg:grid-cols-3">
          <article className="rounded-2xl border border-zinc-800 bg-surface p-6 lg:col-span-2">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h3 className="text-sm font-semibold text-zinc-100">
                  Receita recorrente
                </h3>
                <p className="mt-1 text-xs text-zinc-500">
                  MRR dos últimos 12 meses
                </p>
              </div>
              <div className="text-left sm:text-right">
                <p className="text-2xl font-semibold tracking-tight text-zinc-50">
                  R$ 42.890
                </p>
                <p className="inline-flex items-center gap-1 text-xs font-medium text-accent">
                  <TrendingUp className="size-3.5" aria-hidden="true" />
                  +12,4% vs. outubro
                </p>
              </div>
            </div>

            <div className="mt-8">
              <div
                className="flex h-40 items-end gap-2 sm:gap-3"
                role="img"
                aria-label="Gráfico de receita recorrente mensal, em tendência de crescimento de dezembro a novembro"
              >
                {revenue.map((item, index) => (
                  <div
                    key={item.month}
                    className="flex h-full flex-1 flex-col justify-end gap-2"
                  >
                    <div
                      className={cn(
                        "w-full rounded-t-md transition-colors",
                        index === revenue.length - 1
                          ? "bg-gradient-to-t from-brand to-fuchsia-400 shadow-[0_0_20px_-4px_rgba(168,85,247,0.8)]"
                          : "bg-zinc-800 group-hover:bg-zinc-700",
                      )}
                      style={{ height: `${item.value}%` }}
                      title={`${item.month}: ${item.value}`}
                    />
                    <span className="text-center text-[10px] text-zinc-600">
                      {item.month}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </article>

          <article className="rounded-2xl border border-zinc-800 bg-surface p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-zinc-100">
                Metas do trimestre
              </h3>
              <Gauge className="size-4 text-brand" aria-hidden="true" />
            </div>
            <p className="mt-1 text-xs text-zinc-500">
              Acompanhamento Q4 · 2026
            </p>

            <ul className="mt-6 space-y-5">
              {goals.map((goal) => (
                <li key={goal.label}>
                  <div className="flex items-center justify-between gap-3 text-xs">
                    <span className="text-zinc-400">{goal.label}</span>
                    <span className="font-medium text-zinc-200">{goal.current}</span>
                  </div>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-zinc-800">
                    <div
                      className={cn(
                        "h-full rounded-full",
                        goal.tone === "brand" ? "bg-brand" : "bg-accent",
                      )}
                      style={{ width: `${goal.percent}%` }}
                    />
                  </div>
                  <p className="mt-1 text-[11px] text-zinc-600">
                    {goal.percent}% da meta
                  </p>
                </li>
              ))}
            </ul>

            <div className="mt-6 flex items-start gap-2 rounded-xl border border-accent/20 bg-accent/5 p-3 text-xs text-zinc-400">
              <CircleCheck className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden="true" />
              <span>
                Ritmo atual projeta <strong className="text-zinc-200">R$ 48,2 mil</strong>{" "}
                de MRR até dezembro.
              </span>
            </div>
          </article>
        </section>

        {/* Clientes / tenants */}
        <section id="clientes" className="scroll-mt-28">
          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold tracking-tight text-zinc-100">
                Clientes / Tenants
              </h2>
              <p className="mt-1 text-sm text-zinc-500">
                Contratos ativos, planos e produtos por cliente.
              </p>
            </div>
            <Link
              href="#clientes"
              className="inline-flex w-fit items-center gap-1.5 text-sm font-medium text-brand transition-colors hover:text-fuchsia-300"
            >
              Ver todos os 128 clientes
              <ArrowUpRight className="size-4" aria-hidden="true" />
            </Link>
          </div>

          <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-surface">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[860px] text-left text-sm">
                <caption className="sr-only">
                  Clientes e tenants do ecossistema BCTech
                </caption>
                <thead className="border-b border-zinc-800 bg-surface-elevated/60 text-xs uppercase tracking-[0.14em] text-zinc-500">
                  <tr>
                    <th scope="col" className="px-5 py-3 font-medium">
                      Cliente
                    </th>
                    <th scope="col" className="px-5 py-3 font-medium">
                      SaaS ativos
                    </th>
                    <th scope="col" className="px-5 py-3 font-medium">
                      Plano
                    </th>
                    <th scope="col" className="px-5 py-3 font-medium">
                      MRR
                    </th>
                    <th scope="col" className="px-5 py-3 font-medium">
                      Status
                    </th>
                    <th scope="col" className="px-5 py-3 text-right font-medium">
                      Detalhes
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/70">
                  {tenants.map((tenant) => (
                    <tr
                      key={tenant.name}
                      className="transition-colors hover:bg-surface-elevated/40"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <span className="grid size-9 shrink-0 place-items-center rounded-lg border border-zinc-800 bg-surface-elevated text-xs font-semibold text-brand">
                            {tenant.name
                              .split(" ")
                              .slice(0, 2)
                              .map((word) => word[0])
                              .join("")}
                          </span>
                          <div>
                            <p className="font-medium text-zinc-100">{tenant.name}</p>
                            <p className="text-xs text-zinc-500">{tenant.segment}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex flex-wrap gap-1.5">
                          {tenant.products.map((product) => (
                            <span
                              key={product}
                              className="rounded-md border border-zinc-800 bg-background/60 px-2 py-0.5 text-[11px] text-zinc-300"
                            >
                              {product}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-5 py-4 text-zinc-300">{tenant.plan}</td>
                      <td className="px-5 py-4 font-medium text-zinc-100">
                        {tenant.mrr}
                      </td>
                      <td className="px-5 py-4">
                        <StatusBadge label={tenant.status} tone={tenant.tone} />
                      </td>
                      <td className="px-5 py-4 text-right">
                        <Link
                          href="#clientes"
                          aria-label={`Detalhes de ${tenant.name}`}
                          className="inline-grid size-8 place-items-center rounded-lg border border-zinc-800 text-zinc-400 transition-colors hover:border-brand/40 hover:text-brand"
                        >
                          <ExternalLink className="size-3.5" aria-hidden="true" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex flex-col gap-2 border-t border-zinc-800/70 px-5 py-4 text-xs text-zinc-500 sm:flex-row sm:items-center sm:justify-between">
              <span>Mostrando 5 de 128 clientes</span>
              <span className="inline-flex items-center gap-1.5">
                <Wallet className="size-3.5 text-accent" aria-hidden="true" />
                Ticket médio: R$ 335,08 · Churn: 1,4%
              </span>
            </div>
          </div>
        </section>

        {/* Infraestrutura */}
        <section id="infra" className="scroll-mt-28">
          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold tracking-tight text-zinc-100">
                Saúde da infraestrutura
              </h2>
              <p className="mt-1 text-sm text-zinc-500">
                Uptime e recursos das VPSs e containers Docker.
              </p>
            </div>
            <a
              href="https://status.britoscode.tech"
              target="_blank"
              rel="noreferrer"
              className="inline-flex w-fit items-center gap-1.5 text-sm font-medium text-accent transition-colors hover:text-emerald-300"
            >
              Abrir status público
              <ArrowUpRight className="size-4" aria-hidden="true" />
            </a>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            {nodes.map((node) => (
              <article
                key={node.name}
                className={cn(
                  "rounded-2xl border bg-surface p-5 transition-colors",
                  node.tone === "amber"
                    ? "border-amber-400/30 hover:border-amber-400/50"
                    : "border-zinc-800 hover:border-accent/40",
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="grid size-10 place-items-center rounded-xl border border-zinc-800 bg-surface-elevated text-brand">
                      <Server className="size-5" aria-hidden="true" />
                    </span>
                    <div>
                      <h3 className="font-mono text-sm font-medium text-zinc-100">
                        {node.name}
                      </h3>
                      <p className="text-xs text-zinc-500">{node.region}</p>
                    </div>
                  </div>
                  <StatusBadge label={node.status} tone={node.tone} />
                </div>

                <dl className="mt-5 grid grid-cols-2 gap-3 border-y border-zinc-800/70 py-4 text-xs">
                  <div>
                    <dt className="text-zinc-500">Uptime 90d</dt>
                    <dd className="mt-1 font-semibold text-zinc-100">{node.uptime}</dd>
                  </div>
                  <div>
                    <dt className="flex items-center gap-1 text-zinc-500">
                      <Container className="size-3" aria-hidden="true" />
                      Containers
                    </dt>
                    <dd className="mt-1 font-semibold text-zinc-100">
                      {node.containers} ativos
                    </dd>
                  </div>
                </dl>

                <ul className="mt-4 space-y-3">
                  {node.metrics.map((metric) => {
                    const Icon = metric.icon;

                    return (
                      <li key={metric.label}>
                        <div className="flex items-center justify-between text-xs">
                          <span className="inline-flex items-center gap-1.5 text-zinc-500">
                            <Icon className="size-3" aria-hidden="true" />
                            {metric.label}
                          </span>
                          <span
                            className={cn(
                              "font-medium",
                              metric.value >= 80 ? "text-amber-300" : "text-zinc-300",
                            )}
                          >
                            {metric.value}%
                          </span>
                        </div>
                        <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-zinc-800">
                          <div
                            className={cn("h-full rounded-full", barColor(metric.value))}
                            style={{ width: `${metric.value}%` }}
                          />
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </article>
            ))}
          </div>

          {/* Containers */}
          <div className="mt-4 overflow-hidden rounded-2xl border border-zinc-800 bg-surface">
            <div className="flex flex-col gap-2 border-b border-zinc-800 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-sm font-semibold text-zinc-100">
                  Containers Docker
                </h3>
                <p className="mt-0.5 text-xs text-zinc-500">
                  Docker Engine 27 · Compose v2
                </p>
              </div>
              <span className="inline-flex items-center gap-1.5 text-xs text-zinc-400">
                <span className="size-1.5 animate-pulse rounded-full bg-accent" />
                5 de 6 saudáveis
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[620px] text-left text-sm">
                <caption className="sr-only">
                  Status dos containers Docker em produção
                </caption>
                <thead className="border-b border-zinc-800/70 text-xs uppercase tracking-[0.14em] text-zinc-500">
                  <tr>
                    <th scope="col" className="px-5 py-3 font-medium">
                      Container
                    </th>
                    <th scope="col" className="px-5 py-3 font-medium">
                      Imagem
                    </th>
                    <th scope="col" className="px-5 py-3 font-medium">
                      Uptime
                    </th>
                    <th scope="col" className="px-5 py-3 font-medium">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/70">
                  {containers.map((container) => {
                    const isHealthy = container.status === "Running";

                    return (
                      <tr
                        key={container.name}
                        className="transition-colors hover:bg-surface-elevated/40"
                      >
                        <td className="px-5 py-3.5 font-mono text-xs text-zinc-200">
                          {container.name}
                        </td>
                        <td className="px-5 py-3.5 font-mono text-xs text-zinc-500">
                          {container.image}
                        </td>
                        <td className="px-5 py-3.5 text-xs text-zinc-400">
                          {container.uptime}
                        </td>
                        <td className="px-5 py-3.5">
                          <span
                            className={cn(
                              "inline-flex items-center gap-1.5 text-xs font-medium",
                              isHealthy ? "text-accent" : "text-amber-300",
                            )}
                          >
                            <span
                              className={cn(
                                "size-1.5 rounded-full",
                                isHealthy ? "bg-accent" : "bg-amber-400",
                              )}
                              aria-hidden="true"
                            />
                            {container.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>
    </DashboardShell>
  );
}
