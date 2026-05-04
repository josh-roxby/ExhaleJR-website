"use client";

// Cooking — recipe player with step-by-step timers and a ding when each
// timer ends. State machine lives inline: list -> detail -> prep -> step -> done.

import { useState } from "react";
import { CookFlow } from "./components/cook-flow";
import { RecipeDetail } from "./components/recipe-detail";
import { RecipeList } from "./components/recipe-list";
import { getRecipe, recipes } from "./data/recipes";

type Mode = "detail" | "cook";

export function Page() {
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [mode, setMode] = useState<Mode>("detail");

  const selected = selectedSlug ? getRecipe(selectedSlug) ?? null : null;

  if (!selected) {
    return <RecipeList recipes={recipes} onPick={setSelectedSlug} />;
  }

  if (mode === "cook") {
    return (
      <CookFlow
        recipe={selected}
        onExit={() => setMode("detail")}
      />
    );
  }

  return (
    <RecipeDetail
      recipe={selected}
      onCook={() => setMode("cook")}
      onBack={() => {
        setSelectedSlug(null);
        setMode("detail");
      }}
    />
  );
}
