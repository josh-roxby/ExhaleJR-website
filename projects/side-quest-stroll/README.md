# Side Quest Stroll

A small map-based game. Drop a "Quest Start" pin, pick a radius, and tap
Begin Quest to get a random spot to walk to plus a one-line side game to
play on the way ("photograph a red door", "find a mossy stone", "sketch
an unusual cloud"). Pin and history live on the device only.

## Layout

```
projects/side-quest-stroll/
  index.ts                  # public exports (Page, meta)
  meta.ts                   # slug, name, description, wip, tags
  page.tsx                  # entry. State machine + glue.
  data/
    types.ts                # Pin, Quest, SideQuestData,
                            # SIDE_QUEST_DATA_VERSION, defaults.
    word-banks.ts           # ACTIONS / ITEMS / DESCRIPTORS, split into
                            # common / city / countryside. `pool(cat,
                            # mode)` merges the right buckets per mode.
  lib/
    geo.ts                  # km↔deg, haversine distance, random point
                            # in radius (sqrt-uniform), Google Maps URL
                            # parser, lat/lng parser, formatters.
    routing.ts              # fetchWalkingRoute via public OSRM. Falls
                            # back to a great-circle straight line if
                            # the call fails / the router can't route.
    quest.ts                # generateQuestParts(mode). Picks one
                            # action / item / descriptor and stitches a
                            # friendly one-liner with a/an handling.
  components/
    map.tsx                 # Leaflet wrapper. Imported via next/dynamic
                            # with ssr: false. CARTO Dark Matter tiles.
                            # divIcon markers for pin (Iris dot) and
                            # target (★ in green). FitTo refits the
                            # view whenever pin / target / radius change.
                            # TapHandler reports clicks for pin setup.
    pin-setup.tsx           # Tabs: My location / Tap on map / Maps URL
                            # / Coords. Each method calls onPinSet.
                            # The tap method reuses the same Map.
    privacy-modal.tsx       # First-run popup. "Understood" persists to
                            # data.privacyAcknowledged.
    quest-card.tsx          # Active quest UI + LastQuestSummary card.
    history.tsx             # Past-quests list, Tag for status.
```

## Data

```ts
interface SideQuestData {
  pin: Pin | null;                   // { lat, lng, setAt }
  radiusKm: number;                  // slider value
  mode: "city" | "countryside" | "mixed";
  activeQuest: Quest | null;
  history: Quest[];                  // capped at 50, newest first
  privacyAcknowledged: boolean;
}
```

Persisted at `root.projects["side-quest-stroll"].data` in
`localStorage["exhalejr.user"]`. Schema versioned by
`SIDE_QUEST_DATA_VERSION`.

## External services

The page makes calls to two services while a quest is running:

- **CARTO Dark Matter** + **OpenStreetMap** for tiles. Tile servers see
  the user's map view but not the pin.
- **OSRM public demo** at `router.project-osrm.org` for the walking
  route. Origin and target are sent with each Begin Quest. If the call
  fails (rate limit, no route, network), the UI falls back to a dashed
  great-circle line and the quest card flips to "as the crow flies".

The privacy modal documents this on first run; "Understood" persists.

## Routing fallback flow

1. User taps Begin Quest.
2. `randomPointInRadius` picks a target with sqrt-uniform distance.
3. `fetchWalkingRoute(origin, target)` calls OSRM. If `code !== "Ok"`,
   no `routes`, or any error, returns `{ routed: false }` with a
   straight `[origin, target]` polyline.
4. The Quest is created with the resolved `route`, `distanceM`, and
   `routed` flag.
5. The map polyline is solid green for routed, dashed mute for fallback.
   The quest card mirrors via a Tag.

## Map zoom

The `FitTo` helper recomputes bounds in a `useEffect`:

- No active quest: bounds of the radius circle around the pin (with 24px
  padding).
- Active quest: bounds of [pin, target] padded 30 %.

The user can pan and zoom freely between recompute events; recompute
only fires when the relevant inputs change.
