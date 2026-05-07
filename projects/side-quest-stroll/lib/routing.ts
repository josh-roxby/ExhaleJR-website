/**
 * Walking-route helpers. Uses the public OSRM demo server. If the call
 * fails (network, rate limit, no route found), falls back to a straight
 * great-circle line and flags `routed: false` so the UI can hint at it.
 *
 * OSRM endpoint:
 *   /route/v1/foot/{lng1},{lat1};{lng2},{lat2}?overview=full&geometries=geojson
 *
 * Heads up: the public demo at router.project-osrm.org is rate-limited and
 * intended for development. For real scale, switch to Mapbox Directions
 * (paid / API key) — see TODO.
 */

import type { LatLng } from "../data/types";
import { distanceM as greatCircleDistanceM } from "./geo";

const OSRM_BASE = "https://router.project-osrm.org/route/v1/foot";

interface RouteResult {
  /** Path as a flat array of [lat, lng] points. */
  route: [number, number][];
  /** Distance in metres along the route. */
  distanceM: number;
  /** True if the route came from the router; false if we fell back. */
  routed: boolean;
}

interface OsrmResponse {
  code: string;
  routes?: Array<{
    distance: number;
    geometry?: {
      coordinates?: [number, number][];
    };
  }>;
}

export async function fetchWalkingRoute(
  origin: LatLng,
  target: LatLng,
  signal?: AbortSignal,
): Promise<RouteResult> {
  const url = `${OSRM_BASE}/${origin.lng},${origin.lat};${target.lng},${target.lat}?overview=full&geometries=geojson`;

  try {
    const res = await fetch(url, {
      signal,
      headers: { Accept: "application/json" },
    });
    if (!res.ok) throw new Error(`OSRM ${res.status}`);
    const json = (await res.json()) as OsrmResponse;
    if (json.code !== "Ok" || !json.routes || json.routes.length === 0) {
      throw new Error(`OSRM code=${json.code}`);
    }
    const route = json.routes[0];
    const coords = route.geometry?.coordinates ?? [];
    if (coords.length === 0) throw new Error("OSRM empty geometry");
    return {
      // OSRM returns [lng, lat]; convert to [lat, lng] for Leaflet.
      route: coords.map(([lng, lat]) => [lat, lng] as [number, number]),
      distanceM: route.distance,
      routed: true,
    };
  } catch {
    return straightLineFallback(origin, target);
  }
}

function straightLineFallback(origin: LatLng, target: LatLng): RouteResult {
  return {
    route: [
      [origin.lat, origin.lng],
      [target.lat, target.lng],
    ],
    distanceM: greatCircleDistanceM(origin, target),
    routed: false,
  };
}
