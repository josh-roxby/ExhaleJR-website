// Bento popover with backdrop. See DESIGN-SYSTEM.md §5.3 + §5.4.
// Controlled component: parent manages `open` and `onClose`. Parent must
// also establish a stacking context (isolation: isolate) per §3.6.
"use client";

import { useEffect } from "react";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export interface MenuPopoverProps {
  open: boolean;
  onClose: () => void;
  /** Header eyebrow (mono caps). */
  title?: ReactNode;
  /** 3x3 grid of cells (account hero + actions). */
  grid: ReactNode;
  /** Flex:1 list cell that fills remaining height. */
  list?: ReactNode;
  className?: string;
}

export function MenuPopover({
  open,
  onClose,
  title = "// QUICK ACCESS",
  grid,
  list,
  className,
}: MenuPopoverProps) {
  // Close on Escape per general overlay convention.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <>
      <PopoverBackdrop open={open} onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        aria-hidden={!open}
        className={cn(
          "absolute bottom-[78px] left-3.5 right-3.5 z-50 flex h-[560px] max-h-[calc(100%-110px)] flex-col gap-2.5 overflow-hidden rounded-sq-xl border border-line-2 bg-[#161616] p-3.5 transition-[opacity,transform] duration-[var(--t)] ease-[cubic-bezier(.2,.6,.2,1)] [box-shadow:0_-16px_48px_rgba(0,0,0,.7),0_8px_32px_rgba(0,0,0,.5),0_0_0_1px_rgba(0,0,0,.5)]",
          open
            ? "translate-y-0 scale-100 opacity-100 pointer-events-auto"
            : "translate-y-5 scale-[0.96] opacity-0 pointer-events-none",
          className,
        )}
      >
        <div className="flex shrink-0 items-center justify-between px-1.5 py-1">
          <div className="font-mono text-[9px] font-bold uppercase tracking-[0.22em] text-mute-2">
            {title}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="ds-interactive grid h-6 w-6 place-items-center rounded-round text-mute outline-none active:scale-[0.85] hover:bg-surface-2 hover:text-ink"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="6" y1="6" x2="18" y2="18" />
              <line x1="6" y1="18" x2="18" y2="6" />
            </svg>
          </button>
        </div>

        <div className="grid shrink-0 grid-cols-3 gap-1.5">{grid}</div>

        {list}
      </div>
    </>
  );
}

interface PopoverBackdropProps {
  open: boolean;
  onClick?: () => void;
}

export function PopoverBackdrop({ open, onClick }: PopoverBackdropProps) {
  return (
    <div
      onClick={onClick}
      aria-hidden
      className={cn(
        "absolute inset-0 z-30 bg-black/55 transition-opacity duration-[var(--t)] [backdrop-filter:blur(10px)_saturate(80%)] [-webkit-backdrop-filter:blur(10px)_saturate(80%)]",
        open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
      )}
    />
  );
}
