"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { InstallPrompt } from "@/components/pwa/install-prompt";
import { useDisclosure } from "@/hooks/use-disclosure";
import { labProjects } from "@/projects/registry";
import {
  AccountMenuCell,
  ActionMenuCell,
  FloatNav,
  MenuListCell,
  MenuListItem,
  MenuPopover,
  NavItem,
  PopoverBackdrop,
} from "@/components/ui";

const navIcon = {
  home: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M3 12L12 3l9 9M5 10v10a1 1 0 001 1h4v-7h4v7h4a1 1 0 001-1V10" />
    </svg>
  ),
  lab: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M9 3v6L3 21h18l-6-12V3" />
      <path d="M9 3h6" />
    </svg>
  ),
  notes: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
      <path d="M14 2v6h6M16 13H8M16 17H8" />
    </svg>
  ),
  design: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="13.5" cy="6.5" r="1.5" />
      <circle cx="17.5" cy="10.5" r="1.5" />
      <circle cx="8.5" cy="7.5" r="1.5" />
      <circle cx="6.5" cy="12.5" r="1.5" />
      <path d="M12 2a10 10 0 100 20 4 4 0 000-8 2 2 0 010-4 4 4 0 004-4 10 10 0 00-4-4z" />
    </svg>
  ),
  dots: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
      <circle cx="12" cy="6" r="1.5" />
      <circle cx="12" cy="12" r="1.5" />
      <circle cx="12" cy="18" r="1.5" />
    </svg>
  ),
  close: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="6" y1="6" x2="18" y2="18" />
      <line x1="6" y1="18" x2="18" y2="6" />
    </svg>
  ),
};

const cellIcon = {
  settings: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
    </svg>
  ),
  search: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  ),
  plus: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 5v14M5 12h14" />
    </svg>
  ),
  mail: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  ),
  signout: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
    </svg>
  ),
  theme: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="5" />
      <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
    </svg>
  ),
  help: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3M12 17h.01" />
    </svg>
  ),
};

export default function LabLayout({ children }: { children: React.ReactNode }) {
  const menu = useDisclosure();
  const router = useRouter();
  const pathname = usePathname();

  const go = (href: string) => {
    menu.onClose();
    router.push(href);
  };

  return (
    <div className="relative isolate min-h-dvh">
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

      <main className="mx-auto max-w-5xl px-4 pb-32 pt-8">{children}</main>

      <PopoverBackdrop
        open={menu.open}
        onClick={menu.onClose}
        className="fixed inset-0 z-30"
      />

      <MenuPopover
        open={menu.open}
        onClose={menu.onClose}
        className="fixed inset-x-3.5 bottom-[78px] z-50 mx-auto max-w-md"
        grid={
          <>
            <AccountMenuCell
              initials="JR"
              name="Josh Roxby"
              email="josh@exhale.studio"
            />
            <ActionMenuCell
              eyebrow="// 03"
              icon={cellIcon.settings}
              label="Settings"
              onClick={menu.onClose}
            />
            <ActionMenuCell
              eyebrow="// 04"
              icon={cellIcon.search}
              label="Search"
              onClick={menu.onClose}
            />
            <ActionMenuCell
              eyebrow="// 05"
              icon={cellIcon.plus}
              label="New note"
              onClick={menu.onClose}
            />
            <ActionMenuCell
              eyebrow="// 06"
              icon={cellIcon.mail}
              label="Contact"
              onClick={menu.onClose}
            />
            <ActionMenuCell
              eyebrow="// 07"
              icon={cellIcon.signout}
              label="Sign out"
              onClick={menu.onClose}
            />
            <ActionMenuCell
              eyebrow="// 08"
              icon={cellIcon.theme}
              label="Theme"
              onClick={menu.onClose}
            />
            <ActionMenuCell
              eyebrow="// 09"
              icon={cellIcon.help}
              label="Help"
              onClick={menu.onClose}
            />
          </>
        }
        list={
          <MenuListCell title="// LAB · ALL PAGES" count={labProjects.length}>
            {labProjects.map((p) => (
              <MenuListItem
                key={p.slug}
                label={p.name}
                meta={p.slug}
                onClick={() => go(`/lab/${p.slug}`)}
              />
            ))}
          </MenuListCell>
        }
      />

      <div className="pointer-events-none fixed bottom-[18px] left-1/2 z-40 -translate-x-1/2">
        <FloatNav className="pointer-events-auto">
          <NavItem
            aria-label="Home"
            active={pathname === "/"}
            onClick={() => go("/")}
          >
            {navIcon.home}
          </NavItem>
          <NavItem
            aria-label="Lab"
            active={pathname === "/lab"}
            onClick={() => go("/lab")}
          >
            {navIcon.lab}
          </NavItem>
          <NavItem
            aria-label="Thinking"
            active={pathname === "/thinking"}
            onClick={() => go("/thinking")}
          >
            {navIcon.notes}
          </NavItem>
          <NavItem
            aria-label="Design system"
            active={pathname?.startsWith("/designsystem") ?? false}
            onClick={() => go("/designsystem")}
          >
            {navIcon.design}
          </NavItem>
          <NavItem
            aria-label={menu.open ? "Close menu" : "Open menu"}
            menuToggle
            open={menu.open}
            onClick={menu.onToggle}
          >
            {menu.open ? navIcon.close : navIcon.dots}
          </NavItem>
        </FloatNav>
      </div>
    </div>
  );
}
