"use client";

import type { ReactNode } from "react";

import { Button, Card, Eyebrow, Tag } from "@/components/ui";
import { cn } from "@/lib/cn";

import type { Quest } from "../data/types";
import { formatDistance } from "../lib/geo";
import { formatWalkingTime } from "../lib/walking";

interface ActiveQuestViewProps {
  quest: Quest;
  onComplete: () => void;
  onAbandon: () => void;
  onReroll: () => void;
  /** The map slot. Rendered absolutely behind the overlay panels. */
  map: ReactNode;
}

/**
 * Fullscreen takeover for an active quest. Map fills the viewport, with
 * a top panel showing the prompt + loop info and a bottom action bar
 * (re-roll / abandon / mark done) sitting above the floating nav.
 */
export function ActiveQuestView({
  quest,
  onComplete,
  onAbandon,
  onReroll,
  map,
}: ActiveQuestViewProps) {
  const loopDistanceM =
    quest.distanceM + (quest.returnDistanceM ?? quest.distanceM);

  return (
    <div className="fixed inset-0 z-30 bg-bg">
      <div className="absolute inset-0">{map}</div>

      <div className="pointer-events-none absolute inset-x-0 top-0 px-3 pt-[calc(0.75rem+env(safe-area-inset-top))]">
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

      <div className="pointer-events-none absolute inset-x-0 bottom-[calc(112px+env(safe-area-inset-bottom))] px-3">
        <Card
          hover="none"
          className="pointer-events-auto flex flex-wrap items-center justify-end gap-2 p-3"
        >
          <Button
            variant="ghost"
            onClick={onReroll}
            leadingIcon={<RerollIcon />}
            aria-label="Re-roll quest prompt"
          >
            Re-roll
          </Button>
          <Button variant="ghost" onClick={onAbandon}>
            Abandon
          </Button>
          <Button variant="primary" onClick={onComplete}>
            Mark done
          </Button>
        </Card>
      </div>
    </div>
  );
}

function RerollIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M21 12a9 9 0 1 1-3.5-7.1" />
      <polyline points="21 4 21 10 15 10" />
    </svg>
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
