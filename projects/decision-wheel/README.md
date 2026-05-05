# Decision wheel

Spin a wheel of options. Items persist on the user's device via the shared
`useProjectStorage` hook.

## Layout

```
projects/decision-wheel/
  index.ts                  # public exports (Page, meta)
  meta.ts                   # slug, name, description, wip, tags
  page.tsx                  # entry. Owns rotation + result state. Computes
                            # the next rotation so the picked slice always
                            # ends at the 12 o'clock pointer after a spin.
  data/types.ts             # WheelItem / WheelData / WHEEL_DATA_VERSION,
                            # generateId, defaults.
  lib/sound.ts              # Web Audio helpers: tick (square wave click)
                            # and chime (C5 / E5 / G5 sine triad).
  components/
    wheel.tsx               # SVG wheel. Slices 0..N-1 starting at 12
                            # o'clock, proceeding clockwise. Pointer
                            # rendered above the SVG, apex pointing down.
                            # Empty state when items array is empty.
    items-editor.tsx        # Add input + list with delete + clear-all.
```

## Spin math

Slice 0 spans 0° to (360/N)°, slice 1 spans (360/N)° to (720/N)°, etc.
After picking a target index, the slice centre is at:

    sliceCenter = index * (360 / N) + (360 / 2N)

To bring that centre under the 12 o'clock pointer, the wheel's final
rotation mod 360 must equal `360 - sliceCenter`. The page adds 5 to 7 full
turns for visual flourish before that landing offset.

## Sounds

The wheel currently plays a three-tone chime when it lands. The tick helper
is exported but not wired yet (see TODO).
