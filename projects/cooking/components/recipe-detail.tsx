"use client";

import {
  Button,
  Card,
  Eyebrow,
  NavItem,
  NavSecondary,
  Tag,
} from "@/components/ui";
import type { Recipe } from "../data/recipes";
import { formatDuration } from "../hooks/use-timer";

interface RecipeDetailProps {
  recipe: Recipe;
  onCook: () => void;
  onBack: () => void;
}

export function RecipeDetail({ recipe, onCook, onBack }: RecipeDetailProps) {
  return (
    <main className="mx-auto max-w-4xl space-y-10">
      <NavSecondary>
        <NavItem aria-label="Back to all recipes" onClick={onBack}>
          <ChevronLeftIcon />
        </NavItem>
        <NavItem aria-label="Cook this recipe" onClick={onCook}>
          <ChevronRightIcon />
        </NavItem>
      </NavSecondary>

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
        <Card hover="none" className="mt-3 p-5">
          <ul className="space-y-2.5">
            {recipe.ingredients.map((i, idx) => (
              <li
                key={idx}
                className="flex flex-wrap items-baseline gap-x-3 gap-y-1"
              >
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
        </Card>
      </section>

      <section>
        <Eyebrow tone="mute" size="sm">// STEPS</Eyebrow>
        <ol className="mt-3 space-y-2">
          {recipe.steps.map((s, idx) => (
            <li key={idx}>
              <Card hover="none" className="flex gap-4 p-4">
                <span className="font-mono text-base font-bold text-accent shrink-0">
                  {(idx + 1).toString().padStart(2, "0")}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-ink-2">{s.text}</p>
                  {s.timer !== undefined && (
                    <Tag variant="accent" className="mt-2">
                      timer {formatDuration(s.timer)}
                    </Tag>
                  )}
                </div>
              </Card>
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
