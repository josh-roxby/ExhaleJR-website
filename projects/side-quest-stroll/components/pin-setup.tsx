"use client";

import { useState, type FormEvent } from "react";
import dynamic from "next/dynamic";

import {
  Button,
  Eyebrow,
  FieldLabel,
  Tab,
  Tabs,
  TextInput,
} from "@/components/ui";
import { cn } from "@/lib/cn";

import type { LatLng } from "../data/types";
import { parseGoogleMapsUrl, parseLatLng } from "../lib/geo";

// Lazy map for the tap-to-place tab.
const QuestMap = dynamic(() => import("./map"), { ssr: false });

interface PinSetupProps {
  onPinSet: (p: LatLng) => void;
}

type Method = "tap" | "geolocate" | "url" | "coords";

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
        <Tab value="url">Maps URL</Tab>
        <Tab value="coords">Coords</Tab>
      </Tabs>

      <div>
        {method === "geolocate" && (
          <GeolocateMethod onPinSet={onPinSet} setError={setError} />
        )}
        {method === "tap" && <TapMethod onPinSet={onPinSet} />}
        {method === "url" && (
          <UrlMethod onPinSet={onPinSet} setError={setError} />
        )}
        {method === "coords" && (
          <CoordsMethod onPinSet={onPinSet} setError={setError} />
        )}
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
        onPinSet({ lat: pos.coords.latitude, lng: pos.coords.longitude });
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

function UrlMethod({
  onPinSet,
  setError,
}: {
  onPinSet: (p: LatLng) => void;
  setError: (s: string | null) => void;
}) {
  const [value, setValue] = useState("");

  const submit = (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    const parsed = parseGoogleMapsUrl(value);
    if (!parsed) {
      setError(
        "Couldn't read coordinates from that URL. Try a long-form Google Maps link with `@lat,lng` in the path.",
      );
      return;
    }
    onPinSet(parsed);
  };

  return (
    <form onSubmit={submit} className="space-y-3">
      <FieldLabel htmlFor="sqs-url">// PASTE GOOGLE MAPS URL</FieldLabel>
      <TextInput
        id="sqs-url"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="https://www.google.com/maps/place/…"
      />
      <p className="text-xs text-mute">
        Long-form links with the `@lat,lng` segment work. Short links
        (goo.gl, maps.app.goo.gl) need to be expanded first; paste the
        long URL after the redirect.
      </p>
      <div className="flex justify-end">
        <Button type="submit" variant="primary" disabled={!value.trim()}>
          Set start
        </Button>
      </div>
    </form>
  );
}

function CoordsMethod({
  onPinSet,
  setError,
}: {
  onPinSet: (p: LatLng) => void;
  setError: (s: string | null) => void;
}) {
  const [value, setValue] = useState("");

  const submit = (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    const parsed = parseLatLng(value);
    if (!parsed) {
      setError("Format: lat,lng. e.g. 51.5074,-0.1278");
      return;
    }
    onPinSet(parsed);
  };

  return (
    <form onSubmit={submit} className="space-y-3">
      <FieldLabel htmlFor="sqs-coords">// LATITUDE, LONGITUDE</FieldLabel>
      <TextInput
        id="sqs-coords"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="51.5074, -0.1278"
        inputMode="text"
        autoComplete="off"
        spellCheck={false}
      />
      <div className="flex justify-end">
        <Button type="submit" variant="primary" disabled={!value.trim()}>
          Set start
        </Button>
      </div>
    </form>
  );
}

// suppress unused-imports lint for cn (kept available for future tweaks)
void cn;
