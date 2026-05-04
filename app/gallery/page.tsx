import { Eyebrow } from "@/components/ui";

export default function GalleryPage() {
  return (
    <main className="relative z-10 mx-auto max-w-2xl px-6 py-16">
      <Eyebrow tone="accent" withPulseDot>// GALLERY · v0.0</Eyebrow>
      <h1 className="mt-2 font-display text-5xl font-black leading-[0.95] tracking-tight">
        Photography &amp; <span className="text-accent">creative work</span>.
      </h1>
      <p className="mt-4 max-w-xl text-ink-2">
        A space for photos, side projects, and visual experiments. Coming soon.
      </p>
    </main>
  );
}
