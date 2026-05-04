import Link from "next/link";
import { labProjects } from "@/projects/registry";

export default function LabHome() {
  return (
    <main className="space-y-8">
      <header>
        <p className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-mute-2">
          Lab · all pages
        </p>
        <h1 className="mt-2 font-display text-3xl font-black tracking-tight">Experiments</h1>
        <p className="mt-2 text-sm text-mute">
          Isolated projects. Each lives in its own folder under /projects.
        </p>
      </header>

      <ul className="grid gap-3 sm:grid-cols-2">
        {labProjects.map((p) => (
          <li key={p.slug}>
            <Link
              href={`/lab/${p.slug}`}
              className="block rounded-sq-md border border-line bg-surface p-4 transition hover:border-line-2 hover:bg-surface-2"
            >
              <div className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-mute-2">
                {p.slug}
              </div>
              <div className="mt-1 font-display text-base font-bold uppercase tracking-wide text-ink">
                {p.name}
              </div>
              <p className="mt-1 text-sm text-mute">{p.description}</p>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
