"use client";

import { useState, type FormEvent } from "react";

import { Button, FieldLabel, Select, TextInput } from "@/components/ui";

import { generateId, todayISO, type Habit, type HabitType } from "../data/types";

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

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    onAdd({
      id: generateId(),
      name: trimmed,
      type,
      createdAt: todayISO(),
    });
    setName("");
    setType("boolean");
  };

  return (
    <form
      onSubmit={submit}
      className="space-y-4 rounded-sq-md border border-line-2 bg-surface p-5"
    >
      <div className="space-y-2">
        <FieldLabel htmlFor="tempo-habit-name">// HABIT NAME</FieldLabel>
        <TextInput
          id="tempo-habit-name"
          autoFocus
          placeholder="Read 30 min, push-ups, water…"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
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
            ? "A toggle. Tap once a day to mark it done."
            : "A counter. Increment by however many you did that day."}
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
