"use client";

import { Button, Card, Eyebrow, Tag } from "@/components/ui";
import { cn } from "@/lib/cn";

import type { Quest } from "../data/types";
import { formatDistance } from "../lib/geo";

interface QuestCardProps {
  quest: Quest;
  onComplete: () => void;
  onAbandon: () => void;
  onReroll: () => void;
}

export function QuestCard({
  quest,
  onComplete,
  onAbandon,
  onReroll,
}: QuestCardProps) {
  return (
    <Card hover="none" className="space-y-4 p-5">
      <header className="flex flex-wrap items-baseline justify-between gap-3">
        <div>
          <Eyebrow tone="accent" withPulseDot>// SIDE QUEST · ACTIVE</Eyebrow>
          <p className="mt-1 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-mute-2">
            {`STARTED ${formatTime(quest.startedAt)}`}
          </p>
        </div>
        <div className="flex flex-wrap items-baseline gap-1.5">
          <Tag>{quest.mode}</Tag>
          <Tag variant={quest.routed ? "ok" : "warn"}>
            {quest.routed ? "routed" : "as the crow flies"}
          </Tag>
          <Tag variant="accent">{formatDistance(quest.distanceM)}</Tag>
        </div>
      </header>

      <p className="font-display text-3xl font-black leading-tight tracking-tight text-ink sm:text-4xl">
        {quest.text}
      </p>

      {!quest.routed && (
        <p className="text-xs text-mute">
          Couldn&apos;t plan a walking route this time. The line on the map
          is a straight bearing. Choose your own path safely.
        </p>
      )}

      <div className="flex flex-wrap items-center justify-end gap-2 pt-2">
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
      </div>
    </Card>
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
