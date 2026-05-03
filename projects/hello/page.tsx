import { Greeter } from "./components/greeter";

export function Page() {
  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold tracking-tight">Hello</h1>
      <p className="text-sm text-muted">
        This project lives entirely under <code className="font-mono">/projects/hello</code>.
        Components, lib, hooks, styles, and types are local to this folder.
      </p>
      <Greeter />
    </section>
  );
}
