/**
 * Geo helpers for Side Quest Stroll. All in plain numbers — no Leaflet
 * types here so server code can import freely if it ever needs to.
 */

import type { LatLng } from "../data/types";

const EARTH_RADIUS_KM = 6371;
const KM_PER_DEG_LAT = 111.32;

/** Convert km to a latitude offset in degrees. */
export function kmToLatDeg(km: number): number {
  return km / KM_PER_DEG_LAT;
}

/** Convert km to a longitude offset in degrees at a given latitude. */
export function kmToLngDeg(km: number, atLat: number): number {
  return km / (KM_PER_DEG_LAT * Math.cos((atLat * Math.PI) / 180));
}

/** Great-circle distance in metres (haversine). */
export function distanceM(a: LatLng, b: LatLng): number {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const x =
    Math.sin(dLat / 2) ** 2 +
    Math.sin(dLng / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);
  return 2 * EARTH_RADIUS_KM * 1000 * Math.asin(Math.sqrt(x));
}

/**
 * Pick a random point uniformly distributed inside a circle of `radiusKm`
 * around `center`. Uses sqrt scaling on the distance so points aren't
 * clustered toward the centre.
 */
export function randomPointInRadius(center: LatLng, radiusKm: number): LatLng {
  const angle = Math.random() * 2 * Math.PI;
  const distance = radiusKm * Math.sqrt(Math.random());
  const offsetLat = distance * Math.sin(angle) * (1 / KM_PER_DEG_LAT);
  const offsetLng =
    distance *
    Math.cos(angle) *
    (1 / (KM_PER_DEG_LAT * Math.cos((center.lat * Math.PI) / 180)));
  return {
    lat: center.lat + offsetLat,
    lng: center.lng + offsetLng,
  };
}

/**
 * Pick a pair of perpendicular waypoints at the midpoint between `a` and
 * `b`. The two are mirrored across the direct line, so passing one as
 * the via-point of the outbound leg and the other as the via-point of
 * the return leg encourages OSRM to plan visually different paths.
 *
 * The perpendicular offset scales with the direct distance (25%, clamped
 * to 100..400 m) so a 1km hop bends ~250m off the bearing while a tiny
 * 200m hop only bends 100m.
 */
export function midpointWaypoints(
  a: LatLng,
  b: LatLng,
): { outward: LatLng; back: LatLng } {
  const M_PER_DEG_LAT = KM_PER_DEG_LAT * 1000;
  const midLat = (a.lat + b.lat) / 2;
  const midLng = (a.lng + b.lng) / 2;
  const cosLat = Math.cos((midLat * Math.PI) / 180);
  const M_PER_DEG_LNG = M_PER_DEG_LAT * cosLat;

  const dN = (b.lat - a.lat) * M_PER_DEG_LAT;
  const dE = (b.lng - a.lng) * M_PER_DEG_LNG;
  const length = Math.hypot(dN, dE);

  if (length === 0) {
    return {
      outward: { lat: midLat, lng: midLng },
      back: { lat: midLat, lng: midLng },
    };
  }

  // Unit perpendicular (rotate origin→target 90° CCW: (-dE, dN)).
  const pN = -dE / length;
  const pE = dN / length;

  const offsetM = Math.max(100, Math.min(400, length * 0.25));
  const offsetLat = (offsetM * pN) / M_PER_DEG_LAT;
  const offsetLng = (offsetM * pE) / M_PER_DEG_LNG;

  return {
    outward: { lat: midLat + offsetLat, lng: midLng + offsetLng },
    back: { lat: midLat - offsetLat, lng: midLng - offsetLng },
  };
}

/** Format a coordinate in a friendly way, with sign + 4 decimal places. */
export function formatLatLng(p: LatLng): string {
  return `${p.lat.toFixed(4)}, ${p.lng.toFixed(4)}`;
}

/** Format a distance in metres as a friendly km / m string. */
export function formatDistance(m: number): string {
  if (m < 1000) return `${Math.round(m)} m`;
  return `${(m / 1000).toFixed(m < 10000 ? 2 : 1)} km`;
}
