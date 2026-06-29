"use client";

import { useMemo, useState, useTransition } from "react";
import type { ReactNode } from "react";
import { ActionButton, SectionHeader, StatusBadge } from "@/components/ui";
import type { LearnerCourseDetail } from "@/lib/course-types";
import type { CourseFeedbackState } from "@/lib/feedback-workflow";
import { submitCourseFeedbackAction } from "@/lib/learner-actions";

type RatingValue = number | null;

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
  allowNotApplicable = false,
  disabled,
  error,
  label,
  onChange,
  value,
}: {
  allowNotApplicable?: boolean;
  disabled?: boolean;
  error?: boolean;
  label: string;
  onChange: (val: RatingValue) => void;
  value: RatingValue;
}) {
  return (
    <fieldset className="rounded-card border border-design-border bg-white-surface p-5 shadow-soft">
      <legend className="text-sm font-semibold text-deep-navy">{label}</legend>
      <div className="mt-4 flex flex-wrap gap-3">
        {[1, 2, 3, 4, 5].map((num) => {
          const isSelected = value === num;

          return (
            <button
              className={`flex size-11 items-center justify-center rounded-full border text-base font-semibold transition-all ${
                isSelected
                  ? "border-dec-blue bg-dec-blue text-white shadow-soft"
                  : "border-design-border bg-white text-dark-ink hover:border-dec-blue/60 hover:bg-dec-blue/5"
              } ${disabled ? "cursor-not-allowed opacity-50" : ""}`}
              disabled={disabled}
              key={num}
              onClick={() => onChange(num)}
              type="button"
            >
              {num}
            </button>
          );
        })}
        {allowNotApplicable ? (
          <button
            className={`min-h-11 rounded-full border px-4 text-sm font-semibold transition-all ${
              value === null
                ? "border-dec-green bg-dec-green/15 text-[#426f1c]"
                : "border-design-border bg-white text-dark-ink hover:border-dec-green/60 hover:bg-dec-green/10"
            } ${disabled ? "cursor-not-allowed opacity-50" : ""}`}
            disabled={disabled}
            onClick={() => onChange(null)}
            type="button"
          >
            Not applicable
          </button>
        ) : null}
      </div>
      {error ? (
        <p className="mt-2 text-xs font-semibold text-red-600">
          Please select a rating between 1 and 5.
        </p>
      ) : null}
    </fieldset>
  );
}

