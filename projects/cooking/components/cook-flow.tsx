"use client";

import { useState } from "react";
import { Button, Eyebrow, NavItem, NavSecondary } from "@/components/ui";
import type { Recipe } from "../data/recipes";
import { CookPrep } from "./cook-prep";
import { CookStepCard } from "./cook-step-card";

interface CookFlowProps {
  recipe: Recipe;
  onExit: () => void;
}

type Phase = "prep" | "step" | "done";

export function CookFlow({ recipe, onExit }: CookFlowProps) {
  const [phase, setPhase] = useState<Phase>("prep");
  const [stepIndex, setStepIndex] = useState(0);

  if (phase === "prep") {
    return (
      <CookPrep
        recipe={recipe}
        onStart={() => {
          setStepIndex(0);
          setPhase("step");
        }}
        onBack={onExit}
      />
    );
  }

  if (phase === "step") {
    return (
      <CookStepCard
        recipe={recipe}
        stepIndex={stepIndex}
        // At step 0, "prev" rewinds to the prep view rather than locking up.
        onPrev={() => {
          if (stepIndex === 0) {
            setPhase("prep");
          } else {
            setStepIndex((i) => i - 1);
          }
        }}
        onNext={() => {
          if (stepIndex >= recipe.steps.length - 1) {
            setPhase("done");
          } else {
            setStepIndex((i) => i + 1);
          }
        }}
        onExit={onExit}
      />
    );
  }

  return <Done recipe={recipe} onExit={onExit} />;
}

function Done({ recipe, onExit }: { recipe: Recipe; onExit: () => void }) {
  return (
    <main className="space-y-8 py-12 text-center sm:py-20">
      <NavSecondary>
        <NavItem aria-label="Back to recipe" onClick={onExit}>
          <ChevronLeftIcon />
        </NavItem>
      </NavSecondary>

      <Eyebrow tone="accent" withPulseDot className="justify-center">
        // DONE
      </Eyebrow>
      <h1 className="font-display text-6xl font-black leading-[0.95] tracking-tight sm:text-7xl">
        {recipe.name}.
      </h1>
      <p className="mx-auto max-w-md text-ink-2">
        Plated, served, eaten. Hope it landed.
      </p>
      <div className="flex justify-center">
        <Button variant="primary" onClick={onExit}>
          Back to recipe
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
