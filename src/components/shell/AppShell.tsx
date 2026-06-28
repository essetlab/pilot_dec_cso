import Link from "next/link";
import type { ReactNode } from "react";
import { ROLE_LABELS } from "@/lib/auth/roles";
import type { AuthSession } from "@/lib/auth/session-codec";
import { cleanPresentationText } from "@/lib/presentation-text";
import type { NavItem } from "@/lib/routes";

type AppShellProps = {
  children: ReactNode;
  eyebrow: string;
  title: string;
  description: string;
  navItems: NavItem[];
  session?: AuthSession | null;
  tone?: "public" | "auth" | "learner" | "creator" | "admin";
};

const toneClasses = {
  public: "border-dec-blue/25 bg-dec-blue/10 text-dec-blue",
  auth: "border-dec-blue/25 bg-dec-blue/10 text-dec-blue",
  learner: "border-dec-green/35 bg-dec-green/15 text-[#426f1c]",
  creator: "border-dec-blue/25 bg-dec-blue/10 text-dec-blue",
  admin: "border-design-border bg-soft-bg text-deep-navy",
};

export function AppShell({
  children,
  eyebrow,
  title,
  description,
  navItems,
  session = null,
  tone = "public",
}: AppShellProps) {
  return (
    <div className="min-h-screen bg-light-bg text-dark-ink">
      <header className="border-b border-design-border bg-white-surface">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p
              className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] ${toneClasses[tone]}`}
            >
              {eyebrow}
            </p>
            <h1 className="mt-3 text-2xl font-semibold text-dark-ink">
              {title}
            </h1>
            <p className="mt-1 max-w-3xl text-sm leading-6 text-muted-text">
              {description}
            </p>
          </div>
          <nav aria-label={`${title} navigation`}>
            <ul className="flex flex-wrap justify-start gap-2 lg:justify-end">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    className="inline-flex rounded-control border border-design-border bg-white-surface px-3 py-2 text-sm font-medium text-dark-ink shadow-soft transition hover:border-dec-blue hover:text-dec-blue focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dec-blue focus-visible:ring-4 focus-visible:ring-dec-blue/25"
                    href={item.href}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              {session ? (
                <li>
                  <Link
                    className="inline-flex rounded-control border border-design-border bg-soft-bg px-3 py-2 text-sm font-medium text-dark-ink shadow-soft transition hover:border-dec-blue hover:text-dec-blue focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dec-blue focus-visible:ring-4 focus-visible:ring-dec-blue/25"
                    href="/sign-out"
                  >
                    Sign out
                  </Link>
                </li>
              ) : null}
            </ul>
            {session ? (
              <p className="mt-3 text-right text-xs text-muted-text">
                Signed in as {cleanPresentationText(session.name)} ·{" "}
                {session.roles.map((role) => ROLE_LABELS[role]).join(", ")}
              </p>
            ) : null}
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-6 py-8">{children}</main>
    </div>
  );
}