function SafeFeedbackNote() {
  return (
    <div className="rounded-[20px] border border-dec-blue/25 bg-dec-blue/10 p-5">
      <h2 className="text-sm font-semibold text-deep-navy">Safe feedback note</h2>
      <p className="mt-3 text-sm leading-7 text-[#26536c]">
        Please keep your feedback general. Do not include personal complaints,
        survivor stories, exact locations, names of community members, or
        confidential organizational information.
      </p>
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

function existingValue(state: CourseFeedbackState) {
  return state.existingFeedback;
}

export function LearnerCourseFeedback({
  course,
  feedbackState,
}: {
  course: LearnerCourseDetail;
  feedbackState: CourseFeedbackState;
}) {
  const saved = useMemo(() => existingValue(feedbackState), [feedbackState]);
  const [overallRating, setOverallRating] = useState<RatingValue>(
    saved?.overallRating ?? null,
  );
  const [usefulnessRating, setUsefulnessRating] = useState<RatingValue>(
    saved?.usefulnessRating ?? null,
  );
  const [easeOfUseRating, setEaseOfUseRating] = useState<RatingValue>(
    saved?.easeOfUseRating ?? null,
  );
  const [contentClarityRating, setContentClarityRating] = useState<RatingValue>(
    saved?.contentClarityRating ?? null,
  );
  const [certificateProcessRating, setCertificateProcessRating] =
    useState<RatingValue>(saved?.certificateProcessRating ?? null);
  const [mostUseful, setMostUseful] = useState(saved?.mostUseful ?? "");
  const [improvementSuggestion, setImprovementSuggestion] = useState(
    saved?.improvementSuggestion ?? "",
  );
  const [technicalIssue, setTechnicalIssue] = useState(saved?.technicalIssue ?? "");
  const [consentToUseAnonymizedFeedback, setConsentToUseAnonymizedFeedback] =
    useState(saved?.consentToUseAnonymizedFeedback ?? false);
  const [hasSubmitted, setHasSubmitted] = useState(
    feedbackState.status === "submitted",
  );
  const [savedAt, setSavedAt] = useState(feedbackState.submittedAt);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showErrors, setShowErrors] = useState(false);
  const [isPending, startTransition] = useTransition();

  const isLocked = feedbackState.status === "locked";

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (isLocked) {
      setErrorMsg(feedbackState.message);
      return;
    }

    const hasMissingRequiredRating =
      overallRating === null ||
      usefulnessRating === null ||
      easeOfUseRating === null ||
      contentClarityRating === null;

    setShowErrors(hasMissingRequiredRating);

    if (hasMissingRequiredRating) {
      setErrorMsg("Please complete required rating fields.");
      return;
    }

    setErrorMsg(null);
    startTransition(async () => {
      const formData = new FormData();
      formData.append("courseSlug", course.slug);
      formData.append("overallRating", String(overallRating));
      formData.append("usefulnessRating", String(usefulnessRating));
      formData.append("easeOfUseRating", String(easeOfUseRating));
      formData.append("contentClarityRating", String(contentClarityRating));
      formData.append(
        "certificateProcessRating",
        certificateProcessRating === null ? "not-applicable" : String(certificateProcessRating),
      );
      formData.append("mostUseful", mostUseful);
      formData.append("improvementSuggestion", improvementSuggestion);
      formData.append("technicalIssue", technicalIssue);
      if (consentToUseAnonymizedFeedback) {
        formData.append("consentToUseAnonymizedFeedback", "on");
      }

      const result = await submitCourseFeedbackAction(formData);

      if (result.success) {
        setHasSubmitted(true);
        setSavedAt(new Date().toISOString());
      } else {
        setErrorMsg(result.error || "Feedback could not be saved. Please try again.");
      }
    });
  };

  if (isLocked) {
    return (
      <div className="space-y-8">
        <section className="overflow-hidden rounded-[28px] border border-design-border bg-white-surface p-6 shadow-card lg:p-8">
          <div className="flex flex-wrap gap-2">
            <StatusBadge label={course.capacityArea} tone="blue" />
            <StatusBadge label="Feedback locked" tone="gold" />
          </div>
          <h1 className="mt-4 max-w-4xl text-3xl font-semibold leading-tight text-deep-navy sm:text-4xl">
            Course feedback
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-text">
            {feedbackState.message}
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <ActionButton href={`/learn/courses/${course.slug}`} variant="primary">
              Continue learning
            </ActionButton>
            <ActionButton
              href={`/learn/courses/${course.slug}/final-test`}
              variant="secondary"
            >
              Final assessment
            </ActionButton>
          </div>
        </section>

        <SafeFeedbackNote />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <section className="overflow-hidden rounded-[28px] border border-design-border bg-white-surface p-6 shadow-card lg:p-8">
        <div className="flex flex-wrap gap-2">
          <StatusBadge label={course.capacityArea} tone="blue" />
          <StatusBadge label={hasSubmitted ? "Feedback submitted" : "Course feedback"} tone="green" />
        </div>
        <h1 className="mt-4 max-w-4xl text-3xl font-semibold leading-tight text-deep-navy sm:text-4xl">
          Course feedback
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-text">
          Help us improve this course for local and grassroots CSOs. Please do
          not include names, complaints, exact locations, survivor stories, or
          confidential organizational information.
        </p>
        {hasSubmitted ? (
          <p className="mt-4 text-sm font-semibold text-[#426f1c]">
            Thank you. Your feedback has been saved and will help improve the course.
            Last saved {formatFeedbackDate(savedAt)}.
          </p>
        ) : null}
      </section>

      <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <SectionHeader
            description="Use 1 for low and 5 for high. Keep written comments short and general."
            title="Feedback form"
          />

          {errorMsg ? (
            <div className="rounded-[16px] border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-800">
              {errorMsg}
            </div>
          ) : null}

          <RatingRadioGroup
            disabled={isPending}
            error={showErrors && overallRating === null}
            label="Overall, how would you rate this course?"
            onChange={setOverallRating}
            value={overallRating}
          />
          <RatingRadioGroup
            disabled={isPending}
            error={showErrors && usefulnessRating === null}
            label="How useful was the course for your CSO work?"
            onChange={setUsefulnessRating}
            value={usefulnessRating}
          />
          <RatingRadioGroup
            disabled={isPending}
            error={showErrors && easeOfUseRating === null}
            label="How easy was the course platform to use?"
            onChange={setEaseOfUseRating}
            value={easeOfUseRating}
          />
          <RatingRadioGroup
            disabled={isPending}
            error={showErrors && contentClarityRating === null}
            label="How clear was the course content?"
            onChange={setContentClarityRating}
            value={contentClarityRating}
          />
          <RatingRadioGroup
            allowNotApplicable
            disabled={isPending}
            label="If you received or tried to receive a certificate, how clear was the certificate process?"
            onChange={setCertificateProcessRating}
            value={certificateProcessRating}
          />

          <div className="rounded-card border border-design-border bg-white-surface p-5 shadow-soft">
            <label className="block text-sm font-semibold text-deep-navy" htmlFor="most-useful">
              What was most useful?
            </label>
            <textarea
              className="mt-3 w-full rounded-control border border-design-border bg-white p-3 text-sm text-dark-ink outline-none transition focus:border-dec-blue focus:ring-4 focus:ring-dec-blue/20"
              disabled={isPending}
              id="most-useful"
              maxLength={1200}
              onChange={(event) => setMostUseful(event.target.value)}
              placeholder="Keep this general. Do not include names or sensitive details."
              rows={3}
              value={mostUseful}
            />
          </div>

          <div className="rounded-card border border-design-border bg-white-surface p-5 shadow-soft">
            <label
              className="block text-sm font-semibold text-deep-navy"
              htmlFor="improvement-suggestion"
            >
              What should be improved?
            </label>
            <textarea
              className="mt-3 w-full rounded-control border border-design-border bg-white p-3 text-sm text-dark-ink outline-none transition focus:border-dec-blue focus:ring-4 focus:ring-dec-blue/20"
              disabled={isPending}
              id="improvement-suggestion"
              maxLength={1200}
              onChange={(event) => setImprovementSuggestion(event.target.value)}
              placeholder="Share a general improvement suggestion."
              rows={3}
              value={improvementSuggestion}
            />
          </div>

          <div className="rounded-card border border-design-border bg-white-surface p-5 shadow-soft">
            <label className="block text-sm font-semibold text-deep-navy" htmlFor="technical-issue">
              Did you face any technical issue?
            </label>
            <textarea
              className="mt-3 w-full rounded-control border border-design-border bg-white p-3 text-sm text-dark-ink outline-none transition focus:border-dec-blue focus:ring-4 focus:ring-dec-blue/20"
              disabled={isPending}
              id="technical-issue"
              maxLength={1200}
              onChange={(event) => setTechnicalIssue(event.target.value)}
              placeholder="Describe the issue without adding private account details."
              rows={3}
              value={technicalIssue}
            />
          </div>

          <label className="flex gap-3 rounded-card border border-design-border bg-white-surface p-5 text-sm font-medium leading-6 text-dark-ink shadow-soft">
            <input
              checked={consentToUseAnonymizedFeedback}
              className="mt-1 size-4 shrink-0 accent-dec-blue"
              disabled={isPending}
              onChange={(event) =>
                setConsentToUseAnonymizedFeedback(event.target.checked)
              }
              type="checkbox"
            />
            <span>
              I agree that my feedback may be used in anonymized learning
              summaries to improve the programme.
            </span>
          </label>

          <div className="flex flex-col gap-4 sm:flex-row">
            <ActionButton disabled={isPending} type="submit" variant="success">
              {isPending
                ? "Saving feedback..."
                : hasSubmitted
                  ? "Update feedback"
                  : "Save feedback"}
            </ActionButton>
            <ActionButton
              disabled={isPending}
              href={`/learn/courses/${course.slug}`}
              variant="secondary"
            >
              Continue learning
            </ActionButton>
          </div>
        </form>

        <aside className="space-y-5 lg:sticky lg:top-6">
          <SafeFeedbackNote />
          <GuidanceCard title="Why your feedback matters">
            <p className="text-xs leading-6 text-[#26536c]">
              The programme team uses structured, anonymized learning summaries
              to improve course content, platform usability, and certificate
              guidance for pilot learners.
            </p>
          </GuidanceCard>
        </aside>
      </section>
    </div>
  );
}
