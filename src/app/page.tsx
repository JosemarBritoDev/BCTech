import type { ComponentType } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowUpRight,
  Boxes,
  CircleCheck,
  Clock,
  DatabaseBackup,
  HeartPulse,
  MessageCircle,
  Server,
  ShieldCheck,
  Shirt,
  ShoppingCart,
  Sparkles,
  Zap,
} from "lucide-react";

import {
  getSaasCatalog,
  type SaasProductView,
} from "@/app/actions/saas-actions";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { StatusBadge, type StatusTone } from "@/components/status-badge";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "BritosCode HQ — SaaS sob medida para operações críticas",
  description:
    "Ecossistema multi-SaaS da BritosCode.tech: BCModas, BC Health e BCTech Core com infraestrutura isolada, backups automatizados e suporte via WhatsApp.",
};

type Icon = ComponentType<{
  className?: string;
  "aria-hidden"?: boolean | "true" | "false";
}>;

const productIcons: Record<string, Icon> = {
  bcmodas: Shirt,
  "bc-health": HeartPulse,
  "bctech-core": Boxes,
  "material-checkout": ShoppingCart,
};

const productTaglines: Record<string, string> = {
  bcmodas: "ERP para Confecção & Estamparia",
  "bc-health": "Gestão Completa de Clínicas SaaS",
  "bctech-core": "Núcleo do ecossistema BritosCode",
  "material-checkout": "Checkout B2B e pedidos recorrentes",
};

const productFeatures: Record<string, string[]> = {
  bcmodas: [
    "Gestão de produção e ordens de serviço",
    "Fichas técnicas e controle de estamparia",
    "PDV, estoque e financeiro integrados",
  ],
  "bc-health": [
    "Agenda inteligente e prontuário eletrônico",
    "Faturamento de convênios e particulares",
    "Indicadores clínicos e financeiros em tempo real",
  ],
  "bctech-core": [
    "Identidade e multi-tenancy unificados",
    "Billing, assinaturas e cobranças integradas",
    "Central de suporte e ambientes de demonstração",
  ],
  "material-checkout": [
    "Catálogo B2B com tabelas de preço",
    "Checkout e pedidos recorrentes",
    "Integração nativa com BCModas e BC Health",
  ],
};

const statusMeta: Record<
  SaasProductView["status"],
  { label: string; tone: StatusTone }
> = {
  ACTIVE: { label: "Ativo", tone: "accent" },
  BETA: { label: "Beta", tone: "brand" },
  DEMO: { label: "Demo", tone: "brand" },
};

const reasons = [
  {
    icon: ShieldCheck,
    title: "Infraestrutura isolada",
    description:
      "Cada cliente roda em containers dedicados, com rede, banco e storage separados. Um ambiente nunca interfere no outro.",
    highlight: "Isolamento por tenant",
  },
  {
    icon: DatabaseBackup,
    title: "Backups automatizados",
    description:
      "Snapshots diários do PostgreSQL, retenção de 30 dias e testes periódicos de restauração. Seus dados sempre recuperáveis.",
    highlight: "RPO de 24h · RTO de 1h",
  },
  {
    icon: MessageCircle,
    title: "WhatsApp automatizado",
    description:
      "Notificações de faturas, vencimentos, chamados e alertas operacionais direto no WhatsApp da sua equipe.",
    highlight: "Alertas em tempo real",
  },
];

