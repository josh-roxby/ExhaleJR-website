import { Eyebrow } from "@/components/ui";

export const metadata = {
  title: "About",
  description: "About Josh Roxby. Background, interests, why I build, and the addiction to learning.",
};

// Friendly first-person voice, no em-dashes per CLAUDE.md.
// `// COPY:` markers flag the bits drafted as placeholders.

export default function AboutPage() {
  return (
    <main className="relative z-10 mx-auto max-w-3xl px-6 pt-24 pb-16 sm:pt-32">
      <header>
        <Eyebrow tone="accent" withPulseDot>// ABOUT · v0.1</Eyebrow>
        <h1 className="mt-3 font-display text-6xl font-black leading-[0.92] tracking-tight sm:text-7xl">
          Josh <span className="text-accent">Roxby</span>.
        </h1>
        <p className="mt-5 max-w-xl text-lg text-ink-2">
          {/* COPY: hero lead */}
          The longer version of who I am, what I build, and why I keep at it.
        </p>
      </header>

      <AboutSection num="01" title="About me.">
        <p>
          {/* COPY: about me */}
          I&apos;m Josh. I build things across the line between creative and technical
          work. By day that means leading Exhale Studios, a creative practice for
          studios, artists, and teams. By night, this site. A drawing board for ideas
          that are too small to be a studio project but too good to leave alone.
        </p>
      </AboutSection>

      <AboutSection num="02" title="Background.">
        <p>
          {/* COPY: background paragraph 1 */}
          The route here was non-linear. I picked up design first, then code, then
          everything in between. I work in the gaps between disciplines because
          that&apos;s where the interesting problems live.
        </p>
        <p>
          {/* COPY: background paragraph 2 */}
          If I had to name it, I&apos;d say I&apos;m a generalist who specialises by
          accident. The work shapes the tools, and the tools shape the work back.
        </p>
      </AboutSection>

      <AboutSection num="03" title="What I like.">
        <p>
          {/* COPY: interests */}
          Music. Photography. Long mountain walks. Espresso bars in cities I&apos;ve
          never been to. Type. Synth design. The exact moment a frontend animation
          feels right. I keep a wide net so I can pull on whatever the project needs.
        </p>
      </AboutSection>

      <AboutSection num="04" title="Why I build.">
        <p>
          {/* COPY: why I build paragraph 1 */}
          Because the gap between having an idea and shipping a working version of
          it has never been smaller. Tools used to gatekeep. They don&apos;t anymore.
        </p>
        <p>
          {/* COPY: why I build paragraph 2 */}
          If I want a thing to exist, I make it. If it works, I share it. If it
          doesn&apos;t, I learn and try the next angle.
        </p>
      </AboutSection>

      <AboutSection num="05" title="Addicted to learning.">
        <p>
          {/* COPY: learning */}
          There&apos;s a specific kind of joy in the first hour with a new tool. The
          brain firing on all cylinders, the little wins, the &ldquo;oh, that&apos;s
          how that works.&rdquo; I chase that feeling weekly. Most of what&apos;s in
          the drawing board started that way.
        </p>
      </AboutSection>
    </main>
  );
}

function AboutSection({
  num,
  title,
  children,
}: {
  num: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-t border-line py-12">
      <Eyebrow tone="mute" size="sm">{`// ${num}`}</Eyebrow>
      <h2 className="mt-2 font-display text-4xl font-black tracking-tight">{title}</h2>
      <div className="mt-4 max-w-2xl space-y-4 text-ink-2">{children}</div>
    </section>
  );
}
