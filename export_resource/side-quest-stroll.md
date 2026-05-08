# Side Quest Stroll — design & infrastructure export

A self-contained reference for porting the quest-map system into a new codebase. Covers every layer: state machine, types, storage, map rendering, geolocation, quest generation, perpendicular waypoint routing, live tracking, fullscreen UI, and the iOS-specific traps that took several rounds to solve.

This doc is written so a fresh project can recreate the system without needing to read the original source. Where a piece is unusual or hard-won, the actual code is included.

---

## 1. What it does

A walking app. The user drops a pin (their start), picks a radius (0.5–25 km), gets a random target point inside that radius, and walks to it while completing a small generated game (e.g. "Photograph an unusual cloud"). The walk is rendered as a loop on a dark map: outbound and return legs are routed separately so the trip isn't just there-and-back on the same road.

The whole experience is local-first. Coordinates and history live in `localStorage`; nothing is sent to a server we own. The only network call is to OSRM for walking-route geometry.

The core loop:

1. Acknowledge a one-time privacy modal.
2. Drop a start pin (geolocation or tap-on-map).
3. Pick a radius and a "mode" (city / countryside / mixed).
4. Tap *Begin quest*. A random target is chosen, a quest prompt generated, and two walking routes (out + back through perpendicular waypoints) are fetched in parallel.
5. The page transitions to a fullscreen map with the prompt panel pinned at the top, a live "you are here" dot, and four floating-nav actions (re-roll prompt, re-roll route, abandon, complete).
6. On complete or abandon the quest is appended to history.

---

## 2. State machine

The page lives in a single component. Three render branches, gated by hydration and the persisted `pin` and `activeQuest` fields:

| pin    | activeQuest | render                                                                |
| ------ | ----------- | --------------------------------------------------------------------- |
| null   | —           | `<PinSetup>` (tabs: My location / Tap on map)                         |
| set    | null        | preview map + radius slider + mode tabs + *Begin quest*               |
| set    | set         | fullscreen `<ActiveQuestView>` (prompt overlay + live map + nav slot) |

Hydration flag (`hydrated` from the storage hook) gates every branch — first render returns a `// LOADING` placeholder so SSR and client agree.

Transitions are pure state-set:

- pin set → store `{ ...p, setAt: ISO }`
- begin quest → run `planRoundTrip`, set `activeQuest`
- complete / abandon → push frozen quest into `history` (capped at 50), clear `activeQuest`
- change start → null `pin` and `activeQuest`

---

## 3. Stack

- **Next.js (App Router)** + **TypeScript strict** + **Tailwind**.
- **Leaflet 1.9** + **react-leaflet 5**. Bundled with the project; map module is dynamically imported with `ssr: false` so window-touching code never runs server-side.
- **CARTO Dark Matter** raster tiles for a black-and-grey basemap. No API key needed for non-commercial.
- **OSRM public demo** (`router.project-osrm.org`) for walking routes. Rate-limited; in production swap to Mapbox Directions or a self-hosted OSRM.

`package.json` deps that matter:

```json
{
  "@types/leaflet": "^1.9.21",
  "leaflet": "^1.9.4",
  "react": "^19.0.0",
  "react-leaflet": "^5.0.0"
}
```

---

## 4. Data model

All shared types live in `data/types.ts`. Reproduce verbatim:

```ts
export interface LatLng {
  lat: number;
  lng: number;
}

export interface Pin extends LatLng {
  /** When the pin was first set, ISO date. */
  setAt: string;
}

export type QuestMode = "city" | "countryside" | "mixed";
export type QuestStatus = "active" | "completed" | "abandoned";

export interface Quest {
  id: string;
  startedAt: string;     // ISO timestamp
  completedAt: string | null;
  status: QuestStatus;

  origin: LatLng;
  target: LatLng;

  /** Outbound walking distance in metres if the router returned one,
   *  otherwise the great-circle distance (with `routed: false`). */
  distanceM: number;
  routed: boolean;

  /** Outbound polyline as a flat array of [lat, lng] points. */
  route: [number, number][];
  /** Return-leg polyline (target → origin). Optional for back-compat
   *  with quests created before round-trip routing existed. */
  returnRoute?: [number, number][];
  returnDistanceM?: number;

  mode: QuestMode;
  action: string;
  item: string;
  descriptor: string;
  text: string;
}

export interface SideQuestData {
  pin: Pin | null;
  radiusKm: number;
  mode: QuestMode;
  activeQuest: Quest | null;
  history: Quest[];
  privacyAcknowledged: boolean;
}

export const SIDE_QUEST_DATA_VERSION = 1;

export const emptySideQuestData: SideQuestData = {
  pin: null,
  radiusKm: 2,
  mode: "mixed",
  activeQuest: null,
  history: [],
  privacyAcknowledged: false,
};

export const HISTORY_LIMIT = 50;

export function generateId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 10);
}
```

Bump `SIDE_QUEST_DATA_VERSION` when the persisted shape changes; the storage helper falls back to `emptySideQuestData` when the version doesn't match, rather than misreading old data.

`returnRoute` and `returnDistanceM` are optional only because they were added after the first ship. New projects can make them required.

