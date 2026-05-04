"use client";

import type { ReactNode } from "react";
import { useDisclosure } from "@/hooks/use-disclosure";
import { cn } from "@/lib/cn";
import {
  AccountMenuCell,
  AccountSubCta,
  ActionMenuCell,
  Badge,
  Button,
  Card,
  Chip,
  Eyebrow,
  FieldLabel,
  FloatNav,
  IconButton,
  MenuListCell,
  MenuListItem,
  MenuPopover,
  Modal,
  NavItem,
  NavSecondary,
  Pill,
  PopoverBackdrop,
  RipButton,
  Sparkline,
  StatCard,
  Tag,
  TextInput,
} from "@/components/ui";

export default function DesignSystemPage() {
  return (
    <div className="relative z-10 min-h-dvh">
      {/* Demo: page registers its own items into the nav's secondary slot. */}
      <NavSecondary>
        <NavItem
          aria-label="Scroll to top"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 15l-6-6-6 6" />
          </svg>
        </NavItem>
        <NavItem
          aria-label="Scroll to bottom"
          onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" })}
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 9l6 6 6-6" />
          </svg>
        </NavItem>
      </NavSecondary>

      <header className="border-b border-line bg-bg-2 px-6 py-10">
        <div className="mx-auto max-w-5xl">
          <Eyebrow tone="mute" size="xs">// EXHALEJR · Design System v0.1</Eyebrow>
          <h1 className="mt-2 font-display text-5xl font-black tracking-tight">
            Component <span className="text-accent">library</span>.
          </h1>
          <p className="mt-3 max-w-xl text-sm text-mute">
            Working surface for every primitive in <code className="font-mono text-ink-2">/components/ui</code>. IDs reference{" "}
            <code className="font-mono text-ink-2">styles/DESIGN-SYSTEM.md</code> §6.
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-5xl space-y-20 px-6 py-16">
        <FoundationsSection />
        <ButtonsSection />
        <IconButtonsSection />
        <EyebrowSection />
        <ChipsTagsSection />
        <PillsBadgesSection />
        <FormFieldsSection />
        <CardsSection />
        <StatCardsSection />
        <FloatNavSection />
        <PopoverSection />
        <ModalSection />
        <RipSection />
      </div>
    </div>
  );
}

/* ───────────────── helpers ───────────────── */

function Section({
  id,
  title,
  code,
  description,
  children,
}: {
  id: string;
  title: string;
  code?: string;
  description?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section id={id} className="space-y-6 scroll-mt-12">
      <header className="space-y-1">
        <div className="flex items-baseline gap-3">
          <h2 className="font-display text-3xl font-black tracking-tight">{title}</h2>
          {code && (
            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-mute-2">
              §{code}
            </span>
          )}
        </div>
        {description && <p className="max-w-2xl text-sm text-mute">{description}</p>}
      </header>
      {children}
    </section>
  );
}

function Row({ label, children, className }: { label: string; children: ReactNode; className?: string }) {
  return (
    <div className="space-y-2">
      <div className="font-mono text-[9px] font-semibold uppercase tracking-[0.18em] text-mute-3">
        {label}
      </div>
      <div className={cn("flex flex-wrap items-center gap-3 rounded-sq-md border border-line bg-surface p-4", className)}>
        {children}
      </div>
    </div>
  );
}

const sampleSpark = [30, 55, 42, 65, 50, 78, 95];

/* ───────────────── sections ───────────────── */

