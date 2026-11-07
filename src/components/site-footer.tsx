import Link from "next/link";

import { Brand } from "@/components/brand";

const columns = [
  {
    title: "Produtos",
    links: [
      { label: "BCModas", href: "https://bcmodas.britoscode.tech" },
      { label: "BC Health", href: "https://bchealth.britoscode.tech" },
      { label: "BCTech Core", href: "/#produtos" },
    ],
  },
  {
    title: "Plataforma",
    links: [
      { label: "Portal do cliente", href: "/portal" },
      { label: "Painel admin", href: "/admin" },
      { label: "Documentação", href: "https://github.com/JosemarBritoDev/BCTech/tree/main/docs" },
    ],
  },
  {
    title: "Status",
    links: [
      { label: "Status dos sistemas", href: "https://status.britoscode.tech" },
      { label: "Histórico de incidentes", href: "https://status.britoscode.tech/history" },
      { label: "Contato", href: "mailto:contato@britoscode.tech" },
    ],
  },
];

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-zinc-800/80 bg-surface/40">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div className="space-y-4">
            <Brand />
            <p className="max-w-xs text-sm leading-relaxed text-zinc-500">
              Software sob medida e infraestrutura isolada para operações que não
              podem parar.
            </p>
            <p className="inline-flex items-center gap-2 rounded-full border border-accent/25 bg-accent/10 px-2.5 py-1 text-[11px] font-medium text-accent">
              <span className="size-1.5 animate-pulse rounded-full bg-accent" />
              Todos os sistemas operacionais
            </p>
          </div>

          {columns.map((column) => (
            <div key={column.title}>
              <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                {column.title}
              </h3>
              <ul className="space-y-2.5">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-zinc-400 transition-colors hover:text-brand"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-zinc-800/80 pt-6 text-xs text-zinc-500 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} BritosCode.tech. BCTech® é marca registrada. Todos os
            direitos reservados.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <Link href="/" className="transition-colors hover:text-zinc-300">
              Termos de uso
            </Link>
            <Link href="/" className="transition-colors hover:text-zinc-300">
              Privacidade
            </Link>
            <a
              href="https://status.britoscode.tech"
              target="_blank"
              rel="noreferrer"
              className="transition-colors hover:text-zinc-300"
            >
              status.britoscode.tech
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
