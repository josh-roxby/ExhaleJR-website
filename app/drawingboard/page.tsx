import Link from "next/link";
import { Card, Eyebrow, Tag } from "@/components/ui";
import { projects } from "@/projects/registry";

export default function DrawingBoardHome() {
  return (
    <main className="space-y-8">
      <header>
        <Eyebrow tone="accent" withPulseDot>// DRAWING BOARD · v0.1</Eyebrow>
        <h1 className="mt-2 font-display text-5xl font-black leading-[0.95] tracking-tight">
          Things in <span className="text-accent">flight.</span>
        </h1>
        <p className="mt-3 max-w-xl text-ink-2">
          Working space for projects, prototypes, and the small tools I'm building. Search and
          filter coming soon — for now, all projects below.
        </p>
      </header>

      <ul className="grid gap-3 sm:grid-cols-2">
        {projects.map((p) => (
          <li key={p.slug}>
            <Card as={Link} href={`/drawingboard/${p.slug}`} hover="lift" className="block">
              <div className="flex items-start justify-between gap-3">
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
          </li>
        ))}
      </ul>
    </main>
  );
}