function FoundationsSection() {
  const colors = [
    ["bg", "var(--bg)"],
    ["bg-2", "var(--bg-2)"],
    ["surface", "var(--surface)"],
    ["surface-2", "var(--surface-2)"],
    ["surface-3", "var(--surface-3)"],
    ["line", "var(--line)"],
    ["line-2", "var(--line-2)"],
    ["line-3", "var(--line-3)"],
    ["mute-3", "var(--mute-3)"],
    ["mute-2", "var(--mute-2)"],
    ["mute", "var(--mute)"],
    ["ink-2", "var(--ink-2)"],
    ["ink", "var(--ink)"],
    ["accent", "var(--accent)"],
    ["accent-dim", "var(--accent-dim)"],
    ["warn", "var(--warn)"],
    ["ok", "var(--ok)"],
  ] as const;

  return (
    <Section id="foundations" title="Foundations" description="Tokens, type, motion. Source: styles/tokens.css.">
      <Row label="// COLOUR">
        <div className="grid w-full grid-cols-2 gap-2 sm:grid-cols-4 md:grid-cols-6">
          {colors.map(([name, value]) => (
            <div key={name} className="flex items-center gap-2">
              <span className="h-7 w-7 shrink-0 rounded-sq border border-line-2" style={{ background: value }} />
              <span className="font-mono text-[10px] text-mute-2">{name}</span>
            </div>
          ))}
        </div>
      </Row>

      <Row label="// TYPE">
        <div className="space-y-3">
          <div className="font-display text-5xl font-black leading-none tracking-tight">Display 5xl / black</div>
          <div className="font-display text-3xl font-bold tracking-tight">Display 3xl / bold</div>
          <div className="text-base">Body. DM Sans 400</div>
          <div className="text-base font-semibold">Body. DM Sans 600</div>
          <div className="font-mono text-xs uppercase tracking-[0.18em] text-mute">// MONO CAPS · 0.18em</div>
          <div className="font-mono text-xs">JetBrains Mono. Code, IDs, metadata.</div>
        </div>
      </Row>

      <Row label="// MOTION">
        <p className="text-sm text-mute">
          Single duration <code className="font-mono text-ink-2">--t</code> = 240ms. Two easings:{" "}
          <code className="font-mono text-ink-2">--ease</code> for transitions,{" "}
          <code className="font-mono text-ink-2">--ease-press</code> for active scale. Use the{" "}
          <code className="font-mono text-ink-2">.ds-interactive</code> utility on every interactive element.
        </p>
      </Row>
    </Section>
  );
}

function ButtonsSection() {
  return (
    <Section id="buttons" title="Buttons" code="4.1 (A)" description="Square (5px radius). Five variants.">
      <Row label="// A1 · PRIMARY">
        <Button>Primary</Button>
        <Button trailingIcon={<Chevron />}>With trailing</Button>
        <Button leadingIcon={<Plus />}>With leading</Button>
        <Button disabled>Disabled</Button>
      </Row>
      <Row label="// A2 · SECONDARY">
        <Button variant="secondary">Secondary</Button>
        <Button variant="secondary" trailingIcon={<Chevron />}>Trailing</Button>
        <Button variant="secondary-accent">Secondary accent</Button>
      </Row>
      <Row label="// A3 · GHOST">
        <Button variant="ghost">Ghost</Button>
        <Button variant="ghost" leadingIcon={<Plus />}>With icon</Button>
      </Row>
      <Row label="// A5 · DESTRUCTIVE">
        <Button variant="destructive">Delete</Button>
      </Row>
    </Section>
  );
}

function IconButtonsSection() {
  return (
    <Section id="icon-buttons" title="Icon buttons" code="4.1 (A4)" description="Square default; round as exception.">
      <Row label="// A4 · VARIANTS">
        <IconButton aria-label="Search"><Search /></IconButton>
        <IconButton aria-label="Notifications" notification><Bell /></IconButton>
        <IconButton aria-label="Add" round><Plus /></IconButton>
        <IconButton aria-label="More" round notification><Bell /></IconButton>
      </Row>
    </Section>
  );
}

function EyebrowSection() {
  return (
    <Section id="eyebrow" title="Eyebrow" description="Mono caps eyebrow. Used in section heads, hero, project metadata.">
      <Row label="// VARIANTS">
        <div className="flex flex-col gap-3">
          <Eyebrow>// SECTION TITLE</Eyebrow>
          <Eyebrow tone="ink" size="sm">// INK · STRONG</Eyebrow>
          <Eyebrow tone="accent" withPulseDot>// LIVE · v0.1</Eyebrow>
        </div>
      </Row>
    </Section>
  );
}

function ChipsTagsSection() {
  return (
    <Section id="chips-tags" title="Chips & Tags" code="4.2–4.3 (B)" description="Round chips for state/identity. Square tags for metadata.">
      <Row label="// B1 · CHIPS (round)">
        <Chip>Default</Chip>
        <Chip variant="accent">Accent</Chip>
        <Chip variant="mono">// MONO</Chip>
      </Row>
      <Row label="// B2 · TAGS (square)">
        <Tag>Default</Tag>
        <Tag variant="accent">Accent</Tag>
        <Tag variant="ok">LIVE</Tag>
        <Tag variant="dev">DEV</Tag>
        <Tag variant="warn">ERROR</Tag>
      </Row>
    </Section>
  );
}

