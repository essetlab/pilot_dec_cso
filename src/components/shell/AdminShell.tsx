import type { ReactNode } from "react";
import { ActionButton, StatusBadge } from "@/components/ui";
import { getAdminNav } from "@/lib/auth/navigation";
import type { AuthSession } from "@/lib/auth/session-codec";
import { cleanPresentationText } from "@/lib/presentation-text";
import { BrandMark } from "./BrandMark";
import { ShellNavigation } from "./ShellNavigation";
import { AdminMobileHeader } from "./AdminMobileHeader";

type AdminShellProps = {
  children: ReactNode;
  session?: AuthSession | null;
};

export function AdminNavigation({ session = null }: { session?: AuthSession | null }) {
  return (
    <ShellNavigation
      ariaLabel="Admin navigation"
      items={getAdminNav(session)}
      orientation="vertical"
      tone="admin"
    />
  );
}

export function AdminShell({ children, session = null }: AdminShellProps) {
  const navItems = getAdminNav(session);
  const visibleSectionCount = navItems.length;

  return (
    <div className="min-h-screen bg-light-bg text-dark-ink font-sans">
      {/* Mobile Top Header containing the slide-out navigation menu drawer */}
      <AdminMobileHeader session={session} items={navItems} />

      <div className="mx-auto grid max-w-screen-2xl lg:grid-cols-[280px_minmax(0,1fr)]">
        {/* Desktop Left Sidebar */}
        <aside className="sticky top-0 hidden h-screen border-r border-design-border bg-white-surface px-6 py-8 lg:block">
          <div className="flex h-full flex-col justify-between">
            <div className="space-y-8">
              {/* Brand Logo Identity */}
              <div className="pb-2">
                <BrandMark logoMode="mark" />
              </div>

              {/* Administrator operational role context */}
              <div className="rounded-card border border-design-border bg-soft-bg p-4.5 shadow-soft">
                <div className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-soft-teal animate-pulse" />
                  <StatusBadge label="Admin Operations" tone="blue" />
                </div>
                <p className="mt-2.5 text-xs leading-relaxed text-muted-text">
                  Phase One controls for managing learners, organizations, courses, and certificates.
                </p>
              </div>

              {/* Vertical Navigation Links list */}
              <nav aria-label="Desktop admin navigation" className="space-y-1">
                <AdminNavigation session={session} />
              </nav>
            </div>

            {/* Bottom User Profile Section */}
            {session ? (
              <div className="border-t border-design-border pt-6 space-y-3">
                <div className="min-w-0 px-1">
                  <p className="truncate text-sm font-semibold text-dark-ink">
                    {cleanPresentationText(session.name)}
                  </p>
                  <p className="truncate text-xs text-muted-text font-bold uppercase tracking-wider mt-0.5">
                    {cleanPresentationText(session.roles?.[0] || "Administrator")}
                  </p>
                </div>
                <ActionButton
                  href="/sign-out"
                  prefetch={false}
                  size="sm"
                  variant="secondary"
                  className="w-full justify-center text-xs font-bold"
                >
                  Sign out
                </ActionButton>
              </div>
            ) : null}
          </div>
        </aside>

        {/* Primary Page Layout Workspace */}
        <div className="flex flex-col min-h-screen min-w-0">
          {/* Optional top layout bar on desktop to establish visual symmetry */}
          <header className="hidden h-16 w-full items-center justify-between border-b border-design-border bg-white-surface px-8 lg:flex">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-widest text-muted-text/80">
                CSO Learning Hub Console
              </span>
              <span className="text-xs text-muted-text/50">/</span>
              <span className="text-xs font-bold text-soft-teal bg-soft-teal/10 px-2 py-0.5 rounded-md">
                Admin Mode
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs text-muted-text">
              <span>Section Count:</span>
              <span className="font-bold text-dark-ink bg-soft-bg px-2.5 py-0.5 rounded-full border border-design-border">
                {visibleSectionCount}
              </span>
            </div>
          </header>

          <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8 max-w-6xl w-full mx-auto">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}

