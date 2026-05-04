// C2 — round badge. See DESIGN-SYSTEM.md §4.4.
import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

export interface BadgeProps extends ComponentProps<"span"> {
  /** Render as a 8x8 status dot rather than a numeric pill. */
  dot?: boolean;
}

export function Badge({ dot = false, className, children, ...rest }: BadgeProps) {
  if (dot) {
    return (
      <span
        {...rest}
        className={cn(
          "inline-block h-2 w-2 rounded-round bg-accent shadow-[0_0_0_2px_var(--bg)]",
          className,
        )}
      />
    );
  }

  return (
    <span
      {...rest}
      className={cn(
        "inline-flex h-[18px] min-w-[18px] items-center justify-center rounded-round bg-accent px-1.5 font-mono text-[9px] font-bold text-accent-on",
        className,
      )}
    >
      {children}
    </span>
  );
}
