// Mono uppercase eyebrow — used in section headers, hero, project meta.
// Pulse-dot variant matches the hero eyebrow on jr-mobile-home-concept-v3.
import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

export interface EyebrowProps extends ComponentProps<"div"> {
  tone?: "mute" | "ink" | "accent";
  size?: "xs" | "sm";
  withPulseDot?: boolean;
}

const toneClass = {
  mute: "text-mute-2",
  ink: "text-ink",
  accent: "text-accent",
};

const sizeClass = {
  xs: "text-[9px] tracking-[0.22em]",
  sm: "text-[10px] tracking-[0.2em]",
};

export function Eyebrow({
  tone = "mute",
  size = "sm",
  withPulseDot = false,
  className,
  children,
  ...rest
}: EyebrowProps) {
  return (
    <div
      {...rest}
      className={cn(
        "inline-flex items-center gap-2 font-mono font-bold uppercase",
        toneClass[tone],
        sizeClass[size],
        className,
      )}
    >
      {withPulseDot && (
        <span className="h-[5px] w-[5px] animate-[ds-pulse_1.6s_ease-in-out_infinite] rounded-round bg-accent shadow-[0_0_6px_var(--accent-glow)]" />
      )}
      {children}
    </div>
  );
}
