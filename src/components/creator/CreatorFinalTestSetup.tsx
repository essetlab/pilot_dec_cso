"use client";

import { useState, useTransition } from "react";
import { ActionButton, StatusBadge } from "@/components/ui";
import { CreatorCourseContextBar } from "./CreatorCourseContextBar";
import { CERTIFICATE_PASS_THRESHOLD_LABEL } from "@/lib/demo-data";
import type { CreatorQuizData } from "@/lib/build-studio-data";
import {
  saveQuizSettingsAction,
  addQuizQuestionAction,
  editQuizQuestionAction,
  deleteQuizQuestionAction,
  duplicateQuizQuestionAction,
} from "@/lib/build-studio-actions";

type Props = {
  quizData: CreatorQuizData;
};

// Help guidelines on the sidebar
const guidanceItems = [
  "Use questions that match course outcomes.",
  "Avoid trick questions.",
  "Keep answer options clear and realistic.",
  "Use the final test to check essential understanding.",
  "Keep certificate rules transparent for participants.",
];

// Helper to extract options and correct answer
function getQuestionConfig(configJson: unknown) {
  if (configJson && typeof configJson === "object") {
    const config = configJson as { options?: unknown; correctAnswer?: unknown };
    const options = Array.isArray(config.options)
      ? config.options.filter((o): o is string => typeof o === "string")
      : [];
    const correctAnswer = typeof config.correctAnswer === "string" ? config.correctAnswer : "";
    return { options, correctAnswer };
  }
  return { options: [], correctAnswer: "" };
}

// Helper to compute question warnings
function getQuestionWarnings(question: {
  type: string;
  questionText: string;
  configJson: unknown;
}) {
  const warnings: string[] = [];
  const text = question.questionText.trim();
  if (!text) {
    warnings.push("Question text is missing.");
  }

  const { options, correctAnswer } = getQuestionConfig(question.configJson);

  if (question.type === "TRUE_FALSE") {
    if (!correctAnswer) {
      warnings.push("Correct answer is missing.");
    } else if (correctAnswer !== "True" && correctAnswer !== "False") {
      warnings.push("Correct answer must be 'True' or 'False'.");
    }
  } else {
    if (options.length < 2) {
      warnings.push("Fewer than two answer options provided.");
    }
    if (!correctAnswer) {
      warnings.push("Correct answer is missing.");
    } else if (!options.includes(correctAnswer)) {
      warnings.push("Correct answer does not match any of the provided options.");
    }
  }

  return warnings;
}

