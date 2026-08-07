import { ActionButton, EmptyState, MetricCard } from "@/components/ui";
import type {
  AdminDashboardActivity,
  AdminDashboardAttentionCourse,
  AdminDashboardCertificate,
  AdminDashboardData,
} from "@/lib/admin-dashboard-workflow";
import { isPhaseOneAdminSurfaceRoute } from "@/lib/routes";
import type { ReactNode } from "react";
import { BrandMark } from "@/components/shell/BrandMark";
import { cx } from "@/components/ui/utils";

const quickActions = [
  ["Manage invitations", "/admin/course-invitations"],
  ["Manage users", "/admin/users"],
  ["Add organization", "/admin/organizations/new"],
  ["Manage courses", "/admin/courses"],
  ["View certificates", "/admin/certificates"],
] as const;

const invitationSteps = [
  {
    description:
      "Open Create invitation. Active organizations and governed courses are loaded automatically.",
    title: "Open the invitation page",
  },
  {
    description:
      "Enter the learner name and email, then select the approved organization and course.",
    title: "Enter learner details",
  },
  {
    description:
      "Select Send invitation. The Hub emails the secure five-day activation link directly to the learner.",
    title: "Send invitation",
  },
  {
    description:
      "Use the invitation list to monitor activation, resend a failed or expired invitation, or revoke unused access.",
    title: "Monitor status",
  },
] as const;

function InvitationOperationsGuide() {
  return (
    <section
      aria-labelledby="administrator-invitation-guide"
      className="rounded-[20px] border border-dec-blue/20 bg-dec-blue/5 p-6 shadow-soft"
    >
      <div className="max-w-3xl">
        <span className="inline-flex items-center rounded-full bg-dec-blue/10 px-2.5 py-0.5 text-xs font-semibold text-dec-blue">
          Administrator Guide
        </span>
        <h2
          className="mt-4 text-2xl font-bold leading-tight text-deep-navy"
          id="administrator-invitation-guide"
        >
          How to invite a learner
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-text">
          Follow these steps to prepare, send, and monitor one learner invitation.
        </p>
      </div>
      <ol className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {invitationSteps.map((step, index) => (
          <li className="rounded-[16px] border border-design-border bg-white-surface p-5 shadow-soft hover:border-dec-blue/30 transition-colors" key={step.title}>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-dec-blue">
              Step {index + 1}
            </p>
            <h3 className="mt-2 text-base font-bold text-dark-ink leading-snug">{step.title}</h3>
            <p className="mt-2.5 text-xs leading-relaxed text-muted-text">{step.description}</p>
          </li>
        ))}
      </ol>
      <div className="mt-6">
        <ActionButton href="/admin/course-invitations/new" className="shadow-soft">
          Create invitation
        </ActionButton>
      </div>
    </section>
  );
}

export function AdminPortalEntry() {
  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-[24px] border border-design-border bg-deep-navy p-6 text-white shadow-hero lg:p-8">
        <div className="mb-7 inline-flex rounded-xl bg-white p-2">
          <BrandMark compact />
        </div>
        <div className="mb-4">
          <span className="inline-flex items-center rounded-full bg-white/10 px-2.5 py-0.5 text-xs font-semibold text-[#72bee8]">
            DEC Staff Access
          </span>
        </div>
        <h1 className="text-3xl font-bold leading-tight sm:text-4xl">
          DEC Administrator Portal
        </h1>
        <p className="mt-4 max-w-3xl text-sm leading-relaxed text-slate-200">
          Use this area to manage participating CSOs, invite learners, select courses,
          monitor invitation status, replace or cancel invitations, and support pilot access.
        </p>
        <ActionButton
          className="mt-7"
          href="/sign-in?next=%2Fadmin%2Fcourse-invitations"
          size="lg"
        >
          Sign in as administrator
        </ActionButton>
      </section>
      <InvitationOperationsGuide />
    </div>
  );
}

