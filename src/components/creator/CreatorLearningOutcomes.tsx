"use client";

import { saveCreatorOutcomesAction } from "@/lib/creator-materials-actions";
import type {
  CreatorOutcomeItem,
  CreatorOutcomesData,
} from "@/lib/creator-materials-workflow";
import { ActionButton, StatusBadge } from "@/components/ui";
import { CreatorCourseContextBar } from "./CreatorCourseContextBar";
import { useMemo, useState, type ReactNode } from "react";

type CreatorLearningOutcomesProps = {
  data: CreatorOutcomesData;
  materialsNotice?: string;
};

const guidanceItems = [
  "Start with an action verb.",
  "Keep the outcome observable.",
  "Connect the outcome to practical CSO work.",
  "Avoid vague wording such as \"understand everything.\"",
  "Link outcomes to final test questions where relevant.",
];

const readinessItems = [
  "At least one outcome added",
  "Outcomes use action verbs",
  "Outcomes match the course level",
  "Outcomes connect to lesson blocks",
  "Outcomes can be assessed through final test or practice activity",
];

const noticeCopy: Record<string, { label: string; message: string; tone: "green" | "red" | "blue" }> = {
  invalid: {
    label: "Check outcomes",
    message: "Add at least one learning outcome before saving.",
    tone: "red",
  },
  saved: {
    label: "Saved",
    message: "Learning outcomes were saved.",
    tone: "green",
  },
  unauthorized: {
    label: "Read-only",
    message: "This course cannot be edited while it is published or in review.",
    tone: "red",
  },
};

function outcomeSlots(data: CreatorOutcomesData) {
  const existing = data.outcomes;
  const slotCount = Math.max(5, existing.length + 2);

  return Array.from({ length: Math.min(slotCount, 8) }, (_, index) =>
    existing[index] ?? {
      alignment: {
        assessmentMethod: "",
        capacityAreaId: "",
        csoPracticeId: "",
        evidenceType: "",
        indicatorId: "",
        localOutcomeStatement: "",
        measurementLevel: "",
        observableAction: "",
        standardFamilyId: "",
        successCriterion: "",
      },
      id: `new-${index + 1}`,
      order: index + 1,
      statement: "",
    },
  );
}

function OutcomesHeader({ data }: { data: CreatorOutcomesData }) {
  return (
    <section className="overflow-hidden rounded-[28px] border border-design-border bg-deep-navy p-6 text-white shadow-hero lg:p-8">
      <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_360px] xl:items-center">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge label={data.isEditable ? "Editable" : "Read-only"} tone={data.isEditable ? "green" : "gray"} />
            <StatusBadge label="Course design" tone="blue" />
          </div>
          <h1 className="mt-5 text-4xl font-semibold leading-tight sm:text-5xl">
            Learning Outcomes
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-white/75">
            Define what participants should be able to understand, apply, or
            prepare by the end of this course.
          </p>
          <p className="mt-5 max-w-2xl text-sm font-semibold leading-6 text-white">
            {data.title}
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <ActionButton disabled={!data.isEditable} type="submit" size="lg">
              Save Outcomes
            </ActionButton>
            <ActionButton
              href={`/creator/courses/${data.courseId}/setup`}
              size="lg"
              variant="secondary"
            >
              Back to Setup
            </ActionButton>
            <ActionButton
              href={`/creator/courses/${data.courseId}/build`}
              size="lg"
              variant="ghost"
            >
              Continue to Build Studio
            </ActionButton>
          </div>
        </div>

        <article className="rounded-[24px] border border-white/15 bg-white/10 p-5">
          <p className="text-sm font-semibold text-dec-green">Outcome focus</p>
          <h2 className="mt-3 text-2xl font-semibold leading-tight">
            Keep course goals practical and assessable.
          </h2>
          <p className="mt-3 text-sm leading-6 text-white/70">
            Good outcomes help shape lesson content, practice activities, and
            final test questions into one clear learning journey.
          </p>
          <dl className="mt-6 grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-[16px] bg-white/10 p-3">
              <dt className="text-white/65">Outcomes</dt>
              <dd className="mt-1 text-2xl font-semibold text-white">
                {data.outcomes.length}
              </dd>
            </div>
            <div className="rounded-[16px] bg-white/10 p-3">
              <dt className="text-white/65">Current step</dt>
              <dd className="mt-1 font-semibold text-white">Outcomes</dd>
            </div>
          </dl>
        </article>
      </div>
    </section>
  );
}

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

function Notice({ materialsNotice }: { materialsNotice?: string }) {
  if (!materialsNotice || !noticeCopy[materialsNotice]) {
    return null;
  }

  const notice = noticeCopy[materialsNotice];

  return (
    <section className="rounded-[20px] border border-design-border bg-white-surface p-4 shadow-soft">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <StatusBadge label={notice.label} tone={notice.tone} />
        <p className="text-sm font-medium leading-6 text-dark-ink">{notice.message}</p>
      </div>
    </section>
  );
}

