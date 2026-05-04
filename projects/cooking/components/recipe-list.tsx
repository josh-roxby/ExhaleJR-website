"use client";

import { Card, Eyebrow, Tag } from "@/components/ui";
import type { Recipe } from "../data/recipes";

interface RecipeListProps {
  recipes: Recipe[];
  onPick: (slug: string) => void;
}

export function RecipeList({ recipes, onPick }: RecipeListProps) {
  return (
    <main className="space-y-8">
      <header className="mx-auto max-w-3xl">
        <Eyebrow tone="accent" withPulseDot>// COOKING · v0.0</Eyebrow>
        <h1 className="mt-2 font-display text-5xl font-black leading-[0.95] tracking-tight">
          What are we <span className="text-accent">making</span>?
        </h1>
        <p className="mt-3 max-w-xl text-ink-2">
          Pick a recipe. We&apos;ll walk you through it, step by step, with timers and
          a ding when each one&apos;s done.
        </p>
      </header>

      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {recipes.map((r) => (
          <li key={r.slug}>
            <Card
              as="button"
              type="button"
              onClick={() => onPick(r.slug)}
              hover="lift"
              className="block w-full text-left"
            >
              <div className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-mute-2">
                {r.slug}
              </div>
              <div className="mt-1 font-display text-2xl font-bold uppercase tracking-tight text-ink">
                {r.name}
              </div>
              <p className="mt-1 text-sm text-mute">{r.description}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                <Tag variant="accent">{r.prepTime + r.cookTime} min</Tag>
                <Tag>serves {r.servings}</Tag>
                {r.tags.map((t) => (
                  <Tag key={t}>{t}</Tag>
                ))}
              </div>
            </Card>
          </li>
        ))}
      </ul>
    </main>
  );
}
