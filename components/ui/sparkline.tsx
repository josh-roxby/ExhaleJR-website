// Sparkline helper for stat cards. Last bar auto-rendered as `now`.
// See DESIGN-SYSTEM.md §4.10 (J2 stat cards).
import { cn } from "@/lib/cn";

export interface SparklineProps {
  /** Heights as percentages 0–100. The last entry is rendered as the `now` bar. */
  values: number[];
  /** Force a "featured" palette (white-on-Iris-gradient context). */
  featured?: boolean;
  className?: string;
}

export function Sparkline({ values, featured = false, className }: SparklineProps) {
  return (
    <div className={cn("mt-1.5 flex h-6 items-end gap-0.5", className)}>
      {values.map((pct, i) => {
        const isNow = i === values.length - 1;
        return (
          <span
            key={i}
            style={{ height: `${Math.max(0, Math.min(100, pct))}%` }}
            className={cn(
              "flex-1 rounded-[1px]",
              isNow
                ? featured
                  ? "bg-white shadow-[0_0_6px_rgba(255,255,255,.4)] opacity-100"
                  : "bg-accent shadow-[0_0_6px_var(--accent-glow)] opacity-100"
                : featured
                  ? "bg-white/30 opacity-100"
                  : "bg-mute-3 opacity-[0.35]",
            )}
          />
        );
      })}
    </div>
  );
}
