"use client";

import { ActionButton, StatusBadge } from "@/components/ui";
import { CreatorCourseContextBar } from "./CreatorCourseContextBar";
import { saveCreatorCourseMetadataAction } from "@/lib/creator-course-actions";
import type { CreatorCourseMetadataData } from "@/lib/creator-course-workflow";
import { useMemo, useState, type ReactNode } from "react";

type MetadataFieldProps = {
  children?: ReactNode;
  helper?: string;
  label: string;
};

const noticeMessages: Record<string, { message: string; tone: "error" | "success" }> = {
  invalid: {
    message:
      "Please complete the required metadata fields and choose different primary and secondary capacity areas.",
    tone: "error",
  },
  "not-found": {
    message: "This course could not be found or is no longer available.",
    tone: "error",
  },
  saved: {
    message: "Metadata saved.",
    tone: "success",
  },
  unauthorized: {
    message: "You do not have permission to update metadata for this course.",
    tone: "error",
  },
};

function MetadataField({ children, helper, label }: MetadataFieldProps) {
  return (
    <label className="block text-sm font-medium text-dark-ink">
      {label}
      {children}
      {helper ? (
        <span className="mt-2 block text-xs leading-5 text-muted-text">{helper}</span>
      ) : null}
    </label>
  );
}

function controlClasses(extra = "") {
  return [
    "mt-2 min-h-11 w-full rounded-control border border-design-border bg-white px-4 text-sm text-dark-ink outline-none transition focus:border-dec-blue focus:ring-4 focus:ring-dec-blue/20",
    extra,
  ]
    .filter(Boolean)
    .join(" ");
}

function Notice({ notice }: { notice?: string }) {
  if (!notice || !noticeMessages[notice]) {
    return null;
  }

  const details = noticeMessages[notice];

  return (
    <div
      className={
        details.tone === "success"
          ? "rounded-[18px] border border-dec-green/40 bg-dec-green/15 px-4 py-3 text-sm font-semibold text-[#426f1c]"
          : "rounded-[18px] border border-[#fecaca] bg-[#fef2f2] px-4 py-3 text-sm font-semibold text-[#991b1b]"
      }
      role={details.tone === "success" ? "status" : "alert"}
    >
      {details.message}
    </div>
  );
}

function MetadataHeader({
  courseId,
  courseTitle,
  status,
}: {
  courseId: string;
  courseTitle: string;
  status: string;
}) {
  return (
    <section className="overflow-hidden rounded-[28px] border border-design-border bg-deep-navy p-6 text-white shadow-hero lg:p-8">
      <div className="max-w-4xl">
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge label={status} tone="blue" />
          <StatusBadge label="Metadata" tone="green" />
        </div>
        <h1 className="mt-5 text-4xl font-semibold leading-tight sm:text-5xl">
          Metadata &amp; Capacity Linkage
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-white/75">
          Connect this course to its capacity area, participant profile, learning need,
          and intended practice improvement.
        </p>
        <p className="mt-5 max-w-2xl text-sm font-semibold leading-6 text-white">
          {courseTitle}
        </p>
        <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <ActionButton form="creator-metadata-form" size="lg" type="submit">
            Save Metadata
          </ActionButton>
          <ActionButton
            href={`/creator/courses/${courseId}/setup`}
            size="lg"
            variant="secondary"
          >
            Back to Setup
          </ActionButton>
          <ActionButton
            href={`/creator/courses/${courseId}/outcomes`}
            size="lg"
            variant="ghost"
          >
            Continue to Outcomes
          </ActionButton>
        </div>
      </div>
    </section>
  );
}

function MetadataCard({
  children,
  description,
  title,
}: {
  children: ReactNode;
  description: string;
  title: string;
}) {
  return (
    <section className="rounded-[24px] border border-design-border bg-white-surface p-6 shadow-soft">
      <div className="max-w-3xl">
        <h2 className="text-2xl font-semibold leading-tight text-dark-ink">{title}</h2>
        <p className="mt-2 text-sm leading-6 text-muted-text">{description}</p>
      </div>
      <div className="mt-6 grid gap-5 md:grid-cols-2">{children}</div>
    </section>
  );
}

