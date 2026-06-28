import {
  approveCourseAction,
  archiveCourseAction,
  publishCourseAction,
  returnCourseForRevisionAction,
  unpublishCourseAction,
} from "@/lib/review-actions";
import {
  reviewNoticeLabels,
  type ReviewCourseDetail,
  type ReviewCourseSummary,
} from "@/lib/review-workflow";
import { ActionButton, AlertMessage, EmptyState, StatusBadge } from "@/components/ui";
import { CourseStatus } from "@/generated/prisma/enums";
import type { ReactNode } from "react";

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

function Notice({ notice }: { notice?: string }) {
  if (!notice || !reviewNoticeLabels[notice]) {
    return null;
  }

  const tone = ["approved", "published", "returned", "unpublished", "archived"].includes(notice)
    ? "success"
    : notice === "blocked" || notice === "invalid-transition"
      ? "warning"
      : notice === "unauthorized" || notice === "not-found"
        ? "error"
        : "info";

  return (
    <AlertMessage tone={tone} title="Review workflow">
      {reviewNoticeLabels[notice]}
    </AlertMessage>
  );
}

function HiddenActionFields({ course }: { course: ReviewCourseSummary }) {
  return (
    <>
      <input name="courseId" type="hidden" value={course.id} />
      <input name="returnPath" type="hidden" value={course.href} />
    </>
  );
}

function ReviewActions({
  canPublish,
  course,
}: {
  canPublish: boolean;
  course: ReviewCourseSummary;
}) {
  const hasBlockers = course.readinessErrors > 0;

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
      <ActionButton href={`/creator/courses/${course.id}/preview`} variant="secondary">
        Preview Course
      </ActionButton>
      {course.status === CourseStatus.READY_FOR_REVIEW ? (
        <form action={approveCourseAction}>
          <HiddenActionFields course={course} />
          <ActionButton disabled={hasBlockers} type="submit" variant="success">
            Approve
          </ActionButton>
        </form>
      ) : null}
      {canPublish && (course.status === CourseStatus.APPROVED || course.status === CourseStatus.UNPUBLISHED) ? (
        <form action={publishCourseAction}>
          <HiddenActionFields course={course} />
          <ActionButton disabled={hasBlockers} type="submit">
            Publish
          </ActionButton>
        </form>
      ) : null}
      {canPublish && course.status === CourseStatus.PUBLISHED ? (
        <form action={unpublishCourseAction}>
          <HiddenActionFields course={course} />
          <ActionButton type="submit" variant="ghost">
            Unpublish
          </ActionButton>
        </form>
      ) : null}
      {canPublish && course.status !== CourseStatus.PUBLISHED ? (
        <form action={archiveCourseAction}>
          <HiddenActionFields course={course} />
          <ActionButton type="submit" variant="danger">
            Archive
          </ActionButton>
        </form>
      ) : null}
    </div>
  );
}

function ReviewDetailHeader({
  canPublish,
  course,
}: {
  canPublish: boolean;
  course: ReviewCourseSummary;
}) {
  return (
    <section className="overflow-hidden rounded-[28px] border border-design-border bg-deep-navy p-6 text-white shadow-hero lg:p-8">
      <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_380px] xl:items-center">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge label={course.statusLabel} tone={course.statusTone} />
            <StatusBadge
              label={course.readinessErrors > 0 ? "Needs fixes" : "Ready"}
              tone={course.readinessErrors > 0 ? "red" : "green"}
            />
          </div>
          <h1 className="mt-5 text-4xl font-semibold leading-tight sm:text-5xl">
            Review Course
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-white/75">
            Inspect readiness, preview the course, and make a traceable review
            decision.
          </p>
          <p className="mt-5 max-w-3xl text-sm font-semibold leading-6 text-white">
            {course.title}
          </p>
          <div className="mt-7">
            <ReviewActions canPublish={canPublish} course={course} />
          </div>
        </div>

        <article className="rounded-[24px] border border-white/15 bg-white/10 p-5">
          <p className="text-sm font-semibold text-dec-green">Readiness</p>
          <h2 className="mt-3 text-2xl font-semibold leading-tight">
            {course.readinessErrors > 0 ? "Blocked from publishing" : "No blocking issues"}
          </h2>
          <dl className="mt-6 grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-[16px] bg-white/10 p-3">
              <dt className="text-white/65">Blockers</dt>
              <dd className="mt-1 text-2xl font-semibold text-white">{course.readinessErrors}</dd>
            </div>
            <div className="rounded-[16px] bg-white/10 p-3">
              <dt className="text-white/65">Warnings</dt>
              <dd className="mt-1 text-2xl font-semibold text-white">{course.readinessWarnings}</dd>
            </div>
          </dl>
        </article>
      </div>
    </section>
  );
}

