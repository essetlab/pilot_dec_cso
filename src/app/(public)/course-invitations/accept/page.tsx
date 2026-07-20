import type { Metadata } from "next";
import { BrandMark } from "@/components/shell/BrandMark";
import { CourseInvitationAcceptance } from "@/components/public/CourseInvitationAcceptance";
import { StatusBadge } from "@/components/ui";
import { getCurrentSession } from "@/lib/auth/server";
import { resolveCourseInvitationAcceptance } from "@/lib/course-invitation-workflow";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  referrer: "no-referrer",
  robots: { follow: false, index: false },
  title: "Accept course invitation | CSO Learning Hub",
};

type PageProps = {
  searchParams: Promise<{ token?: string }>;
};

export default async function CourseInvitationAcceptPage({ searchParams }: PageProps) {
  const { token = "" } = await searchParams;
  const session = await getCurrentSession();
  const resolution = await resolveCourseInvitationAcceptance({
    plaintextToken: token,
    session,
  });
  const returnPath = `/course-invitations/accept?token=${encodeURIComponent(token)}`;
  const showContext =
    resolution.success &&
    (resolution.state === "already-activated" ||
      resolution.authentication !== "mismatch");

  return (
    <section className="relative overflow-hidden rounded-[32px] border border-design-border bg-white shadow-card">
      <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-dec-blue/10 blur-3xl" aria-hidden="true" />
      <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-dec-green/10 blur-3xl" aria-hidden="true" />
      <div className="relative grid lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
        <div className="bg-deep-navy px-6 py-8 text-white sm:px-8 lg:px-10 lg:py-12">
          <BrandMark />
          <div className="mt-10 max-w-xl">
            <StatusBadge label="Secure course invitation" tone="green" />
            <h1 className="mt-5 font-display text-4xl font-semibold leading-tight sm:text-5xl">
              Continue your learning invitation
            </h1>
            <p className="mt-5 text-base leading-8 text-white/75">
              Confirm the invited course and use the exact learner account that received the private link. Opening this page alone does not assign access.
            </p>
          </div>
          <div className="mt-10 rounded-[22px] border border-white/15 bg-white/10 p-5 text-sm leading-7 text-white/75">
            <p className="font-semibold text-white">Keep this link private</p>
            <p className="mt-2">Do not forward it or share it publicly. If the invitation was unexpected, leave the page and contact support.</p>
          </div>
        </div>
        <div className="px-6 py-8 sm:px-8 lg:px-10 lg:py-12">
          <div className="mx-auto max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-dec-blue">CSO Learning Hub</p>
            <h2 className="mt-3 text-3xl font-semibold text-deep-navy">Accept invitation</h2>
            <p className="mt-3 text-sm leading-7 text-muted-text">Your account and invitation email must match before one individual course assignment can be created.</p>
            <div className="mt-7">
              <CourseInvitationAcceptance
                authentication={resolution.success && resolution.state === "available" ? resolution.authentication : undefined}
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
      </div>
    </section>
  );
}
