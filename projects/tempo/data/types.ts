export type HabitType = "boolean" | "counter";

/** Build = a habit you want to do (positive, green UI). Break = a habit you
 *  want to stop (negative, red UI). Logging a break habit means "I slipped
 *  today"; the streak counter inverts so a streak is consecutive clean days. */
export type HabitKind = "build" | "break";

export interface Habit {
  id: string;
  name: string;
  type: HabitType;
  kind: HabitKind;
  /** ISO date YYYY-MM-DD when created. */
  createdAt: string;
}

export interface HabitEntry {
  /** ISO date YYYY-MM-DD. */
  date: string;
  habitId: string;
  /** Boolean for "boolean" habits, number for "counter" habits. */
  value: boolean | number;
}

export interface TempoData {
  habits: Habit[];
  entries: HabitEntry[];
}

/** Bumped from 1 → 2 when the kind field was added. Older v1 data is
 *  treated as missing and replaced with `emptyTempoData`. */
export const TEMPO_DATA_VERSION = 2;

export const emptyTempoData: TempoData = {
  habits: [],
  entries: [],
};

export function generateId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 10);
}

/** Whether a stored entry value counts as "did the thing today". For build
 *  habits this is the success direction; for break habits it represents a
 *  slip (and "success" is the inverse — see streak math in habit-stats). */
export function isLogged(habit: Habit, value: boolean | number | undefined): boolean {
  if (value === undefined) return false;
  if (typeof value === "boolean") return value;
  return value > 0;
}
