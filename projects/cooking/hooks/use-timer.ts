"use client";

import { useEffect, useRef, useState } from "react";

export type TimerState = "idle" | "running" | "paused" | "done";

export interface UseTimerResult {
  seconds: number;
  state: TimerState;
  start: () => void;
  pause: () => void;
  reset: () => void;
}

/**
 * Countdown timer.
 *
 * `initialSeconds` resets the timer when it changes (e.g., on step navigation).
 * `onDone` fires once when the timer reaches zero.
 */
export function useTimer(
  initialSeconds: number,
  onDone?: () => void,
): UseTimerResult {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [state, setState] = useState<TimerState>("idle");
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  // Reset whenever the input duration changes.
  useEffect(() => {
    setSeconds(initialSeconds);
    setState("idle");
  }, [initialSeconds]);

  // Tick every second while running.
  useEffect(() => {
    if (state !== "running") return;

    const id = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(id);
          setState("done");
          onDoneRef.current?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(id);
  }, [state]);

  return {
    seconds,
    state,
    start: () => setState("running"),
    pause: () => setState("paused"),
    reset: () => {
      setState("idle");
      setSeconds(initialSeconds);
    },
  };
}

export function formatDuration(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}