function PillsBadgesSection() {
  return (
    <Section id="pills-badges" title="Pills & Badges" code="4.4 (C)">
      <Row label="// C1 · PILLS">
        <Pill>Pill label</Pill>
        <Pill>1.4k tokens</Pill>
      </Row>
      <Row label="// C2 · BADGES">
        <Badge>3</Badge>
        <Badge>42</Badge>
        <Badge dot />
      </Row>
    </Section>
  );
}

function FormFieldsSection() {
  return (
    <Section id="fields" title="Form fields" code="4.5 (D)" description="Square. Iris focus glow. Optional leading icon and trailing slot.">
      <Row label="// DEFAULT">
        <div className="w-full max-w-sm">
          <TextInput placeholder="Default input" />
        </div>
      </Row>
      <Row label="// WITH LEADING ICON">
        <div className="w-full max-w-sm">
          <TextInput
            placeholder="Search…"
            leadingIcon={<Search />}
          />
        </div>
      </Row>
      <Row label="// LABEL + INPUT">
        <div className="w-full max-w-sm space-y-2">
          <FieldLabel htmlFor="ds-name">// YOUR NAME</FieldLabel>
          <TextInput id="ds-name" placeholder="Josh Roxby" />
        </div>
      </Row>
      <Row label="// INVALID / DISABLED">
        <div className="grid w-full max-w-sm gap-2">
          <TextInput placeholder="Has error" invalid defaultValue="not@valid" />
          <TextInput placeholder="Disabled" disabled />
        </div>
      </Row>
    </Section>
  );
}

function CardsSection() {
  return (
    <Section id="cards" title="Cards" code="4.10 (J)" description="Square (sq-md). Pick one hover language per surface.">
      <div className="grid gap-4 sm:grid-cols-2">
        <Card hover="lift">
          <Eyebrow size="xs">// HOVER · LIFT</Eyebrow>
          <p className="text-sm text-ink-2">Translates up 2px, deeper shadow.</p>
        </Card>
        <Card hover="glow">
          <Eyebrow size="xs">// HOVER · GLOW</Eyebrow>
          <p className="text-sm text-ink-2">Iris border + outer glow.</p>
        </Card>
        <Card hover="fill">
          <Eyebrow size="xs">// HOVER · FILL</Eyebrow>
          <p className="text-sm text-ink-2">Subtle border lift, no transform.</p>
        </Card>
        <Card hover="lift" featured>
          <Eyebrow size="xs" tone="ink">// FEATURED</Eyebrow>
          <p className="text-sm text-white/80">Iris-gradient surface.</p>
        </Card>
      </div>
    </Section>
  );
}

function StatCardsSection() {
  return (
    <Section
      id="stat-cards"
      title="Stat cards"
      code="4.10 (J2)"
      description="Numbers stay in --ink. Iris is reserved for the delta chip and the latest sparkline bar."
    >
      <div className="grid gap-2 sm:grid-cols-2">
        <StatCard featured label="// Featured · VI" num="2.1M" cap="tokens processed today" spark={sampleSpark} />
        <StatCard label="// Sessions" num="142" delta="▲ 12% wk" />
        <StatCard label="// Open issues" num="23" cap="7 in review" />
        <StatCard label="// Throughput" num="98" spark={sampleSpark} />
      </div>
      <Row label="// SPARKLINE · STANDALONE">
        <div className="w-40">
          <Sparkline values={sampleSpark} />
        </div>
      </Row>
    </Section>
  );
}

/* ───────────────── phone-frame demos ───────────────── */

function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div className="relative isolate flex h-[640px] w-full max-w-[380px] flex-col overflow-hidden rounded-[32px] border border-line-2 bg-bg [box-shadow:0_24px_48px_rgba(0,0,0,.5),0_0_0_4px_#050505]">
      {children}
    </div>
  );
}