---

## 5. Storage

Single key, single inspectable JSON object. The pattern is reusable across multiple projects on the same site, but stripped down here it's just:

```
localStorage.exhalejr.user → {
  v: 1,
  settings: { ... },
  projects: {
    "side-quest-stroll": { v: 1, data: SideQuestData }
  }
}
```

A small hook (`useProjectStorage<T>(slug, version, defaultData)`) returns `[data, setData, hydrated]`:

- `data` starts at `defaultData` on the server and the very first client paint, then is replaced from localStorage in a mount effect.
- `setData(updater)` accepts a value or a `(prev) => next` updater; only this project's slot is rewritten.
- `hydrated` flips to `true` once the client read has happened. Useful for guarding initial render branches without flashing default data.

For a new project the simplest version is:

```ts
const ROOT_KEY = "<your-app>.user";

function readSlot<T>(slug: string, version: number, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const root = JSON.parse(localStorage.getItem(ROOT_KEY) ?? "null");
    const slot = root?.projects?.[slug];
    if (!slot || slot.v !== version) return fallback;
    return slot.data as T;
  } catch {
    return fallback;
  }
}
```

The storage hook is the only place where `useEffect` writes to localStorage; everywhere else uses the returned `setData`. This is what keeps the persisted shape consistent.

---

## 6. Map layer

The map component is a thin `react-leaflet` wrapper. Key points:

```tsx
"use client";
import { Circle, MapContainer, Marker, Polyline, TileLayer, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";

import "leaflet/dist/leaflet.css";
import "../styles/map.css"; // critical, see §6.3

interface QuestMapProps {
  pin: LatLng | null;
  radiusKm: number;
  target?: LatLng | null;
  route?: [number, number][];
  routeDashed?: boolean;
  returnRoute?: [number, number][];
  returnRouteDashed?: boolean;
  onTap?: (latLng: LatLng) => void;
  height?: number | string;
  chromeless?: boolean;       // strips border + corner radius for fullscreen use
  liveLocation?: LatLng | null;
}
```

### 6.1 Tile layer

```tsx
<TileLayer
  attribution='&copy; OpenStreetMap, &copy; CARTO'
  url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
  subdomains={["a", "b", "c", "d"]}
  maxZoom={19}
  maxNativeZoom={19}
  keepBuffer={4}
  updateWhenZooming={false}
  updateWhenIdle={true}
/>
```

`{r}` retina suffix is handled by Leaflet automatically. `keepBuffer={4}` reduces tile thrash on pan.

### 6.2 Icon hoisting (avoid a Leaflet lifecycle gotcha)

Create div-icons at module scope, not per-render. React swapping out icon refs underneath an attached marker has caused crashes:

```ts
const PIN_ICON   = divIcon(pinIconHtml, 18);   // accent purple, start
const TARGET_ICON = divIcon(targetIconHtml, 26); // ok green star, target
const TAP_PREVIEW_ICON = divIcon(tapPreviewHtml, 14);
const LIVE_ICON  = L.divIcon({                 // sky blue dot, live position
  html: `<div class="sqs-live-dot"></div>`,
  className: "sqs-live-marker",
  iconSize: [22, 22],
  iconAnchor: [11, 11],
});
```

### 6.3 Critical CSS overrides

Two non-obvious fixes live in `styles/map.css`:

```css
/* Override Leaflet's default #ddd container bg so map gaps and the
 * pre-tile-load surface inherit the app's dark palette instead of
 * flashing white on zoom-out.
 *
 * `isolation: isolate` forces the leaflet-container to create its own
 * stacking context. Leaflet's internal panes range up to z-700 (popups);
 * without isolation those z-indexes bleed up the tree and outrank app
 * chrome (floating nav z-40, popovers z-50, modals). Isolation keeps all
 * Leaflet stacking scoped inside the map container. */
.leaflet-container {
  background: var(--bg);
  isolation: isolate;
}

.sqs-live-marker { pointer-events: none; }
.sqs-live-dot {
  position: absolute;
  left: 50%; top: 50%;
  width: 14px; height: 14px;
  background: #4faaff;
  border: 3px solid #fff;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 0 0 14px rgba(79, 170, 255, 0.75);
}
```

Without `isolation: isolate`, a Leaflet popup at z-700 will paint on top of your app's modals and bottom nav. This is silent and you'll only spot it when you try to interact with chrome above the map.

### 6.4 FitTo helper

A child component of `<MapContainer>` calls `useMap()` and refits the view whenever geometry changes. **Do not** create a `L.circle(...).getBounds()` to derive bounds — `getBounds()` walks `_map.layerPointToLatLng` and throws if the circle isn't yet attached to a map. This caused a hard page crash on first render whenever a pin was loaded from storage. Compute bounds manually from lat/lng deltas:

