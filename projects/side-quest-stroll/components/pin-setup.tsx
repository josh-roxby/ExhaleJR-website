"use client";

import { useState } from "react";
import dynamic from "next/dynamic";

import { Button, Eyebrow, Tab, Tabs } from "@/components/ui";

import type { LatLng } from "../data/types";

// Lazy map for the tap-to-place tab.
const QuestMap = dynamic(() => import("./map"), { ssr: false });

interface PinSetupProps {
  onPinSet: (p: LatLng) => void;
}

type Method = "tap" | "geolocate";

export function PinSetup({ onPinSet }: PinSetupProps) {
  const [method, setMethod] = useState<Method>("geolocate");
  const [error, setError] = useState<string | null>(null);

  return (
    <section className="space-y-5 rounded-sq-md border border-line-2 bg-surface p-5">
      <header>
        <Eyebrow tone="accent" withPulseDot>// SET QUEST START</Eyebrow>
        <h2 className="mt-2 font-display text-2xl font-black tracking-tight text-ink">
          Where do you start?
        </h2>
        <p className="mt-2 text-sm text-mute">
          Pick a method. The pin sticks on this device only and is never sent
          anywhere.
        </p>
      </header>

      <Tabs
        value={method}
        onChange={(v) => {
          setError(null);
          setMethod(v as Method);
        }}
        variant="pill"
      >
        <Tab value="geolocate">My location</Tab>
        <Tab value="tap">Tap on map</Tab>
      </Tabs>

      <div>
        {method === "geolocate" && (
          <GeolocateMethod onPinSet={onPinSet} setError={setError} />
        )}
        {method === "tap" && <TapMethod onPinSet={onPinSet} />}
      </div>

      {error && (
        <p className="text-sm text-warn">{error}</p>
      )}
    </section>
  );
}

function GeolocateMethod({
  onPinSet,
  setError,
}: {
  onPinSet: (p: LatLng) => void;
  setError: (s: string | null) => void;
}) {
  const [pending, setPending] = useState(false);

  const request = () => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setError("Browser doesn't support geolocation.");
      return;
    }
    setPending(true);
    setError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPending(false);
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        // Guard against NaN / Infinity readings before they ever hit the
        // map. iOS very occasionally hands back non-finite values.
        if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
          setError("Got an invalid location reading. Try again.");
          return;
        }
        // Defer the pin-set by one animation frame so iOS finishes
        // dismissing the permission UI before we tear down this component
        // and mount the map. Helps avoid a watchdog kill on memory-tight
        // PWAs.
        requestAnimationFrame(() => {
          onPinSet({ lat, lng });
        });
      },
      (err) => {
        setPending(false);
        setError(`Couldn't get location. ${err.message}`);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 60_000 },
    );
  };

  return (
    <div className="flex flex-col items-start gap-3">
      <p className="text-sm text-ink-2">
        Browser will ask for permission. Coordinates stay on this device.
      </p>
      <Button onClick={request} variant="primary" disabled={pending}>
        {pending ? "Getting location…" : "Use my location"}
      </Button>
    </div>
  );
}

function TapMethod({ onPinSet }: { onPinSet: (p: LatLng) => void }) {
  const [picked, setPicked] = useState<LatLng | null>(null);

  return (
    <div className="space-y-3">
      <p className="text-sm text-ink-2">
        Drag the map and tap to drop the start pin.
      </p>
      <QuestMap
        pin={picked}
        radiusKm={2}
        onTap={(p) => setPicked(p)}
        height={300}
      />
      <div className="flex items-center justify-between gap-3">
        <span className="font-mono text-xs text-mute-2">
          {picked
            ? `${picked.lat.toFixed(4)}, ${picked.lng.toFixed(4)}`
            : "Tap anywhere on the map"}
        </span>
        <Button
          variant="primary"
          onClick={() => picked && onPinSet(picked)}
          disabled={!picked}
        >
          Set start
        </Button>
      </div>
    </div>
  );
}
