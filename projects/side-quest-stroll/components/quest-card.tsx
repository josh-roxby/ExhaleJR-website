"use client";

import type { ReactNode } from "react";

import { Card, Eyebrow, Tag } from "@/components/ui";
import { cn } from "@/lib/cn";

import type { Quest } from "../data/types";
import { formatDistance } from "../lib/geo";
import { formatWalkingTime } from "../lib/walking";

interface ActiveQuestViewProps {
  quest: Quest;
  /** The map slot. Rendered absolutely behind the overlay panel. */
  map: ReactNode;
}

/**
 * Fullscreen takeover for an active quest. Map fills the viewport with a
 * top panel showing the prompt + loop info. Re-roll / abandon / complete
 * live in the floating nav.
 */
export function ActiveQuestView({ quest, map }: ActiveQuestViewProps) {
  const loopDistanceM =
    quest.distanceM + (quest.returnDistanceM ?? quest.distanceM);

  return (
    <div className="fixed inset-0 z-30 bg-bg">
      <div className="absolute inset-0">{map}</div>

      {/* z-[1000] clears Leaflet's pane stack (markers/popups peak ~z700). */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-[1000] px-3 pt-[calc(0.75rem+env(safe-area-inset-top))]">
        <Card hover="none" className="pointer-events-auto space-y-3 p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <Eyebrow tone="accent" withPulseDot>// SIDE QUEST · ACTIVE</Eyebrow>
            <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-mute-2">
              {`STARTED ${formatTime(quest.startedAt)}`}
            </span>
          </div>

          <p className="font-display text-2xl font-black leading-tight tracking-tight text-ink sm:text-3xl">
            {quest.text}
          </p>

          <div className="flex flex-wrap items-center gap-1.5">
            <Tag>{quest.mode}</Tag>
            <Tag variant={quest.routed ? "ok" : "warn"}>
              {quest.routed ? "routed" : "as the crow flies"}
            </Tag>
            <Tag variant="accent">
              {`${formatDistance(loopDistanceM)} loop · ~${formatWalkingTime(loopDistanceM)}`}
            </Tag>
          </div>

          {!quest.routed && (
            <p className="text-xs text-mute">
              Couldn&apos;t plan a walking route. The line on the map is a
              straight bearing. Choose your own path safely.
            </p>
          )}
        </Card>
      </div>
    </div>
  );
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });
}

/** Read-only summary of the most recently finished quest. */
export function LastQuestSummary({ quest }: { quest: Quest }) {
  const isDone = quest.status === "completed";
  return (
    <Card hover="none" className="space-y-3 p-5">
      <Eyebrow
        tone="mute"
        size="sm"
        className={cn(isDone ? "text-ok" : "text-warn")}
      >
        {isDone ? "// LAST QUEST · COMPLETED" : "// LAST QUEST · ABANDONED"}
      </Eyebrow>
      <p className="font-display text-xl font-bold uppercase tracking-tight text-ink">
        {quest.text}
      </p>
      <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-mute-2">
        {`${quest.mode} · ${formatDistance(quest.distanceM)} · ${formatDate(quest.completedAt ?? quest.startedAt)}`}
      </p>
    </Card>
  );
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return `${d.toLocaleDateString(undefined, { month: "short", day: "numeric" })} · ${d.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" })}`;
}