```ts
function FitTo({ pin, target, route, returnRoute, radiusKm }) {
  const map = useMap();
  useEffect(() => {
    if (!pin) return;
    if (target) {
      const points: [number, number][] = [
        [pin.lat, pin.lng],
        [target.lat, target.lng],
      ];
      if (route)        points.push(...route);
      if (returnRoute)  points.push(...returnRoute);
      const bounds = L.latLngBounds(points).pad(0.15);
      map.fitBounds(bounds);
      return;
    }
    // No target: fit a square around the pin sized to the radius.
    const radiusM = radiusKm * 1000;
    const latDelta = radiusM / 111320;
    const lngDelta = radiusM / (111320 * Math.cos((pin.lat * Math.PI) / 180));
    const bounds = L.latLngBounds(
      [pin.lat - latDelta, pin.lng - lngDelta],
      [pin.lat + latDelta, pin.lng + lngDelta],
    );
    map.fitBounds(bounds, { padding: [24, 24] });
  }, [map, pin, target, route, returnRoute, radiusKm]);
  return null;
}
```

### 6.5 Polyline colours

Out and return are visually distinct so the loop reads as a loop:

| Leg     | Colour                | Style                                 |
| ------- | --------------------- | ------------------------------------- |
| Out     | `var(--ok)` (green)   | solid                                 |
| Return  | `var(--accent)` (purple) | dotted (`dashArray: "2 6"`)        |
| Either, when fallen back to straight line | `var(--mute)` | `dashArray: "6 6"` |

---

## 7. Pin setup

Two methods. URL-paste and manual lat/lng coords used to exist; both were dropped because nobody reaches for them on a phone walk.

### 7.1 My location

```ts
navigator.geolocation.getCurrentPosition(
  (pos) => {
    const lat = pos.coords.latitude;
    const lng = pos.coords.longitude;
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      // iOS occasionally hands back non-finite values. Bail before
      // they ever reach the map.
      setError("Got an invalid location reading. Try again.");
      return;
    }
    // Defer the pin-set by one animation frame so iOS finishes
    // dismissing the permission UI before we tear down this component
    // and mount the map. Helps avoid a watchdog kill on memory-tight
    // PWAs.
    requestAnimationFrame(() => onPinSet({ lat, lng }));
  },
  (err) => setError(messageForGeoError(err)),
  { enableHighAccuracy: true, timeout: 15000, maximumAge: 60_000 },
);
```

### 7.2 Tap on map

A small map preview is rendered with `onTap`. Internally:

```ts
function TapHandler({ onTap }: { onTap?: (p: LatLng) => void }) {
  useMapEvents({
    click(e) {
      if (onTap) onTap({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });
  return null;
}
```

The user drags / pinches normally; tapping fires the handler.

### 7.3 Geolocation error mapping

iOS Safari and PWAs cache a permission denial and never re-prompt. The error fires instantly with `code: 1`. Map the three known codes to actionable text:

```ts
function messageForGeoError(err: GeolocationPositionError): string {
  switch (err.code) {
    case 1:
      return "Location is blocked for this site. Use Tap on map above, or re-enable in your browser settings (iPhone: tap AA in Safari's address bar → Website Settings → Location → Ask. PWA installed to home screen: remove the app, clear Safari's site data, then re-add).";
    case 2:
      return "Couldn't get a position fix. Try outdoors, or use Tap on map above.";
    case 3:
      return "Location took too long. Try again, or use Tap on map above.";
    default:
      return `Couldn't get location. ${err.message}`;
  }
}
```

### 7.4 Diagnostic block

A small mono panel sits under the *Use my location* button and surfaces the four gates that decide whether the prompt will fire on iOS. Live-updates if the user toggles permissions in Settings while the page is open (uses `PermissionStatus.onchange`).

```tsx
function Diagnostics() {
  type Perm = PermissionState | "unsupported" | "checking";
  const [perm, setPerm] = useState<Perm>("checking");
  const [secure, setSecure] = useState<boolean | null>(null);
  const [geoPresent, setGeoPresent] = useState<boolean | null>(null);
  const [pwa, setPwa] = useState<boolean | null>(null);
  const [origin, setOrigin] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") return;
    setSecure(window.isSecureContext);
    setGeoPresent("geolocation" in navigator);
    setPwa(window.matchMedia("(display-mode: standalone)").matches);
    setOrigin(window.location.origin);

    let cancelled = false;
    let status: PermissionStatus | null = null;
    if (navigator.permissions?.query) {
      navigator.permissions
        .query({ name: "geolocation" })
        .then((s) => {
          if (cancelled) return;
          status = s;
          setPerm(s.state);
          s.onchange = () => setPerm(s.state);
        })
        .catch(() => { if (!cancelled) setPerm("unsupported"); });
    } else {
      setPerm("unsupported");
    }
    return () => {
      cancelled = true;
      if (status) status.onchange = null;
    };
  }, []);

  // Render a five-row table: Permission, Secure, Geo API, Display, Origin.
  // Tone each row green/red based on whether it's a passing gate.
  // When perm === "denied", render an inline note pointing at:
  //   Settings → Privacy & Security → Location Services → Safari Websites
}
```

Reading the panel:

- `Permission = denied` → site- or OS-level. Inline note tells the user where to fix it.
- `Permission = unsupported` + `Secure = no` → page is being served over HTTP. Geolocation will never work. Fix the deployment.
- `Permission = prompt` → OS thinks they've never been asked. Tapping the button should show the prompt. If it doesn't, suspect Brave Shields or a content blocker.
- `Permission = granted` but the call still errors → transient code 2 (no GPS fix) or 3 (timeout).

---

## 8. Quest generation

Three word banks per category, one of which is mode-agnostic:

```ts
export const ACTIONS = {
  // Passive verbs only. No sketch / draw / map / trace because those
  // pull you off the walk.
  common: ["photograph", "find", "count", "observe", "describe", "name", "spot", "discuss"],
  city: ["research", "ask about", "compare"],
  countryside: ["identify", "listen for", "smell", "follow", "watch"],
} as const;