export function CreatorFinalTestSetup({ quizData }: Props) {
  const { course, quiz, questions, learningOutcomes, isEditable } = quizData;

  const [isPending, startTransition] = useTransition();
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // States for Add Question Form
  const [addType, setAddType] = useState<"MULTIPLE_CHOICE" | "TRUE_FALSE">("MULTIPLE_CHOICE");

  // Determine readiness checklist items
  const allWarnings = questions.map((q) => getQuestionWarnings(q));
  const hasAnyWarnings = allWarnings.some((w) => w.length > 0);
  const noQuestions = questions.length === 0;

  const handleSaveSettings = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isEditable || !quiz) return;

    setErrorMessage(null);
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const res = await saveQuizSettingsAction(course.slug, quiz.id, formData);
      if (!res.success) {
        setErrorMessage(res.error ?? "Failed to save settings");
      }
    });
  };

  const handleAddQuestion = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isEditable || !quiz) return;

    setErrorMessage(null);
    const form = e.currentTarget;
    const formData = new FormData(form);
    startTransition(async () => {
      const res = await addQuizQuestionAction(course.slug, quiz.id, formData);
      if (res.success) {
        form.reset();
        setAddType("MULTIPLE_CHOICE");
      } else {
        setErrorMessage(res.error ?? "Failed to add question");
      }
    });
  };

  const handleEditQuestion = async (e: React.FormEvent<HTMLFormElement>, questionId: string) => {
    e.preventDefault();
    if (!isEditable) return;

    setErrorMessage(null);
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const res = await editQuizQuestionAction(course.slug, questionId, formData);
      if (res.success) {
        setEditingQuestionId(null);
      } else {
        setErrorMessage(res.error ?? "Failed to update question");
      }
    });
  };

  const handleDeleteQuestion = async (questionId: string) => {
    if (!isEditable || !quiz) return;
    if (!confirm("Are you sure you want to delete this question?")) return;

    setErrorMessage(null);
    startTransition(async () => {
      const res = await deleteQuizQuestionAction(course.slug, questionId, quiz.id);
      if (!res.success) {
        setErrorMessage(res.error ?? "Failed to delete question");
      }
    });
  };

  const handleDuplicateQuestion = async (questionId: string) => {
    if (!isEditable || !quiz) return;

    setErrorMessage(null);
    startTransition(async () => {
      const res = await duplicateQuizQuestionAction(course.slug, questionId, quiz.id);
      if (!res.success) {
        setErrorMessage(res.error ?? "Failed to duplicate question");
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <section className="overflow-hidden rounded-[28px] border border-design-border bg-deep-navy p-6 text-white shadow-hero lg:p-8">
        <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_360px] xl:items-center">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge label={isEditable ? "Draft" : "Read-only"} tone={isEditable ? "blue" : "gray"} />
              <StatusBadge label="Assessment design" tone="gold" />
            </div>
            <h1 className="mt-5 text-4xl font-semibold leading-tight sm:text-5xl">
              Final Test Setup
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-white/75">
              Prepare the final test questions participants will complete before certificate eligibility.
            </p>
            <p className="mt-5 max-w-2xl text-sm font-semibold leading-6 text-white">
              {course.title}
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <ActionButton
                href={`/creator/courses/${course.slug}/resources`}
                size="lg"
                variant="secondary"
              >
                Back to Resources
              </ActionButton>
              <ActionButton
                href={`/creator/courses/${course.slug}/preview`}
                size="lg"
                variant="ghost"
              >
                Continue to Preview
              </ActionButton>
            </div>
          </div>

          <article className="rounded-[24px] border border-white/15 bg-white/10 p-5">
            <p className="text-sm font-semibold text-dec-green">Assessment focus</p>
            <h2 className="mt-3 text-2xl font-semibold leading-tight">
              Keep final test questions clear and linked to outcomes.
            </h2>
            <p className="mt-3 text-sm leading-6 text-white/70">
              A strong final test checks the essential learning participants need before moving toward certificate completion.
            </p>
            <dl className="mt-6 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-[16px] bg-white/10 p-3">
                <dt className="text-white/65">Questions</dt>
                <dd className="mt-1 text-2xl font-semibold text-white">
                  {questions.length}
                </dd>
              </div>
              <div className="rounded-[16px] bg-white/10 p-3">
                <dt className="text-white/65">Pass score</dt>
                <dd className="mt-1 text-2xl font-semibold text-white">
                  {CERTIFICATE_PASS_THRESHOLD_LABEL}
                </dd>
              </div>
            </dl>
          </article>
        </div>
      </section>

      <CreatorCourseContextBar
        ariaLabel="Final test setup context"
        items={[
          { label: "Course", value: course.title },
          { label: "Questions", value: String(questions.length) },
          { label: "Pass score", value: CERTIFICATE_PASS_THRESHOLD_LABEL },
          { label: "Editable", value: isEditable ? "Yes" : "No" },
          { label: "Current step", value: "Final Test" },
        ]}
      />

      {/* Error alert */}
      {errorMessage && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-800 rounded-[20px] text-sm">
          <strong>Error:</strong> {errorMessage}
        </div>
      )}

      {/* Main Grid content */}
      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px] xl:items-start">
        <div className="space-y-6">
          
          {/* Settings Section */}
          {quiz && (
            <section className="rounded-[24px] border border-design-border bg-white-surface p-6 shadow-soft">
              <div className="max-w-3xl">
                <h2 className="text-2xl font-semibold leading-tight text-dark-ink">Test settings</h2>
                <p className="mt-2 text-sm leading-6 text-muted-text">
                  Confirm the final test rules that participants will see as part of the course completion journey.
                </p>
              </div>
              <form onSubmit={handleSaveSettings} className="mt-6 space-y-6">
                <div className="grid gap-5 md:grid-cols-2">
                  
                  {/* Final Test Required */}
                  <label className="block text-sm font-medium text-dark-ink" htmlFor="settings-required">
                    Final test required
                    <select
                      className="mt-2 min-h-11 w-full rounded-control border border-design-border bg-white px-4 text-sm text-dark-ink outline-none transition focus:border-dec-blue focus:ring-4 focus:ring-dec-blue/20"
                      id="settings-required"
                      name="finalTestRequired"
                      defaultValue={course.finalTestRequired ? "Yes" : "No"}
                      disabled={!isEditable || isPending}
                    >
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </label>

                  {/* Pass Score - Read Only */}
                  <label className="block text-sm font-medium text-dark-ink" htmlFor="settings-pass-score">
                    Pass score
                    <input
                      className="mt-2 min-h-11 w-full rounded-control border border-design-border bg-gray-50 px-4 text-sm text-muted-text outline-none cursor-not-allowed"
                      id="settings-pass-score"
                      type="text"
                      value={CERTIFICATE_PASS_THRESHOLD_LABEL}
                      readOnly
                    />
                  </label>

                  {/* Question Count - Read Only */}
                  <label className="block text-sm font-medium text-dark-ink" htmlFor="settings-q-count">
                    Question count
                    <input
                      className="mt-2 min-h-11 w-full rounded-control border border-design-border bg-gray-50 px-4 text-sm text-muted-text outline-none cursor-not-allowed"
                      id="settings-q-count"
                      type="text"
                      value={String(questions.length)}
                      readOnly
                    />
                  </label>

                  {/* Question Format - Fixed */}
                  <label className="block text-sm font-medium text-dark-ink" htmlFor="settings-q-format">
                    Question format
                    <select
                      className="mt-2 min-h-11 w-full rounded-control border border-design-border bg-gray-50 px-4 text-sm text-muted-text outline-none cursor-not-allowed"
                      id="settings-q-format"
                      disabled
                      value="Multiple choice"
                    >
                      <option value="Multiple choice">Multiple choice / True-False</option>
                    </select>
                  </label>

                  {/* Retake Rule */}
                  <label className="block text-sm font-medium text-dark-ink" htmlFor="settings-retake">
                    Retake rule
                    <select
                      className="mt-2 min-h-11 w-full rounded-control border border-design-border bg-white px-4 text-sm text-dark-ink outline-none transition focus:border-dec-blue focus:ring-4 focus:ring-dec-blue/20"
                      id="settings-retake"
                      name="retakeAllowed"
                      defaultValue={quiz.retakeAllowed ? "Multiple attempts" : "One attempt"}
                      disabled={!isEditable || isPending}
                    >
                      <option value="Multiple attempts">Multiple attempts</option>
                      <option value="One attempt">One attempt</option>
                    </select>
                  </label>

                  {/* Max Attempts */}
                  <label className="block text-sm font-medium text-dark-ink" htmlFor="settings-max-attempts">
                    Max attempts
                    <input
                      className="mt-2 min-h-11 w-full rounded-control border border-design-border bg-white px-4 text-sm text-dark-ink outline-none transition focus:border-dec-blue focus:ring-4 focus:ring-dec-blue/20"
                      id="settings-max-attempts"
                      name="maxAttempts"
                      type="number"
                      min="1"
                      defaultValue={quiz.maxAttempts ? String(quiz.maxAttempts) : "3"}
                      disabled={!isEditable || isPending}
                    />
                  </label>

                  {/* Certificate rule - Read Only */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-dark-ink" htmlFor="settings-cert">
                      Certificate rule
                      <input
                        className="mt-2 min-h-11 w-full rounded-control border border-design-border bg-gray-50 px-4 text-sm text-muted-text outline-none cursor-not-allowed"
                        id="settings-cert"
                        type="text"
                        value="Available after course completion and final test pass"
                        readOnly
                      />
                    </label>
                  </div>
                </div>

                {isEditable && (
                  <div className="flex justify-end">
                    <ActionButton type="submit" disabled={isPending}>
                      {isPending ? "Saving..." : "Save Test Settings"}
                    </ActionButton>
                  </div>
                )}
              </form>
            </section>
          )}

          {/* Question List Section */}
          <section className="rounded-[24px] border border-design-border bg-white-surface p-6 shadow-soft">
            <div className="max-w-3xl">
              <h2 className="text-2xl font-semibold leading-tight text-dark-ink">Question list</h2>
              <p className="mt-2 text-sm leading-6 text-muted-text">
                Review each question, answer, and learning outcome connection before previewing the course.
              </p>
            </div>

            <div className="mt-6 space-y-4">
              {questions.length === 0 ? (
                <div className="p-8 text-center border border-dashed border-design-border rounded-[22px] text-muted-text text-sm">
                  No questions configured yet. Prepare a question using the form below.
                </div>
              ) : (
                questions.map((question, index) => {
                  const warnings = getQuestionWarnings(question);
                  const isEditing = editingQuestionId === question.id;
                  const { options, correctAnswer } = getQuestionConfig(question.configJson);

                  if (isEditing) {
                    // Inline Editing Form
                    return (
                      <article key={question.id} className="rounded-[22px] border-2 border-dec-blue bg-white p-5 shadow-soft">
                        <form onSubmit={(e) => handleEditQuestion(e, question.id)} className="space-y-4">
                          <h3 className="text-sm font-bold text-dec-blue">Editing Question #{index + 1}</h3>
                          
                          <div>
                            <label className="block text-sm font-medium text-dark-ink">
                              Question text
                              <textarea
                                className="mt-2 min-h-24 w-full rounded-control border border-design-border bg-white px-4 py-3 text-sm text-dark-ink outline-none transition focus:border-dec-blue focus:ring-4 focus:ring-dec-blue/20"
                                name="questionText"
                                defaultValue={question.questionText}
                                required
                              />
                            </label>
                          </div>

                          <div className="grid gap-4 md:grid-cols-2">
                            <label className="block text-sm font-medium text-dark-ink">
                              Question type
                              <select
                                className="mt-2 min-h-11 w-full rounded-control border border-design-border bg-white px-4 text-sm text-dark-ink outline-none transition focus:border-dec-blue focus:ring-4 focus:ring-dec-blue/20"
                                name="type"
                                defaultValue={question.type === "TRUE_FALSE" ? "True/False" : "Multiple choice"}
                                disabled // keep type locked during edit to avoid index mismatches
                              >
                                <option value="Multiple choice">Multiple choice</option>
                                <option value="True/False">True/False</option>
                              </select>
                            </label>

                            <label className="block text-sm font-medium text-dark-ink">
                              Linked outcome
                              <select
                                className="mt-2 min-h-11 w-full rounded-control border border-design-border bg-white px-4 text-sm text-dark-ink outline-none transition focus:border-dec-blue focus:ring-4 focus:ring-dec-blue/20"
                                name="explanation"
                                defaultValue={question.explanation ?? ""}
                              >
                                <option value="">No link</option>
                                {learningOutcomes.map((outcome) => (
                                  <option key={outcome.id} value={outcome.statement}>
                                    {outcome.statement.slice(0, 70)}...
                                  </option>
                                ))}
                              </select>
                            </label>

                            {question.type !== "TRUE_FALSE" && (
                              <>
                                <label className="block text-sm font-medium text-dark-ink">
                                  Option A
                                  <input
                                    className="mt-2 min-h-11 w-full rounded-control border border-design-border bg-white px-4 text-sm text-dark-ink outline-none transition focus:border-dec-blue focus:ring-4 focus:ring-dec-blue/20"
                                    name="optionA"
                                    type="text"
                                    defaultValue={options[0] ?? ""}
                                    required
                                  />
                                </label>
                                <label className="block text-sm font-medium text-dark-ink">
                                  Option B
                                  <input
                                    className="mt-2 min-h-11 w-full rounded-control border border-design-border bg-white px-4 text-sm text-dark-ink outline-none transition focus:border-dec-blue focus:ring-4 focus:ring-dec-blue/20"
                                    name="optionB"
                                    type="text"
                                    defaultValue={options[1] ?? ""}
                                    required
                                  />
                                </label>
                                <label className="block text-sm font-medium text-dark-ink">
                                  Option C
                                  <input
                                    className="mt-2 min-h-11 w-full rounded-control border border-design-border bg-white px-4 text-sm text-dark-ink outline-none transition focus:border-dec-blue focus:ring-4 focus:ring-dec-blue/20"
                                    name="optionC"
                                    type="text"
                                    defaultValue={options[2] ?? ""}
                                  />
                                </label>
                                <label className="block text-sm font-medium text-dark-ink">
                                  Option D
                                  <input
                                    className="mt-2 min-h-11 w-full rounded-control border border-design-border bg-white px-4 text-sm text-dark-ink outline-none transition focus:border-dec-blue focus:ring-4 focus:ring-dec-blue/20"
                                    name="optionD"
                                    type="text"
                                    defaultValue={options[3] ?? ""}
                                  />
                                </label>
                              </>
                            )}

                            <label className="block text-sm font-medium text-dark-ink">
                              Correct answer
                              <select
                                className="mt-2 min-h-11 w-full rounded-control border border-design-border bg-white px-4 text-sm text-dark-ink outline-none transition focus:border-dec-blue focus:ring-4 focus:ring-dec-blue/20"
                                name="correctAnswer"
                                defaultValue={
                                  question.type === "TRUE_FALSE"
                                    ? correctAnswer
                                    : correctAnswer === options[0]
                                    ? "Option A"
                                    : correctAnswer === options[1]
                                    ? "Option B"
                                    : correctAnswer === options[2]
                                    ? "Option C"
                                    : correctAnswer === options[3]
                                    ? "Option D"
                                    : "Option A"
                                }
                              >
                                {question.type === "TRUE_FALSE" ? (
                                  <>
                                    <option value="True">True</option>
                                    <option value="False">False</option>
                                  </>
                                ) : (
                                  <>
                                    <option value="Option A">Option A</option>
                                    <option value="Option B">Option B</option>
                                    <option value="Option C">Option C</option>
                                    <option value="Option D">Option D</option>
                                  </>
                                )}
                              </select>
                            </label>
                          </div>

                          <div className="flex gap-2 justify-end pt-2">
                            <ActionButton type="button" variant="secondary" onClick={() => setEditingQuestionId(null)}>
                              Cancel
                            </ActionButton>
                            <ActionButton type="submit" disabled={isPending}>
                              Save Changes
                            </ActionButton>
                          </div>
                        </form>
                      </article>
                    );
                  }

                  // Read-Only Card
                  return (
                    <article key={question.id} className="rounded-[22px] border border-design-border bg-white p-5 shadow-soft">
                      <div className="flex flex-col gap-4 xl:flex-row xl:items-start">
                        <div className="flex size-11 shrink-0 items-center justify-center rounded-control bg-dec-blue/10 text-sm font-semibold text-[#216f9d]">
                          {index + 1}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <StatusBadge label={question.type === "TRUE_FALSE" ? "True/False" : "Multiple choice"} tone="blue" />
                            {question.explanation ? (
                              <StatusBadge label="Linked to outcome" tone="green" />
                            ) : (
                              <StatusBadge label="No outcome link" tone="gray" />
                            )}
                          </div>
                          
                          <h3 className="mt-4 text-xl font-semibold leading-tight text-dark-ink">
                            {question.questionText}
                          </h3>

                          {/* Display warnings if any */}
                          {warnings.length > 0 && (
                            <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-[14px] space-y-1">
                              {warnings.map((w) => (
                                <p key={w} className="text-xs font-semibold text-red-600 flex items-center gap-1.5">
                                  <span>⚠</span> {w}
                                </p>
                              ))}
                            </div>
                          )}

                          <dl className="mt-4 grid gap-3 text-sm md:grid-cols-2">
                            <div className="rounded-[16px] bg-soft-bg p-4">
                              <dt className="font-semibold text-dark-ink">Correct answer</dt>
                              <dd className="mt-2 leading-6 text-muted-text">
                                {correctAnswer || <span className="italic text-red-500">None</span>}
                              </dd>
                            </div>
                            {question.explanation ? (
                              <div className="rounded-[16px] bg-soft-bg p-4">
                                <dt className="font-semibold text-dark-ink">Linked outcome</dt>
                                <dd className="mt-2 leading-6 text-muted-text">
                                  {question.explanation}
                                </dd>
                              </div>
                            ) : null}
                          </dl>

                          {/* Options display */}
                          {options.length > 0 && (
                            <div className="mt-3">
                              <p className="text-xs font-semibold text-muted-text uppercase tracking-wider">Answer Options:</p>
                              <ul className="mt-2 space-y-1">
                                {options.map((opt, i) => (
                                  <li key={opt} className={`text-sm px-3 py-1.5 rounded-card flex gap-2 items-center ${opt === correctAnswer ? "bg-dec-green/10 border border-dec-green/30 text-dark-ink font-medium" : "bg-soft-bg text-muted-text"}`}>
                                    <span className="font-semibold text-xs opacity-75">{String.fromCharCode(65 + i)}.</span>
                                    <span>{opt}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>

                        {isEditable && (
                          <div className="flex flex-wrap gap-2 xl:w-52 xl:justify-end">
                            <ActionButton type="button" variant="ghost" size="sm" onClick={() => setEditingQuestionId(question.id)}>
                              Edit
                            </ActionButton>
                            <ActionButton type="button" variant="ghost" size="sm" onClick={() => handleDuplicateQuestion(question.id)} disabled={isPending}>
                              Duplicate
                            </ActionButton>
                            <ActionButton type="button" variant="ghost" size="sm" onClick={() => handleDeleteQuestion(question.id)} disabled={isPending}>
                              Remove
                            </ActionButton>
                          </div>
                        )}
                      </div>
                    </article>
                  );
                })
              )}
            </div>
          </section>

          {/* Add Question Card Form */}
          {isEditable && quiz && (
            <section className="rounded-[24px] border border-design-border bg-white-surface p-6 shadow-soft">
              <div className="max-w-3xl">
                <h2 className="text-2xl font-semibold leading-tight text-dark-ink">Add question</h2>
                <p className="mt-2 text-sm leading-6 text-muted-text">
                  Prepare another question when the test needs to check an additional course outcome.
                </p>
              </div>

              <form onSubmit={handleAddQuestion} className="mt-6 space-y-6">
                <div className="grid gap-5 md:grid-cols-2">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-dark-ink" htmlFor="add-question-text">
                      Question text
                      <textarea
                        className="mt-2 min-h-24 w-full rounded-control border border-design-border bg-white px-4 py-3 text-sm text-dark-ink outline-none transition focus:border-dec-blue focus:ring-4 focus:ring-dec-blue/20"
                        id="add-question-text"
                        name="questionText"
                        placeholder="Write a clear question that checks one important course outcome."
                        required
                      />
                    </label>
                  </div>

                  <label className="block text-sm font-medium text-dark-ink" htmlFor="add-type">
                    Question type
                    <select
                      className="mt-2 min-h-11 w-full rounded-control border border-design-border bg-white px-4 text-sm text-dark-ink outline-none transition focus:border-dec-blue focus:ring-4 focus:ring-dec-blue/20"
                      id="add-type"
                      name="type"
                      value={addType}
                      onChange={(e) => setAddType(e.target.value as "MULTIPLE_CHOICE" | "TRUE_FALSE")}
                    >
                      <option value="MULTIPLE_CHOICE">Multiple choice</option>
                      <option value="TRUE_FALSE">True/False</option>
                    </select>
                  </label>

                  <label className="block text-sm font-medium text-dark-ink" htmlFor="add-outcome">
                    Linked outcome
                    <select
                      className="mt-2 min-h-11 w-full rounded-control border border-design-border bg-white px-4 text-sm text-dark-ink outline-none transition focus:border-dec-blue focus:ring-4 focus:ring-dec-blue/20"
                      id="add-outcome"
                      name="explanation"
                    >
                      <option value="">No link</option>
                      {learningOutcomes.map((outcome) => (
                        <option key={outcome.id} value={outcome.statement}>
                          {outcome.statement.slice(0, 75)}...
                        </option>
                      ))}
                    </select>
                  </label>

                  {addType === "MULTIPLE_CHOICE" && (
                    <>
                      <label className="block text-sm font-medium text-dark-ink" htmlFor="add-opt-a">
                        Option A
                        <input
                          className="mt-2 min-h-11 w-full rounded-control border border-design-border bg-white px-4 text-sm text-dark-ink outline-none transition focus:border-dec-blue focus:ring-4 focus:ring-dec-blue/20"
                          id="add-opt-a"
                          name="optionA"
                          type="text"
                          placeholder="First answer choice"
                          required
                        />
                      </label>
                      <label className="block text-sm font-medium text-dark-ink" htmlFor="add-opt-b">
                        Option B
                        <input
                          className="mt-2 min-h-11 w-full rounded-control border border-design-border bg-white px-4 text-sm text-dark-ink outline-none transition focus:border-dec-blue focus:ring-4 focus:ring-dec-blue/20"
                          id="add-opt-b"
                          name="optionB"
                          type="text"
                          placeholder="Second answer choice"
                          required
                        />
                      </label>
                      <label className="block text-sm font-medium text-dark-ink" htmlFor="add-opt-c">
                        Option C
                        <input
                          className="mt-2 min-h-11 w-full rounded-control border border-design-border bg-white px-4 text-sm text-dark-ink outline-none transition focus:border-dec-blue focus:ring-4 focus:ring-dec-blue/20"
                          id="add-opt-c"
                          name="optionC"
                          type="text"
                          placeholder="Third answer choice (optional)"
                        />
                      </label>
                      <label className="block text-sm font-medium text-dark-ink" htmlFor="add-opt-d">
                        Option D
                        <input
                          className="mt-2 min-h-11 w-full rounded-control border border-design-border bg-white px-4 text-sm text-dark-ink outline-none transition focus:border-dec-blue focus:ring-4 focus:ring-dec-blue/20"
                          id="add-opt-d"
                          name="optionD"
                          type="text"
                          placeholder="Fourth answer choice (optional)"
                        />
                      </label>
                    </>
                  )}

                  <label className="block text-sm font-medium text-dark-ink" htmlFor="add-correct">
                    Correct answer
                    <select
                      className="mt-2 min-h-11 w-full rounded-control border border-design-border bg-white px-4 text-sm text-dark-ink outline-none transition focus:border-dec-blue focus:ring-4 focus:ring-dec-blue/20"
                      id="add-correct"
                      name="correctAnswer"
                    >
                      {addType === "TRUE_FALSE" ? (
                        <>
                          <option value="True">True</option>
                          <option value="False">False</option>
                        </>
                      ) : (
                        <>
                          <option value="Option A">Option A</option>
                          <option value="Option B">Option B</option>
                          <option value="Option C">Option C</option>
                          <option value="Option D">Option D</option>
                        </>
                      )}
                    </select>
                  </label>
                </div>

                <div className="mt-5">
                  <ActionButton type="submit" disabled={isPending}>
                    {isPending ? "Adding..." : "Add Question"}
                  </ActionButton>
                </div>
              </form>
            </section>
          )}
        </div>

        {/* Right sidebar */}
        <aside className="space-y-5">
          
          {/* Assessment Guidance */}
          <article className="rounded-[24px] border border-design-border bg-white-surface p-6 shadow-soft">
            <StatusBadge label="Assessment quality" tone="blue" />
            <h2 className="mt-4 text-xl font-semibold text-deep-navy">
              Assessment quality guidance
            </h2>
            <ul className="mt-6 space-y-4">
              {guidanceItems.map((item) => (
                <li className="flex gap-3" key={item}>
                  <span
                    aria-hidden="true"
                    className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-dec-blue/10 text-[10px] font-bold text-[#216f9d]"
                  >
                    OK
                  </span>
                  <span className="text-sm leading-6 text-muted-text">{item}</span>
                </li>
              ))}
            </ul>
          </article>

          {/* Pass Score Rule */}
          <article className="rounded-[24px] border border-amber-200 bg-amber-50 p-6">
            <StatusBadge label="Certificate threshold" tone="gold" />
            <h2 className="mt-4 text-xl font-semibold text-deep-navy">
              Certificate threshold note
            </h2>
            <p className="mt-3 text-sm leading-7 text-amber-800">
              Participants need {CERTIFICATE_PASS_THRESHOLD_LABEL} or above on the final test to continue toward certificate completion. This passing threshold is read-only.
            </p>
          </article>

          {/* Dynamic Readiness Checklist */}
          <article className="rounded-[24px] border border-design-border bg-white-surface p-6 shadow-soft">
            <StatusBadge label="Readiness" tone={(!noQuestions && !hasAnyWarnings) ? "green" : "gold"} />
            <h2 className="mt-4 text-xl font-semibold text-deep-navy">
              Lightweight readiness checklist
            </h2>
            <ul className="mt-6 space-y-4">
              <li className="flex gap-3">
                <span
                  aria-hidden="true"
                  className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-dec-green/20 text-[10px] font-bold text-[#426f1c]"
                >
                  ✓
                </span>
                <span className="text-sm leading-6 text-muted-text">
                  Pass score set to {CERTIFICATE_PASS_THRESHOLD_LABEL}
                </span>
              </li>

              {noQuestions ? (
                <li className="flex gap-3">
                  <span
                    aria-hidden="true"
                    className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-amber-100 text-[10px] font-bold text-amber-700"
                  >
                    ⚠
                  </span>
                  <span className="text-sm leading-6 text-amber-700 font-medium">
                    Warning: Quiz has no questions.
                  </span>
                </li>
              ) : (
                <li className="flex gap-3">
                  <span
                    aria-hidden="true"
                    className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-dec-green/20 text-[10px] font-bold text-[#426f1c]"
                  >
                    ✓
                  </span>
                  <span className="text-sm leading-6 text-muted-text">
                    Question count: {questions.length}
                  </span>
                </li>
              )}

              {hasAnyWarnings ? (
                <li className="flex gap-3">
                  <span
                    aria-hidden="true"
                    className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-amber-100 text-[10px] font-bold text-amber-700"
                  >
                    ⚠
                  </span>
                  <span className="text-sm leading-6 text-amber-700 font-medium">
                    Warning: Incomplete questions exist.
                  </span>
                </li>
              ) : !noQuestions ? (
                <>
                  <li className="flex gap-3">
                    <span
                      aria-hidden="true"
                      className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-dec-green/20 text-[10px] font-bold text-[#426f1c]"
                    >
                      ✓
                    </span>
                    <span className="text-sm leading-6 text-muted-text font-medium">
                      Correct answers identified.
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <span
                      aria-hidden="true"
                      className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-dec-green/20 text-[10px] font-bold text-[#426f1c]"
                    >
                      ✓
                    </span>
                    <span className="text-sm leading-6 text-muted-text font-medium">
                      All questions fully configured.
                    </span>
                  </li>
                </>
              ) : null}
            </ul>
          </article>
        </aside>
      </section>
    </div>
  );
}