function Panel({
  children,
  description,
  title,
}: {
  children: ReactNode;
  description?: string;
  title: string;
}) {
  return (
    <section className="rounded-[20px] border border-design-border bg-white-surface p-6 shadow-soft hover:shadow-card transition-shadow duration-200">
      <div className="max-w-3xl">
        <h2 className="text-xl font-bold leading-tight text-dark-ink">{title}</h2>
        {description ? (
          <p className="mt-1.5 text-xs leading-relaxed text-muted-text">{description}</p>
        ) : null}
      </div>
      <div className="mt-6">{children}</div>
    </section>
  );
}

function MetricIcon({
  children,
  tone,
}: {
  children: string;
  tone: "blue" | "green" | "gray" | "orange" | "red";
}) {
  const classes = {
    blue: "text-dec-blue bg-dec-blue/10",
    gray: "text-muted-text bg-slate-100",
    green: "text-[#426f1c] bg-[#426f1c]/10",
    orange: "text-orange-700 bg-orange-50",
    red: "text-red-700 bg-red-50",
  };

  return (
    <span className={`inline-flex items-center justify-center h-6 w-6 rounded-full text-xs font-bold ${classes[tone]}`}>
      {children}
    </span>
  );
}

function DashboardHeader({ data }: { data: AdminDashboardData }) {
  return (
    <section className="overflow-hidden rounded-[24px] border border-design-border bg-deep-navy p-6 text-white shadow-hero lg:p-8">
      <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_360px] xl:items-center">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center rounded-full bg-white/10 px-2.5 py-0.5 text-xs font-semibold text-[#72bee8]">
              Operations
            </span>
            <span className="inline-flex items-center rounded-full bg-dec-green/10 px-2.5 py-0.5 text-xs font-semibold text-dec-green">
              Platform overview
            </span>
          </div>
          <h1 className="mt-5 font-display text-3xl font-bold leading-tight sm:text-4xl tracking-tight">
            DEC Administrator Portal
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-slate-300">
            This area is for authorized DEC staff managing participant invitations,
            pilot access, learners, organizations, assignments, and learning records.
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <ActionButton href="/admin/course-invitations" size="lg">
              Manage Invitations
            </ActionButton>
            <ActionButton
              className="border-white/20 bg-transparent text-white hover:bg-white/10"
              href="/admin/courses"
              size="lg"
              variant="outline"
            >
              Manage Courses
            </ActionButton>
          </div>
        </div>

        <article className="rounded-[20px] border border-white/10 bg-white/5 p-5">
          <p className="text-xs font-bold uppercase tracking-wider text-dec-green">Today&apos;s focus</p>
          <h2 className="mt-2.5 text-lg font-bold leading-snug text-white">
            Keep assignments, certificates, and learner records moving.
          </h2>
          <p className="mt-2 text-xs leading-relaxed text-slate-300">
            Follow up on course assignments, certificate activity, and recent
            platform events that need administrator awareness.
          </p>
          <dl className="mt-5 grid grid-cols-1 gap-3.5 text-sm sm:grid-cols-3 xl:grid-cols-1">
            <div className="flex items-center justify-between rounded-[12px] bg-white/10 p-3">
              <dt className="text-xs text-slate-300">Ready items</dt>
              <dd className="text-lg font-bold text-white">
                {data.focus.readyItems}
              </dd>
            </div>
            <div className="flex items-center justify-between rounded-[12px] bg-white/10 p-3">
              <dt className="text-xs text-slate-300">Awaiting review</dt>
              <dd className="text-lg font-bold text-white">
                {data.focus.coursesAwaitingReview}
              </dd>
            </div>
            <div className="flex items-center justify-between rounded-[12px] bg-white/10 p-3">
              <dt className="text-xs text-slate-300">Certificates</dt>
              <dd className="text-lg font-bold text-white">
                {data.focus.certificatesIssued}
              </dd>
            </div>
          </dl>
        </article>
      </div>
    </section>
  );
}

function KpiGrid({ data }: { data: AdminDashboardData }) {
  return (
    <section aria-labelledby="admin-kpi-heading" className="space-y-4">
      <div>
        <h2 className="text-xl font-bold leading-tight text-dark-ink" id="admin-kpi-heading">
          Operational summary
        </h2>
        <p className="mt-1 text-xs text-muted-text">
          A concise view of current platform records and learning operations.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {data.metrics.map((metric, index) => (
          <MetricCard
            helperText={metric.helperText}
            icon={
              <MetricIcon tone={metric.tone}>
                {String(index + 1).padStart(2, "0")}
              </MetricIcon>
            }
            key={metric.label}
            label={metric.label}
            tone={metric.tone}
            value={metric.value}
          />
        ))}
      </div>
    </section>
  );
}

