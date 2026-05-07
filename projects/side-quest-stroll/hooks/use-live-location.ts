"use client";

import { useEffect, useState } from "react";

import type { LatLng } from "../data/types";

interface LiveState {
  position: LatLng | null;
  /** Degrees clockwise from true north. Null when the device can't or
   *  won't compute it (common at walking pace on iOS Safari). */
  heading: number | null;
  /** Accuracy radius in metres, if reported. */
  accuracyM: number | null;
  error: string | null;
}

const initialState: LiveState = {
  position: null,
  heading: null,
  accuracyM: null,
  error: null,
};

/**
 * Watches device location while `active`. Returns the latest fix +
 * heading + accuracy, plus an error string if the watch fails.
 *
 * Heading comes from `coords.heading` (direction of travel). It's
 * frequently null at walking pace — consumers should hide the heading
 * indicator in that case rather than guess.
 */
export function useLiveLocation(active: boolean): LiveState {
  const [state, setState] = useState<LiveState>(initialState);

  useEffect(() => {
    if (!active) {
      setState(initialState);
      return;
    }
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setState({
        ...initialState,
        error: "Browser doesn't support geolocation.",
      });
      return;
    }

    const id = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude, heading, accuracy } = pos.coords;
        if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return;
        setState({
          position: { lat: latitude, lng: longitude },
          heading:
            heading != null && Number.isFinite(heading) && heading >= 0
              ? heading
              : null,
          accuracyM: accuracy ?? null,
          error: null,
        });
      },
      (err) => {
        setState((s) => ({ ...s, error: err.message }));
      },
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 30000 },
    );

    return () => navigator.geolocation.clearWatch(id);
  }, [active]);

  return state;
}
