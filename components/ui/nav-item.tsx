// I6 — floating bottom nav inner. See DESIGN-SYSTEM.md §5.2.
import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

export interface NavItemProps extends ComponentProps<"button"> {
  active?: boolean;
  /** Special "menu toggle" 5th-slot styling — highlights surface-3 + accent when open. */
  menuToggle?: boolean;
  open?: boolean;
}

export function NavItem({
  active = false,
  menuToggle = false,
  open = false,
  className,
  children,
  ...rest
}: NavItemProps) {
  return (
    <button
      {...rest}
      className={cn(
        "ds-interactive relative grid h-10 w-10 place-items-center rounded-sq-lg outline-none active:scale-[0.88]",
        active
          ? "bg-accent text-accent-on shadow-[0_0_16px_var(--accent-glow)] hover:bg-accent hover:text-accent-on"
          : menuToggle && open
            ? "bg-surface-3 text-accent"
            : "text-mute hover:bg-white/[0.04] hover:text-ink-2",
        className,
      )}
    >
      {children}
    </button>
  );
}
