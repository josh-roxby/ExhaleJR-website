import { Eyebrow } from "@/components/ui";

export default function LabHome() {
  return (
    <main className="space-y-6">
      <Eyebrow tone="accent" withPulseDot>// THE LAB · v0.1</Eyebrow>
      <h1 className="font-display text-5xl font-black leading-[0.95] tracking-tight">
        Internal tools<br />that <span className="text-accent">ship.</span>
      </h1>
      <p className="max-w-md text-ink-2">
        An R&amp;D space for production tooling and small experiments. Use the floating nav to move
        around — the menu opens a quick-access bento with every project listed.
      </p>
    </main>
  );
}
