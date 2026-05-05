"use client";

// Decision wheel. Add a list of options, spin the wheel, the slice resting
// at the top pointer is the pick. Items persist via the shared user-store
// so the rest of the user's data stays untouched.

import { useState } from "react";

import { Button, Eyebrow, Tag } from "@/components/ui";
import { useProjectStorage } from "@/hooks/use-project-storage";

import { ItemsEditor } from "./components/items-editor";
import { Wheel } from "./components/wheel";
import {
  emptyWheelData,
  WHEEL_DATA_VERSION,
  type WheelData,
  type WheelItem,
} from "./data/types";
import { chime } from "./lib/sound";
import { meta } from "./meta";

const SPIN_DURATION = 3200;

export function Page() {
  const [data, setData, hydrated] = useProjectStorage<WheelData>(
    meta.slug,
    WHEEL_DATA_VERSION,
    emptyWheelData,
  );
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<WheelItem | null>(null);

  const items = data.items;

  const addItem = (item: WheelItem) => {
    setData((prev) => ({ items: [...prev.items, item] }));
  };

  const deleteItem = (id: string) => {
    setData((prev) => ({ items: prev.items.filter((i) => i.id !== id) }));
  };

  const clearItems = () => {
    setData({ items: [] });
    setResult(null);
  };

  const spin = () => {
    if (spinning || items.length === 0) return;

    const targetIndex = Math.floor(Math.random() * items.length);
    const sliceAngle = 360 / items.length;
    const sliceCenter = targetIndex * sliceAngle + sliceAngle / 2;

    // Wheel rotation in degrees. We want the picked slice's centre at the
    // 12 o'clock pointer after the spin. With slice 0 starting at 12
    // o'clock and proceeding clockwise, slice centre at angle `sliceCenter`
    // ends at the top when the wheel's rotation mod 360 equals
    // `360 - sliceCenter`. Add several full turns for visual.
    const turns = 5 + Math.floor(Math.random() * 3);
    const targetMod = (360 - sliceCenter + 360) % 360;
    const currentMod = ((rotation % 360) + 360) % 360;
    const delta = (targetMod - currentMod + 360) % 360;
    const next = rotation + turns * 360 + delta;

    setSpinning(true);
    setResult(null);
    setRotation(next);

    window.setTimeout(() => {
      setSpinning(false);
      setResult(items[targetIndex]);
      chime();
    }, SPIN_DURATION);
  };

  return (
    <main className="mx-auto max-w-2xl space-y-8 pb-12">
      <header>
        <Eyebrow tone="accent" withPulseDot>// DECISION WHEEL · v0.0</Eyebrow>
        <h1 className="mt-2 font-display text-5xl font-black leading-[0.95] tracking-tight">
          Spin the <span className="text-accent">wheel</span>.
        </h1>
        <p className="mt-3 max-w-xl text-ink-2">
          Add things, spin, let chance pick. Saved on this device.
        </p>
      </header>

      <div className="flex flex-col items-center gap-6">
        <Wheel
          items={items}
          rotation={rotation}
          spinning={spinning}
          duration={SPIN_DURATION}
        />

        {result ? (
          <div className="flex flex-col items-center gap-2 text-center">
            <Eyebrow tone="accent" withPulseDot>// RESULT</Eyebrow>
            <p className="font-display text-3xl font-black uppercase tracking-tight text-ink">
              {result.text}
            </p>
          </div>
        ) : (
          <Tag>{spinning ? "spinning" : items.length === 0 ? "empty" : "ready"}</Tag>
        )}

        <Button
          variant="primary"
          onClick={spin}
          disabled={spinning || items.length === 0}
        >
          {spinning ? "Spinning…" : result ? "Spin again" : "Spin"}
        </Button>
      </div>

      {hydrated ? (
        <ItemsEditor
          items={items}
          onAdd={addItem}
          onDelete={deleteItem}
          onClear={clearItems}
        />
      ) : (
        <div className="rounded-sq-md border border-dashed border-line-2 bg-surface/40 p-8 text-center">
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-mute-3">
            // LOADING
          </p>
        </div>
      )}
    </main>
  );
}
