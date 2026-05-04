A cooking app. A recipe player that walks the user through a recipe step by step, with optional countdown timers per step and an audio ding when each timer hits zero.

## What it does

The page shows a list of recipes as tiles. Tapping a recipe opens its detail view with ingredients, a step preview, and a "Cook" button. Tapping Cook starts the cooking flow:

1. **Prep view.** Mise en place checklist. Ingredients render as tappable rows. Marking each row off is optional. A "Start cooking" button always appears.
2. **Step view.** A large card shows the current step in display-font typography. If the step has a timer, a big mm:ss countdown appears below the step text with Start / Pause / Resume controls. When the countdown reaches zero, three rising tones play (Web Audio API) and the card glows Iris. The user taps Next manually when ready.
3. **Done view.** A celebration screen with a "Back to recipes" button.

The cook flow does not auto-advance. Timer ending is signal, not action.

## Recipe data

Recipes live in `/projects/cooking/data/recipes.ts` as a typed array. Each recipe has slug, name, description, prepTime (minutes), cookTime (minutes), servings, tags, ingredients (qty + item + optional notes), and steps (text + optional timer in seconds).

## Project meta

- slug: cooking
- name: Cooking
- description: Recipe player with step-by-step timers and an audio ding when each timer ends.
- tags: ["cooking", "tools", "personal"]

## Behaviour requirements

- The flow is mobile-first. Big tap targets, big readable type, generous spacing. Users may be glancing at the screen across a kitchen counter.
- Active timers fire `alarmDing()` exactly once when the count reaches zero. Three sine tones (880Hz, 1100Hz, 1320Hz) at 180-280ms each.
- Timer state is per-step and resets when the step changes. Don't try to keep timers running across navigation.
- The whole flow lives inside a single Next.js project page. No new routes. Internal state is managed via `useState` in `page.tsx` and `cook-flow.tsx`.
- Use existing `@/components/ui` primitives (Card, Button, Eyebrow, Tag) wherever they fit. Don't rebuild what's already there.
