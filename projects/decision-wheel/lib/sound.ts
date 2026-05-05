// Wheel sounds. Soft tick during spin, three-tone chord when it lands.

let cachedCtx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!cachedCtx) {
    const Ctor =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    if (!Ctor) return null;
    cachedCtx = new Ctor();
  }
  if (cachedCtx.state === "suspended") cachedCtx.resume();
  return cachedCtx;
}

function tone(
  ctx: AudioContext,
  frequency: number,
  delay: number,
  duration: number,
  volume: number,
  type: OscillatorType = "sine",
): void {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.frequency.value = frequency;
  osc.type = type;
  const start = ctx.currentTime + delay;
  gain.gain.setValueAtTime(volume, start);
  gain.gain.exponentialRampToValueAtTime(0.001, start + duration / 1000);
  osc.start(start);
  osc.stop(start + duration / 1000);
}

/** Soft "tick" while the wheel passes a slice boundary. */
export function tick(): void {
  const ctx = getCtx();
  if (!ctx) return;
  tone(ctx, 1600, 0, 25, 0.06, "square");
}

/** Three-tone chord (C5 / E5 / G5) when the wheel lands. */
export function chime(): void {
  const ctx = getCtx();
  if (!ctx) return;
  tone(ctx, 523, 0, 380, 0.2);
  tone(ctx, 659, 0, 380, 0.16);
  tone(ctx, 784, 0, 380, 0.12);
}