function CapacitySelect({
  data,
  defaultValue,
  helper,
  label,
  name,
  required = false,
}: {
  data: CreatorCourseMetadataData;
  defaultValue: string;
  helper?: string;
  label: string;
  name: string;
  required?: boolean;
}) {
  return (
    <MetadataField helper={helper} label={label}>
      <select
        className={controlClasses()}
        defaultValue={defaultValue}
        name={name}
        required={required}
      >
        <option value="">Select capacity area</option>
        {data.capacityOptions.map((option) => (
          <option key={option.id} value={option.id}>
            {option.name}
          </option>
        ))}
      </select>
    </MetadataField>
  );
}

function OptionSelect({
  children,
  helper,
  label,
  name,
  onChange,
  required = false,
  value,
}: {
  children: ReactNode;
  helper?: string;
  label: string;
  name: string;
  onChange: (value: string) => void;
  required?: boolean;
  value: string;
}) {
  return (
    <MetadataField helper={helper} label={label}>
      <select
        className={controlClasses()}
        name={name}
        onChange={(event) => onChange(event.target.value)}
        required={required}
        value={value}
      >
        {children}
      </select>
    </MetadataField>
  );
}

function TextArea({
  defaultValue,
  helper,
  label,
  name,
  required = false,
}: {
  defaultValue: string;
  helper?: string;
  label: string;
  name: string;
  required?: boolean;
}) {
  return (
    <MetadataField helper={helper} label={label}>
      <textarea
        className={controlClasses("min-h-32 py-3 leading-6")}
        defaultValue={defaultValue}
        name={name}
        required={required}
      />
    </MetadataField>
  );
}

