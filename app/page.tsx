import Link from "next/link";
import { Card, Eyebrow, Tag } from "@/components/ui";
import { projects } from "@/projects/registry";

// Note for josh: friendly first-person voice, no em-dashes per CLAUDE.md.
// Search for `// COPY:` markers to find the bits drafted as placeholders.

export default function HomePage() {
  return (
    <main className="relative z-10">
      {/* HERO */}
      <section className="mx-auto max-w-3xl px-6 pt-24 pb-16 sm:pt-32">
        <Eyebrow tone="accent" withPulseDot>// EXHALEJR · v0.1</Eyebrow>
        <h1 className="mt-3 font-display text-6xl font-black leading-[0.92] tracking-tight sm:text-7xl">
          Hey, I'm <span className="text-accent">Josh</span>.
        </h1>
        <p className="mt-5 max-w-xl text-lg text-ink-2">
          {/* COPY: hero lead */}
          Welcome to my corner of the internet. A working ground for ideas, small tools,
          and the things I&apos;ve made or stumbled on.
        </p>
      </section>

      {/* ABOUT */}
      <Section id="about" eyebrow="// 01 · JOSH" heading="About me.">
        <p>
          {/* COPY: about paragraph 1 */}
          I&apos;m a creative who builds things. Visual design, software, music, the
          occasional photograph. By day I run{" "}
          <ExternalLink href="https://exhale.studio">Exhale Studios</ExternalLink>,
          a creative practice for studios, artists, and teams.
        </p>
        <p>
          {/* COPY: about paragraph 2 */}
          This site is the personal side of that. A place for the stuff that
          doesn&apos;t fit neatly into the studio brand. Half-finished tools, things
          I&apos;m learning, work I want to share.
        </p>
      </Section>

      {/* THIS APP */}
      <Section id="thisapp" eyebrow="// 02 · THIS APP" heading="What this is.">
        <p>
          {/* COPY: this app intro */}
          A drawing board, an open notebook, and a small library of useful things.
          Everything you see here is open. When I build something on the drawing
          board, the prompt I used lives next to it. You can copy it into Claude and
          rip your own version in an afternoon.
        </p>
        <ul className="mt-4 space-y-2 font-mono text-sm text-ink-2">
          <li><span className="text-accent">/</span> drawing board. Projects in flight.</li>
          <li><span className="text-accent">/</span> rip. Every project ships with a Claude prompt you can copy.</li>
          <li><span className="text-accent">/</span> thoughts, found, creative. The rest of what I share.</li>
        </ul>
      </Section>

      {/* DRAWING BOARD PREVIEW */}
      <section id="drawingboard-preview" className="mx-auto max-w-3xl px-6 pb-16 pt-8 scroll-mt-12">
        <div className="flex items-baseline justify-between gap-4">
          <Eyebrow tone="mute" size="sm">// 03 · DRAWING BOARD</Eyebrow>
          <Link
            href="/drawingboard"
            className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-mute hover:text-accent"
          >
            All projects →
          </Link>
        </div>
        <h2 className="mt-2 font-display text-4xl font-black tracking-tight">In flight.</h2>
        <p className="mt-3 max-w-xl text-ink-2">
          Active projects, half-built tools, ideas I&apos;m chewing on. Each one is
          rip-able.
        </p>
        <ul className="mt-6 grid gap-3 sm:grid-cols-2">
          {projects.slice(0, 4).map((p) => (
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
              </Card>
            </li>
          ))}
        </ul>
      </section>

      {/* EXHALE */}
      <Section id="exhale" eyebrow="// 04 · EXHALE" heading="The studio.">
        <p>
          {/* COPY: exhale paragraph */}
          For studio work (shoots, brand projects, commercial photography), head to{" "}
          <ExternalLink href="https://exhale.studio">exhale.studio</ExternalLink>.
          ExhaleJR is the sibling brand. Same sensibilities, more personal.
        </p>
      </Section>

      {/* OTHER SURFACES */}
      <section className="mx-auto max-w-3xl px-6 pb-24 pt-8">
        <Eyebrow tone="mute" size="sm">// 05 · ELSEWHERE</Eyebrow>
        <h2 className="mt-2 font-display text-4xl font-black tracking-tight">More to come.</h2>
        <p className="mt-3 max-w-xl text-ink-2">
          {/* COPY: elsewhere blurb */}
          A few more rooms still being painted.
        </p>
        <ul className="mt-6 grid gap-3 sm:grid-cols-3">
          <PlaceholderTile name="Thoughts" caption="Notes, write-ups, half-formed ideas." />
          <PlaceholderTile name="Found" caption="Things I bookmark. Links and references." />
          <PlaceholderTile name="Creative" caption="Photography, side work, experiments." />
        </ul>
      </section>
    </main>
  );
}

/* Helpers, kept inline. Only used here. */

function Section({
  id,
  eyebrow,
  heading,
  children,
}: {
  id: string;
  eyebrow: string;
  heading: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className="mx-auto max-w-3xl scroll-mt-12 border-t border-line px-6 pb-16 pt-12"
    >
      <Eyebrow tone="mute" size="sm">{eyebrow}</Eyebrow>
      <h2 className="mt-2 font-display text-4xl font-black tracking-tight">{heading}</h2>
      <div className="mt-4 space-y-4 text-ink-2 [&_a]:text-accent [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-white">
        {children}
      </div>
    </section>
  );
}

function ExternalLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noreferrer noopener">
      {children}
    </a>
  );
}

function PlaceholderTile({ name, caption }: { name: string; caption: string }) {
  return (
    <li>
      <div className="rounded-sq-md border border-dashed border-line-2 bg-surface/40 p-4">
        <div className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-mute-3">
          // SOON
        </div>
        <div className="mt-1 font-display text-xl font-bold uppercase tracking-wide text-ink-2">
          {name}
        </div>
        <p className="mt-1 text-sm text-mute">{caption}</p>
      </div>
    </li>
  );
}
