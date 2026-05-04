"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  Card,
  Chip,
  Eyebrow,
  IconButton,
  RipButton,
  Tag,
  TextInput,
} from "@/components/ui";
import type { ProjectSummary } from "@/projects/registry";

interface DrawingBoardClientProps {
  projects: ProjectSummary[];
  ripContents: Record<string, string | null>;
}

export function DrawingBoardClient({ projects, ripContents }: DrawingBoardClientProps) {
  const [query, setQuery] = useState("");
  const [activeTags, setActiveTags] = useState<string[]>([]);

  const allTags = useMemo(() => {
    const set = new Set<string>();
    for (const p of projects) for (const t of p.tags) set.add(t);
    return [...set].sort((a, b) => a.localeCompare(b));
  }, [projects]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return projects.filter((p) => {
      const matchesQuery =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.slug.toLowerCase().includes(q);
      const matchesTags =
        activeTags.length === 0 || activeTags.some((t) => p.tags.includes(t));
      return matchesQuery && matchesTags;
    });
  }, [projects, query, activeTags]);

  const toggleTag = (tag: string) => {
    setActiveTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  };

  const clearAll = () => {
    setQuery("");
    setActiveTags([]);
  };

  const hasFilters = query.trim() !== "" || activeTags.length > 0;

  return (
    <main className="space-y-8">
      <header>
        <Eyebrow tone="accent" withPulseDot>// DRAWING BOARD · v0.1</Eyebrow>
        <h1 className="mt-2 font-display text-5xl font-black leading-[0.95] tracking-tight">
          Things in <span className="text-accent">flight.</span>
        </h1>
        <p className="mt-3 max-w-xl text-ink-2">
          Working space for projects, prototypes, and the small tools I'm building. Search by
          name, filter by tag, or rip the prompt to scaffold your own.
        </p>
      </header>

      <div className="space-y-4">
        <TextInput
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search projects…"
          aria-label="Search projects"
          leadingIcon={
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
          }
          trailingElement={
            query ? (
              <IconButton
                aria-label="Clear search"
                round
                onClick={() => setQuery("")}
                className="!h-7 !w-7 border-line-2 bg-transparent"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="6" y1="6" x2="18" y2="18" />
                  <line x1="6" y1="18" x2="18" y2="6" />
                </svg>
              </IconButton>
            ) : null
          }
        />

        {allTags.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Eyebrow tone="mute" size="xs">
                {`// FILTER${activeTags.length ? ` · ${activeTags.length} active` : ""}`}
              </Eyebrow>
              {hasFilters && (
                <button
                  type="button"
                  onClick={clearAll}
                  className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-mute hover:text-accent"
                >
                  Clear
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {allTags.map((tag) => (
                <Chip
                  key={tag}
                  as="button"
                  variant={activeTags.includes(tag) ? "accent" : "default"}
                  onClick={() => toggleTag(tag)}
                  aria-pressed={activeTags.includes(tag)}
                >
                  {tag}
                </Chip>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="space-y-3">
        {hasFilters && (
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-mute-2">
            {filtered.length === 0
              ? "// NO MATCHES"
              : `// SHOWING ${filtered.length} OF ${projects.length}`}
          </p>
        )}

        {filtered.length === 0 ? (
          <EmptyState onClear={clearAll} />
        ) : (
          <ul className="grid gap-3 sm:grid-cols-2">
            {filtered.map((p) => (
              <li key={p.slug} className="relative">
                <Card as={Link} href={`/drawingboard/${p.slug}`} hover="lift" className="block">
                  <div className="flex items-start justify-between gap-3 pr-9">
                    <div className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-mute-2">
                      {p.slug}
                    </div>
                    {p.wip && <Tag variant="dev">WIP</Tag>}
                  </div>
                  <div className="mt-1 font-display text-2xl font-bold uppercase tracking-tight text-ink">
                    {p.name}
                  </div>
                  <p className="text-sm text-mute">{p.description}</p>
                  {p.tags.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {p.tags.map((t) => (
                        <Tag key={t}>{t}</Tag>
                      ))}
                    </div>
                  )}
                </Card>
                <div className="absolute right-3 top-3 z-10">
                  <RipButton
                    size="sm"
                    projectName={p.name}
                    projectSlug={p.slug}
                    promptContent={ripContents[p.slug] ?? null}
                  />
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}

function EmptyState({ onClear }: { onClear: () => void }) {
  return (
    <div className="rounded-sq-md border border-dashed border-line-2 bg-surface/40 p-8 text-center">
      <Eyebrow tone="mute" size="xs">// EMPTY</Eyebrow>
      <p className="mt-2 text-sm text-mute">No projects match those filters.</p>
      <button
        type="button"
        onClick={onClear}
        className="mt-3 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-accent hover:text-white"
      >
        Clear all →
      </button>
    </div>
  );
}
