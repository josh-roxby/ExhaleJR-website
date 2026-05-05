"use client";

// H — slider. See DESIGN-SYSTEM.md §4.9.
// Native input range with custom track + thumb styling. Track shows an Iris
// fill with a soft glow up to the current value. Thumb is round, ink default,
// scales 1.2x while grabbing.

import { useState, type ChangeEventHandler, type ComponentProps } from "react";
import { cn } from "@/lib/cn";

export interface SliderProps extends Omit<ComponentProps<"input">, "type" | "value" | "defaultValue" | "onChange"> {
  value?: number;
  defaultValue?: number;
  onChange?: (value: number) => void;
  /** Show the current value to the right of the track. */
  showValue?: boolean;
  /** Format the displayed value. Default: integer. */
  formatValue?: (v: number) => string;
}

export function Slider({
  value,
  defaultValue,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  showValue = false,
  formatValue,
  disabled,
  className,
  ...rest
}: SliderProps) {
  const numericMin = Number(min);
  const numericMax = Number(max);
  const [internal, setInternal] = useState<number>(
    defaultValue ?? numericMin,
  );
  const isControlled = value !== undefined;
  const current = isControlled ? value : internal;
  const pct = ((current - numericMin) / (numericMax - numericMin)) * 100;

  const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const n = Number(e.target.value);
    if (!isControlled) setInternal(n);
    onChange?.(n);
  };

  return (
    <div
      className={cn(
        "flex items-center gap-3",
        disabled && "opacity-50",
        className,
      )}
    >
      <div className="relative h-5 flex-1">
        <div className="absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 rounded-round bg-surface-3" />
        <div
          className="absolute left-0 top-1/2 h-1 -translate-y-1/2 rounded-round bg-accent shadow-[0_0_8px_var(--accent-glow)]"
          style={{ width: `${pct}%` }}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={current}
          onChange={handleChange}
          disabled={disabled}
          className={cn(
            "absolute inset-0 w-full appearance-none bg-transparent outline-none",
            "[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:rounded-round [&::-webkit-slider-thumb]:bg-ink [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:duration-[var(--t)] active:[&::-webkit-slider-thumb]:scale-[1.2]",
            "[&::-moz-range-thumb]:h-3.5 [&::-moz-range-thumb]:w-3.5 [&::-moz-range-thumb]:rounded-round [&::-moz-range-thumb]:bg-ink [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:cursor-pointer active:[&::-moz-range-thumb]:scale-[1.2]",
            "focus-visible:[&::-webkit-slider-thumb]:ring-2 focus-visible:[&::-webkit-slider-thumb]:ring-accent",
            disabled && "cursor-not-allowed",
          )}
          {...rest}
        />
      </div>
      {showValue && (
        <span className="min-w-[3ch] text-right font-mono text-sm tabular-nums text-mute">
          {formatValue ? formatValue(current) : current}
        </span>
      )}
    </div>
  );
}
