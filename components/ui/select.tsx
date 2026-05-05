"use client";

// E — select / dropdown. See DESIGN-SYSTEM.md §4.6.
// Opaque #161616 menu, square radius, slide-down animation, click-outside +
// Esc close.

import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";

export interface SelectOption {
  value: string;
  label: ReactNode;
}

export interface SelectProps {
  options: SelectOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  "aria-label"?: string;
}

export function Select({
  options,
  value,
  defaultValue,
  onChange,
  placeholder = "Select…",
  disabled,
  className,
  "aria-label": ariaLabel,
}: SelectProps) {
  const [internal, setInternal] = useState(defaultValue);
  const isControlled = value !== undefined;
  const current = isControlled ? value : internal;
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("mousedown", onClick);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("mousedown", onClick);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const select = (v: string) => {
    if (!isControlled) setInternal(v);
    onChange?.(v);
    setOpen(false);
  };

  const selectedOption = options.find((o) => o.value === current);

  return (
    <div ref={ref} className={cn("relative inline-block w-full", className)}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={ariaLabel}
        disabled={disabled}
        className={cn(
          "ds-interactive flex w-full items-center justify-between gap-2 rounded-sq border border-line-2 bg-surface-2 px-3.5 py-2.5 text-left text-sm text-ink outline-none active:scale-[0.99] hover:border-line-3 focus:border-accent focus:shadow-[0_0_0_3px_var(--accent-glow)] disabled:cursor-not-allowed disabled:opacity-50",
        )}
      >
        <span className={cn("truncate", !selectedOption && "text-mute-3")}>
          {selectedOption?.label ?? placeholder}
        </span>
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          className={cn(
            "shrink-0 text-mute transition-transform duration-[var(--t)]",
            open && "rotate-180",
          )}
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {open && (
        <ul
          role="listbox"
          className="absolute left-0 right-0 top-[calc(100%+4px)] z-10 max-h-60 overflow-y-auto rounded-sq border border-line-2 bg-[#161616] p-1 shadow-[0_16px_40px_rgba(0,0,0,.7),0_4px_8px_rgba(0,0,0,.4)] [animation:ds-menu-in_var(--t)_var(--ease)]"
        >
          {options.map((opt) => (
            <li key={opt.value}>
              <button
                type="button"
                role="option"
                aria-selected={current === opt.value}
                onClick={() => select(opt.value)}
                className={cn(
                  "ds-interactive w-full cursor-pointer rounded-sq-xs px-3 py-2 text-left text-sm outline-none active:scale-[0.99] hover:bg-surface-3",
                  current === opt.value ? "text-accent" : "text-ink-2",
                )}
              >
                {opt.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
