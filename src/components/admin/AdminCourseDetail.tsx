import {
  deactivateAdminCourseAssignmentAction,
  assignAdminCourseAction,
} from "@/lib/admin-course-actions";
import {
  archiveCourseAction,
  publishCourseAction,
  unpublishCourseAction,
} from "@/lib/review-actions";
import type {
  AdminCourseAssignmentOptions,
  AdminCourseDetail as AdminCourseDetailData,
} from "@/lib/admin-course-workflow";
import { ActionButton, AlertMessage, EmptyState, StatusBadge } from "@/components/ui";
import { CourseStatus } from "@/generated/prisma/enums";
import type { ReactNode } from "react";

type AdminCourseDetailProps = {
  adminNotice?: string;
  assignmentOptions: AdminCourseAssignmentOptions;
  detail: AdminCourseDetailData;
};

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

function HiddenActionFields({ detail }: { detail: AdminCourseDetailData }) {
  return (
    <>
      <input name="courseId" type="hidden" value={detail.course.id} />
      <input name="returnPath" type="hidden" value={`/admin/courses/${detail.course.id}`} />
    </>
  );
}

function CourseActions({ detail }: { detail: AdminCourseDetailData }) {
  const hasBlockers = detail.course.readinessErrors > 0;

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
      <ActionButton href={`/creator/courses/${detail.course.id}/preview`} variant="secondary">
        Preview Course
      </ActionButton>
      <ActionButton href={`/creator/courses/${detail.course.id}/setup`} variant="secondary">
        Open Setup
      </ActionButton>
      <ActionButton href={`/admin/review/${detail.course.id}`} variant="ghost">
        Review Detail
      </ActionButton>
      {detail.course.status === CourseStatus.APPROVED || detail.course.status === CourseStatus.UNPUBLISHED ? (
        <form action={publishCourseAction}>
          <HiddenActionFields detail={detail} />
          <ActionButton disabled={hasBlockers} type="submit">
            Publish
          </ActionButton>
        </form>
      ) : null}
      {detail.course.status === CourseStatus.PUBLISHED ? (
        <form action={unpublishCourseAction}>
          <HiddenActionFields detail={detail} />
          <ActionButton type="submit" variant="ghost">
            Unpublish
          </ActionButton>
        </form>
      ) : null}
      {detail.course.status !== CourseStatus.PUBLISHED ? (
        <form action={archiveCourseAction}>
          <HiddenActionFields detail={detail} />
          <ActionButton type="submit" variant="danger">
            Archive
          </ActionButton>
        </form>
      ) : null}
    </div>
  );
}

function DetailHeader({ detail }: { detail: AdminCourseDetailData }) {
  return (
    <section className="overflow-hidden rounded-[28px] border border-design-border bg-deep-navy p-6 text-white shadow-hero lg:p-8">
      <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_380px] xl:items-center">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge label={detail.course.statusLabel} tone={detail.course.statusTone} />
            <StatusBadge label={detail.visibility} tone="blue" />
          </div>
          <h1 className="mt-5 text-4xl font-semibold leading-tight sm:text-5xl">
            Course Detail
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-white/75">
            Review course setup, ownership, version structure, readiness, and
            publication controls without entering Build Studio.
          </p>
          <p className="mt-5 max-w-3xl text-sm font-semibold leading-6 text-white">
            {detail.course.title}
          </p>
          <div className="mt-7">
            <CourseActions detail={detail} />
          </div>
        </div>

        <article className="rounded-[24px] border border-white/15 bg-white/10 p-5">
          <p className="text-sm font-semibold text-dec-green">Course structure</p>
          <h2 className="mt-3 text-2xl font-semibold leading-tight">
            Version {detail.versionSummary.versionNumber ?? "current"}
          </h2>
          <dl className="mt-6 grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-[16px] bg-white/10 p-3">
              <dt className="text-white/65">Lessons</dt>
              <dd className="mt-1 text-2xl font-semibold text-white">{detail.versionSummary.lessonCount}</dd>
            </div>
            <div className="rounded-[16px] bg-white/10 p-3">
              <dt className="text-white/65">Blocks</dt>
              <dd className="mt-1 text-2xl font-semibold text-white">{detail.versionSummary.blockCount}</dd>
            </div>
          </dl>
        </article>
      </div>
    </section>
  );
}

