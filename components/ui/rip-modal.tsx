"use client";

// Rip modal. Two-mode (Claude chat / Claude Code), single source of truth
// per project (projects/<slug>/RIP.md = project-specific content only). Modal
// assembles the full prompt via lib/rip-prompt.

import Link from "next/link";
import { useMemo, useState, type ReactNode } from "react";
import { Modal } from "./modal";
import { assembleRipPrompt, type RipMode } from "@/lib/rip-prompt";
import { cn } from "@/lib/cn";

export interface RipModalProps {
  open: boolean;
  onClose: () => void;
  projectName: string;
  projectSlug: string;
  /** Project-specific content from projects/<slug>/RIP.md. */
  promptContent: string;
}

export function RipModal({
  open,
  onClose,
  projectName,
  projectSlug,
  promptContent,
}: RipModalProps) {
  const [mode, setMode] = useState<RipMode>("code");
  const [copied, setCopied] = useState(false);

  const fullPrompt = useMemo(
    () => assembleRipPrompt(promptContent, mode),
    [promptContent, mode],
  );

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(fullPrompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard may be denied. Silent fail.
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      eyebrow={`// RIP · ${projectSlug.toUpperCase()}`}
      title={`Rip ${projectName}.`}
      className="max-w-3xl"
    >
      <p className="text-base text-ink-2">
        Want your own version of this? Copy the prompt, paste it into Claude, and
        you&apos;ll have something running in an hour or two. Pick where
        you&apos;ll paste it first.
      </p>

      <Step num="01" title="Where will you paste this?">
        <p className="text-sm text-mute">
          Both work. Pick the one that fits what you want.
        </p>
        <div className="grid gap-2 sm:grid-cols-2">
          <ModeCard
            active={mode === "chat"}
            onClick={() => setMode("chat")}
            title="Claude chat"
            sub="Quick preview"
            description="Get a single HTML artifact you can play with right inside the chat. Best for trying ideas fast."
          />
          <ModeCard
            active={mode === "code"}
            onClick={() => setMode("code")}
            title="Claude Code"
            sub="Real project"
            description="Scaffold a full Next.js project you can deploy. Best for shipping something real."
          />
        </div>
      </Step>

      <Step num="02" title="Copy the prompt.">
        <PromptBlock content={fullPrompt} mode={mode} onCopy={handleCopy} copied={copied} />
      </Step>

      <Step num="03" title="What next?">
        {mode === "chat" ? <ChatNext /> : <CodeNext />}
        <p className="pt-3 text-sm text-mute">
          New to any of this?{" "}
          <Link
            href="/help"
            className="text-accent underline underline-offset-4 hover:text-white"
            onClick={onClose}
          >
            Read the full walkthrough →
          </Link>
        </p>
      </Step>
    </Modal>
  );
}

/* ───────────── helpers ───────────── */

function Step({ num, title, children }: { num: string; title: string; children: ReactNode }) {
  return (
    <section className="mt-8 space-y-3">
      <header className="flex items-baseline gap-3">
        <span className="font-mono text-[10px] font-bold tracking-[0.22em] text-accent">
          // {num}
        </span>
        <h3 className="font-display text-xl font-bold tracking-tight text-ink">{title}</h3>
      </header>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

function ModeCard({
  active,
  onClick,
  title,
  sub,
  description,
}: {
  active: boolean;
  onClick: () => void;
  title: string;
  sub: string;
  description: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "ds-interactive flex flex-col gap-2 rounded-sq border p-4 text-left outline-none active:scale-[0.98]",
        active
          ? "border-accent bg-accent/10 shadow-glow"
          : "border-line-2 bg-surface-2 hover:border-line-3",
      )}
    >
      <div className="flex items-baseline justify-between gap-2">
        <span
          className={cn(
            "font-display text-lg font-bold uppercase tracking-tight",
            active ? "text-accent" : "text-ink",
          )}
        >
          {title}
        </span>
        <span className="font-mono text-[9px] font-semibold uppercase tracking-[0.18em] text-mute-2">
          {sub}
        </span>
      </div>
      <p className="text-[12px] leading-relaxed text-mute">{description}</p>
    </button>
  );
}

function PromptBlock({
  content,
  mode,
  onCopy,
  copied,
}: {
  content: string;
  mode: RipMode;
  onCopy: () => void;
  copied: boolean;
}) {
  return (
    <div className="overflow-hidden rounded-sq border border-line-2 bg-bg-2">
      <div className="flex items-center justify-between gap-3 border-b border-line bg-surface px-3.5 py-2.5">
        <span className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-mute-2">
          {mode === "chat" ? "// PROMPT · FOR CLAUDE.AI CHAT" : "// PROMPT · FOR CLAUDE CODE"}
        </span>
        <button
          type="button"
          onClick={onCopy}
          className="ds-interactive rounded-sq-xs border border-accent bg-accent px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-accent-on outline-none active:scale-[0.97] hover:bg-white hover:text-black hover:shadow-glow"
        >
          {copied ? "Copied ✓" : "Copy prompt"}
        </button>
      </div>
      <pre className="max-h-[40vh] overflow-y-auto whitespace-pre-wrap break-words px-4 py-4 font-mono text-[12px] leading-relaxed text-ink-2 [scrollbar-color:var(--line-3)_transparent] [scrollbar-width:thin] [&::-webkit-scrollbar-thumb]:rounded-round [&::-webkit-scrollbar-thumb]:bg-line-3 [&::-webkit-scrollbar]:w-1">
        {content}
      </pre>
    </div>
  );
}

function ChatNext() {
  return (
    <ol className="space-y-2 text-sm text-ink-2">
      <li className="flex gap-3">
        <span className="font-mono text-accent">01</span>
        <span>
          Open{" "}
          <a
            href="https://claude.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent underline underline-offset-4 hover:text-white"
          >
            claude.ai
          </a>{" "}
          and start a new chat.
        </span>
      </li>
      <li className="flex gap-3">
        <span className="font-mono text-accent">02</span>
        <span>Paste the prompt and send.</span>
      </li>
      <li className="flex gap-3">
        <span className="font-mono text-accent">03</span>
        <span>Wait for the artifact to render in the chat. You can preview it live.</span>
      </li>
      <li className="flex gap-3">
        <span className="font-mono text-accent">04</span>
        <span>Ask Claude to tweak anything you want changed.</span>
      </li>
    </ol>
  );
}

function CodeNext() {
  return (
    <ol className="space-y-2 text-sm text-ink-2">
      <li className="flex gap-3">
        <span className="font-mono text-accent">01</span>
        <span>Open Claude Code in a fresh project folder. An empty Next.js + TypeScript + Tailwind repo works best.</span>
      </li>
      <li className="flex gap-3">
        <span className="font-mono text-accent">02</span>
        <span>Paste the prompt.</span>
      </li>
      <li className="flex gap-3">
        <span className="font-mono text-accent">03</span>
        <span>Claude Code will read the prompt and ask before creating files. Approve to scaffold.</span>
      </li>
      <li className="flex gap-3">
        <span className="font-mono text-accent">04</span>
        <span>When it&apos;s done, push to GitHub and deploy to Vercel.</span>
      </li>
    </ol>
  );
}
