A daily habit tracker with a stats heatmap. Two habit types (yes/no toggle, numeric counter) and two habit kinds (build, green; break, red). Data stays on the user's device via localStorage.

## What it does

Two tabs:

- **Tracking.** A list of habits with today's input control per habit. Yes/no habits show a toggle, counter habits show -/+ buttons around a tabular number. The row title turns green when a build habit is logged today, red when a break habit was slipped today. A small Tag near each habit name shows the kind (build/break) and type (yes/no/count).
- **Stats.** A GitHub-style contribution heatmap per habit, last 91 days (13 weeks, Sunday-aligned). Cell intensity scales with the day's value. Build cells are green; break cells are red. A streak counter and total-days summary sit above each heatmap. For build habits the streak is consecutive days with a logged value; for break habits it's consecutive clean days.

Add habits via a form below the list. Each habit is added with a name, a kind (build/break), and a type (yes/no/count). Delete affordance per row.

## Data structure

```ts
interface Habit {
  id: string;
  name: string;
  type: "boolean" | "counter";
  kind: "build" | "break";
  createdAt: string; // YYYY-MM-DD local
}

interface HabitEntry {
  date: string;       // YYYY-MM-DD local
  habitId: string;
  value: boolean | number;
}

interface TempoData {
  habits: Habit[];
  entries: HabitEntry[];
}
```

Persisted via `useProjectStorage` so the rest of the user's stored data stays untouched. One stored entry per habit per date.

## Project meta

- slug: tempo
- name: Tempo
- description: Daily habit tracker. Boolean or counter habits, one tap per day. Data lives on your device only.
- tags: ["habits", "tools", "personal"]
- wip: true

## Behaviour notes

- The flow is mobile-first. Big tap targets (toggle, +/- counter buttons), readable type, generous spacing.
- Persist on every change. There's no save button.
- Empty state when no habits yet, both on Tracking and Stats tabs.
- Counter habits never go below zero.
- Deleting a habit also clears all its historical entries to keep the data clean.
- For "break" habits, "logged today" means the user slipped (did the thing they're trying to break). The streak counter inverts: clean streak counts consecutive days with no entry. The heatmap shows red intensity proportional to slip count.
- For counter habits, the heatmap uses an all-time max for opacity scaling so intensity is stable across windows. Bucketed into 4 opacity steps (0.3 / 0.55 / 0.8 / 1) so values read cleanly.
