"use client";

import { useMemo } from "react";

import { Card, Eyebrow, Tag } from "@/components/ui";
import { cn } from "@/lib/cn";

import { isLogged, type Habit, type HabitEntry } from "../data/types";
import { addDaysIso, todayISO } from "../lib/dates";

interface HabitStatsProps {
  habits: Habit[];
  entries: HabitEntry[];
}

const WINDOW_DAYS = 91; // 13 weeks. Fits a typical mobile viewport.

export function HabitStats({ habits, entries }: HabitStatsProps) {
  if (habits.length === 0) {
    return (
      <div className="rounded-sq-md border border-dashed border-line-2 bg-surface/40 p-8 text-center">
        <Eyebrow tone="mute" size="xs">// NOTHING TO PLOT</Eyebrow>
        <p className="mt-2 text-sm text-mute">
          Add a habit on the Tracking tab to see its history here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {habits.map((h) => (
        <HabitHeatmap key={h.id} habit={h} entries={entries} />
      ))}
    </div>
  );
}

interface HabitHeatmapProps {
  habit: Habit;
  entries: HabitEntry[];
}

function HabitHeatmap({ habit, entries }: HabitHeatmapProps) {
  // value-by-date map for fast lookups.
  const valueByDate = useMemo(() => {
    const m = new Map<string, boolean | number>();
    for (const e of entries) {
      if (e.habitId === habit.id) m.set(e.date, e.value);
    }
    return m;
  }, [entries, habit.id]);

  // All-time max for counter habits; keeps intensity stable across views.
  const max = useMemo(() => {
    if (habit.type !== "counter") return 1;
    let m = 1;
    for (const v of valueByDate.values()) {
      if (typeof v === "number" && v > m) m = v;
    }
    return m;
  }, [habit.type, valueByDate]);

  // Build a flat, chronological list of dates ending today. The grid then
  // renders these row-major so the user reads them like text: top-left is
  // the oldest day, bottom-right is today.
  const cells = useMemo(() => buildLinearCells(WINDOW_DAYS), []);

  const isBuild = habit.kind === "build";
  const colorClass = isBuild ? "bg-ok" : "bg-warn";

  // Stats summary.
  const total = useMemo(() => {
    let n = 0;
    for (const v of valueByDate.values()) {
      if (isLogged(habit, v)) n++;
    }
    return n;
  }, [habit, valueByDate]);

  const streak = useMemo(() => computeStreak(habit, valueByDate), [habit, valueByDate]);

  return (
    <Card hover="none" className="space-y-4 p-5">
      <header className="flex flex-wrap items-baseline justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="truncate font-display text-xl font-bold uppercase tracking-tight text-ink">
              {habit.name}
            </h3>
            <Tag variant={isBuild ? "ok" : "warn"}>{habit.kind}</Tag>
            <Tag>{habit.type === "boolean" ? "yes / no" : "count"}</Tag>
          </div>
          <p className="mt-1 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-mute-2">
            // LAST {WINDOW_DAYS} DAYS
          </p>
        </div>
        <div className="flex flex-wrap items-baseline gap-x-5 gap-y-1 text-sm">
          <Stat
            label={isBuild ? "STREAK" : "CLEAN STREAK"}
            value={`${streak}d`}
            tone={isBuild ? "ok" : "warn"}
            on={streak > 0}
          />
          <Stat
            label={isBuild ? "DAYS LOGGED" : "SLIPS"}
            value={String(total)}
            tone={isBuild ? "ok" : "warn"}
            on={total > 0}
          />
        </div>
      </header>

      <div className="-mx-5 overflow-x-auto px-5 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="grid w-fit auto-rows-[12px] grid-cols-[repeat(13,12px)] gap-1">
          {cells.map((date) => {
            const v = valueByDate.get(date);
            const intensity = computeIntensity(habit, v, max);
            const empty = intensity === 0;
            return (
              <span
                key={date}
                title={`${date}${
                  v === undefined
                    ? ""
                    : ` · ${formatValue(habit, v)}${isBuild ? "" : " (slip)"}`
                }`}
                className={cn(
                  "h-3 w-3 rounded-sq-xs",
                  empty ? "border border-line bg-surface-2" : colorClass,
                )}
                style={empty ? undefined : { opacity: bucket(intensity) }}
              />
            );
          })}
        </div>
      </div>
    </Card>
  );
}

function Stat({
  label,
  value,
  tone,
  on,
}: {
  label: string;
  value: string;
  tone: "ok" | "warn";
  on: boolean;
}) {
  return (
    <div className="flex items-baseline gap-2">
      <span className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-mute-2">
        {`// ${label}`}
      </span>
      <span
        className={cn(
          "font-display text-xl font-black tabular-nums",
          on ? (tone === "ok" ? "text-ok" : "text-warn") : "text-ink",
        )}
      >
        {value}
      </span>
    </div>
  );
}

/* ─── helpers ─── */

/** Flat chronological list of dates ending today. The grid renders these
 *  row-major (default `grid-flow-row`), so oldest day is top-left and today
 *  is bottom-right. With WINDOW_DAYS = 91 and 13 columns, the grid is
 *  exactly 7 rows tall. */
function buildLinearCells(days: number): string[] {
  const today = todayISO();
  const start = addDaysIso(today, -(days - 1));
  const out: string[] = [];
  for (let i = 0; i < days; i++) {
    out.push(addDaysIso(start, i));
  }
  return out;
}

function computeIntensity(
  habit: Habit,
  value: boolean | number | undefined,
  max: number,
): number {
  if (value === undefined) return 0;
  if (typeof value === "boolean") return value ? 1 : 0;
  if (value <= 0) return 0;
  return Math.min(1, value / max);
}

/** Map continuous intensity to a small set of opacity buckets so cells read
 *  cleanly even when the underlying values vary widely. */
function bucket(intensity: number): number {
  if (intensity <= 0) return 0;
  if (intensity <= 0.25) return 0.3;
  if (intensity <= 0.5) return 0.55;
  if (intensity <= 0.75) return 0.8;
  return 1;
}

function computeStreak(
  habit: Habit,
  valueByDate: Map<string, boolean | number>,
): number {
  // Build: streak = consecutive days WITH a logged value, walking back from today.
  // Break: streak = consecutive days WITHOUT a logged value (clean days).
  let streak = 0;
  let cursor = todayISO();
  // Cap at 1 year so this never runs forever.
  for (let i = 0; i < 366; i++) {
    const v = valueByDate.get(cursor);
    const logged = isLogged(habit, v);
    const success = habit.kind === "build" ? logged : !logged;
    if (!success) break;
    streak++;
    cursor = addDaysIso(cursor, -1);
  }
  return streak;
}

function formatValue(habit: Habit, value: boolean | number): string {
  if (habit.type === "boolean") return value ? "done" : "skipped";
  return String(value);
}
