"use client";

// Tempo. Daily habit tracker. Two habit types (boolean toggle, numeric
// counter). Persists to localStorage via the shared user-store so other
// projects' data is never touched.

import { useState } from "react";

import { Button, Eyebrow } from "@/components/ui";
import { useProjectStorage } from "@/hooks/use-project-storage";

import { HabitForm } from "./components/habit-form";
import { HabitList } from "./components/habit-list";
import {
  emptyTempoData,
  TEMPO_DATA_VERSION,
  todayISO,
  type Habit,
  type TempoData,
} from "./data/types";
import { meta } from "./meta";

function formatToday(isoDate: string): string {
  const d = new Date(`${isoDate}T00:00:00`);
  return d.toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

export function Page() {
  const [data, setData, hydrated] = useProjectStorage<TempoData>(
    meta.slug,
    TEMPO_DATA_VERSION,
    emptyTempoData,
  );
  const [showForm, setShowForm] = useState(false);

  const today = todayISO();

  const addHabit = (habit: Habit) => {
    setData((prev) => ({ ...prev, habits: [...prev.habits, habit] }));
    setShowForm(false);
  };

  const deleteHabit = (habitId: string) => {
    setData((prev) => ({
      habits: prev.habits.filter((h) => h.id !== habitId),
      entries: prev.entries.filter((e) => e.habitId !== habitId),
    }));
  };

  const setEntry = (habitId: string, value: boolean | number) => {
    setData((prev) => {
      const i = prev.entries.findIndex(
        (e) => e.date === today && e.habitId === habitId,
      );
      if (i >= 0) {
        const next = [...prev.entries];
        next[i] = { ...next[i], value };
        return { ...prev, entries: next };
      }
      return {
        ...prev,
        entries: [...prev.entries, { date: today, habitId, value }],
      };
    });
  };

  return (
    <main className="mx-auto max-w-3xl space-y-8">
      <header>
        <Eyebrow tone="accent" withPulseDot>// TEMPO · v0.0</Eyebrow>
        <h1 className="mt-2 font-display text-5xl font-black leading-[0.95] tracking-tight">
          Daily <span className="text-accent">habits</span>.
        </h1>
        <p className="mt-3 max-w-xl text-ink-2">
          Add a habit, tap it once a day. Track yes/no things or count things.
          Data lives on this device only, never leaves your browser.
        </p>
        <p className="mt-4 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-mute-2">
          // TODAY · {formatToday(today).toUpperCase()}
        </p>
      </header>

      {hydrated ? (
        <HabitList
          habits={data.habits}
          entries={data.entries}
          today={today}
          onSet={setEntry}
          onDelete={deleteHabit}
        />
      ) : (
        <div className="rounded-sq-md border border-dashed border-line-2 bg-surface/40 p-8 text-center">
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-mute-3">
            // LOADING
          </p>
        </div>
      )}

      {showForm ? (
        <HabitForm
          onAdd={addHabit}
          onCancel={() => setShowForm(false)}
        />
      ) : (
        <div className="flex justify-end">
          <Button variant="primary" onClick={() => setShowForm(true)}>
            + New habit
          </Button>
        </div>
      )}
    </main>
  );
}
