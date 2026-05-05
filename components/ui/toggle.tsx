"use client";

// G — round toggle. See DESIGN-SYSTEM.md §4.8.
import { useState, type ChangeEventHandler, type ComponentProps, type ReactNode } from "react";
import { cn } from "@/lib/cn";

export interface ToggleProps extends Omit<ComponentProps<"input">, "type" | "size"> {
  label?: ReactNode;
}

export function Toggle({
  label,
  checked,
  defaultChecked,
  onChange,
  disabled,
  className,
  ...rest
}: ToggleProps) {
  const [internal, setInternal] = useState(defaultChecked ?? false);
  const isControlled = checked !== undefined;
  const isChecked = isControlled ? checked : internal;

  const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    if (!isControlled) setInternal(e.target.checked);
    onChange?.(e);
  };

  return (
    <label
      className={cn(
        "inline-flex select-none items-center gap-2.5 text-sm text-ink",
        disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer",
        className,
      )}
    >
      <input
        type="checkbox"
        role="switch"
        checked={isChecked}
        onChange={handleChange}
        disabled={disabled}
        className="peer sr-only"
        {...rest}
      />
      <span
        className={cn(
          "ds-interactive relative h-[18px] w-8 shrink-0 rounded-round transition-colors duration-[var(--t)] peer-focus-visible:ring-2 peer-focus-visible:ring-accent",
          isChecked ? "bg-accent shadow-glow" : "bg-surface-3",
        )}
        aria-hidden
      >
        <span
          className={cn(
            "absolute top-[2px] h-[14px] w-[14px] rounded-round transition-[left,background-color] duration-[var(--t)] ease-[cubic-bezier(.2,.6,.2,1)]",
            isChecked ? "left-4 bg-white" : "left-[2px] bg-mute",
          )}
        />
      </span>
      {label && <span>{label}</span>}
    </label>
  );
}
