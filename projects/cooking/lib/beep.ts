// Tiny audio helper. Web Audio API beeps, no asset to manage.
// Browsers require a user gesture before audio plays; the cooking flow always
// starts via a tap on the Cook button, which counts.

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
  if (cachedCtx.state === "suspended") {
    cachedCtx.resume();
  }
  return cachedCtx;
}

interface BeepOptions {
  frequency?: number;
  duration?: number;
  volume?: number;
}

export function beep({
  frequency = 880,
  duration = 200,
  volume = 0.3,
}: BeepOptions = {}) {
  const ctx = getCtx();
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.frequency.value = frequency;
  osc.type = "sine";
  const now = ctx.currentTime;
  gain.gain.setValueAtTime(volume, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + duration / 1000);
  osc.start(now);
  osc.stop(now + duration / 1000);
}

/** Three rising tones. Used when a step timer hits zero. */
export function alarmDing() {
  beep({ frequency: 880, duration: 180 });
  setTimeout(() => beep({ frequency: 1100, duration: 180 }), 220);
  setTimeout(() => beep({ frequency: 1320, duration: 280 }), 440);
}
