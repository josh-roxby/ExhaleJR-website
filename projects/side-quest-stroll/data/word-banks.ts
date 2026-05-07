/**
 * Word banks for the quest generator.
 *
 * Three buckets per category (actions / items / descriptors):
 *   - common: works in either environment
 *   - city: built environment specific
 *   - countryside: rural specific
 *
 * The mode tab in the UI ("city" / "countryside" / "mixed") chooses which
 * combination of buckets to draw from. Mixed pulls from common + both
 * specific banks.
 *
 * Add freely. The generator is permissive about combinations.
 */

import type { QuestMode } from "./types";

// Actions stay passive on purpose — anything you can do without breaking
// stride. No sketch / draw / map / trace, since those pull you off the walk.
export const ACTIONS = {
  common: [
    "photograph",
    "find",
    "count",
    "observe",
    "describe",
    "name",
    "spot",
    "discuss",
  ],
  city: [
    "research",
    "ask about",
    "compare",
  ],
  countryside: [
    "identify",
    "listen for",
    "smell",
    "follow",
    "watch",
  ],
} as const;

export const ITEMS = {
  common: [
    "tree",
    "bird",
    "dog",
    "cloud",
    "shadow",
    "sign",
    "vehicle",
    "person",
    "child",
    "door",
    "window",
    "light",
    "puddle",
    "stone",
    "leaf",
  ],
  city: [
    "streetlight",
    "manhole cover",
    "sticker",
    "mural",
    "bench",
    "bike",
    "bus",
    "scaffold",
    "awning",
    "shop sign",
    "balcony",
    "statue",
    "fountain",
    "post box",
    "bin",
    "bus stop",
    "cyclist",
    "pigeon",
    "alleyway",
    "staircase",
    "chimney",
    "antenna",
    "coffee shop",
    "graffiti tag",
    "construction worker",
  ],
  countryside: [
    "stream",
    "bridge",
    "gate",
    "path",
    "fence",
    "wildflower",
    "mushroom",
    "mossy stone",
    "animal track",
    "log",
    "bird call",
    "hedgerow",
    "cow",
    "sheep",
    "horse",
    "wooden post",
    "berry",
    "nest",
    "spider web",
    "old barn",
    "haybale",
    "weathervane",
    "pond",
    "boulder",
    "pine cone",
    "acorn",
  ],
} as const;

export const DESCRIPTORS = {
  common: [
    "red",
    "blue",
    "yellow",
    "green",
    "orange",
    "white",
    "black",
    "purple",
    "old",
    "new",
    "weathered",
    "unusual",
    "large",
    "small",
    "tall",
    "short",
    "round",
    "crooked",
    "broken",
    "shiny",
    "interesting",
    "forgotten",
  ],
  city: [
    "graffitied",
    "painted",
    "faded",
    "polished",
    "neon",
    "abandoned-looking",
    "freshly painted",
  ],
  countryside: [
    "gnarled",
    "twisted",
    "mossy",
    "rusted",
    "overgrown",
    "fragrant",
    "still",
  ],
} as const;

/** Returns the merged pool for a category given the user's selected mode. */
export function pool(
  category: typeof ACTIONS | typeof ITEMS | typeof DESCRIPTORS,
  mode: QuestMode,
): readonly string[] {
  if (mode === "city") return [...category.common, ...category.city];
  if (mode === "countryside") return [...category.common, ...category.countryside];
  return [...category.common, ...category.city, ...category.countryside];
}
