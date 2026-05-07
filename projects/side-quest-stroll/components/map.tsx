"use client";

// Leaflet wrapper. Imported via next/dynamic with ssr: false from the page
// so we never run window-touching code during SSR. CARTO Dark Matter
// tiles are used for a dark-mode-friendly basemap.
//
// `interactive` toggles the input handlers — when false (preview mode),
// the user can still drag/zoom but tap-to-place isn't wired. When true
// during pin setup with `onTap`, taps are reported.

import { useEffect } from "react";
import {
  Circle,
  MapContainer,
  Marker,
  Polyline,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";
import L, { type LatLngBoundsExpression } from "leaflet";

import "leaflet/dist/leaflet.css";

import type { LatLng } from "../data/types";

interface QuestMapProps {
  pin: LatLng | null;
  /** Selected radius in km. Used to draw the circle and as a default
   *  zoom-to bound when no quest is active. */
  radiusKm: number;
  /** Active quest target; renders a target marker. */
  target?: LatLng | null;
  /** Walking route as [lat, lng] points; renders a polyline. */
  route?: [number, number][];
  /** Whether to use a solid or dashed polyline (dashed = straight-line fallback). */
  routeDashed?: boolean;
  /** Tap handler. When provided, taps anywhere on the map fire this. */
  onTap?: (latLng: LatLng) => void;
  height?: number | string;
}

const DEFAULT_CENTER: [number, number] = [51.5074, -0.1278]; // London. Used as fallback.

const pinIconHtml = `<div style="
  width: 18px; height: 18px;
  background: var(--accent);
  border: 2px solid var(--ink);
  border-radius: 50%;
  box-shadow: 0 0 14px var(--accent-glow), 0 2px 6px rgba(0,0,0,.6);
"></div>`;

const targetIconHtml = `<div style="
  display: grid; place-items: center;
  width: 26px; height: 26px;
  background: var(--bg);
  border: 2px solid var(--ok);
  border-radius: 50%;
  box-shadow: 0 0 14px rgba(74,222,128,.5), 0 2px 6px rgba(0,0,0,.6);
  color: var(--ok);
  font-family: var(--f-display); font-weight: 900; font-size: 14px;
">★</div>`;

const tapPreviewHtml = `<div style="
  width: 14px; height: 14px;
  background: var(--accent-dim);
  border: 2px solid var(--ink);
  border-radius: 50%;
  opacity: .9;
"></div>`;

function divIcon(html: string, size = 18): L.DivIcon {
  return L.divIcon({
    html,
    className: "side-quest-pin",
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

/** Refits the map view whenever the relevant geometry changes. */
function FitTo({
  pin,
  target,
  radiusKm,
}: {
  pin: LatLng | null;
  target?: LatLng | null;
  radiusKm: number;
}) {
  const map = useMap();
  useEffect(() => {
    if (!pin) return;
    if (target) {
      const bounds = L.latLngBounds([
        [pin.lat, pin.lng],
        [target.lat, target.lng],
      ]).pad(0.3);
      map.fitBounds(bounds);
      return;
    }
    const circle = L.circle([pin.lat, pin.lng], { radius: radiusKm * 1000 });
    map.fitBounds(circle.getBounds() as LatLngBoundsExpression, {
      padding: [24, 24],
    });
  }, [map, pin, target, radiusKm]);
  return null;
}

function TapHandler({ onTap }: { onTap?: (p: LatLng) => void }) {
  useMapEvents({
    click(e) {
      if (onTap) onTap({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });
  return null;
}

export default function QuestMap({
  pin,
  radiusKm,
  target,
  route,
  routeDashed,
  onTap,
  height = 320,
}: QuestMapProps) {
  const center: [number, number] = pin
    ? [pin.lat, pin.lng]
    : DEFAULT_CENTER;

  return (
    <div
      className="overflow-hidden rounded-sq-md border border-line-2 bg-surface"
      style={{ height }}
    >
      <MapContainer
        center={center}
        zoom={pin ? 14 : 4}
        scrollWheelZoom
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          subdomains={["a", "b", "c", "d"]}
        />
        {onTap && <TapHandler onTap={onTap} />}
        <FitTo pin={pin} target={target} radiusKm={radiusKm} />

        {pin && (
          <>
            <Circle
              center={[pin.lat, pin.lng]}
              radius={radiusKm * 1000}
              pathOptions={{
                color: "var(--accent)",
                fillColor: "var(--accent)",
                fillOpacity: 0.06,
                weight: 1,
                dashArray: "6 4",
              }}
            />
            <Marker
              position={[pin.lat, pin.lng]}
              icon={divIcon(pinIconHtml, 18)}
            />
          </>
        )}

        {target && (
          <Marker
            position={[target.lat, target.lng]}
            icon={divIcon(targetIconHtml, 26)}
          />
        )}

        {route && route.length > 1 && (
          <Polyline
            positions={route}
            pathOptions={{
              color: routeDashed ? "var(--mute)" : "var(--ok)",
              weight: 4,
              opacity: 0.9,
              dashArray: routeDashed ? "6 6" : undefined,
            }}
          />
        )}

        {!pin && onTap && (
          <Marker
            position={DEFAULT_CENTER}
            icon={divIcon(tapPreviewHtml, 14)}
            interactive={false}
            opacity={0.4}
          />
        )}
      </MapContainer>
    </div>
  );
}
