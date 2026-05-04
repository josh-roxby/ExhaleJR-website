// J2 — stat card. See DESIGN-SYSTEM.md §4.10 (Stat cards rule).
// Numbers stay in --ink (or white on featured). Iris is reserved for the delta chip.
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Card } from "./card";
import { Sparkline } from "./sparkline";

export interface StatCardProps {
  label: ReactNode;
  num: ReactNode;
  cap?: ReactNode;
  delta?: ReactNode;
  /** Sparkline heights as percentages 0–100. Last bar is auto-rendered as `now`. */
  spark?: number[];
  /** Iris-gradient featured card (spans 2 cols when used inside a 2-col bento). */
  featured?: boolean;
  className?: string;
  onClick?: () => void;
}

export function StatCard({
  label,
  num,
  cap,
  delta,
  spark,
  featured = false,
  className,
  onClick,
}: StatCardProps) {
  return (
    <Card
      featured={featured}
      onClick={onClick}
      className={cn(
        "flex min-h-[100px] flex-col gap-1.5 p-[14px]",
        featured && "col-span-2",
        className,
      )}
    >
      <div
        className={cn(
          "font-mono text-[8px] font-bold uppercase tracking-[0.22em]",
          featured ? "text-white/70" : "text-mute",
        )}
      >
        {label}
      </div>
      <div
        className={cn(
          "font-display font-black leading-none tracking-tight",
          featured ? "text-[38px] text-white" : "text-[30px] text-ink",
        )}
      >
        {num}
      </div>
      {cap && (
        <div
          className={cn(
            "mt-0.5 font-mono text-[9px] tracking-[0.06em]",
            featured ? "text-white/70" : "text-mute",
          )}
        >
          {cap}
        </div>
      )}
      {delta && (
        <span
          className={cn(
            "mt-1 inline-flex w-fit items-center gap-0.5 rounded-sq-xs border px-1.5 py-0.5 font-mono text-[9px] font-bold tracking-[0.06em]",
            featured
              ? "border-white/25 bg-white/15 text-white"
              : "border-accent/25 bg-accent/[0.12] text-accent",
          )}
        >
          {delta}
        </span>
      )}
      {spark && spark.length > 0 && <Sparkline values={spark} featured={featured} />}
    </Card>
  );
}
