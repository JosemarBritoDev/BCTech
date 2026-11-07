import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { Brand } from "@/components/brand";

const navigation = [
  { label: "Produtos", href: "/#produtos" },
  { label: "Por que BCTech", href: "/#porque" },
  { label: "Status", href: "https://status.britoscode.tech" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-zinc-800/80 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Brand />

        <nav
          aria-label="Navegação principal"
          className="hidden items-center gap-1 md:flex"
        >
          {navigation.map((item) => {
            const isExternal = item.href.startsWith("http");

            return isExternal ? (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noreferrer"
                className="rounded-lg px-3 py-2 text-sm text-zinc-400 transition-colors hover:bg-zinc-900 hover:text-zinc-100"
              >
                {item.label}
              </a>
            ) : (
              <Link
                key={item.label}
                href={item.href}
                className="rounded-lg px-3 py-2 text-sm text-zinc-400 transition-colors hover:bg-zinc-900 hover:text-zinc-100"
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <Link
          href="/portal"
          className="inline-flex items-center gap-2 rounded-full border border-brand/40 bg-brand/10 px-4 py-2 text-sm font-medium text-brand transition-colors hover:border-brand/70 hover:bg-brand/20"
        >
          Portal do cliente
          <ArrowUpRight className="size-4" aria-hidden="true" />
        </Link>
      </div>
    </header>
  );
}
