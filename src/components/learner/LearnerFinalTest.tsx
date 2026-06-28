"use client";

import { useState, useTransition } from "react";
import type { ReactNode } from "react";
import { ActionButton, SectionHeader, StatusBadge } from "@/components/ui";
import type { LearnerCourseDetail, LearnerFinalTestQuestion } from "@/lib/course-types";
import { submitFinalTestAttemptAction } from "@/lib/learner-actions";

const instructions = [
  "Read each question carefully.",
  "Choose the best answer based on the course content.",
  "You can review the course before submitting.",
  "Use this page to prepare for the final course assessment.",
];

type SerializedQuizAttempt = {
  id: string;
  status: string;
  score: number | null;
  maxScore: number | null;
  percentage: number | null;
  passed: boolean;
  submittedAt: string | null;
} | null;

function DetailCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-card border border-white/15 bg-white/10 p-4 shadow-soft">
      <dt className="text-sm font-medium text-white/70">{label}</dt>
      <dd className="mt-2 text-lg font-semibold text-white">{value}</dd>
    </div>
  );
}

function ResponsivePill({ label }: { label: string }) {
  return (
    <span className="inline-flex min-h-7 max-w-full items-center rounded-full border border-[#145a85]/25 bg-[#dceef8] px-3 py-1 text-left text-xs font-semibold leading-snug text-[#145a85]">
      {label}
    </span>
  );
}

function TestHeaderCard({ course }: { course: LearnerCourseDetail }) {
  const testDetails = [
    { label: "Questions", value: String(course.finalTestQuestions.length) },
    { label: "Pass score", value: course.passThresholdLabel },
    { label: "Format", value: "Multiple choice" },
    { label: "Certificate", value: "Available after passing" },
  ];

  return (
    <section className="overflow-hidden rounded-[28px] bg-deep-navy text-white shadow-hero">
      <div className="border-b border-white/10 bg-white/5 px-6 py-4 lg:px-8">
        <p className="text-sm font-semibold text-dec-green">
          CSO Learning Hub final assessment
        </p>
      </div>
      <div className="grid gap-8 p-6 lg:grid-cols-[1fr_380px] lg:items-end lg:p-8">
        <div>
          <div className="flex flex-wrap gap-2">
            <StatusBadge label="Final Test" tone="gold" />
            <ResponsivePill label={course.capacityArea} />
          </div>
          <p className="mt-6 text-sm font-semibold text-dec-green">
            {course.title}
          </p>
          <h1 className="mt-3 max-w-3xl text-4xl font-semibold leading-tight sm:text-5xl">
            Final Test
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-white/75">
            Check your understanding before completing the course.
          </p>
        </div>
        <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
          {testDetails.map((detail) => (
            <DetailCard key={detail.label} {...detail} />
          ))}
        </dl>
      </div>
    </section>
  );
}

function GuidanceCard({
  children,
  title,
}: {
  children: ReactNode;
  title: string;
}) {
  return (
    <article className="rounded-[28px] border border-design-border bg-white-surface p-6 shadow-soft">
      <h2 className="text-xl font-semibold text-dark-ink">{title}</h2>
      <div className="mt-4 text-sm leading-7 text-muted-text">{children}</div>
    </article>
  );
}

function InstructionsCard() {
  return (
    <GuidanceCard title="Before you begin">
      <ul className="space-y-3">
        {instructions.map((instruction) => (
          <li className="flex gap-3" key={instruction}>
            <span
              aria-hidden="true"
              className="mt-2 size-2 shrink-0 rounded-full bg-dec-green"
            />
            <span>{instruction}</span>
          </li>
        ))}
      </ul>
    </GuidanceCard>
  );
}