export default async function Home() {
  const { products, demos, totals, source } = await getSaasCatalog();
  const demoProductSlugs = new Set(demos.map((demo) => demo.productSlug));

  const stats = [
    { value: "99,98%", label: "Uptime nos últimos 90 dias" },
    {
      value: String(totals.activeClients),
      label: "Clientes ativos no ecossistema",
    },
    {
      value: String(totals.activeProducts),
      label: "Produtos SaaS em operação",
    },
    { value: String(totals.demos), label: "Ambientes demo disponíveis" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden border-b border-zinc-800/60">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_65%_55%_at_50%_-10%,rgba(168,85,247,0.22),transparent)]"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(39,39,42,0.35)_1px,transparent_1px),linear-gradient(to_bottom,rgba(39,39,42,0.35)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,black,transparent)]"
          />

          <div className="relative mx-auto max-w-6xl px-4 pb-20 pt-20 sm:px-6 lg:px-8 lg:pb-28 lg:pt-28">
            <div className="flex max-w-3xl flex-col items-start">
              <span className="inline-flex items-center gap-2 rounded-full border border-brand/30 bg-brand/10 px-3 py-1.5 text-xs font-medium text-brand">
                <Sparkles className="size-3.5" aria-hidden="true" />
                Ecossistema multi-SaaS da BritosCode.tech
              </span>

              <h1 className="mt-6 text-balance text-4xl font-semibold tracking-tight text-zinc-50 sm:text-6xl lg:text-7xl">
                Software sob medida para{" "}
                <span className="bg-gradient-to-r from-brand via-fuchsia-400 to-accent bg-clip-text text-transparent">
                  operações que não podem parar.
                </span>
              </h1>

              <p className="mt-6 max-w-2xl text-balance text-lg leading-relaxed text-zinc-400">
                A BritosCode HQ reúne ERPs, plataformas de saúde e produtos
                digitais com infraestrutura isolada, billing integrado e suporte
                humano. Tecnologia de produção, sem a complexidade de manter tudo
                sozinho.
              </p>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="#produtos"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white shadow-[0_0_36px_-10px_rgba(168,85,247,0.9)] transition-colors hover:bg-brand/90"
                >
                  Conhecer os produtos
                  <ArrowUpRight className="size-4" aria-hidden="true" />
                </Link>
                <Link
                  href="/portal"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-zinc-700 bg-surface/60 px-6 py-3 text-sm font-semibold text-zinc-200 transition-colors hover:border-brand/50 hover:text-white"
                >
                  Acessar portal do cliente
                </Link>
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-zinc-500">
                <span className="inline-flex items-center gap-1.5">
                  <Zap className="size-3.5 text-accent" aria-hidden="true" />
                  Deploy em minutos
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Server className="size-3.5 text-accent" aria-hidden="true" />
                  PostgreSQL gerenciado
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <ShieldCheck className="size-3.5 text-accent" aria-hidden="true" />
                  LGPD by design
                </span>
              </div>
            </div>

            <dl className="mt-16 grid grid-cols-2 gap-6 border-t border-zinc-800/80 pt-8 lg:grid-cols-4">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <dt className="sr-only">{stat.label}</dt>
                  <dd className="text-2xl font-semibold tracking-tight text-zinc-100">
                    {stat.value}
                  </dd>
                  <dd className="mt-1 text-xs leading-relaxed text-zinc-500">
                    {stat.label}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* Vitrine de produtos */}
        <section
          id="produtos"
          className="mx-auto max-w-6xl scroll-mt-20 px-4 py-20 sm:px-6 lg:px-8 lg:py-24"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl">
              <span className="text-xs font-semibold uppercase tracking-[0.22em] text-brand">
                Vitrine
              </span>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-50 sm:text-4xl">
                Produtos ativos do ecossistema
              </h2>
              <p className="mt-3 text-zinc-400">
                Plataformas prontas para uso, com demonstração guiada e
                implantação acompanhada pela equipe BritosCode.
              </p>
            </div>
            <div className="flex flex-col items-start gap-2 sm:items-end">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-zinc-800 bg-surface px-2.5 py-1 text-[11px] text-zinc-400">
                <span
                  className={`size-1.5 rounded-full ${
                    source === "database" ? "bg-accent" : "bg-amber-400"
                  }`}
                  aria-hidden="true"
                />
                {source === "database"
                  ? "Catálogo sincronizado via Prisma"
                  : "Catálogo de demonstração"}
              </span>
              <Link
                href="/portal"
                className="inline-flex items-center gap-2 text-sm font-medium text-brand transition-colors hover:text-fuchsia-300"
              >
                Já sou cliente
                <ArrowUpRight className="size-4" aria-hidden="true" />
              </Link>
            </div>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => {
              const Icon = productIcons[product.slug] ?? Boxes;
              const features = productFeatures[product.slug] ?? [
                product.description,
              ];
              const meta = statusMeta[product.status];
              const tagline =
                productTaglines[product.slug] ?? "SaaS BritosCode";
              const hasDemo = demoProductSlugs.has(product.slug);

              return (
                <article
                  key={product.slug}
                  className="group relative flex flex-col overflow-hidden rounded-2xl border border-zinc-800 bg-surface p-6 transition-all duration-300 hover:-translate-y-1 hover:border-brand/50 hover:shadow-[0_24px_70px_-36px_rgba(168,85,247,0.65)]"
                >
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-x-0 -top-24 h-44 bg-brand/10 opacity-0 blur-3xl transition-opacity duration-300 group-hover:opacity-100"
                  />

                  <div className="relative flex items-start justify-between gap-3">
                    <span className="grid size-11 place-items-center rounded-xl border border-zinc-800 bg-surface-elevated text-brand">
                      <Icon className="size-5" aria-hidden="true" />
                    </span>
                    <StatusBadge label={meta.label} tone={meta.tone} />
                  </div>

                  <div className="relative mt-5">
                    <h3 className="text-xl font-semibold tracking-tight text-zinc-50">
                      {product.name}
                    </h3>
                    <p className="mt-1 text-sm font-medium text-brand">
                      {tagline}
                    </p>
                    <p className="mt-3 text-sm leading-relaxed text-zinc-400">
                      {product.description}
                    </p>
                    {hasDemo ? (
                      <span className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-accent/25 bg-accent/5 px-2.5 py-1 text-[11px] font-medium text-accent">
                        <Sparkles className="size-3" aria-hidden="true" />
                        Ambiente demo ativo
                      </span>
                    ) : null}
                  </div>

                  <ul className="relative mt-5 space-y-2.5 border-t border-zinc-800/70 pt-5">
                    {features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-start gap-2 text-sm text-zinc-400"
                      >
                        <CircleCheck
                          className="mt-0.5 size-4 shrink-0 text-accent"
                          aria-hidden="true"
                        />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <div className="relative mt-auto pt-6">
                    {product.demoUrl ? (
                      <a
                        href={product.demoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand/90"
                      >
                        Ver Demo
                        <ArrowUpRight className="size-4" aria-hidden="true" />
                      </a>
                    ) : (
                      <div className="flex flex-col gap-2">
                        <span className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-brand/25 bg-brand/5 px-4 py-2.5 text-sm font-medium text-brand">
                          <Clock className="size-4" aria-hidden="true" />
                          {product.status === "BETA"
                            ? "Em breve / Beta"
                            : "Em breve"}
                        </span>
                        <a
                          href={`mailto:contato@britoscode.tech?subject=${encodeURIComponent(
                            `Lista de espera — ${product.name}`,
                          )}`}
                          className="inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-800 px-4 py-2.5 text-sm font-medium text-zinc-300 transition-colors hover:border-brand/40 hover:text-brand"
                        >
                          Entrar na lista de espera
                        </a>
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </div>

          <div className="mt-8 rounded-2xl border border-zinc-800 bg-surface/60 p-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h3 className="text-base font-semibold tracking-tight text-zinc-100">
                  Ambientes de demonstração
                </h3>
                <p className="mt-1 text-sm text-zinc-500">
                  Sandboxes temporários publicados a partir do catálogo do
                  Supabase/Prisma.
                </p>
              </div>
              <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-accent/25 bg-accent/5 px-2.5 py-1 text-[11px] font-medium text-accent">
                <Sparkles className="size-3" aria-hidden="true" />
                {demos.length} {demos.length === 1 ? "ativo" : "ativos"}
              </span>
            </div>

            {demos.length > 0 ? (
              <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {demos.map((demo) => (
                  <li
                    key={demo.id}
                    className="flex flex-col rounded-xl border border-zinc-800/80 bg-background/40 p-4 transition-colors hover:border-brand/40"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="truncate font-mono text-xs text-zinc-300">
                        {demo.tenantSlug}
                      </span>
                      <StatusBadge
                        label={demo.isClean ? "Limpo" : "Em uso"}
                        tone={demo.isClean ? "accent" : "amber"}
                      />
                    </div>
                    <p className="mt-2 text-sm font-medium text-zinc-100">
                      {demo.productName}
                    </p>
                    <p className="mt-1 inline-flex items-center gap-1.5 text-xs text-zinc-500">
                      <Clock className="size-3.5" aria-hidden="true" />
                      Expira em {formatDate(demo.expiresAt)}
                    </p>
                    {demo.demoUrl ? (
                      <a
                        href={demo.demoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-brand transition-colors hover:text-fuchsia-300"
                      >
                        Abrir ambiente
                        <ArrowUpRight className="size-3.5" aria-hidden="true" />
                      </a>
                    ) : null}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 text-sm text-zinc-500">
                Nenhum ambiente demo ativo no momento. Solicite uma demonstração
                guiada para receber um sandbox temporário.
              </p>
            )}
          </div>
        </section>

        {/* Por que BritosCode */}
        <section
          id="porque"
          className="scroll-mt-20 border-y border-zinc-800/70 bg-surface/40"
        >
          <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
            <div className="max-w-2xl">
              <span className="text-xs font-semibold uppercase tracking-[0.22em] text-brand">
                Por que BritosCode HQ
              </span>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-50 sm:text-4xl">
                Engenharia de produção, não apenas software
              </h2>
              <p className="mt-3 text-zinc-400">
                A camada invisível que mantém sua operação estável: isolamento,
                recuperação de dados e comunicação automatizada.
              </p>
            </div>

            <div className="mt-10 grid gap-5 lg:grid-cols-3">
              {reasons.map((reason, index) => {
                const Icon = reason.icon;

                return (
                  <article
                    key={reason.title}
                    className="group relative overflow-hidden rounded-2xl border border-zinc-800 bg-background/60 p-6 transition-colors hover:border-accent/40"
                  >
                    <div className="flex items-center justify-between">
                      <span className="grid size-11 place-items-center rounded-xl border border-accent/25 bg-accent/10 text-accent">
                        <Icon className="size-5" aria-hidden="true" />
                      </span>
                      <span className="font-mono text-xs text-zinc-600">
                        0{index + 1}
                      </span>
                    </div>
                    <h3 className="mt-5 text-lg font-semibold text-zinc-100">
                      {reason.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                      {reason.description}
                    </p>
                    <p className="mt-5 inline-flex rounded-full border border-zinc-800 bg-zinc-900/60 px-2.5 py-1 text-[11px] font-medium text-accent">
                      {reason.highlight}
                    </p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA final */}
        <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
          <div className="relative overflow-hidden rounded-3xl border border-zinc-800 bg-gradient-to-br from-brand/15 via-surface to-accent/10 px-6 py-12 text-center sm:px-12">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_50%_60%_at_50%_0%,rgba(168,85,247,0.18),transparent)]"
            />
            <div className="relative mx-auto max-w-2xl">
              <h2 className="text-balance text-3xl font-semibold tracking-tight text-zinc-50 sm:text-4xl">
                Pronto para colocar sua operação no próximo nível?
              </h2>
              <p className="mt-4 text-zinc-400">
                Agende uma demonstração ou acesse o portal para gerenciar seus
                produtos, faturas e chamados.
              </p>
              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                <a
                  href="mailto:contato@britoscode.tech?subject=Quero%20uma%20demonstra%C3%A7%C3%A3o%20BCTech"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand/90"
                >
                  Solicitar demonstração
                  <ArrowUpRight className="size-4" aria-hidden="true" />
                </a>
                <Link
                  href="/portal"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-zinc-700 px-6 py-3 text-sm font-semibold text-zinc-200 transition-colors hover:border-accent/50 hover:text-accent"
                >
                  Entrar no portal
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
