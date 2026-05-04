// Bento popover cells. See DESIGN-SYSTEM.md §5.3.
// Two variants: `action` (square cell with icon + label + eyebrow) and
// `account` (Iris-gradient hero spanning the full grid width, with optional
// sub-CTA row).
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

export interface AccountMenuCellProps {
  name: ReactNode;
  email: ReactNode;
  initials: ReactNode;
  /** Sub-CTA row (icon buttons / links). Rendered below the avatar block. */
  children?: ReactNode;
  className?: string;
}

export function AccountMenuCell({
  name,
  email,
  initials,
  children,
  className,
}: AccountMenuCellProps) {
  return (
    <div
      className={cn(
        "col-span-3 flex flex-col gap-3 overflow-hidden rounded-sq border border-accent p-3.5 text-white [background:linear-gradient(135deg,var(--accent)_0%,#5d3fe0_100%)]",
        className,
      )}
    >
      <div className="flex items-center gap-2.5">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-round border-[1.5px] border-white/40 bg-white/[0.18] font-display text-[13px] font-black text-white">
          {initials}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate font-display text-[14px] font-bold uppercase leading-none tracking-[0.02em]">
            {name}
          </span>
          <span className="mt-1 block truncate font-mono text-[9px] leading-none tracking-[0.06em] text-white/80">
            {email}
          </span>
        </span>
      </div>
      {children && <div className="flex gap-2">{children}</div>}
    </div>
  );
}

/** Square sub-CTA inside the AccountMenuCell. Renders as a button or link
 *  depending on whether `href` is provided. */
export interface AccountSubCtaProps {
  icon: ReactNode;
  label: string;
  href?: string;
  external?: boolean;
  onClick?: () => void;
}

export function AccountSubCta({ icon, label, href, external, onClick }: AccountSubCtaProps) {
  const cls =
    "ds-interactive grid h-9 w-9 place-items-center rounded-sq border border-white/30 bg-white/[0.15] text-white outline-none active:scale-[0.92] hover:border-white/60 hover:bg-white/25";

  if (href) {
    return (
      <a
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        aria-label={label}
        title={label}
        onClick={onClick}
        className={cls}
      >
        {icon}
      </a>
    );
  }

  return (
    <button type="button" aria-label={label} title={label} onClick={onClick} className={cls}>
      {icon}
    </button>
  );
}
