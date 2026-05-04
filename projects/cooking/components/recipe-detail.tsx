"use client";

import { Button, Eyebrow, Tag } from "@/components/ui";
import type { Recipe } from "../data/recipes";
import { formatDuration } from "../hooks/use-timer";

interface RecipeDetailProps {
  recipe: Recipe;
  onCook: () => void;
  onBack: () => void;
}

export function RecipeDetail({ recipe, onCook, onBack }: RecipeDetailProps) {
  return (
    <main className="space-y-10">
      <button
        type="button"
        onClick={onBack}
        className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-mute hover:text-accent"
      >
        ← All recipes
      </button>

      <header>
        <Eyebrow tone="accent" withPulseDot>{`// RECIPE · ${recipe.slug.toUpperCase()}`}</Eyebrow>
        <h1 className="mt-2 font-display text-5xl font-black leading-[0.95] tracking-tight">
          {recipe.name}.
        </h1>
        <p className="mt-3 max-w-xl text-ink-2">{recipe.description}</p>
        <div className="mt-4 flex flex-wrap gap-1.5">
          <Tag>{recipe.prepTime} min prep</Tag>
          <Tag>{recipe.cookTime} min cook</Tag>
          <Tag>serves {recipe.servings}</Tag>
          {recipe.tags.map((t) => (
            <Tag key={t}>{t}</Tag>
          ))}
        </div>
      </header>

      <section>
        <Eyebrow tone="mute" size="sm">// INGREDIENTS</Eyebrow>
        <ul className="mt-3 space-y-2">
          {recipe.ingredients.map((i, idx) => (
            <li key={idx} className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className="min-w-[5.5rem] font-mono text-sm font-semibold text-accent">
                {i.qty}
              </span>
              <span className="font-display text-base font-semibold uppercase tracking-tight text-ink">
                {i.item}
              </span>
              {i.notes && <span className="text-sm text-mute">{i.notes}</span>}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <Eyebrow tone="mute" size="sm">// STEPS</Eyebrow>
        <ol className="mt-3 space-y-3">
          {recipe.steps.map((s, idx) => (
            <li key={idx} className="flex gap-3 text-ink-2">
              <span className="font-mono text-accent">
                {(idx + 1).toString().padStart(2, "0")}
              </span>
              <span className="flex-1">
                {s.text}
                {s.timer && (
                  <Tag variant="accent" className="ml-2">
                    timer {formatDuration(s.timer)}
                  </Tag>
                )}
              </span>
            </li>
          ))}
        </ol>
      </section>

      <div className="flex justify-end">
        <Button onClick={onCook} variant="primary">
          Cook this →
        </Button>
      </div>
    </main>
  );
}
