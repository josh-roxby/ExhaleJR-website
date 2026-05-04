// B1 — round chip. See DESIGN-SYSTEM.md §4.2.
import type { ComponentProps, ElementType, ReactNode } from "react";
import { cn } from "@/lib/cn";

export type ChipVariant = "default" | "accent" | "mono";

interface BaseChipProps {
  variant?: ChipVariant;
  className?: string;
  children?: ReactNode;
}

const variantClass: Record<ChipVariant, string> = {
  default:
    "bg-surface-2 text-ink-2 border-line text-[11px] font-medium px-[11px] py-[5px] font-body",
  accent:
    "bg-accent text-accent-on border-accent text-[11px] font-semibold px-[11px] py-[5px] font-body",
  mono:
    "bg-surface-2 text-ink-2 border-line text-[9px] font-semibold uppercase tracking-[0.18em] px-[9px] py-1 font-mono",
};

type ChipProps<T extends ElementType> = BaseChipProps & Omit<ComponentProps<T>, keyof BaseChipProps> & {
  as?: T;
};

export function Chip<T extends ElementType = "span">({
  as,
  variant = "default",
  className,
  children,
  ...rest
}: ChipProps<T>) {
  const Component = (as ?? "span") as ElementType;
  return (
    <Component
      {...rest}
      className={cn(
        "ds-interactive inline-flex items-center gap-1.5 rounded-round border active:scale-[0.95]",
        variantClass[variant],
        className,
      )}
    >
      {children}
    </Component>
  );
}
