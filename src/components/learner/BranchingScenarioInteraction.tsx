"use client";

import { useState } from "react";

export type BranchingChoice = {
  feedback: string;
  id: string;
  label: string;
  outcomeTone: string;
};

export type BranchingScenarioInteractionProps = {
  allowRetry: boolean;
  choices: BranchingChoice[];
  learningPoint: string;
};

function getToneBadge(tone: string) {
  switch (tone) {
    case "positive":
      return {
        classes: "bg-dec-green/15 text-[#426f1c]",
        label: "Stronger approach",
      };
    case "caution":
      return {
        classes: "bg-[#fff7db] text-[#7a4d00]",
        label: "Needs consideration",
      };
    default:
      return {
        classes: "bg-soft-bg text-muted-text",
        label: "Consider this",
      };
  }
}

function getToneCardClasses(tone: string) {
  switch (tone) {
    case "positive":
      return "border-dec-green/30 bg-dec-green/15";
    case "caution":
      return "border-[#f6d365] bg-[#fff7db]";
    default:
      return "border-design-border bg-soft-bg";
  }
}

export function BranchingScenarioInteraction({
  allowRetry,
  choices,
  learningPoint,
}: BranchingScenarioInteractionProps) {
  const [selectedId, setSelectedId] = useState("");
  const selectedChoice = choices.find((choice) => choice.id === selectedId) ?? null;

  return (
    <div className="mt-5 space-y-4">
      <fieldset className="grid gap-3">
        <legend className="sr-only">Choose one response</legend>
        {choices.map((choice, index) => {
          const isSelected = selectedId === choice.id;
          const tone = getToneBadge(choice.outcomeTone);
          const toneCard = getToneCardClasses(choice.outcomeTone);

          return (
            <div key={choice.id}>
              <button
                aria-pressed={isSelected}
                className={[
                  "w-full rounded-card border p-5 text-left text-sm transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dec-blue",
                  isSelected
                    ? `${toneCard} shadow-card`
                    : "border-design-border bg-white hover:border-dec-blue/40 hover:bg-dec-blue/5 hover:shadow-soft",
                ].join(" ")}
                disabled={Boolean(selectedChoice) && !isSelected}
                onClick={() => setSelectedId(choice.id)}
                type="button"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex gap-3">
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-dec-blue/10 text-xs font-bold text-dec-blue">
                      {index + 1}
                    </span>
                    <p className="font-semibold leading-6 text-dark-ink">
                      {choice.label}
                    </p>
                  </div>
                  {isSelected ? (
                    <span
                      className={`shrink-0 rounded-full px-2 py-1 text-[11px] font-semibold ${tone.classes}`}
                    >
                      {tone.label}
                    </span>
                  ) : null}
                </div>
                {isSelected && choice.feedback ? (
                  <p
                    aria-live="polite"
                    className="mt-3 leading-6 text-muted-text"
                  >
                    {choice.feedback}
                  </p>
                ) : null}
              </button>
            </div>
          );
        })}
      </fieldset>

      {selectedChoice && learningPoint ? (
        <div
          aria-live="polite"
          className="rounded-card border border-dec-green/30 bg-dec-green/15 p-5 shadow-soft"
        >
          <p className="text-xs font-semibold uppercase text-[#426f1c]">
            Learning point
          </p>
          <p className="mt-2 text-sm font-semibold leading-7 text-[#365c19]">
            {learningPoint}
          </p>
        </div>
      ) : null}

      {selectedChoice && allowRetry ? (
        <button
          className="inline-flex min-h-10 items-center justify-center rounded-control border border-design-border bg-white px-3 py-2 text-xs font-semibold text-dark-ink transition hover:border-dec-blue hover:text-dec-blue focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dec-blue"
          onClick={() => setSelectedId("")}
          type="button"
        >
          Try Again
        </button>
      ) : null}
    </div>
  );
}
