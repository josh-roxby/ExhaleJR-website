# Tempo

Daily habit tracker. Two habit types (boolean / counter) and two habit kinds
(build / break). Add a habit, tap once a day. A second tab plots a
GitHub-style heatmap per habit so you can see the pattern at a glance.

Persisted to the user's device via the shared `useProjectStorage` hook, so
other projects' data is never touched.

## Layout

```
projects/tempo/
  index.ts                   # public exports (Page, meta)
  meta.ts                    # slug, name, description, wip, tags
  page.tsx                   # entry. Owns Tabs (Tracking / Stats), state,
                             # callbacks. Glues the rest together.
  data/
    types.ts                 # Habit / HabitEntry / TempoData types,
                             # TEMPO_DATA_VERSION (currently 2),
                             # emptyTempoData, generateId, isLogged.
  lib/
    dates.ts                 # todayISO (local), addDaysIso, dayOfWeek,
                             # formatLong. All work on YYYY-MM-DD strings.
  components/
    habit-form.tsx           # Name + kind picker (build/break) + type
                             # select. Custom KindButton renders the
                             # build/break choice with green/red surfaces.
    habit-list.tsx           # Tracking-tab list. Per-row title and eyebrow
                             # turn green/red based on kind + logged state.
                             # Toggle uses tone={ok|warn}. Counter big
                             # number turns green/red when > 0.
    habit-stats.tsx          # Stats-tab heatmap. One Card per habit:
                             # heading + tags + streak/total stats above,
                             # a 7-row × 13-col contribution grid below.
                             # Sunday-aligned, padded so every column is a
                             # full week. Grid scrolls horizontally if it
                             # overflows.
```

## Data model

```ts
type Habit = {
  id: string;
  name: string;
  type: "boolean" | "counter";
  kind: "build" | "break";
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
versioned by `TEMPO_DATA_VERSION`. The version was bumped from 1 → 2 when
the kind field was added; v1 data is treated as missing.

## Streak math

- **Build:** consecutive days with a logged value, walking back from today.
- **Break:** consecutive days WITHOUT a logged value (clean days).

Capped at 366 iterations so the loop can never run away.

## Heatmap

Last 91 days, Sunday-aligned columns of 7 cells. Build cells are green
(`--ok`), break cells are red (`--warn`). Value-to-opacity is bucketed into
4 steps (0.3 / 0.55 / 0.8 / 1.0) so the grid reads clearly even when
underlying values vary widely. Counter scaling uses the habit's all-time
max so intensity is stable across viewing windows.
