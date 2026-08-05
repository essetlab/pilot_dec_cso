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

const footerSupportLinks: NavItem[] = [
  { href: "/support", label: "Help / Support" },
  { href: "/verify-certificate", label: "Verify certificate" },
];

const footerPolicyLinks: NavItem[] = [
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
];

const footerAccessibilityLinks: NavItem[] = [
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
      <ul className="flex items-center gap-6 xl:gap-8">
        {publicItems.map((item) => {
          const active = isActive(pathname, item);
          return (
            <li key={item.href}>
              <Link
                aria-current={active ? "page" : undefined}
                className={cx(
                  "relative flex min-h-11 items-center rounded-lg px-2 text-[0.9rem] font-medium tracking-[0.01em] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-soft-teal focus-visible:ring-offset-2",
                  isOverlay
                    ? "text-white/80 hover:text-white focus-visible:text-white"
                    : "text-slate-700 hover:text-dec-blue focus-visible:text-dec-blue",
                  active && "after:absolute after:inset-x-2 after:bottom-1 after:h-0.5 after:rounded-full",
                  active && (isOverlay ? "after:bg-dec-green text-white" : "after:bg-dec-blue text-dec-blue")
                )}
                href={item.href}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

function MobileNav({
  session,
  onClose,
  onKeyDown,
  panelRef,
}: {
  session?: AuthSession | null;
  onClose: () => void;
  onKeyDown: (event: ReactKeyboardEvent<HTMLDivElement>) => void;
  panelRef: React.RefObject<HTMLDivElement | null>;
}) {
  const pathname = usePathname();
  return (
    <div
      aria-label="Main menu"
      aria-modal="true"
      className="border-t border-white/10 bg-[#071426]/95 backdrop-blur-md shadow-[0_24px_50px_rgba(7,20,38,0.4)] xl:hidden"
      onKeyDown={onKeyDown}
      ref={panelRef}
      role="dialog"
    >
      <nav aria-label="Mobile primary navigation" className="space-y-2 px-6 py-6">
        {publicItems.map((item) => {
          const active = isActive(pathname, item);
          return (
            <Link
              aria-current={active ? "page" : undefined}
              className={cx(
                "flex min-h-[44px] items-center rounded-xl px-4 text-base font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dec-green focus-visible:ring-offset-2",
                active ? "bg-white text-[#0f172a]" : "text-white hover:bg-white/10"
              )}
              href={item.href}
              key={item.href}
              onClick={onClose}
            >
              {item.label}
            </Link>
          );
        })}
        <div className="mt-6 grid gap-4 border-t border-white/10 pt-6">
          {session ? (
            <>
              <Link
                className="flex min-h-[44px] items-center rounded-xl px-4 font-medium text-white hover:bg-white/10 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dec-green"
                href="/learn"
                onClick={onClose}
              >
                My learning
              </Link>
              <Link
                className="flex min-h-[44px] items-center rounded-xl px-4 font-medium text-white hover:bg-white/10 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dec-green"
                href="/sign-out"
                onClick={onClose}
                prefetch={false}
              >
                Sign out
              </Link>
            </>
          ) : (
            <>
              <Link
                className="flex min-h-[44px] items-center rounded-xl px-4 font-medium text-white hover:bg-white/10 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dec-green"
                href="/sign-in"
                onClick={onClose}
              >
                Sign in
              </Link>
              <Link
                className="flex min-h-[48px] items-center justify-center rounded-xl bg-[#1679b0] px-4 font-semibold tracking-[-0.01em] text-white transition-all hover:bg-[#115f8b] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dec-green"
                href="/register"
                onClick={onClose}
              >
                Register
              </Link>
            </>
          )}
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
    const focusable = Array.from(mobilePanelRef.current?.querySelectorAll<HTMLElement>("a,button") ?? []).filter(
      (element) => !element.hasAttribute("disabled")
    );
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
    <header
      className={cx(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        isOverlay
          ? "text-white"
          : "border-b border-[#cad5df] bg-white text-[#0f172a] shadow-[0_8px_24px_rgba(15,23,42,0.06)]"
      )}
      style={isOverlay ? { background: "linear-gradient(90deg,rgba(7,20,38,.98),rgba(7,20,38,.86) 55%,rgba(7,20,38,.45))" } : undefined}
    >
      <div
        className={cx(
          "mx-auto flex min-h-[72px] w-full items-center justify-between gap-5 px-5 sm:px-7",
          isHome ? "max-w-none lg:px-[clamp(3rem,5vw,6rem)]" : "max-w-[1200px] lg:px-10",
        )}
      >
        <Link
          aria-label="CSO Learning Hub home"
          className="flex min-h-11 shrink-0 items-center gap-3 rounded-lg p-1 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-soft-teal focus-visible:ring-offset-2"
          href="/"
        >
          <Image
            alt="Development Expertise Center Logo"
            className="h-8 w-auto object-contain"
            height={32}
            priority
            src="/logos/dec-logo.png"
            width={88}
          />
          <div className={cx("h-5 w-px self-center", isOverlay ? "bg-white/25" : "bg-[#cad5df]")} />
          <span className="font-sans text-[0.84rem] font-extrabold uppercase tracking-[0.07em]">
            CSO Learning Hub
          </span>
        </Link>
        
        <div className="hidden flex-1 items-center justify-end gap-6 xl:flex">
          <PublicNav isOverlay={isOverlay} />
          <span aria-hidden="true" className={cx("h-6 w-px", isOverlay ? "bg-white/20" : "bg-[#cad5df]")} />
          {session ? (
            <>
              <Link
                className={cx(
                  "flex min-h-11 items-center rounded-lg px-3 text-[0.9rem] font-medium tracking-[0.005em] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-soft-teal",
                  isOverlay ? "text-white hover:text-white/80" : "text-[#0f172a] hover:text-dec-blue"
                )}
                href="/learn"
              >
                My learning
              </Link>
              <Link
                className={cx(
                  "flex min-h-11 items-center rounded-lg px-3 text-[0.9rem] font-medium tracking-[0.005em] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-soft-teal",
                  isOverlay ? "text-white hover:text-white/80" : "text-[#0f172a] hover:text-dec-blue"
                )}
                href="/sign-out"
                prefetch={false}
              >
                Sign out
              </Link>
            </>
          ) : (
            <>
              <Link
                className={cx(
                  "flex min-h-11 items-center rounded-lg px-3 text-[0.9rem] font-medium tracking-[0.005em] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-soft-teal",
                  isOverlay ? "text-white hover:text-white/80" : "text-[#0f172a] hover:text-dec-blue"
                )}
                href="/sign-in"
              >
                Sign in
              </Link>
              <ActionButton href="/register" size="md">
                Register
              </ActionButton>
            </>
          )}
        </div>
        
        <button
          aria-controls="mobile-public-menu"
          aria-expanded={mobileOpen}
          aria-label={mobileOpen ? "Close main menu" : "Open main menu"}
          className={cx(
            "flex h-[44px] w-[44px] items-center justify-center rounded-xl border transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-soft-teal xl:hidden",
            isOverlay ? "border-white/30 bg-white/10 text-white" : "border-[#cad5df] bg-white text-[#0f172a]"
          )}
          onClick={() => setMobileOpen((open) => !open)}
          ref={menuButtonRef}
          type="button"
        >
          {mobileOpen ? <CloseIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
        </button>
      </div>
      <div id="mobile-public-menu">
        {mobileOpen ? (
          <MobileNav
            onClose={closeMenu}
            onKeyDown={handleMenuKeyDown}
            panelRef={mobilePanelRef}
            session={session}
          />
        ) : null}
      </div>
    </header>
  );
}

export function PublicFooter() {
  const currentYear = new Date().getFullYear();
  const footerGroups = [
    { heading: "Platform", links: footerPlatformLinks },
    { heading: "Account", links: footerAccountLinks },
    { heading: "Help & Support", links: footerSupportLinks },
    { heading: "Policies & Legal", links: footerPolicyLinks },
    { heading: "Accessibility", links: footerAccessibilityLinks },
  ];

  const footerLinkClassName = "inline-flex min-h-11 items-center rounded-lg px-2 text-[0.9rem] font-medium text-slate-300 underline-offset-4 transition-colors hover:text-white hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dec-green focus-visible:ring-offset-2 focus-visible:ring-offset-[#071426]";

  return (
    <footer className="mt-auto overflow-hidden bg-[#071426] text-white">
      <div className="mx-auto w-full max-w-[1280px] px-5 pb-10 pt-10 sm:px-7 sm:pb-12 sm:pt-12 lg:px-10 lg:pt-14">
        <div className="grid gap-12 border-b border-white/10 pb-12 lg:grid-cols-[minmax(17rem,0.78fr)_minmax(0,1.62fr)] lg:gap-16 lg:pb-14">
          <div className="max-w-md">
            <div className="relative h-14 w-[145px]">
              <Image
                alt="Development Expertise Center Logo"
                className="object-contain"
                fill
                sizes="145px"
                src="/logos/dec-logo.png"
              />
            </div>
            <h2 className="mt-6 font-display text-[2rem] font-bold leading-tight tracking-[-0.022em] text-white">CSO Learning Hub</h2>
            <p className="mt-4 max-w-sm text-[0.98rem] font-normal leading-7 text-slate-300">
              A practical digital learning platform for local and grassroots civil society organisations in Ethiopia.
            </p>
            <span aria-hidden="true" className="mt-7 block h-0.5 w-16 rounded-full bg-gradient-to-r from-dec-blue to-dec-green" />
          </div>

          <div className="grid grid-cols-2 gap-x-5 gap-y-9 sm:grid-cols-3 xl:grid-cols-5 xl:gap-x-6">
            {footerGroups.map((group) => (
              <nav aria-label={`${group.heading} links`} key={group.heading}>
                <h2 className="min-h-8 text-[0.68rem] font-extrabold uppercase leading-4 tracking-[0.16em] text-dec-green">
                  {group.heading}
                </h2>
                <ul className="mt-3 space-y-0.5">
                  {group.links.map((item) => (
                    <li key={item.href}>
                      <Link className={footerLinkClassName} href={item.href}>
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        <section aria-labelledby="partner-acknowledgement-title" className="pt-10 sm:pt-12">
          <div className="flex items-center gap-4">
            <h2 className="shrink-0 text-[0.7rem] font-extrabold uppercase tracking-[0.18em] text-[#9bd7f6]" id="partner-acknowledgement-title">
            Our partners &amp; donors
            </h2>
            <span aria-hidden="true" className="h-px flex-1 bg-gradient-to-r from-white/20 to-transparent" />
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-12">
            <div className="flex min-h-[132px] flex-col items-center justify-between rounded-2xl border border-white/10 bg-white px-3 py-4 shadow-[0_12px_28px_rgba(0,0,0,0.16)] lg:col-span-2">
              <p className="text-center text-[0.68rem] font-semibold leading-4 text-[#3f5061]">Funded by the European Union</p>
              <div className="mt-3 flex flex-1 items-center justify-center">
                <Image
                  alt="European Union"
                  className="h-12 w-auto max-w-full object-contain"
                  height={870}
                  loading="lazy"
                  src="/logos/eu-logo.png"
                  width={1807}
                />
              </div>
            </div>
            <div className="flex min-h-[132px] flex-col items-center justify-between rounded-2xl border border-white/10 bg-white px-3 py-4 shadow-[0_12px_28px_rgba(0,0,0,0.16)] lg:col-span-2">
              <p className="text-center text-[0.68rem] font-semibold leading-4 text-[#3f5061]">Coordinated by</p>
              <div className="mt-3 flex flex-1 items-center justify-center">
                <Image
                  alt="Welthungerhilfe"
                  className="h-11 w-auto max-w-full object-contain sm:h-12"
                  height={887}
                  loading="lazy"
                  src="/logos/whh-logo.png"
                  width={1774}
                />
              </div>
            </div>
            <div className="col-span-2 flex min-h-[132px] flex-col items-center justify-between rounded-2xl border border-white/10 bg-white px-4 py-4 shadow-[0_12px_28px_rgba(0,0,0,0.16)] lg:col-span-4">
              <p className="text-center text-[0.68rem] font-semibold leading-4 text-[#3f5061]">In Partnership with</p>
              <div className="mt-3 flex flex-1 flex-wrap items-center justify-center gap-x-4 gap-y-3 lg:flex-nowrap lg:gap-x-3">
                <Image alt="CoSAP" className="h-10 w-auto max-w-[90px] object-contain" height={887} loading="lazy" src="/logos/cosap-logo.png" width={1774} />
                <Image alt="Development Expertise Center" className="h-9 w-auto max-w-[92px] object-contain" height={481} loading="lazy" src="/logos/dec-logo.png" width={1000} />
                <Image alt="Pastoralist Forum Ethiopia" className="h-10 w-auto max-w-[120px] object-contain" height={724} loading="lazy" src="/logos/pfe-logo.png" width={2172} />
              </div>
            </div>
            <div className="flex min-h-[132px] flex-col items-center justify-between rounded-2xl border border-white/10 bg-white px-3 py-4 shadow-[0_12px_28px_rgba(0,0,0,0.16)] lg:col-span-2">
              <p className="text-center text-[0.68rem] font-semibold leading-4 text-[#3f5061]">With Technical Support of</p>
              <div className="mt-3 flex flex-1 items-center justify-center">
                <Image
                  alt="Civil Peace Service / ZFD"
                  className="h-10 w-auto max-w-full object-contain sm:h-11"
                  height={724}
                  loading="lazy"
                  src="/logos/zfd-logo.png"
                  width={2172}
                />
              </div>
            </div>
            <div className="flex min-h-[132px] flex-col items-center justify-between rounded-2xl border border-white/10 bg-white px-3 py-4 shadow-[0_12px_28px_rgba(0,0,0,0.16)] lg:col-span-2">
              <p className="text-center text-[0.68rem] font-medium leading-4 text-[#5f7183]">Platform and technical support by</p>
              <div className="mt-3 flex flex-1 items-center justify-center gap-2">
                <Image
                  alt="Medab Solutions"
                  className="h-12 w-auto object-contain"
                  height={876}
                  loading="lazy"
                  src="/logos/medab-solutions-logo.png"
                  width={589}
                />
                <p className="text-xs font-medium leading-4 text-[#5f7183]">Medab Solutions</p>
              </div>
            </div>
          </div>
        </section>

        <p className="mt-10 border-t border-white/10 pt-7 text-xs font-normal leading-5 text-slate-400">
          &copy; {currentYear} Development Expertise Center (DEC). All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export function PublicShell({ children, session = null }: PublicShellProps) {
  const pathname = usePathname();
  const isHome = pathname === "/";
  return (
    <div className="flex min-h-screen flex-col bg-light-bg text-dark-ink">
      <a
        className="fixed left-4 top-3 z-[60] -translate-y-24 rounded-lg bg-white px-4 py-3 font-semibold text-[#0f172a] shadow-lg transition-transform focus:translate-y-0 focus:outline-none focus:ring-2 focus:ring-dec-blue"
        href="#main-content"
      >
        Skip to main content
      </a>
      <PublicHeader session={session} />
      <main
        className={cx(
          "flex flex-1 flex-col",
          isHome ? "" : "mx-auto w-full max-w-[1200px] px-5 pb-10 pt-[104px] sm:px-7 lg:px-10"
        )}
        id="main-content"
      >
        {children}
      </main>
      <PublicFooter />
    </div>
  );
}
