import Link from "next/link";
import { InstallPrompt } from "@/components/pwa/install-prompt";

export default function LabLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative z-10 min-h-dvh">
      <header className="sticky top-0 z-20 border-b border-line bg-bg-2/95 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <Link
            href="/lab"
            className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-ink"
          >
            /lab
          </Link>
          <nav className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.18em] text-mute">
            <Link href="/" className="transition hover:text-ink">
              Portfolio
            </Link>
          </nav>
        </div>
      </header>
      <InstallPrompt />
      <div className="mx-auto max-w-5xl px-4 py-8">{children}</div>
    </div>
  );
}