function SummaryPanel({ detail }: { detail: AdminCourseDetailData }) {
  const items = [
    ["Creator", detail.course.assignedCreator],
    ["Capacity area", detail.course.capacityArea],
    ["Target audience", detail.targetAudience],
    ["Visibility", detail.visibility],
    ["Certificate", detail.course.certificateEligibleLabel],
    ["Final test", detail.course.finalTestLabel],
    ["Version status", detail.versionSummary.status],
    ["Resources", String(detail.course.resourceCount)],
  ];

  return (
    <Panel
      description={detail.description}
      title="Course summary"
    >
      <dl className="grid gap-3 md:grid-cols-2">
        {items.map(([label, value]) => (
          <div className="rounded-[18px] bg-soft-bg p-4" key={label}>
            <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-text">
              {label}
            </dt>
            <dd className="mt-2 text-sm font-semibold leading-6 text-dark-ink">
              {value}
            </dd>
          </div>
        ))}
      </dl>
    </Panel>
  );
}

function OutcomesPanel({ detail }: { detail: AdminCourseDetailData }) {
  return (
    <Panel
      description="Learning outcomes connected to the course setup."
      title="Learning outcomes"
    >
      {detail.outcomes.length > 0 ? (
        <ol className="space-y-3">
          {detail.outcomes.map((outcome, index) => (
            <li className="flex gap-3 rounded-[18px] bg-soft-bg p-4" key={`${index}-${outcome}`}>
              <span className="flex size-8 shrink-0 items-center justify-center rounded-control bg-dec-blue/10 text-xs font-bold text-[#216f9d]">
                {index + 1}
              </span>
              <span className="text-sm font-medium leading-6 text-dark-ink">{outcome}</span>
            </li>
          ))}
        </ol>
      ) : (
        <EmptyState
          description="Creator outcomes will appear after setup is completed."
          title="No learning outcomes"
        />
      )}
    </Panel>
  );
}

function VersionPanel({ detail }: { detail: AdminCourseDetailData }) {
  const items = [
    ["Modules", String(detail.versionSummary.moduleCount)],
    ["Lessons", String(detail.versionSummary.lessonCount)],
    ["Content blocks", String(detail.versionSummary.blockCount)],
    ["Version", detail.versionSummary.versionNumber ? `v${detail.versionSummary.versionNumber}` : "Current"],
  ];

  return (
    <Panel
      description="Current version structure used for readiness and publishing checks."
      title="Version summary"
    >
      <dl className="grid gap-3 sm:grid-cols-2">
        {items.map(([label, value]) => (
          <div className="rounded-[18px] bg-soft-bg p-4" key={label}>
            <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-text">
              {label}
            </dt>
            <dd className="mt-2 text-sm font-semibold leading-6 text-dark-ink">{value}</dd>
          </div>
        ))}
      </dl>
    </Panel>
  );
}

function ReadinessPanel({ detail }: { detail: AdminCourseDetailData }) {
  return (
    <Panel
      description="Blocking items prevent publishing. Warnings remain visible for quality follow-up."
      title="Readiness summary"
    >
      <ul className="space-y-3">
        {detail.course.readinessItems.map((item) => (
          <li
            className="flex flex-col gap-3 rounded-[18px] border border-design-border bg-soft-bg p-4 sm:flex-row sm:items-center sm:justify-between"
            key={`${item.label}-${item.status}`}
          >
            <span className="text-sm font-semibold leading-6 text-dark-ink">
              {item.label}
            </span>
            <StatusBadge label={item.status} tone={item.tone} />
          </li>
        ))}
      </ul>
    </Panel>
  );
}

const noticeMessages: Record<string, { message: string; tone: "error" | "info" | "success" | "warning" }> = {
  "assignment-target-not-found": {
    message: "Choose a valid assignment target.",
    tone: "error",
  },
  "course-assigned": {
    message: "Course assignment saved and audit log updated.",
    tone: "success",
  },
  "course-assignment-already-active": {
    message: "That assignment is already active.",
    tone: "info",
  },
  "course-assignment-already-inactive": {
    message: "That assignment was already inactive.",
    tone: "info",
  },
  "course-assignment-not-found": {
    message: "The selected course assignment could not be found.",
    tone: "error",
  },
  "course-assignment-removed": {
    message: "Course assignment removed and audit log recorded.",
    tone: "success",
  },
  "invalid-assignment-type": {
    message: "Choose a valid assignment type.",
    tone: "error",
  },
  "invalid-due-date": {
    message: "Use a valid assignment due date.",
    tone: "error",
  },
  unauthorized: {
    message: "You are not allowed to perform that admin operation.",
    tone: "error",
  },
};

function Notice({ code }: { code?: string }) {
  if (!code) {
    return null;
  }

  const notice = noticeMessages[code] ?? {
    message: "The course assignment operation could not be completed.",
    tone: "error" as const,
  };

  return (
    <AlertMessage title="Course assignment" tone={notice.tone}>
      {notice.message}
    </AlertMessage>
  );
}

