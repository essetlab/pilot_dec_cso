import {
  approveCourseAction,
  archiveCourseAction,
  publishCourseAction,
  returnCourseForRevisionAction,
  unpublishCourseAction,
} from "@/lib/review-actions";
import {
  reviewNoticeLabels,
  type ReviewCourseSummary,
  type ReviewQueueData,
} from "@/lib/review-workflow";
import { ActionButton, AlertMessage, EmptyState, FilterBar, MetricCard, StatusBadge } from "@/components/ui";
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

function MetricIcon({
  children,
  tone,
}: {
  children: string;
  tone: "blue" | "green" | "orange" | "gray";
}) {
  if (tone === "green") {
    return <span className="text-sm font-bold text-[#426f1c]">{children}</span>;
  }

  if (tone === "orange") {
    return <span className="text-sm font-bold text-orange-700">{children}</span>;
  }

  if (tone === "gray") {
    return <span className="text-sm font-bold text-muted-text">{children}</span>;
  }

  return <span className="text-sm font-bold text-[#216f9d]">{children}</span>;
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

function ReviewHeader({ queueCount }: { queueCount: number }) {
  return (
    <section className="overflow-hidden rounded-[28px] border border-design-border bg-deep-navy p-6 text-white shadow-hero lg:p-8">
      <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_360px] xl:items-center">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge label="Quality review" tone="blue" />
            <StatusBadge label="Admin workspace" tone="green" />
          </div>
          <h1 className="mt-5 text-4xl font-semibold leading-tight sm:text-5xl">
            Review / Publish
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-white/75">
            Review submitted courses, approve or return them, and publish only
            when the course is ready for participants.
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <ActionButton href="/admin/courses" size="lg">
              View Courses
            </ActionButton>
            <ActionButton
              className="bg-white text-deep-navy hover:text-dec-blue"
              href="/admin"
              size="lg"
              variant="secondary"
            >
              <span className="text-deep-navy">Back to Dashboard</span>
            </ActionButton>
          </div>
        </div>

        <article className="rounded-[24px] border border-white/15 bg-white/10 p-5">
          <p className="text-sm font-semibold text-dec-green">Review context</p>
          <h2 className="mt-3 text-2xl font-semibold leading-tight">
            Keep publishing decisions traceable.
          </h2>
          <p className="mt-3 text-sm leading-6 text-white/70">
            Every status action records an audit log entry and keeps unpublished
            courses hidden from participants.
          </p>
          <dl className="mt-6 grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-[16px] bg-white/10 p-3">
              <dt className="text-white/65">Review queue</dt>
              <dd className="mt-1 text-2xl font-semibold text-white">{queueCount}</dd>
            </div>
            <div className="rounded-[16px] bg-white/10 p-3">
              <dt className="text-white/65">Status</dt>
              <dd className="mt-1 text-2xl font-semibold text-white">Live</dd>
            </div>
          </dl>
        </article>
      </div>
    </section>
  );
}

