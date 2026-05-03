import Link from "next/link";

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-2xl flex-col justify-center gap-8 px-6 py-16">
      <header className="space-y-2">
        <p className="text-sm text-muted">ExhaleJR</p>
        <h1 className="text-4xl font-semibold tracking-tight">Portfolio coming soon.</h1>
        <p className="text-muted">
          A working ground for ideas, infra, and small experiments. Style guide pending.
        </p>
      </header>

      <nav className="flex flex-wrap gap-3 text-sm">
        <Link className="underline underline-offset-4" href="/about">
          About
        </Link>
        <Link className="underline underline-offset-4" href="/thinking">
          Thinking
        </Link>
        <Link className="underline underline-offset-4" href="/lab">
          Lab →
        </Link>
      </nav>
    </main>
  );
}
