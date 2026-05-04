// C1 — round pill. See DESIGN-SYSTEM.md §4.4.
import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

export interface PillProps extends ComponentProps<"span"> {}

export function Pill({ className, children, ...rest }: PillProps) {
  return (
    <span
      {...rest}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-round border border-line-2 bg-surface-2 px-3.5 py-1.5 font-body text-xs font-semibold text-ink",
        className,
      )}
    >
      {children}
    </span>
  );
}