export const ITEMS = {
  common: ["tree", "bird", "dog", "cloud", "shadow", "sign", "vehicle", "person", "child",
           "door", "window", "light", "puddle", "stone", "leaf"],
  city: ["streetlight", "manhole cover", "sticker", "mural", "bench", "bike", "bus",
         "scaffold", "awning", "shop sign", "balcony", "statue", "fountain", "post box",
         "bin", "bus stop", "cyclist", "pigeon", "alleyway", "staircase", "chimney",
         "antenna", "coffee shop", "graffiti tag", "construction worker"],
  countryside: ["stream", "bridge", "gate", "path", "fence", "wildflower", "mushroom",
                "mossy stone", "animal track", "log", "bird call", "hedgerow", "cow",
                "sheep", "horse", "wooden post", "berry", "nest", "spider web",
                "old barn", "haybale", "weathervane", "pond", "boulder", "pine cone",
                "acorn"],
} as const;

export const DESCRIPTORS = {
  common: ["red", "blue", "yellow", "green", "orange", "white", "black", "purple",
           "old", "new", "weathered", "unusual", "large", "small", "tall", "short",
           "round", "crooked", "broken", "shiny", "interesting", "forgotten"],
  city: ["graffitied", "painted", "faded", "polished", "neon", "abandoned-looking", "freshly painted"],
  countryside: ["gnarled", "twisted", "mossy", "rusted", "overgrown", "fragrant", "still"],
} as const;
```

`pool(category, mode)` returns `[...common, ...city]` for city, `[...common, ...countryside]` for countryside, and all three for mixed.

Stitching:

```ts
function pick<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function articleFor(word: string): string {
  return /^[aeiou]/i.test(word) ? "an" : "a";
}

function capitalise(s: string): string {
  return s.length === 0 ? s : s[0].toUpperCase() + s.slice(1);
}

export function generateQuestParts(mode: QuestMode): QuestParts {
  const action     = pick(pool(ACTIONS, mode));
  const item       = pick(pool(ITEMS, mode));
  const descriptor = pick(pool(DESCRIPTORS, mode));
  const article    = articleFor(descriptor);
  const text       = `${capitalise(action)} ${article} ${descriptor} ${item}.`;
  return { action, item, descriptor, text };
}
```

Output examples: `"Photograph a red door."` / `"Listen for a fragrant hedgerow."` / `"Discuss an unusual cloud."` Imperfect grammar is part of the charm; randomness produces some weird combinations but they're memorable.

---

## 9. Random target

Uniform-distribution-inside-a-circle. The square-root on the random distance is the part that's wrong if you skip it (without it points cluster toward the centre).

```ts
const KM_PER_DEG_LAT = 111.32;

export function randomPointInRadius(center: LatLng, radiusKm: number): LatLng {
  const angle    = Math.random() * 2 * Math.PI;
  const distance = radiusKm * Math.sqrt(Math.random());
  const offsetLat = distance * Math.sin(angle) * (1 / KM_PER_DEG_LAT);
  const offsetLng = distance * Math.cos(angle) *
                    (1 / (KM_PER_DEG_LAT * Math.cos((center.lat * Math.PI) / 180)));
  return {
    lat: center.lat + offsetLat,
    lng: center.lng + offsetLng,
  };
}
```

Haversine for distance between two points (used in fallback distance and for live "have I arrived" checks if you want them):

```ts
const EARTH_RADIUS_KM = 6371;

