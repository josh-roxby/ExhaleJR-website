A small map-based game. Drop a "Quest Start" pin, pick a radius, tap Begin Quest. The page picks a random point inside the radius, plots a walking route to it, and generates a one-line side-game to play on the way ("photograph a red door", "sketch a mossy stone").

## What it does

- A single page with a state machine: **no pin → pin + ready → active quest**.
- Pin can be set four ways: browser geolocation, tapping on the map, pasting a Google Maps URL (long-form, `@lat,lng` segment), or pasting raw `lat,lng` coordinates. Pin persists locally.
- Map: Leaflet with CARTO Dark Matter tiles (free, dark, no API key). Custom div-icon markers (Iris dot for the pin, green ★ for the target). A dashed circle of the chosen radius. The map auto-fits to the circle when no quest is active and to the [pin, target] bounds when a quest is active.
- Radius slider 0.5 – 25 km, 0.5 km step.
- Quest mode tabs: City, Countryside, Mixed. The mode chooses which word banks the generator pulls from.
- Begin Quest: picks a random uniform-area point inside the radius (sqrt scaling), calls public OSRM for a walking route, and generates a quest text with an `[Action] a/an [Descriptor] [Item]` template. If OSRM fails, falls back to a straight dashed line and a `as the crow flies` tag on the quest card.
- Active quest card: large display-font quest text, distance, mode, routed/unrouted tag, **Mark done** and **Abandon** buttons. Both move the quest into history with the appropriate status.
- History: last 50 quests, newest first. Each shows the quest text, timestamp, mode, distance, and a status tag (`completed` / `abandoned`).
- First-run privacy modal explains the data model and the two external services (tiles + routing). One tap on "Understood" persists the acknowledgement.

## Data structure

```ts
interface Pin { lat: number; lng: number; setAt: string; }

interface Quest {
  id: string;
  startedAt: string;
  completedAt: string | null;
  status: "active" | "completed" | "abandoned";
  origin: { lat: number; lng: number };
  target: { lat: number; lng: number };
  distanceM: number;
  routed: boolean;
  route: [number, number][]; // [lat, lng] points
  mode: "city" | "countryside" | "mixed";
  action: string;
  item: string;
  descriptor: string;
  text: string;
}

interface SideQuestData {
  pin: Pin | null;
  radiusKm: number;
  mode: "city" | "countryside" | "mixed";
  activeQuest: Quest | null;
  history: Quest[];      // cap 50, newest first
  privacyAcknowledged: boolean;
}
```

Persisted via `useProjectStorage` so the rest of the user's stored data stays untouched.

## Project meta

- slug: side-quest-stroll
- name: Side Quest Stroll
- description: Drop a pin, pick a radius, get a random spot to walk to and a small game to play on the way. Pin and history live on your device.
- tags: ["walks", "outdoor", "tools", "personal"]
- wip: true

## Behaviour notes

- Mobile-first. Big tap targets, big readable type, scrollable map area.
- Use existing primitives from `@/components/ui` (Button, Slider, Tabs/Tab, TextInput, FieldLabel, Card, Tag, Modal, Eyebrow). Don't rebuild what's already there.
- Use `useProjectStorage("side-quest-stroll", 1, defaultData)` for persistence; bump the version if the shape changes.
- The map component uses `next/dynamic` with `ssr: false` because Leaflet touches `window`.
- For the walking route, call public OSRM (`router.project-osrm.org`) for foot routes with `overview=full&geometries=geojson`. On any failure, return a great-circle straight line and `routed: false`. Do not throw to the page — the quest is still useful with a fallback line.
- Word banks: ~10–20 per category (actions / items / descriptors), split into `common` / `city` / `countryside`. `pool(category, mode)` merges the right buckets. Drafted word banks are friendly and broadly achievable (no rare wildlife, no obscure architecture).
