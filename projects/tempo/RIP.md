A simple daily habit tracker. Add habits with two types (yes/no or count) and tap each one once a day. Data stays on the user's device via localStorage.

## What it does

The page shows today's date, a list of habits, and a control per habit:
- Yes/no habits: a toggle for done / not done.
- Counter habits: number with + and - buttons.

Each habit row also has a small delete affordance. Below the list, a button toggles a "new habit" form with a name field and a type select.

## Data structure

```ts
interface Habit {
  id: string;
  name: string;
  type: "boolean" | "counter";
  createdAt: string; // YYYY-MM-DD
}

interface HabitEntry {
  date: string;       // YYYY-MM-DD
  habitId: string;
  value: boolean | number;
}

interface TempoData {
  habits: Habit[];
  entries: HabitEntry[];
}
```

Persisted via `useProjectStorage` (the shared hook in this repo) so the rest of the user's stored data stays untouched. One stored entry per habit per date; setting a value either updates the existing entry or appends a new one.

## Project meta

- slug: tempo
- name: Tempo
- description: Daily habit tracker. Boolean or counter habits, one tap per day. Data lives on your device only.
- tags: ["habits", "tools", "personal"]
- wip: true

## Behaviour notes

- The flow is mobile-first. Big tap targets (toggle, +/- counter buttons), readable type, generous spacing.
- Persist on every change. There is no save button.
- Empty state when no habits yet. Add a friendly nudge with a "// EMPTY" eyebrow.
- Counter habits never go below zero.
- Deleting a habit also clears all its historical entries to keep the data clean.
