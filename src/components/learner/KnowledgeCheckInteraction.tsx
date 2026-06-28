"use client";

import { useMemo, useState } from "react";

export type KnowledgeCheckOption = {
  feedback: string;
  id: string;
  isCorrect: boolean;
  label: string;
};

export type KnowledgeCheckInteractionProps = {
  correctFeedback: string;
  incorrectFeedback: string;
  options: KnowledgeCheckOption[];
  questionId: string;
  retryAllowed: boolean;
};

export function KnowledgeCheckInteraction({
  correctFeedback,
  incorrectFeedback,
  options,
  questionId,
  retryAllowed,
}: KnowledgeCheckInteractionProps) {
  const [selectedOptionId, setSelectedOptionId] = useState("");
  const [submittedOptionId, setSubmittedOptionId] = useState("");
  const submittedOption = useMemo(
    () => options.find((option) => option.id === submittedOptionId) ?? null,
    [options, submittedOptionId],
  );
  const selectedOption = useMemo(
    () => options.find((option) => option.id === selectedOptionId) ?? null,
    [options, selectedOptionId],
  );
  const feedback = submittedOption
    ? submittedOption.feedback ||
      (submittedOption.isCorrect ? correctFeedback : incorrectFeedback)
    : "";

  return (
    <div className="mt-5 space-y-4">
      <fieldset className="grid gap-3">
        <legend className="sr-only">Choose one answer</legend>
        {options.map((option, index) => {
          const isSubmitted = submittedOptionId === option.id;

          return (
            <label
              className={[
                "flex cursor-pointer items-start gap-4 rounded-card border bg-white p-4 text-sm leading-6 transition shadow-soft",
                isSubmitted
                  ? option.isCorrect
                    ? "border-dec-green bg-dec-green/15 text-[#365c19]"
                    : "border-[#f6d365] bg-[#fff7db] text-[#7a4d00]"
                  : "border-design-border text-dark-ink hover:border-dec-blue/40 hover:bg-dec-blue/5",
              ].join(" ")}
              key={option.id}
            >
              <input
                checked={selectedOptionId === option.id}
                className="mt-1 size-4 accent-dec-blue"
                disabled={Boolean(submittedOptionId)}
                name={`knowledge-check-${questionId}`}
                onChange={() => setSelectedOptionId(option.id)}
                type="radio"
              />
              <span>
                <span className="block text-xs font-semibold uppercase text-muted-text">
                  Option {index + 1}
                </span>
                <span className="mt-1 block">{option.label}</span>
              </span>
            </label>
          );
        })}
      </fieldset>

      {!submittedOptionId ? (
        <button
          className="inline-flex min-h-11 items-center justify-center rounded-control bg-dec-blue px-4 py-3 text-sm font-semibold text-white transition hover:bg-deep-navy focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dec-blue disabled:cursor-not-allowed disabled:opacity-50"
          disabled={!selectedOption}
          onClick={() => setSubmittedOptionId(selectedOptionId)}
          type="button"
        >
          Check Answer
        </button>
      ) : null}

      {submittedOption ? (
        <div
          aria-live="polite"
          className={[
            "rounded-card border p-5 text-sm leading-7 shadow-soft",
            submittedOption.isCorrect
              ? "border-dec-green/30 bg-dec-green/15 text-[#365c19]"
              : "border-[#f6d365] bg-[#fff7db] text-[#7a4d00]",
          ].join(" ")}
        >
          <p className="font-semibold">
            {submittedOption.isCorrect ? "Correct" : "Not quite"}
          </p>
          <p className="mt-1">
            {feedback ||
              (submittedOption.isCorrect
                ? "That answer is correct."
                : "Review the options and try again.")}
          </p>
          {retryAllowed ? (
            <button
              className="mt-3 inline-flex min-h-10 items-center justify-center rounded-control border border-design-border bg-white px-3 py-2 text-xs font-semibold text-dark-ink transition hover:border-dec-blue hover:text-dec-blue focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dec-blue"
              onClick={() => {
                setSelectedOptionId("");
                setSubmittedOptionId("");
              }}
              type="button"
            >
              Try Again
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