function CoursesNeedingAttentionCard({
  courses,
}: {
  courses: AdminDashboardAttentionCourse[];
}) {
  return (
    <Panel
      description="Courses that may need review, publishing, revision follow-up, or admin awareness."
      title="Courses needing attention"
    >
      {courses.length > 0 ? (
        <ol className="space-y-3.5">
          {courses.map((course) => (
            <li
              className="flex flex-col gap-4 rounded-[16px] border border-design-border bg-soft-bg p-4.5 sm:flex-row sm:items-center sm:justify-between hover:border-dec-blue/25 transition-colors"
              key={course.id}
            >
              <div className="min-w-0">
                <p className="text-sm font-bold leading-snug text-dark-ink">
                  {course.title}
                </p>
                <p className="mt-1.5 text-xs text-muted-text leading-relaxed">{course.detail}</p>
                <div className="mt-3">
                  <span className={cx(
                    "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold border",
                    course.tone === "purple" && "bg-purple-50 text-purple-700 border-purple-100",
                    course.tone === "green" && "bg-dec-green/10 text-emerald-800 border-dec-green/20",
                    course.tone === "orange" && "bg-orange-50 text-orange-700 border-orange-100",
                    course.tone === "red" && "bg-red-50 text-red-700 border-red-100",
                    course.tone === "blue" && "bg-dec-blue/10 text-dec-blue border-dec-blue/20"
                  )}>
                    {course.status}
                  </span>
                </div>
              </div>
              {isPhaseOneAdminSurfaceRoute(course.href) ? (
                <ActionButton href={course.href} size="sm" variant="secondary" className="sm:shrink-0 text-xs">
                  {course.action}
                </ActionButton>
              ) : null}
            </li>
          ))}
        </ol>
      ) : (
        <EmptyState
          action={
            <ActionButton href="/admin/courses" variant="secondary">
              View courses
            </ActionButton>
          }
          description="Courses that need review, publishing, or revision follow-up will appear here."
          title="No courses need attention right now."
        />
      )}
    </Panel>
  );
}

