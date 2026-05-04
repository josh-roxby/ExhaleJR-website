// B2 — square tag. See DESIGN-SYSTEM.md §4.3.
// Includes `dev` variant matching jr-mobile-home-concept-v3 .project-status.dev.
import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

export type TagVariant = "default" | "accent" | "ok" | "dev" | "warn";

export interface TagProps extends ComponentProps<"span"> {
  variant?: TagVariant;
}

const variantClass: Record<TagVariant, string> = {
  default: "bg-surface-2 text-ink-2 border-line",
  accent: "bg-accent text-accent-on border-accent",
  ok: "bg-ok/10 text-ok border-ok/30",
  dev: "bg-accent/10 text-accent border-accent/25",
  warn: "bg-warn/10 text-warn border-warn/30",
};

export function Tag({ variant = "default", className, children, ...rest }: TagProps) {
  return (
    <span
      {...rest}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-sq-xs border px-2 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.1em]",
        variantClass[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
