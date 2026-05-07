"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

import { Button, Eyebrow, Tab, Tabs } from "@/components/ui";
import { cn } from "@/lib/cn";

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
        setError(messageForGeoError(err));
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
      <Diagnostics />
    </div>
  );
}

// Surfaces the four things that decide whether the prompt will appear at
// all on iOS: Permissions API state, secure-context flag, geolocation API
// presence, and PWA display mode. If permission shows `denied` here the
// browser will fire code 1 instantly with no prompt.
function Diagnostics() {
  type Perm = PermissionState | "unsupported" | "checking";
  const [perm, setPerm] = useState<Perm>("checking");
  const [secure, setSecure] = useState<boolean | null>(null);
  const [geoPresent, setGeoPresent] = useState<boolean | null>(null);
  const [pwa, setPwa] = useState<boolean | null>(null);
  const [origin, setOrigin] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") return;
    setSecure(window.isSecureContext);
    setGeoPresent("geolocation" in navigator);
    setPwa(window.matchMedia("(display-mode: standalone)").matches);
    setOrigin(window.location.origin);

    let cancelled = false;
    let status: PermissionStatus | null = null;
    if (navigator.permissions?.query) {
      navigator.permissions
        .query({ name: "geolocation" })
        .then((s) => {
          if (cancelled) return;
          status = s;
          setPerm(s.state);
          s.onchange = () => setPerm(s.state);
        })
        .catch(() => {
          if (!cancelled) setPerm("unsupported");
        });
    } else {
      setPerm("unsupported");
    }

    return () => {
      cancelled = true;
      if (status) status.onchange = null;
    };
  }, []);

  return (
    <div className="w-full rounded-sq-xs border border-line-2 bg-bg-2 p-3 font-mono text-[10px] uppercase tracking-[0.18em]">
      <div className="text-mute-3">// DIAGNOSTICS</div>
      <ul className="mt-2 space-y-1">
        <DiagRow
          label="Permission"
          value={perm}
          tone={
            perm === "granted" || perm === "prompt"
              ? "ok"
              : perm === "denied"
                ? "warn"
                : "mute"
          }
        />
        <DiagRow
          label="Secure"
          value={secure == null ? "…" : secure ? "yes" : "no"}
          tone={secure ? "ok" : secure === false ? "warn" : "mute"}
        />
        <DiagRow
          label="Geo API"
          value={geoPresent == null ? "…" : geoPresent ? "yes" : "no"}
          tone={geoPresent ? "ok" : geoPresent === false ? "warn" : "mute"}
        />
        <DiagRow
          label="Display"
          value={pwa == null ? "…" : pwa ? "PWA" : "browser"}
          tone="mute"
        />
        <DiagRow label="Origin" value={origin || "…"} tone="mute" />
      </ul>
      {perm === "denied" && (
        <p className="mt-2 normal-case tracking-normal text-warn">
          Permission is denied at the browser/OS level. Open Settings →
          Privacy &amp; Security → Location Services → Safari Websites,
          set to While Using or Ask. Then tap Use my location again.
        </p>
      )}
    </div>
  );
}

type DiagTone = "ok" | "warn" | "mute";

function DiagRow({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: DiagTone;
}) {
  const toneClass =
    tone === "ok" ? "text-ok" : tone === "warn" ? "text-warn" : "text-mute-2";
  return (
    <li className="flex items-baseline justify-between gap-3">
      <span className="text-mute-3">{label}</span>
      <span className={cn("truncate", toneClass)}>{value}</span>
    </li>
  );
}

// iOS in particular caches a permission denial and won't re-prompt — the
// error fires instantly with code 1. Map known codes to actionable text
// rather than the raw browser message.
function messageForGeoError(err: GeolocationPositionError): string {
  switch (err.code) {
    case 1:
      return "Location is blocked for this site. Use Tap on map above, or re-enable in your browser settings (iPhone: tap AA in Safari's address bar → Website Settings → Location → Ask. PWA installed to home screen: remove the app, clear Safari's site data, then re-add).";
    case 2:
      return "Couldn't get a position fix. Try outdoors, or use Tap on map above.";
    case 3:
      return "Location took too long. Try again, or use Tap on map above.";
    default:
      return `Couldn't get location. ${err.message}`;
  }
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
