"use client";

// Side Quest Stroll. Drop a pin, pick a radius, get a random target inside
// it, walk there while doing a small game (action + descriptor + item).
//
// State machine in a single page component:
//   - no pin           → <PinSetup>
//   - pin + no quest   → map + radius slider + mode tabs + Begin Quest
//   - active quest     → fullscreen map (out + back routes) + ActiveQuestView
// History stays visible under the active surface in all states.

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

import { Button, Eyebrow, NavItem, NavSecondary, Slider, Tab, Tabs } from "@/components/ui";
import { useProjectStorage } from "@/hooks/use-project-storage";

import { History } from "./components/history";
import { PinSetup } from "./components/pin-setup";
import { PrivacyModal } from "./components/privacy-modal";
import { ActiveQuestView, LastQuestSummary } from "./components/quest-card";
import { useLiveLocation } from "./hooks/use-live-location";
import {
  emptySideQuestData,
  generateId,
  HISTORY_LIMIT,
  SIDE_QUEST_DATA_VERSION,
  type LatLng,
  type Pin,
  type Quest,
  type QuestMode,
  type SideQuestData,
} from "./data/types";
import {
  distanceM,
  formatLatLng,
  midpointWaypoints,
  randomPointInRadius,
} from "./lib/geo";
import { generateQuestParts } from "./lib/quest";
import { fetchWalkingRoute } from "./lib/routing";
import { meta } from "./meta";

// Lazy map (Leaflet touches window). ssr: false makes Next skip the
// server render of this subtree entirely.
const QuestMap = dynamic(() => import("./components/map"), { ssr: false });

const MIN_RADIUS = 0.5;
const MAX_RADIUS = 25;

