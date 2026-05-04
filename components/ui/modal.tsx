"use client";

// Generic modal. See DESIGN-SYSTEM.md §3.5 — modal surface is
// rgba(17,17,17,0.98) with blur(24px), backdrop is rgba(0,0,0,0.7) with
// blur(10px). Esc closes; backdrop click closes.

import { useEffect, type ReactNode } from "react";
import { cn } from "@/lib/cn";

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  /** Mono caps eyebrow above the title. */
  eyebrow?: ReactNode;
  /** Display heading. */
  title?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function Modal({ open, onClose, eyebrow, title, children, className }: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  return (
    <div
      aria-hidden={!open}
      className={cn(
        "fixed inset-0 z-50 grid place-items-center p-4 transition-opacity duration-[var(--t)]",
        open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
      )}
    >
      <div
        onClick={onClose}
        aria-hidden
        className="fixed inset-0 -z-10 bg-black/70 [backdrop-filter:blur(10px)] [-webkit-backdrop-filter:blur(10px)]"
      />
      <div
        role="dialog"
        aria-modal="true"
        className={cn(
          "relative flex max-h-[90dvh] w-full max-w-2xl flex-col gap-4 rounded-sq-xl border border-line-2 p-6 transition-transform duration-[var(--t)] [background-color:rgba(17,17,17,0.98)] [backdrop-filter:blur(24px)] [-webkit-backdrop-filter:blur(24px)] [box-shadow:0_24px_48px_rgba(0,0,0,.6)]",
          open ? "scale-100" : "scale-[0.96]",
          className,
        )}
      >
        <header className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            {eyebrow && (
              <div className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-mute-2">
                {eyebrow}
              </div>
            )}
            {title && (
              <h2 className="mt-1 font-display text-3xl font-black tracking-tight">{title}</h2>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="ds-interactive grid h-8 w-8 shrink-0 place-items-center rounded-round text-mute outline-none active:scale-[0.85] hover:bg-surface-2 hover:text-ink"
          >
            <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <line x1="6" y1="6" x2="18" y2="18" />
              <line x1="6" y1="18" x2="18" y2="6" />
            </svg>
          </button>
        </header>
        <div className="min-h-0 flex-1 overflow-y-auto [scrollbar-color:var(--line-3)_transparent] [scrollbar-width:thin] [&::-webkit-scrollbar-thumb]:rounded-round [&::-webkit-scrollbar-thumb]:bg-line-3 [&::-webkit-scrollbar]:w-1">
          {children}
        </div>
      </div>
    </div>
  );
}