function FloatNavSection() {
  return (
    <Section
      id="float-nav"
      title="Floating bottom nav"
      code="5.2 (I6)"
      description="Rounded square, 5 slots: 4 destinations + menu toggle. Active slot fills Iris with glow."
    >
      <PhoneFrame>
        <div className="flex-1 overflow-y-auto p-6">
          <Eyebrow tone="accent" withPulseDot>// FLOATING · I6</Eyebrow>
          <h3 className="mt-2 font-display text-3xl font-black leading-none tracking-tight">
            Tap a <span className="text-accent">slot.</span>
          </h3>
          <p className="mt-3 text-sm text-mute">
            Active state demoed below. In the lab shell these are wired to routes.
          </p>
        </div>
        <div className="absolute bottom-[18px] left-1/2 z-40 -translate-x-1/2">
          <FloatNav>
            <NavItem><Home /></NavItem>
            <NavItem><Flask /></NavItem>
            <NavItem active><Compass /></NavItem>
            <NavItem><Notes /></NavItem>
            <NavItem menuToggle><Dots /></NavItem>
          </FloatNav>
        </div>
      </PhoneFrame>
    </Section>
  );
}

function PopoverSection() {
  const menu = useDisclosure();
  return (
    <Section
      id="popover"
      title="Bento popover"
      code="5.3"
      description="Fixed-height popover; only the lab list scrolls internally. Tap the menu toggle (3 dots) to open."
    >
      <PhoneFrame>
        <div className="flex-1 overflow-y-auto p-6">
          <Eyebrow tone="accent" withPulseDot>// BENTO · §5.3</Eyebrow>
          <h3 className="mt-2 font-display text-3xl font-black leading-none tracking-tight">
            Quick <span className="text-accent">access.</span>
          </h3>
          <p className="mt-3 text-sm text-mute">
            Account hero spans 2 cols. 6 action cells. Lab list is internal-scroll.
          </p>
        </div>

        <PopoverBackdrop
          open={menu.open}
          onClick={menu.onClose}
          className="absolute inset-0 z-30"
        />
        <MenuPopover
          open={menu.open}
          onClose={menu.onClose}
          className="absolute inset-x-3.5 bottom-[78px] z-50"
          grid={
            <>
              <AccountMenuCell initials="JR" name="Josh Roxby" email="josh@exhale.studio">
                <AccountSubCta label="About" icon={<Help />} />
                <AccountSubCta label="Instagram" icon={<Instagram />} />
                <AccountSubCta label="Email" icon={<Mail />} />
              </AccountMenuCell>
              <ActionMenuCell eyebrow="// 03" icon={<SettingsIcon />} label="Settings" />
              <ActionMenuCell eyebrow="// 04" icon={<Search />} label="Search" />
              <ActionMenuCell eyebrow="// 05" icon={<Plus />} label="New note" />
              <ActionMenuCell eyebrow="// 06" icon={<Mail />} label="Contact" />
              <ActionMenuCell eyebrow="// 07" icon={<SignOut />} label="Sign out" />
              <ActionMenuCell eyebrow="// 08" icon={<Theme />} label="Theme" />
              <ActionMenuCell eyebrow="// 09" icon={<Help />} label="Help" />
            </>
          }
          list={
            <MenuListCell title="// LAB · ALL PAGES" count={4}>
              <MenuListItem label="Visual Intelligence" meta="v0.3" />
              <MenuListItem label="Artist Model" meta="draft" />
              <MenuListItem label="Extensions" meta="3 live" />
              <MenuListItem label="Hello (reference)" meta="hello" />
            </MenuListCell>
          }
        />

        <div className="absolute bottom-[18px] left-1/2 z-40 -translate-x-1/2">
          <FloatNav>
            <NavItem onClick={menu.onClose}><Home /></NavItem>
            <NavItem onClick={menu.onClose}><Flask /></NavItem>
            <NavItem onClick={menu.onClose}><Compass /></NavItem>
            <NavItem onClick={menu.onClose}><Notes /></NavItem>
            <NavItem menuToggle open={menu.open} onClick={menu.onToggle}>
              {menu.open ? <Close /> : <Dots />}
            </NavItem>
          </FloatNav>
        </div>
      </PhoneFrame>
    </Section>
  );
}

