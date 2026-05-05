"use client";

import { useEffect, useState } from "react";

import { Button, Eyebrow, Tab, Tabs } from "@/components/ui";

import { Coin } from "./components/coin";
import { Result, Tally } from "./components/tally";
import { tink } from "./lib/sound";

export type Side = "heads" | "tails";
type Mode = "single" | "best-of-3" | "best-of-5";

const MODES: Record<Mode, { needed: number; cap: number }> = {
  single: { needed: 1, cap: 1 },
  "best-of-3": { needed: 2, cap: 3 },
  "best-of-5": { needed: 3, cap: 5 },
};

const FLIP_DURATION = 1100;

export function Page() {
  const [mode, setMode] = useState<Mode>("single");
  const [flips, setFlips] = useState<Side[]>([]);
  const [rotation, setRotation] = useState(0);
  const [flipping, setFlipping] = useState(false);

  const { needed, cap } = MODES[mode];
  const heads = flips.filter((f) => f === "heads").length;
  const tails = flips.filter((f) => f === "tails").length;
  const winner: Side | null =
    heads >= needed ? "heads" : tails >= needed ? "tails" : null;
  const finished = winner !== null || flips.length >= cap;

  const reset = () => {
    setFlips([]);
    setRotation(0);
  };

  // Reset whenever the mode changes so old runs don't leak in.
  useEffect(() => {
    setFlips([]);
    setRotation(0);
  }, [mode]);

  const flip = () => {
    if (flipping || finished) return;
    const newSide: Side = Math.random() < 0.5 ? "heads" : "tails";

    // Where is the coin currently? mod 360 → 0 means heads-up, 180 means
    // tails-up. Compute the additional rotation needed to land on newSide
    // after a few full turns.
    const mod = ((rotation % 360) + 360) % 360;
    const currentSide: Side = mod < 90 || mod > 270 ? "heads" : "tails";
    const turns = 3 + Math.floor(Math.random() * 2); // 3 or 4 full turns
    const additional = turns * 360 + (newSide !== currentSide ? 180 : 0);

    setFlipping(true);
    setRotation((r) => r + additional);

    window.setTimeout(() => {
      tink();
      setFlips((prev) => [...prev, newSide]);
      setFlipping(false);
    }, FLIP_DURATION);
  };

  return (
    <main className="mx-auto max-w-2xl space-y-8 pb-12">
      <header>
        <Eyebrow tone="accent" withPulseDot>// FLIP · v0.0</Eyebrow>
        <h1 className="mt-2 font-display text-5xl font-black leading-[0.95] tracking-tight">
          Heads or <span className="text-accent">tails</span>?
        </h1>
        <p className="mt-3 max-w-xl text-ink-2">
          Pick a mode and tap. Best-of-N stops as soon as one side has the
          majority.
        </p>
      </header>

      <Tabs
        value={mode}
        onChange={(v) => setMode(v as Mode)}
        variant="pill"
      >
        <Tab value="single">Single</Tab>
        <Tab value="best-of-3">Best of 3</Tab>
        <Tab value="best-of-5">Best of 5</Tab>
      </Tabs>

      <div className="flex justify-center py-6">
        <Coin rotation={rotation} flipping={flipping} />
      </div>

      {mode !== "single" && (
        <Tally flips={flips} needed={needed} cap={cap} winner={winner} />
      )}

      {finished && winner && <Result winner={winner} />}

      <div className="flex justify-center gap-3">
        {finished ? (
          <Button onClick={reset} variant="primary">
            Reset
          </Button>
        ) : (
          <Button
            onClick={flip}
            variant="primary"
            disabled={flipping}
          >
            {flipping
              ? "Flipping…"
              : flips.length === 0
                ? "Flip"
                : "Flip again"}
          </Button>
        )}
      </div>
    </main>
  );
}