export function distanceM(a: LatLng, b: LatLng): number {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const x = Math.sin(dLat / 2) ** 2
          + Math.sin(dLng / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);
  return 2 * EARTH_RADIUS_KM * 1000 * Math.asin(Math.sqrt(x));
}
```

---

## 10. Round-trip routing

OSRM doesn't natively give you "two different paths between A and B". Asking for `A → B` and then `B → A` typically returns the same road, just reversed. To force a loop, plan each leg through a perpendicular waypoint mirrored across the direct line.

### 10.1 Perpendicular waypoint maths

Convert the origin → target vector into local metres at the midpoint latitude, rotate 90° to get the perpendicular unit vector, scale to a chosen offset, convert back to lat/lng.

```ts
export function midpointWaypoints(
  a: LatLng,
  b: LatLng,
): { outward: LatLng; back: LatLng } {
  const M_PER_DEG_LAT = KM_PER_DEG_LAT * 1000;
  const midLat = (a.lat + b.lat) / 2;
  const midLng = (a.lng + b.lng) / 2;
  const cosLat = Math.cos((midLat * Math.PI) / 180);
  const M_PER_DEG_LNG = M_PER_DEG_LAT * cosLat;

  const dN = (b.lat - a.lat) * M_PER_DEG_LAT;
  const dE = (b.lng - a.lng) * M_PER_DEG_LNG;
  const length = Math.hypot(dN, dE);

  if (length === 0) {
    return {
      outward: { lat: midLat, lng: midLng },
      back:    { lat: midLat, lng: midLng },
    };
  }

  // Unit perpendicular (rotate origin→target 90° CCW: (-dE, dN)).
  const pN = -dE / length;
  const pE =  dN / length;

  // Scale offset with direct distance: 25%, clamped to 100..400m.
  const offsetM = Math.max(100, Math.min(400, length * 0.25));
  const offsetLat = (offsetM * pN) / M_PER_DEG_LAT;
  const offsetLng = (offsetM * pE) / M_PER_DEG_LNG;

  return {
    outward: { lat: midLat + offsetLat, lng: midLng + offsetLng },
    back:    { lat: midLat - offsetLat, lng: midLng - offsetLng },
  };
}
```

Pass `outward` as the via-point of the outbound leg and `back` as the via-point of the return leg. The two waypoints are mirrored across the direct line, so they're always `2 × offsetM` apart (200–800 m).

### 10.2 OSRM fetch

The endpoint takes any number of waypoints as `;`-separated `lng,lat` pairs:

```
GET /route/v1/foot/{lng,lat};{lng,lat};{lng,lat}?overview=full&geometries=geojson
```

Wrapper:

```ts
const OSRM_BASE = "https://router.project-osrm.org/route/v1/foot";

interface RouteResult {
  route: [number, number][];
  distanceM: number;
  routed: boolean;
}

export async function fetchWalkingRoute(
  waypoints: LatLng[],
  signal?: AbortSignal,
): Promise<RouteResult> {
  if (waypoints.length < 2) throw new Error("Need at least two waypoints");
  const path = waypoints.map((p) => `${p.lng},${p.lat}`).join(";");
  const url  = `${OSRM_BASE}/${path}?overview=full&geometries=geojson`;

  try {
    const res  = await fetch(url, { signal, headers: { Accept: "application/json" } });
    if (!res.ok) throw new Error(`OSRM ${res.status}`);
    const json = await res.json();
    if (json.code !== "Ok" || !json.routes?.length) throw new Error(`OSRM code=${json.code}`);
    const route  = json.routes[0];
    const coords = route.geometry?.coordinates ?? [];
    if (!coords.length) throw new Error("OSRM empty geometry");
    return {
      // OSRM returns [lng, lat]; convert to [lat, lng] for Leaflet.
      route: coords.map(([lng, lat]: [number, number]) => [lat, lng] as [number, number]),
      distanceM: route.distance,
      routed: true,
    };
  } catch {
    return straightLineFallback(waypoints);
  }
}

function straightLineFallback(waypoints: LatLng[]): RouteResult {
  let total = 0;
  for (let i = 1; i < waypoints.length; i++) {
    total += distanceM(waypoints[i - 1], waypoints[i]);
  }
  return {
    route: waypoints.map((p) => [p.lat, p.lng] as [number, number]),
    distanceM: total,
    routed: false,
  };
}
```

The fallback isn't only for offline use. OSRM's demo server returns 429 when rate-limited, and silently failed routes need a graceful fallback rather than a blank map.

### 10.3 Round-trip planner

Combine waypoints + parallel fetch + fallback flag:

```ts
async function planRoundTrip(origin: LatLng, target: LatLng) {
  const { outward, back: returnVia } = midpointWaypoints(origin, target);
  const straight = distanceM(origin, target);

  // Defaults — used if both legs throw.
  let route:        [number, number][] = [[origin.lat, origin.lng], [target.lat, target.lng]];
  let returnRoute:  [number, number][] = [[target.lat, target.lng], [origin.lat, origin.lng]];
  let outDistanceM = straight;
  let returnDistanceM = straight;
  let routed = false;

  try {
    const [out, back] = await Promise.all([
      fetchWalkingRoute([origin, outward, target]),
      fetchWalkingRoute([target, returnVia, origin]),
    ]);
    route        = out.route;
    returnRoute  = back.route;
    outDistanceM = out.distanceM;
    returnDistanceM = back.distanceM;
    // Treat the trip as "routed" only if BOTH legs came back from the
    // router. If either fell back to straight-line, the UI flags it.
    routed = out.routed && back.routed;
  } catch {
    // fetchWalkingRoute already falls back internally; defensive only.
  }

  return { route, returnRoute, distanceM: outDistanceM, returnDistanceM, routed };
}
```

`planRoundTrip` is called by both `beginQuest` (initial trip) and `rerollRoute` (new target, re-fetch). Same flow, different consumers.

---

## 11. Walking time estimate

One pace constant, one formatter. Round-trip duration is shown on the active quest as `X km loop · ~Y min`.

```ts
const WALKING_PACE_KMH = 5;

export function walkingMinutes(distanceM: number): number {
  return ((distanceM / 1000) / WALKING_PACE_KMH) * 60;
}

