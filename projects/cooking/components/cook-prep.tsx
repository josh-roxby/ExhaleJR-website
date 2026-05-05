"use client";

import { useState } from "react";
import { Button, Eyebrow, NavItem, NavSecondary, Tag } from "@/components/ui";
import { cn } from "@/lib/cn";
import type { Recipe } from "../data/recipes";

interface CookPrepProps {
  recipe: Recipe;
  onStart: () => void;
  onBack: () => void;
}

export function CookPrep({ recipe, onStart, onBack }: CookPrepProps) {
  const [checked, setChecked] = useState<Set<number>>(new Set());

  const toggle = (idx: number) => {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };

  const allChecked = checked.size === recipe.ingredients.length;

  return (
    <main className="mx-auto max-w-4xl space-y-10">
      <NavSecondary>
        <NavItem aria-label="Back to recipe" onClick={onBack}>
          <ChevronLeftIcon />
        </NavItem>
        <NavItem aria-label="Start cooking" onClick={onStart}>
          <ChevronRightIcon />
        </NavItem>
      </NavSecondary>

      <button
        type="button"
        onClick={onBack}
        className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-mute hover:text-accent"
      >
        ← Back
      </button>

      <header>
        <Eyebrow tone="accent" withPulseDot>{`// PREP · ${recipe.slug.toUpperCase()}`}</Eyebrow>
        <h1 className="mt-2 font-display text-5xl font-black leading-[0.95] tracking-tight">
          Mise en <span className="text-accent">place</span>.
        </h1>
        <p className="mt-3 max-w-xl text-ink-2">
          Lay everything out before we start. Tap to check off as you go. You don&apos;t
          have to check them all to begin.
        </p>
        {allChecked && (
          <Tag variant="ok" className="mt-3">
            All set
          </Tag>
        )}
      </header>

      <ul className="space-y-2">
        {recipe.ingredients.map((i, idx) => {
          const isChecked = checked.has(idx);
          return (
            <li key={idx}>
              <button
                type="button"
                onClick={() => toggle(idx)}
                className={cn(
                  "ds-interactive flex w-full items-center gap-3 rounded-sq border bg-surface p-4 text-left outline-none active:scale-[0.99]",
                  isChecked
                    ? "border-accent bg-accent/[0.08]"
                    : "border-line hover:border-line-2",
                )}
              >
                <span
                  className={cn(
                    "grid h-5 w-5 shrink-0 place-items-center rounded-sq-xs border",
                    isChecked
                      ? "border-accent bg-accent shadow-glow"
                      : "border-line-3 bg-surface-2",
                  )}
                  aria-hidden
                >
                  {isChecked && (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  )}
                </span>
                <span className="min-w-[5rem] font-mono text-sm font-semibold text-accent">
                  {i.qty}
                </span>
                <span
                  className={cn(
                    "font-display text-base font-semibold uppercase tracking-tight",
                    isChecked ? "text-mute line-through" : "text-ink",
                  )}
                >
                  {i.item}
                </span>
                {i.notes && (
                  <span className="text-sm text-mute">{i.notes}</span>
                )}
              </button>
            </li>
          );
        })}
      </ul>

      <div className="flex justify-end">
        <Button onClick={onStart} variant="primary">
          Start cooking →
        </Button>
      </div>
    </main>
  );
}

function ChevronLeftIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path d="M9 18l6-6-6-6" />
    </svg>
  );
}
