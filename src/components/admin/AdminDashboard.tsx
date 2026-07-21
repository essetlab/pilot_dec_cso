import { ActionButton, EmptyState, MetricCard, StatusBadge } from "@/components/ui";
import type {
  AdminDashboardActivity,
  AdminDashboardAttentionCourse,
  AdminDashboardCertificate,
  AdminDashboardData,
} from "@/lib/admin-dashboard-workflow";
import { isPhaseOneAdminSurfaceRoute } from "@/lib/routes";
import type { ReactNode } from "react";
import { BrandMark } from "@/components/shell/BrandMark";

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
      "Have the active organization, learner name and email, region, role, intended course and version, optional cohort, and expiry date ready.",
    title: "Prepare the information",
  },
  {
    description:
      "Open Manage invitations, choose Create invitation, and select the CSO, learner, course, and expiry date.",
    title: "Create the invitation",
  },
  {
    description:
      "Prepare the secure link, copy it when it appears, and send it privately to the intended learner. The link cannot be shown again later.",
    title: "Copy and deliver the link",
  },
  {
    description:
      "Return to the invitation record and mark delivery only after the link has been sent through the agreed channel.",
    title: "Mark delivery",
  },
  {
    description:
      "Use the invitation status and history to confirm whether it is draft, sent, activated, expired, cancelled, or replaced.",
    title: "Monitor activation",
  },
  {
    description:
      "Prepare a replacement link when a sent link must be invalidated, or cancel the invitation when access is no longer required.",
    title: "Replace or cancel safely",
  },
] as const;

function InvitationOperationsGuide() {
  return (
    <section
      aria-labelledby="administrator-invitation-guide"
      className="rounded-[24px] border border-dec-blue/25 bg-dec-blue/10 p-6 shadow-soft"
    >
      <div className="max-w-3xl">
        <StatusBadge label="Administrator guide" tone="blue" />
        <h2
          className="mt-4 text-2xl font-semibold leading-tight text-deep-navy"
          id="administrator-invitation-guide"
        >
          How to invite a learner
        </h2>
        <p className="mt-2 text-sm leading-6 text-[#26536c]">
          Follow these steps to prepare, send, and monitor one learner invitation.
        </p>
      </div>
      <ol className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {invitationSteps.map((step, index) => (
          <li className="rounded-[18px] border border-dec-blue/15 bg-white p-4" key={step.title}>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-dec-blue">
              Step {index + 1}
            </p>
            <h3 className="mt-2 text-base font-semibold text-dark-ink">{step.title}</h3>
            <p className="mt-2 text-sm leading-6 text-muted-text">{step.description}</p>
          </li>
        ))}
      </ol>
      <ActionButton className="mt-6" href="/admin/course-invitations">
        Manage invitations
      </ActionButton>
    </section>
  );
}