export function formatWalkingTime(distanceM: number): string {
  const minutes = Math.round(walkingMinutes(distanceM));
  if (minutes < 1)  return "<1 min";
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m === 0 ? `${h}h` : `${h}h ${m}m`;
}
```

For loop distance, sum out + return: `quest.distanceM + (quest.returnDistanceM ?? quest.distanceM)`. The `??` fallback covers older quests that pre-date the round-trip change.

---

## 12. Live location

A hook that watches the device location while a quest is active. Cleared on unmount or when `active` flips to false.

```tsx
"use client";
import { useEffect, useState } from "react";

interface LiveState {
  position: LatLng | null;
  accuracyM: number | null;
  error: string | null;
}

const initialState: LiveState = { position: null, accuracyM: null, error: null };

export function useLiveLocation(active: boolean): LiveState {
  const [state, setState] = useState<LiveState>(initialState);

  useEffect(() => {
    if (!active) {
      setState(initialState);
      return;
    }
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setState({ ...initialState, error: "Browser doesn't support geolocation." });
      return;
    }

    const id = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude, accuracy } = pos.coords;
        if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return;
        setState({
          position: { lat: latitude, lng: longitude },
          accuracyM: accuracy ?? null,
          error: null,
        });
      },
      (err) => setState((s) => ({ ...s, error: err.message })),
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 30000 },
    );
    return () => navigator.geolocation.clearWatch(id);
  }, [active]);

  return state;
}
```

Heading was tried (`coords.heading`, rotated SVG cone) and dropped: at walking pace iOS Safari returns `null` more often than a value, so the cone flickered. Just the dot is calmer and just as useful.

The marker uses a hoisted `LIVE_ICON` divIcon (see §6.2) and `zIndexOffset={1000}` so it always sits above route lines and other markers.

`useLiveLocation` is called unconditionally at the top of the page component with `active = hydrated && !!data.activeQuest`, so React's hook rules are satisfied; the hook itself bails when `active` is false.

---

## 13. Fullscreen UI

Active quest state replaces the normal page layout entirely.

```tsx
<div className="fixed inset-0 z-30 bg-bg">
  <div className="absolute inset-0">{map}</div>

  {/* Top panel: prompt + meta. z-[1000] clears Leaflet's pane stack. */}
  <div className="pointer-events-none absolute inset-x-0 top-0 z-[1000] px-3 pt-[calc(0.75rem+env(safe-area-inset-top))]">
    <Card>
      <Eyebrow>// SIDE QUEST · ACTIVE</Eyebrow>
      <span>{`STARTED ${formatTime(quest.startedAt)}`}</span>
      <p className="font-display text-2xl font-black">{quest.text}</p>
      <Tag>{quest.mode}</Tag>
      <Tag variant={quest.routed ? "ok" : "warn"}>
        {quest.routed ? "routed" : "as the crow flies"}
      </Tag>
      <Tag variant="accent">
        {`${formatDistance(loopDistanceM)} loop · ~${formatWalkingTime(loopDistanceM)}`}
      </Tag>
    </Card>
  </div>
</div>
```

Notes:

- `z-30` puts the takeover above scroll content but below the floating nav at `z-40`. The nav stays usable.
- The top panel sets `z-[1000]` because Leaflet's internal panes peak at z-700 and would otherwise paint over the prompt.
- Bottom action buttons live in the floating nav slot, not in the takeover. See §14.
- `pointer-events-none` on the panel wrapper + `pointer-events-auto` on the inner card lets the rest of the visible area through to the map for pan / pinch.

---

## 14. Reroll mechanics & nav slot

The site has a global floating bottom nav with a portal slot for per-page items (`<NavSecondary>`). Side-quest pushes different items into it depending on state:

| State                             | Items in NavSecondary                                                         |
| --------------------------------- | ----------------------------------------------------------------------------- |
| pin set, no active quest          | Pin-reset (change start)                                                      |
| active quest                      | Quest-reroll (Q glyph), Route-reroll (pin glyph), Abandon (red X), Complete (green check-circle) |

Two reroll actions, two semantics:

- **Quest reroll** keeps the target / route / distances and reshuffles only `action / item / descriptor / text`. Synchronous.
- **Route reroll** keeps the prompt text and picks a new random target, then re-runs `planRoundTrip`. Async; both reroll buttons disable while a plan is in flight.

```ts
const rerollQuest = () => {
  setData((prev) => {
    if (!prev.activeQuest) return prev;
    const parts = generateQuestParts(prev.activeQuest.mode);
    return {
      ...prev,
      activeQuest: { ...prev.activeQuest, ...parts },
    };
  });
};

const rerollRoute = async () => {
  if (!data.pin || !data.activeQuest || pending) return;
  setPending(true);
  const target = randomPointInRadius(data.pin, data.radiusKm);
  const plan   = await planRoundTrip(data.pin, target);
  setData((prev) => {
    if (!prev.activeQuest) return prev;
    return {
      ...prev,
      activeQuest: {
        ...prev.activeQuest,
        target,
        route: plan.route,
        returnRoute: plan.returnRoute,
        distanceM: plan.distanceM,
        returnDistanceM: plan.returnDistanceM,
        routed: plan.routed,
      },
    };
  });
  setPending(false);
};
```

### 14.1 Icons

Inline SVGs, all 17×17 in a 24-unit viewBox. Stroke colour either `currentColor` (mute, picks up nav theme) or one of the design tokens.

Quest-reroll (refresh arc + Q-shaped circle-with-tail glyph):

```jsx
<svg width="17" height="17" viewBox="0 0 24 24" fill="none"
     stroke="var(--accent)" strokeWidth="1.8"
     strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
  <path d="M21 12a9 9 0 1 1-3.5-7.1" />
  <polyline points="21 4 21 10 15 10" />
  <circle cx="11" cy="13.5" r="2.5" />
  <path d="m12.7 15.2 1.5 1.5" />
