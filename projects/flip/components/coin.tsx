"use client";

// Animated 3D coin. Two faces (JR for heads, ★ for tails) on opposite
// sides of a single element. The parent passes total rotation in degrees,
// and CSS handles the spin by transitioning rotateY.

import type { CSSProperties } from "react";

import { cn } from "@/lib/cn";

interface CoinProps {
  /** Total rotation in degrees. Mod 360 determines which face is showing. */
  rotation: number;
  /** Whether the rotation transition is currently active. */
  flipping: boolean;
  size?: number;
}

export function Coin({ rotation, flipping, size = 220 }: CoinProps) {
  return (
    <div
      className="relative grid place-items-center"
      style={{ perspective: "1400px", height: size, width: size }}
    >
      <div
        className={cn(
          "relative h-full w-full [transform-style:preserve-3d]",
          flipping
            ? "transition-transform duration-[1100ms] [transition-timing-function:cubic-bezier(.32,.04,.34,1)]"
            : "transition-none",
        )}
        style={{ transform: `rotateY(${rotation}deg)` }}
      >
        <Face label="JR" tone="heads" />
        <Face label="★" tone="tails" flipped />
      </div>
    </div>
  );
}

function Face({
  label,
  tone,
  flipped = false,
}: {
  label: string;
  tone: "heads" | "tails";
  flipped?: boolean;
}) {
  const style: CSSProperties = {
    transform: flipped ? "rotateY(180deg)" : undefined,
    backfaceVisibility: "hidden",
    WebkitBackfaceVisibility: "hidden",
  };
  return (
    <div
      style={style}
      className={cn(
        "absolute inset-0 grid place-items-center rounded-round border-[3px] font-display font-black tracking-tight select-none",
        tone === "heads"
          ? "border-accent bg-accent text-accent-on shadow-[0_0_48px_var(--accent-glow)] text-7xl"
          : "border-accent bg-surface-2 text-accent text-8xl",
      )}
    >
      {label}
    </div>
  );
}
