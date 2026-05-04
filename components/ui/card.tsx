// J — base card. See DESIGN-SYSTEM.md §4.10.
// Hover languages: lift, glow, fill — pick one per surface.
import type { ComponentProps, ElementType, ReactNode } from "react";
import { cn } from "@/lib/cn";

export type CardHover = "none" | "lift" | "glow" | "fill";

interface BaseCardProps {
  hover?: CardHover;
  /** Iris-gradient featured card (J2 featured). */
  featured?: boolean;
  className?: string;
  children?: ReactNode;
}

const hoverClass: Record<CardHover, string> = {
  none: "",
  lift: "hover:-translate-y-0.5 hover:border-line-2 hover:shadow-[0_8px_24px_rgba(0,0,0,.4)]",
  glow: "hover:border-accent hover:shadow-[0_0_0_1px_var(--accent),0_0_32px_var(--accent-glow)]",
  fill: "hover:border-line-2",
};

type CardProps<T extends ElementType> = BaseCardProps & Omit<ComponentProps<T>, keyof BaseCardProps> & {
  as?: T;
};

export function Card<T extends ElementType = "div">({
  as,
  hover = "none",
  featured = false,
  className,
  children,
  ...rest
}: CardProps<T>) {
  const Component = (as ?? "div") as ElementType;
  return (
    <Component
      {...rest}
      className={cn(
        "ds-interactive relative overflow-hidden rounded-sq-md border p-[18px] active:scale-[0.99]",
        featured
          ? "border-accent text-white [background:linear-gradient(135deg,var(--accent)_0%,#6048d4_100%)] hover:shadow-[0_0_32px_var(--accent-glow)]"
          : "border-line bg-surface",
        hoverClass[hover],
        className,
      )}
    >
      {children}
    </Component>
  );
}