function RecentActivityCard({
  activityItems,
}: {
  activityItems: AdminDashboardActivity[];
}) {
  return (
    <Panel
      description="Recent platform events that help administrators understand daily movement."
      title="Recent platform activity"
    >
      {activityItems.length > 0 ? (
        <ul className="space-y-3.5">
          {activityItems.map((item, index) => (
            <li className="rounded-[16px] border border-design-border bg-soft-bg/40 p-4.5" key={item.id}>
              <div className="flex gap-3">
                <span
                  aria-hidden="true"
                  className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-dec-blue/10 text-xs font-bold text-dec-blue"
                >
                  {index + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    <span className={cx(
                      "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold border",
                      item.tone === "purple" && "bg-purple-50 text-purple-700 border-purple-100",
                      item.tone === "green" && "bg-dec-green/10 text-emerald-800 border-dec-green/20",
                      item.tone === "orange" && "bg-orange-50 text-orange-700 border-orange-100",
                      item.tone === "red" && "bg-red-50 text-red-700 border-red-100",
                      item.tone === "blue" && "bg-dec-blue/10 text-dec-blue border-dec-blue/20"
                    )}>
                      {item.action}
                    </span>
                    <span className="text-xs font-semibold text-muted-text">
                      {item.timestamp}
                    </span>
                  </div>
                  <p className="mt-2 text-sm font-semibold leading-relaxed text-dark-ink">
                    {item.description}
                  </p>
                  <p className="mt-1 text-xs text-muted-text">
                    Recorded by {item.actor}
                  </p>
                  {item.href && isPhaseOneAdminSurfaceRoute(item.href) ? (
                    <div className="mt-3">
                      <ActionButton
                        href={item.href}
                        size="sm"
                        variant="secondary"
                        className="text-xs"
                      >
                        Open record
                      </ActionButton>
                    </div>
                  ) : null}
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState
          description="Platform activity will appear here as users, courses, and enrollments are added."
          title="No platform activity yet."
        />
      )}
    </Panel>
  );
}

function QuickActionsCard() {
  return (
    <Panel
      description="Common admin entry points for day-to-day platform operations."
      title="Quick actions"
    >
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
        {quickActions.map(([label, href]) => (
          <ActionButton
            className="w-full justify-start text-xs font-bold"
            href={href}
            key={label}
            variant="secondary"
          >
            {label}
          </ActionButton>
        ))}
      </div>
    </Panel>
  );
}

function RecentCertificatesCard({
  certificates,
}: {
  certificates: AdminDashboardCertificate[];
}) {
  return (
    <Panel
      description="Latest issued certificates visible to platform administrators."
      title="Recent certificates"
    >
      {certificates.length > 0 ? (
        <div className="space-y-4">
          {certificates.map((certificate) => (
            <article
              className="rounded-[16px] border border-dec-green/20 bg-[#f4faf5] p-5 shadow-soft"
              key={certificate.id}
            >
              <div className="mb-3">
                <span className="inline-flex items-center rounded-full bg-dec-green/10 border border-dec-green/20 px-2.5 py-0.5 text-xs font-semibold text-emerald-800">
                  {certificate.status}
                </span>
              </div>
              <h3 className="text-base font-bold leading-snug text-deep-navy">
                {certificate.participantName}
              </h3>
              <p className="mt-1 text-xs text-muted-text leading-relaxed">
                {certificate.courseTitle}
              </p>
              <dl className="mt-4.5 space-y-2.5">
                <div className="rounded-[12px] bg-white-surface border border-design-border p-3.5">
                  <dt className="text-[10px] font-bold uppercase tracking-wider text-muted-text">
                    Certificate code
                  </dt>
                  <dd className="mt-1 break-words text-xs font-semibold text-dark-ink">
                    {certificate.certificateCode}
                  </dd>
                </div>
                <div className="rounded-[12px] bg-white-surface border border-design-border p-3.5">
                  <dt className="text-[10px] font-bold uppercase tracking-wider text-muted-text">
                    Issue date
                  </dt>
                  <dd className="mt-1 text-xs font-semibold text-dark-ink">
                    {certificate.issuedAt}
                  </dd>
                </div>
              </dl>
              <ActionButton
                className="mt-4 w-full justify-center text-xs"
                href={certificate.href}
                size="sm"
                variant="secondary"
              >
                View certificate
              </ActionButton>
            </article>
          ))}
        </div>
      ) : (
        <EmptyState
          action={
            <ActionButton href="/admin/certificates" variant="secondary">
              View certificates
            </ActionButton>
          }
          description="Issued certificates will appear here after participants meet completion and pass requirements."
          title="No certificates issued yet."
        />
      )}
    </Panel>
  );
}

function GuidanceNote() {
  return (
    <aside className="rounded-[20px] border border-dec-blue/20 bg-dec-blue/5 p-5 shadow-soft">
      <span className="inline-flex items-center rounded-full bg-dec-blue/10 px-2.5 py-0.5 text-xs font-semibold text-dec-blue">
        Admin guidance
      </span>
      <p className="mt-3.5 text-xs leading-relaxed text-[#26536c]">
        Use this dashboard to manage daily Phase One learning operations and
        identify courses, organizations, and learners that need attention.
      </p>
    </aside>
  );
}

export function AdminDashboard({ data }: { data: AdminDashboardData }) {
  return (
    <div className="space-y-6">
      <DashboardHeader data={data} />
      <InvitationOperationsGuide />
      <KpiGrid data={data} />

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px] xl:items-start">
        <div className="space-y-6">
          <CoursesNeedingAttentionCard courses={data.attentionCourses} />
          <RecentActivityCard activityItems={data.recentActivity} />
        </div>

        <aside className="space-y-6">
          <QuickActionsCard />
          <RecentCertificatesCard certificates={data.recentCertificates} />
          <GuidanceNote />
        </aside>
      </section>
    </div>
  );
}
