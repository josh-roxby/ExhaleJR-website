export interface LatLng {
  lat: number;
  lng: number;
}

export interface Pin extends LatLng {
  /** When the pin was first set, ISO date. */
  setAt: string;
}

export type QuestMode = "city" | "countryside" | "mixed";
export type QuestStatus = "active" | "completed" | "abandoned";

export interface Quest {
  id: string;
  startedAt: string; // ISO timestamp
  completedAt: string | null; // ISO timestamp or null
  status: QuestStatus;

  origin: LatLng;
  target: LatLng;
  /** Walking distance in metres if the router returned one, otherwise the
   *  great-circle distance and `routed: false`. */
  distanceM: number;
  routed: boolean;
  /** Polyline as a flat array of [lat, lng] points. */
  route: [number, number][];

  mode: QuestMode;
  action: string;
  item: string;
  descriptor: string;
  text: string;
}

export interface SideQuestData {
  pin: Pin | null;
  radiusKm: number;
  mode: QuestMode;
  activeQuest: Quest | null;
  history: Quest[];
  privacyAcknowledged: boolean;
}

export const SIDE_QUEST_DATA_VERSION = 1;

export const emptySideQuestData: SideQuestData = {
  pin: null,
  radiusKm: 2,
  mode: "mixed",
  activeQuest: null,
  history: [],
  privacyAcknowledged: false,
};

/** Cap history so we don't accidentally fill localStorage. */
export const HISTORY_LIMIT = 50;

export function generateId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 10);
}
