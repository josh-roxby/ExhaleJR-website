// A1–A3, A5 — square buttons. See DESIGN-SYSTEM.md §4.1.
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/cn";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "secondary-accent"
  | "ghost"
  | "destructive";

export interface ButtonProps extends ComponentProps<"button"> {
  variant?: ButtonVariant;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
}

const variantClass: Record<ButtonVariant, string> = {
  primary:
    "bg-accent text-accent-on font-bold border border-accent hover:bg-white hover:text-black hover:shadow-glow",
  secondary:
    "bg-transparent text-ink border border-line-2 hover:border-line-3 hover:bg-surface-2",
  "secondary-accent":
    "bg-transparent text-accent-dim border border-accent-dim/40 hover:bg-accent-dim/10 hover:border-accent-dim hover:text-white",
  ghost:
    "bg-transparent text-mute border border-transparent px-3 py-2 hover:text-ink hover:bg-surface-2",
  destructive:
    "bg-warn text-white font-bold border border-warn hover:opacity-90",
};

export function Button({
  variant = "primary",
  leadingIcon,
  trailingIcon,
  className,
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      {...rest}
      className={cn(
        "ds-interactive inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-sq px-[18px] py-[10px] font-body text-[13px] font-semibold tracking-[0.02em] outline-none active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-50",
        variantClass[variant],
        className,
      )}
    >
      {leadingIcon}
      {children}
      {trailingIcon}
    </button>
  );
}
