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
import L from "leaflet";

import "leaflet/dist/leaflet.css";
import "../styles/map.css";

import { cn } from "@/lib/cn";

import type { LatLng } from "../data/types";

interface QuestMapProps {
  pin: LatLng | null;
  /** Selected radius in km. Used to draw the circle and as a default
   *  zoom-to bound when no quest is active. */
  radiusKm: number;
  /** Active quest target; renders a target marker. */
  target?: LatLng | null;
  /** Outbound walking route as [lat, lng] points; renders a polyline. */
  route?: [number, number][];
  /** Whether to use a solid or dashed outbound polyline (dashed =
   *  straight-line fallback). */
  routeDashed?: boolean;
  /** Return-leg walking route. Rendered in a different colour. */
  returnRoute?: [number, number][];
  /** Whether the return-leg polyline should render dashed. */
  returnRouteDashed?: boolean;
  /** Tap handler. When provided, taps anywhere on the map fire this. */
  onTap?: (latLng: LatLng) => void;
  height?: number | string;
  /** When true, drops the inline border + rounded corners so the map can
   *  fill a fullscreen container without visible chrome. */
  chromeless?: boolean;
  /** Live "you are here" position (e.g. from `watchPosition`). */
  liveLocation?: LatLng | null;
  /** Live heading in degrees clockwise from north. Null hides the cone. */
  liveHeading?: number | null;
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

// Hoisted to module scope so the same icon instances are reused across renders.
// Cheaper, and avoids any chance of Leaflet holding stale references to icons
// that React just swapped out underneath it.
const PIN_ICON = divIcon(pinIconHtml, 18);
const TARGET_ICON = divIcon(targetIconHtml, 26);
const TAP_PREVIEW_ICON = divIcon(tapPreviewHtml, 14);

// Live position marker. Optional heading rotates a cone-shaped SVG that
// fans out from the user position in the direction of travel. The icon
// is rebuilt on each heading change but the underlying Leaflet marker is
// reused (react-leaflet swaps the icon, doesn't recreate the marker).
function makeLiveIcon(heading: number | null): L.DivIcon {
  const cone =
    heading != null
      ? `<svg class="sqs-live-cone" width="40" height="40" viewBox="-20 -20 40 40" style="transform: rotate(${heading}deg)" aria-hidden="true"><polygon points="0,0 -12,-22 12,-22" fill="rgba(79,170,255,0.55)" /></svg>`
      : "";
  return L.divIcon({
    html: `${cone}<div class="sqs-live-dot"></div>`,
    className: "sqs-live-marker",
    iconSize: [40, 40],
    iconAnchor: [20, 20],
  });
}

/** Refits the map view whenever the relevant geometry changes. */
function FitTo({
  pin,
  target,
  route,
  returnRoute,
  radiusKm,
}: {
  pin: LatLng | null;
  target?: LatLng | null;
  route?: [number, number][];
  returnRoute?: [number, number][];
  radiusKm: number;
}) {
  const map = useMap();
  useEffect(() => {
    if (!pin) return;
    if (target) {
      const points: [number, number][] = [
        [pin.lat, pin.lng],
        [target.lat, target.lng],
      ];
      if (route) points.push(...route);
      if (returnRoute) points.push(...returnRoute);
      const bounds = L.latLngBounds(points).pad(0.15);
      map.fitBounds(bounds);
      return;
    }
    // Compute bounds for the radius circle by hand. We can't use
    // `L.circle(...).getBounds()` here because that goes through
    // `_map.layerPointToLatLng`, which throws if the circle isn't yet
    // attached to a map. (Was the source of a `layerPointToLatLng`
    // crash on first render after a pin was set.)
    const radiusM = radiusKm * 1000;
    const latDelta = radiusM / 111320;
    const lngDelta =
      radiusM / (111320 * Math.cos((pin.lat * Math.PI) / 180));
    const bounds = L.latLngBounds(
      [pin.lat - latDelta, pin.lng - lngDelta],
      [pin.lat + latDelta, pin.lng + lngDelta],
    );
    map.fitBounds(bounds, { padding: [24, 24] });
  }, [map, pin, target, route, returnRoute, radiusKm]);
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
  returnRoute,
  returnRouteDashed,
  onTap,
  height = 320,
  chromeless = false,
  liveLocation,
  liveHeading,
}: QuestMapProps) {
  const center: [number, number] = pin
    ? [pin.lat, pin.lng]
    : DEFAULT_CENTER;

  return (
    <div
      className={cn(
        "h-full overflow-hidden bg-surface",
        !chromeless && "rounded-sq-md border border-line-2",
      )}
      style={chromeless ? undefined : { height }}
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
          maxZoom={19}
          maxNativeZoom={19}
          keepBuffer={4}
          updateWhenZooming={false}
          updateWhenIdle={true}
        />
        {onTap && <TapHandler onTap={onTap} />}
        <FitTo
          pin={pin}
          target={target}
          route={route}
          returnRoute={returnRoute}
          radiusKm={radiusKm}
        />

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
            <Marker position={[pin.lat, pin.lng]} icon={PIN_ICON} />
          </>
        )}

        {target && (
          <Marker position={[target.lat, target.lng]} icon={TARGET_ICON} />
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

        {returnRoute && returnRoute.length > 1 && (
          <Polyline
            positions={returnRoute}
            pathOptions={{
              color: returnRouteDashed ? "var(--mute)" : "var(--accent)",
              weight: 4,
              opacity: 0.9,
              dashArray: returnRouteDashed ? "6 6" : "2 6",
            }}
          />
        )}

        {!pin && onTap && (
          <Marker
            position={DEFAULT_CENTER}
            icon={TAP_PREVIEW_ICON}
            interactive={false}
            opacity={0.4}
          />
        )}

        {liveLocation && (
          <Marker
            position={[liveLocation.lat, liveLocation.lng]}
            icon={makeLiveIcon(liveHeading ?? null)}
            interactive={false}
            zIndexOffset={1000}
          />
        )}
      </MapContainer>
    </div>
  );
}