</svg>
```

Route-reroll (refresh arc + teardrop-pin glyph):

```jsx
<svg width="17" height="17" viewBox="0 0 24 24" fill="none"
     stroke="var(--accent)" strokeWidth="1.8"
     strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
  <path d="M21 12a9 9 0 1 1-3.5-7.1" />
  <polyline points="21 4 21 10 15 10" />
  <path d="M11 17s2.4-2.2 2.4-3.8a2.4 2.4 0 0 0-4.8 0c0 1.6 2.4 3.8 2.4 3.8z" />
  <circle cx="11" cy="13.4" r="0.8" fill="var(--accent)" stroke="none" />
</svg>
```

Abandon (red X) and Complete (green check inside circle) use `var(--warn)` and `var(--ok)` respectively.

---

## 15. History

Append-only list capped at 50, render only when non-empty:

```ts
const finishQuest = (status: "completed" | "abandoned") => {
  setData((prev) => {
    if (!prev.activeQuest) return prev;
    const finished: Quest = {
      ...prev.activeQuest,
      status,
      completedAt: new Date().toISOString(),
    };
    const history = [finished, ...prev.history].slice(0, HISTORY_LIMIT);
    return { ...prev, activeQuest: null, history };
  });
};

const clearHistory = () => {
  setData((prev) => ({ ...prev, history: [] }));
};
```

The list component shows each entry as a card with prompt, mode, distance, and a status tag (ok / warn / dev colour). A small mute→warn "Clear" link sits next to the `// HISTORY · N` eyebrow. Single click, no modal — matches the project's destructive-action pattern (Abandon, Reset pin).

---

## 16. Privacy modal

One-time on first visit, blocking until acknowledged. Simple opaque modal, no dim:

> Side Quest Stroll keeps your start pin and quest history on this device only. They never leave your browser. The only network call is to OSRM for walking-route geometry. Tap *Got it* to continue.

`privacyAcknowledged: boolean` lives in the persisted data. Once true, never shown again unless the user clears storage.

---

## 17. Known iOS pitfalls

These are the issues that cost the most time. Bake them into the new project from day one.

### 17.1 `_map.layerPointToLatLng` crash on first render

Triggered by `L.circle(...).getBounds()` on a circle that isn't yet attached to a map. `getBounds()` walks `_map.layerPointToLatLng`; with no map, that's undefined and React's render boundary catches the throw as a hard page error. **Fix: never call `getBounds()` on a Leaflet layer you've not added to a map.** Compute fit-bounds manually from the data you already have (centre + radius / explicit lat-lng list).

This crash was particularly annoying because once the pin was in localStorage, the page loaded the map with a pin already set on every visit, and crashed every time. Refresh-persistent crash from a stale-cache standpoint — until users figure out it's about the *data*, not the bundle.

### 17.2 White flash on map zoom-out

Leaflet's default `.leaflet-container` background is `#ddd`. On zoom-out and during pre-tile-load, gaps render as light grey. Override:

```css
.leaflet-container {
  background: var(--bg);
  isolation: isolate;
}
```

### 17.3 Leaflet panes outranking app chrome

Leaflet's internal panes use z-indexes up to ~700 (popups). Without a stacking context boundary, those z-indexes apply globally and outrank app chrome at z-40 / z-50 — your floating nav and modal will paint *under* the map. Fix is the same `isolation: isolate` line as above. Cleanest possible fix; nothing else to change.

### 17.4 Geolocation permission caching

Once the user dismisses or denies the iOS prompt, iOS caches the denial. Subsequent calls fire the error callback with `code: 1` instantly with no prompt. Fixing it is on the user side:

- Safari browser: AA in address bar → Website Settings → Location → Ask.
- iOS PWA on home screen: remove the app, clear Safari's site data for the origin, re-add to home screen.
- OS-level: Settings → Privacy & Security → Location Services → Safari Websites → "While Using" or "Ask".
- Brave on iOS: Brave has its own row in OS Location Services *and* a Shields layer that can suppress the API at "Strict".

The diagnostic block in §7.4 surfaces which gate is closed.

### 17.5 PWA OOM on geolocation prompt dismiss → map mount

On memory-tight iPhones, dismissing the iOS permission UI and immediately mounting the heavy Leaflet chunk has been observed to trigger watchdog kills of the PWA. Two mitigations baked in:

```ts
// Pre-load the map module on page mount, so it's already in memory when
// geolocation succeeds and the layout transitions to map view.
useEffect(() => {
  void import("./components/map");
}, []);

// Defer the pin-set callback by one animation frame so iOS finishes
// dismissing the permission UI before we tear down PinSetup.
requestAnimationFrame(() => onPinSet({ lat, lng }));
```

