"use client";

// Side Quest Stroll. Drop a pin, pick a radius, get a random target inside
// it, walk there while doing a small game (action + descriptor + item).
//
// State machine in a single page component:
//   - no pin           → <PinSetup>
//   - pin + no quest   → map + radius slider + mode tabs + Begin Quest
//   - active quest     → map (with target + route) + <QuestCard>
// History stays visible under the active surface in all states.

import { useState } from "react";
import dynamic from "next/dynamic";

import { Button, Eyebrow, Slider, Tab, Tabs } from "@/components/ui";
import { useProjectStorage } from "@/hooks/use-project-storage";

import { History } from "./components/history";
import { PinSetup } from "./components/pin-setup";
import { PrivacyModal } from "./components/privacy-modal";
import { LastQuestSummary, QuestCard } from "./components/quest-card";
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
import { distanceM, formatLatLng, randomPointInRadius } from "./lib/geo";
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

    let route: [number, number][] = [
      [data.pin.lat, data.pin.lng],
      [target.lat, target.lng],
    ];
    let routedDistanceM = distanceM(data.pin, target);
    let routed = false;
    try {
      const r = await fetchWalkingRoute(data.pin, target);
      route = r.route;
      routedDistanceM = r.distanceM;
      routed = r.routed;
    } catch {
      // fetchWalkingRoute already falls back internally; this catch is
      // defensive in case of unexpected throws.
    }

    const quest: Quest = {
      id: generateId(),
      startedAt: new Date().toISOString(),
      completedAt: null,
      status: "active",
      origin: { lat: data.pin.lat, lng: data.pin.lng },
      target,
      distanceM: routedDistanceM,
      routed,
      route,
      mode: data.mode,
      action: parts.action,
      item: parts.item,
      descriptor: parts.descriptor,
      text: parts.text,
    };

    setData((prev) => ({ ...prev, activeQuest: quest }));
    setPending(false);
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

  return (
    <main className="mx-auto max-w-3xl space-y-8 pb-12">
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
            target={data.activeQuest?.target ?? null}
            route={data.activeQuest?.route}
            routeDashed={data.activeQuest ? !data.activeQuest.routed : false}
            height={data.activeQuest ? 380 : 320}
          />

          <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-mute-2">
            <span>{`// PIN · ${formatLatLng(data.pin)}`}</span>
            {!data.activeQuest && (
              <button
                type="button"
                onClick={clearPin}
                className="text-mute hover:text-warn"
              >
                Reset pin
              </button>
            )}
          </div>

          {!data.activeQuest && (
            <ReadySection
              radiusKm={data.radiusKm}
              mode={data.mode}
              onRadius={setRadiusKm}
              onMode={setMode}
              onBegin={beginQuest}
              pending={pending}
            />
          )}

          {data.activeQuest && (
            <QuestCard
              quest={data.activeQuest}
              onComplete={() => finishQuest("completed")}
              onAbandon={() => finishQuest("abandoned")}
            />
          )}

          {!data.activeQuest && lastQuest && <LastQuestSummary quest={lastQuest} />}
        </>
      )}

      {hydrated && data.history.length > 0 && (
        <History quests={data.history} />
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
