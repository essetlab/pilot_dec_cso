"use client";

import type { ReactNode } from "react";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ActionButton } from "@/components/ui";
import type { AuthSession } from "@/lib/auth/session-codec";
import { cx } from "@/components/ui/utils";

type PublicShellProps = {
  children: ReactNode;
  session?: AuthSession | null;
};

type NavItem = {
  href: string;
  label: string;
  disabled?: boolean;
  exact?: boolean;
};

const publicItems: NavItem[] = [
  { href: "/", label: "HOME", exact: true },
  { href: "/about", label: "ABOUT", disabled: true },
  { href: "/catalog", label: "CATALOG", disabled: true },
  { href: "/courses", label: "COURSES" },
  { href: "/verify-certificate", label: "VERIFY CERTIFICATE", disabled: true },
];

/* ── Globe Icon ─────────────────────────────────────────── */
const GlobeIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 100-18 9 9 0 000 18z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.6 9h16.8M3.6 15h16.8" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3a15.3 15.3 0 014 9 15.3 15.3 0 01-4 9 15.3 15.3 0 01-4-9 15.3 15.3 0 014-9z" />
  </svg>
);

/* ── Chevron Icon ────────────────────────────────────────── */
const ChevronDownIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
  </svg>
);

/* ── Hamburger / Close Icons ──────────────────────────────── */
const MenuIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

const CloseIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

