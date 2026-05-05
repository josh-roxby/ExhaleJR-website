export interface WheelItem {
  id: string;
  text: string;
}

export interface WheelData {
  items: WheelItem[];
}

export const WHEEL_DATA_VERSION = 1;

export const emptyWheelData: WheelData = {
  items: [],
};

export function generateId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 10);
}
