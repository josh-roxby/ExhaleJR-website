import Link from "next/link";
import { InstallPrompt } from "@/components/pwa/install-prompt";

export default function LabLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh">
      <header className="sticky top-0 z-10 border-b border-fg/10 bg-bg/80 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <Link href="/lab" className="font-mono text-sm">
            /lab
          </Link>
          <nav className="flex items-center gap-4 text-sm text-muted">
            <Link href="/" className="hover:text-fg">
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
