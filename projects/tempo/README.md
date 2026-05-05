# Tempo

Daily habit tracker. Two habit types: boolean (yes / no toggle) and counter
(numeric +/-). Add a habit, tap once a day. Persisted to the user's device
via the shared `useProjectStorage` hook, so other projects' data is never
touched.

## Layout

```
projects/tempo/
  index.ts             # public exports (Page, meta)
  meta.ts              # slug, name, description, wip, tags
  page.tsx             # entry. Owns top-level state, glues hook + components
  data/
    types.ts           # Habit / HabitEntry / TempoData types + helpers
                       # (generateId, todayISO, defaults, version constant)
  components/
    habit-form.tsx     # Add a new habit (name + type)
    habit-list.tsx     # List of habits + per-habit row with the right input
                       # control. Counter +/- and delete affordances live here.
```

## Data model

```ts
type Habit = {
  id: string;
  name: string;
  type: "boolean" | "counter";
  createdAt: string; // YYYY-MM-DD
};

type HabitEntry = {
  date: string;       // YYYY-MM-DD
  habitId: string;
  value: boolean | number;
};

type TempoData = {
  habits: Habit[];
  entries: HabitEntry[];
};
```

Persisted as `root.projects.tempo.data` in `localStorage["exhalejr.user"]`,
versioned by `TEMPO_DATA_VERSION` (currently `1`). Bump the version if the
shape changes; older data is then treated as missing rather than misread.

## How entries work

Each habit has at most one entry per date. On render, the list looks up the
current habit's entry for `today`. `setEntry` either updates an existing
entry or appends a new one. The list component shows a "// LOGGED TODAY"
eyebrow when the entry exists and is non-empty.
