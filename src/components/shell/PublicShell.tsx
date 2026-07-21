"use client";

import type { KeyboardEvent as ReactKeyboardEvent, ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ActionButton } from "@/components/ui";
import type { AuthSession } from "@/lib/auth/session-codec";
import { cx } from "@/components/ui/utils";

type PublicShellProps = { children: ReactNode; session?: AuthSession | null };
type NavItem = { href: string; label: string; exact?: boolean };

const publicItems: NavItem[] = [
  { href: "/", label: "Home", exact: true },
  { href: "/courses", label: "Courses" },
  { href: "/#how-the-hub-works", label: "How the Hub works" },
  { href: "/verify-certificate", label: "Verify certificate" },
];

const footerPlatformLinks: NavItem[] = [
  { href: "/", label: "Home" },
  { href: "/courses", label: "Courses" },
  { href: "/#how-the-hub-works", label: "How the Hub works" },
];

const footerAccountLinks: NavItem[] = [
  { href: "/sign-in", label: "Sign in" },
  { href: "/register", label: "Register" },
];

const footerTrustLinks: NavItem[] = [
  { href: "/support", label: "Help / Support" },
  { href: "/verify-certificate", label: "Verify certificate" },
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
  { href: "/accessibility", label: "Accessibility" },
];

const MenuIcon = ({ className }: { className?: string }) => (
  <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

const CloseIcon = ({ className }: { className?: string }) => (
  <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
  </svg>
);

function isActive(pathname: string, item: NavItem) {
  if (item.href.includes("#")) return false;
  return item.exact ? pathname === item.href : pathname.startsWith(item.href) && item.href !== "/";
}

function PublicNav({ isOverlay }: { isOverlay: boolean }) {
  const pathname = usePathname();
  return (
    <nav aria-label="Primary navigation">
      <ul className="flex items-center gap-5 xl:gap-7">
        {publicItems.map((item) => {
          const active = isActive(pathname, item);
          return (
            <li key={item.href}>
              <Link aria-current={active ? "page" : undefined} className={cx("relative flex min-h-11 items-center rounded-lg px-1 text-sm font-semibold transition-colors after:absolute after:inset-x-1 after:bottom-1 after:h-0.5 after:rounded-full", isOverlay ? "text-white/90 hover:text-white focus-visible:text-white" : "text-slate-700 hover:text-[#0b1f3a]", active ? "after:bg-[#72bee8]" : "after:bg-transparent")} href={item.href}>{item.label}</Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

function MobileNav({ session, onClose, onKeyDown, panelRef }: { session?: AuthSession | null; onClose: () => void; onKeyDown: (event: ReactKeyboardEvent<HTMLDivElement>) => void; panelRef: React.RefObject<HTMLDivElement | null> }) {
  const pathname = usePathname();
  return (
    <div aria-label="Main menu" aria-modal="true" className="border-t border-white/15 bg-[#071426] shadow-[0_24px_50px_rgba(7,20,38,0.28)] lg:hidden" onKeyDown={onKeyDown} ref={panelRef} role="dialog">
      <nav aria-label="Mobile primary navigation" className="space-y-1 px-5 py-5">
        {publicItems.map((item) => {
          const active = isActive(pathname, item);
          return <Link aria-current={active ? "page" : undefined} className={cx("flex min-h-11 items-center rounded-xl px-4 text-base font-semibold", active ? "bg-white text-[#0b1f3a]" : "text-white hover:bg-white/10")} href={item.href} key={item.href} onClick={onClose}>{item.label}</Link>;
        })}
        <div className="mt-4 grid gap-3 border-t border-white/15 pt-5">
          {session ? <><Link className="flex min-h-11 items-center rounded-xl px-4 font-semibold text-white hover:bg-white/10" href="/learn" onClick={onClose}>My learning</Link><Link className="flex min-h-11 items-center rounded-xl px-4 font-semibold text-white hover:bg-white/10" href="/sign-out" onClick={onClose} prefetch={false}>Sign out</Link></> : <><Link className="flex min-h-11 items-center rounded-xl px-4 font-semibold text-white hover:bg-white/10" href="/sign-in" onClick={onClose}>Sign in</Link><Link className="flex min-h-12 items-center justify-center rounded-xl bg-[#0878b9] px-4 font-bold text-white hover:bg-[#075e8e]" href="/register" onClick={onClose}>Register</Link></>}
        </div>
      </nav>
    </div>
  );
}

export function PublicHeader({ session = null }: { session?: AuthSession | null }) {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const mobilePanelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;
    const firstLink = mobilePanelRef.current?.querySelector<HTMLElement>("a");
    firstLink?.focus();
  }, [mobileOpen]);

  const closeMenu = () => {
    setMobileOpen(false);
    requestAnimationFrame(() => menuButtonRef.current?.focus());
  };

  const handleMenuKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape") {
      event.preventDefault();
      closeMenu();
      return;
    }
    if (event.key !== "Tab") return;
    const focusable = Array.from(mobilePanelRef.current?.querySelectorAll<HTMLElement>("a,button") ?? []).filter((element) => !element.hasAttribute("disabled"));
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  const isOverlay = isHome && !scrolled;
  return (
    <header className={cx("fixed inset-x-0 top-0 z-50 transition-colors duration-200", isOverlay ? "text-white" : "border-b border-[#cad5df] bg-white text-[#0b1f3a] shadow-[0_8px_24px_rgba(7,20,38,0.10)]")} style={isOverlay ? { background: "linear-gradient(90deg,rgba(7,20,38,.98),rgba(7,20,38,.86) 55%,rgba(7,20,38,.45))" } : undefined}>
      <div className="mx-auto flex min-h-[72px] max-w-[1200px] items-center justify-between gap-5 px-5 sm:px-7 lg:px-10">
        <Link aria-label="CSO Learning Hub home" className="relative h-11 w-[122px] shrink-0" href="/"><Image alt="Development Expertise Center" className="object-contain" fill priority sizes="122px" src="/logos/dec-logo.png" /></Link>
        <div className="hidden flex-1 items-center justify-end gap-5 lg:flex"><PublicNav isOverlay={isOverlay} /><span aria-hidden="true" className={cx("h-7 w-px", isOverlay ? "bg-white/25" : "bg-[#cad5df]")} />{session ? <><Link className="flex min-h-11 items-center rounded-lg px-2 text-sm font-semibold" href="/learn">My learning</Link><Link className="flex min-h-11 items-center rounded-lg px-2 text-sm font-semibold" href="/sign-out" prefetch={false}>Sign out</Link></> : <><Link className="flex min-h-11 items-center rounded-lg px-2 text-sm font-semibold" href="/sign-in">Sign in</Link><ActionButton href="/register" size="md">Register</ActionButton></>}</div>
        <button aria-controls="mobile-public-menu" aria-expanded={mobileOpen} aria-label={mobileOpen ? "Close main menu" : "Open main menu"} className={cx("flex h-12 w-12 items-center justify-center rounded-xl border lg:hidden", isOverlay ? "border-white/30 bg-white/10 text-white" : "border-[#cad5df] bg-white text-[#0b1f3a]")} onClick={() => setMobileOpen((open) => !open)} ref={menuButtonRef} type="button">{mobileOpen ? <CloseIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}</button>
      </div>
      <div id="mobile-public-menu">{mobileOpen ? <MobileNav onClose={closeMenu} onKeyDown={handleMenuKeyDown} panelRef={mobilePanelRef} session={session} /> : null}</div>
    </header>
  );
}

export function PublicFooter() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="mt-auto bg-[#071426] text-white">
      <div className="mx-auto max-w-[1200px] px-5 py-14 sm:px-7 lg:px-10">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.5fr_0.8fr_0.8fr_1fr]">
          <div><div className="relative h-12 w-[130px]"><Image alt="Development Expertise Center" className="object-contain" fill sizes="130px" src="/logos/dec-logo.png" /></div><h2 className="mt-5 text-xl font-bold text-white">CSO Learning Hub</h2><p className="mt-3 max-w-sm text-sm leading-7 text-slate-300">A practical digital learning platform for local and grassroots civil society organisations in Ethiopia.</p></div>
          {[{ heading: "Platform", links: footerPlatformLinks }, { heading: "Account", links: footerAccountLinks }, { heading: "Trust & Support", links: footerTrustLinks }].map((group) => <nav aria-label={`${group.heading} links`} key={group.heading}><h2 className="text-xs font-bold uppercase tracking-[0.14em] text-[#72bee8]">{group.heading}</h2><ul className="mt-4 space-y-1">{group.links.map((item) => <li key={item.href}><Link className="inline-flex min-h-11 items-center text-sm text-slate-300 underline-offset-4 hover:text-white hover:underline" href={item.href}>{item.label}</Link></li>)}</ul></nav>)}
        </div>
        <p className="mt-12 border-t border-white/15 pt-7 text-xs text-slate-400">© {currentYear} Development Expertise Center (DEC). All rights reserved.</p>
      </div>
      <div className="border-t border-[#cad5df] bg-white py-7">
        <div className="mx-auto max-w-[1200px] px-5 sm:px-7 lg:px-10"><p className="mb-5 text-xs font-bold uppercase tracking-[0.15em] text-[#3f5061]">Our partners &amp; donors</p><div className="overflow-x-auto" role="region" aria-label="Partner and donor acknowledgement"><div className="min-w-[760px]"><Image alt="Funding and programme partner logos: European Union, Welthungerhilfe, CoSAP, Development Expertise Center, Pastoralist Forum Ethiopia and Civil Peace Service." className="h-auto w-full" height={188} loading="lazy" sizes="(min-width: 1200px) 1200px, 100vw" src="/images/landing/partner-logo-strip.png" width={1429} /></div></div></div>
      </div>
    </footer>
  );
}

export function PublicShell({ children, session = null }: PublicShellProps) {
  const pathname = usePathname();
  const isHome = pathname === "/";
  return (
    <div className="flex min-h-screen flex-col bg-[#f7f8f5] text-[#14212e]">
      <a className="fixed left-4 top-3 z-[60] -translate-y-24 rounded-lg bg-white px-4 py-3 font-semibold text-[#0b1f3a] shadow-lg transition-transform focus:translate-y-0" href="#main-content">Skip to main content</a>
      <PublicHeader session={session} />
      <main className={cx("flex flex-1 flex-col", isHome ? "" : "mx-auto w-full max-w-[1200px] px-5 pb-10 pt-[104px] sm:px-7 lg:px-10")} id="main-content">{children}</main>
      <PublicFooter />
    </div>
  );
}
