// D — text input. See DESIGN-SYSTEM.md §4.5.
// Square (sq), surface-2 fill, Iris focus ring. Optional leading/trailing slots.
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/cn";

export interface TextInputProps extends ComponentProps<"input"> {
  leadingIcon?: ReactNode;
  trailingElement?: ReactNode;
  /** Visual error state — red border. */
  invalid?: boolean;
}

const base =
  "w-full rounded-sq border border-line-2 bg-surface-2 py-2.5 text-sm text-ink placeholder:text-mute-3 outline-none transition-colors duration-[var(--t)] focus:border-accent focus:bg-surface focus:shadow-[0_0_0_3px_var(--accent-glow)] disabled:opacity-50";

export function TextInput({
  leadingIcon,
  trailingElement,
  invalid = false,
  className,
  ...rest
}: TextInputProps) {
  const invalidClass = invalid ? "!border-warn focus:!shadow-[0_0_0_3px_rgba(255,91,61,.22)]" : "";

  if (!leadingIcon && !trailingElement) {
    return <input {...rest} className={cn(base, "px-3.5", invalidClass, className)} />;
  }

  return (
    <div className="relative w-full">
      {leadingIcon && (
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-mute-2">
          {leadingIcon}
        </span>
      )}
      <input
        {...rest}
        className={cn(
          base,
          leadingIcon ? "pl-10" : "pl-3.5",
          trailingElement ? "pr-10" : "pr-3.5",
          invalidClass,
          className,
        )}
      />
      {trailingElement && (
        <span className="absolute right-2 top-1/2 -translate-y-1/2">{trailingElement}</span>
      )}
    </div>
  );
}

// D — field label. Mono caps eyebrow above an input.
export interface FieldLabelProps extends ComponentProps<"label"> {}

export function FieldLabel({ className, children, ...rest }: FieldLabelProps) {
  return (
    <label
      {...rest}
      className={cn(
        "font-mono text-[9px] font-semibold uppercase tracking-[0.18em] text-mute",
        className,
      )}
    >
      {children}
    </label>
  );
}
