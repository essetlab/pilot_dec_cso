import type { ReactNode } from "react";
import { ActionButton, StatusBadge } from "@/components/ui";
import { getAdminNav } from "@/lib/auth/navigation";
import type { AuthSession } from "@/lib/auth/session-codec";
import { cleanPresentationText } from "@/lib/presentation-text";
import { BrandMark } from "./BrandMark";
import { ShellNavigation } from "./ShellNavigation";

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
    <div className="min-h-screen bg-light-bg text-dark-ink">
      <header className="border-b border-design-border bg-white-surface shadow-soft lg:hidden">
        <div className="flex flex-col gap-4 px-4 py-5 sm:px-6">
          <div className="flex items-center justify-between gap-3">
            <BrandMark compact />
            {session ? (
              <ActionButton href="/sign-out" size="sm" variant="secondary">
                Sign out
              </ActionButton>
            ) : null}
          </div>
          <div className="rounded-[18px] border border-design-border bg-soft-bg p-4">
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge label="Admin operations" tone="blue" />
              <StatusBadge label={`${visibleSectionCount} sections`} tone="gray" />
            </div>
            <p className="mt-3 text-sm leading-6 text-muted-text">
              Manage Phase 1 learning operations, review, certificates, and
              platform records.
            </p>
          </div>
          <ShellNavigation
            ariaLabel="Admin navigation"
            items={navItems}
            tone="admin"
          />
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl lg:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="sticky top-0 hidden h-screen border-r border-design-border bg-white-surface px-5 py-6 lg:block">
          <div className="flex h-full flex-col gap-6">
            <BrandMark />
            <div className="rounded-[20px] border border-design-border bg-soft-bg p-4">
              <div className="flex flex-wrap items-center gap-2">
                <StatusBadge label="Admin operations" tone="blue" />
                <StatusBadge label={`${visibleSectionCount} sections`} tone="gray" />
              </div>
              <p className="mt-3 text-sm leading-6 text-muted-text">
                Phase 1 platform controls for users, courses, review, and
                learning operations.
              </p>
            </div>
            <AdminNavigation session={session} />
            <div className="mt-auto space-y-3 border-t border-design-border pt-5">
              {session ? (
                <>
                  <p className="text-sm font-medium text-muted-text">
                    {cleanPresentationText(session.name)}
                  </p>
                  <ActionButton href="/sign-out" size="sm" variant="secondary">
                    Sign out
                  </ActionButton>
                </>
              ) : null}
            </div>
          </div>
        </aside>
        <main className="min-w-0 px-4 py-8 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
