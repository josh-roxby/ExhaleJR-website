"use client";

import { Card, Eyebrow, Tag } from "@/components/ui";

import type { Quest } from "../data/types";
import { formatDistance } from "../lib/geo";

interface HistoryProps {
  quests: Quest[];
}

export function History({ quests }: HistoryProps) {
  if (quests.length === 0) return null;

  return (
    <section className="space-y-3">
      <Eyebrow tone="mute" size="sm">{`// HISTORY · ${quests.length}`}</Eyebrow>
      <ul className="space-y-2">
        {quests.map((q) => (
          <li key={q.id}>
            <Card hover="none" className="flex items-start justify-between gap-3 p-4">
              <div className="min-w-0 flex-1">
                <p className="truncate font-display text-base font-bold uppercase tracking-tight text-ink">
                  {q.text}
                </p>
                <p className="mt-1 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-mute-2">
                  {`${formatStamp(q.completedAt ?? q.startedAt)} · ${q.mode} · ${formatDistance(q.distanceM)}`}
                </p>
              </div>
              <Tag variant={q.status === "completed" ? "ok" : q.status === "abandoned" ? "warn" : "dev"}>
                {q.status}
              </Tag>
            </Card>
          </li>
        ))}
      </ul>
    </section>
  );
}

function formatStamp(iso: string): string {
  const d = new Date(iso);
  return `${d.toLocaleDateString(undefined, { month: "short", day: "numeric" })} · ${d.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" })}`;
}
