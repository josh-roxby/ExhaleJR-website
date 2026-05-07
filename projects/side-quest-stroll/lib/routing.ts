/**
 * Walking-route helpers. Uses the public OSRM demo server. If the call
 * fails (network, rate limit, no route found), falls back to a straight
 * polyline through the supplied waypoints and flags `routed: false` so
 * the UI can hint at it.
 *
 * OSRM endpoint:
 *   /route/v1/foot/{lng,lat};{lng,lat};...?overview=full&geometries=geojson
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

/**
 * Plan a walking route through the supplied waypoints in order. At least
 * two waypoints are required (origin + target). Extra waypoints between
 * them act as via-points that the router will pass through.
 */
export async function fetchWalkingRoute(
  waypoints: LatLng[],
  signal?: AbortSignal,
): Promise<RouteResult> {
  if (waypoints.length < 2) {
    throw new Error("fetchWalkingRoute needs at least two waypoints");
  }
  const path = waypoints.map((p) => `${p.lng},${p.lat}`).join(";");
  const url = `${OSRM_BASE}/${path}?overview=full&geometries=geojson`;

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
    return straightLineFallback(waypoints);
  }
}

function straightLineFallback(waypoints: LatLng[]): RouteResult {
  let total = 0;
  for (let i = 1; i < waypoints.length; i++) {
    total += greatCircleDistanceM(waypoints[i - 1], waypoints[i]);
  }
  return {
    route: waypoints.map((p) => [p.lat, p.lng] as [number, number]),
    distanceM: total,
    routed: false,
  };
}
