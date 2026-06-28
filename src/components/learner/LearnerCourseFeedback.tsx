"use client";

import { useState, useTransition } from "react";
import type { ReactNode } from "react";
import { ActionButton, SectionHeader, StatusBadge } from "@/components/ui";
import type { LearnerCourseDetail } from "@/lib/course-types";
import type { CourseFeedbackState } from "@/lib/feedback-workflow";
import { submitCourseFeedbackAction } from "@/lib/learner-actions";

function GuidanceCard({
  children,
  title,
}: {
  children: ReactNode;
  title: string;
}) {
  return (
    <article className="rounded-[24px] border border-design-border bg-white-surface p-6 shadow-soft">
      <h2 className="text-xl font-semibold text-dark-ink">{title}</h2>
      <div className="mt-4 text-sm leading-7 text-muted-text">{children}</div>
    </article>
  );
}

function RatingRadioGroup({
  label,
  value,
  onChange,
  error,
  disabled,
}: {
  label: string;
  value: number | null;
  onChange: (val: number) => void;
  error?: boolean;
  disabled?: boolean;
}) {
  return (
    <div className="rounded-card border border-design-border bg-white-surface p-5 shadow-soft">
      <h3 className="text-sm font-semibold text-deep-navy">{label}</h3>
      <div className="mt-4 flex flex-wrap gap-3">
        {[1, 2, 3, 4, 5].map((num) => {
          const isSelected = value === num;
          return (
            <button
              key={num}
              type="button"
              disabled={disabled}
              onClick={() => onChange(num)}
              className={`flex size-11 items-center justify-center rounded-full text-base font-semibold border transition-all ${
                isSelected
                  ? "bg-dec-blue border-dec-blue text-white shadow-soft"
                  : "bg-white border-design-border text-dark-ink hover:border-dec-blue/60 hover:bg-dec-blue/5"
              } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {num}
            </button>
          );
        })}
      </div>
      {error && (
        <p className="mt-2 text-xs font-semibold text-red-600">
          Please select a rating between 1 and 5.
        </p>
      )}
    </div>
  );
}

function formatFeedbackDate(value: string | null) {
  if (!value) {
    return "recently";
  }

  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
  }).format(new Date(value));
}

export function LearnerCourseFeedback({
  course,
  feedbackState,
}: {
  course: LearnerCourseDetail;
  feedbackState: CourseFeedbackState;
}) {
  const [rating, setRating] = useState<number | null>(null);
  const [usefulness, setUsefulness] = useState<number | null>(null);
  const [clarity, setClarity] = useState<number | null>(null);
  const [hasAccessibilityIssue, setHasAccessibilityIssue] = useState<boolean | null>(null);
  const [comment, setComment] = useState<string>("");

  const [isSubmitted, setIsSubmitted] = useState<boolean>(feedbackState.status === "submitted");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const [showRatingError, setShowRatingError] = useState(false);
  const [showUsefulnessError, setShowUsefulnessError] = useState(false);
  const [showClarityError, setShowClarityError] = useState(false);
  const [showAccError, setShowAccError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (feedbackState.status !== "eligible") {
      setErrorMsg(feedbackState.message);
      return;
    }

    let hasErrors = false;
    if (rating === null) {
      setShowRatingError(true);
      hasErrors = true;
    } else {
      setShowRatingError(false);
    }

    if (usefulness === null) {
      setShowUsefulnessError(true);
      hasErrors = true;
    } else {
      setShowUsefulnessError(false);
    }

    if (clarity === null) {
      setShowClarityError(true);
      hasErrors = true;
    } else {
      setShowClarityError(false);
    }

    if (hasAccessibilityIssue === null) {
      setShowAccError(true);
      hasErrors = true;
    } else {
      setShowAccError(false);
    }

    if (hasErrors) {
      setErrorMsg("Please complete all required fields before submitting.");
      return;
    }

    setErrorMsg(null);
    startTransition(async () => {
      const formData = new FormData();
      formData.append("courseSlug", course.slug);
      formData.append("rating", String(rating));
      formData.append("usefulnessRating", String(usefulness));
      formData.append("clarityRating", String(clarity));
      formData.append("accessibilityIssue", hasAccessibilityIssue ? "yes" : "no");
      formData.append("comment", comment);

      const result = await submitCourseFeedbackAction(formData);

      if (result.success) {
        setIsSubmitted(true);
      } else {
        setErrorMsg(result.error || "Failed to submit feedback. Please try again.");
      }
    });
  };

  if (isSubmitted) {
    return (
      <div className="space-y-8">
        <div className="overflow-hidden rounded-[28px] border border-design-border bg-white-surface shadow-card p-6 lg:p-8 text-center max-w-2xl mx-auto my-8">
          <span className="inline-flex size-16 items-center justify-center rounded-full bg-dec-green/20 text-dec-green text-3xl mb-4" role="img" aria-label="Success">
            ✨
          </span>
          <h1 className="text-3xl font-bold text-deep-navy">Feedback Submitted</h1>
          <p className="mt-4 text-base leading-7 text-[#26536c] font-medium">
            Thank you. Your feedback will help improve this course.
          </p>
          <p className="mt-2 text-sm font-semibold text-muted-text">
            Submitted {formatFeedbackDate(feedbackState.submittedAt)}
          </p>
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
            <ActionButton href={`/learn/courses/${course.slug}`} variant="success">
              Go to Course
            </ActionButton>
            <ActionButton href="/learn" variant="secondary">
              Go to Dashboard
            </ActionButton>
          </div>
        </div>
      </div>
    );
  }

  if (feedbackState.status === "locked") {
    return (
      <div className="space-y-8">
        <section className="overflow-hidden rounded-[28px] border border-design-border bg-white-surface shadow-card p-6 lg:p-8">
          <div className="flex flex-wrap gap-2">
            <StatusBadge label={course.capacityArea} tone="blue" />
            <StatusBadge label="Feedback locked" tone="gold" />
          </div>
          <h1 className="mt-4 max-w-4xl text-3xl font-semibold leading-tight text-deep-navy sm:text-4xl">
            Course Feedback: {course.title}
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-text">
            {feedbackState.message}
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <ActionButton href={`/learn/courses/${course.slug}`} variant="primary">
              Continue Course
            </ActionButton>
            <ActionButton href={`/learn/courses/${course.slug}/final-test`} variant="secondary">
              Open Final Test
            </ActionButton>
          </div>
        </section>

        <GuidanceCard title="Feedback opens after learning activity">
          <p className="text-xs leading-6 text-[#26536c]">
            Feedback is collected after course completion or final test activity so the course team can use informed participant input.
          </p>
        </GuidanceCard>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Card */}
      <section className="overflow-hidden rounded-[28px] border border-design-border bg-white-surface shadow-card p-6 lg:p-8">
        <div className="flex flex-wrap gap-2">
          <StatusBadge label={course.capacityArea} tone="blue" />
          <StatusBadge label="Course Feedback" tone="green" />
        </div>
        <h1 className="mt-4 max-w-4xl text-3xl font-semibold leading-tight text-deep-navy sm:text-4xl">
          Course Feedback: {course.title}
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-text">
          Please take a moment to share your feedback. Your ratings and suggestions directly contribute to improvements in our capacity development courses.
        </p>
      </section>

      <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
        <form onSubmit={handleSubmit} className="space-y-6">
          <SectionHeader
            description="Provide your honest rating on the learning materials, accessibility, and utility."
            title="Feedback Questionnaire"
          />

          {errorMsg && (
            <div className="rounded-[16px] border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-800">
              {errorMsg}
            </div>
          )}

          {/* Rating 1: Overall */}
          <RatingRadioGroup
            label="1. How would you rate the overall quality of this course?"
            value={rating}
            onChange={(val) => {
              setRating(val);
              setShowRatingError(false);
            }}
            error={showRatingError}
            disabled={isPending}
          />

          {/* Rating 2: Usefulness */}
          <RatingRadioGroup
            label="2. How useful was the course content for your day-to-day work?"
            value={usefulness}
            onChange={(val) => {
              setUsefulness(val);
              setShowUsefulnessError(false);
            }}
            error={showUsefulnessError}
            disabled={isPending}
          />

          {/* Rating 3: Clarity */}
          <RatingRadioGroup
            label="3. How clear and easy to follow were the lessons and modules?"
            value={clarity}
            onChange={(val) => {
              setClarity(val);
              setShowClarityError(false);
            }}
            error={showClarityError}
            disabled={isPending}
          />

          {/* Rating 4: Accessibility Issues */}
          <div className="rounded-card border border-design-border bg-white-surface p-5 shadow-soft">
            <h3 className="text-sm font-semibold text-deep-navy">
              4. Did you encounter any accessibility or usability issues?
            </h3>
            <div className="mt-4 flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer text-sm font-semibold text-dark-ink">
                <input
                  type="radio"
                  name="accessibilityIssue"
                  disabled={isPending}
                  checked={hasAccessibilityIssue === true}
                  onChange={() => {
                    setHasAccessibilityIssue(true);
                    setShowAccError(false);
                  }}
                  className="size-4 accent-dec-blue"
                />
                Yes
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-sm font-semibold text-dark-ink">
                <input
                  type="radio"
                  name="accessibilityIssue"
                  disabled={isPending}
                  checked={hasAccessibilityIssue === false}
                  onChange={() => {
                    setHasAccessibilityIssue(false);
                    setShowAccError(false);
                  }}
                  className="size-4 accent-dec-blue"
                />
                No
              </label>
            </div>
            {showAccError && (
              <p className="mt-2 text-xs font-semibold text-red-600">
                Please select Yes or No.
              </p>
            )}
          </div>

          {/* Comment & Suggestions */}
          <div className="rounded-card border border-design-border bg-white-surface p-5 shadow-soft">
            <label htmlFor="feedback-comment" className="text-sm font-semibold text-deep-navy block">
              5. Do you have any suggestions for improving this course? (Optional)
            </label>
            <textarea
              id="feedback-comment"
              rows={4}
              disabled={isPending}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share details about what you liked, or suggest changes..."
              className="mt-3 w-full rounded-control border border-design-border bg-white p-3 text-sm text-dark-ink outline-none transition focus:border-dec-blue focus:ring-4 focus:ring-dec-blue/20"
            />
          </div>

          <div className="flex gap-4">
            <ActionButton type="submit" variant="success" disabled={isPending}>
              {isPending ? "Submitting..." : "Submit Feedback"}
            </ActionButton>
            <ActionButton href={`/learn/courses/${course.slug}`} variant="secondary" disabled={isPending}>
              Cancel
            </ActionButton>
          </div>
        </form>

        <aside className="space-y-5 lg:sticky lg:top-6">
          <GuidanceCard title="Why your feedback matters">
            <p className="text-xs leading-6 text-[#26536c]">
              We regularly analyze participant feedback to revise lesson materials, improve platform accessibility, and ensure training aligns with real-world needs of grassroots civil society organizations.
            </p>
          </GuidanceCard>
        </aside>
      </section>
    </div>
  );
}