export function Page() {
  const [data, setData, hydrated] = useProjectStorage<SideQuestData>(
    meta.slug,
    SIDE_QUEST_DATA_VERSION,
    emptySideQuestData,
  );
  const [pending, setPending] = useState(false);

  // Live location tracking — only watches while a quest is active.
  const live = useLiveLocation(hydrated && !!data.activeQuest);

  // Pre-load the heavy Leaflet chunk as soon as the page mounts. This way
  // when geolocation succeeds and we transition pin-setup → map, the chunk
  // is already in memory. Avoids a network fetch + parse happening
  // immediately after the iOS permission dialog dismisses, which has been
  // observed to OOM-kill PWAs on tight devices.
  useEffect(() => {
    void import("./components/map");
  }, []);

  const setPin = (p: LatLng) => {
    const pin: Pin = { ...p, setAt: new Date().toISOString() };
    setData((prev) => ({ ...prev, pin }));
  };

  const clearPin = () => {
    setData((prev) => ({ ...prev, pin: null, activeQuest: null }));
  };

  const setRadiusKm = (n: number) => {
    setData((prev) => ({ ...prev, radiusKm: n }));
  };

  const setMode = (m: QuestMode) => {
    setData((prev) => ({ ...prev, mode: m }));
  };

  const acknowledgePrivacy = () => {
    setData((prev) => ({ ...prev, privacyAcknowledged: true }));
  };

  const beginQuest = async () => {
    if (!data.pin || pending) return;
    setPending(true);
    const target = randomPointInRadius(data.pin, data.radiusKm);
    const parts = generateQuestParts(data.mode);
    const plan = await planRoundTrip(data.pin, target);

    const quest: Quest = {
      id: generateId(),
      startedAt: new Date().toISOString(),
      completedAt: null,
      status: "active",
      origin: { lat: data.pin.lat, lng: data.pin.lng },
      target,
      distanceM: plan.distanceM,
      returnDistanceM: plan.returnDistanceM,
      routed: plan.routed,
      route: plan.route,
      returnRoute: plan.returnRoute,
      mode: data.mode,
      action: parts.action,
      item: parts.item,
      descriptor: parts.descriptor,
      text: parts.text,
    };

    setData((prev) => ({ ...prev, activeQuest: quest }));
    setPending(false);
  };

  const rerollQuest = () => {
    setData((prev) => {
      if (!prev.activeQuest) return prev;
      const parts = generateQuestParts(prev.activeQuest.mode);
      return {
        ...prev,
        activeQuest: {
          ...prev.activeQuest,
          action: parts.action,
          item: parts.item,
          descriptor: parts.descriptor,
          text: parts.text,
        },
      };
    });
  };

  const rerollRoute = async () => {
    if (!data.pin || !data.activeQuest || pending) return;
    setPending(true);
    const target = randomPointInRadius(data.pin, data.radiusKm);
    const plan = await planRoundTrip(data.pin, target);

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

  const clearHistory = () => {
    setData((prev) => ({ ...prev, history: [] }));
  };

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

  const lastQuest = data.history[0] ?? null;

  // Active quest takes over the viewport. The floating nav swaps to the
  // three quest actions (re-roll / abandon / complete) instead of the
  // change-start pin reset.
  if (hydrated && data.pin && data.activeQuest) {
    return (
      <>
        <NavSecondary>
          <NavItem
            aria-label="Re-roll quest prompt"
            onClick={rerollQuest}
            disabled={pending}
          >
            <QuestRerollIcon />
          </NavItem>
          <NavItem
            aria-label="Re-roll route and target"
            onClick={rerollRoute}
            disabled={pending}
          >
            <RouteRerollIcon />
          </NavItem>
          <NavItem
            aria-label="Abandon quest"
            onClick={() => finishQuest("abandoned")}
          >
            <AbandonIcon />
          </NavItem>
          <NavItem
            aria-label="Mark quest done"
            onClick={() => finishQuest("completed")}
          >
            <CompleteIcon />
          </NavItem>
        </NavSecondary>
        <ActiveQuestView
          quest={data.activeQuest}
          map={
            <QuestMap
              pin={data.pin}
              radiusKm={data.radiusKm}
              target={data.activeQuest.target}
              route={data.activeQuest.route}
              routeDashed={!data.activeQuest.routed}
              returnRoute={data.activeQuest.returnRoute}
              returnRouteDashed={!data.activeQuest.routed}
              liveLocation={live.position}
              chromeless
            />
          }
        />
      </>
    );
  }

  // Pre-quest secondary nav — change-start pin reset when a pin is set.
  const navSlot = hydrated && data.pin && (
    <NavSecondary>
      <NavItem
        aria-label="Change start position"
        onClick={clearPin}
      >
        <PinResetIcon />
      </NavItem>
    </NavSecondary>
  );

  return (
    <main className="mx-auto max-w-3xl space-y-8 pb-12">
      {navSlot}

      <header>
        <Eyebrow tone="accent" withPulseDot>// SIDE QUEST STROLL · v0.0</Eyebrow>
        <h1 className="mt-2 font-display text-5xl font-black leading-[0.95] tracking-tight">
          A walk, with a <span className="text-accent">side quest</span>.
        </h1>
        <p className="mt-3 max-w-xl text-ink-2">
          Drop a pin, pick a radius, the universe picks a place. Walk there
          and complete the small game on the way.
        </p>
      </header>

      <PrivacyModal
        open={hydrated && !data.privacyAcknowledged}
        onAcknowledge={acknowledgePrivacy}
      />

      {!hydrated ? (
        <div className="rounded-sq-md border border-dashed border-line-2 bg-surface/40 p-8 text-center">
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-mute-3">
            // LOADING
          </p>
        </div>
      ) : !data.pin ? (
        <PinSetup onPinSet={setPin} />
      ) : (
        <>
          <QuestMap
            pin={data.pin}
            radiusKm={data.radiusKm}
            height={320}
          />

          <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-mute-2">
            <span>{`// PIN · ${formatLatLng(data.pin)}`}</span>
            <button
              type="button"
              onClick={clearPin}
              className="text-mute hover:text-warn"
            >
              Reset pin
            </button>
          </div>

          <ReadySection
            radiusKm={data.radiusKm}
            mode={data.mode}
            onRadius={setRadiusKm}
            onMode={setMode}
            onBegin={beginQuest}
            pending={pending}
          />

          {lastQuest && <LastQuestSummary quest={lastQuest} />}
        </>
      )}

      {hydrated && data.history.length > 0 && (
        <History quests={data.history} onClear={clearHistory} />
      )}
    </main>
  );
}

interface ReadySectionProps {
  radiusKm: number;
  mode: QuestMode;
  onRadius: (n: number) => void;
  onMode: (m: QuestMode) => void;
  onBegin: () => void;
  pending: boolean;
}

function ReadySection({
  radiusKm,
  mode,
  onRadius,
  onMode,
  onBegin,
  pending,
}: ReadySectionProps) {
  return (
    <section className="space-y-5 rounded-sq-md border border-line-2 bg-surface p-5">
      <div className="space-y-2">
        <div className="flex items-baseline justify-between">
          <Eyebrow tone="mute" size="sm">// RADIUS</Eyebrow>
          <span className="font-display text-xl font-black tabular-nums tracking-tight text-ink">
            {radiusKm.toFixed(1)} km
          </span>
        </div>
        <Slider
          min={MIN_RADIUS}
          max={MAX_RADIUS}
          step={0.5}
          value={radiusKm}
          onChange={onRadius}
          aria-label="Quest radius in kilometres"
        />
        <div className="flex justify-between font-mono text-[10px] tracking-[0.18em] text-mute-3">
          <span>{`${MIN_RADIUS} km`}</span>
          <span>{`${MAX_RADIUS} km`}</span>
        </div>
      </div>

      <div className="space-y-2">
        <Eyebrow tone="mute" size="sm">// MODE</Eyebrow>
        <Tabs
          value={mode}
          onChange={(v) => onMode(v as QuestMode)}
          variant="pill"
        >
          <Tab value="city">City</Tab>
          <Tab value="countryside">Countryside</Tab>
          <Tab value="mixed">Mixed</Tab>
        </Tabs>
      </div>

      <div className="flex justify-end">
        <Button variant="primary" onClick={onBegin} disabled={pending}>
          {pending ? "Plotting…" : "Begin quest"}
        </Button>
      </div>
    </section>
  );
}

// Round-trip planner. Builds two via-pointed legs (origin → midpoint+offset →
// target, target → midpoint-offset → origin) so OSRM doesn't return the
// same path twice. Falls back internally; routed only when both legs route.
async function planRoundTrip(
  origin: LatLng,
  target: LatLng,
): Promise<{
  route: [number, number][];
  returnRoute: [number, number][];
  distanceM: number;
  returnDistanceM: number;
  routed: boolean;
}> {
  const { outward, back: returnVia } = midpointWaypoints(origin, target);
  const straightDistance = distanceM(origin, target);

  let route: [number, number][] = [
    [origin.lat, origin.lng],
    [target.lat, target.lng],
  ];
  let returnRoute: [number, number][] = [
    [target.lat, target.lng],
    [origin.lat, origin.lng],
  ];
  let outDistanceM = straightDistance;
  let returnDistanceM = straightDistance;
  let routed = false;

  try {
    const [out, back] = await Promise.all([
      fetchWalkingRoute([origin, outward, target]),
      fetchWalkingRoute([target, returnVia, origin]),
    ]);
    route = out.route;
    returnRoute = back.route;
    outDistanceM = out.distanceM;
    returnDistanceM = back.distanceM;
    routed = out.routed && back.routed;
  } catch {
    // fetchWalkingRoute already falls back internally; defensive only.
  }

  return { route, returnRoute, distanceM: outDistanceM, returnDistanceM, routed };
}

function PinResetIcon() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M21 12a9 9 0 1 1-3.5-7.1" />
      <polyline points="21 4 21 10 15 10" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  );
}

// Refresh arc with a Q glyph (circle + small tail) sat in the centre.
// Re-rolls just the prompt text — keeps the target and route as-is.
function QuestRerollIcon() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="var(--accent)"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M21 12a9 9 0 1 1-3.5-7.1" />
      <polyline points="21 4 21 10 15 10" />
      <circle cx="11" cy="13.5" r="2.5" />
      <path d="m12.7 15.2 1.5 1.5" />
    </svg>
  );
}

// Refresh arc with a teardrop pin in the centre. Re-rolls the target
// and re-fetches both walking legs.
function RouteRerollIcon() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="var(--accent)"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M21 12a9 9 0 1 1-3.5-7.1" />
      <polyline points="21 4 21 10 15 10" />
      <path d="M11 17s2.4-2.2 2.4-3.8a2.4 2.4 0 0 0-4.8 0c0 1.6 2.4 3.8 2.4 3.8z" />
      <circle cx="11" cy="13.4" r="0.8" fill="var(--accent)" stroke="none" />
    </svg>
  );
}

function AbandonIcon() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="var(--warn)"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function CompleteIcon() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="var(--ok)"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}
