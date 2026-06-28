import type { ReactNode } from "react";
import { ActionButton, StatusBadge } from "@/components/ui";
import { getLearnerNav } from "@/lib/auth/navigation";
import type { AuthSession } from "@/lib/auth/session-codec";
import { cleanPresentationText } from "@/lib/presentation-text";
import { BrandMark } from "./BrandMark";
import { ShellNavigation } from "./ShellNavigation";

type LearnerShellProps = {
  children: ReactNode;
  session?: AuthSession | null;
};

export function LearnerNavigation() {
  return (
    <ShellNavigation
      ariaLabel="Learner navigation"
      items={getLearnerNav()}
      tone="learner"
    />
  );
}

export function LearnerShell({ children, session = null }: LearnerShellProps) {
  return (
    <div className="min-h-screen bg-light-bg text-dark-ink">
      <header className="border-b border-design-border bg-white-surface">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-5 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4">
              <BrandMark />
              <StatusBadge label="Learning" tone="green" />
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
          <LearnerNavigation />
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">{children}</main>
    </div>
  );
}
