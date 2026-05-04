"use client";

import { useEffect } from "react";
import { Button, Eyebrow } from "@/components/ui";
import { cn } from "@/lib/cn";
import { alarmDing } from "../lib/beep";
import type { Recipe } from "../data/recipes";
import { formatDuration, useTimer } from "../hooks/use-timer";

interface CookStepCardProps {
  recipe: Recipe;
  stepIndex: number;
  onNext: () => void;
  onPrev: () => void;
  onExit: () => void;
}

export function CookStepCard({
  recipe,
  stepIndex,
  onNext,
  onPrev,
  onExit,
}: CookStepCardProps) {
  const step = recipe.steps[stepIndex];
  const isLast = stepIndex === recipe.steps.length - 1;

  return (
    <main className="space-y-8">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onExit}
          className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-mute hover:text-accent"
        >
          ← End cook
        </button>
        <Eyebrow tone="mute" size="sm">
          {`// STEP ${(stepIndex + 1).toString().padStart(2, "0")} OF ${recipe.steps.length
            .toString()
            .padStart(2, "0")}`}
        </Eyebrow>
      </div>

      {/* Progress bar */}
      <div className="h-1 w-full overflow-hidden rounded-round bg-surface-2">
        <div
          className="h-full rounded-round bg-accent transition-[width] duration-[var(--t)]"
          style={{ width: `${((stepIndex + 1) / recipe.steps.length) * 100}%` }}
        />
      </div>

      {/* The big card */}
      <article className="rounded-sq-xl border border-line-2 bg-surface p-6 sm:p-10">
        <p className="font-display text-3xl font-black leading-tight tracking-tight text-ink sm:text-4xl">
          {step.text}
        </p>

        {step.timer !== undefined && (
          <TimerBlock key={`${recipe.slug}-${stepIndex}`} seconds={step.timer} />
        )}
      </article>

      <div className="flex items-center justify-between gap-3">
        <Button variant="ghost" onClick={onPrev} disabled={stepIndex === 0}>
          ← Previous
        </Button>
        <Button variant="primary" onClick={onNext}>
          {isLast ? "Finish" : "Next →"}
        </Button>
      </div>
    </main>
  );
}

interface TimerBlockProps {
  seconds: number;
}

function TimerBlock({ seconds }: TimerBlockProps) {
  const timer = useTimer(seconds, alarmDing);

  // Reset the alarmDing fired-once guard isn't needed here because useTimer
  // only calls onDone exactly when the timer transitions to "done".

  // Subtle pulse on the timer when running.
  useEffect(() => {
    // no-op; visual is via class below
  }, [timer.state]);

  return (
    <div className="mt-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-6">
      <div
        className={cn(
          "rounded-sq-md border px-5 py-3 font-display text-5xl font-black leading-none tabular-nums tracking-tight",
          timer.state === "done"
            ? "border-accent bg-accent/[0.08] text-accent shadow-glow animate-[ds-pulse_1.6s_ease-in-out_infinite]"
            : timer.state === "running"
              ? "border-accent bg-accent/[0.04] text-ink shadow-glow"
              : "border-line-2 bg-surface-2 text-ink",
        )}
      >
        {formatDuration(timer.seconds)}
      </div>

      <div className="flex flex-wrap gap-2">
        {timer.state === "idle" && (
          <Button variant="primary" onClick={timer.start}>
            Start timer
          </Button>
        )}
        {timer.state === "running" && (
          <Button variant="secondary" onClick={timer.pause}>
            Pause
          </Button>
        )}
        {timer.state === "paused" && (
          <>
            <Button variant="primary" onClick={timer.start}>
              Resume
            </Button>
            <Button variant="ghost" onClick={timer.reset}>
              Reset
            </Button>
          </>
        )}
        {timer.state === "done" && (
          <span className="font-mono text-sm font-semibold uppercase tracking-[0.18em] text-accent">
            // DONE — TAP NEXT WHEN READY
          </span>
        )}
      </div>
    </div>
  );
}