function QuestionCard({
  index,
  question,
  selectedAnswer,
  onSelect,
  isPending,
}: {
  index: number;
  question: LearnerFinalTestQuestion;
  selectedAnswer: string | undefined;
  onSelect: (option: string) => void;
  isPending: boolean;
}) {
  const questionNumber = index + 1;
  const questionId = question.id || `question-${questionNumber}`;

  return (
    <fieldset className="overflow-hidden rounded-[28px] border border-design-border bg-white-surface shadow-soft">
      <legend className="w-full border-b border-design-border bg-soft-bg px-6 py-4">
        <span>
          <StatusBadge label={`Question ${questionNumber}`} tone="blue" />
          <span className="mt-4 block text-xl font-semibold leading-snug text-dark-ink">
            {question.text}
          </span>
        </span>
      </legend>
      <div className="space-y-3 p-6" role="radiogroup">
        {question.options.map((option, optionIndex) => {
          const optionId = `${questionId}-option-${optionIndex + 1}`;
          const isChecked = selectedAnswer === option;

          return (
            <label
              className={[
                "flex cursor-pointer gap-4 rounded-card border p-4 text-sm leading-6 transition",
                isChecked
                  ? "border-dec-blue bg-dec-blue/10 font-medium text-dark-ink shadow-soft"
                  : "border-design-border bg-white text-dark-ink hover:border-dec-blue/40 hover:bg-dec-blue/5",
                isPending ? "opacity-50 pointer-events-none" : "",
              ].join(" ")}
              htmlFor={optionId}
              key={option}
            >
              <input
                className="mt-1 size-4 shrink-0 accent-dec-blue focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dec-blue"
                id={optionId}
                name={questionId}
                type="radio"
                checked={isChecked}
                onChange={() => onSelect(option)}
                disabled={isPending}
                value={option}
              />
              <span>
                <span className="block text-xs font-semibold uppercase text-muted-text">
                  Option {optionIndex + 1}
                </span>
                <span className="mt-1 block">{option}</span>
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

function SubmitArea({
  course,
  attemptsCount,
  onSubmit,
  isPending,
}: {
  course: LearnerCourseDetail;
  attemptsCount: number;
  onSubmit: () => void;
  isPending: boolean;
}) {
  const courseHref = `/learn/courses/${course.slug}`;
  const maxAttempts = course.maxAttempts ?? null;
  const attemptsLabel = maxAttempts !== null && maxAttempts > 0 
    ? `Attempts: ${attemptsCount} / ${maxAttempts} taken`
    : `Attempts taken: ${attemptsCount}`;

  return (
    <article className="rounded-[28px] border border-dec-blue/20 bg-dec-blue/10 p-6 shadow-soft">
      <div className="flex justify-between items-center">
        <StatusBadge label="Ready when you are" tone="green" />
        <span className="text-xs text-[#26536c] font-medium">{attemptsLabel}</span>
      </div>
      <h2 className="mt-4 text-xl font-semibold text-deep-navy">
        Submit your final test
      </h2>
      <p className="mt-3 text-sm leading-7 text-[#26536c]">
        Review your answers, then submit when you are ready.
      </p>
      <div className="mt-6 flex flex-col gap-3">
        <ActionButton 
          type="button" 
          onClick={onSubmit} 
          variant="success" 
          disabled={isPending}
        >
          {isPending ? "Submitting..." : "Submit Test"}
        </ActionButton>
        <ActionButton href={courseHref} variant="secondary" disabled={isPending}>
          Review Course
        </ActionButton>
      </div>
    </article>
  );
}

function ResultGuidanceCard({ course }: { course: LearnerCourseDetail }) {
  return (
    <GuidanceCard title="Certificate path">
      <p>
        After scoring is enabled, participants who reach {course.passThresholdRule} will be able
        to continue toward certificate completion.
      </p>
    </GuidanceCard>
  );
}

export function LearnerFinalTest({
  course,
  initialAttempt = null,
  totalAttemptsCount = 0,
  lessonsComplete = false,
}: {
  course: LearnerCourseDetail;
  initialAttempt?: SerializedQuizAttempt;
  totalAttemptsCount?: number;
  lessonsComplete?: boolean;
}) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [attemptResult, setAttemptResult] = useState<SerializedQuizAttempt>(initialAttempt);
  const [attemptsCount, setAttemptsCount] = useState<number>(totalAttemptsCount);
  const [isRetaking, setIsRetaking] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // If questions aren't loaded or configured yet
  if (!course.finalTestQuestions || course.finalTestQuestions.length === 0) {
    return (
      <div className="space-y-8">
        <TestHeaderCard course={course} />
        <div className="rounded-[28px] border border-red-200 bg-red-50 p-6 text-center text-red-800 shadow-soft">
          <h2 className="text-xl font-semibold">Test Not Configured</h2>
          <p className="mt-2 text-sm">
            This course final test does not have any questions configured. Please contact the administrator.
          </p>
        </div>
      </div>
    );
  }

  // 100% Lesson Progress check
  if (!lessonsComplete) {
    return (
      <div className="space-y-8">
        <TestHeaderCard course={course} />
        <div className="rounded-[28px] border border-amber-200 bg-amber-50 p-6 text-center text-amber-800 shadow-soft">
          <h2 className="text-xl font-semibold text-amber-900">Lessons Incomplete</h2>
          <p className="mt-2 text-sm leading-6">
            You must complete all lessons before taking the final test. Please return to the course player and complete the lessons.
          </p>
          <div className="mt-6 flex justify-center">
            <ActionButton href={`/learn/courses/${course.slug}`} variant="secondary">
              Go to Course lessons
            </ActionButton>
          </div>
        </div>
      </div>
    );
  }

  const handleOptionSelect = (questionId: string, option: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: option,
    }));
  };

  const handleSubmit = () => {
    // Verify that all questions are answered
    const unansweredQuestions = course.finalTestQuestions.filter(
      (q) => q.id && !answers[q.id]
    );

    if (unansweredQuestions.length > 0) {
      setSubmitError(
        `Please answer all questions. You have ${unansweredQuestions.length} unanswered question(s).`
      );
      return;
    }

    setSubmitError(null);
    startTransition(async () => {
      const formData = new FormData();
      formData.append("courseSlug", course.slug);
      formData.append("quizId", course.quizId || "");
      formData.append("answersJson", JSON.stringify(answers));

      const result = await submitFinalTestAttemptAction(formData);

      if (result.success && result.attempt) {
        setAttemptResult(result.attempt);
        setAttemptsCount((c) => c + 1);
        setIsRetaking(false);
      } else {
        setSubmitError(result.error || "Failed to submit final test.");
      }
    });
  };

  const handleStartRetake = () => {
    setAnswers({});
    setSubmitError(null);
    setIsRetaking(true);
  };

  // If there's a saved attempt result and the user is not actively retaking
  if (attemptResult && !isRetaking) {
    const hasPassed = attemptResult.passed;
    const scoreText = `${attemptResult.score ?? 0} / ${attemptResult.maxScore ?? 0}`;
    const percentText = `${Math.round(attemptResult.percentage ?? 0)}%`;
    const retakesAllowed = course.retakeAllowed ?? true;
    const maxAttempts = course.maxAttempts ?? null;
    const canRetake = retakesAllowed && (maxAttempts === null || attemptsCount < maxAttempts);

    return (
      <div className="space-y-8">
        <TestHeaderCard course={course} />

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
          <div className="space-y-6">
            {hasPassed ? (
              <div className="overflow-hidden rounded-[32px] border border-dec-green/20 bg-white text-center shadow-card">
                <div className="bg-dec-green/15 px-6 py-8 lg:px-8">
                  <span className="mb-4 inline-flex size-20 items-center justify-center rounded-full bg-dec-green text-4xl font-bold text-white shadow-soft" aria-hidden="true">✓</span>
                  <h1 className="text-3xl font-bold text-deep-navy">You passed the final test</h1>
                </div>
                <div className="p-6 lg:p-8">
                <p className="mt-2 text-sm text-[#26536c] max-w-lg mx-auto">
                  You met the required threshold for this course assessment.
                </p>
                <div className="mt-6 grid grid-cols-2 gap-4 max-w-sm mx-auto">
                  <div className="bg-white/80 p-4 rounded-xl border border-design-border">
                    <div className="text-xs text-muted-text font-medium">Score</div>
                    <div className="text-xl font-bold text-dark-ink">{scoreText}</div>
                  </div>
                  <div className="bg-white/80 p-4 rounded-xl border border-design-border">
                    <div className="text-xs text-muted-text font-medium">Percentage</div>
                    <div className="text-xl font-bold text-dark-ink">{percentText}</div>
                  </div>
                </div>
                </div>
              </div>
            ) : (
              <div className="overflow-hidden rounded-[32px] border border-red-200 bg-white text-center shadow-card">
                <div className="bg-red-50 px-6 py-8 lg:px-8">
                  <span className="mb-4 inline-flex size-20 items-center justify-center rounded-full bg-red-100 text-4xl font-bold text-red-600" aria-hidden="true">!</span>
                  <h1 className="text-3xl font-bold text-red-950">You did not pass yet</h1>
                </div>
                <div className="p-6 lg:p-8">
                <p className="mt-2 text-sm text-red-800 max-w-lg mx-auto">
                  You scored {percentText}, which is below the required pass threshold of {course.passThresholdLabel}.
                </p>
                <div className="mt-6 grid grid-cols-2 gap-4 max-w-sm mx-auto">
                  <div className="bg-white/80 p-4 rounded-xl border border-red-100">
                    <div className="text-xs text-red-600 font-medium">Score</div>
                    <div className="text-xl font-bold text-red-950">{scoreText}</div>
                  </div>
                  <div className="bg-white/80 p-4 rounded-xl border border-red-100">
                    <div className="text-xs text-red-600 font-medium">Percentage</div>
                    <div className="text-xl font-bold text-red-950">{percentText}</div>
                  </div>
                </div>
                </div>
              </div>
            )}
          </div>

          <aside className="space-y-5 lg:sticky lg:top-6">
            <article className="rounded-[28px] border border-design-border bg-white-surface p-6 shadow-soft">
              <h2 className="text-xl font-semibold text-dark-ink">Test status</h2>
              <div className="mt-4 space-y-4">
                <div className="flex justify-between items-center text-sm border-b pb-2">
                  <span className="text-muted-text">Result</span>
                  <StatusBadge 
                    label={hasPassed ? "Passed" : "Failed"} 
                    tone={hasPassed ? "green" : "red"} 
                  />
                </div>
                <div className="flex justify-between items-center text-sm border-b pb-2">
                  <span className="text-muted-text">Attempts taken</span>
                  <span className="font-semibold text-dark-ink">
                    {course.maxAttempts !== null 
                      ? `${attemptsCount} / ${course.maxAttempts}` 
                      : attemptsCount}
                  </span>
                </div>
              </div>
              <div className="mt-6 flex flex-col gap-3">
                {!hasPassed && (
                  canRetake ? (
                    <ActionButton type="button" onClick={handleStartRetake} variant="success">
                      Retake Test
                    </ActionButton>
                  ) : (
                    <div className="rounded-lg bg-red-50 border border-red-100 p-3 text-xs text-red-800 font-medium text-center">
                      {course.maxAttempts !== null 
                        ? "Maximum number of attempts reached."
                        : "Retakes are not allowed for this final test."}
                    </div>
                  )
                )}
                {hasPassed && (
                  <>
                    <ActionButton href={course.certificateHref || `/learn/certificates/${course.slug}`} variant="success">
                      View Certificate
                    </ActionButton>
                    <ActionButton href={`/learn/courses/${course.slug}/feedback`} variant="primary">
                      Submit Feedback
                    </ActionButton>
                  </>
                )}
                <ActionButton href={`/learn/courses/${course.slug}`} variant="secondary">
                  Return to Course
                </ActionButton>
              </div>
            </article>
            <ResultGuidanceCard course={course} />
          </aside>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <TestHeaderCard course={course} />

      <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
        <div className="space-y-5">
          <SectionHeader
            description="Answer each question based on the course lessons."
            title="Test questions"
          />

          {submitError && (
            <div className="rounded-[16px] border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-800">
              {submitError}
            </div>
          )}

          {course.finalTestQuestions.map((question, index) => (
            <QuestionCard
              index={index}
              key={question.id || question.text}
              question={question}
              selectedAnswer={question.id ? answers[question.id] : undefined}
              onSelect={(option) => {
                if (question.id) handleOptionSelect(question.id, option);
              }}
              isPending={isPending}
            />
          ))}
        </div>

        <aside className="space-y-5 lg:sticky lg:top-6">
          <InstructionsCard />
          <SubmitArea 
            course={course} 
            attemptsCount={attemptsCount} 
            onSubmit={handleSubmit} 
            isPending={isPending}
          />
          <ResultGuidanceCard course={course} />
        </aside>
      </section>
    </div>
  );
}
