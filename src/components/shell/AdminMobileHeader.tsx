"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cleanPresentationText } from "@/lib/presentation-text";
import { BrandMark } from "./BrandMark";
import type { AuthSession } from "@/lib/auth/session-codec";
import type { NavItem } from "@/lib/routes";
import { cx } from "@/components/ui/utils";

type AdminMobileHeaderProps = {
  session?: AuthSession | null;
  items: NavItem[];
};

export function AdminMobileHeader({ session = null, items }: AdminMobileHeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);

  // Toggle drawer open state
  const toggleMenu = () => setIsOpen((prev) => !prev);

  // Handle ESC key press and body overflow scroll-lock
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      // Auto focus the close button when drawer opens for a logical keyboard tab starting point
      setTimeout(() => {
        closeButtonRef.current?.focus();
      }, 50);
    } else {
      document.body.style.overflow = "";
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  // Handle focus return when clicking or programmatic closing
  const handleClose = () => {
    setIsOpen(false);
    triggerRef.current?.focus();
  };

  // Helper to calculate active navigation item state
  const isActive = (itemHref: string) => {
    if (itemHref === "/admin") {
      return pathname === "/admin";
    }
    return pathname === itemHref || pathname.startsWith(`${itemHref}/`);
  };

  return (
    <>
      {/* Mobile Top Header */}
      <header className="flex h-16 w-full items-center justify-between border-b border-design-border bg-white-surface px-4 shadow-soft lg:hidden">
        <BrandMark compact logoMode="mark" />

        <div className="flex items-center gap-2">
          <button
            ref={triggerRef}
            onClick={toggleMenu}
            aria-expanded={isOpen}
            aria-controls="admin-mobile-drawer"
            aria-label="Open administration navigation menu"
            className="inline-flex h-10 items-center justify-center rounded-control border border-design-border bg-white-surface px-3 py-2 text-sm font-semibold text-dark-ink transition-colors hover:bg-soft-bg hover:text-soft-teal focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-soft-teal focus-visible:ring-4 focus-visible:ring-soft-teal/25"
          >
            <svg
              className="mr-1.5 h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            Menu
          </button>
        </div>
      </header>

      {/* Drawer Overlay & Content Container */}
      {isOpen && (
        <div
          id="admin-mobile-drawer"
          className="fixed inset-0 z-50 flex justify-end lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Administration navigation menu"
        >
          {/* Backdrop layer */}
          <div
            onClick={handleClose}
            className="fixed inset-0 bg-deep-navy/40 backdrop-blur-sm transition-opacity duration-300"
            aria-hidden="true"
          />

          {/* Drawer slide-out panel */}
          <div
            ref={drawerRef}
            className="relative flex h-full w-[280px] max-w-full flex-col bg-white-surface shadow-card transition-transform duration-300 ease-out"
          >
            {/* Drawer Header Block */}
            <div className="flex h-16 items-center justify-between border-b border-design-border px-4">
              <BrandMark compact logoMode="mark" />
              <button
                ref={closeButtonRef}
                onClick={handleClose}
                aria-label="Close navigation menu"
                className="inline-flex h-10 w-10 items-center justify-center rounded-control border border-design-border bg-white-surface text-dark-ink transition-colors hover:bg-soft-bg hover:text-soft-teal focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-soft-teal focus-visible:ring-4 focus-visible:ring-soft-teal/25"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Context operations banner */}
            <div className="border-b border-design-border bg-soft-bg px-4 py-3">
              <span className="inline-flex items-center rounded-full bg-soft-teal/10 px-2.5 py-0.5 text-xs font-semibold text-soft-teal">
                Admin operations
              </span>
              <p className="mt-1.5 text-xs text-muted-text">
                Manage Phase One learners, organizations, courses, and platform records.
              </p>
            </div>

            {/* Navigation links block */}
            <nav className="flex-1 overflow-y-auto px-3 py-4">
              <ul className="space-y-1.5">
                {items.map((item) => {
                  const active = isActive(item.href);
                  return (
                    <li key={`${item.href}-${item.label}`}>
                      <Link
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        aria-current={active ? "page" : undefined}
                        className={cx(
                          "flex min-h-10 items-center rounded-control border px-3 py-2 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-soft-teal",
                          active
                            ? "border-soft-teal bg-soft-teal text-white shadow-soft"
                            : "border-transparent text-dark-ink hover:border-soft-teal/20 hover:bg-soft-bg hover:text-soft-teal"
                        )}
                      >
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>

            {/* Bottom Account & Actions Bar */}
            {session && (
              <div className="border-t border-design-border px-4 py-5 space-y-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-dark-ink">
                    {cleanPresentationText(session.name)}
                  </p>
                  <p className="truncate text-xs text-muted-text uppercase tracking-wider font-bold mt-0.5">
                    {cleanPresentationText(session.roles?.[0] || "Administrator")}
                  </p>
                </div>
                <Link
                  href="/sign-out"
                  prefetch={false}
                  className="flex min-h-10 w-full items-center justify-center rounded-control border border-design-border bg-white-surface text-sm font-semibold text-dark-ink hover:bg-soft-bg hover:text-soft-teal transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-soft-teal"
                >
                  Sign out
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
