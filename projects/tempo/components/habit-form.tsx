"use client";

import { useState, type FormEvent } from "react";

import { Button, FieldLabel, Select, TextInput } from "@/components/ui";
import { cn } from "@/lib/cn";

import { todayISO } from "../lib/dates";
import { generateId, type Habit, type HabitKind, type HabitType } from "../data/types";

interface HabitFormProps {
  onAdd: (habit: Habit) => void;
  onCancel: () => void;
}

const TYPE_OPTIONS = [
  { value: "boolean", label: "Yes / no" },
  { value: "counter", label: "Count" },
];

export function HabitForm({ onAdd, onCancel }: HabitFormProps) {
  const [name, setName] = useState("");
  const [type, setType] = useState<HabitType>("boolean");
  const [kind, setKind] = useState<HabitKind>("build");

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    onAdd({
      id: generateId(),
      name: trimmed,
      type,
      kind,
      createdAt: todayISO(),
    });
    setName("");
    setType("boolean");
    setKind("build");
  };

  return (
    <form
      onSubmit={submit}
      className="space-y-5 rounded-sq-md border border-line-2 bg-surface p-5"
    >
      <div className="space-y-2">
        <FieldLabel htmlFor="tempo-habit-name">// HABIT NAME</FieldLabel>
        <TextInput
          id="tempo-habit-name"
          autoFocus
          placeholder="Read 30 min, push-ups, no scrolling…"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <FieldLabel>// KIND</FieldLabel>
        <div className="grid grid-cols-2 gap-2">
          <KindButton
            kind="build"
            active={kind === "build"}
            onClick={() => setKind("build")}
            label="Build"
            sub="Track when you do it"
          />
          <KindButton
            kind="break"
            active={kind === "break"}
            onClick={() => setKind("break")}
            label="Break"
            sub="Track when you slip"
          />
        </div>
      </div>

      <div className="space-y-2">
        <FieldLabel>// TYPE</FieldLabel>
        <Select
          options={TYPE_OPTIONS}
          value={type}
          onChange={(v) => setType(v as HabitType)}
          aria-label="Habit type"
        />
        <p className="text-xs text-mute">
          {type === "boolean"
            ? "A toggle. One tap a day."
            : "A counter. Increment by however many that day."}
        </p>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" disabled={!name.trim()}>
          Add habit
        </Button>
      </div>
    </form>
  );
}

function KindButton({
  kind,
  active,
  onClick,
  label,
  sub,
}: {
  kind: HabitKind;
  active: boolean;
  onClick: () => void;
  label: string;
  sub: string;
}) {
  const isBuild = kind === "build";
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "ds-interactive flex flex-col items-start gap-1 rounded-sq border p-3 text-left outline-none active:scale-[0.98]",
        active
          ? isBuild
            ? "border-ok bg-ok/[0.08] shadow-[0_0_16px_rgba(74,222,128,0.18)]"
            : "border-warn bg-warn/[0.08] shadow-[0_0_16px_rgba(255,91,61,0.18)]"
          : "border-line-2 bg-surface-2 hover:border-line-3",
      )}
    >
      <span
        className={cn(
          "font-mono text-[10px] font-bold uppercase tracking-[0.18em]",
          active ? (isBuild ? "text-ok" : "text-warn") : "text-mute-2",
        )}
      >
        {`// ${label.toUpperCase()}`}
      </span>
      <span
        className={cn(
          "font-display text-base font-bold uppercase tracking-tight",
          active ? "text-ink" : "text-mute",
        )}
      >
        {label}
      </span>
      <span className="text-[11px] text-mute">{sub}</span>
    </button>
  );
}