function AssignmentForm({
  courseId,
  label,
  options,
  targetType,
}: {
  courseId: string;
  label: string;
  options: { id: string; label: string }[];
  targetType: "USER" | "ORGANIZATION" | "COHORT";
}) {
  return (
    <form action={assignAdminCourseAction} className="rounded-[18px] border border-design-border bg-soft-bg p-4">
      <input name="courseId" type="hidden" value={courseId} />
      <input name="targetType" type="hidden" value={targetType} />
      <label className="block text-sm font-semibold text-dark-ink">
        {label}
        <select
          className="mt-2 min-h-11 w-full rounded-control border border-design-border bg-white px-4 text-sm text-dark-ink outline-none transition focus:border-dec-blue focus:ring-4 focus:ring-dec-blue/20"
          name="targetId"
          required
        >
          {options.map((option) => (
            <option key={option.id} value={option.id}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
      <label className="mt-4 block text-sm font-semibold text-dark-ink">
        Due date
        <input
          className="mt-2 min-h-11 w-full rounded-control border border-design-border bg-white px-4 text-sm text-dark-ink outline-none transition focus:border-dec-blue focus:ring-4 focus:ring-dec-blue/20"
          name="dueDate"
          type="date"
        />
      </label>
      <ActionButton className="mt-4" disabled={options.length === 0} type="submit" variant="secondary">
        Assign
      </ActionButton>
    </form>
  );
}

function AssignmentPanel({
  detail,
  options,
}: {
  detail: AdminCourseDetailData;
  options: AdminCourseAssignmentOptions;
}) {
  return (
    <Panel
      description="Assign this course to a user, organization, or cohort. This configures access; enrollment remains learner-driven."
      title="Course assignments"
    >
      <div className="grid gap-4 lg:grid-cols-3">
        <AssignmentForm
          courseId={detail.course.id}
          label="Assign to user"
          options={options.users}
          targetType="USER"
        />
        <AssignmentForm
          courseId={detail.course.id}
          label="Assign to organization"
          options={options.organizations}
          targetType="ORGANIZATION"
        />
        <AssignmentForm
          courseId={detail.course.id}
          label="Assign to cohort"
          options={options.cohorts}
          targetType="COHORT"
        />
      </div>

      <div className="mt-6">
        {detail.assignments.length === 0 ? (
          <EmptyState
            description="No active assignments are linked to this course."
            title="No active assignments"
          />
        ) : (
          <div className="grid gap-3">
            {detail.assignments.map((assignment) => (
              <article
                className="flex flex-col gap-4 rounded-[18px] border border-design-border bg-white p-4 sm:flex-row sm:items-center sm:justify-between"
                key={assignment.id}
              >
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <StatusBadge label={assignment.type.toLowerCase()} tone="blue" />
                    <a className="text-sm font-semibold leading-6 text-dark-ink hover:text-dec-blue" href={assignment.targetHref}>
                      {assignment.target}
                    </a>
                  </div>
                  <p className="mt-1 text-sm leading-6 text-muted-text">
                    Assigned {assignment.assignedAt} by {assignment.assignedBy} · Due {assignment.dueDate}
                  </p>
                </div>
                <form action={deactivateAdminCourseAssignmentAction}>
                  <input name="assignmentId" type="hidden" value={assignment.id} />
                  <input name="courseId" type="hidden" value={detail.course.id} />
                  <ActionButton type="submit" size="sm" variant="ghost">
                    Remove
                  </ActionButton>
                </form>
              </article>
            ))}
          </div>
        )}
      </div>
    </Panel>
  );
}

export function AdminCourseDetail({
  adminNotice,
  assignmentOptions,
  detail,
}: AdminCourseDetailProps) {
  return (
    <div className="space-y-6">
      <Notice code={adminNotice} />
      <DetailHeader detail={detail} />

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px] xl:items-start">
        <div className="space-y-6">
          <SummaryPanel detail={detail} />
          <AssignmentPanel detail={detail} options={assignmentOptions} />
          <OutcomesPanel detail={detail} />
          <VersionPanel detail={detail} />
          <ReadinessPanel detail={detail} />
        </div>

        <aside className="space-y-6">
          <aside className="rounded-[24px] border border-dec-green/30 bg-dec-green/15 p-6 shadow-soft">
            <StatusBadge label="Admin note" tone="green" />
            <p className="mt-4 text-sm leading-7 text-[#426f1c]">
              Course content editing remains in the creator workspace. Admin
              controls here focus on oversight and publishing operations.
            </p>
          </aside>
        </aside>
      </section>
    </div>
  );
}
