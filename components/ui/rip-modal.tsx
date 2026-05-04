"use client";

// Rip modal — shows a project's public Claude prompt with copy-to-clipboard,
// plus a generic "How do I use this" guide. The prompt content is loaded
// server-side from projects/<slug>/RIP.md and passed in as a string.

import { useState } from "react";
import { Modal } from "./modal";

export interface RipModalProps {
  open: boolean;
  onClose: () => void;
  projectName: string;
  projectSlug: string;
  promptContent: string;
}

export function RipModal({
  open,
  onClose,
  projectName,
  projectSlug,
  promptContent,
}: RipModalProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(promptContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard may be denied (insecure context, permissions). Silent fail.
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      eyebrow={`// RIP · ${projectSlug.toUpperCase()}`}
      title={`Rip ${projectName}.`}
    >
      <p className="text-sm text-ink-2">
        Copy this prompt into Claude or Claude Code to scaffold your own version.
        Adjust to your stack as needed.
      </p>

      <div className="mt-4 overflow-hidden rounded-sq border border-line-2 bg-bg-2">
        <div className="flex items-center justify-between border-b border-line bg-surface px-3 py-2">
          <span className="font-mono text-[9px] font-bold uppercase tracking-[0.22em] text-mute-2">
            // PROMPT
          </span>
          <button
            type="button"
            onClick={handleCopy}
            className="ds-interactive rounded-sq-xs border border-accent bg-accent px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-accent-on outline-none active:scale-[0.97] hover:bg-white hover:text-black hover:shadow-glow"
          >
            {copied ? "Copied ✓" : "Copy"}
          </button>
        </div>
        <pre className="max-h-[40vh] overflow-y-auto whitespace-pre-wrap break-words px-3 py-3 font-mono text-[12px] leading-relaxed text-ink-2 [scrollbar-color:var(--line-3)_transparent] [scrollbar-width:thin] [&::-webkit-scrollbar-thumb]:rounded-round [&::-webkit-scrollbar-thumb]:bg-line-3 [&::-webkit-scrollbar]:w-1">
          {promptContent}
        </pre>
      </div>

      <div className="my-6 h-px bg-line" />

      <div className="space-y-3">
        <div className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-mute-2">
          // HOW DO I USE THIS
        </div>
        <p className="text-sm text-ink-2">
          You'll need a basic familiarity with these tools — read the docs as you go.
          This isn't a tutorial; every project is different.
        </p>
        <ul className="space-y-1.5 text-sm text-ink-2 [&_a]:text-accent [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-white">
          <li>
            <strong className="text-ink">GitHub</strong> — somewhere to host your repo.{" "}
            <a href="https://docs.github.com" target="_blank" rel="noreferrer">docs</a>
          </li>
          <li>
            <strong className="text-ink">Claude / Claude Code</strong> — the assistant that
            builds it.{" "}
            <a href="https://docs.anthropic.com" target="_blank" rel="noreferrer">docs</a>
          </li>
          <li>
            <strong className="text-ink">Vercel</strong> — to deploy it.{" "}
            <a href="https://vercel.com/docs" target="_blank" rel="noreferrer">docs</a>
          </li>
          <li>
            <strong className="text-ink">Supabase</strong> — only if the project uses a
            database.{" "}
            <a href="https://supabase.com/docs" target="_blank" rel="noreferrer">docs</a>
          </li>
        </ul>
        <ol className="space-y-1.5 pt-2 text-sm text-ink-2">
          <li><span className="mr-1 font-mono text-accent">01</span>Open Claude or Claude Code in a fresh project.</li>
          <li><span className="mr-1 font-mono text-accent">02</span>Paste the prompt above.</li>
          <li><span className="mr-1 font-mono text-accent">03</span>Follow Claude's instructions; tweak to your stack.</li>
          <li><span className="mr-1 font-mono text-accent">04</span>Push to GitHub, deploy to Vercel.</li>
        </ol>
        <p className="pt-2 text-xs text-mute-2">
          Beyond these basics, do your own research — every project is different.
        </p>
      </div>
    </Modal>
  );
}
