"use client";

import { Card, IconButton, Tag, Toggle } from "@/components/ui";
import { cn } from "@/lib/cn";

import type { Habit, HabitEntry } from "../data/types";

interface HabitListProps {
  habits: Habit[];
  entries: HabitEntry[];
  today: string;
  onSet: (habitId: string, value: boolean | number) => void;
  onDelete: (habitId: string) => void;
}

export function HabitList({ habits, entries, today, onSet, onDelete }: HabitListProps) {
  if (habits.length === 0) {
    return (
      <div className="rounded-sq-md border border-dashed border-line-2 bg-surface/40 p-8 text-center">
        <p className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-mute-2">
          // EMPTY
        </p>
        <p className="mt-2 text-sm text-mute">
          No habits yet. Add your first one to get going.
        </p>
      </div>
    );
  }

  return (
    <ul className="space-y-2">
      {habits.map((habit) => {
        const entry = entries.find(
          (e) => e.date === today && e.habitId === habit.id,
        );
        return (
          <li key={habit.id}>
            <HabitRow
              habit={habit}
              value={entry?.value}
              onSet={(value) => onSet(habit.id, value)}
              onDelete={() => onDelete(habit.id)}
            />
          </li>
        );
      })}
    </ul>
  );
}

interface HabitRowProps {
  habit: Habit;
  value: boolean | number | undefined;
  onSet: (value: boolean | number) => void;
  onDelete: () => void;
}

function HabitRow({ habit, value, onSet, onDelete }: HabitRowProps) {
  const isLogged =
    habit.type === "boolean"
      ? value === true
      : typeof value === "number" && value > 0;

  return (
    <Card hover="none" className="flex items-center justify-between gap-4 p-4">
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h3
            className={cn(
              "truncate font-display text-lg font-bold uppercase tracking-tight",
              isLogged ? "text-accent" : "text-ink",
            )}
          >
            {habit.name}
          </h3>
          <Tag>{habit.type === "boolean" ? "yes / no" : "count"}</Tag>
        </div>
        <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-mute-2">
          {isLogged ? "// LOGGED TODAY" : "// NOT LOGGED YET"}
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-3">
        {habit.type === "boolean" ? (
          <Toggle
            aria-label={`Mark ${habit.name} done today`}
            checked={value === true}
            onChange={(e) => onSet(e.target.checked)}
          />
        ) : (
          <CounterControl
            value={typeof value === "number" ? value : 0}
            onChange={onSet}
            label={habit.name}
          />
        )}
        <DeleteButton onClick={onDelete} />
      </div>
    </Card>
  );
}

interface CounterControlProps {
  value: number;
  onChange: (value: number) => void;
  label: string;
}

function CounterControl({ value, onChange, label }: CounterControlProps) {
  return (
    <div className="flex items-center gap-2">
      <IconButton
        aria-label={`Decrease ${label}`}
        round
        onClick={() => onChange(Math.max(0, value - 1))}
        disabled={value <= 0}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <path d="M5 12h14" />
        </svg>
      </IconButton>
      <span className="min-w-[2.5ch] text-center font-display text-2xl font-black tabular-nums text-ink">
        {value}
      </span>
      <IconButton
        aria-label={`Increase ${label}`}
        round
        onClick={() => onChange(value + 1)}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <path d="M12 5v14M5 12h14" />
        </svg>
      </IconButton>
    </div>
  );
}

function DeleteButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      aria-label="Delete habit"
      onClick={onClick}
      className="ds-interactive grid h-8 w-8 place-items-center rounded-round text-mute-3 outline-none active:scale-[0.88] hover:bg-warn/10 hover:text-warn"
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <polyline points="3 6 5 6 21 6" />
        <path d="M19 6l-2 14a2 2 0 01-2 2H9a2 2 0 01-2-2L5 6" />
        <path d="M10 11v6M14 11v6" />
        <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
      </svg>
    </button>
  );
}