function TemplatePreviewThumbnail({
  templateId,
}: {
  templateId: CreatorCourseMetadataData["learnerTemplate"]["templateId"];
}) {
  if (templateId === "LT-PRACTICE-SCENARIO") {
    return (
      <div aria-hidden="true" className="rounded-[18px] border border-[#f3d7ac] bg-[#fffaf3] p-4">
        <div className="h-3 w-24 rounded-full bg-[#f59e0b]/30" />
        <div className="mt-3 rounded-[14px] border border-[#f3d7ac] bg-white p-3">
          <div className="h-2 w-20 rounded-full bg-deep-navy/25" />
          <div className="mt-2 h-2 w-full rounded-full bg-muted-text/20" />
          <div className="mt-2 h-2 w-4/5 rounded-full bg-muted-text/20" />
        </div>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          <div className="h-8 rounded-control border border-[#f3d7ac] bg-white" />
          <div className="h-8 rounded-control border border-[#f59e0b]/40 bg-[#f59e0b]/15" />
        </div>
      </div>
    );
  }

  if (templateId === "LT-RESOURCE-TOOLKIT") {
    return (
      <div aria-hidden="true" className="rounded-[18px] border border-dec-green/25 bg-[#fbfff7] p-4">
        <div className="h-3 w-28 rounded-full bg-dec-green/35" />
        <div className="mt-3 grid gap-2">
          {[0, 1, 2].map((index) => (
            <div className="flex items-center gap-3 rounded-[14px] border border-dec-green/25 bg-white p-2" key={index}>
              <div className="size-8 rounded-control bg-dec-green/20" />
              <div className="min-w-0 flex-1">
                <div className="h-2 w-4/5 rounded-full bg-deep-navy/20" />
                <div className="mt-2 h-2 w-2/5 rounded-full bg-muted-text/20" />
              </div>
              <div className="h-7 w-14 rounded-control bg-dec-blue/15" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (templateId === "LT-ASSESSMENT-PREP") {
    return (
      <div aria-hidden="true" className="rounded-[18px] border border-[#ddd6fe] bg-[#fcfbff] p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="h-3 w-24 rounded-full bg-[#8B5CF6]/30" />
          <div className="h-7 w-12 rounded-full bg-dec-green/25" />
        </div>
        <div className="mt-3 rounded-[14px] border border-[#ddd6fe] bg-white p-3">
          <div className="h-2 w-full rounded-full bg-deep-navy/25" />
          <div className="mt-3 space-y-2">
            <div className="h-8 rounded-control border border-[#ddd6fe] bg-[#f5f3ff]" />
            <div className="h-8 rounded-control border border-design-border bg-white" />
            <div className="h-8 rounded-control border border-design-border bg-white" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div aria-hidden="true" className="rounded-[18px] border border-dec-blue/20 bg-white p-4">
      <div className="h-3 w-28 rounded-full bg-dec-blue/25" />
      <div className="mt-3 space-y-2">
        <div className="h-2 w-full rounded-full bg-deep-navy/20" />
        <div className="h-2 w-11/12 rounded-full bg-muted-text/20" />
        <div className="h-2 w-3/4 rounded-full bg-muted-text/20" />
      </div>
      <div className="mt-4 rounded-[14px] border border-dec-blue/20 bg-dec-blue/10 p-3">
        <div className="h-2 w-20 rounded-full bg-dec-blue/35" />
        <div className="mt-2 h-2 w-4/5 rounded-full bg-dec-blue/20" />
      </div>
    </div>
  );
}

function LearnerTemplateSelector({
  onChange,
  selectedTemplateId,
  templates,
}: {
  onChange: (value: CreatorCourseMetadataData["learnerTemplate"]["templateId"]) => void;
  selectedTemplateId: CreatorCourseMetadataData["learnerTemplate"]["templateId"];
  templates: CreatorCourseMetadataData["learnerTemplateOptions"];
}) {
  return (
    <section className="rounded-[24px] border border-dec-blue/20 bg-white-surface p-6 shadow-soft">
      <div className="max-w-3xl">
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge label="Learner template" tone="blue" />
          <StatusBadge label="Participant preview" tone="green" />
        </div>
        <h2 className="mt-4 text-2xl font-semibold leading-tight text-dark-ink">
          Participant course experience
        </h2>
        <p className="mt-2 text-sm leading-6 text-muted-text">
          Choose the approved learner template used in preview and in the participant
          course player. The DEC theme and outline navigation stay fixed for Phase 1.
        </p>
      </div>
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        {templates.map((template) => {
          const isSelected = template.templateId === selectedTemplateId;

          return (
            <label
              className={[
                "block cursor-pointer rounded-[20px] border p-5 transition focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-dec-blue",
                isSelected
                  ? "border-dec-blue bg-dec-blue/10 shadow-soft"
                  : "border-design-border bg-soft-bg hover:border-dec-blue/40 hover:bg-white",
              ].join(" ")}
              key={template.templateId}
            >
              <input
                className="sr-only"
                checked={isSelected}
                name="learnerTemplateId"
                onChange={(event) =>
                  onChange(
                    event.target.value as CreatorCourseMetadataData["learnerTemplate"]["templateId"],
                  )
                }
                type="radio"
                value={template.templateId}
              />
              <TemplatePreviewThumbnail templateId={template.templateId} />
              <span className="mt-4 flex items-start justify-between gap-4">
                <span>
                  <span className="block text-base font-semibold text-dark-ink">
                    {template.templateLabel}
                  </span>
                  <span className="mt-2 block text-sm leading-6 text-muted-text">
                    {template.templateSummary}.
                  </span>
                </span>
                <span
                  className={[
                    "flex size-8 shrink-0 items-center justify-center rounded-full border text-xs font-bold",
                    isSelected
                      ? "border-dec-blue bg-white text-dec-blue"
                      : "border-design-border bg-white text-muted-text",
                  ].join(" ")}
                  aria-hidden="true"
                >
                  {isSelected ? "ON" : ""}
                </span>
              </span>
              <span className="mt-4 block rounded-control border border-white/70 bg-white px-3 py-2 text-xs font-semibold text-muted-text">
                {template.navigationStyleId === "SIDEBAR_OUTLINE"
                  ? "Sidebar outline"
                  : template.navigationStyleId}{" "}
                - {template.themeId === "DEC_DEFAULT" ? "DEC theme" : template.themeId}
              </span>
            </label>
          );
        })}
      </div>
    </section>
  );
}

export function CreatorCourseMetadata({
  data,
  metadataNotice,
}: {
  data: CreatorCourseMetadataData;
  metadataNotice?: string;
}) {
  const [primaryCapacityAreaId, setPrimaryCapacityAreaId] = useState(
    data.primaryCapacityAreaId,
  );
  const [csoPracticeId, setCsoPracticeId] = useState(data.csoPracticeId);
  const [standardFamilyId, setStandardFamilyId] = useState(data.standardFamilyId);
  const [indicatorId, setIndicatorId] = useState(data.indicatorId);
  const [learnerTemplateId, setLearnerTemplateId] = useState(
    data.learnerTemplate.templateId,
  );

  const csoPracticeOptions = useMemo(
    () =>
      data.csoPracticeOptions.filter(
        (option) => option.capacityAreaId === primaryCapacityAreaId,
      ),
    [data.csoPracticeOptions, primaryCapacityAreaId],
  );
  const indicatorOptions = useMemo(
    () =>
      data.indicatorOptions.filter(
        (option) =>
          option.capacityAreaId === primaryCapacityAreaId &&
          (!option.csoPracticeId || option.csoPracticeId === csoPracticeId) &&
          (!standardFamilyId || option.standardFamilyId === standardFamilyId),
      ),
    [csoPracticeId, data.indicatorOptions, primaryCapacityAreaId, standardFamilyId],
  );

  return (
    <div className="space-y-6">
      <MetadataHeader
        courseId={data.courseId}
        courseTitle={data.courseTitle}
        status={data.status}
      />
      <Notice notice={metadataNotice} />
      <CreatorCourseContextBar
        ariaLabel="Course metadata context"
        items={[
          { label: "Course", value: data.courseTitle },
          { label: "Capacity area", value: data.primaryCapacityAreaName },
          { label: "Status", value: data.status },
          { label: "Current step", value: "Metadata" },
        ]}
      />

      <form
        action={saveCreatorCourseMetadataAction}
        className="space-y-6"
        id="creator-metadata-form"
      >
        <input name="courseId" type="hidden" value={data.courseId} />

        <LearnerTemplateSelector
          onChange={setLearnerTemplateId}
          selectedTemplateId={learnerTemplateId}
          templates={data.learnerTemplateOptions}
        />

        <MetadataCard
          description="Choose the lightweight Phase 1 capacity linkage used for course discovery and reporting."
          title="Capacity linkage"
        >
          <OptionSelect
            helper="Required. Choose the best-fit capacity area for this course."
            label="Primary capacity area"
            name="primaryCapacityAreaId"
            onChange={(value) => {
              setPrimaryCapacityAreaId(value);
              setCsoPracticeId("");
              setIndicatorId("");
            }}
            required
            value={primaryCapacityAreaId}
          >
            <option value="">Select capacity area</option>
            {data.capacityOptions.map((option) => (
              <option key={option.id} value={option.id}>
                {option.name}
              </option>
            ))}
          </OptionSelect>
          <CapacitySelect
            data={data}
            defaultValue={data.secondaryCapacityAreaId}
            helper="Optional. Use only when the course clearly supports another area."
            label="Secondary capacity area"
            name="secondaryCapacityAreaId"
          />
          <OptionSelect
            helper="Required. Options narrow after choosing the primary capacity area."
            label="CSO practice"
            name="csoPracticeId"
            onChange={(value) => {
              setCsoPracticeId(value);
              setIndicatorId("");
            }}
            required
            value={csoPracticeId}
          >
            <option value="">Select CSO practice</option>
            {csoPracticeOptions.map((option) => (
              <option key={option.id} value={option.id}>
                {option.name}
              </option>
            ))}
          </OptionSelect>
          <OptionSelect
            helper="Optional. Narrows the indicator list when selected."
            label="Standard family"
            name="standardFamilyId"
            onChange={(value) => {
              setStandardFamilyId(value);
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
          </OptionSelect>
          <OptionSelect
            helper="Optional. Indicators narrow by capacity area, CSO practice, and standard family."
            label="Indicator"
            name="indicatorId"
            onChange={setIndicatorId}
            value={indicatorId}
          >
            <option value="">Select indicator</option>
            {indicatorOptions.map((option) => (
              <option key={option.id} value={option.id}>
                {option.indicatorCode} - {option.name}
              </option>
            ))}
          </OptionSelect>
        </MetadataCard>

        <MetadataCard
          description="Describe who the course is for and the practical learning need it addresses."
          title="Participant and learning need"
        >
          <TextArea
            defaultValue={data.targetCsoProfile}
            helper="Required. Keep this specific to the CSO profile or participant role."
            label="Target CSO profile"
            name="targetCsoProfile"
            required
          />
          <TextArea
            defaultValue={data.capacityGapAddressed}
            helper="Required. State the capacity gap this course is designed to address."
            label="Capacity gap addressed"
            name="capacityGapAddressed"
            required
          />
          <TextArea
            defaultValue={data.currentPracticeBaseline}
            helper="Optional. Describe the current practice pattern before learning."
            label="Current practice baseline"
            name="currentPracticeBaseline"
          />
          <TextArea
            defaultValue={data.desiredPractice}
            helper="Optional. Describe the improved practice the course should support."
            label="Desired practice"
            name="desiredPractice"
          />
        </MetadataCard>

        <MetadataCard
          description="Capture the intended practice change and the learning fit for this course."
          title="Practice improvement and course fit"
        >
          <TextArea
            defaultValue={data.intendedPracticeImprovement}
            helper="Required. Describe what participants should be able to do differently after the course."
            label="Intended practice improvement"
            name="intendedPracticeImprovement"
            required
          />
          <TextArea
            defaultValue={data.rootCauseSummary}
            helper="Optional. Summarize the practical cause this learning should address."
            label="Root cause summary"
            name="rootCauseSummary"
          />
          <MetadataField
            helper="Required. Choose the main learning barrier this course addresses."
            label="K/S/M/E primary"
          >
            <select
              className={controlClasses()}
              defaultValue={data.ksmePrimary}
              name="ksmePrimary"
              required
            >
              <option value="">Select primary factor</option>
              {data.ksmeOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
          </MetadataField>
          <MetadataField helper="Optional. Add a secondary factor when useful." label="K/S/M/E secondary">
            <select className={controlClasses()} defaultValue={data.ksmeSecondary} name="ksmeSecondary">
              <option value="">Select secondary factor</option>
              {data.ksmeOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
          </MetadataField>
          <MetadataField helper="Optional. Clarify whether a course can address this need." label="Learning can help">
            <select className={controlClasses()} defaultValue={data.learningCanHelp} name="learningCanHelp">
              <option value="">Select option</option>
              {data.learningCanHelpOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
          </MetadataField>
          <MetadataField helper="Required. Choose the best-fit course decision." label="Course-fit decision">
            <select
              className={controlClasses()}
              defaultValue={data.courseFitDecision}
              name="courseFitDecision"
              required
            >
              <option value="">Select decision</option>
              {data.courseFitDecisionOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
          </MetadataField>
          <TextArea
            defaultValue={data.courseFitNote}
            helper="Optional. Add a short note about why the course is the right fit."
            label="Course-fit note"
            name="courseFitNote"
          />
        </MetadataCard>

        <MetadataCard
          description="Capture any practical support, safeguarding, or accessibility notes creators should keep in mind."
          title="Support notes"
        >
          <TextArea
            defaultValue={data.recommendedPrerequisites}
            helper="Optional. List any recommended preparation, prior knowledge, or documents."
            label="Recommended prerequisites"
            name="recommendedPrerequisites"
          />
          <TextArea
            defaultValue={data.relatedFollowUpSupport}
            helper="Optional. Mention any related coaching, resources, or support after completion."
            label="Related follow-up support"
            name="relatedFollowUpSupport"
          />
          <TextArea
            defaultValue={data.safeguardingNote}
            helper="Optional. Note any content safety considerations for the course team."
            label="Safeguarding note"
            name="safeguardingNote"
          />
          <TextArea
            defaultValue={data.accessibilityNote}
            helper="Optional. Note accessibility or low-bandwidth considerations."
            label="Accessibility note"
            name="accessibilityNote"
          />
        </MetadataCard>

        <div className="flex flex-col gap-3 rounded-[24px] border border-design-border bg-white-surface p-5 shadow-soft sm:flex-row sm:flex-wrap sm:justify-end">
          <ActionButton type="submit">Save Metadata</ActionButton>
          <ActionButton
            href={`/creator/courses/${data.courseId}/setup`}
            variant="secondary"
          >
            Back to Setup
          </ActionButton>
          <ActionButton
            href={`/creator/courses/${data.courseId}/outcomes`}
            variant="ghost"
          >
            Continue to Outcomes
          </ActionButton>
        </div>
      </form>
    </div>
  );
}
