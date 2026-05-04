// Bento popover cell. See DESIGN-SYSTEM.md §5.3.
// Two variants: `action` (default — square cell with icon + label + eyebrow)
// and `account` (Iris-gradient hero spanning 2 columns).
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/cn";

type MenuCellBaseProps = Omit<ComponentProps<"button">, "name">;

export interface ActionMenuCellProps extends MenuCellBaseProps {
  label: ReactNode;
  icon: ReactNode;
  eyebrow?: ReactNode;
}

export function ActionMenuCell({
  label,
  icon,
  eyebrow,
  className,
  ...rest
}: ActionMenuCellProps) {
  return (
    <button
      {...rest}
      className={cn(
        "ds-interactive relative flex min-h-[74px] flex-col justify-between overflow-hidden rounded-sq border border-line bg-surface-2 p-2.5 text-left outline-none active:scale-[0.96] hover:border-accent-dim hover:bg-accent-dim/[0.06] [&:hover_.cell-icon]:text-accent",
        className,
      )}
    >
      {eyebrow && (
        <div className="font-mono text-[7px] font-bold uppercase tracking-[0.2em] text-mute-3">
          {eyebrow}
        </div>
      )}
      <div className="cell-icon self-start text-accent-dim transition-colors duration-[var(--t)]">
        {icon}
      </div>
      <div className="font-display text-xs font-bold uppercase leading-none tracking-[0.02em] text-ink">
        {label}
      </div>
    </button>
  );
}

export interface AccountMenuCellProps extends MenuCellBaseProps {
  name: ReactNode;
  email: ReactNode;
  initials: ReactNode;
}

export function AccountMenuCell({
  name,
  email,
  initials,
  className,
  ...rest
}: AccountMenuCellProps) {
  return (
    <button
      {...rest}
      className={cn(
        "ds-interactive col-span-2 flex min-h-[74px] items-center gap-2.5 overflow-hidden rounded-sq border border-accent p-2.5 text-left text-white outline-none active:scale-[0.96] hover:shadow-[0_0_24px_var(--accent-glow)] [background:linear-gradient(135deg,var(--accent)_0%,#5d3fe0_100%)]",
        className,
      )}
    >
      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-round border-[1.5px] border-white/40 bg-white/[0.18] font-display text-xs font-black text-white">
        {initials}
      </span>
      <span className="min-w-0 flex-1">
        <span className="mb-0.5 block truncate font-display text-[13px] font-bold uppercase leading-none tracking-[0.02em]">
          {name}
        </span>
        <span className="block truncate font-mono text-[8px] leading-none tracking-[0.06em] text-white/80">
          {email}
        </span>
      </span>
      <span className="shrink-0 text-white/70" aria-hidden>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 18l6-6-6-6" />
        </svg>
      </span>
    </button>
  );
}
