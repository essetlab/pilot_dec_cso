import type { Metadata } from "next";
import { CourseInvitationAcceptance } from "@/components/public/CourseInvitationAcceptance";
import { StatusBadge } from "@/components/ui";
import { getCurrentSession } from "@/lib/auth/server";
import { getCourseInvitationToken } from "@/lib/course-invitation-session";
import { resolveCourseInvitationAcceptance } from "@/lib/course-invitation-workflow";
import Link from "next/link";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  referrer: "no-referrer",
  robots: { follow: false, index: false },
  title: "Accept course invitation | CSO Learning Hub",
};

type PageProps = {
  searchParams: Promise<{ state?: string; token?: string }>;
};

export default async function CourseInvitationAcceptPage({ searchParams }: PageProps) {
  const { state: requestedState, token: legacyToken = "" } = await searchParams;
  if (legacyToken) {
    redirect(`/course-invitations/start?token=${encodeURIComponent(legacyToken)}`);
  }
  const token = await getCourseInvitationToken();
  const session = await getCurrentSession();
  const resolution = token
    ? await resolveCourseInvitationAcceptance({ plaintextToken: token, session })
    : {
        state:
          requestedState === "cancelled" || requestedState === "expired"
            ? requestedState
            : "unavailable" as "cancelled" | "expired" | "unavailable",
        success: false as const,
      };
  const returnPath = "/course-invitations/reconcile";
  const showContext =
    resolution.success &&
    (resolution.state === "already-activated" ||
      resolution.authentication !== "mismatch");
  const isNewLearner =
    resolution.success &&
    resolution.state === "available" &&
    resolution.authentication === "required" &&
    resolution.accountState === "new";
  const isExistingLearner =
    resolution.success &&
    resolution.authentication === "required" &&
    (resolution.state === "already-activated" ||
      (resolution.state === "available" && resolution.accountState === "existing"));

  return (
    <div className="min-h-screen bg-light-bg flex flex-col lg:flex-row">
      {/* Left panel - Identity and Guidance */}
      <section className="hidden lg:flex lg:w-5/12 bg-deep-navy text-white p-12 flex-col justify-between relative overflow-hidden shrink-0">
        <div aria-hidden="true" className="absolute -right-16 -top-16 h-64 w-64 rounded-full border-[24px] border-dec-blue/15" />
        <div aria-hidden="true" className="absolute -left-10 bottom-10 h-48 w-48 rounded-full border-[16px] border-dec-green/10" />

        <div className="relative z-10">
          <Link href="/" className="text-sm font-black uppercase tracking-[0.2em] text-[#72bee8] hover:text-white transition">
            CSO Learning Hub
          </Link>
          <h1 className="mt-16 font-display text-4xl font-bold leading-tight">
            Accept your course invitation
          </h1>
          <p className="mt-6 text-sm leading-7 text-slate-200">
            Confirm the invited course and sign in using the exact learner account that received the private link.
          </p>
        </div>

        <div className="relative z-10 border-t border-white/10 pt-8 space-y-4">
          <div className="flex gap-3 text-xs leading-5 text-slate-300">
            <span className="h-2 w-2 rounded-full bg-dec-green mt-1.5 shrink-0" />
            <p>
              <strong className="text-white font-bold">Keep this link private:</strong> Do not forward it or share it publicly.
            </p>
          </div>
        </div>
      </section>

      {/* Right panel - Form Area */}
      <main className="flex-1 flex flex-col justify-center items-center px-4 py-12 sm:px-8">
        <div className="w-full max-w-xl bg-white border border-design-border rounded-card p-6 sm:p-8 shadow-soft">
          <div className="mb-6 lg:hidden text-center">
            <Link href="/" className="text-xs font-black uppercase tracking-[0.16em] text-dec-blue">
              CSO Learning Hub
            </Link>
          </div>

          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-2xs font-extrabold uppercase tracking-wider text-dec-blue">
                  Course Invitation
                </span>
                <StatusBadge label="Secure Invite" tone="green" />
              </div>
              <h2 className="mt-2 text-2xl font-bold text-deep-navy">
                {isNewLearner
                  ? "Activate your account"
                  : isExistingLearner
                    ? "Sign in to continue"
                    : "Accept invitation"}
              </h2>
              <p className="mt-2 text-xs leading-5 text-muted-text">
                {isNewLearner
                  ? "Create your password to activate your Learning Hub account and access the course assigned to you."
                  : isExistingLearner
                    ? "Use the email and password for your active Learning Hub account."
                    : "Your account and invitation email must match before course access can be granted."}
              </p>
            </div>

            <div className="mt-6">
              <CourseInvitationAcceptance
                accountState={resolution.success && resolution.state === "available" ? resolution.accountState : undefined}
                authentication={resolution.success ? resolution.authentication : undefined}
                context={showContext && resolution.success ? {
                  courseSlug: resolution.context.courseSlug,
                  courseTitle: resolution.context.courseTitle,
                  expiresAt: "expiresAt" in resolution.context ? resolution.context.expiresAt.toISOString() : undefined,
                  organizationName: resolution.context.organizationName,
                } : undefined}
                returnPath={returnPath}
                state={resolution.state}
              />
            </div>
          </div>
        </div>

        <footer className="mt-8 text-center text-2xs text-muted-text max-w-md">
          <p>
            Need assistance accepting your invitation?{" "}
            <Link href="/support" className="font-semibold text-dec-blue underline hover:text-deep-navy">
              Open support guidance
            </Link>
          </p>
        </footer>
      </main>
    </div>
  );
}
