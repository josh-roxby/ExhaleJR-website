export type HabitType = "boolean" | "counter";

export interface Habit {
  id: string;
  name: string;
  type: HabitType;
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

export const TEMPO_DATA_VERSION = 1;

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

export function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}
