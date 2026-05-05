"use client";

// Fc2 — round radio. See DESIGN-SYSTEM.md §4.7.
import {
  createContext,
  useContext,
  useState,
  type ComponentProps,
  type ReactNode,
} from "react";
import { cn } from "@/lib/cn";

interface RadioGroupCtx {
  name: string;
  value: string | undefined;
  onChange: (value: string) => void;
  disabled?: boolean;
}

const Ctx = createContext<RadioGroupCtx | null>(null);

export interface RadioGroupProps {
  name: string;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  children: ReactNode;
  className?: string;
}

export function RadioGroup({
  name,
  value,
  defaultValue,
  onChange,
  disabled,
  children,
  className,
}: RadioGroupProps) {
  const [internal, setInternal] = useState(defaultValue);
  const isControlled = value !== undefined;
  const current = isControlled ? value : internal;

  const handleChange = (v: string) => {
    if (!isControlled) setInternal(v);
    onChange?.(v);
  };

  return (
    <Ctx.Provider value={{ name, value: current, onChange: handleChange, disabled }}>
      <div role="radiogroup" className={cn("flex flex-col gap-2", className)}>
        {children}
      </div>
    </Ctx.Provider>
  );
}

export interface RadioProps
  extends Omit<ComponentProps<"input">, "type" | "name" | "checked" | "value"> {
  value: string;
  label?: ReactNode;
}

export function Radio({ value, label, className, ...rest }: RadioProps) {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("Radio must be inside RadioGroup");
  const isChecked = ctx.value === value;
  const isDisabled = ctx.disabled || rest.disabled;

  return (
    <label
      className={cn(
        "inline-flex select-none items-center gap-2.5 text-sm text-ink",
        isDisabled ? "cursor-not-allowed opacity-50" : "cursor-pointer",
        className,
      )}
    >
      <input
        type="radio"
        name={ctx.name}
        value={value}
        checked={isChecked}
        disabled={isDisabled}
        onChange={() => ctx.onChange(value)}
        className="peer sr-only"
        {...rest}
      />
      <span
        className={cn(
          "ds-interactive grid h-5 w-5 shrink-0 place-items-center rounded-round border bg-surface-2 outline-none peer-focus-visible:ring-2 peer-focus-visible:ring-accent",
          isChecked ? "border-accent" : "border-line-3",
        )}
        aria-hidden
      >
        {isChecked && (
          <span className="h-[7px] w-[7px] rounded-round bg-accent shadow-glow" />
        )}
      </span>
      {label && <span>{label}</span>}
    </label>
  );
}
