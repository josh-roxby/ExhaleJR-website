import Link from "next/link";

export default function HomePage() {
  return (
    <main className="relative z-10 mx-auto flex min-h-dvh max-w-2xl flex-col justify-center gap-10 px-6 py-16">
      <div className="space-y-3">
        <p className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-mute-2">
          ExhaleJR / Personal site
        </p>
        <h1 className="font-display text-5xl font-black leading-[0.95] tracking-tight">
          Portfolio, thinking,{" "}
          <span className="text-accent">and a lab.</span>
        </h1>
        <p className="max-w-md text-ink-2">
          A working ground for ideas, infra, and small experiments. Style guide active —
          components landing soon.
        </p>
      </div>

      <nav className="flex flex-wrap gap-2 font-mono text-[11px] uppercase tracking-[0.18em]">
        <Link
          href="/about"
          className="rounded-sq border border-line-2 px-3 py-2 text-ink-2 transition hover:border-line-3 hover:text-ink"
        >
          About
        </Link>
        <Link
          href="/thinking"
          className="rounded-sq border border-line-2 px-3 py-2 text-ink-2 transition hover:border-line-3 hover:text-ink"
        >
          Thinking
        </Link>
        <Link
          href="/lab"
          className="rounded-sq border border-accent bg-accent px-3 py-2 font-bold text-accent-on transition hover:shadow-glow"
        >
          Lab →
        </Link>
      </nav>
    </main>
  );
}
