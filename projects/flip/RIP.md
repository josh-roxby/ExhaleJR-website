A coin-flip toy. Single flip, best of 3, or best of 5. Animated 3D coin and a short two-tone tink when the coin lands.

## What it does

- A pill-tab mode picker switches between Single / Best of 3 / Best of 5.
- A big 3D coin sits in the centre. Tapping the Flip button rotates it 3 or 4 turns plus a 180° offset if the picked side differs from the current side, so it always lands on the chosen face.
- A short two-tone "tink" (Web Audio API, sine tones around 2.2 kHz and 1.8 kHz) plays as the coin lands.
- For best-of modes, a tally below the coin shows running heads vs tails counts and a row of small dots representing each round (filled accent / accent-dim, unfilled surface-3). The match ends as soon as one side reaches the majority.
- Once a winner is decided (or all rounds are used in single mode), the Flip button becomes a Reset button.

## Project meta

- slug: flip
- name: Flip
- description: Coin flip. Single, best of 3, or best of 5. Visual + audio.
- tags: ["random", "tools", "personal"]
- wip: true

## Behaviour notes

- Coin starts at rotation 0 (heads up). Heads is the JR brand mark on an Iris-filled disc; tails is a star on a dark disc.
- All audio is generated via the Web Audio API; no asset files. The first call is always from a user gesture (tap), which satisfies browser autoplay rules.
- No persistence. Flips are session-only; switching modes resets the run.
- Mobile-first. Big tap targets, big readable type, full-bleed coin.
