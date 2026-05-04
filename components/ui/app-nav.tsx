"use client";

// Persistent global app chrome: floating bottom nav (I6) + bento popover (§5.3).
//
// Three nav sections, divided by subtle pipes:
//   1. Primary  — Home, About (always visible). About is an anchor on /;
//                 from any other page it routes to /#about.
//   2. Secondary — page-injected via <NavSecondary> portal (optional)
//   3. Menu    — bento popover toggle (always visible)
//
// Mounted once at the root layout. Pages opt into the secondary slot by
// rendering <NavSecondary>{...NavItems}</NavSecondary>.

import { usePathname, useRouter } from "next/navigation";
import { useDisclosure } from "@/hooks/use-disclosure";
import { projects } from "@/projects/registry";
import { AccountMenuCell, AccountSubCta, ActionMenuCell } from "./menu-cell";
import { FloatNav } from "./float-nav";
import { MenuListCell, MenuListItem } from "./menu-list";
import { MenuPopover, PopoverBackdrop } from "./menu-popover";
import { NavItem } from "./nav-item";
import { useNavSlot } from "./nav-context";

export function AppNav() {
  const menu = useDisclosure();
  const router = useRouter();
  const pathname = usePathname();
  const { secondaryCount } = useNavSlot();

  const go = (href: string) => {
    menu.onClose();
    router.push(href);
  };

  // Smooth-scroll to a home-page anchor; fall back to navigation.
  const goAnchor = (id: string) => {
    menu.onClose();
    if (pathname === "/") {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      router.push(`/#${id}`);
    }
  };

  return (
    <>
      <PopoverBackdrop
        open={menu.open}
        onClick={menu.onClose}
        className="fixed inset-0 z-30"
      />
      <MenuPopover
        open={menu.open}
        onClose={menu.onClose}
        className="fixed inset-x-3.5 bottom-[calc(78px+env(safe-area-inset-bottom))] z-50 mx-auto max-w-md"
        grid={
          <>
            <AccountMenuCell initials="JR" name="Josh Roxby" email="josh@exhale.studio">
              <AccountSubCta
                label="About Josh"
                icon={icons.question}
                onClick={() => go("/about")}
              />
              <AccountSubCta
                label="Instagram @josh_roxby"
                icon={icons.instagram}
                href="https://instagram.com/josh_roxby"
                external
                onClick={menu.onClose}
              />
              <AccountSubCta
                label="Email josh@exhale.studio"
                icon={icons.mail}
                href="mailto:josh@exhale.studio"
                onClick={menu.onClose}
              />
            </AccountMenuCell>
            <ActionMenuCell
              eyebrow="// 02"
              icon={icons.flask}
              label="Drawing board"
              onClick={() => go("/drawingboard")}
            />
            <ActionMenuCell
              eyebrow="// 03"
              icon={icons.gallery}
              label="Gallery"
              onClick={() => go("/gallery")}
            />
            <ActionMenuCell
              eyebrow="// 04"
              icon={icons.notes}
              label="Thinking"
              onClick={() => go("/thinking")}
            />
            <ActionMenuCell
              eyebrow="// 05"
              icon={icons.mail}
              label="Contact"
              onClick={() => go("/contact")}
            />
            <ActionMenuCell
              eyebrow="// 06"
              icon={icons.signout}
              label="Sign out"
              onClick={menu.onClose}
            />
            <ActionMenuCell
              eyebrow="// 07"
              icon={icons.help}
              label="Help"
              onClick={menu.onClose}
            />
          </>
        }
        list={
          <MenuListCell title="// DRAWING BOARD · ALL PROJECTS" count={projects.length}>
            {projects.map((p) => (
              <MenuListItem
                key={p.slug}
                label={p.name}
                meta={p.slug}
                onClick={() => go(`/drawingboard/${p.slug}`)}
              />
            ))}
          </MenuListCell>
        }
      />

      <div className="pointer-events-none fixed bottom-[calc(18px+env(safe-area-inset-bottom))] left-1/2 z-40 -translate-x-1/2">
        <FloatNav className="pointer-events-auto">
          {/* Primary */}
          <NavItem
            aria-label="Home"
            active={pathname === "/"}
            onClick={() => go("/")}
          >
            {icons.home}
          </NavItem>
          <NavItem
            aria-label="About"
            active={pathname === "/about"}
            onClick={() => go("/about")}
          >
            {icons.user}
          </NavItem>

          {/* Secondary slot — pipes only render when something is in the slot */}
          {secondaryCount > 0 && <NavDivider />}
          <span id="nav-secondary-slot" className="contents" />
          {secondaryCount > 0 && <NavDivider />}

          {/* Menu */}
          {secondaryCount === 0 && <NavDivider />}
          <NavItem
            aria-label={menu.open ? "Close menu" : "Open menu"}
            menuToggle
            open={menu.open}
            onClick={menu.onToggle}
          >
            {menu.open ? icons.close : icons.dots}
          </NavItem>
        </FloatNav>
      </div>
    </>
  );
}

function NavDivider() {
  return <span aria-hidden className="mx-1 h-5 w-px self-center bg-line-3" />;
}

const sw = { width: 17, height: 17, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.8 } as const;
const swSm = { width: 16, height: 16, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.8 } as const;

const icons = {
  home: (
    <svg {...sw}>
      <path d="M3 12L12 3l9 9M5 10v10a1 1 0 001 1h4v-7h4v7h4a1 1 0 001-1V10" />
    </svg>
  ),
  user: (
    <svg {...sw}>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8" />
    </svg>
  ),
  flask: (
    <svg {...swSm}>
      <path d="M9 3v6L3 21h18l-6-12V3" />
      <path d="M9 3h6" />
    </svg>
  ),
  gallery: (
    <svg {...swSm}>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <polyline points="21,15 16,10 5,21" />
    </svg>
  ),
  notes: (
    <svg {...swSm}>
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
      <path d="M14 2v6h6M16 13H8M16 17H8" />
    </svg>
  ),
  mail: (
    <svg {...swSm}>
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  ),
  signout: (
    <svg {...swSm}>
      <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
    </svg>
  ),
  question: (
    <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3M12 17h.01" />
    </svg>
  ),
  instagram: (
    <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  ),
  help: (
    <svg {...swSm}>
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3M12 17h.01" />
    </svg>
  ),
  dots: (
    <svg width={17} height={17} viewBox="0 0 24 24" fill="currentColor">
      <circle cx="12" cy="6" r="1.5" />
      <circle cx="12" cy="12" r="1.5" />
      <circle cx="12" cy="18" r="1.5" />
    </svg>
  ),
  close: (
    <svg width={17} height={17} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <line x1="6" y1="6" x2="18" y2="18" />
      <line x1="6" y1="18" x2="18" y2="6" />
    </svg>
  ),
};
