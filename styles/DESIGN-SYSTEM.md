# EXHALEJR Design System v0.1

The design language for exhalejr.com. Sibling brand to Exhale Studios. Mobile-first, dark-mode native, single-accent system.

This document is the source of truth for tokens, rules, and components. Everything below is locked unless explicitly amended.

---

## Table of contents

1. [Overview](#1-overview)
2. [Tokens](#2-tokens)
3. [Critical rules](#3-critical-rules)
4. [Components](#4-components)
5. [Mobile patterns](#5-mobile-patterns)
6. [Naming convention](#6-naming-convention)
7. [Implementation notes](#7-implementation-notes)

---

## 1. Overview

### Brand context

ExhaleJR is the personal site of Josh Roxby, sibling brand to Exhale Studios. Visually distinct from Studios but sharing core sensibilities: dark, considered, technical-but-warm, no decorative excess.

### Design principles

1. **Restrained but expressive.** One signature accent (Iris). Most of the page is neutral. Colour is meaning, not decoration.
2. **Mobile-first, tactile.** Every interactive surface responds to touch with subtle scale and glow. Nothing flat.
3. **Coherent system, modular components.** Square for utility, round for state. Square for buttons, inputs, cards, dropdowns. Round for chips, pills, badges, toggles.
4. **Information first, ornament second.** Mono type for metadata. Display type for headings. No icon decoration without function.
5. **Solid overlays, no bleed.** Floating menus are fully opaque. Modals get atmospheric blur. Backdrops dim the page.

---

## 2. Tokens

Drop into your stylesheet root.

```css
:root {
  /* === COLOUR === */

  /* Background scale (darkest to lightest) */
  --bg:        #0a0a0a;
  --bg-2:      #0d0d0d;
  --surface:   #111111;
  --surface-2: #161616;
  --surface-3: #1c1c1c;

  /* Lines & dividers */
  --line:   #1f1f1f;
  --line-2: #2a2a2a;
  --line-3: #3a3a3a;

  /* Text scale (darkest to lightest) */
  --mute-3: #5a5a5a;
  --mute-2: #7a7a7a;
  --mute:   #a8a8a8;
  --ink-2:  #cfcfcf;
  --ink:    #fafafa;

  /* Accent — Iris (primary) */
  --accent:           #7c5cff;
  --accent-on:        #ffffff;
  --accent-glow:      rgba(124, 92, 255, 0.22);

  /* Accent — Lavender (dim, supporting) */
  --accent-dim:       #a78bfa;
  --accent-glow-soft: rgba(167, 139, 250, 0.16);

  /* Semantic */
  --warn: #ff5b3d;
  --ok:   #4ade80;

  /* === RADII === */
  --r-square-xs:  3px;
  --r-square:     5px;
  --r-square-md:  6px;
  --r-square-lg:  10px;
  --r-square-xl:  14px;
  --r-square-xxl: 20px;
  --r-round:      999px;

  /* === MOTION === */
  --t:          240ms;
  --ease:       cubic-bezier(.2, .6, .2, 1);
  --ease-press: cubic-bezier(.4, 0, .6, 1);

  /* === TYPOGRAPHY === */
  --f-display: 'Big Shoulders Display', sans-serif;
  --f-body:    'DM Sans', sans-serif;
  --f-mono:    'JetBrains Mono', monospace;
}
```

### Colour usage rules

| Token | When to use |
|---|---|
| `--bg`, `--bg-2` | Page backgrounds. Bg-2 for sections that need slight separation. |
| `--surface` | Default card / panel background. |
| `--surface-2` | Inputs, secondary buttons, hover states on cards. |
| `--surface-3` | Pressed / active states, subtle hover layers. |
| `--line`, `--line-2`, `--line-3` | Borders, in ascending visibility. |
| `--mute-3` to `--ink` | Text scale. Mute-3 for the most secondary; ink for primary headings and emphasis. |
| `--accent` (Iris) | Primary CTAs, focus rings, active states, signature glows. The "do this / important" colour. |
| `--accent-dim` (Lavender) | Outline buttons, soft hovers, secondary accent text, mono captions. The "soft brand presence" colour. |
| `--warn` | Destructive actions, errors. |
| `--ok` | Success, live, shipped statuses. |

### Typography scale

```css
/* Display — headings, hero, brand mark */
font-family: var(--f-display);
/* Weights: 700 (headings), 900 (display, brand) */

/* Body — paragraphs, button labels, form values */
font-family: var(--f-body);
/* Weights: 400 (body), 500 (emphasis), 600 (semibold), 700 (button) */

/* Mono — metadata, IDs, captions, eyebrows, timestamps */
font-family: var(--f-mono);
/* Weights: 500 (default), 600 (caps eyebrows), 700 (strong labels) */
```

**Letter-spacing convention.** All-caps mono labels use `.18em` to `.22em` letter-spacing. Display headings use slightly negative tracking (`-0.01em`). Body type stays at `0.01em` to `0.02em`.

### Spacing scale

Use these in increments of 4px: `4, 8, 12, 16, 24, 32, 48, 64, 80`. No values between.

### Elevation / shadow

```css
/* sm — subtle lift */
box-shadow: 0 1px 2px rgba(0,0,0,.4);

/* md — cards, dropdowns */
box-shadow: 0 4px 12px rgba(0,0,0,.5);

/* lg — modals, popovers */
box-shadow: 0 12px 32px rgba(0,0,0,.6);

/* glow — active accent surfaces */
box-shadow: 0 0 24px var(--accent-glow);
```

---

## 3. Critical rules

### 3.1 Shape language

| Round (pill / circle) | Square (5px radius) |
|---|---|
| Chips | Buttons (primary, secondary, ghost, destructive) |
| Pills | Inputs (text, search, textarea) |
| Badges | Selects / dropdowns |
| Toggles | Cards |
| Slider thumbs (default) | Tags |
| Avatars | Checkboxes |
| Icon FABs | Bento cells |

The split signals function. Round = state / status / identity. Square = action / container / value. Don't mix.

### 3.2 Motion

**Single duration: 240ms.** Use `var(--t)` everywhere. Faster feels jittery. Slower feels sluggish. 240ms is the negotiated middle.

**Two easing curves:**

- `var(--ease)` cubic-bezier(.2,.6,.2,1) for hover, focus, color, layout transitions.
- `var(--ease-press)` cubic-bezier(.4,0,.6,1) for `:active` scale.

### 3.3 Interaction (press + glow)

Every interactive element gets two layered effects:

```css
.element {
  transition: 
    background-color var(--t) var(--ease),
    border-color var(--t) var(--ease),
    color var(--t) var(--ease),
    box-shadow var(--t) var(--ease),
    transform var(--t) var(--ease-press);
}

.element:hover {
  /* Accent surfaces: add glow */
  box-shadow: 0 0 24px var(--accent-glow);
}

.element:active {
  transform: scale(0.97);
}
```

Scale percentages by element size: small icon buttons go to `.88` to `.92`, medium to `.95` to `.97`, large cards to `.98` to `.99`.

No haptic feedback (browser support is unreliable).

### 3.4 No-select on UI chrome

Every interactive element gets:

```css
button, .nav-item, .menu-cell, .card, .chip, .pill, .tag,
.toggle, .check, .radio, /* etc. */ {
  -webkit-user-select: none;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
}
```

**Keep selectable:** body paragraphs, headings, form inputs, code blocks, output text. Anything users might want to copy.

### 3.5 Overlay opacity rules

| Surface | Background | Blur |
|---|---|---|
| Dropdowns, popovers, tooltips | `#161616` (fully opaque) | none |
| Modals, sheets | `rgba(17,17,17,0.98)` | `blur(24px)` |
| Modal / popover backdrops | `rgba(0,0,0,0.55)` to `rgba(0,0,0,0.7)` | `blur(8px)` to `blur(10px)` |

**Why.** Floating menus need to be readable instantly. Even 4% transparency reads as bleed-through on dark text. Modals are larger and benefit from a hint of atmospheric blur.

### 3.6 Stacking context for overlays

Critical for any container that hosts a floating menu / popover:

```css
.parent {
  isolation: isolate; /* establishes own stacking context */
  position: relative;
  overflow: hidden;
}

/* z-index hierarchy */
.viewport-content { z-index: 1; }
.popover-backdrop { z-index: 30; }
.floating-nav     { z-index: 40; } /* stays visible above backdrop */
.popover          { z-index: 50; } /* highest, fully opaque */
```

Without `isolation: isolate`, `backdrop-filter` blur will paint outside the parent and break layering.

---

## 4. Components

Round 1 covers atomic UI. Round 2 covers surfaces and navigation. Each component below references its source ID.

### 4.1 Buttons (A)

Square. Five types: primary, secondary, ghost, icon-only, destructive.

```css
.btn {
  display: inline-flex; align-items: center; justify-content: center; gap: 8px;
  padding: 10px 18px;
  border-radius: var(--r-square);
  font-family: var(--f-body); font-size: 13px; font-weight: 600;
  letter-spacing: .02em;
  cursor: pointer; white-space: nowrap;
  transition: all var(--t) var(--ease), transform var(--t) var(--ease-press);
}
.btn:active:not(:disabled) { transform: scale(.97); }

.btn-prim {
  background: var(--accent); color: var(--accent-on); font-weight: 700;
}
.btn-prim:hover:not(:disabled) {
  background: #fff; color: #000;
  box-shadow: 0 0 24px var(--accent-glow);
}

.btn-sec {
  background: transparent; color: var(--ink);
  border: 1px solid var(--line-2);
}
.btn-sec:hover:not(:disabled) {
  border-color: var(--line-3); background: var(--surface-2);
}

.btn-sec-accent {
  background: transparent; color: var(--accent-dim);
  border: 1px solid rgba(167, 139, 250, .4);
}
.btn-sec-accent:hover:not(:disabled) {
  background: rgba(167, 139, 250, .1);
  border-color: var(--accent-dim); color: #fff;
}

.btn-ghost {
  background: transparent; color: var(--mute);
  padding: 8px 12px;
}
.btn-ghost:hover:not(:disabled) {
  color: var(--ink); background: var(--surface-2);
}

.btn-dest {
  background: var(--warn); color: #fff; font-weight: 700;
}

/* Icon-only — square default, round as exception */
.btn-icon {
  width: 36px; height: 36px; padding: 0;
  border-radius: var(--r-square);
  display: grid; place-items: center;
  background: var(--surface-2); color: var(--ink);
  border: 1px solid var(--line);
}
.btn-icon-round { border-radius: var(--r-round); } /* exception */
```

**Variants:** A1 primary (4), A2 secondary (4), A3 ghost (3), A4 icon-only (4), A5 destructive (3). Total 17.

### 4.2 Chips (B1) — round

```css
.chip {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 5px 11px;
  border-radius: var(--r-round);
  font-family: var(--f-body); font-size: 11px; font-weight: 500;
  background: var(--surface-2); color: var(--ink-2);
  border: 1px solid var(--line);
  cursor: pointer;
  transition: all var(--t) var(--ease), transform var(--t) var(--ease-press);
}
.chip:active { transform: scale(.95); }
.chip-accent {
  background: var(--accent); color: var(--accent-on);
  border-color: var(--accent); font-weight: 600;
}
.chip-mono {
  font-family: var(--f-mono); font-size: 9px;
  letter-spacing: .18em; text-transform: uppercase;
  font-weight: 600; padding: 4px 9px;
}
```

### 4.3 Tags (B2) — square

```css
.tag {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 4px 8px;
  border-radius: var(--r-square-xs);
  font-family: var(--f-mono); font-size: 10px; font-weight: 600;
  letter-spacing: .1em; text-transform: uppercase;
  background: var(--surface-2); color: var(--ink-2);
  border: 1px solid var(--line);
}
.tag-accent { background: var(--accent); color: var(--accent-on); border-color: var(--accent); }
.tag-ok    { background: rgba(74,222,128,.12); color: var(--ok); border-color: rgba(74,222,128,.3); }
.tag-warn  { background: rgba(255,91,61,.12); color: var(--warn); border-color: rgba(255,91,61,.3); }
```

### 4.4 Pills (C1) & Badges (C2) — round

```css
.pill {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 6px 14px;
  border-radius: var(--r-round);
  font-family: var(--f-body); font-size: 12px; font-weight: 600;
  background: var(--surface-2); color: var(--ink);
  border: 1px solid var(--line-2);
}

.badge {
  display: inline-flex; align-items: center; justify-content: center;
  min-width: 18px; height: 18px;
  padding: 0 5px;
  border-radius: var(--r-round);
  font-family: var(--f-mono); font-size: 9px; font-weight: 700;
  background: var(--accent); color: var(--accent-on);
}
.badge-dot {
  width: 8px; height: 8px; min-width: 0; padding: 0;
  background: var(--accent);
  box-shadow: 0 0 0 2px var(--bg);
}
```

### 4.5 Form fields (D)

Square. Iris focus glow.

```css
.field-input {
  width: 100%;
  padding: 11px 14px;
  border-radius: var(--r-square);
  background: var(--surface-2);
  border: 1px solid var(--line-2);
  font-size: 13px; color: var(--ink);
  transition: all var(--t) var(--ease);
}
.field-input::placeholder { color: var(--mute-3); }
.field-input:focus {
  border-color: var(--accent);
  background: var(--surface);
  box-shadow: 0 0 0 3px var(--accent-glow);
}
.field-input.error { border-color: var(--warn); }

.field-label {
  font-family: var(--f-mono); font-size: 9px;
  color: var(--mute); letter-spacing: .18em;
  text-transform: uppercase; font-weight: 600;
}

.field-line {
  width: 100%; padding: 8px 2px;
  background: transparent; border: none;
  border-bottom: 1px solid var(--line-2);
  transition: all var(--t) var(--ease);
}
.field-line:focus { border-bottom-color: var(--accent); }
```

### 4.6 Selects / dropdowns (E)

```css
.dropdown-menu {
  position: absolute; top: calc(100% + 4px); left: 0; right: 0;
  background: #161616; /* OPAQUE — no transparency */
  border: 1px solid var(--line-2);
  border-radius: var(--r-square);
  box-shadow: 0 16px 40px rgba(0,0,0,.7), 0 4px 8px rgba(0,0,0,.4);
  padding: 4px; z-index: 10;
  animation: menuIn var(--t) var(--ease);
}
@keyframes menuIn {
  from { opacity: 0; transform: translateY(-4px); }
  to   { opacity: 1; transform: translateY(0); }
}
```

### 4.7 Checkboxes (Fc1) — square / Radios (Fc2) — round

```css
.check-box {
  width: 16px; height: 16px;
  border: 1px solid var(--line-3);
  border-radius: var(--r-square-xs);
  background: var(--surface-2);
}
.check input:checked + .check-box {
  background: var(--accent); border-color: var(--accent);
  box-shadow: 0 0 12px var(--accent-glow);
}

.radio-dot {
  width: 16px; height: 16px;
  border: 1px solid var(--line-3);
  border-radius: var(--r-round);
  background: var(--surface-2);
}
.radio-dot::after {
  content: ''; width: 7px; height: 7px;
  background: var(--accent);
  border-radius: var(--r-round);
}
```

### 4.8 Toggles (G) — round only

```css
.toggle-track {
  width: 32px; height: 18px;
  background: var(--surface-3);
  border-radius: var(--r-round);
  position: relative;
}
.toggle-track::after {
  content: ''; position: absolute; top: 2px; left: 2px;
  width: 14px; height: 14px;
  background: var(--mute);
  border-radius: var(--r-round);
}
.toggle input:checked + .toggle-track {
  background: var(--accent);
  box-shadow: 0 0 12px var(--accent-glow);
}
.toggle input:checked + .toggle-track::after {
  left: 16px; background: #fff;
}
```

### 4.9 Sliders (H)

Track glow on fill, thumb scales 1.2x while grabbing.

```css
.slider-fill {
  background: var(--accent);
  box-shadow: 0 0 8px var(--accent-glow);
}
.slider-thumb {
  width: 14px; height: 14px;
  background: var(--ink);
  border-radius: var(--r-round);
}
.slider-thumb-accent {
  background: var(--accent);
  box-shadow: 0 0 12px var(--accent-glow);
}
```

### 4.10 Cards (J)

Square. Hover language: lift, glow, or gradient fill — pick one per surface.

```css
.card {
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: var(--r-square-md);
  padding: 18px;
  display: flex; flex-direction: column; gap: 10px;
  cursor: pointer;
  transition: all var(--t) var(--ease), transform var(--t) var(--ease-press);
}
.card:active { transform: scale(.99); }

/* Hover languages — choose one per context */
.card-hover-lift:hover {
  transform: translateY(-2px);
  border-color: var(--line-2);
  box-shadow: 0 8px 24px rgba(0,0,0,.4);
}
.card-hover-glow:hover {
  border-color: var(--accent);
  box-shadow: 0 0 0 1px var(--accent), 0 0 32px var(--accent-glow);
}
.card-hover-fill::after {
  content: ''; position: absolute; inset: 0;
  background: linear-gradient(180deg, transparent 0%, var(--accent-glow) 100%);
  opacity: 0; transition: opacity var(--t) var(--ease);
}
.card-hover-fill:hover::after { opacity: 1; }
```

**Stat cards (J2) — important rule:** numbers stay in `--ink`. Iris is reserved for the delta indicator chip. Sparklines desaturate non-current bars; only the latest bar carries Iris with glow.

```css
.stat-num   { color: var(--ink); /* never accent */ }
.stat-delta {
  background: rgba(124,92,255,.12);
  color: var(--accent);
  border: 1px solid rgba(124,92,255,.25);
  padding: 2px 6px;
  border-radius: var(--r-square-xs);
}
.stat-spark span         { background: var(--mute-3); opacity: .35; }
.stat-spark span.now     { background: var(--accent); opacity: 1; box-shadow: 0 0 6px var(--accent-glow); }
```

### 4.11 Bento (K)

Asymmetric grid layouts. Four templates: 2x2 hero, 4-cell mosaic, 12-col adaptive, equal grid. See `/concepts/jr-round-2.html` for layout reference.

```css
.bento { display: grid; gap: 8px; }
.bento-2x2 {
  grid-template-columns: 2fr 1fr;
  grid-template-rows: 1fr 1fr;
}
.bento-2x2 > :nth-child(1) { grid-row: 1 / 3; }
```

### 4.12 Carousel (L)

Horizontal scroll with snap. Three control schemes: dots, arrows, progress bar.

```css
.carousel-track {
  display: flex; gap: 12px; overflow-x: auto;
  scroll-snap-type: x mandatory;
  scrollbar-width: none;
}
.carousel-track::-webkit-scrollbar { display: none; }
.carousel-slide {
  flex: 0 0 220px;
  scroll-snap-align: start;
}
.carousel-dot.active {
  background: var(--accent);
  width: 18px; border-radius: 3px;
  box-shadow: 0 0 8px var(--accent-glow);
}
```

### 4.13 Navigation (I)

Four flavours: top nav (I1), breadcrumb (I2), tabs (I3), sidebar (I4).

**Top nav** — brand + links, sticky, Iris underline on active.

**Tabs** — four sub-types:

```css
/* I3.1 underline */
.tab.active::after {
  content: ''; position: absolute; bottom: -1px; left: 0; right: 0;
  height: 2px; background: var(--accent);
  box-shadow: 0 0 8px var(--accent-glow);
}

/* I3.2 pill */
.tabs-pill {
  display: inline-flex; gap: 4px; padding: 4px;
  background: var(--surface-2);
  border-radius: var(--r-round);
  border: 1px solid var(--line);
}
.tab-pill.active {
  background: var(--accent); color: var(--accent-on);
  box-shadow: 0 0 12px var(--accent-glow);
}

/* I3.3 segmented */
.tabs-seg {
  display: inline-flex;
  border: 1px solid var(--line-2);
  border-radius: var(--r-square);
  overflow: hidden;
}

/* I3.4 vertical with counts */
.tab-vert.active {
  color: var(--accent);
  border-left: 2px solid var(--accent);
  background: rgba(124,92,255,.06);
}
```

**Sidebar** — three variants: sectioned with icons (I4.1), with counts (I4.2), collapsed icon-only (I4.3).

---

## 5. Mobile patterns

### 5.1 Top nav (I5)

Brand mark + hamburger icon. Hamburger opens a full-screen menu overlay.

```css
.mtopnav {
  display: flex; align-items: center; justify-content: space-between;
  padding: 12px 16px;
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: var(--r-square-md);
}
.hamburger {
  width: 36px; height: 36px;
  border-radius: var(--r-square);
  background: transparent;
  border: 1px solid var(--line-2);
  color: var(--ink);
}
```

### 5.2 Floating bottom nav (I6) — the core mobile pattern

Soft rounded square (matches UI language), 5 positions: 4 primary destinations + Menu.

```css
.float-nav {
  position: absolute;
  left: 50%; bottom: 18px;
  transform: translateX(-50%);
  z-index: 40;
  display: flex; align-items: center; gap: 2px;
  padding: 5px;
  background: rgba(13, 13, 13, .95);
  backdrop-filter: blur(20px) saturate(160%);
  border: 1px solid rgba(255, 255, 255, .08);
  border-radius: var(--r-square-xxl); /* 20px — soft rounded square */
  box-shadow:
    0 12px 32px rgba(0,0,0,.6),
    0 4px 12px rgba(0,0,0,.4),
    0 0 0 1px rgba(0,0,0,.5);
}
.nav-item {
  width: 40px; height: 40px;
  border-radius: var(--r-square-lg);
  display: grid; place-items: center;
  color: var(--mute);
  cursor: pointer;
  transition: all var(--t) var(--ease), transform var(--t) var(--ease-press);
}
.nav-item:active { transform: scale(.88); }
.nav-item.active {
  background: var(--accent); color: var(--accent-on);
  box-shadow: 0 0 16px var(--accent-glow);
}
```

**Behaviour rules:**

- 4 primary slots + Menu in slot 5
- On non-primary screen, all primary slots dim; the Menu slot can highlight if open
- Menu icon is 3-dots when closed, ✕ when open
- Floating nav stays visible above the popover backdrop (z:40 vs backdrop z:30)

### 5.3 Bento popover menu (I6 popover)

Slides up from bottom when Menu is tapped. 3x3 bento grid layout.

**Critical layout rule (revised in v3):** the popover itself does NOT scroll. Layout is a flex column:

1. **Head** — fixed, contains close button.
2. **3x3 grid** — fixed, contains: account hero (2 cols), settings, search, new note, contact, sign out, theme, help.
3. **Lab list cell** — flex:1, takes remaining height. INTERNAL scroll only on the list itself.

```css
.popover {
  position: absolute;
  left: 14px; right: 14px; bottom: 78px;
  z-index: 50;
  background: #161616; /* OPAQUE */
  border: 1px solid var(--line-2);
  border-radius: var(--r-square-xl);
  padding: 14px;
  display: flex; flex-direction: column; gap: 10px;
  /* FIXED height, NO overflow on parent */
  height: 560px;
  max-height: calc(100% - 110px);
  overflow: hidden;
  /* slide-up animation */
  opacity: 0; transform: translateY(20px) scale(.96);
  pointer-events: none;
  transition: opacity var(--t) var(--ease), transform var(--t) var(--ease);
}
.popover.open {
  opacity: 1; transform: translateY(0) scale(1);
  pointer-events: auto;
}
.menu-head { flex-shrink: 0; }
.menu-grid {
  flex-shrink: 0;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 6px;
}
.menu-cell.account { grid-column: 1 / 3; }

/* Lab list cell — flexes to fill, internal scroll */
.menu-list-cell {
  flex: 1; min-height: 0;
  background: var(--surface-2);
  border: 1px solid var(--line);
  border-radius: var(--r-square);
  display: flex; flex-direction: column;
  overflow: hidden;
}
.menu-list-head { flex-shrink: 0; }
.menu-list {
  flex: 1; min-height: 0;
  overflow-y: auto;
  padding: 4px;
  scrollbar-width: thin;
  scrollbar-color: var(--line-3) transparent;
}
.menu-list::-webkit-scrollbar { width: 4px; }
.menu-list::-webkit-scrollbar-thumb {
  background: var(--line-3);
  border-radius: var(--r-round);
}
```

**Bento popover content layout (3x3 + footer list):**

```
[ ACCOUNT HERO (2 cols) ][ SETTINGS ]
[ SEARCH ][ NEW NOTE ][ CONTACT    ]
[ SIGN OUT ][ THEME ][ HELP        ]
[ LAB · ALL PAGES (full-width, scrollable) ]
```

The account hero spans 2 columns and uses the Iris gradient (`linear-gradient(135deg, var(--accent) 0%, #5d3fe0 100%)`).

### 5.4 Backdrop layering

```css
.popover-backdrop {
  position: absolute; inset: 0; z-index: 30;
  background: rgba(0, 0, 0, .55);
  backdrop-filter: blur(10px) saturate(80%);
  opacity: 0; pointer-events: none;
  transition: opacity var(--t) var(--ease);
}
.popover-backdrop.open { opacity: 1; pointer-events: auto; }
```

The parent must have `isolation: isolate` set, otherwise `backdrop-filter` paints outside the container and the popover layer breaks.

---

## 6. Naming convention

Components use a `Letter.Number.Decimal` ID system for traceability across rounds.

| Letter | Category |
|---|---|
| F | Foundations (tokens) |
| A | Buttons |
| B | Chips & Tags |
| C | Pills & Badges |
| D | Form Fields |
| E | Selects & Dropdowns |
| Fc | Checkboxes & Radios |
| G | Toggles |
| H | Sliders |
| I | Navigation (I1 top, I2 breadcrumb, I3 tabs, I4 sidebar, I5 mobile top, I6 mobile bottom) |
| J | Cards |
| K | Bento layouts |
| L | Carousel |

Format: `A1.2` = category A (buttons), type 1 (primary), variant 2 (trailing icon). 

When implementing, use these IDs in component file names or class names for traceability:

```tsx
// Example
<Button variant="primary" /> // A1.1
<Button variant="primary" trailingIcon={Arrow} /> // A1.2
<Button variant="secondary-accent" /> // A2.2
```

---

## 7. Implementation notes

### Suggested file structure

```
/styles
  tokens.css           // CSS custom properties (section 2)
  base.css             // resets, body, no-select rules
  components/
    button.css         // A
    chip.css           // B
    pill.css           // C
    field.css          // D
    select.css         // E
    check.css          // Fc
    toggle.css         // G
    slider.css         // H
    card.css           // J
    bento.css          // K
    carousel.css       // L
    nav.css            // I (all variants)
    mobile-nav.css     // I5, I6 + popover
```

### Fonts

All three fonts are on Google Fonts. Load with:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Big+Shoulders+Display:wght@400;700;900&family=DM+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet">
```

### Background atmosphere

The body background uses two radial-gradient glows for depth, plus a subtle SVG noise texture at 2.5% opacity. Reference:

```css
body {
  background:
    radial-gradient(900px 600px at 80% 5%, var(--accent-glow) 0%, transparent 55%),
    radial-gradient(700px 500px at 0% 70%, var(--accent-glow-soft) 0%, transparent 60%),
    var(--bg);
}
body::before {
  content: ''; position: fixed; inset: 0; pointer-events: none;
  z-index: 1; opacity: .025;
  background-image: url("data:image/svg+xml,...noise svg...");
}
```

### Accessibility

- All interactive elements have visible focus state via `:focus-visible` (Iris glow ring matches `:focus`).
- Colour contrast: `--ink` on `--bg` = 17:1, `--mute` on `--bg` = 6.4:1. Both pass WCAG AA.
- Iris on dark surface = 4.6:1 — passes for 18pt+ text and large UI elements. For body text on Iris fills, use `--accent-on` (#fff) which gives 7:1.
- Touch targets minimum 36x36px (most go larger to 40-44px).
- All form fields require labels (use `--field-label` style for mono caps eyebrow).

### Reference artifacts

Working specimens for visual reference:

- `jr-round-1-v4.html` — foundations + atomic UI
- `jr-round-2-v2.html` — surfaces + navigation, mobile nav specs
- `jr-mobile-home-concept-v3.html` — full home page applying the entire system

### Open items (Round 3 — not yet specified)

The system still needs: modals, generic popovers, toasts, tables, progress, code blocks, accordion, typography rhythm guidance for long-form content. These are deferred to Round 3 and not part of v0.1.

---

**Version:** 0.1  
**Last revised:** May 2026  
**Status:** Locked. Amendments require explicit revision and version bump.
