"use client";

// Fc1 — square checkbox. See DESIGN-SYSTEM.md §4.7.
import { useState, type ChangeEventHandler, type ComponentProps, type ReactNode } from "react";
import { cn } from "@/lib/cn";

export interface CheckboxProps extends Omit<ComponentProps<"input">, "type" | "size"> {
  label?: ReactNode;
  size?: "sm" | "md";
}

export function Checkbox({
  label,
  size = "md",
  checked,
  defaultChecked,
  onChange,
  disabled,
  className,
  ...rest
}: CheckboxProps) {
  const [internal, setInternal] = useState(defaultChecked ?? false);
  const isControlled = checked !== undefined;
  const isChecked = isControlled ? checked : internal;

  const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    if (!isControlled) setInternal(e.target.checked);
    onChange?.(e);
  };

  const dim = size === "sm" ? "h-4 w-4" : "h-5 w-5";
  const iconSize = size === "sm" ? 10 : 12;

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
        checked={isChecked}
        onChange={handleChange}
        disabled={disabled}
        className="peer sr-only"
        {...rest}
      />
      <span
        className={cn(
          "ds-interactive grid shrink-0 place-items-center rounded-sq-xs border outline-none peer-focus-visible:ring-2 peer-focus-visible:ring-accent",
          dim,
          isChecked
            ? "border-accent bg-accent shadow-glow"
            : "border-line-3 bg-surface-2",
        )}
        aria-hidden
      >
        {isChecked && (
          <svg
            width={iconSize}
            height={iconSize}
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth={3.5}
          >
            <path d="M20 6L9 17l-5-5" />
          </svg>
        )}
      </span>
      {label && <span>{label}</span>}
    </label>
  );
}
