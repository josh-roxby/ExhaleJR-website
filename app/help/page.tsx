import Link from "next/link";
import { Eyebrow } from "@/components/ui";

export const metadata = {
  title: "Help",
  description: "Plain-language guide to the drawing board, GitHub, Claude, Vercel, and the workflow that ties them together.",
};

const sections = [
  { id: "drawing-board", num: "01", title: "Drawing board." },
  { id: "github", num: "02", title: "GitHub." },
  { id: "claude", num: "03", title: "Claude." },
  { id: "vercel", num: "04", title: "Vercel." },
  { id: "workflow", num: "05", title: "Putting it together." },
] as const;

export default function HelpPage() {
  return (
    <main className="relative z-10 mx-auto max-w-3xl px-6 pt-24 pb-16 sm:pt-32">
      <header className="pb-12">
        <Eyebrow tone="accent" withPulseDot>// HELP · v0.1</Eyebrow>
        <h1 className="mt-3 font-display text-6xl font-black leading-[0.92] tracking-tight sm:text-7xl">
          How to use <span className="text-accent">this</span>.
        </h1>
        <p className="mt-5 max-w-xl text-lg text-ink-2">
          A short, plain-language guide to the tools and workflow behind everything
          on this site. Skim the section you need. Click through to the official
          docs when you want more depth.
        </p>
      </header>

      {/* TOC */}
      <nav className="mb-12 rounded-sq-md border border-line bg-surface p-4">
        <Eyebrow tone="mute" size="xs">// CONTENTS</Eyebrow>
        <ol className="mt-3 space-y-1.5 font-mono text-sm">
          {sections.map((s) => (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                className="ds-interactive group inline-flex items-center gap-3 text-ink-2 hover:text-accent"
              >
                <span className="text-accent">{s.num}</span>
                <span className="group-hover:underline">{s.title}</span>
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <DrawingBoardSection />
      <GitHubSection />
      <ClaudeSection />
      <VercelSection />
      <WorkflowSection />
    </main>
  );
}

/* ─────────────── sections ─────────────── */

function DrawingBoardSection() {
  return (
    <Section id="drawing-board" num="01" title="Drawing board.">
      <p>
        The <Link href="/drawingboard">drawing board</Link> is where I keep
        projects, prototypes, and small tools I&apos;m building. Each one is
        rip-able. The small circle in the top-right of any tile or project page
        is the rip button. Tap it to see the Claude prompt I used to build that
        project. Copy the prompt and you can build your own version.
      </p>
      <p>
        The search bar at the top filters by project name. Tag chips below filter
        by topic. That&apos;s the whole surface.
      </p>
      <p className="text-sm text-mute">
        The rest of the site is the about page (who I am), thinking (notes and
        write-ups), found (things I bookmark), and gallery (photos).
      </p>
    </Section>
  );
}

function GitHubSection() {
  return (
    <Section id="github" num="02" title="GitHub.">
      <p>
        GitHub is where code lives on the internet. You need a free account
        before you can ship anything.
      </p>
      <Steps
        steps={[
          <>Sign up at <Ext href="https://github.com">github.com</Ext>.</>,
          <>
            If you&apos;re new to all this, install{" "}
            <Ext href="https://desktop.github.com">GitHub Desktop</Ext>. It&apos;s
            the friendliest way to move code between your computer and the internet.
          </>,
          <>
            When a Claude prompt asks you to clone a repo or push to GitHub,
            GitHub Desktop has buttons for both.
          </>,
        ]}
      />
      <Docs href="https://docs.github.com">docs.github.com</Docs>
    </Section>
  );
}

function ClaudeSection() {
  return (
    <Section id="claude" num="03" title="Claude.">
      <p>
        Claude is the AI assistant that does the building. There are two
        flavours.
      </p>
      <p>
        <strong className="text-ink">Claude (chat)</strong> lives at{" "}
        <Ext href="https://claude.ai">claude.ai</Ext>. You paste a prompt, it
        writes code and explains. Good for quick experiments and one-off
        artifacts.
      </p>
      <p>
        <strong className="text-ink">Claude Code</strong> is a desktop tool that
        works inside a real project folder. It reads your files, runs commands,
        and edits code in place. Good for actually shipping a project.
      </p>
      <p>
        You&apos;ll want a paid subscription if you&apos;re building something
        real. The Pro plan covers casual use. The Max plan has more headroom.
      </p>
      <Docs href="https://docs.anthropic.com">docs.anthropic.com</Docs>
    </Section>
  );
}

function VercelSection() {
  return (
    <Section id="vercel" num="04" title="Vercel.">
      <p>
        Vercel is where your website goes live. They host Next.js sites for
        free for personal projects.
      </p>
      <Steps
        steps={[
          <>
            Sign up at <Ext href="https://vercel.com">vercel.com</Ext> using your
            GitHub account. This links the two automatically.
          </>,
          <>Click <em className="not-italic text-ink">Add new project</em> and pick the repo you created on GitHub.</>,
          <>Vercel auto-detects Next.js. Click <em className="not-italic text-ink">Deploy</em>. Wait about a minute.</>,
          <>Your site has a URL.</>,
        ]}
      />
      <Docs href="https://vercel.com/docs">vercel.com/docs</Docs>
    </Section>
  );
}

function WorkflowSection() {
  return (
    <Section id="workflow" num="05" title="Putting it together.">
      <p>
        Here&apos;s the actual loop I use to ship anything on this site.
      </p>
      <Steps
        steps={[
          <>Create an empty repo on GitHub.</>,
          <>Clone it to your computer with GitHub Desktop.</>,
          <>Open the folder in Claude Code.</>,
          <>
            Pick a project on my <Link href="/drawingboard">drawing board</Link>.
            Tap rip. Copy the prompt.
          </>,
          <>Paste the prompt into Claude Code.</>,
          <>
            Claude Code scaffolds the files. Watch it work, accept or tweak as it
            goes.
          </>,
          <>Push the changes through GitHub Desktop.</>,
          <>Vercel auto-deploys whatever is on your main branch.</>,
          <>Open the URL Vercel gave you. You have a working site.</>,
        ]}
      />
      <p className="text-sm text-mute">
        From there, iterate. Ask Claude Code to add features, change copy, fix
        bugs. Push, deploy, repeat. Every project on the drawing board started
        exactly like this.
      </p>
    </Section>
  );
}

/* ─────────────── primitives ─────────────── */

function Section({
  id,
  num,
  title,
  children,
}: {
  id: string;
  num: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="border-t border-line py-12 scroll-mt-12">
      <Eyebrow tone="mute" size="sm">{`// ${num}`}</Eyebrow>
      <h2 className="mt-2 font-display text-4xl font-black tracking-tight">{title}</h2>
      <div className="mt-4 space-y-4 text-ink-2">{children}</div>
    </section>
  );
}

function Steps({ steps }: { steps: React.ReactNode[] }) {
  return (
    <ol className="space-y-2.5">
      {steps.map((step, i) => (
        <li key={i} className="flex gap-3 text-ink-2">
          <span className="font-mono text-accent">{String(i + 1).padStart(2, "0")}</span>
          <span className="flex-1">{step}</span>
        </li>
      ))}
    </ol>
  );
}

function Ext({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-accent underline underline-offset-4 hover:text-white"
    >
      {children}
    </a>
  );
}

function Docs({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <p className="pt-2 font-mono text-sm">
      <span className="mr-2 text-mute-2">// DOCS</span>
      <Ext href={href}>{children}</Ext>
    </p>
  );
}
