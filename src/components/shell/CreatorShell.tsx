import type { ReactNode } from "react";
import { ActionButton, StatusBadge } from "@/components/ui";
import { canAccessCreator } from "@/lib/auth/permissions";
import type { AuthSession } from "@/lib/auth/session-codec";
import { cleanPresentationText } from "@/lib/presentation-text";
import { BrandMark } from "./BrandMark";
import { CreatorWorkflowNavigation } from "./CreatorWorkflowNavigation";

type CreatorShellProps = {
  children: ReactNode;
  session?: AuthSession | null;
};

export function CreatorNavigation({ session = null }: { session?: AuthSession | null }) {
  return (
    <CreatorWorkflowNavigation canAccess={canAccessCreator(session)} />
  );
}

export function CreatorShell({ children, session = null }: CreatorShellProps) {
  return (
    <div className="min-h-screen bg-light-bg text-dark-ink">
      <header className="border-b border-design-border bg-white-surface">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-5 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap items-center gap-4">
              <BrandMark />
              <StatusBadge label="Course Creator Workspace" tone="blue" />
            </div>
            <div className="flex flex-wrap items-center gap-3">
              {session ? (
                <>
                  <span className="text-sm font-medium text-muted-text">
                    {cleanPresentationText(session.name)}
                  </span>
                  <ActionButton href="/sign-out" size="sm" variant="secondary">
                    Sign out
                  </ActionButton>
                </>
              ) : null}
            </div>
          </div>
          <div className="rounded-panel border border-design-border bg-soft-bg p-2 shadow-soft">
            <CreatorNavigation session={session} />
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">{children}</main>
    </div>
  );
}
