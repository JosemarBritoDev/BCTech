import Link from "next/link";
import type { ComponentType, ReactNode } from "react";
import { Bell, LogOut } from "lucide-react";

import { Brand } from "@/components/brand";
import { cn } from "@/lib/utils";

type Icon = ComponentType<{
  className?: string;
  "aria-hidden"?: boolean | "true" | "false";
}>;

export type DashboardNavItem = {
  label: string;
  href: string;
  icon: Icon;
  active?: boolean;
};

type DashboardShellProps = {
  user: {
    name: string;
    role: string;
    initials: string;
  };
  nav: DashboardNavItem[];
  title: string;
  subtitle: string;
  badge?: string;
  children: ReactNode;
};

export function DashboardShell({
  user,
  nav,
  title,
  subtitle,
  badge,
  children,
}: DashboardShellProps) {
  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-zinc-800/80 bg-surface/70 backdrop-blur-xl lg:flex">
        <div className="flex h-16 items-center border-b border-zinc-800/80 px-5">
          <Brand />
        </div>

        <nav aria-label="Navegação do painel" className="flex-1 space-y-1 p-3">
          {nav.map((item) => {
            const IconComponent = item.icon;

            return (
              <a
                key={item.label}
                href={item.href}
                className={cn(
                  "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors",
                  item.active
                    ? "bg-brand/10 text-brand"
                    : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100",
                )}
              >
                <IconComponent className="size-4" aria-hidden="true" />
                <span className="flex-1">{item.label}</span>
                {item.active ? (
                  <span
                    className="size-1.5 rounded-full bg-brand"
                    aria-hidden="true"
                  />
                ) : null}
              </a>
            );
          })}
        </nav>

        <div className="border-t border-zinc-800/80 p-3">
          <div className="flex items-center gap-3 rounded-xl bg-surface-elevated p-3">
            <span className="grid size-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-brand to-accent text-xs font-semibold text-white">
              {user.initials}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-zinc-100">
                {user.name}
              </p>
              <p className="truncate text-xs text-zinc-500">{user.role}</p>
            </div>
            <Link
              href="/"
              aria-label="Sair do painel"
              title="Sair"
              className="rounded-lg p-1.5 text-zinc-500 transition-colors hover:bg-zinc-800 hover:text-zinc-200"
            >
              <LogOut className="size-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 border-b border-zinc-800/80 bg-background/85 backdrop-blur-xl">
          <div className="flex h-16 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
            <div className="lg:hidden">
              <Brand showTagline={false} />
            </div>
            <div className="hidden min-w-0 lg:block">
              <h1 className="truncate text-sm font-semibold text-zinc-100">
                {title}
              </h1>
              <p className="truncate text-xs text-zinc-500">{subtitle}</p>
            </div>

            <div className="flex items-center gap-2">
              {badge ? (
                <span className="hidden rounded-full border border-brand/30 bg-brand/10 px-2.5 py-1 text-[11px] font-medium text-brand sm:inline-flex">
                  {badge}
                </span>
              ) : null}
              <span className="hidden items-center gap-1.5 rounded-full border border-accent/30 bg-accent/10 px-2.5 py-1 text-[11px] font-medium text-accent sm:inline-flex">
                <span className="size-1.5 animate-pulse rounded-full bg-accent" />
                Operacional
              </span>
              <button
                type="button"
                aria-label="Notificações"
                className="rounded-lg border border-zinc-800 bg-surface/70 p-2 text-zinc-400 transition-colors hover:border-zinc-700 hover:text-zinc-100"
              >
                <Bell className="size-4" aria-hidden="true" />
              </button>
              <span className="grid size-9 place-items-center rounded-full bg-gradient-to-br from-brand to-accent text-xs font-semibold text-white lg:hidden">
                {user.initials}
              </span>
            </div>
          </div>

          <nav
            aria-label="Navegação móvel"
            className="flex gap-1.5 overflow-x-auto border-t border-zinc-800/60 px-4 pb-3 pt-2 lg:hidden"
          >
            {nav.map((item) => {
              const IconComponent = item.icon;

              return (
                <a
                  key={item.label}
                  href={item.href}
                  className={cn(
                    "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs transition-colors",
                    item.active
                      ? "border-brand/40 bg-brand/10 text-brand"
                      : "border-zinc-800 text-zinc-400 hover:text-zinc-100",
                  )}
                >
                  <IconComponent className="size-3.5" aria-hidden="true" />
                  {item.label}
                </a>
              );
            })}
          </nav>
        </header>

        <main id="top" className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
