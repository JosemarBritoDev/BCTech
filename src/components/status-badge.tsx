import { cn } from "@/lib/utils";

export type StatusTone = "accent" | "brand" | "amber" | "red" | "zinc";

const tones: Record<StatusTone, string> = {
  accent: "border-accent/30 bg-accent/10 text-accent",
  brand: "border-brand/30 bg-brand/10 text-brand",
  amber: "border-amber-400/30 bg-amber-400/10 text-amber-300",
  red: "border-red-400/30 bg-red-400/10 text-red-300",
  zinc: "border-zinc-700 bg-zinc-800/60 text-zinc-300",
};

type StatusBadgeProps = {
  label: string;
  tone?: StatusTone;
  className?: string;
  withDot?: boolean;
};

export function StatusBadge({
  label,
  tone = "accent",
  className,
  withDot = true,
}: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium",
        tones[tone],
        className,
      )}
    >
      {withDot ? (
        <span className="size-1.5 rounded-full bg-current" aria-hidden="true" />
      ) : null}
      {label}
    </span>
  );
}
