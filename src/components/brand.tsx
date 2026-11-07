import Link from "next/link";

import { cn } from "@/lib/utils";

type BrandProps = {
  className?: string;
  showTagline?: boolean;
};

export function Brand({ className, showTagline = true }: BrandProps) {
  return (
    <Link
      href="/"
      aria-label="BCTech — página inicial"
      className={cn("group inline-flex items-center gap-2.5", className)}
    >
      <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-brand to-accent text-[11px] font-bold tracking-tight text-white shadow-[0_0_24px_-6px_rgba(168,85,247,0.8)] transition-shadow group-hover:shadow-[0_0_32px_-4px_rgba(168,85,247,0.9)]">
        BC
      </span>
      <span className="flex flex-col leading-none">
        <span className="text-sm font-semibold tracking-tight text-foreground">
          BCTech
        </span>
        {showTagline ? (
          <span className="mt-1 text-[9px] font-medium uppercase tracking-[0.22em] text-zinc-500">
            BritosCode HQ
          </span>
        ) : null}
      </span>
    </Link>
  );
}
