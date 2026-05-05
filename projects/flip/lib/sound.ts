// Tiny Web Audio helper. Plays a short two-tone "tink" when the coin lands.
// Browsers require a user gesture before audio plays; the cooking flow's
// pattern works here too because the first call is from a tap on Flip.

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

function playTone(
  ctx: AudioContext,
  frequency: number,
  delay: number,
  duration: number,
  volume: number,
) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.frequency.value = frequency;
  osc.type = "sine";
  const start = ctx.currentTime + delay;
  gain.gain.setValueAtTime(volume, start);
  gain.gain.exponentialRampToValueAtTime(0.001, start + duration / 1000);
  osc.start(start);
  osc.stop(start + duration / 1000);
}

export function tink() {
  const ctx = getCtx();
  if (!ctx) return;
  playTone(ctx, 2200, 0, 80, 0.22);
  playTone(ctx, 1800, 0.04, 110, 0.18);
}
