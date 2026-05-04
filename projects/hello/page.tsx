import { Greeter } from "./components/greeter";

export function Page() {
  return (
    <section className="space-y-4">
      <p className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-mute-2">
        Project · hello
      </p>
      <h1 className="font-display text-3xl font-black tracking-tight">Hello</h1>
      <p className="text-sm text-mute">
        This project lives entirely under <code className="font-mono text-ink-2">/projects/hello</code>.
        Components, lib, hooks, styles, and types are local to this folder.
      </p>
      <Greeter />
    </section>
  );
}
