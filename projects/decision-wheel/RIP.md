A decision-wheel toy. The user adds items to a list, spins the wheel, the slice resting at the top pointer is the pick.

## What it does

- A vertical layout: SVG wheel at the top, a result line below, a Spin button, and an items editor below that.
- Items are simple objects: `{ id: string, text: string }`. They persist via the shared `useProjectStorage` hook so other projects' data isn't touched.
- Adding an item: text input + Add button. Trimmed input, deduped is fine but not enforced. Empty input doesn't submit.
- Removing an item: × button per row. A "Clear all" link near the // ITEMS · N eyebrow nukes the whole list.
- Wheel rendering: SVG with one wedge per item, alternating Iris (`--accent`) and Lavender (`--accent-dim`) fills, centre hub circle, mono caps labels rotated to face outward. Empty wheel renders a dashed circle with a "// EMPTY" eyebrow and a "Add a few things below to spin." line.
- Spin: `5 + random(0..2)` full turns plus the landing offset that places the picked slice's centre under the 12 o'clock pointer. CSS `transition` on the SVG's `rotate(N deg)` transform with a `cubic-bezier(.15, .85, .25, 1)` ease so the spin decelerates organically.
- A three-tone Web Audio chord plays when the spin ends.

## Data structure

```ts
interface WheelItem {
  id: string;
  text: string;
}

interface WheelData {
  items: WheelItem[];
}
```

Persisted at `root.projects["decision-wheel"].data` in `localStorage["exhalejr.user"]`.

## Project meta

- slug: decision-wheel
- name: Decision wheel
- description: Add things to do, spin the wheel, let the universe pick. Items saved on this device.
- tags: ["random", "tools", "personal"]
- wip: true

## Behaviour notes

- Mobile-first. Big tap targets, big readable type. Wheel sized to fit a phone viewport.
- Spin is disabled when the items list is empty or while a spin is in flight.
- No streak / history yet; the result line shows only the most recent pick.
- Use existing primitives from `@/components/ui` (Button, TextInput, Tag, Eyebrow). Don't rebuild what's already there.
