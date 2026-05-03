import Link from "next/link";
import { labProjects } from "@/projects/registry";

export default function LabHome() {
  return (
    <main className="space-y-8">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">Lab</h1>
        <p className="mt-1 text-sm text-muted">
          Isolated experiments. Each project lives in its own folder under /projects.
        </p>
      </header>

      <ul className="grid gap-3 sm:grid-cols-2">
        {labProjects.map((p) => (
          <li key={p.slug}>
            <Link
              href={`/lab/${p.slug}`}
              className="block rounded-lg border border-fg/10 p-4 hover:border-fg/30"
            >
              <div className="font-mono text-xs text-muted">{p.slug}</div>
              <div className="mt-1 font-medium">{p.name}</div>
              <p className="mt-1 text-sm text-muted">{p.description}</p>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