### 17.6 NaN coordinates

iOS Geolocation occasionally returns `Infinity` / `NaN` for coords. Always guard before passing to Leaflet:

```ts
if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
  setError("Got an invalid location reading. Try again.");
  return;
}
```

### 17.7 Background tracking pauses

When the device locks or the PWA backgrounds, `watchPosition` typically pauses. The dot freezes until the app returns. Real-deal navigation apps work around this with background-location entitlements; for a casual walk timer, accept it.

---

## 18. File structure

```
projects/side-quest-stroll/
├── data/
│   ├── types.ts          # interfaces, defaults, version, generateId
│   └── word-banks.ts     # ACTIONS / ITEMS / DESCRIPTORS, pool()
├── lib/
│   ├── geo.ts            # KM_PER_DEG_LAT, distanceM, randomPointInRadius,
│   │                       midpointWaypoints, formatLatLng, formatDistance
│   ├── quest.ts          # generateQuestParts, articleFor, capitalise
│   ├── routing.ts        # fetchWalkingRoute, straightLineFallback, OSRM_BASE
│   └── walking.ts        # WALKING_PACE_KMH, walkingMinutes, formatWalkingTime
├── hooks/
│   └── use-live-location.ts
├── components/
│   ├── map.tsx           # Leaflet wrapper, FitTo, TapHandler, hoisted icons
│   ├── pin-setup.tsx     # tabs, GeolocateMethod, TapMethod, Diagnostics
│   ├── quest-card.tsx    # ActiveQuestView (fullscreen overlay), LastQuestSummary
│   ├── history.tsx       # list + Clear link
│   └── privacy-modal.tsx
├── styles/
│   └── map.css           # Leaflet bg + isolation + live-marker
└── page.tsx              # state machine, beginQuest, planRoundTrip,
                            rerollQuest, rerollRoute, finishQuest, clearHistory,
                            navSlot, conditional fullscreen layout
```

---

## 19. Migration notes

Pieces you'll need outside this project's directory:

- A `cn(...)` className concatenator (any flavour — clsx, tailwind-merge, plain template).
- A `<Card>` component with at minimum a `hover` prop variant.
- A `<Button>` component with `variant: "primary" | "ghost" | ...` and optional `leadingIcon`.
- A `<Tab>` / `<Tabs>` set, used in pin-setup and the radius/mode picker.
- An `<Eyebrow>` (small mono uppercase label) and `<Tag>` (square tag) — easy to inline if you don't already have them.
- A `<Slider>` for the radius picker.
- A `<NavSecondary>` portal pattern *or* swap the floating nav slot for an in-page action bar inside `<ActiveQuestView>`. The original lab project keeps a global bottom-floating nav with a per-page portal slot; in a fresh project the simpler approach is a sticky bottom action bar inside the takeover.
- Design tokens used in the code (CSS custom properties): `--bg`, `--surface`, `--ink`, `--mute`, `--mute-2`, `--mute-3`, `--line`, `--line-2`, `--accent`, `--accent-glow`, `--accent-on`, `--ok`, `--warn`, `--f-display`, `--f-body`, `--f-mono`. Replace with whatever your design system uses.

What you'll want to review before shipping:

- **OSRM**: the public demo is rate-limited and not for production. Swap to Mapbox Directions, GraphHopper, or self-hosted OSRM. The wrapper signature is the same — only `OSRM_BASE` and the response parsing change.
- **Tile server**: CARTO Dark Matter is free for non-commercial. For commercial use either pay CARTO, switch to Mapbox / Stadia / Maptiler, or self-host OpenStreetMap tiles.
- **Service worker**: the original project ships a passthrough SW. If you want offline tile caching, that's where it goes. Be careful — caching tiles aggressively without invalidation is how you ship users a stale map for weeks.
- **Privacy copy**: rewrite for your app's specifics. Mention any analytics, error reporting, or third-party endpoints (OSRM is the only network call here, but if you add Sentry / PostHog / etc the privacy modal needs to say so).
- **Background location**: if "navigate me" is part of the product, you'll need a native shell with background-location entitlements. PWA `watchPosition` alone won't cut it for screen-locked walks.

---

## 20. Quick implementation checklist

1. Pull in the type file (`data/types.ts`) verbatim. Done.
2. Drop in the geometry / routing / quest / walking helpers (`lib/*.ts`). Done.
3. Set up the storage hook with whatever single-key namespace your app uses.
4. Add Leaflet + react-leaflet. Add the `styles/map.css` overrides on day one.
5. Build the map wrapper with hoisted icons, FitTo helper, polyline render. Don't call `getBounds()` on detached layers.
6. Build PinSetup with the two methods + diagnostic panel.
7. Build the active-quest fullscreen view; pin its top panel at `z-[1000]`.
8. Wire up `beginQuest` → `planRoundTrip`, plus `rerollQuest` and `rerollRoute`.
9. Add `useLiveLocation` and pass through to the map.
10. Add history with Clear link.

You'll be back to a working quest in a couple of evenings.