function CourseSummaryPanel({ course }: { course: ReviewCourseSummary }) {
  const items = [
    ["Creator", course.assignedCreator],
    ["Capacity area", course.capacityArea],
    ["Lessons", String(course.lessonCount)],
    ["Resources", String(course.resourceCount)],
    ["Final test", course.finalTestLabel],
    ["Certificate", course.certificateEligibleLabel],
    ["Version", course.versionNumber ? `v${course.versionNumber}` : "Current"],
    ["Status", course.statusLabel],
  ];

  return (
    <Panel
      description="Core course facts used in the review decision."
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

function ReadinessPanel({ course }: { course: ReviewCourseSummary }) {
  return (
    <Panel
      description="Blocking items prevent submit or publish. Warnings are still visible for quality review."
      title="Readiness checks"
    >
      <ul className="space-y-3">
        {course.readinessItems.map((item) => (
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

function ReturnForRevisionPanel({ course }: { course: ReviewCourseSummary }) {
  if (
    course.status !== CourseStatus.READY_FOR_REVIEW &&
    course.status !== CourseStatus.APPROVED
  ) {
    return null;
  }

  return (
    <Panel
      description="Add a concise note for the creator when returning a course."
      title="Return for revision"
    >
      <form action={returnCourseForRevisionAction} className="space-y-4">
        <HiddenActionFields course={course} />
        <label className="block text-sm font-semibold text-dark-ink" htmlFor="review-detail-return-comment">
          Reviewer note
          <textarea
            className="mt-2 min-h-28 w-full rounded-control border border-design-border bg-white px-4 py-3 text-sm leading-6 text-dark-ink outline-none transition focus:border-dec-blue focus:ring-4 focus:ring-dec-blue/20"
            id="review-detail-return-comment"
            name="comment"
            placeholder="Summarize the required revision."
          />
        </label>
        <ActionButton type="submit" variant="secondary">
          Return Course
        </ActionButton>
      </form>
    </Panel>
  );
}

function AuditHistoryPanel({ detail }: { detail: ReviewCourseDetail }) {
  return (
    <Panel
      description="Recent status and course activity recorded for this course."
      title="Review history"
    >
      {detail.auditEntries.length > 0 ? (
        <ol className="space-y-3">
          {detail.auditEntries.map((entry) => (
            <li className="rounded-[18px] border border-design-border bg-soft-bg p-4" key={entry.id}>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-sm font-semibold text-dark-ink">{entry.actionLabel}</p>
                  <p className="mt-1 text-sm leading-6 text-muted-text">{entry.description}</p>
                </div>
                <StatusBadge label={entry.statusLabel} tone={entry.statusTone} />
              </div>
              <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-text">Actor</dt>
                  <dd className="mt-1 font-semibold text-dark-ink">{entry.actorName}</dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-text">Time</dt>
                  <dd className="mt-1 font-semibold text-dark-ink">{entry.createdAtLabel}</dd>
                </div>
              </dl>
            </li>
          ))}
        </ol>
      ) : (
        <EmptyState
          description="Status actions for this course will appear after review activity starts."
          title="No review history yet"
        />
      )}
    </Panel>
  );
}

export function AdminReviewDetail({
  canPublish,
  detail,
  reviewNotice,
}: {
  canPublish: boolean;
  detail: ReviewCourseDetail;
  reviewNotice?: string;
}) {
  return (
    <div className="space-y-6">
      <Notice notice={reviewNotice} />
      <ReviewDetailHeader canPublish={canPublish} course={detail.course} />

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px] xl:items-start">
        <div className="space-y-6">
          <CourseSummaryPanel course={detail.course} />
          <ReadinessPanel course={detail.course} />
          <AuditHistoryPanel detail={detail} />
        </div>

        <aside className="space-y-6">
          <ReturnForRevisionPanel course={detail.course} />
          <aside className="rounded-[24px] border border-dec-green/30 bg-dec-green/15 p-6 shadow-soft">
            <StatusBadge label="Publishing note" tone="green" />
            <p className="mt-4 text-sm leading-7 text-[#426f1c]">
              Publishing remains admin-only and requires no blocking readiness
              issues.
            </p>
          </aside>
        </aside>
      </section>
    </div>
  );
}
