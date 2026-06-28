import Link from "next/link";
import { BrandMark } from "@/components/shell/BrandMark";
import { ActionButton, AlertMessage, StatusBadge } from "@/components/ui";
import { DEMO_USERS } from "@/lib/auth/demo-users";
import { ROLE_LABELS } from "@/lib/auth/roles";
import { DEMO_PROPOSAL_COURSE } from "@/lib/demo-data";
import { signInDemoUser, signInWithPassword } from "./actions";

type PageProps = {
  searchParams: Promise<{
    next?: string;
    error?: string;
    notice?: string;
  }>;
};

const roleDetails: Record<string, { focus: string; access: string; tone: "blue" | "green" | "gray" | "purple" | "gold" }> = {
  "super-admin": {
    access: "Full platform operations",
    focus: "Review platform management, publishing, certificates, and monitoring.",
    tone: "gold",
  },
  "platform-admin": {
    access: "Platform operations",
    focus: "Manage users, organizations, cohorts, courses, and monitoring.",
    tone: "blue",
  },
  "course-creator": {
    access: "Course authoring",
    focus: "Create courses, prepare learning content, and submit for review.",
    tone: "green",
  },
  "course-reviewer": {
    access: "Review and publishing",
    focus: "Check submitted courses and support publication decisions.",
    tone: "purple",
  },
  "me-viewer": {
    access: "Monitoring view",
    focus: "View learning participation and progress information.",
    tone: "gray",
  },
  participant: {
    access: "Learning area",
    focus: "Access courses, progress, certificates, and your learning profile.",
    tone: "green",
  },
};

export default async function SignInPage({ searchParams }: PageProps) {
  const { next, error, notice } = await searchParams;

  return (
    <section className="relative overflow-hidden rounded-[32px] border border-design-border bg-white-surface shadow-card">
      <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-dec-blue/10 blur-3xl" aria-hidden="true" />
      <div className="absolute bottom-0 left-10 h-64 w-64 rounded-full bg-dec-green/10 blur-3xl" aria-hidden="true" />

      <div className="relative grid gap-0 lg:grid-cols-[minmax(0,1.05fr)_minmax(360px,0.95fr)]">
        <div className="flex flex-col justify-between gap-10 bg-soft-bg px-6 py-8 sm:px-8 lg:px-10 lg:py-12">
          <div className="space-y-7">
            <BrandMark />
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-dec-blue">
                CSO Learning Hub
              </p>
              <h1 className="mt-4 font-display text-4xl font-semibold leading-tight text-deep-navy sm:text-5xl">
                Sign in to continue learning
              </h1>
              <p className="mt-5 text-base leading-8 text-muted-text sm:text-lg">
                Access your courses, progress, certificates, and role-specific workspace.
              </p>
            </div>
          </div>

          <div className="rounded-card border border-design-border bg-white p-5 shadow-soft">
            <p className="text-sm font-semibold text-dark-ink">
              If your organization is part of an active cohort, use the access option
              provided by your programme team.
            </p>
            <p className="mt-2 text-sm leading-6 text-muted-text">
              You can return to the course catalog at any time to explore available
              learning opportunities.
            </p>
            <ActionButton className="mt-4" href="/courses" variant="secondary">
              Back to Courses
            </ActionButton>
          </div>
        </div>

        <div className="bg-white px-6 py-8 sm:px-8 lg:px-10 lg:py-12">
          <div className="mx-auto max-w-xl">
            <div className="rounded-card border border-design-border bg-white-surface p-5 shadow-card sm:p-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-sm font-semibold text-dec-blue">
                    Sign in
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold text-deep-navy">
                    Use your staff credentials
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-muted-text">
                    Sign in with email and password after completing your invitation registration.
                  </p>
                </div>
                <StatusBadge label="Secure session" tone="blue" />
              </div>

              {notice === "registration-complete" ? (
                <div className="mt-5">
                  <AlertMessage tone="success" title="Registration complete">
                    Your password is ready. Sign in with your email and new password.
                  </AlertMessage>
                </div>
              ) : null}

              <form action={signInWithPassword} className="mt-6 grid gap-3 rounded-card border border-design-border bg-soft-bg p-4">
                <input name="next" type="hidden" value={next ?? ""} />
                <label className="text-sm font-semibold text-dark-ink">
                  Email
                  <input className="mt-2 min-h-11 w-full rounded-control border border-design-border bg-white px-4 text-sm text-dark-ink" name="email" required type="email" />
                </label>
                <label className="text-sm font-semibold text-dark-ink">
                  Password
                  <input className="mt-2 min-h-11 w-full rounded-control border border-design-border bg-white px-4 text-sm text-dark-ink" name="password" required type="password" />
                </label>
                <ActionButton type="submit">Sign In</ActionButton>
              </form>

              {error ? (
                <div className="mt-5">
                  <AlertMessage tone="error" title="Sign-in could not be completed">
                    Confirm your credentials and try again.
                  </AlertMessage>
                </div>
              ) : null}

              <div className="mt-6">
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-muted-text">
                  Quick role access
                </p>
              </div>
              <div className="grid gap-3">
                {DEMO_USERS.map((user) => {
                  const roleLabel = user.roles.map((role) => ROLE_LABELS[role]).join(", ");
                  const details = roleDetails[user.id];

                  return (
                    <form
                      action={signInDemoUser}
                      className="group rounded-card border border-design-border bg-white p-4 shadow-soft transition hover:-translate-y-0.5 hover:border-dec-blue/40 hover:shadow-card"
                      key={user.id}
                    >
                      <input name="userId" type="hidden" value={user.id} />
                      <input name="next" type="hidden" value={next ?? ""} />
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-base font-semibold text-dark-ink">
                              {roleLabel}
                            </h3>
                            {details ? (
                              <StatusBadge label={details.access} tone={details.tone} />
                            ) : null}
                          </div>
                          <p className="mt-2 text-sm leading-6 text-muted-text">
                            {details?.focus ?? user.description}
                          </p>
                        </div>
                        <ActionButton className="w-full sm:w-auto" type="submit">
                          Continue
                        </ActionButton>
                      </div>
                    </form>
                  );
                })}
              </div>
            </div>

            <div className="mt-6 overflow-hidden rounded-card border border-design-border bg-deep-navy text-white shadow-card">
              <div className="grid gap-4 p-5 sm:grid-cols-[1fr_auto] sm:items-center">
                <div>
                  <p className="text-sm font-semibold text-dec-green">
                    Learning preview
                  </p>
                  <h2 className="mt-2 text-xl font-semibold">
                    {DEMO_PROPOSAL_COURSE.shortTitle}
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-slate-200">
                    Continue practical lessons, track progress, and work toward
                    a certificate-ready course outcome.
                  </p>
                </div>
                <div className="rounded-2xl bg-white/10 p-4 text-center">
                  <p className="text-3xl font-semibold text-white">68%</p>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-[0.14em] text-slate-300">
                    Progress
                  </p>
                </div>
              </div>
              <div className="border-t border-white/10 bg-white/5 p-5">
                <div className="h-3 overflow-hidden rounded-full bg-white/15">
                  <div className="h-full w-[68%] rounded-full bg-dec-green" />
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <StatusBadge label="Mobile-friendly" tone="green" />
                  <StatusBadge label="Certificate-ready" tone="gold" />
                  <StatusBadge label="Step-by-step" tone="blue" />
                </div>
              </div>
            </div>

            <p className="mt-6 text-center text-sm text-muted-text">
              Need to browse first?{" "}
              <Link
                className="font-semibold text-dec-blue underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dec-blue"
                href="/courses"
              >
                Explore courses
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
