import { Card, CopyButton, Eyebrow } from "@/components/ui";

export const metadata = {
  title: "Contact",
  description: "Get in touch with Josh Roxby. Instagram and email.",
};

const EMAIL = "josh@exhale.studio";
const INSTAGRAM_HANDLE = "@josh_roxby";
const INSTAGRAM_URL = "https://instagram.com/josh_roxby";

export default function ContactPage() {
  return (
    <main className="relative z-10 mx-auto max-w-3xl px-6 pt-24 pb-16 sm:pt-32">
      <header className="pb-12">
        <Eyebrow tone="accent" withPulseDot>// CONTACT · v0.1</Eyebrow>
        <h1 className="mt-3 font-display text-6xl font-black leading-[0.92] tracking-tight sm:text-7xl">
          Get in <span className="text-accent">touch</span>.
        </h1>
        <p className="mt-5 max-w-xl text-lg text-ink-2">
          Two ways to reach me. Both land in front of my eyes.
        </p>
      </header>

      <ul className="space-y-3">
        <li>
          <Card
            as="a"
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            hover="lift"
            className="block"
          >
            <Eyebrow tone="mute" size="xs">// 01 · INSTAGRAM</Eyebrow>
            <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
              <h2 className="font-display text-3xl font-black tracking-tight text-ink break-all">
                {INSTAGRAM_HANDLE}
              </h2>
              <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-mute">
                Open IG →
              </span>
            </div>
          </Card>
        </li>

        <li className="relative">
          <Card as="a" href={`mailto:${EMAIL}`} hover="lift" className="block">
            <Eyebrow tone="mute" size="xs">// 02 · EMAIL</Eyebrow>
            <div className="mt-2 flex flex-wrap items-center justify-between gap-3 pr-24">
              <h2 className="font-display text-2xl font-black tracking-tight text-ink break-all sm:text-3xl">
                {EMAIL}
              </h2>
              <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-mute">
                Open mail →
              </span>
            </div>
          </Card>
          <CopyButton text={EMAIL} className="absolute right-4 top-4 z-10" />
        </li>
      </ul>

      <p className="mt-8 max-w-xl text-sm text-mute">
        Studio enquiries are better at{" "}
        <a
          href="https://exhale.studio"
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent underline underline-offset-4 hover:text-white"
        >
          exhale.studio
        </a>
        . This inbox is for personal stuff, drawing-board projects, and friendly hellos.
      </p>
    </main>
  );
}