function ModalSection() {
  const m = useDisclosure();
  return (
    <Section
      id="modal"
      title="Modal"
      code="3.5"
      description="Generic modal. Opaque surface (rgba(17,17,17,.98)) with blur(24px), dim+blur backdrop. Esc and backdrop close."
    >
      <Row label="// TRIGGER">
        <Button onClick={m.onOpen}>Open modal</Button>
        <Modal
          open={m.open}
          onClose={m.onClose}
          eyebrow="// MODAL · DEMO"
          title="A modal."
        >
          <p className="text-sm text-ink-2">
            Modals are for focused, transient actions. Confirmations, single-task forms,
            content that benefits from focus.
          </p>
          <p className="mt-3 text-sm text-mute">
            Press Esc, click the backdrop, or hit the close button to dismiss.
          </p>
        </Modal>
      </Row>
    </Section>
  );
}

const sampleRipPrompt = `# Demo. Rip prompt

Paste this into Claude to scaffold a similar small project.

---

I'd like to scaffold a small example inside an existing Next.js (App Router) +
TypeScript + Tailwind monorepo, following these conventions:

1. Project lives under /projects/<slug>/ with index.ts, meta.ts, page.tsx,
   TODO.md, README.md, and RIP.md.
2. Public exports are Page and meta.
3. meta starts wip: true with no version.
4. Register the project in /projects/registry.ts.
5. Use existing primitives from @/components/ui (no rebuild).

Generate the files now.`;

function RipSection() {
  return (
    <Section
      id="rip"
      title="Rip button + modal"
      description="Circular rip button opens a project's Claude prompt with a copy-to-clipboard, plus a generic 'How do I use this' guide."
    >
      <Row label="// SIZES">
        <RipButton
          size="sm"
          projectName="Demo"
          projectSlug="demo"
          promptContent={sampleRipPrompt}
        />
        <RipButton
          size="md"
          projectName="Demo"
          projectSlug="demo"
          promptContent={sampleRipPrompt}
        />
      </Row>
      <Row label="// EMPTY (NO PROMPT, RENDERS NOTHING)">
        <RipButton
          projectName="Demo"
          projectSlug="demo"
          promptContent={null}
        />
        <span className="font-mono text-[10px] text-mute-3">// hidden when promptContent is null</span>
      </Row>
    </Section>
  );
}

/* ───────────────── inline icons ───────────────── */

const sw = { width: 16, height: 16, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.8 } as const;
const sw2 = { width: 17, height: 17, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.8 } as const;

function Chevron() { return <svg {...sw}><path d="M9 18l6-6-6-6" /></svg>; }
function Plus() { return <svg {...sw}><path d="M12 5v14M5 12h14" /></svg>; }
function Search() { return <svg {...sw}><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>; }
function Bell() { return <svg {...sw}><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 01-3.46 0" /></svg>; }
function Home() { return <svg {...sw2}><path d="M3 12L12 3l9 9M5 10v10a1 1 0 001 1h4v-7h4v7h4a1 1 0 001-1V10" /></svg>; }
function Flask() { return <svg {...sw2}><path d="M9 3v6L3 21h18l-6-12V3" /><path d="M9 3h6" /></svg>; }
function Notes() { return <svg {...sw2}><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><path d="M14 2v6h6M16 13H8M16 17H8" /></svg>; }
function Compass() { return <svg {...sw2}><circle cx="12" cy="12" r="10" /><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" /></svg>; }
function Dots() { return <svg width={17} height={17} viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="6" r="1.5" /><circle cx="12" cy="12" r="1.5" /><circle cx="12" cy="18" r="1.5" /></svg>; }
function Close() { return <svg width={17} height={17} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><line x1="6" y1="6" x2="18" y2="18" /><line x1="6" y1="18" x2="18" y2="6" /></svg>; }
function Mail() { return <svg {...sw}><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>; }
function SignOut() { return <svg {...sw}><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" /></svg>; }
function Theme() { return <svg {...sw}><circle cx="12" cy="12" r="5" /><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" /></svg>; }
function Help() { return <svg {...sw}><circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3M12 17h.01" /></svg>; }
function Instagram() { return <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}><rect x="2" y="2" width="20" height="20" rx="5" /><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></svg>; }
function SettingsIcon() {
  return (
    <svg {...sw}>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
    </svg>
  );
}
