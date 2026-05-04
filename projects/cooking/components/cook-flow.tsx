"use client";

import { useState } from "react";
import { Button, Eyebrow } from "@/components/ui";
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
        onPrev={() => setStepIndex((i) => Math.max(0, i - 1))}
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
          Back to recipes
        </Button>
      </div>
    </main>
  );
}
