# Cooking

Recipe player that walks you through cooking step-by-step with optional
countdown timers and an audio ding when each timer ends.

## Layout

```
projects/cooking/
  index.ts                       # public exports (Page, meta)
  meta.ts                        # slug, name, description, wip, tags
  page.tsx                       # entry. Owns the top-level state machine
  data/
    recipes.ts                   # Recipe / Ingredient / Step types + seed data
  lib/
    beep.ts                      # Web Audio tone helper + alarmDing()
  hooks/
    use-timer.ts                 # countdown timer + formatDuration()
  components/
    recipe-list.tsx              # tile grid view
    recipe-detail.tsx            # ingredients + steps preview + Cook CTA
    cook-flow.tsx                # state machine: prep | step | done
    cook-prep.tsx                # mise en place checklist
    cook-step-card.tsx           # big step card + timer block
```

## Adding a recipe

Append an entry to the `recipes` array in `data/recipes.ts`. Required:

- `slug`, `name`, `description`
- `prepTime` and `cookTime` in minutes, `servings`
- `tags` (filter chips)
- `ingredients`: `{ qty, item, notes? }[]`
- `steps`: `{ text, timer? }[]` where `timer` is in seconds. Steps without a
  timer just need a Next tap to advance.

## Audio note

Beep uses the Web Audio API. Browsers require a user gesture before audio
plays, so the audio context initializes when the user clicks the Cook button
(which is always the first interaction in the flow). On iOS Safari and PWA,
this should also unlock audio for the rest of the session.
