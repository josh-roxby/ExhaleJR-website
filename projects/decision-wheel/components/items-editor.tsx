"use client";

import { useState, type FormEvent } from "react";

import { Button, Eyebrow, TextInput } from "@/components/ui";

import { generateId, type WheelItem } from "../data/types";

interface ItemsEditorProps {
  items: WheelItem[];
  onAdd: (item: WheelItem) => void;
  onDelete: (id: string) => void;
  onClear: () => void;
}

export function ItemsEditor({ items, onAdd, onDelete, onClear }: ItemsEditorProps) {
  const [text, setText] = useState("");

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;
    onAdd({ id: generateId(), text: trimmed });
    setText("");
  };

  return (
    <section className="space-y-4 rounded-sq-md border border-line-2 bg-surface p-5">
      <div className="flex items-center justify-between">
        <Eyebrow tone="mute" size="sm">{`// ITEMS · ${items.length}`}</Eyebrow>
        {items.length > 0 && (
          <button
            type="button"
            onClick={onClear}
            className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-mute hover:text-warn"
          >
            Clear all
          </button>
        )}
      </div>

      <form onSubmit={submit} className="flex gap-2">
        <TextInput
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Sushi, ramen, pasta…"
          aria-label="New item"
        />
        <Button type="submit" variant="primary" disabled={!text.trim()}>
          Add
        </Button>
      </form>

      {items.length === 0 ? (
        <p className="text-sm text-mute">
          Add a few things, then spin the wheel above.
        </p>
      ) : (
        <ul className="space-y-1.5">
          {items.map((item) => (
            <li key={item.id}>
              <div className="flex items-center justify-between gap-3 rounded-sq-xs border border-line bg-surface-2 px-3 py-2">
                <span className="truncate text-sm text-ink-2">{item.text}</span>
                <button
                  type="button"
                  aria-label={`Remove ${item.text}`}
                  onClick={() => onDelete(item.id)}
                  className="ds-interactive grid h-7 w-7 shrink-0 place-items-center rounded-round text-mute-3 outline-none active:scale-[0.88] hover:bg-warn/10 hover:text-warn"
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="6" y1="6" x2="18" y2="18" />
                    <line x1="6" y1="18" x2="18" y2="6" />
                  </svg>
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
