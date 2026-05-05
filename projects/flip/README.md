# Flip

Coin flip with single, best-of-3, and best-of-5 modes. Animated 3D coin,
short two-tone tink on land.

## Layout

```
projects/flip/
  index.ts             # public exports (Page, meta)
  meta.ts              # slug, name, description, wip, tags
  page.tsx             # entry. Owns mode + flips state. Computes
                       # the additional rotation per flip so the
                       # coin always lands on the picked side.
  lib/
    sound.ts           # Web Audio tink (two short sine tones).
  components/
    coin.tsx           # 3D coin. Two faces (JR / ★) on opposite
                       # sides of a [transform-style:preserve-3d]
                       # element, parent transitions rotateY.
    tally.tsx          # Best-of tally + winner Tag.
```

## Math note

The coin tracks total rotation in degrees. Each flip adds `turns × 360`
plus an extra `180` when the picked side differs from the current side,
so the animation always ends on the side we picked. `Math.random()`
chooses 3 or 4 full turns so each flip feels slightly different.
