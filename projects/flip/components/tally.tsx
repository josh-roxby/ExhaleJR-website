"use client";

import { Tag } from "@/components/ui";
import { cn } from "@/lib/cn";

import type { Side } from "../page";

interface TallyProps {
  flips: Side[];
  needed: number;
  cap: number;
  winner: Side | null;
}

export function Tally({ flips, needed, cap, winner }: TallyProps) {
  const heads = flips.filter((f) => f === "heads").length;
  const tails = flips.filter((f) => f === "tails").length;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-center gap-6">
        <Side label="Heads" count={heads} needed={needed} highlight={winner === "heads"} />
        <span className="font-mono text-xs uppercase tracking-[0.18em] text-mute-3">vs</span>
        <Side label="Tails" count={tails} needed={needed} highlight={winner === "tails"} />
      </div>
      <div className="flex justify-center gap-1">
        {Array.from({ length: cap }).map((_, i) => {
          const f = flips[i];
          return (
            <span
              key={i}
              aria-label={f ?? "pending"}
              className={cn(
                "h-2 w-6 rounded-round transition-colors duration-[var(--t)]",
                f === "heads"
                  ? "bg-accent"
                  : f === "tails"
                    ? "bg-accent-dim"
                    : "bg-surface-3",
              )}
            />
          );
        })}
      </div>
    </div>
  );
}

function Side({
  label,
  count,
  needed,
  highlight,
}: {
  label: string;
  count: number;
  needed: number;
  highlight: boolean;
}) {
  return (
    <div className="flex flex-col items-center gap-1">
      <span
        className={cn(
          "font-display text-5xl font-black tabular-nums tracking-tight",
          highlight ? "text-accent" : count > 0 ? "text-ink" : "text-mute-3",
        )}
      >
        {count}
      </span>
      <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-mute-2">
        {label}
      </span>
      {needed > 1 && (
        <span className="font-mono text-[9px] tracking-[0.18em] text-mute-3">
          to {needed}
        </span>
      )}
    </div>
  );
}

export function Result({ winner }: { winner: Side }) {
  return (
    <div className="flex justify-center">
      <Tag variant="accent" className="!px-3 !py-1.5 !text-sm">
        {winner === "heads" ? "Heads wins" : "Tails wins"}
      </Tag>
    </div>
  );
}
