import { submitCourseForReviewAction } from "@/lib/review-actions";
import {
  reviewNoticeLabels,
  type ReviewCourseSummary,
} from "@/lib/review-workflow";
import { ActionButton, AlertMessage, StatusBadge } from "@/components/ui";
import { CreatorCourseContextBar } from "./CreatorCourseContextBar";
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

  const tone = ["submitted", "approved", "published"].includes(notice)
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

function SubmitHeader({
  course,
}: {
  course: ReviewCourseSummary;
}) {
  const canSubmit =
    (course.status === CourseStatus.DRAFT ||
      course.status === CourseStatus.RETURNED_FOR_REVISION) &&
    course.readinessErrors === 0;

  return (
    <section className="overflow-hidden rounded-[28px] border border-design-border bg-deep-navy p-6 text-white shadow-hero lg:p-8">
      <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_360px] xl:items-center">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge label={course.statusLabel} tone={course.statusTone} />
            <StatusBadge
              label={course.readinessErrors > 0 ? "Needs fixes" : "Ready for review"}
              tone={course.readinessErrors > 0 ? "red" : "green"}
            />
          </div>
          <h1 className="mt-5 text-4xl font-semibold leading-tight sm:text-5xl">
            Submit / Feedback
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-white/75">
            Review course readiness and share the course package with the
            quality review team.
          </p>
          <p className="mt-5 max-w-2xl text-sm font-semibold leading-6 text-white">
            {course.title}
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <form action={submitCourseForReviewAction}>
              <input name="courseId" type="hidden" value={course.id} />
              <input name="returnPath" type="hidden" value={course.submitHref} />
              <ActionButton disabled={!canSubmit} size="lg" type="submit">
                Submit for Review
              </ActionButton>
            </form>
            <ActionButton
              className="bg-white text-deep-navy hover:text-dec-blue"
              href={`/creator/courses/${course.id}/preview`}
              size="lg"
              variant="secondary"
            >
              <span className="text-deep-navy">Back to Preview</span>
            </ActionButton>
            <ActionButton
              className="text-white hover:bg-white/10 hover:text-white"
              href="/creator/courses"
              size="lg"
              variant="ghost"
            >
              Back to My Courses
            </ActionButton>
          </div>
        </div>

        <article className="rounded-[24px] border border-white/15 bg-white/10 p-5">
          <p className="text-sm font-semibold text-dec-green">Course package</p>
          <h2 className="mt-3 text-2xl font-semibold leading-tight">
            {course.readinessErrors > 0
              ? "Fix blocking items before review."
              : "Ready to send for quality review."}
          </h2>
          <p className="mt-3 text-sm leading-6 text-white/70">
            Required issues block submission. Warnings can be reviewed with the
            quality team.
          </p>
          <dl className="mt-6 grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-[16px] bg-white/10 p-3">
              <dt className="text-white/65">Blocking items</dt>
              <dd className="mt-1 text-2xl font-semibold text-white">
                {course.readinessErrors}
              </dd>
            </div>
            <div className="rounded-[16px] bg-white/10 p-3">
              <dt className="text-white/65">Warnings</dt>
              <dd className="mt-1 text-2xl font-semibold text-white">
                {course.readinessWarnings}
              </dd>
            </div>
          </dl>
        </article>
      </div>
    </section>
  );
}

function SubmissionReadinessCard({ course }: { course: ReviewCourseSummary }) {
  return (
    <Panel
      description="Required items must be clear before the course can enter quality review."
      title="Submission readiness"
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

function ReviewPackageSummaryCard({ course }: { course: ReviewCourseSummary }) {
  const packageSummary = [
    ["Course title", course.title],
    ["Capacity area", course.capacityArea],
    ["Creator", course.assignedCreator],
    ["Lessons", String(course.lessonCount)],
    ["Resources", String(course.resourceCount)],
    ["Final test", course.finalTestLabel],
    ["Certificate", course.certificateEligibleLabel],
    ["Status", course.statusLabel],
  ];

  return (
    <Panel
      description="These course details support a focused quality review."
      title="Review package summary"
    >
      <dl className="grid gap-3 md:grid-cols-2">
        {packageSummary.map(([label, value]) => (
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

function FeedbackPanel({ course }: { course: ReviewCourseSummary }) {
  return (
    <Panel
      description="Reviewer feedback appears here when the course is returned for revision."
      title="Review feedback"
    >
      {course.reviewerFeedback ? (
        <div className="rounded-[22px] border border-amber-200 bg-amber-50 p-5">
          <StatusBadge label="Returned guidance" tone="gold" />
          <p className="mt-4 text-sm leading-7 text-orange-800">
            {course.reviewerFeedback}
          </p>
        </div>
      ) : (
        <div className="rounded-[22px] border border-dashed border-design-border bg-soft-bg p-6 text-center">
          <StatusBadge label="No feedback yet" tone="gray" />
          <h3 className="mt-4 text-xl font-semibold text-deep-navy">
            No feedback yet
          </h3>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-muted-text">
            Reviewer feedback will appear here after the course has been reviewed.
          </p>
        </div>
      )}
    </Panel>
  );
}

function SubmitNoteCard() {
  return (
    <aside className="rounded-[24px] border border-dec-blue/25 bg-dec-blue/10 p-6 shadow-soft">
      <StatusBadge label="Submit note" tone="blue" />
      <p className="mt-4 text-sm leading-7 text-[#26536c]">
        Preview the course from the participant perspective before submission,
        especially any final test and certificate guidance.
      </p>
    </aside>
  );
}

function ReadinessDecisionCard({ course }: { course: ReviewCourseSummary }) {
  const ready = course.readinessErrors === 0;

  return (
    <section className="rounded-[24px] border border-design-border bg-white-surface p-6 shadow-soft">
      <StatusBadge label="Readiness decision" tone={ready ? "green" : "gold"} />
      <h2 className="mt-4 text-xl font-semibold leading-tight text-deep-navy">
        {ready ? "Ready to submit" : "Resolve required items"}
      </h2>
      <p className="mt-4 text-sm leading-7 text-muted-text">
        {ready
          ? "The required checks are clear. Warnings can be discussed during review."
          : "Submission is paused until blocking readiness items are fixed."}
      </p>
    </section>
  );
}

export function CreatorSubmitFeedback({
  course,
  reviewNotice,
}: {
  course: ReviewCourseSummary;
  reviewNotice?: string;
}) {
  return (
    <div className="space-y-6">
      <Notice notice={reviewNotice} />
      <SubmitHeader course={course} />
      <CreatorCourseContextBar
        ariaLabel="Submit and feedback context"
        items={[
          { label: "Current status", value: course.statusLabel },
          { label: "Readiness", value: course.readinessErrors > 0 ? "Needs fixes" : "Ready" },
          { label: "Final test", value: course.finalTestLabel },
          { label: "Lessons", value: String(course.lessonCount) },
          { label: "Current step", value: "Submit / Feedback" },
        ]}
      />

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px] xl:items-start">
        <div className="space-y-6">
          <SubmissionReadinessCard course={course} />
          <ReviewPackageSummaryCard course={course} />
          <FeedbackPanel course={course} />
        </div>

        <aside className="space-y-6">
          <SubmitNoteCard />
          <ReadinessDecisionCard course={course} />
        </aside>
      </section>
    </div>
  );
}