/* ── Navigation Links ───────────────────────────────────── */
function PublicNav({ isOverlay }: { isOverlay: boolean }) {
  const pathname = usePathname();

  return (
    <nav aria-label="Public navigation" className="min-w-0">
      <ul className="flex flex-wrap items-center gap-x-6 gap-y-2 xl:gap-x-8">
        {publicItems.map((item) => {
          const active = item.exact ? pathname === item.href : pathname.startsWith(item.href) && item.href !== "/";
          const itemColor = item.disabled
            ? isOverlay
              ? "rgba(255, 255, 255, 0.58)"
              : "#9ca3af"
            : isOverlay
              ? "#ffffff"
              : active
                ? "#0f172a"
                : "#4b5563";
          
          const itemClasses = cx(
            "rounded-full px-2 py-2 text-[13px] font-extrabold tracking-[0.12em] transition-colors",
            item.disabled 
              ? isOverlay
                ? "cursor-default text-white/60"
                : "cursor-default text-slate-400"
              : active
                ? isOverlay
                  ? "text-white"
                  : "text-deep-navy"
                : isOverlay
                  ? "text-white/90 hover:text-white"
                  : "text-slate-600 hover:text-deep-navy"
          );

          return (
            <li key={item.href}>
              {item.disabled ? (
                <span className={itemClasses} aria-disabled="true" style={{ color: itemColor }}>
                  {item.label}
                </span>
              ) : (
                <Link className={itemClasses} href={item.href} style={{ color: itemColor }}>
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

/* ── Mobile Navigation ───────────────────────────────────── */
function MobileNav({ session, onClose }: { session?: AuthSession | null; onClose: () => void }) {
  const pathname = usePathname();

  return (
    <div className="border-t border-white/15 bg-deep-navy/98 shadow-hero lg:hidden">
      <div className="px-4 py-4 space-y-1">
        {publicItems.map((item) => {
          const active = item.exact ? pathname === item.href : pathname.startsWith(item.href) && item.href !== "/";
          return (
            <div key={item.href}>
              {item.disabled ? (
                <span className="block cursor-default px-3 py-2.5 text-sm font-semibold tracking-wide text-white/55">
                  {item.label}
                </span>
              ) : (
                <Link
                  className={cx(
                    "block rounded-control px-3 py-2.5 text-sm font-semibold tracking-wide transition-colors",
                    active ? "bg-white text-deep-navy" : "text-white/90 hover:bg-white/10 hover:text-white"
                  )}
                  href={item.href}
                  onClick={onClose}
                >
                  {item.label}
                </Link>
              )}
            </div>
          );
        })}
        <div className="pt-3 mt-2 border-t border-white/10 flex flex-col gap-2">
          <div className="flex items-center gap-2 px-3 py-2 text-white/80">
            <GlobeIcon className="h-4 w-4" />
            <span className="text-sm font-semibold tracking-wide">ENGLISH</span>
          </div>
          {session ? (
            <Link
              href="/sign-out"
              className="block rounded-control px-3 py-2.5 text-sm font-semibold text-white/90 transition-colors hover:bg-white/10 hover:text-white"
              onClick={onClose}
            >
              SIGN OUT
            </Link>
          ) : (
            <>
              <Link
                href="/sign-in"
                className="block rounded-control px-3 py-2.5 text-sm font-semibold text-white/90 transition-colors hover:bg-white/10 hover:text-white"
                onClick={onClose}
              >
                SIGN IN
              </Link>
              <Link
                href="/register"
                className="block px-3 py-2.5 rounded-xl text-sm font-bold text-white bg-[#3b99d4] text-center hover:bg-[#2f88bf] transition-colors"
                onClick={onClose}
              >
                REGISTER
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Header ──────────────────────────────────────────────── */
export function PublicHeader({ session = null }: { session?: AuthSession | null }) {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll(); // initial check
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isOverlay = isHome && !scrolled;
  const headerBg = isOverlay
    ? "text-white"
    : "border-b border-design-border bg-white-surface text-slate-700 shadow-[0_8px_24px_rgb(15_23_42_/_0.12)]";
  const logoGlow = isOverlay
    ? "drop-shadow-[0_6px_18px_rgb(0_0_0_/_0.45)]"
    : "";
  const headerStyle = isOverlay
    ? {
        background:
          "linear-gradient(90deg, rgba(15, 23, 42, 0.96) 0%, rgba(15, 23, 42, 0.78) 48%, rgba(15, 23, 42, 0.28) 100%)",
      }
    : {
        backgroundColor: "#ffffff",
      };
  const mobileButtonStyle = isOverlay
    ? {
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        borderColor: "rgba(255, 255, 255, 0.25)",
        color: "#ffffff",
      }
    : {
        backgroundColor: "#ffffff",
        borderColor: "#e5e7eb",
        color: "#334155",
      };
  const languageStyle = isOverlay
    ? {
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        borderColor: "rgba(255, 255, 255, 0.25)",
        color: "#ffffff",
      }
    : {
        backgroundColor: "#ffffff",
        borderColor: "#e5e7eb",
        color: "#4b5563",
      };
  const authLinkStyle = {
    color: isOverlay ? "#ffffff" : "#374151",
  };

  return (
    <header 
      className={cx(
        "fixed left-0 right-0 top-0 z-50 transition-all duration-300",
        headerBg
      )}
      style={headerStyle}
    >
      <div className="mx-auto flex min-h-[72px] max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        
        {/* ── Left: Logo + Title ────────────────────────── */}
        <Link
          aria-label="Development Expertise Center home"
          className={cx(
            "relative h-12 shrink-0 transition-all duration-300 sm:h-14",
            logoGlow,
          )}
          href="/"
          style={{ width: "clamp(132px, 18vw, 154px)" }}
        >
          <Image
            alt="Development Expertise Center logo"
            className="object-contain"
            fill
            priority
            sizes="(min-width: 640px) 154px, 132px"
            src="/logos/dec-logo.png"
          />
        </Link>

        <div className="hidden min-w-0 flex-1 items-center justify-center lg:flex">
          <PublicNav isOverlay={isOverlay} />
        </div>

        {/* ── Right: Language, Auth, Actions ─────────────── */}
        <div className="hidden items-center gap-5 lg:flex">
          <button
            aria-label="Language: English"
            className={cx(
              "flex cursor-default items-center gap-2 rounded-full border px-5 py-2 text-[12px] font-extrabold uppercase tracking-[0.18em] transition-colors",
              isOverlay
                ? "border-white/25 bg-white/10 text-white shadow-[0_8px_22px_rgb(0_0_0_/_0.18)]"
                : "border-design-border bg-white text-slate-600 shadow-soft",
            )}
            style={languageStyle}
          >
            <GlobeIcon className="h-4.5 w-4.5" />
            <span>ENGLISH</span>
          </button>

          <div className={cx("h-7 w-px", isOverlay ? "bg-white/30" : "bg-slate-200")} />

          {session ? (
            <Link
              href="/sign-out"
              className={cx(
                "flex items-center gap-1 rounded-full px-2 py-1.5 text-[13px] font-extrabold uppercase tracking-[0.12em] transition-colors",
                isOverlay ? "text-white hover:bg-white/10" : "text-slate-700 hover:text-deep-navy",
              )}
              style={authLinkStyle}
            >
              SIGN OUT
              <ChevronDownIcon className="h-3.5 w-3.5 opacity-60" />
            </Link>
          ) : (
            <>
              <Link
                href="/sign-in"
                className={cx(
                  "flex items-center gap-1 rounded-full px-2 py-1.5 text-[13px] font-extrabold uppercase tracking-[0.12em] transition-colors",
                  isOverlay ? "text-white hover:bg-white/10" : "text-slate-700 hover:text-deep-navy",
                )}
                style={authLinkStyle}
              >
                SIGN IN
                <ChevronDownIcon className="h-3.5 w-3.5 opacity-60" />
              </Link>
              <ActionButton 
                href="/register" 
                size="md"
                className="rounded-control border-[#3b99d4] bg-[#3b99d4] px-7 text-[13px] font-extrabold uppercase tracking-[0.12em] text-white shadow-[0_10px_24px_rgb(59_153_212_/_0.28)] hover:border-[#2f88bf] hover:bg-[#2f88bf]"
              >
                REGISTER
              </ActionButton>
            </>
          )}
        </div>

        {/* ── Mobile hamburger ──────────────────────────── */}
        <button
          className={cx(
            "flex h-11 w-11 items-center justify-center rounded-control border shadow-soft transition-colors lg:hidden",
            isOverlay
              ? "border-white/25 bg-white/10 text-white hover:bg-white/20"
              : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
          )}
          style={mobileButtonStyle}
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
        >
          {mobileOpen ? <CloseIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
        </button>
      </div>

      {/* ── Mobile dropdown ───────────────────────────────── */}
      {mobileOpen && <MobileNav session={session} onClose={() => setMobileOpen(false)} />}
    </header>
  );
}

/* ── Footer ──────────────────────────────────────────────── */
export function PublicFooter() {
  return (
    <footer className="mt-auto flex flex-col">
      {/* Main Footer Content */}
      <div className="border-t border-slate-200 bg-deep-navy text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-16 pb-8">
          <div className="grid gap-12 lg:grid-cols-[2fr_1fr_1fr]">
            {/* Logo & Description */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="relative h-11 w-[92px] shrink-0 overflow-hidden rounded-control bg-white p-1">
                  <Image
                    alt="Development Expertise Center logo"
                    className="object-contain"
                    fill
                    sizes="92px"
                    src="/logos/dec-logo.png"
                  />
                </div>
                <p className="text-lg font-semibold leading-tight text-white">
                  CSO Learning Hub
                </p>
              </div>
              <p className="max-w-md text-sm leading-6 text-slate-300">
                The CSO Learning Hub is a practical digital learning platform for local and grassroots civil society organisations in Ethiopia.
              </p>
            </div>

            {/* Platform Links */}
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-white">Platform</h3>
              <ul className="mt-4 space-y-2 text-sm text-slate-300">
                <li>
                  <Link className="hover:text-white focus-visible:outline-dec-blue transition" href="/">
                    Home
                  </Link>
                </li>
                <li>
                  <span className="text-slate-500 cursor-default">About</span>
                </li>
                <li>
                  <Link className="hover:text-white focus-visible:outline-dec-blue transition" href="/courses">
                    Courses
                  </Link>
                </li>
                <li>
                  <span className="text-slate-500 cursor-default">Verify Certificate</span>
                </li>
              </ul>
            </div>

            {/* Account Links */}
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-white">Account</h3>
              <ul className="mt-4 space-y-2 text-sm text-slate-300">
                <li>
                  <Link className="hover:text-white focus-visible:outline-dec-blue transition" href="/sign-in">
                    Sign In
                  </Link>
                </li>
                <li>
                  <Link className="hover:text-white focus-visible:outline-dec-blue transition" href="/register">
                    Register
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom row */}
          <div className="mt-12 border-t border-white/10 pt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between text-xs text-slate-400">
            <p>© 2025 Development Expertise Center (DEC). All rights reserved.</p>
            <div className="flex gap-4">
              <span className="hover:text-white cursor-default">Privacy Policy</span>
              <span className="hover:text-white cursor-default">Terms of Service</span>
            </div>
          </div>
        </div>
      </div>

      {/* Full-width edge-to-edge Partner Logo Strip — sits at the very bottom */}
      <div className="w-full bg-slate-50 border-t border-slate-200">
        <div className="flex items-center justify-center gap-6 px-4 py-5 sm:px-6 lg:px-8">
          <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-slate-500 shrink-0 whitespace-nowrap">
            Our Partners &amp; Donors
          </p>
          <div className="h-5 w-px bg-slate-300 shrink-0 hidden sm:block" />
          <div className="flex-1 flex justify-center overflow-hidden">
            <Image
              alt="Programme partner logo strip — DEC, Welt Hunger Hilfe, CoSAP, Ziviler Friedensdienst, Pastoralist Forum Ethiopia, EU"
              className="h-auto max-h-10 w-full object-contain opacity-75 hover:opacity-100 transition-opacity duration-300"
              height={821}
              sizes="100vw"
              src="/logos/partner-logo-strip.png"
              width={1916}
            />
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ── Shell ────────────────────────────────────────────────── */
export function PublicShell({ children, session = null }: PublicShellProps) {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <div className="min-h-screen flex flex-col bg-light-bg text-dark-ink">
      <PublicHeader session={session} />
      <main className={cx("flex-1 flex flex-col", isHome ? "" : "pt-[72px] mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 w-full")}>
        {children}
      </main>
      <PublicFooter />
    </div>
  );
}