export function AdminPortalEntry() {
  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-[28px] border border-design-border bg-deep-navy p-6 text-white shadow-hero lg:p-8">
        <div className="mb-7 inline-flex rounded-[18px] bg-white p-3">
          <BrandMark compact />
        </div>
        <StatusBadge label="DEC staff access" tone="blue" />
        <h1 className="mt-5 text-4xl font-semibold leading-tight sm:text-5xl">
          DEC Administrator Portal
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-white/80">
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
    <section className="rounded-[24px] border border-design-border bg-white-surface p-6 shadow-soft">
      <div className="max-w-3xl">
        <h2 className="text-2xl font-semibold leading-tight text-dark-ink">{title}</h2>
        {description ? (
          <p className="mt-2 text-sm leading-6 text-muted-text">{description}</p>
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
    blue: "text-[#216f9d]",
    gray: "text-muted-text",
    green: "text-[#426f1c]",
    orange: "text-orange-700",
    red: "text-red-700",
  };

  return <span className={`text-sm font-bold ${classes[tone]}`}>{children}</span>;
}

function DashboardHeader({ data }: { data: AdminDashboardData }) {
  return (
    <section className="overflow-hidden rounded-[28px] border border-design-border bg-deep-navy p-6 text-white shadow-hero lg:p-8">
      <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_360px] xl:items-center">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge label="Operations" tone="blue" />
            <StatusBadge label="Platform overview" tone="green" />
          </div>
          <h1 className="mt-5 text-4xl font-semibold leading-tight sm:text-5xl">
            DEC Administrator Portal
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-white/75">
            This area is for authorized DEC staff managing participant invitations,
            pilot access, learners, organizations, assignments, and learning records.
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <ActionButton href="/admin/course-invitations" size="lg">
              Manage Invitations
            </ActionButton>
            <ActionButton
              className="bg-white text-deep-navy hover:text-dec-blue"
              href="/admin/courses"
              size="lg"
              variant="secondary"
            >
              <span className="text-deep-navy">Manage Courses</span>
            </ActionButton>
          </div>
        </div>

        <article className="rounded-[24px] border border-white/15 bg-white/10 p-5">
          <p className="text-sm font-semibold text-dec-green">Today&apos;s focus</p>
          <h2 className="mt-3 text-2xl font-semibold leading-tight">
            Keep assignments, certificates, and learner records moving.
          </h2>
          <p className="mt-3 text-sm leading-6 text-white/70">
            Follow up on course assignments, certificate activity, and recent
            platform events that need administrator awareness.
          </p>
          <dl className="mt-6 grid grid-cols-1 gap-3 text-sm sm:grid-cols-3 xl:grid-cols-1">
            <div className="rounded-[16px] bg-white/10 p-3">
              <dt className="text-white/65">Ready items</dt>
              <dd className="mt-1 text-2xl font-semibold text-white">
                {data.focus.readyItems}
              </dd>
            </div>
            <div className="rounded-[16px] bg-white/10 p-3">
              <dt className="text-white/65">Awaiting review</dt>
              <dd className="mt-1 text-2xl font-semibold text-white">
                {data.focus.coursesAwaitingReview}
              </dd>
            </div>
            <div className="rounded-[16px] bg-white/10 p-3">
              <dt className="text-white/65">Certificates</dt>
              <dd className="mt-1 text-2xl font-semibold text-white">
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
        <h2 className="text-2xl font-semibold leading-tight text-dark-ink" id="admin-kpi-heading">
          Operational summary
        </h2>
        <p className="mt-2 text-sm leading-6 text-muted-text">
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
        <ol className="space-y-4">
          {courses.map((course) => (
            <li
              className="flex flex-col gap-4 rounded-[20px] border border-design-border bg-soft-bg p-4 sm:flex-row sm:items-center sm:justify-between"
              key={course.id}
            >
              <div className="min-w-0">
                <p className="text-sm font-semibold leading-6 text-dark-ink">
                  {course.title}
                </p>
                <p className="mt-1 text-sm leading-6 text-muted-text">{course.detail}</p>
                <div className="mt-3">
                  <StatusBadge label={course.status} tone={course.tone} />
                </div>
              </div>
              {isPhaseOneAdminSurfaceRoute(course.href) ? (
                <ActionButton href={course.href} size="sm" variant="secondary">
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
        <ul className="space-y-4">
          {activityItems.map((item, index) => (
            <li className="rounded-[18px] bg-soft-bg p-4" key={item.id}>
              <div className="flex gap-3">
                <span
                  aria-hidden="true"
                  className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-dec-blue/10 text-xs font-bold text-[#216f9d]"
                >
                  {index + 1}
                </span>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <StatusBadge label={item.action} tone={item.tone} />
                    <span className="text-xs font-semibold text-muted-text">
                      {item.timestamp}
                    </span>
                  </div>
                  <p className="mt-2 text-sm font-medium leading-6 text-dark-ink">
                    {item.description}
                  </p>
                  <p className="mt-1 text-xs font-medium text-muted-text">
                    Recorded by {item.actor}
                  </p>
                  {item.href && isPhaseOneAdminSurfaceRoute(item.href) ? (
                    <ActionButton
                      className="mt-3"
                      href={item.href}
                      size="sm"
                      variant="ghost"
                    >
                      Open record
                    </ActionButton>
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
            className="w-full justify-start"
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
              className="rounded-[22px] border border-dec-green/30 bg-dec-green/15 p-5"
              key={certificate.id}
            >
              <StatusBadge label={certificate.status} tone={certificate.tone} />
              <h3 className="mt-4 text-lg font-semibold leading-tight text-deep-navy">
                {certificate.participantName}
              </h3>
              <p className="mt-2 text-sm leading-6 text-muted-text">
                {certificate.courseTitle}
              </p>
              <dl className="mt-5 grid gap-3">
                <div className="rounded-[16px] bg-white/80 p-4">
                  <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-text">
                    Certificate code
                  </dt>
                  <dd className="mt-2 break-words text-sm font-semibold text-dark-ink">
                    {certificate.certificateCode}
                  </dd>
                </div>
                <div className="rounded-[16px] bg-white/80 p-4">
                  <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-text">
                    Issue date
                  </dt>
                  <dd className="mt-2 text-sm font-semibold text-dark-ink">
                    {certificate.issuedAt}
                  </dd>
                </div>
              </dl>
              <ActionButton
                className="mt-4"
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
    <aside className="rounded-[24px] border border-dec-blue/25 bg-dec-blue/10 p-6 shadow-soft">
      <StatusBadge label="Admin guidance" tone="blue" />
      <p className="mt-4 text-sm leading-7 text-[#26536c]">
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