function ReviewMetricGrid({ metrics }: { metrics: ReviewQueueData["metrics"] }) {
  const reviewMetrics = [
    {
      helperText: "Courses waiting for quality review",
      label: "Ready for review",
      tone: "blue",
      value: metrics.readyForReview,
    },
    {
      helperText: "Courses returned with feedback",
      label: "Returned",
      tone: "orange",
      value: metrics.returned,
    },
    {
      helperText: "Courses cleared for release",
      label: "Approved",
      tone: "green",
      value: metrics.approved,
    },
    {
      helperText: "Available to participants",
      label: "Published",
      tone: "green",
      value: metrics.published,
    },
  ] as const;

  return (
    <section aria-labelledby="review-summary-heading" className="space-y-4">
      <div>
        <h2 className="text-2xl font-semibold leading-tight text-dark-ink" id="review-summary-heading">
          Review summary
        </h2>
        <p className="mt-2 text-sm leading-6 text-muted-text">
          A concise view of course readiness, review progress, and participant
          availability.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {reviewMetrics.map((metric, index) => (
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

function SelectControl({
  label,
  options,
}: {
  label: string;
  options: string[];
}) {
  const id = `admin-review-${label.toLowerCase().replaceAll(" ", "-")}`;

  return (
    <label className="block min-w-40 text-sm font-semibold text-dark-ink" htmlFor={id}>
      {label}
      <select
        className="mt-2 min-h-11 w-full rounded-control border border-design-border bg-white px-4 text-sm text-dark-ink outline-none transition focus:border-dec-blue focus:ring-4 focus:ring-dec-blue/20"
        defaultValue={options[0]}
        id={id}
        name={id}
      >
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </label>
  );
}

function ReviewFilterCard() {
  return (
    <FilterBar
      actions={
        <>
          <ActionButton type="button" variant="secondary">
            Reset
          </ActionButton>
          <ActionButton type="button">Apply Filters</ActionButton>
        </>
      }
      filters={
        <>
          <SelectControl
            label="Status"
            options={["All statuses", "Ready for review", "Returned", "Approved", "Published"]}
          />
          <SelectControl
            label="Readiness"
            options={["All readiness", "No blockers", "Has blockers", "Has warnings"]}
          />
          <SelectControl
            label="Certificate"
            options={["All courses", "Certificate eligible", "No certificate"]}
          />
        </>
      }
      search={
        <label className="block text-sm font-semibold text-dark-ink" htmlFor="admin-review-search">
          Search courses
          <input
            aria-label="Search courses"
            className="mt-2 min-h-11 w-full rounded-control border border-design-border bg-white px-4 text-sm text-dark-ink outline-none transition focus:border-dec-blue focus:ring-4 focus:ring-dec-blue/20"
            id="admin-review-search"
            name="admin-review-search"
            type="search"
          />
        </label>
      }
    />
  );
}

function HiddenActionFields({ course }: { course: ReviewCourseSummary }) {
  return (
    <>
      <input name="courseId" type="hidden" value={course.id} />
      <input name="returnPath" type="hidden" value="/admin/review" />
    </>
  );
}

function QueueActions({
  canPublish,
  course,
}: {
  canPublish: boolean;
  course: ReviewCourseSummary;
}) {
  const hasBlockers = course.readinessErrors > 0;

  return (
    <div className="flex flex-wrap gap-2">
      <ActionButton href={course.href} size="sm" variant="ghost">
        View
      </ActionButton>
      <ActionButton href={`/creator/courses/${course.id}/preview`} size="sm" variant="secondary">
        Preview
      </ActionButton>
      {course.status === CourseStatus.READY_FOR_REVIEW ? (
        <form action={approveCourseAction}>
          <HiddenActionFields course={course} />
          <ActionButton disabled={hasBlockers} size="sm" type="submit" variant="success">
            Approve
          </ActionButton>
        </form>
      ) : null}
      {canPublish && (course.status === CourseStatus.APPROVED || course.status === CourseStatus.UNPUBLISHED) ? (
        <form action={publishCourseAction}>
          <HiddenActionFields course={course} />
          <ActionButton disabled={hasBlockers} size="sm" type="submit">
            Publish
          </ActionButton>
        </form>
      ) : null}
      {canPublish && course.status === CourseStatus.PUBLISHED ? (
        <form action={unpublishCourseAction}>
          <HiddenActionFields course={course} />
          <ActionButton size="sm" type="submit" variant="ghost">
            Unpublish
          </ActionButton>
        </form>
      ) : null}
    </div>
  );
}

function ReviewQueueTable({
  canPublish,
  courses,
}: {
  canPublish: boolean;
  courses: ReviewCourseSummary[];
}) {
  if (courses.length === 0) {
    return (
      <Panel title="Review queue">
        <EmptyState
          description="Submitted, approved, unpublished, and published courses will appear here."
          title="No courses are waiting for review."
        />
      </Panel>
    );
  }

  return (
    <Panel
      description="Review submitted and active course records with the course owner, readiness status, final test setup, and certificate eligibility."
      title="Review queue"
    >
      <div className="hidden overflow-x-auto rounded-[20px] border border-design-border lg:block">
        <table className="w-full min-w-[1040px] border-collapse bg-white text-left text-sm">
          <thead className="bg-soft-bg text-xs font-semibold uppercase tracking-[0.12em] text-muted-text">
            <tr>
              <th className="px-4 py-4">Course title</th>
              <th className="px-4 py-4">Status</th>
              <th className="px-4 py-4">Creator</th>
              <th className="px-4 py-4">Capacity area</th>
              <th className="px-4 py-4">Lessons</th>
              <th className="px-4 py-4">Resources</th>
              <th className="px-4 py-4">Final test</th>
              <th className="px-4 py-4">Readiness</th>
              <th className="px-4 py-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-design-border">
            {courses.map((course) => (
              <tr className="align-top" key={course.id}>
                <td className="px-4 py-4">
                  <p className="font-semibold leading-6 text-dark-ink">{course.title}</p>
                </td>
                <td className="px-4 py-4">
                  <StatusBadge label={course.statusLabel} tone={course.statusTone} />
                </td>
                <td className="px-4 py-4 text-muted-text">{course.assignedCreator}</td>
                <td className="px-4 py-4 text-muted-text">{course.capacityArea}</td>
                <td className="px-4 py-4 text-muted-text">{course.lessonCount}</td>
                <td className="px-4 py-4 text-muted-text">{course.resourceCount}</td>
                <td className="px-4 py-4 text-muted-text">{course.finalTestLabel}</td>
                <td className="px-4 py-4">
                  <StatusBadge
                    label={
                      course.readinessErrors > 0
                        ? `${course.readinessErrors} blockers`
                        : course.readinessWarnings > 0
                          ? `${course.readinessWarnings} warnings`
                          : "Ready"
                    }
                    tone={
                      course.readinessErrors > 0
                        ? "red"
                        : course.readinessWarnings > 0
                          ? "gold"
                          : "green"
                    }
                  />
                </td>
                <td className="px-4 py-4">
                  <QueueActions canPublish={canPublish} course={course} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-5 grid gap-4 lg:hidden">
        {courses.map((course) => (
          <article className="rounded-[20px] border border-design-border bg-soft-bg p-4" key={course.id}>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h3 className="text-base font-semibold leading-6 text-dark-ink">
                  {course.title}
                </h3>
                <p className="mt-1 text-sm leading-6 text-muted-text">{course.assignedCreator}</p>
              </div>
              <StatusBadge label={course.statusLabel} tone={course.statusTone} />
            </div>
            <dl className="mt-4 grid gap-3 sm:grid-cols-2">
              {[
                ["Capacity area", course.capacityArea],
                ["Lessons", String(course.lessonCount)],
                ["Resources", String(course.resourceCount)],
                ["Final test", course.finalTestLabel],
                ["Certificate", course.certificateEligibleLabel],
              ].map(([label, value]) => (
                <div key={label}>
                  <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-text">
                    {label}
                  </dt>
                  <dd className="mt-1 text-sm font-semibold leading-6 text-dark-ink">
                    {value}
                  </dd>
                </div>
              ))}
            </dl>
            <div className="mt-4">
              <QueueActions canPublish={canPublish} course={course} />
            </div>
          </article>
        ))}
      </div>
    </Panel>
  );
}

function SelectedCourseReviewCard({
  canPublish,
  course,
}: {
  canPublish: boolean;
  course: ReviewCourseSummary | null;
}) {
  if (!course) {
    return (
      <EmptyState
        description="Submitted courses will appear here when creators send them for review."
        title="No selected course"
      />
    );
  }

  const selectedCourseItems = [
    ["Course title", course.title],
    ["Creator", course.assignedCreator],
    ["Capacity area", course.capacityArea],
    ["Lessons", String(course.lessonCount)],
    ["Resources", String(course.resourceCount)],
    ["Final test", course.finalTestLabel],
    ["Certificate", course.certificateEligibleLabel],
    ["Readiness status", course.readinessErrors > 0 ? "Needs fixes" : "Ready"],
  ];

  return (
    <Panel
      description="Selected course readiness summary before the next review decision."
      title="Selected course review"
    >
      <article className="rounded-[22px] border border-dec-blue/25 bg-dec-blue/10 p-5">
        <div className="flex flex-wrap gap-2">
          <StatusBadge label="Selected" tone="blue" />
          <StatusBadge label={course.statusLabel} tone={course.statusTone} />
        </div>
        <h3 className="mt-4 text-xl font-semibold leading-tight text-deep-navy">
          {course.title}
        </h3>
        <dl className="mt-5 grid gap-3">
          {selectedCourseItems.map(([label, value]) => (
            <div className="rounded-[16px] bg-white/85 p-4" key={label}>
              <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-text">
                {label}
              </dt>
              <dd className="mt-2 text-sm font-semibold leading-6 text-dark-ink">
                {value}
              </dd>
            </div>
          ))}
        </dl>
        <div className="mt-5 flex flex-wrap gap-2">
          <QueueActions canPublish={canPublish} course={course} />
        </div>
      </article>
    </Panel>
  );
}

function ReviewChecklistCard({ course }: { course: ReviewCourseSummary | null }) {
  return (
    <Panel
      description="Course quality checks reviewers can scan before a decision."
      title="Review checklist"
    >
      {course ? (
        <ul className="space-y-4">
          {course.readinessItems.map((item) => (
            <li className="flex gap-3" key={`${item.label}-${item.status}`}>
              <StatusBadge label={item.status} tone={item.tone} />
              <span className="text-sm leading-6 text-muted-text">{item.label}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm leading-6 text-muted-text">
          Select a course from the review queue to inspect readiness.
        </p>
      )}
    </Panel>
  );
}

function RevisionCommentCard({ course }: { course: ReviewCourseSummary | null }) {
  if (
    !course ||
    (course.status !== CourseStatus.READY_FOR_REVIEW &&
      course.status !== CourseStatus.APPROVED)
  ) {
    return null;
  }

  return (
    <section className="rounded-[24px] border border-amber-200 bg-amber-50 p-6 shadow-soft">
      <StatusBadge label="Return for revision" tone="gold" />
      <form action={returnCourseForRevisionAction} className="mt-4 space-y-4">
        <HiddenActionFields course={course} />
        <label className="block text-sm font-semibold text-dark-ink" htmlFor="review-return-comment">
          Reviewer note
          <textarea
            className="mt-2 min-h-28 w-full rounded-control border border-amber-200 bg-white px-4 py-3 text-sm leading-6 text-dark-ink outline-none transition focus:border-dec-blue focus:ring-4 focus:ring-dec-blue/20"
            id="review-return-comment"
            name="comment"
            placeholder="Summarize the required revision."
          />
        </label>
        <ActionButton type="submit" variant="secondary">
          Return Course
        </ActionButton>
      </form>
    </section>
  );
}

function ArchiveCourseCard({ course }: { course: ReviewCourseSummary | null }) {
  if (!course || course.status === CourseStatus.PUBLISHED) {
    return null;
  }

  return (
    <aside className="rounded-[24px] border border-red-200 bg-red-50 p-6 shadow-soft">
      <StatusBadge label="Archive option" tone="red" />
      <p className="mt-4 text-sm leading-7 text-red-800">
        Archive only when this course should leave the active review queue.
      </p>
      <form action={archiveCourseAction} className="mt-4">
        <HiddenActionFields course={course} />
        <ActionButton type="submit" variant="danger">
          Archive
        </ActionButton>
      </form>
    </aside>
  );
}

export function AdminReview({
  canPublish,
  data,
  reviewNotice,
}: {
  canPublish: boolean;
  data: ReviewQueueData;
  reviewNotice?: string;
}) {
  return (
    <div className="space-y-6">
      <Notice notice={reviewNotice} />
      <ReviewHeader queueCount={data.courses.length} />
      <ReviewMetricGrid metrics={data.metrics} />
      <ReviewFilterCard />

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px] xl:items-start">
        <div className="space-y-6">
          <ReviewQueueTable canPublish={canPublish} courses={data.courses} />
        </div>

        <aside className="space-y-6">
          <SelectedCourseReviewCard canPublish={canPublish} course={data.selectedCourse} />
          <ReviewChecklistCard course={data.selectedCourse} />
          <RevisionCommentCard course={data.selectedCourse} />
          {canPublish ? <ArchiveCourseCard course={data.selectedCourse} /> : null}
        </aside>
      </section>
    </div>
  );
}
