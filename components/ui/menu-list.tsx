// Lab list cell — flex:1 inside the popover, internal scroll only.
// See DESIGN-SYSTEM.md §5.3 ("LAB LIST CELL").
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/cn";

export interface MenuListCellProps extends Omit<ComponentProps<"div">, "title"> {
  title: ReactNode;
  count?: ReactNode;
}

export function MenuListCell({
  title,
  count,
  className,
  children,
  ...rest
}: MenuListCellProps) {
  return (
    <div
      {...rest}
      className={cn(
        "flex min-h-0 flex-1 flex-col overflow-hidden rounded-sq border border-line bg-surface-2",
        className,
      )}
    >
      <div className="flex shrink-0 items-center justify-between border-b border-line px-3 pb-2 pt-2.5 font-mono text-[8px] font-bold uppercase tracking-[0.22em] text-mute-2">
        <span>{title}</span>
        {count !== undefined && (
          <span className="rounded-sq-xs bg-accent/[0.12] px-1.5 py-0.5 text-accent">{count}</span>
        )}
      </div>
      <ul
        className="min-h-0 flex-1 list-none overflow-y-auto p-1 [scrollbar-color:var(--line-3)_transparent] [scrollbar-width:thin] [&::-webkit-scrollbar-thumb]:rounded-round [&::-webkit-scrollbar-thumb]:bg-line-3 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar]:w-1"
      >
        {children}
      </ul>
    </div>
  );
}

export interface MenuListItemProps extends ComponentProps<"button"> {
  label: ReactNode;
  meta?: ReactNode;
}

export function MenuListItem({
  label,
  meta,
  className,
  ...rest
}: MenuListItemProps) {
  return (
    <li>
      <button
        {...rest}
        className={cn(
          "ds-interactive group flex w-full items-center justify-between gap-2.5 rounded-sq-xs px-2.5 py-2.5 text-left text-xs text-ink-2 outline-none active:scale-[0.99] hover:bg-surface-3 hover:text-ink",
          className,
        )}
      >
        <span>{label}</span>
        <span className="flex items-center gap-2 text-mute-3 transition-colors duration-[var(--t)] group-hover:text-accent">
          {meta && (
            <span className="font-mono text-[9px] tracking-[0.06em] text-mute-2 transition-colors duration-[var(--t)] group-hover:text-accent-dim">
              {meta}
            </span>
          )}
          <svg
            width="10"
            height="10"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="transition-transform duration-[var(--t)] group-hover:translate-x-0.5"
            aria-hidden
          >
            <path d="M9 18l6-6-6-6" />
          </svg>
        </span>
      </button>
    </li>
  );
}
