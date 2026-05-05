"use client";

// I3 — tabs. See DESIGN-SYSTEM.md §4.13.
// Three variants: pill (I3.2), underline (I3.1), segmented (I3.3).

import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";
import { cn } from "@/lib/cn";

export type TabsVariant = "pill" | "underline" | "segmented";

interface TabsCtx {
  value: string;
  onChange: (value: string) => void;
  variant: TabsVariant;
}

const Ctx = createContext<TabsCtx | null>(null);

export interface TabsProps {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  variant?: TabsVariant;
  children: ReactNode;
  className?: string;
}

export function Tabs({
  value,
  defaultValue,
  onChange,
  variant = "pill",
  children,
  className,
}: TabsProps) {
  const [internal, setInternal] = useState(defaultValue ?? "");
  const isControlled = value !== undefined;
  const current = isControlled ? value : internal;

  const handleChange = (v: string) => {
    if (!isControlled) setInternal(v);
    onChange?.(v);
  };

  return (
    <Ctx.Provider value={{ value: current, onChange: handleChange, variant }}>
      <div
        role="tablist"
        className={cn(
          "inline-flex items-center",
          variant === "pill" && "gap-1 rounded-round border border-line bg-surface-2 p-1",
          variant === "underline" && "gap-4 border-b border-line",
          variant === "segmented" && "overflow-hidden rounded-sq border border-line-2",
          className,
        )}
      >
        {children}
      </div>
    </Ctx.Provider>
  );
}

export interface TabProps {
  value: string;
  children: ReactNode;
  disabled?: boolean;
  className?: string;
}

export function Tab({ value, children, disabled, className }: TabProps) {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("Tab must be inside Tabs");
  const active = ctx.value === value;

  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      disabled={disabled}
      onClick={() => ctx.onChange(value)}
      className={cn(
        "ds-interactive font-mono text-[10px] font-bold uppercase tracking-[0.18em] outline-none active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-50",
        ctx.variant === "pill" && [
          "rounded-round px-3 py-1.5",
          active
            ? "bg-accent text-accent-on shadow-glow"
            : "text-mute hover:text-ink",
        ],
        ctx.variant === "underline" && [
          "relative pb-2.5 pt-1",
          active ? "text-ink" : "text-mute hover:text-ink",
          active &&
            "after:absolute after:-bottom-px after:left-0 after:right-0 after:h-0.5 after:bg-accent after:shadow-[0_0_8px_var(--accent-glow)]",
        ],
        ctx.variant === "segmented" && [
          "px-3 py-2 [&:not(:last-child)]:border-r [&:not(:last-child)]:border-line-2",
          active
            ? "bg-accent text-accent-on"
            : "bg-surface-2 text-mute hover:text-ink",
        ],
        className,
      )}
    >
      {children}
    </button>
  );
}
