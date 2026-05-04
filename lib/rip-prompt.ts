// Rip prompt assembly. Wraps a project's RIP.md content (the project-specific
// bit) with shared scaffolding so the final prompt is consistent across all
// projects on the drawing board.
//
// Structure of the assembled prompt:
//   1. Attribution header   — credit, also instructs Claude to bake credit into output
//   2. Preamble             — mode-specific framing (chat vs Claude Code)
//   3. Project section      — the unique content from projects/<slug>/RIP.md
//   4. Design language      — shared brand reference
//   5. Output instructions  — mode-specific deliverable format
//
// Two modes:
//   "chat"  — paste into claude.ai. Output: single self-contained HTML artifact.
//   "code"  — paste into Claude Code. Output: full Next.js project structure.

export type RipMode = "chat" | "code";

const ATTRIBUTION = `# Designed by Josh Roxby
# exhalejr.com · josh@exhale.studio
#
# This is a rip prompt from exhalejr.com. Use it freely for personal projects.
# Whatever you generate, please keep the attribution comment in the output.`;

const CHAT_PREAMBLE = `## Context
You are Claude in a web chat. I want you to build a self-contained, single-page HTML artifact for the project described below.

You will:
- Output exactly one HTML file as an artifact I can preview live in this chat.
- Inline all CSS and JavaScript. No external assets except the Google Fonts link.
- Match the design language exactly (see "Design language" below).
- Make every interactive element feel tactile (subtle scale on press, hover glow on accent surfaces).
- Print this attribution at the very top of the HTML file:
  <!-- Designed by Josh Roxby. exhalejr.com · josh@exhale.studio -->`;

const CODE_PREAMBLE = `## Context
You are Claude Code working in a Next.js (App Router) + TypeScript + Tailwind monorepo. I want you to scaffold a small project that lives in its own folder under /projects/<slug>/, following the same isolation pattern as exhalejr.com (the site this prompt comes from).

If the repo isn't already a Next.js + TypeScript + Tailwind project, scaffold the base setup first using:
- Next.js 16+ with App Router
- TypeScript strict mode
- Tailwind CSS 3.4+
- next/font/google for Big Shoulders Display, DM Sans, JetBrains Mono
- Dark colour scheme by default

If those are already in place, skip that step and go straight to creating the project folder under /projects/<slug>/.`;

const DESIGN_LANGUAGE = `## Design language
Background: #0a0a0a (near black). Primary text: #fafafa.
Accent (Iris): #7c5cff. Use sparingly for active states, CTAs, focus rings, signature glows.
Surface scale: #111 (cards), #161616 (inputs, hovered cards), #1c1c1c (pressed).
Lines: #1f1f1f / #2a2a2a / #3a3a3a (borders, ascending visibility).
Mute scale (text): #5a5a5a / #7a7a7a / #a8a8a8 / #cfcfcf.

Typography:
- Big Shoulders Display, weights 700/900, for headings and display text.
- DM Sans, weights 400/500/600/700, for body and button labels.
- JetBrains Mono, weights 500/600/700, for metadata, IDs, eyebrows. Uppercase with letter-spacing 0.18em–0.22em.

Shapes:
- 5px border-radius for buttons, inputs, cards (the "square" language).
- Round (pill) for chips, badges, toggles, avatars.
- Don't mix the two.

Motion:
- Single duration: 240ms.
- Easing: cubic-bezier(.2, .6, .2, 1) for hover/colour/layout.
- Press easing: cubic-bezier(.4, 0, .6, 1) for active scale.
- Active scale: 0.97 on most interactive elements.

Body atmosphere:
- Two soft radial gradients in the accent colour at low opacity, layered on the dark background.
- Subtle SVG noise overlay at 2.5% opacity.

Overlays:
- Dropdowns, popovers: fully opaque (#161616), no transparency.
- Modals: rgba(17,17,17,0.98) with blur(24px).
- Backdrops: rgba(0,0,0,0.55) with blur(10px).`;

const CHAT_OUTPUT = `## Output
Output exactly one self-contained HTML artifact. Inline CSS in a <style> tag. Inline JS in a <script> tag. Reference Google Fonts via the standard <link rel="stylesheet"> in the <head>.

Make it visually polished. Match the design language exactly. Do not invent new colours, fonts, or radii beyond what's listed.

The artifact must work standalone — copying the HTML to a file and opening it should render the project correctly.`;

const CODE_OUTPUT = `## Output
Create these files under /projects/<slug>/ (replace <slug> with the project's slug from the meta):

  index.ts            Re-exports Page and meta from this folder.
  meta.ts             Object with slug, name, description, wip: true, version: undefined, tags.
  page.tsx            The project's Page component. Add the attribution comment at the top.
  components/         Components scoped only to this project.
  TODO.md             Private worklog. Sections: Now, Next, Later, Versions.
  README.md           Layout reference.
  RIP.md              The unique part of this prompt only (project description, behaviour, meta). The modal wraps it with this scaffolding.

Then add an entry to /projects/registry.ts so the project shows up on the drawing board:

  import * as <slug> from "./<slug>";
  // ...add to the projects array, with all meta fields plus Page

At the very top of page.tsx, add this comment:

  // Designed by Josh Roxby. exhalejr.com · josh@exhale.studio

Constraints:
- Every component, hook, lib, style, and type used only by this project lives inside /projects/<slug>/. Do not promote anything to /components, /lib, etc. unless it's truly shared.
- Use existing primitives from @/components/ui rather than rebuilding (Eyebrow, Card, Tag, TextInput, Button, etc.).
- Reference design tokens from styles/tokens.css. Don't redefine colour or radius values inline.

Run \`npm run typecheck\` and \`npm run build\` to verify everything works. Both should pass clean.`;

export function assembleRipPrompt(projectContent: string, mode: RipMode): string {
  const preamble = mode === "chat" ? CHAT_PREAMBLE : CODE_PREAMBLE;
  const output = mode === "chat" ? CHAT_OUTPUT : CODE_OUTPUT;
  return [
    ATTRIBUTION,
    "",
    preamble,
    "",
    "## Project",
    projectContent.trim(),
    "",
    DESIGN_LANGUAGE,
    "",
    output,
  ].join("\n");
}