function OutcomesList({ data }: { data: CreatorOutcomesData }) {
  const slots = outcomeSlots(data);

  return (
    <Panel
      description="Use clear, observable outcomes that can guide lessons, practice tasks, and final test questions."
      title="Outcomes list"
    >
      <div className="space-y-4">
        {slots.map((outcome, index) => (
          <OutcomeCard
            data={data}
            index={index}
            key={outcome.id}
            outcome={outcome}
          />
        ))}
      </div>
    </Panel>
  );
}

function controlClasses(extra = "") {
  return [
    "mt-2 min-h-11 w-full rounded-control border border-design-border bg-white px-4 text-sm text-dark-ink outline-none transition focus:border-dec-blue focus:ring-4 focus:ring-dec-blue/20 disabled:cursor-not-allowed disabled:bg-soft-bg disabled:text-muted-text",
    extra,
  ]
    .filter(Boolean)
    .join(" ");
}

function OutcomeCard({
  data,
  index,
  outcome,
}: {
  data: CreatorOutcomesData;
  index: number;
  outcome: CreatorOutcomeItem;
}) {
  const number = index + 1;
  const [capacityAreaId, setCapacityAreaId] = useState(outcome.alignment.capacityAreaId);
  const [csoPracticeId, setCsoPracticeId] = useState(outcome.alignment.csoPracticeId);
  const [standardFamilyId, setStandardFamilyId] = useState(
    outcome.alignment.standardFamilyId,
  );
  const [indicatorId, setIndicatorId] = useState(outcome.alignment.indicatorId);
  const csoPracticeOptions = useMemo(
    () =>
      data.csoPracticeOptions.filter(
        (option) => option.capacityAreaId === capacityAreaId,
      ),
    [capacityAreaId, data.csoPracticeOptions],
  );
  const indicatorOptions = useMemo(
    () =>
      data.indicatorOptions.filter(
        (option) =>
          option.capacityAreaId === capacityAreaId &&
          (!option.csoPracticeId || option.csoPracticeId === csoPracticeId) &&
          (!standardFamilyId || option.standardFamilyId === standardFamilyId),
      ),
    [capacityAreaId, csoPracticeId, data.indicatorOptions, standardFamilyId],
  );

  return (
    <article className="rounded-[22px] border border-design-border bg-white p-5 shadow-soft">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-control bg-dec-blue/10 text-sm font-semibold text-[#216f9d]">
          {number}
        </div>
        <div className="min-w-0 flex-1 space-y-5">
          <label
            className="block text-sm font-medium text-dark-ink"
            htmlFor={`outcome-${number}`}
          >
            Outcome statement
            <textarea
              className={controlClasses("min-h-24 py-3 leading-6")}
              defaultValue={outcome.statement}
              disabled={!data.isEditable}
              id={`outcome-${number}`}
              name={`outcome-${number}`}
              placeholder="Participants will be able to..."
            />
          </label>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="block text-sm font-medium text-dark-ink">
              Capacity area
              <select
                className={controlClasses()}
                disabled={!data.isEditable}
                name={`capacityAreaId-${number}`}
                onChange={(event) => {
                  setCapacityAreaId(event.target.value);
                  setCsoPracticeId("");
                  setIndicatorId("");
                }}
                value={capacityAreaId}
              >
                <option value="">Select capacity area</option>
                {data.capacityOptions.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-sm font-medium text-dark-ink">
              CSO practice
              <select
                className={controlClasses()}
                disabled={!data.isEditable}
                name={`csoPracticeId-${number}`}
                onChange={(event) => {
                  setCsoPracticeId(event.target.value);
                  setIndicatorId("");
                }}
                value={csoPracticeId}
              >
                <option value="">Select CSO practice</option>
                {csoPracticeOptions.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-sm font-medium text-dark-ink">
              Local outcome statement
              <input
                className={controlClasses()}
                defaultValue={outcome.alignment.localOutcomeStatement}
                disabled={!data.isEditable}
                name={`localOutcomeStatement-${number}`}
              />
            </label>
            <label className="block text-sm font-medium text-dark-ink">
              Observable action
              <input
                className={controlClasses()}
                defaultValue={outcome.alignment.observableAction}
                disabled={!data.isEditable}
                name={`observableAction-${number}`}
              />
            </label>
            <label className="block text-sm font-medium text-dark-ink">
              Standard family
              <select
                className={controlClasses()}
                disabled={!data.isEditable}
                name={`standardFamilyId-${number}`}
                onChange={(event) => {
                  setStandardFamilyId(event.target.value);
                  setIndicatorId("");
                }}
                value={standardFamilyId}
              >
                <option value="">Select standard family</option>
                {data.standardFamilyOptions.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-sm font-medium text-dark-ink">
              Indicator
              <select
                className={controlClasses()}
                disabled={!data.isEditable}
                name={`indicatorId-${number}`}
                onChange={(event) => setIndicatorId(event.target.value)}
                value={indicatorId}
              >
                <option value="">Select indicator</option>
                {indicatorOptions.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.indicatorCode} - {option.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-sm font-medium text-dark-ink">
              Measurement level
              <select
                className={controlClasses()}
                defaultValue={outcome.alignment.measurementLevel}
                disabled={!data.isEditable}
                name={`measurementLevel-${number}`}
              >
                <option value="">Select level</option>
                {data.measurementLevelOptions.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-sm font-medium text-dark-ink">
              Assessment method
              <select
                className={controlClasses()}
                defaultValue={outcome.alignment.assessmentMethod}
                disabled={!data.isEditable}
                name={`assessmentMethod-${number}`}
              >
                <option value="">Select method</option>
                {data.assessmentMethodOptions.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-sm font-medium text-dark-ink">
              Evidence type
              <select
                className={controlClasses()}
                defaultValue={outcome.alignment.evidenceType}
                disabled={!data.isEditable}
                name={`evidenceType-${number}`}
              >
                <option value="">Select evidence type</option>
                {data.evidenceTypeOptions.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-sm font-medium text-dark-ink md:col-span-2">
              Success criterion
              <input
                className={controlClasses()}
                defaultValue={outcome.alignment.successCriterion}
                disabled={!data.isEditable}
                name={`successCriterion-${number}`}
              />
            </label>
          </div>
        </div>
      </div>
    </article>
  );
}

function GuidanceCard() {
  return (
    <article className="rounded-[24px] border border-design-border bg-white-surface p-6 shadow-soft">
      <StatusBadge label="Outcome quality" tone="blue" />
      <h2 className="mt-4 text-xl font-semibold text-deep-navy">
        Outcome quality guidance
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
  );
}

function ReadinessChecklist({ hasOutcomes }: { hasOutcomes: boolean }) {
  return (
    <article className="rounded-[24px] border border-design-border bg-white-surface p-6 shadow-soft">
      <StatusBadge label="Readiness" tone={hasOutcomes ? "green" : "gold"} />
      <h2 className="mt-4 text-xl font-semibold text-deep-navy">
        Lightweight readiness checklist
      </h2>
      <ul className="mt-6 space-y-4">
        {readinessItems.map((item, index) => (
          <li className="flex gap-3" key={item}>
            <span
              aria-hidden="true"
              className={`mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
                index === 0 && !hasOutcomes
                  ? "bg-amber-50 text-amber-700"
                  : "bg-dec-green/20 text-[#426f1c]"
              }`}
            >
              {index === 0 && !hasOutcomes ? "!" : "OK"}
            </span>
            <span className="text-sm leading-6 text-muted-text">{item}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}

export function CreatorLearningOutcomes({
  data,
  materialsNotice,
}: CreatorLearningOutcomesProps) {
  return (
    <form action={saveCreatorOutcomesAction} className="space-y-6">
      <input name="courseId" type="hidden" value={data.courseId} />
      <input name="returnPath" type="hidden" value={`/creator/courses/${data.courseId}/outcomes`} />
      <OutcomesHeader data={data} />
      <Notice materialsNotice={materialsNotice} />
      <CreatorCourseContextBar
        ariaLabel="Learning outcomes context"
        items={[
          { label: "Course", value: data.title },
          { label: "Capacity area", value: data.capacityArea },
          { label: "Outcomes", value: String(data.outcomes.length) },
          { label: "Course status", value: data.status.replaceAll("_", " ").toLowerCase() },
          { label: "Current step", value: "Outcomes" },
        ]}
      />

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px] xl:items-start">
        <div className="space-y-6">
          <OutcomesList data={data} />
          <div className="flex flex-col gap-3 rounded-[24px] border border-design-border bg-white-surface p-5 shadow-soft sm:flex-row sm:flex-wrap sm:justify-end">
            <ActionButton disabled={!data.isEditable} type="submit">
              Save Outcomes
            </ActionButton>
            <ActionButton
              href={`/creator/courses/${data.courseId}/setup`}
              variant="secondary"
            >
              Back to Setup
            </ActionButton>
            <ActionButton href={`/creator/courses/${data.courseId}/build`} variant="ghost">
              Continue to Build Studio
            </ActionButton>
          </div>
        </div>

        <aside className="space-y-5">
          <GuidanceCard />
          <ReadinessChecklist hasOutcomes={data.outcomes.length > 0} />
        </aside>
      </section>
    </form>
  );
}
