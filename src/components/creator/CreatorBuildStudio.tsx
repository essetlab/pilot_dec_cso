"use client";

import { useState } from "react";
import type {
  BuildStudioBlock,
  BuildStudioCourse,
  BuildStudioLesson,
  BuildStudioModule,
} from "@/lib/build-studio-data";
import { ActionButton, StatusBadge } from "@/components/ui";
import {
  createBuildStudioBlock,
  createBuildStudioLesson,
  createBuildStudioModule,
  deleteBuildStudioBlock,
  deleteBuildStudioLesson,
  deleteBuildStudioModule,
  duplicateBuildStudioBlock,
  moveBuildStudioBlock,
  moveBuildStudioLesson,
  moveBuildStudioModule,
  renameBuildStudioLesson,
  renameBuildStudioModule,
  updateBuildStudioAccordionBlock,
  updateBuildStudioBlockSettings,
  updateBuildStudioCaseStudyBlock,
  updateBuildStudioExternalLinkBlock,
  updateBuildStudioFlashcardsBlock,
  updateBuildStudioImageBlock,
  updateBuildStudioKnowledgeCheckBlock,
  updateBuildStudioBranchingScenarioBlock,
  updateBuildStudioKeyMessageBlock,
  updateBuildStudioReflectionBlock,
  updateBuildStudioPracticalActivityBlock,
  updateBuildStudioResourceBlock,
  updateBuildStudioTextBlock,
  updateBuildStudioVideoBlock,
} from "@/lib/build-studio-actions";
import type { ContentBlockType } from "@/generated/prisma/enums";
import Link from "next/link";
import { CreatorCourseContextBar } from "./CreatorCourseContextBar";

const blockCategories = [
  {
    blocks: [
      {
        description: "Add lesson explanation or short reading content.",
        label: "Text",
        type: "TEXT",
      },
      {
        description: "Present a realistic CSO situation.",
        label: "Case Study",
        type: "CASE_STUDY",
      },
      {
        description: "Highlight a core takeaway.",
        label: "Key Message",
        type: "KEY_MESSAGE",
      },
    ],
    name: "Content",
  },
  {
    blocks: [
      {
        description: "Add an embedded, uploaded, or linked video.",
        label: "Video",
        type: "VIDEO",
      },
      {
        description: "Add a visual with caption and alt text.",
        label: "Image",
        type: "IMAGE",
      },
      {
        description: "Share a file or external resource.",
        label: "Resource",
        type: "RESOURCE",
      },
      {
        description: "Send learners to a trusted external page.",
        label: "External Link",
        type: "EXTERNAL_LINK",
      },
    ],
    name: "Media & Resources",
  },
  {
    blocks: [
      {
        description: "Organize expandable lesson content.",
        label: "Accordion",
        type: "ACCORDION",
      },
      {
        description: "Create lightweight reveal cards.",
        label: "Flashcards",
        type: "FLASHCARD",
      },
      {
        description: "Add a one-step decision practice.",
        label: "Branching Scenario",
        type: "BRANCHING_SCENARIO",
      },
    ],
    name: "Interactive",
  },
  {
    blocks: [
      {
        description: "Add a low-stakes practice question.",
        label: "Knowledge Check",
        type: "KNOWLEDGE_CHECK",
      },
      {
        description: "Guide learners to think about their context.",
        label: "Reflection",
        type: "REFLECTION_PROMPT",
      },
      {
        description: "Add an offline applied learning task.",
        label: "Practical Activity",
        type: "PRACTICAL_ACTIVITY_PROMPT",
      },
    ],
    name: "Assessment & Reflection",
  },
] satisfies Array<{
  blocks: Array<{
    description: string;
    label: string;
    type: ContentBlockType;
  }>;
  name: string;
}>;

const learningFunctionOptions = [
  ["", "Select function"],
  ["EXPLAIN", "Explain"],
  ["INVESTIGATE", "Investigate"],
  ["REFLECT", "Reflect"],
  ["PRACTICE", "Practice"],
  ["APPLY", "Apply"],
  ["PRODUCE", "Produce"],
  ["ASSESS", "Assess"],
  ["SUPPORT_ACCESS", "Support access"],
] as const;

const specializedConfigurationTypes = [
  "TEXT",
  "KEY_MESSAGE",
  "CASE_STUDY",
  "RESOURCE",
  "EXTERNAL_LINK",
  "IMAGE",
  "VIDEO",
  "ACCORDION",
  "FLASHCARD",
  "KNOWLEDGE_CHECK",
  "BRANCHING_SCENARIO",
  "REFLECTION_PROMPT",
  "PRACTICAL_ACTIVITY_PROMPT",
];

function formatCount(count: number, singular: string, plural: string) {
  return count === 1 ? `1 ${singular}` : `${count} ${plural}`;
}

function formatDuration(minutes: number | null) {
  if (!minutes || minutes < 1) {
    return null;
  }

  return `${minutes} min`;
}

const compactInputClasses =
  "min-h-10 w-full rounded-control border border-design-border bg-white px-3 py-2 text-sm text-dark-ink outline-none transition placeholder:text-muted-text/70 focus:border-dec-blue focus:ring-4 focus:ring-dec-blue/15";

const compactButtonClasses =
  "inline-flex min-h-9 items-center justify-center rounded-control border border-design-border bg-white px-3 py-2 text-xs font-semibold leading-none text-dark-ink transition hover:border-dec-blue hover:text-dec-blue focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dec-blue disabled:cursor-not-allowed disabled:opacity-50";

const dangerButtonClasses =
  "inline-flex min-h-9 items-center justify-center rounded-control border border-[#fecaca] bg-white px-3 py-2 text-xs font-semibold leading-none text-[#b91c1c] transition hover:bg-[#fef2f2] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ef4444] disabled:cursor-not-allowed disabled:opacity-50";

const textareaClasses =
  `${compactInputClasses} min-h-32 resize-y leading-6`;

function getPreviewText(value: string, maxLength = 280) {
  const normalized = value.replace(/\s+/g, " ").trim();

  if (normalized.length <= maxLength) {
    return normalized;
  }

  return `${normalized.slice(0, maxLength).trimEnd()}...`;
}

function getBlockConfig(block: BuildStudioBlock) {
  if (block.configJson && typeof block.configJson === "object") {
    return block.configJson as Record<string, unknown>;
  }

  return {};
}

function getConfigString(block: BuildStudioBlock, key: string) {
  const value = getBlockConfig(block)[key];

  return typeof value === "string" ? value : "";
}

function getConfigStringAny(block: BuildStudioBlock, keys: string[]) {
  for (const key of keys) {
    const value = getConfigString(block, key);

    if (value) {
      return value;
    }
  }

  return "";
}

function getConfigNumber(block: BuildStudioBlock, key: string) {
  const value = getBlockConfig(block)[key];

  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function getConfigArray(block: BuildStudioBlock, key: string) {
  const value = getBlockConfig(block)[key];

  return Array.isArray(value) ? value : [];
}

function getConfigBoolean(block: BuildStudioBlock, key: string, fallback = false) {
  const value = getBlockConfig(block)[key];

  return typeof value === "boolean" ? value : fallback;
}

function getKeyMessageStyle(block: BuildStudioBlock) {
  const style = getConfigStringAny(block, ["style", "tone"]);

  return ["info", "success", "warning", "neutral"].includes(style)
    ? style
    : "info";
}

function getFlashcardDisplayMode(block: BuildStudioBlock) {
  const displayMode = getConfigString(block, "displayMode");

  return displayMode === "stack" ? "stack" : "grid";
}

function getAccordionItems(block: BuildStudioBlock) {
  return getConfigArray(block, "items")
    .map((item, index) => {
      if (!item || typeof item !== "object") {
        return null;
      }

      const record = item as Record<string, unknown>;
      const id = typeof record.id === "string" ? record.id : `item-${index + 1}`;
      const title = typeof record.title === "string" ? record.title : "";
      const body = typeof record.body === "string" ? record.body : "";

      return { body, id, title };
    })
    .filter((item): item is { body: string; id: string; title: string } =>
      Boolean(item),
    );
}

function getFlashcards(block: BuildStudioBlock) {
  return getConfigArray(block, "cards")
    .map((card, index) => {
      if (!card || typeof card !== "object") {
        return null;
      }

      const record = card as Record<string, unknown>;
      const id = typeof record.id === "string" ? record.id : `card-${index + 1}`;
      const front = typeof record.front === "string" ? record.front : "";
      const back = typeof record.back === "string" ? record.back : "";

      return { back, front, id };
    })
    .filter((card): card is { back: string; front: string; id: string } =>
      Boolean(card),
    );
}

function getKnowledgeCheckOptions(block: BuildStudioBlock) {
  const correctOptionId = getConfigString(block, "correctOptionId");

  return getConfigArray(block, "options")
    .map((option, index) => {
      if (!option || typeof option !== "object") {
        return null;
      }

      const record = option as Record<string, unknown>;
      const id =
        typeof record.id === "string" ? record.id : `option-${index + 1}`;
      const rawLabel = record.label ?? record.text;
      const label = typeof rawLabel === "string" ? rawLabel : "";
      const feedback = typeof record.feedback === "string" ? record.feedback : "";
      const isCorrect =
        record.isCorrect === true ||
        (typeof record.id === "string" && record.id === correctOptionId);

      return { feedback, id, isCorrect, label };
    })
    .filter(
      (
        option,
      ): option is {
        feedback: string;
        id: string;
        isCorrect: boolean;
        label: string;
      } => Boolean(option),
    );
}

function getBranchingChoices(block: BuildStudioBlock) {
  const choices = getConfigArray(block, "choices");
  const options = getConfigArray(block, "options");
  const items =
    choices.length > 0
      ? choices
      : options.length > 0
        ? options
        : getConfigArray(block, "decisions");

  return items
    .map((choice, index) => {
      if (!choice || typeof choice !== "object") {
        return null;
      }

      const record = choice as Record<string, unknown>;
      const id = typeof record.id === "string" ? record.id : `choice-${index + 1}`;
      const rawLabel = record.label ?? record.text;
      const rawFeedback = record.feedback ?? record.consequence;
      const rawTone = record.outcomeTone ?? record.quality;
      const label = typeof rawLabel === "string" ? rawLabel : "";
      const feedback = typeof rawFeedback === "string" ? rawFeedback : "";
      const outcomeTone =
        typeof rawTone === "string" &&
        ["positive", "caution", "neutral"].includes(rawTone)
          ? rawTone
          : rawTone === "best" || rawTone === "strong"
            ? "positive"
            : rawTone === "unsafe" || rawTone === "weak" || rawTone === "risky"
              ? "caution"
          : "neutral";

      return label ? { feedback, id, label, outcomeTone } : null;
    })
    .filter(
      (
        choice,
      ): choice is {
        feedback: string;
        id: string;
        label: string;
        outcomeTone: string;
      } => Boolean(choice),
    );
}

function getResourceSourceType(block: BuildStudioBlock) {
  const sourceType = getConfigString(block, "sourceType");

  return ["external_link", "uploaded_file"].includes(sourceType)
    ? sourceType
    : "external_link";
}

function getResourceType(block: BuildStudioBlock) {
  const resourceType = getConfigString(block, "resourceType");

  return [
    "pdf",
    "doc",
    "spreadsheet",
    "presentation",
    "template",
    "link",
    "other",
  ].includes(resourceType)
    ? resourceType
    : "link";
}

function getImageDisplaySize(block: BuildStudioBlock) {
  const displaySize = getConfigString(block, "displaySize");

  return ["standard", "wide"].includes(displaySize) ? displaySize : "standard";
}

function getVideoSourceType(block: BuildStudioBlock) {
  const sourceType = getConfigString(block, "sourceType");

  return ["embed_url", "uploaded_file", "external_link"].includes(sourceType)
    ? sourceType
    : "embed_url";
}

function formatResourceType(value: string) {
  const labels: Record<string, string> = {
    doc: "Document",
    link: "Link",
    other: "Other",
    pdf: "PDF",
    presentation: "Presentation",
    spreadsheet: "Spreadsheet",
    template: "Template",
  };

  return labels[value] ?? "Resource";
}

function formatVideoSourceType(value: string) {
  const labels: Record<string, string> = {
    embed_url: "Embed URL",
    external_link: "External link",
    uploaded_file: "Uploaded file reference",
  };

  return labels[value] ?? "Video source";
}

function formatResourceSourceType(value: string) {
  return value === "uploaded_file" ? "Uploaded file reference" : "External link";
}

function getKeyMessagePreviewClasses(style: string) {
  const styles: Record<string, string> = {
    info: "border-dec-blue/25 bg-dec-blue/10 text-[#26536c]",
    neutral: "border-design-border bg-soft-bg text-muted-text",
    success: "border-dec-green/30 bg-dec-green/15 text-[#365c19]",
    warning: "border-[#f6d365] bg-[#fff7db] text-[#7a4d00]",
  };

  return styles[style] ?? styles.info;
}

function getStudioNotice(notice?: string) {
  const notices: Record<string, { label: string; tone: "green" | "orange" | "gray" }> =
    {
      "block-created": { label: "Block added.", tone: "green" },
      "block-deleted": { label: "Block removed.", tone: "green" },
      "block-duplicated": { label: "Block duplicated.", tone: "green" },
      "block-moved": { label: "Block order updated.", tone: "green" },
      "block-saved": { label: "Block settings saved.", tone: "green" },
      "block-type-required": {
        label: "Choose a supported block type.",
        tone: "orange",
      },
      "accordion-block-saved": {
        label: "Accordion saved.",
        tone: "green",
      },
      "case-study-block-saved": {
        label: "Case study saved.",
        tone: "green",
      },
      "flashcards-block-saved": {
        label: "Flashcards saved.",
        tone: "green",
      },
      "image-block-saved": { label: "Image saved.", tone: "green" },
      "reflection-block-saved": {
        label: "Reflection saved.",
        tone: "green",
      },
      "practical-activity-block-saved": {
        label: "Practical activity saved.",
        tone: "green",
      },
      "branching-scenario-block-saved": {
        label: "Branching scenario saved.",
        tone: "green",
      },
      "knowledge-check-block-saved": {
        label: "Knowledge check saved.",
        tone: "green",
      },
      "key-message-block-saved": {
        label: "Key message saved.",
        tone: "green",
      },
      "lesson-created": { label: "Lesson added.", tone: "green" },
      "lesson-deleted": { label: "Lesson removed.", tone: "green" },
      "lesson-moved": { label: "Lesson order updated.", tone: "green" },
      "lesson-not-empty": {
        label: "Only empty lessons without learning activity can be removed.",
        tone: "orange",
      },
      "lesson-saved": { label: "Lesson title saved.", tone: "green" },
      "module-created": { label: "Module added.", tone: "green" },
      "module-deleted": { label: "Module removed.", tone: "green" },
      "module-moved": { label: "Module order updated.", tone: "green" },
      "module-not-empty": {
        label: "Remove lessons before removing this module.",
        tone: "orange",
      },
      "module-saved": { label: "Module title saved.", tone: "green" },
      "not-found": {
        label: "That outline item is no longer available.",
        tone: "orange",
      },
      "read-only-course": {
        label: "This course outline is read-only right now.",
        tone: "gray",
      },
      "resource-block-saved": { label: "Resource saved.", tone: "green" },
      "text-block-saved": { label: "Text block saved.", tone: "green" },
      "title-required": { label: "Add a title before saving.", tone: "orange" },
      "unsupported-block-settings": {
        label: "Select a matching block before saving.",
        tone: "orange",
      },
      "video-block-saved": { label: "Video saved.", tone: "green" },
    };

  return notice ? notices[notice] : undefined;
}

function BuildStudioHeader({
  course,
  studioNotice,
}: {
  course: BuildStudioCourse;
  studioNotice?: string;
}) {
  const notice = getStudioNotice(studioNotice);

  return (
    <section className="rounded-[28px] border border-design-border bg-white-surface p-5 shadow-soft lg:p-6">
      <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge label={course.statusLabel} tone="blue" />
            <StatusBadge label={course.lastSavedLabel} tone="green" />
            <StatusBadge label={course.capacityArea} tone="gray" />
          </div>
          <h1 className="mt-4 text-3xl font-semibold leading-tight text-dark-ink lg:text-4xl">
            {course.title}
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-text">
            Build structured lessons with focused learning blocks and a clear
            participant-ready flow.
          </p>
          {notice ? (
            <div className="mt-4">
              <StatusBadge label={notice.label} tone={notice.tone} />
            </div>
          ) : null}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap xl:justify-end">
          <ActionButton href={course.previewHref}>Preview Course</ActionButton>
          <ActionButton href="/creator/courses" variant="secondary">
            Back to My Courses
          </ActionButton>
          <ActionButton disabled variant="ghost">
            Submit for Review
          </ActionButton>
        </div>
      </div>
    </section>
  );
}

function BlockLibraryPanel({
  course,
}: {
  course: BuildStudioCourse;
}) {
  const selectedLesson = course.selectedLesson;

  return (
    <aside className="order-3 space-y-5 xl:order-1">
      <section
        aria-labelledby="block-library-heading"
        className="rounded-[24px] border border-design-border bg-white-surface p-5 shadow-soft"
      >
        <div>
          <h2
            className="text-2xl font-semibold leading-tight text-dark-ink"
            id="block-library-heading"
          >
            Block Library
          </h2>
          <p className="mt-2 text-sm leading-6 text-muted-text">
            Use these learning block types to shape each lesson.
          </p>
        </div>

        <div className="mt-5 space-y-5">
          {blockCategories.map((category) => (
            <div key={category.name}>
              <h3 className="text-sm font-semibold text-deep-navy">
                {category.name}
              </h3>
              <div className="mt-3 grid gap-2">
                {category.blocks.map((block) => (
                  <form
                    action={createBuildStudioBlock}
                    className="rounded-control border border-design-border bg-soft-bg px-3 py-3"
                    key={block.type}
                  >
                    <input name="courseId" type="hidden" value={course.id} />
                    <input
                      name="lessonId"
                      type="hidden"
                      value={selectedLesson?.id ?? ""}
                    />
                    <input name="type" type="hidden" value={block.type} />
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <span className="block text-sm font-semibold text-dark-ink">
                          {block.label}
                        </span>
                        <span className="mt-1 block text-xs leading-5 text-muted-text">
                          {block.description}
                        </span>
                      </div>
                      <button
                        className={compactButtonClasses}
                        disabled={!course.canEditOutline || !selectedLesson}
                        type="submit"
                      >
                        Add
                      </button>
                    </div>
                  </form>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <CourseOutlinePanel
        canEditOutline={course.canEditOutline}
        courseId={course.id}
        editDisabledReason={course.editDisabledReason}
        modules={course.modules}
        outcomeOptions={course.outcomeOptions}
        selectedLesson={course.selectedLesson}
      />
    </aside>
  );
}

function CourseOutlinePanel({
  canEditOutline,
  courseId,
  editDisabledReason,
  modules,
  outcomeOptions,
  selectedLesson,
}: {
  canEditOutline: boolean;
  courseId: string;
  editDisabledReason: string | null;
  modules: BuildStudioModule[];
  outcomeOptions: BuildStudioCourse["outcomeOptions"];
  selectedLesson: BuildStudioLesson | null;
}) {
  return (
    <section
      aria-labelledby="course-outline-heading"
      className="rounded-[24px] border border-design-border bg-white-surface p-5 shadow-soft"
    >
      <div>
        <h2
          className="text-2xl font-semibold leading-tight text-dark-ink"
          id="course-outline-heading"
        >
          Course Outline
        </h2>
        <p className="mt-2 text-sm leading-6 text-muted-text">
          Review modules and lessons while keeping the current lesson in focus.
        </p>
      </div>

      {canEditOutline ? (
        <form action={createBuildStudioModule} className="mt-5 grid gap-3">
          <input name="courseId" type="hidden" value={courseId} />
          <input
            name="selectedLessonId"
            type="hidden"
            value={selectedLesson?.id ?? ""}
          />
          <label className="text-sm font-semibold text-deep-navy" htmlFor="new-module-title">
            New module
          </label>
          <div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto] xl:grid-cols-1">
            <input
              className={compactInputClasses}
              id="new-module-title"
              maxLength={140}
              name="title"
              placeholder="Module title"
              required
            />
            <button className={compactButtonClasses} type="submit">
              Add Module
            </button>
          </div>
        </form>
      ) : (
        <p className="mt-5 rounded-control border border-design-border bg-soft-bg px-3 py-3 text-sm leading-6 text-muted-text">
          {editDisabledReason ?? "This course outline is read-only right now."}
        </p>
      )}

      {modules.length === 0 ? (
        <PanelEmptyState
          description={
            canEditOutline
              ? "Start by adding your first module."
              : "Your course outline will appear here once modules are available."
          }
          title="No modules yet"
        />
      ) : (
        <div className="mt-5 space-y-4">
          {modules.map((module, moduleIndex) => (
            <ModuleOutlineCard
              canEditOutline={canEditOutline}
              courseId={courseId}
              key={module.id}
              module={module}
              moduleCount={modules.length}
              moduleIndex={moduleIndex}
              outcomeOptions={outcomeOptions}
              selectedLesson={selectedLesson}
            />
          ))}
        </div>
      )}
    </section>
  );
}

function ModuleOutlineCard({
  canEditOutline,
  courseId,
  module,
  moduleCount,
  moduleIndex,
  outcomeOptions,
  selectedLesson,
}: {
  canEditOutline: boolean;
  courseId: string;
  module: BuildStudioModule;
  moduleCount: number;
  moduleIndex: number;
  outcomeOptions: BuildStudioCourse["outcomeOptions"];
  selectedLesson: BuildStudioLesson | null;
}) {
  const duration = formatDuration(module.estimatedDurationMinutes);
  const canMoveUp = moduleIndex > 0;
  const canMoveDown = moduleIndex < moduleCount - 1;

  return (
    <article className="rounded-[18px] bg-soft-bg p-4">
      <div className="flex flex-col gap-2">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-sm font-semibold leading-6 text-deep-navy">
            Module {module.order}: {module.title}
          </h3>
          {canEditOutline ? (
            <div className="flex shrink-0 gap-1" aria-label={`${module.title} order controls`}>
              <OutlineMoveButton
                courseId={courseId}
                direction="up"
                disabled={!canMoveUp}
                itemId={module.id}
                itemName="moduleId"
                action={moveBuildStudioModule}
                selectedLessonId={selectedLesson?.id}
              />
              <OutlineMoveButton
                courseId={courseId}
                direction="down"
                disabled={!canMoveDown}
                itemId={module.id}
                itemName="moduleId"
                action={moveBuildStudioModule}
                selectedLessonId={selectedLesson?.id}
              />
            </div>
          ) : null}
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusBadge
            label={formatCount(module.lessons.length, "lesson", "lessons")}
            tone="gray"
          />
          {duration ? <StatusBadge label={duration} tone="green" /> : null}
        </div>
      </div>

      {canEditOutline ? (
        <div className="mt-3 grid gap-3">
          <form action={renameBuildStudioModule} className="grid gap-2">
            <input name="courseId" type="hidden" value={courseId} />
            <input name="moduleId" type="hidden" value={module.id} />
            <input
              name="selectedLessonId"
              type="hidden"
              value={selectedLesson?.id ?? ""}
            />
            <label className="sr-only" htmlFor={`module-title-${module.id}`}>
              Module title
            </label>
            <div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto] xl:grid-cols-1">
              <input
                className={compactInputClasses}
                defaultValue={module.title}
                id={`module-title-${module.id}`}
                maxLength={140}
                name="title"
                required
              />
              <button className={compactButtonClasses} type="submit">
                Save Module
              </button>
            </div>
          </form>

          <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-1">
            <form action={createBuildStudioLesson} className="grid gap-2">
              <input name="courseId" type="hidden" value={courseId} />
              <input name="moduleId" type="hidden" value={module.id} />
              <label className="sr-only" htmlFor={`new-lesson-${module.id}`}>
                New lesson title
              </label>
              <input
                className={compactInputClasses}
                id={`new-lesson-${module.id}`}
                maxLength={140}
                name="title"
                placeholder="Lesson title"
                required
              />
              <button className={compactButtonClasses} type="submit">
                Add Lesson
              </button>
            </form>

            <form action={deleteBuildStudioModule}>
              <input name="courseId" type="hidden" value={courseId} />
              <input name="moduleId" type="hidden" value={module.id} />
              <input
                name="selectedLessonId"
                type="hidden"
                value={selectedLesson?.id ?? ""}
              />
              <button
                className={dangerButtonClasses}
                disabled={!module.canDelete}
                type="submit"
              >
                Remove Empty Module
              </button>
            </form>
          </div>
        </div>
      ) : null}

      {module.lessons.length === 0 ? (
        <p className="mt-3 rounded-control border border-dashed border-design-border bg-white px-3 py-3 text-sm leading-6 text-muted-text">
          {canEditOutline
            ? "Add a lesson to begin building this module."
            : "Lessons added to this module will appear here."}
        </p>
      ) : (
        <div className="mt-3 space-y-2">
          {module.lessons.map((lesson, lessonIndex) => {
            const isCurrent = selectedLesson?.id === lesson.id;

            return (
              <div
                className={
                  isCurrent
                    ? "rounded-control border border-dec-blue bg-dec-blue/10 p-3"
                    : "rounded-control border border-transparent bg-white p-3"
                }
                key={lesson.id}
              >
                <Link
                  aria-current={isCurrent ? "step" : undefined}
                  className={
                    isCurrent
                      ? "block text-sm font-semibold leading-5 text-[#216f9d] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dec-blue"
                      : "block text-sm leading-5 text-muted-text transition hover:text-dark-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dec-blue"
                  }
                  href={`/creator/courses/${courseId}/build?lessonId=${encodeURIComponent(lesson.id)}`}
                >
                  <span>{lesson.title}</span>
                  <span className="mt-1 block text-xs font-medium">
                    {isCurrent
                      ? "Current lesson"
                      : formatCount(lesson.blockCount, "block", "blocks")}
                  </span>
                </Link>

                {canEditOutline ? (
                  <LessonOutlineControls
                    canMoveDown={lessonIndex < module.lessons.length - 1}
                    canMoveUp={lessonIndex > 0}
                    courseId={courseId}
                    isCurrent={isCurrent}
                    lesson={lesson}
                    outcomeOptions={outcomeOptions}
                    selectedLessonId={selectedLesson?.id}
                  />
                ) : null}
              </div>
            );
          })}
        </div>
      )}
    </article>
  );
}

function OutlineMoveButton({
  action,
  courseId,
  direction,
  disabled,
  itemId,
  itemName,
  selectedLessonId,
}: {
  action: (formData: FormData) => Promise<void>;
  courseId: string;
  direction: "up" | "down";
  disabled: boolean;
  itemId: string;
  itemName: "lessonId" | "moduleId";
  selectedLessonId?: string;
}) {
  return (
    <form action={action}>
      <input name="courseId" type="hidden" value={courseId} />
      <input name={itemName} type="hidden" value={itemId} />
      <input name="direction" type="hidden" value={direction} />
      <input name="selectedLessonId" type="hidden" value={selectedLessonId ?? ""} />
      <button
        aria-label={direction === "up" ? "Move up" : "Move down"}
        className={compactButtonClasses}
        disabled={disabled}
        type="submit"
      >
        {direction === "up" ? "Up" : "Down"}
      </button>
    </form>
  );
}

function LessonOutlineControls({
  canMoveDown,
  canMoveUp,
  courseId,
  isCurrent,
  lesson,
  outcomeOptions,
  selectedLessonId,
}: {
  canMoveDown: boolean;
  canMoveUp: boolean;
  courseId: string;
  isCurrent: boolean;
  lesson: BuildStudioLesson;
  outcomeOptions: BuildStudioCourse["outcomeOptions"];
  selectedLessonId?: string;
}) {
  return (
    <div className="mt-3 grid gap-2">
      <form action={renameBuildStudioLesson} className="grid gap-2">
        <input name="courseId" type="hidden" value={courseId} />
        <input name="lessonId" type="hidden" value={lesson.id} />
        <input name="selectedLessonId" type="hidden" value={selectedLessonId ?? ""} />
        <label className="sr-only" htmlFor={`lesson-title-${lesson.id}`}>
          Lesson title
        </label>
        <div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto] xl:grid-cols-1">
          <input
            className={compactInputClasses}
            defaultValue={lesson.title}
            id={`lesson-title-${lesson.id}`}
            maxLength={140}
            name="title"
            required
          />
          <button className={compactButtonClasses} type="submit">
            Save Lesson
          </button>
        </div>
        {outcomeOptions.length > 0 ? (
          <details className="rounded-control border border-design-border bg-white px-3 py-2">
            <summary className="cursor-pointer text-xs font-semibold text-muted-text">
              Lesson outcomes
            </summary>
            <div className="mt-3 grid gap-2">
              {outcomeOptions.map((outcome) => (
                <label className="flex items-start gap-2 text-xs leading-5 text-muted-text" key={outcome.id}>
                  <input
                    className="mt-1"
                    defaultChecked={lesson.linkedOutcomeIds.includes(outcome.id)}
                    name="lessonOutcomeIds"
                    type="checkbox"
                    value={outcome.id}
                  />
                  <span>
                    {outcome.order}. {outcome.statement}
                  </span>
                </label>
              ))}
            </div>
          </details>
        ) : null}
      </form>

      <div className="flex flex-wrap gap-2">
        <OutlineMoveButton
          action={moveBuildStudioLesson}
          courseId={courseId}
          direction="up"
          disabled={!canMoveUp}
          itemId={lesson.id}
          itemName="lessonId"
          selectedLessonId={selectedLessonId}
        />
        <OutlineMoveButton
          action={moveBuildStudioLesson}
          courseId={courseId}
          direction="down"
          disabled={!canMoveDown}
          itemId={lesson.id}
          itemName="lessonId"
          selectedLessonId={selectedLessonId}
        />
        <form action={deleteBuildStudioLesson}>
          <input name="courseId" type="hidden" value={courseId} />
          <input name="lessonId" type="hidden" value={lesson.id} />
          <input
            name="selectedLessonId"
            type="hidden"
            value={isCurrent ? lesson.id : selectedLessonId ?? ""}
          />
          <button
            className={dangerButtonClasses}
            disabled={!lesson.canDelete}
            type="submit"
          >
            Remove Empty Lesson
          </button>
        </form>
      </div>
    </div>
  );
}

function CourseCanvasPanel({
  course,
}: {
  course: BuildStudioCourse;
}) {
  const selectedLesson = course.selectedLesson;
  const selectedBlock = course.selectedBlock;

  return (
    <section
      aria-labelledby="course-canvas-heading"
      className="order-1 min-w-0 rounded-[28px] border border-design-border bg-white-surface p-5 shadow-soft xl:order-2"
    >
      <div className="flex flex-col gap-4 border-b border-design-border pb-5 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <StatusBadge
            label={selectedLesson ? "Current lesson" : "Course canvas"}
            tone="green"
          />
          <h2
            className="mt-3 text-3xl font-semibold leading-tight text-dark-ink"
            id="course-canvas-heading"
          >
            {selectedLesson?.title ?? "Select a lesson to begin"}
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-text">
            {selectedLesson
              ? "Learning blocks appear here in the order participants will experience them."
              : "Choose a lesson from the course outline to review its learning blocks."}
          </p>
        </div>
        <ActionButton href={course.previewHref} variant="secondary">
          Preview Course
        </ActionButton>
      </div>

      {!selectedLesson ? (
        <PanelEmptyState
          description="Lessons will appear in the canvas once the course outline is ready."
          title="No lesson selected"
        />
      ) : selectedLesson.blocks.length === 0 ? (
        <PanelEmptyState
          description="Add a block from the library to begin building this lesson."
          title="No blocks in this lesson"
        />
      ) : (
        <div className="mt-5 space-y-4">
          {selectedLesson.blocks.map((block, index) => (
            <CanvasBlockCard
              block={block}
              blockCount={selectedLesson.blocks.length}
              canEdit={course.canEditOutline}
              courseId={course.id}
              index={index + 1}
              isSelected={selectedBlock?.id === block.id}
              key={block.id}
              lessonId={selectedLesson.id}
            />
          ))}
        </div>
      )}
    </section>
  );
}

function CanvasBlockCard({
  block,
  blockCount,
  canEdit,
  courseId,
  index,
  isSelected,
  lessonId,
}: {
  block: BuildStudioBlock;
  blockCount: number;
  canEdit: boolean;
  courseId: string;
  index: number;
  isSelected: boolean;
  lessonId: string;
}) {
  const duration = formatDuration(block.estimatedDurationMinutes);
  const configureHref = `/creator/courses/${courseId}/build?lessonId=${encodeURIComponent(lessonId)}&blockId=${encodeURIComponent(block.id)}`;

  return (
    <article
      aria-current={isSelected ? "true" : undefined}
      className={
        isSelected
          ? "rounded-[22px] border-2 border-dec-blue bg-dec-blue/10 p-5 shadow-soft ring-4 ring-dec-blue/10"
          : "rounded-[22px] border border-design-border bg-white p-5 transition hover:border-dec-blue/60 hover:shadow-soft"
      }
    >
      <Link
        className="block rounded-control focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-dec-blue"
        href={configureHref}
      >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge label={`Block ${index}`} tone="gray" />
            <StatusBadge label={block.typeLabel} tone="blue" />
            {isSelected ? <StatusBadge label="Selected" tone="green" /> : null}
            {block.isRequired ? (
              <StatusBadge label="Required" tone="green" />
            ) : null}
            {duration ? <StatusBadge label={duration} tone="gray" /> : null}
            {block.alignment.linkedOutcomeId ? (
              <StatusBadge label="Outcome linked" tone="purple" />
            ) : null}
            {block.alignment.learningFunction ? (
              <StatusBadge
                label={block.alignment.learningFunction.replaceAll("_", " ").toLowerCase()}
                tone="gold"
              />
            ) : null}
            {block.alignment.indicatorLabel ? (
              <StatusBadge label="Indicator inherited" tone="blue" />
            ) : null}
          </div>
          <h3 className="mt-4 text-xl font-semibold leading-tight text-dark-ink transition">
            {block.title}
          </h3>
          <p className="mt-2 text-sm leading-6 text-muted-text">{block.summary}</p>
          <CanvasBlockPreview block={block} />
          {block.readinessWarning ? (
            <p className="mt-3 rounded-control border border-[#f6d365] bg-[#fff7db] px-3 py-2 text-sm leading-6 text-[#7a4d00]">
              {block.readinessWarning}
            </p>
          ) : null}
        </div>
        {block.hasAccessibilityWarning ? (
          <StatusBadge label="Accessibility needs review" tone="orange" />
        ) : null}
      </div>
      </Link>
      {canEdit ? (
        <div className="mt-4 flex flex-wrap gap-2 border-t border-design-border pt-4">
          <BlockMoveButton
            blockId={block.id}
            courseId={courseId}
            direction="up"
            disabled={index === 1}
            lessonId={lessonId}
          />
          <BlockMoveButton
            blockId={block.id}
            courseId={courseId}
            direction="down"
            disabled={index === blockCount}
            lessonId={lessonId}
          />
          <form action={duplicateBuildStudioBlock}>
            <input name="courseId" type="hidden" value={courseId} />
            <input name="lessonId" type="hidden" value={lessonId} />
            <input name="blockId" type="hidden" value={block.id} />
            <button className={compactButtonClasses} type="submit">
              Duplicate
            </button>
          </form>
          <DeleteBlockDisclosure
            blockId={block.id}
            courseId={courseId}
            lessonId={lessonId}
          />
        </div>
      ) : null}
    </article>
  );
}

function DeleteBlockDisclosure({
  blockId,
  courseId,
  lessonId,
}: {
  blockId: string;
  courseId: string;
  lessonId: string;
}) {
  return (
    <details className="relative">
      <summary className={`${dangerButtonClasses} list-none cursor-pointer`}>
        Remove
      </summary>
      <form
        action={deleteBuildStudioBlock}
        className="absolute right-0 z-10 mt-2 w-56 rounded-control border border-[#fecaca] bg-white p-3 shadow-card"
      >
        <input name="courseId" type="hidden" value={courseId} />
        <input name="lessonId" type="hidden" value={lessonId} />
        <input name="blockId" type="hidden" value={blockId} />
        <p className="text-xs leading-5 text-[#7f1d1d]">
          Remove this block from the lesson?
        </p>
        <button className={`${dangerButtonClasses} mt-3 w-full`} type="submit">
          Confirm Remove
        </button>
      </form>
    </details>
  );
}

function CanvasBlockPreview({ block }: { block: BuildStudioBlock }) {
  if (block.type === "TEXT") {
    const heading = getConfigString(block, "heading");
    const body = getConfigString(block, "body");

    if (!heading && !body) {
      return null;
    }

    return (
      <div className="mt-4 rounded-control border border-design-border bg-soft-bg p-4">
        {heading ? (
          <p className="text-sm font-semibold leading-6 text-dark-ink">
            {heading}
          </p>
        ) : null}
        {body ? (
          <p className="mt-2 text-sm leading-6 text-muted-text">
            {getPreviewText(body)}
          </p>
        ) : null}
      </div>
    );
  }

  if (block.type === "KEY_MESSAGE") {
    const message = getConfigString(block, "message");
    const supportingText = getConfigString(block, "supportingText");
    const style = getKeyMessageStyle(block);

    if (!message) {
      return null;
    }

    return (
      <div
        className={`mt-4 rounded-control border px-4 py-3 text-sm font-semibold leading-6 ${getKeyMessagePreviewClasses(style)}`}
      >
        <span className="mr-2 inline-flex rounded-full bg-white px-2 py-0.5 text-xs font-semibold text-dark-ink">
          Key message
        </span>
        {message}
        {supportingText ? (
          <span className="mt-2 block font-normal text-muted-text">
            {getPreviewText(supportingText, 160)}
          </span>
        ) : null}
      </div>
    );
  }

  if (block.type === "EXTERNAL_LINK") {
    const url = getConfigString(block, "url");
    const description = getConfigString(block, "description");
    const buttonLabel = getConfigStringAny(block, ["buttonLabel", "label"]);

    if (!url && !description && !buttonLabel) {
      return null;
    }

    return (
      <div className="mt-4 rounded-control border border-design-border bg-soft-bg p-4">
        <div className="flex flex-wrap gap-2">
          <StatusBadge label="External link" tone="blue" />
          {buttonLabel ? <StatusBadge label={buttonLabel} tone="gray" /> : null}
        </div>
        {description ? (
          <p className="mt-3 text-sm leading-6 text-muted-text">
            {getPreviewText(description)}
          </p>
        ) : null}
        {url ? (
          <p className="mt-3 break-words text-sm font-semibold leading-6 text-dark-ink">
            {url}
          </p>
        ) : null}
      </div>
    );
  }

  if (block.type === "CASE_STUDY") {
    const context = getConfigString(block, "context");
    const scenario = getConfigString(block, "scenario");
    const guidingQuestion = getConfigString(block, "guidingQuestion");
    const learningPoint = getConfigString(block, "learningPoint");

    if (!context && !scenario && !guidingQuestion && !learningPoint) {
      return null;
    }

    return (
      <div className="mt-4 rounded-control border border-[#b8d9e8] bg-dec-blue/10 p-4">
        {context ? (
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-dec-blue">
            {context}
          </p>
        ) : null}
        {scenario ? (
          <p className="mt-2 text-sm leading-6 text-dark-ink">
            {getPreviewText(scenario)}
          </p>
        ) : null}
        {guidingQuestion ? (
          <p className="mt-3 text-sm font-semibold leading-6 text-deep-navy">
            {guidingQuestion}
          </p>
        ) : null}
        {learningPoint ? (
          <p className="mt-3 text-sm leading-6 text-muted-text">
            {getPreviewText(learningPoint, 180)}
          </p>
        ) : null}
      </div>
    );
  }

  if (block.type === "RESOURCE") {
    const sourceType = getResourceSourceType(block);
    const sourceUrl = getConfigString(block, "sourceUrl");
    const resourceType = getResourceType(block);
    const description = getConfigString(block, "description");
    const fileName = getConfigString(block, "fileName");

    if (!sourceUrl && !description && !fileName) {
      return null;
    }

    return (
      <div className="mt-4 rounded-control border border-design-border bg-soft-bg p-4">
        <div className="flex flex-wrap gap-2">
          <StatusBadge label={formatResourceSourceType(sourceType)} tone="gray" />
          <StatusBadge label={formatResourceType(resourceType)} tone="blue" />
        </div>
        {description ? (
          <p className="mt-3 text-sm leading-6 text-muted-text">
            {getPreviewText(description)}
          </p>
        ) : null}
        {fileName || sourceUrl ? (
          <p className="mt-3 break-words text-sm font-semibold leading-6 text-dark-ink">
            {fileName || sourceUrl}
          </p>
        ) : null}
      </div>
    );
  }

  if (block.type === "IMAGE") {
    const imageUrl = getConfigString(block, "imageUrl");
    const altText = getConfigString(block, "altText");
    const caption = getConfigString(block, "caption");
    const displaySize = getImageDisplaySize(block);

    if (!imageUrl && !altText && !caption) {
      return null;
    }

    return (
      <div className="mt-4 rounded-control border border-design-border bg-soft-bg p-4">
        <div className="flex flex-wrap gap-2">
          <StatusBadge
            label={displaySize === "wide" ? "Wide image" : "Standard image"}
            tone="gray"
          />
          <StatusBadge
            label={altText ? "Alt text added" : "Alt text missing"}
            tone={altText ? "green" : "orange"}
          />
        </div>
        {imageUrl ? (
          <div className="mt-3 overflow-hidden rounded-control border border-design-border bg-white">
            {/* eslint-disable-next-line @next/next/no-img-element -- Course authors can provide arbitrary external media URLs. */}
            <img
              alt={altText || ""}
              className="aspect-video w-full object-cover"
              src={imageUrl}
            />
          </div>
        ) : null}
        {caption ? (
          <p className="mt-3 text-sm leading-6 text-muted-text">
            {getPreviewText(caption)}
          </p>
        ) : null}
      </div>
    );
  }

  if (block.type === "VIDEO") {
    const sourceType = getVideoSourceType(block);
    const sourceUrl = getConfigString(block, "sourceUrl");
    const description = getConfigString(block, "description");
    const transcript = getConfigString(block, "transcript");
    const captionsAvailable = getBlockConfig(block).captionsAvailable === true;
    const durationMinutes = getConfigNumber(block, "durationMinutes");
    const thumbnailUrl = getConfigString(block, "thumbnailUrl");

    if (!sourceUrl && !description && !transcript && !thumbnailUrl) {
      return null;
    }

    return (
      <div className="mt-4 rounded-control border border-design-border bg-soft-bg p-4">
        <div className="flex flex-wrap gap-2">
          <StatusBadge label={formatVideoSourceType(sourceType)} tone="blue" />
          {durationMinutes ? (
            <StatusBadge label={`${durationMinutes} min`} tone="gray" />
          ) : null}
          <StatusBadge
            label={transcript ? "Transcript added" : "Transcript missing"}
            tone={transcript ? "green" : "orange"}
          />
          <StatusBadge
            label={captionsAvailable ? "Captions available" : "Captions not confirmed"}
            tone={captionsAvailable ? "green" : "orange"}
          />
        </div>
        {thumbnailUrl ? (
          <div className="mt-3 overflow-hidden rounded-control border border-design-border bg-white">
            {/* eslint-disable-next-line @next/next/no-img-element -- Course authors can provide arbitrary external media URLs. */}
            <img
              alt=""
              className="aspect-video w-full object-cover"
              src={thumbnailUrl}
            />
          </div>
        ) : null}
        {description ? (
          <p className="mt-3 text-sm leading-6 text-muted-text">
            {getPreviewText(description)}
          </p>
        ) : null}
        {sourceUrl ? (
          <p className="mt-3 break-words text-sm font-semibold leading-6 text-dark-ink">
            {sourceUrl}
          </p>
        ) : null}
      </div>
    );
  }

  if (block.type === "ACCORDION") {
    const items = getAccordionItems(block);
    const firstCompleteItem = items.find((item) => item.title && item.body);
    const introduction = getConfigString(block, "introduction");

    if (items.length === 0 && !introduction) {
      return null;
    }

    return (
      <div className="mt-4 rounded-control border border-design-border bg-soft-bg p-4">
        <div className="flex flex-wrap gap-2">
          <StatusBadge label={formatCount(items.length, "item", "items")} tone="gray" />
          <StatusBadge
            label={
              getConfigBoolean(block, "allowMultipleOpen", true)
                ? "Multiple open"
                : "One open"
            }
            tone="blue"
          />
        </div>
        {introduction ? (
          <p className="mt-3 text-sm leading-6 text-muted-text">
            {getPreviewText(introduction)}
          </p>
        ) : null}
        {firstCompleteItem ? (
          <div className="mt-3 rounded-control border border-design-border bg-white p-3">
            <p className="text-sm font-semibold leading-6 text-dark-ink">
              {firstCompleteItem.title}
            </p>
            <p className="mt-1 text-sm leading-6 text-muted-text">
              {getPreviewText(firstCompleteItem.body, 180)}
            </p>
          </div>
        ) : null}
      </div>
    );
  }

  if (block.type === "FLASHCARD") {
    const cards = getFlashcards(block);
    const firstCompleteCard = cards.find((card) => card.front && card.back);
    const instructions = getConfigString(block, "instructions");

    if (cards.length === 0 && !instructions) {
      return null;
    }

    return (
      <div className="mt-4 rounded-control border border-design-border bg-soft-bg p-4">
        <div className="flex flex-wrap gap-2">
          <StatusBadge label={formatCount(cards.length, "card", "cards")} tone="gray" />
          <StatusBadge
            label={getFlashcardDisplayMode(block) === "stack" ? "Stack" : "Grid"}
            tone="blue"
          />
        </div>
        {instructions ? (
          <p className="mt-3 text-sm leading-6 text-muted-text">
            {getPreviewText(instructions)}
          </p>
        ) : null}
        {firstCompleteCard ? (
          <div className="mt-3 rounded-control border border-design-border bg-white p-3">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-dec-blue">
              First card
            </p>
            <p className="mt-2 text-sm font-semibold leading-6 text-dark-ink">
              {getPreviewText(firstCompleteCard.front, 160)}
            </p>
            <p className="mt-1 text-sm leading-6 text-muted-text">
              {getPreviewText(firstCompleteCard.back, 180)}
            </p>
          </div>
        ) : null}
      </div>
    );
  }

  if (block.type === "KNOWLEDGE_CHECK") {
    const question = getConfigString(block, "question");
    const options = getKnowledgeCheckOptions(block).filter((option) =>
      option.label.trim(),
    );
    const correctOption = options.find((option) => option.isCorrect);

    if (!question && options.length === 0) {
      return null;
    }

    return (
      <div className="mt-4 rounded-control border border-design-border bg-soft-bg p-4">
        <div className="flex flex-wrap gap-2">
          <StatusBadge
            label={formatCount(options.length, "option", "options")}
            tone="gray"
          />
          <StatusBadge
            label={correctOption ? "Correct answer set" : "Correct answer missing"}
            tone={correctOption ? "green" : "orange"}
          />
          <StatusBadge label="Ungraded" tone="blue" />
        </div>
        {question ? (
          <p className="mt-3 text-sm font-semibold leading-6 text-dark-ink">
            {getPreviewText(question)}
          </p>
        ) : null}
        {options[0] ? (
          <p className="mt-2 text-sm leading-6 text-muted-text">
            First option: {getPreviewText(options[0].label, 160)}
          </p>
        ) : null}
      </div>
    );
  }

  if (block.type === "BRANCHING_SCENARIO") {
    const scenarioContext =
      getConfigString(block, "context") || getConfigString(block, "scenario");
    const decisionQuestion = getConfigStringAny(block, [
      "decisionQuestion",
      "decisionPrompt",
    ]);
    const choices = getBranchingChoices(block);
    const learningPoint = getConfigString(block, "learningPoint");
    const choicesWithFeedback = choices.filter((choice) => choice.feedback.trim());

    if (!scenarioContext && !decisionQuestion && choices.length === 0) {
      return null;
    }

    return (
      <div className="mt-4 rounded-control border border-design-border bg-soft-bg p-4">
        <div className="flex flex-wrap gap-2">
          <StatusBadge
            label={formatCount(choices.length, "choice", "choices")}
            tone="gray"
          />
          <StatusBadge
            label={
              choices.length >= 2 && choicesWithFeedback.length === choices.length
                ? "Feedback complete"
                : "Feedback incomplete"
            }
            tone={
              choices.length >= 2 && choicesWithFeedback.length === choices.length
                ? "green"
                : "orange"
            }
          />
          <StatusBadge
            label={learningPoint ? "Learning point set" : "Learning point missing"}
            tone={learningPoint ? "green" : "orange"}
          />
          <StatusBadge label="Ungraded" tone="blue" />
        </div>
        {decisionQuestion ? (
          <p className="mt-3 text-sm font-semibold leading-6 text-dark-ink">
            {getPreviewText(decisionQuestion)}
          </p>
        ) : null}
        {scenarioContext ? (
          <p className="mt-2 text-sm leading-6 text-muted-text">
            {getPreviewText(scenarioContext, 180)}
          </p>
        ) : null}
      </div>
    );
  }

  if (block.type === "REFLECTION_PROMPT") {
    const question = getConfigStringAny(block, ["question", "prompt"]);
    const guidanceText = getConfigString(block, "guidanceText");
    const responseMode = getConfigString(block, "responseMode") || "thinking_only";

    if (!question && !guidanceText) {
      return null;
    }

    return (
      <div className="mt-4 rounded-control border border-design-border bg-soft-bg p-4">
        <div className="flex flex-wrap gap-2">
          <StatusBadge
            label={responseMode === "private_note" ? "Private note" : "Thinking silently"}
            tone="blue"
          />
        </div>
        {question ? (
          <p className="mt-3 text-sm font-semibold leading-6 text-dark-ink">
            {getPreviewText(question)}
          </p>
        ) : null}
        {guidanceText ? (
          <p className="mt-2 text-sm leading-6 text-muted-text">
            {getPreviewText(guidanceText, 180)}
          </p>
        ) : null}
      </div>
    );
  }

  if (block.type === "PRACTICAL_ACTIVITY_PROMPT") {
    const title = getConfigString(block, "title") || block.title;
    const taskInstructions = getConfigStringAny(block, [
      "taskInstructions",
      "instruction",
    ]);
    const estimatedTimeMinutes = getConfigNumber(block, "estimatedTimeMinutes");
    const linkedResourceBlockId = getConfigString(block, "linkedResourceBlockId");

    if (!taskInstructions && !title) {
      return null;
    }

    return (
      <div className="mt-4 rounded-control border border-design-border bg-soft-bg p-4">
        <div className="flex flex-wrap gap-2">
          {estimatedTimeMinutes ? (
            <StatusBadge label={`${estimatedTimeMinutes} min`} tone="gray" />
          ) : null}
          {linkedResourceBlockId ? (
            <StatusBadge label="Linked resource" tone="blue" />
          ) : null}
          <StatusBadge label="Ungraded" tone="blue" />
        </div>
        <p className="mt-3 text-sm font-semibold leading-6 text-dark-ink">
          {title}
        </p>
        {taskInstructions ? (
          <p className="mt-2 text-sm leading-6 text-muted-text">
            {getPreviewText(taskInstructions, 180)}
          </p>
        ) : null}
      </div>
    );
  }

  return null;
}

function BlockMoveButton({
  blockId,
  courseId,
  direction,
  disabled,
  lessonId,
}: {
  blockId: string;
  courseId: string;
  direction: "up" | "down";
  disabled: boolean;
  lessonId: string;
}) {
  return (
    <form action={moveBuildStudioBlock}>
      <input name="courseId" type="hidden" value={courseId} />
      <input name="lessonId" type="hidden" value={lessonId} />
      <input name="blockId" type="hidden" value={blockId} />
      <input name="direction" type="hidden" value={direction} />
      <button
        aria-label={direction === "up" ? "Move block up" : "Move block down"}
        className={compactButtonClasses}
        disabled={disabled}
        type="submit"
      >
        {direction === "up" ? "Up" : "Down"}
      </button>
    </form>
  );
}

function BlockConfigurationPanel({
  canEdit,
  course,
  selectedBlock,
  selectedLesson,
}: {
  canEdit: boolean;
  course: BuildStudioCourse;
  selectedBlock: BuildStudioBlock | null;
  selectedLesson: BuildStudioLesson | null;
}) {
  const courseId = course.id;

  return (
    <aside
      aria-labelledby="block-config-heading"
      className="order-2 rounded-[24px] border border-design-border bg-white-surface p-5 shadow-soft xl:order-3"
    >
      <div>
        <StatusBadge
          label={selectedBlock ? selectedBlock.typeLabel : "No block selected"}
          tone={selectedBlock ? "blue" : "gray"}
        />
        <h2
          className="mt-3 text-2xl font-semibold leading-tight text-dark-ink"
          id="block-config-heading"
        >
          Block Configuration
        </h2>
        <p className="mt-2 text-sm leading-6 text-muted-text">
          {selectedBlock
            ? "Edit content and settings for this learning block."
            : "Select a block to configure its content and settings."}
        </p>
      </div>

      {selectedBlock && selectedLesson ? (
        selectedBlock.type === "TEXT" ? (
          <TextBlockConfigurationForm
            canEdit={canEdit}
            courseId={courseId}
            selectedBlock={selectedBlock}
            selectedLesson={selectedLesson}
          />
        ) : selectedBlock.type === "KEY_MESSAGE" ? (
          <KeyMessageConfigurationForm
            canEdit={canEdit}
            courseId={courseId}
            selectedBlock={selectedBlock}
            selectedLesson={selectedLesson}
          />
        ) : selectedBlock.type === "CASE_STUDY" ? (
          <CaseStudyConfigurationForm
            canEdit={canEdit}
            courseId={courseId}
            selectedBlock={selectedBlock}
            selectedLesson={selectedLesson}
          />
        ) : selectedBlock.type === "RESOURCE" ? (
          <ResourceConfigurationForm
            canEdit={canEdit}
            courseId={courseId}
            selectedBlock={selectedBlock}
            selectedLesson={selectedLesson}
            courseTitle={course.title}
          />
        ) : selectedBlock.type === "EXTERNAL_LINK" ? (
          <ExternalLinkConfigurationForm
            canEdit={canEdit}
            courseId={courseId}
            selectedBlock={selectedBlock}
            selectedLesson={selectedLesson}
          />
        ) : selectedBlock.type === "IMAGE" ? (
          <ImageConfigurationForm
            canEdit={canEdit}
            courseId={courseId}
            selectedBlock={selectedBlock}
            selectedLesson={selectedLesson}
            courseTitle={course.title}
          />
        ) : selectedBlock.type === "VIDEO" ? (
          <VideoConfigurationForm
            canEdit={canEdit}
            courseId={courseId}
            selectedBlock={selectedBlock}
            selectedLesson={selectedLesson}
            courseTitle={course.title}
          />
        ) : selectedBlock.type === "ACCORDION" ? (
          <AccordionConfigurationForm
            canEdit={canEdit}
            courseId={courseId}
            selectedBlock={selectedBlock}
            selectedLesson={selectedLesson}
          />
        ) : selectedBlock.type === "FLASHCARD" ? (
          <FlashcardsConfigurationForm
            canEdit={canEdit}
            courseId={courseId}
            selectedBlock={selectedBlock}
            selectedLesson={selectedLesson}
          />
        ) : selectedBlock.type === "KNOWLEDGE_CHECK" ? (
          <KnowledgeCheckConfigurationForm
            canEdit={canEdit}
            courseId={courseId}
            selectedBlock={selectedBlock}
            selectedLesson={selectedLesson}
          />
        ) : selectedBlock.type === "BRANCHING_SCENARIO" ? (
          <BranchingScenarioConfigurationForm
            canEdit={canEdit}
            courseId={courseId}
            selectedBlock={selectedBlock}
            selectedLesson={selectedLesson}
          />
        ) : selectedBlock.type === "REFLECTION_PROMPT" ? (
          <ReflectionConfigurationForm
            canEdit={canEdit}
            courseId={courseId}
            selectedBlock={selectedBlock}
            selectedLesson={selectedLesson}
          />
        ) : selectedBlock.type === "PRACTICAL_ACTIVITY_PROMPT" ? (
          <PracticalActivityConfigurationForm
            canEdit={canEdit}
            courseId={courseId}
            selectedBlock={selectedBlock}
            selectedLesson={selectedLesson}
          />
        ) : (
          <SharedBlockConfigurationForm
            canEdit={canEdit}
            courseId={courseId}
            selectedBlock={selectedBlock}
            selectedLesson={selectedLesson}
          />
        )
      ) : (
        <div className="mt-6 rounded-[20px] border border-dashed border-dec-blue/30 bg-dec-blue/10 p-5">
          <h3 className="text-base font-semibold leading-tight text-dark-ink">
            {selectedLesson ? selectedLesson.title : "No lesson selected"}
          </h3>
          <p className="mt-2 text-sm leading-6 text-muted-text">
            {selectedLesson
              ? `${formatCount(selectedLesson.blockCount, "block", "blocks")} in this lesson`
              : "Choose a lesson from the outline to see its learning blocks."}
          </p>
        </div>
      )}
      {selectedBlock &&
      selectedLesson &&
      specializedConfigurationTypes.includes(selectedBlock.type) ? (
        <SharedBlockConfigurationForm
          canEdit={canEdit}
          courseId={courseId}
          selectedBlock={selectedBlock}
          selectedLesson={selectedLesson}
          showTitle={false}
        />
      ) : null}
      {selectedBlock && selectedLesson ? (
        <BlockAlignmentForm
          canEdit={canEdit}
          course={course}
          selectedBlock={selectedBlock}
          selectedLesson={selectedLesson}
        />
      ) : null}
    </aside>
  );
}

function BlockAlignmentForm({
  canEdit,
  course,
  selectedBlock,
  selectedLesson,
}: {
  canEdit: boolean;
  course: BuildStudioCourse;
  selectedBlock: BuildStudioBlock;
  selectedLesson: BuildStudioLesson;
}) {
  return (
    <form action={updateBuildStudioBlockSettings} className="mt-5">
      <input name="courseId" type="hidden" value={course.id} />
      <input name="lessonId" type="hidden" value={selectedLesson.id} />
      <input name="blockId" type="hidden" value={selectedBlock.id} />
      <input name="title" type="hidden" value={selectedBlock.title} />
      <input
        name="estimatedDurationMinutes"
        type="hidden"
        value={selectedBlock.estimatedDurationMinutes ?? ""}
      />
      <input name="accessibilityNotes" type="hidden" value={selectedBlock.accessibilityNotes ?? ""} />
      {selectedBlock.isRequired ? <input name="isRequired" type="hidden" value="on" /> : null}
      {selectedBlock.hasAccessibilityWarning ? (
        <input name="hasAccessibilityWarning" type="hidden" value="on" />
      ) : null}
      <details className="rounded-[18px] border border-design-border bg-soft-bg p-4">
        <summary className="cursor-pointer text-sm font-semibold text-dark-ink">
          Alignment
        </summary>
        <div className="mt-4 grid gap-4">
          <label className="block text-sm font-medium text-dark-ink">
            Linked outcome
            <select
              className="mt-2 min-h-11 w-full rounded-control border border-design-border bg-white px-4 text-sm text-dark-ink outline-none transition focus:border-dec-blue focus:ring-4 focus:ring-dec-blue/20 disabled:cursor-not-allowed disabled:bg-soft-bg disabled:text-muted-text"
              defaultValue={selectedBlock.alignment.linkedOutcomeId}
              disabled={!canEdit}
              name="alignmentOutcomeId"
            >
              <option value="">No outcome selected</option>
              {course.outcomeOptions.map((outcome) => (
                <option key={outcome.id} value={outcome.id}>
                  {outcome.order}. {outcome.statement}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm font-medium text-dark-ink">
            Learning function
            <select
              className="mt-2 min-h-11 w-full rounded-control border border-design-border bg-white px-4 text-sm text-dark-ink outline-none transition focus:border-dec-blue focus:ring-4 focus:ring-dec-blue/20 disabled:cursor-not-allowed disabled:bg-soft-bg disabled:text-muted-text"
              defaultValue={selectedBlock.alignment.learningFunction}
              disabled={!canEdit}
              name="learningFunction"
            >
              {learningFunctionOptions.map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm font-medium text-dark-ink">
            Expected learner action
            <textarea
              className="mt-2 min-h-24 w-full rounded-control border border-design-border bg-white px-4 py-3 text-sm leading-6 text-dark-ink outline-none transition focus:border-dec-blue focus:ring-4 focus:ring-dec-blue/20 disabled:cursor-not-allowed disabled:bg-soft-bg disabled:text-muted-text"
              defaultValue={selectedBlock.alignment.expectedLearnerAction}
              disabled={!canEdit}
              name="expectedLearnerAction"
            />
          </label>
          {selectedBlock.alignment.indicatorLabel ? (
            <p className="rounded-control border border-dec-blue/20 bg-dec-blue/10 px-3 py-2 text-xs font-semibold leading-5 text-[#216f9d]">
              Indicator: {selectedBlock.alignment.indicatorLabel}
            </p>
          ) : null}
          <ActionButton disabled={!canEdit} type="submit">
            Save Alignment
          </ActionButton>
        </div>
      </details>
    </form>
  );
}

function ReflectionConfigurationForm({
  canEdit,
  courseId,
  selectedBlock,
  selectedLesson,
}: {
  canEdit: boolean;
  courseId: string;
  selectedBlock: BuildStudioBlock;
  selectedLesson: BuildStudioLesson;
}) {
  const question = getConfigStringAny(selectedBlock, ["question", "prompt"]);
  const guidanceText = getConfigString(selectedBlock, "guidanceText");
  const responseMode = getConfigString(selectedBlock, "responseMode") || "thinking_only";
  const privacyNote = getConfigString(selectedBlock, "privacyNote");

  return (
    <form action={updateBuildStudioReflectionBlock} className="mt-6 grid gap-4">
      <input name="courseId" type="hidden" value={courseId} />
      <input name="lessonId" type="hidden" value={selectedLesson.id} />
      <input name="blockId" type="hidden" value={selectedBlock.id} />
      
      <BlockTitleField selectedBlock={selectedBlock} />

      <div>
        <label
          className="text-sm font-semibold text-deep-navy"
          htmlFor={`reflection-question-${selectedBlock.id}`}
        >
          Reflection question <span className="text-red-500">*</span>
        </label>
        <textarea
          className={`${compactInputClasses} mt-2 min-h-24 resize-y leading-6`}
          defaultValue={question}
          id={`reflection-question-${selectedBlock.id}`}
          name="question"
          placeholder="e.g., Think about how your CSO handles proposal writing..."
          required
        />
      </div>

      <div>
        <label
          className="text-sm font-semibold text-deep-navy"
          htmlFor={`reflection-guidance-${selectedBlock.id}`}
        >
          Guidance text
        </label>
        <textarea
          className={`${compactInputClasses} mt-2 min-h-20 resize-y leading-6`}
          defaultValue={guidanceText}
          id={`reflection-guidance-${selectedBlock.id}`}
          name="guidanceText"
          placeholder="Guidance to help the learner structure their thinking."
        />
      </div>

      <div>
        <label
          className="text-sm font-semibold text-deep-navy"
          htmlFor={`reflection-mode-${selectedBlock.id}`}
        >
          Response mode
        </label>
        <select
          className={`${compactInputClasses} mt-2`}
          defaultValue={responseMode}
          id={`reflection-mode-${selectedBlock.id}`}
          name="responseMode"
        >
          <option value="thinking_only">Thinking only (silent reflection)</option>
          <option value="private_note">Private note (learner text area)</option>
        </select>
      </div>

      <div>
        <label
          className="text-sm font-semibold text-deep-navy"
          htmlFor={`reflection-privacy-${selectedBlock.id}`}
        >
          Privacy note
        </label>
        <input
          className={`${compactInputClasses} mt-2`}
          defaultValue={privacyNote}
          id={`reflection-privacy-${selectedBlock.id}`}
          name="privacyNote"
          placeholder="e.g., Your response is private and won't be saved on the server."
          type="text"
        />
      </div>

      <RequiredBlockCheckbox selectedBlock={selectedBlock} />

      <button className={compactButtonClasses} disabled={!canEdit} type="submit">
        Save Block Configuration
      </button>
    </form>
  );
}

function PracticalActivityConfigurationForm({
  canEdit,
  courseId,
  selectedBlock,
  selectedLesson,
}: {
  canEdit: boolean;
  courseId: string;
  selectedBlock: BuildStudioBlock;
  selectedLesson: BuildStudioLesson;
}) {
  const taskInstructions = getConfigStringAny(selectedBlock, [
    "taskInstructions",
    "instruction",
  ]);
  const expectedOutput = getConfigString(selectedBlock, "expectedOutput");
  const estimatedTimeMinutes = getConfigNumber(selectedBlock, "estimatedTimeMinutes") || "";
  const materialsNeeded = getConfigString(selectedBlock, "materialsNeeded");
  const linkedResourceBlockId = getConfigString(selectedBlock, "linkedResourceBlockId") || "";
  const completionGuidance = getConfigStringAny(selectedBlock, [
    "completionGuidance",
    "guidance",
  ]);

  // Get other blocks in the lesson that are RESOURCES
  const resourceBlocks = selectedLesson.blocks.filter(
    (block) => block.type === "RESOURCE"
  );

  return (
    <form action={updateBuildStudioPracticalActivityBlock} className="mt-6 grid gap-4">
      <input name="courseId" type="hidden" value={courseId} />
      <input name="lessonId" type="hidden" value={selectedLesson.id} />
      <input name="blockId" type="hidden" value={selectedBlock.id} />
      
      <BlockTitleField selectedBlock={selectedBlock} />

      <div>
        <label
          className="text-sm font-semibold text-deep-navy"
          htmlFor={`activity-instructions-${selectedBlock.id}`}
        >
          Task instructions <span className="text-red-500">*</span>
        </label>
        <textarea
          className={`${compactInputClasses} mt-2 min-h-32 resize-y leading-6`}
          defaultValue={taskInstructions}
          id={`activity-instructions-${selectedBlock.id}`}
          name="taskInstructions"
          placeholder="List the steps the learner should take..."
          required
        />
      </div>

      <div>
        <label
          className="text-sm font-semibold text-deep-navy"
          htmlFor={`activity-output-${selectedBlock.id}`}
        >
          Expected output
        </label>
        <textarea
          className={`${compactInputClasses} mt-2 min-h-20 resize-y leading-6`}
          defaultValue={expectedOutput}
          id={`activity-output-${selectedBlock.id}`}
          name="expectedOutput"
          placeholder="Describe what the final result should look like..."
        />
      </div>

      <div>
        <label
          className="text-sm font-semibold text-deep-navy"
          htmlFor={`activity-time-${selectedBlock.id}`}
        >
          Estimated time (minutes)
        </label>
        <input
          className={`${compactInputClasses} mt-2`}
          defaultValue={estimatedTimeMinutes}
          id={`activity-time-${selectedBlock.id}`}
          min={1}
          name="estimatedTimeMinutes"
          placeholder="Minutes"
          type="number"
        />
      </div>

      <div>
        <label
          className="text-sm font-semibold text-deep-navy"
          htmlFor={`activity-materials-${selectedBlock.id}`}
        >
          Materials needed
        </label>
        <textarea
          className={`${compactInputClasses} mt-2 min-h-20 resize-y leading-6`}
          defaultValue={materialsNeeded}
          id={`activity-materials-${selectedBlock.id}`}
          name="materialsNeeded"
          placeholder="Worksheets, tools, or templates needed..."
        />
      </div>

      <div>
        <label
          className="text-sm font-semibold text-deep-navy"
          htmlFor={`activity-resource-${selectedBlock.id}`}
        >
          Linked resource block
        </label>
        <select
          className={`${compactInputClasses} mt-2`}
          defaultValue={linkedResourceBlockId}
          id={`activity-resource-${selectedBlock.id}`}
          name="linkedResourceBlockId"
        >
          <option value="">-- No link --</option>
          {resourceBlocks.map((r) => (
            <option key={r.id} value={r.id}>
              {r.title}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label
          className="text-sm font-semibold text-deep-navy"
          htmlFor={`activity-guidance-${selectedBlock.id}`}
        >
          Completion guidance
        </label>
        <textarea
          className={`${compactInputClasses} mt-2 min-h-20 resize-y leading-6`}
          defaultValue={completionGuidance}
          id={`activity-guidance-${selectedBlock.id}`}
          name="completionGuidance"
          placeholder="e.g., Discuss your draft with your focal person..."
        />
      </div>

      <RequiredBlockCheckbox selectedBlock={selectedBlock} />

      <button className={compactButtonClasses} disabled={!canEdit} type="submit">
        Save Block Configuration
      </button>
    </form>
  );
}

function SharedBlockConfigurationForm({
  canEdit,
  courseId,
  selectedBlock,
  selectedLesson,
  showTitle = true,
}: {
  canEdit: boolean;
  courseId: string;
  selectedBlock: BuildStudioBlock;
  selectedLesson: BuildStudioLesson;
  showTitle?: boolean;
}) {
  return (
    <form action={updateBuildStudioBlockSettings} className="mt-5">
      <input name="courseId" type="hidden" value={courseId} />
      <input name="lessonId" type="hidden" value={selectedLesson.id} />
      <input name="blockId" type="hidden" value={selectedBlock.id} />
      <details className="rounded-[18px] border border-design-border bg-soft-bg p-4">
        <summary className="cursor-pointer text-sm font-semibold text-dark-ink">
          Shared settings
        </summary>
        <div className="mt-4 grid gap-4">
          {showTitle ? (
            <BlockTitleField selectedBlock={selectedBlock} />
          ) : (
            <input name="title" type="hidden" value={selectedBlock.title} />
          )}

          <div>
            <label
              className="text-sm font-semibold text-deep-navy"
              htmlFor={`block-duration-${selectedBlock.id}`}
            >
              Estimated duration
            </label>
            <input
              className={`${compactInputClasses} mt-2`}
              defaultValue={selectedBlock.estimatedDurationMinutes ?? ""}
              id={`block-duration-${selectedBlock.id}`}
              min={1}
              name="estimatedDurationMinutes"
              placeholder="Minutes"
              type="number"
            />
          </div>

          <RequiredBlockCheckbox selectedBlock={selectedBlock} />

          <label className="flex items-start gap-3 rounded-control border border-design-border bg-white p-3 text-sm text-dark-ink">
            <input
              className="mt-1"
              defaultChecked={selectedBlock.hasAccessibilityWarning}
              name="hasAccessibilityWarning"
              type="checkbox"
            />
            <span>
              <span className="block font-semibold">Needs accessibility review</span>
              <span className="mt-1 block leading-5 text-muted-text">
                Use this for missing alt text, transcripts, or unclear resource labels.
              </span>
            </span>
          </label>

          <div>
            <label
              className="text-sm font-semibold text-deep-navy"
              htmlFor={`block-accessibility-${selectedBlock.id}`}
            >
              Accessibility notes
            </label>
            <textarea
              className={`${compactInputClasses} mt-2 min-h-28 resize-y leading-6`}
              defaultValue={selectedBlock.accessibilityNotes ?? ""}
              id={`block-accessibility-${selectedBlock.id}`}
              name="accessibilityNotes"
              placeholder="Add a short note for accessibility review"
            />
          </div>

          <button className={compactButtonClasses} disabled={!canEdit} type="submit">
            Save Shared Settings
          </button>
        </div>
      </details>
    </form>
  );
}

function TextBlockConfigurationForm({
  canEdit,
  courseId,
  selectedBlock,
  selectedLesson,
}: {
  canEdit: boolean;
  courseId: string;
  selectedBlock: BuildStudioBlock;
  selectedLesson: BuildStudioLesson;
}) {
  const readingTimeMinutes =
    getConfigNumber(selectedBlock, "readingTimeMinutes") ??
    selectedBlock.estimatedDurationMinutes ??
    "";

  return (
    <form action={updateBuildStudioTextBlock} className="mt-6 grid gap-4">
      <input name="courseId" type="hidden" value={courseId} />
      <input name="lessonId" type="hidden" value={selectedLesson.id} />
      <input name="blockId" type="hidden" value={selectedBlock.id} />
      <BlockTitleField selectedBlock={selectedBlock} />

      <div>
        <label
          className="text-sm font-semibold text-deep-navy"
          htmlFor={`text-heading-${selectedBlock.id}`}
        >
          Heading
        </label>
        <input
          className={`${compactInputClasses} mt-2`}
          defaultValue={getConfigString(selectedBlock, "heading")}
          id={`text-heading-${selectedBlock.id}`}
          maxLength={140}
          name="heading"
          placeholder="Short section heading"
        />
      </div>

      <div>
        <label
          className="text-sm font-semibold text-deep-navy"
          htmlFor={`text-body-${selectedBlock.id}`}
        >
          Body
        </label>
        <textarea
          className={`${textareaClasses} mt-2`}
          defaultValue={getConfigString(selectedBlock, "body")}
          id={`text-body-${selectedBlock.id}`}
          name="body"
          placeholder="Write the lesson text learners should read."
        />
      </div>

      <div>
        <label
          className="text-sm font-semibold text-deep-navy"
          htmlFor={`text-reading-time-${selectedBlock.id}`}
        >
          Reading time
        </label>
        <input
          className={`${compactInputClasses} mt-2`}
          defaultValue={readingTimeMinutes}
          id={`text-reading-time-${selectedBlock.id}`}
          min={1}
          name="readingTimeMinutes"
          placeholder="Minutes"
          type="number"
        />
      </div>

      <RequiredBlockCheckbox selectedBlock={selectedBlock} />
      <ReadinessWarning warning={selectedBlock.readinessWarning} />

      <button className={compactButtonClasses} disabled={!canEdit} type="submit">
        Save Text Block
      </button>
    </form>
  );
}

function KeyMessageConfigurationForm({
  canEdit,
  courseId,
  selectedBlock,
  selectedLesson,
}: {
  canEdit: boolean;
  courseId: string;
  selectedBlock: BuildStudioBlock;
  selectedLesson: BuildStudioLesson;
}) {
  return (
    <form action={updateBuildStudioKeyMessageBlock} className="mt-6 grid gap-4">
      <input name="courseId" type="hidden" value={courseId} />
      <input name="lessonId" type="hidden" value={selectedLesson.id} />
      <input name="blockId" type="hidden" value={selectedBlock.id} />
      <BlockTitleField selectedBlock={selectedBlock} />

      <div>
        <label
          className="text-sm font-semibold text-deep-navy"
          htmlFor={`key-message-body-${selectedBlock.id}`}
        >
          Message
        </label>
        <textarea
          className={`${textareaClasses} mt-2`}
          defaultValue={getConfigString(selectedBlock, "message")}
          id={`key-message-body-${selectedBlock.id}`}
          name="message"
          placeholder="Write the key takeaway learners should remember."
        />
      </div>

      <div>
        <label
          className="text-sm font-semibold text-deep-navy"
          htmlFor={`key-message-supporting-${selectedBlock.id}`}
        >
          Supporting text
        </label>
        <textarea
          className={`${textareaClasses} mt-2 min-h-24`}
          defaultValue={getConfigString(selectedBlock, "supportingText")}
          id={`key-message-supporting-${selectedBlock.id}`}
          name="supportingText"
          placeholder="Optional context that supports the key message."
        />
      </div>

      <div>
        <label
          className="text-sm font-semibold text-deep-navy"
          htmlFor={`key-message-style-${selectedBlock.id}`}
        >
          Style
        </label>
        <select
          className={`${compactInputClasses} mt-2`}
          defaultValue={getKeyMessageStyle(selectedBlock)}
          id={`key-message-style-${selectedBlock.id}`}
          name="style"
        >
          <option value="info">Info</option>
          <option value="success">Success</option>
          <option value="warning">Warning</option>
          <option value="neutral">Neutral</option>
        </select>
      </div>

      <RequiredBlockCheckbox selectedBlock={selectedBlock} />
      <ReadinessWarning warning={selectedBlock.readinessWarning} />

      <button className={compactButtonClasses} disabled={!canEdit} type="submit">
        Save Key Message
      </button>
    </form>
  );
}

function CaseStudyConfigurationForm({
  canEdit,
  courseId,
  selectedBlock,
  selectedLesson,
}: {
  canEdit: boolean;
  courseId: string;
  selectedBlock: BuildStudioBlock;
  selectedLesson: BuildStudioLesson;
}) {
  return (
    <form action={updateBuildStudioCaseStudyBlock} className="mt-6 grid gap-4">
      <input name="courseId" type="hidden" value={courseId} />
      <input name="lessonId" type="hidden" value={selectedLesson.id} />
      <input name="blockId" type="hidden" value={selectedBlock.id} />
      <BlockTitleField selectedBlock={selectedBlock} />

      <div>
        <label
          className="text-sm font-semibold text-deep-navy"
          htmlFor={`case-context-${selectedBlock.id}`}
        >
          Context
        </label>
        <textarea
          className={`${textareaClasses} mt-2 min-h-24`}
          defaultValue={getConfigString(selectedBlock, "context")}
          id={`case-context-${selectedBlock.id}`}
          name="context"
          placeholder="Briefly set up the CSO, community, or operating context."
        />
      </div>

      <div>
        <label
          className="text-sm font-semibold text-deep-navy"
          htmlFor={`case-scenario-${selectedBlock.id}`}
        >
          Scenario
        </label>
        <textarea
          className={`${textareaClasses} mt-2`}
          defaultValue={getConfigString(selectedBlock, "scenario")}
          id={`case-scenario-${selectedBlock.id}`}
          name="scenario"
          placeholder="Describe the realistic situation learners should consider."
        />
      </div>

      <div>
        <label
          className="text-sm font-semibold text-deep-navy"
          htmlFor={`case-guiding-question-${selectedBlock.id}`}
        >
          Guiding question
        </label>
        <textarea
          className={`${textareaClasses} mt-2 min-h-24`}
          defaultValue={getConfigString(selectedBlock, "guidingQuestion")}
          id={`case-guiding-question-${selectedBlock.id}`}
          name="guidingQuestion"
          placeholder="Ask one practical question to focus learner thinking."
        />
      </div>

      <div>
        <label
          className="text-sm font-semibold text-deep-navy"
          htmlFor={`case-learning-point-${selectedBlock.id}`}
        >
          Learning point
        </label>
        <textarea
          className={`${textareaClasses} mt-2 min-h-24`}
          defaultValue={getConfigString(selectedBlock, "learningPoint")}
          id={`case-learning-point-${selectedBlock.id}`}
          name="learningPoint"
          placeholder="Summarize the takeaway this case should reinforce."
        />
      </div>

      <div>
        <label
          className="text-sm font-semibold text-deep-navy"
          htmlFor={`case-discussion-question-${selectedBlock.id}`}
        >
          Discussion question
        </label>
        <textarea
          className={`${textareaClasses} mt-2 min-h-24`}
          defaultValue={getConfigString(selectedBlock, "discussionQuestion")}
          id={`case-discussion-question-${selectedBlock.id}`}
          name="discussionQuestion"
          placeholder="Optional team or peer discussion prompt."
        />
      </div>

      <RequiredBlockCheckbox selectedBlock={selectedBlock} />
      <ReadinessWarning warning={selectedBlock.readinessWarning} />

      <button className={compactButtonClasses} disabled={!canEdit} type="submit">
        Save Case Study
      </button>
    </form>
  );
}

// ==================== UPDATED RESOURCE CONFIGURATION FORM ====================
function ResourceConfigurationForm({
  canEdit,
  courseId,
  selectedBlock,
  selectedLesson,
  courseTitle,
}: {
  canEdit: boolean;
  courseId: string;
  selectedBlock: BuildStudioBlock;
  selectedLesson: BuildStudioLesson;
  courseTitle: string;
}) {
  const [sourceType, setSourceType] = useState(getResourceSourceType(selectedBlock));
  const [sourceUrl, setSourceUrl] = useState(getConfigString(selectedBlock, "sourceUrl"));
  const [resourceType, setResourceType] = useState(getResourceType(selectedBlock));
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("courseId", courseId);
    formData.append("courseTitle", courseTitle);
    formData.append("resourceType", resourceType.toUpperCase());

    try {
      const res = await fetch("/api/upload-resource", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      setSourceUrl(data.url);
    } catch (error) {
      console.error(error);
      alert("Upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <form action={updateBuildStudioResourceBlock} className="mt-6 grid gap-4">
      <input name="courseId" type="hidden" value={courseId} />
      <input name="lessonId" type="hidden" value={selectedLesson.id} />
      <input name="blockId" type="hidden" value={selectedBlock.id} />
      <BlockTitleField selectedBlock={selectedBlock} />

      <div>
        <label className="text-sm font-semibold text-deep-navy" htmlFor={`resource-description-${selectedBlock.id}`}>
          Description
        </label>
        <textarea
          className={`${textareaClasses} mt-2 min-h-24`}
          defaultValue={getConfigString(selectedBlock, "description")}
          id={`resource-description-${selectedBlock.id}`}
          name="description"
          placeholder="Explain how learners should use this resource."
        />
      </div>

      <div>
        <label className="text-sm font-semibold text-deep-navy" htmlFor={`resource-source-type-${selectedBlock.id}`}>
          Source type
        </label>
        <select
          className={`${compactInputClasses} mt-2`}
          value={sourceType}
          onChange={(e) => setSourceType(e.target.value)}
          id={`resource-source-type-${selectedBlock.id}`}
          name="sourceType"
        >
          <option value="external_link">External link</option>
          <option value="uploaded_file">Uploaded file reference</option>
        </select>
      </div>

      <div>
        <label className="text-sm font-semibold text-deep-navy" htmlFor={`resource-type-${selectedBlock.id}`}>
          Resource type
        </label>
        <select
          className={`${compactInputClasses} mt-2`}
          value={resourceType}
          onChange={(e) => setResourceType(e.target.value)}
          id={`resource-type-${selectedBlock.id}`}
          name="resourceType"
        >
          <option value="link">Link</option>
          <option value="pdf">PDF</option>
          <option value="doc">Document</option>
          <option value="spreadsheet">Spreadsheet</option>
          <option value="presentation">Presentation</option>
          <option value="template">Template</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div>
        <label className="text-sm font-semibold text-deep-navy" htmlFor={`resource-source-url-${selectedBlock.id}`}>
          Source link or file reference
        </label>
        <div className="flex flex-col gap-2">
          <input
            className={`${compactInputClasses} mt-2`}
            value={sourceUrl}
            onChange={(e) => setSourceUrl(e.target.value)}
            id={`resource-source-url-${selectedBlock.id}`}
            name="sourceUrl"
            placeholder={
              sourceType === "uploaded_file"
                ? "Will be filled after upload"
                : "https://example.org/resource.pdf"
            }
          />
          {sourceType === "uploaded_file" && (
            <div className="flex gap-2 items-center">
              <label className={`${compactButtonClasses} cursor-pointer`}>
                {isUploading ? "Uploading..." : "Choose file"}
                <input
                  type="file"
                  className="hidden"
                  onChange={handleFileUpload}
                  disabled={isUploading}
                />
              </label>
              {isUploading && <span className="text-sm text-muted-text">Uploading...</span>}
            </div>
          )}
        </div>
      </div>

      <div>
        <label className="text-sm font-semibold text-deep-navy" htmlFor={`resource-file-name-${selectedBlock.id}`}>
          File name (optional)
        </label>
        <input
          className={`${compactInputClasses} mt-2`}
          defaultValue={getConfigString(selectedBlock, "fileName")}
          id={`resource-file-name-${selectedBlock.id}`}
          maxLength={140}
          name="fileName"
          placeholder="Proposal budget template"
        />
      </div>

      <div>
        <label className="text-sm font-semibold text-deep-navy" htmlFor={`resource-file-size-${selectedBlock.id}`}>
          File size (optional)
        </label>
        <input
          className={`${compactInputClasses} mt-2`}
          defaultValue={getConfigString(selectedBlock, "fileSizeLabel")}
          id={`resource-file-size-${selectedBlock.id}`}
          maxLength={140}
          name="fileSizeLabel"
          placeholder="240 KB"
        />
      </div>

      <div>
        <label className="text-sm font-semibold text-deep-navy" htmlFor={`resource-button-label-${selectedBlock.id}`}>
          Button label
        </label>
        <input
          className={`${compactInputClasses} mt-2`}
          defaultValue={getConfigString(selectedBlock, "buttonLabel")}
          id={`resource-button-label-${selectedBlock.id}`}
          maxLength={140}
          name="buttonLabel"
          placeholder="Open resource"
        />
      </div>

      <RequiredBlockCheckbox selectedBlock={selectedBlock} />
      <ReadinessWarning warning={selectedBlock.readinessWarning} />

      <button className={compactButtonClasses} disabled={!canEdit} type="submit">
        Save Resource
      </button>
    </form>
  );
}
// ==================== END OF UPDATED RESOURCE CONFIGURATION ====================

function ExternalLinkConfigurationForm({
  canEdit,
  courseId,
  selectedBlock,
  selectedLesson,
}: {
  canEdit: boolean;
  courseId: string;
  selectedBlock: BuildStudioBlock;
  selectedLesson: BuildStudioLesson;
}) {
  return (
    <form action={updateBuildStudioExternalLinkBlock} className="mt-6 grid gap-4">
      <input name="courseId" type="hidden" value={courseId} />
      <input name="lessonId" type="hidden" value={selectedLesson.id} />
      <input name="blockId" type="hidden" value={selectedBlock.id} />
      <BlockTitleField selectedBlock={selectedBlock} />

      <div>
        <label
          className="text-sm font-semibold text-deep-navy"
          htmlFor={`external-link-url-${selectedBlock.id}`}
        >
          URL
        </label>
        <input
          className={`${compactInputClasses} mt-2`}
          defaultValue={getConfigString(selectedBlock, "url")}
          id={`external-link-url-${selectedBlock.id}`}
          name="url"
          placeholder="https://example.org/resource"
          type="url"
        />
      </div>

      <div>
        <label
          className="text-sm font-semibold text-deep-navy"
          htmlFor={`external-link-description-${selectedBlock.id}`}
        >
          Description
        </label>
        <textarea
          className={`${textareaClasses} mt-2 min-h-24`}
          defaultValue={getConfigString(selectedBlock, "description")}
          id={`external-link-description-${selectedBlock.id}`}
          name="description"
          placeholder="Explain what learners will find when they open the link."
        />
      </div>

      <div>
        <label
          className="text-sm font-semibold text-deep-navy"
          htmlFor={`external-link-button-${selectedBlock.id}`}
        >
          Button label
        </label>
        <input
          className={`${compactInputClasses} mt-2`}
          defaultValue={getConfigStringAny(selectedBlock, ["buttonLabel", "label"])}
          id={`external-link-button-${selectedBlock.id}`}
          maxLength={140}
          name="buttonLabel"
          placeholder="Open link"
        />
      </div>

      <label className="flex items-start gap-3 rounded-control border border-design-border bg-soft-bg p-3 text-sm text-dark-ink">
        <input
          className="mt-1"
          defaultChecked={getConfigBoolean(selectedBlock, "openInNewTab", true)}
          name="openInNewTab"
          type="checkbox"
        />
        <span>
          <span className="block font-semibold">Open in a new tab</span>
          <span className="mt-1 block leading-5 text-muted-text">
            Keep learners in the course while opening the external resource separately.
          </span>
        </span>
      </label>

      <RequiredBlockCheckbox selectedBlock={selectedBlock} />
      <ReadinessWarning warning={selectedBlock.readinessWarning} />

      <button className={compactButtonClasses} disabled={!canEdit} type="submit">
        Save External Link
      </button>
    </form>
  );
}

// ==================== UPDATED IMAGE CONFIGURATION FORM ====================
function ImageConfigurationForm({
  canEdit,
  courseId,
  selectedBlock,
  selectedLesson,
  courseTitle,
}: {
  canEdit: boolean;
  courseId: string;
  selectedBlock: BuildStudioBlock;
  selectedLesson: BuildStudioLesson;
  courseTitle: string;
}) {
  const [imageSourceType, setImageSourceType] = useState<"external_link" | "uploaded_file">(
    getConfigString(selectedBlock, "imageUrl")?.startsWith("http") ? "external_link" : "uploaded_file"
  );
  const [imageUrl, setImageUrl] = useState(getConfigString(selectedBlock, "imageUrl"));
  const [isUploading, setIsUploading] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file (jpg, png, etc.)");
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("courseId", courseId);
    formData.append("courseTitle", courseTitle);
    formData.append("type", "image");

    try {
      const res = await fetch("/api/upload-image", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      setImageUrl(data.url);
    } catch (error) {
      console.error(error);
      alert("Upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <form action={updateBuildStudioImageBlock} className="mt-6 grid gap-4">
      <input name="courseId" type="hidden" value={courseId} />
      <input name="lessonId" type="hidden" value={selectedLesson.id} />
      <input name="blockId" type="hidden" value={selectedBlock.id} />
      <BlockTitleField selectedBlock={selectedBlock} />

      <div>
        <label className="text-sm font-semibold text-deep-navy">Image source</label>
        <div className="mt-2 flex gap-4">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="radio"
              name="imageSourceType"
              value="external_link"
              checked={imageSourceType === "external_link"}
              onChange={() => setImageSourceType("external_link")}
            />
            External link
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="radio"
              name="imageSourceType"
              value="uploaded_file"
              checked={imageSourceType === "uploaded_file"}
              onChange={() => setImageSourceType("uploaded_file")}
            />
            Upload image
          </label>
        </div>
      </div>

      <div>
        <label className="text-sm font-semibold text-deep-navy" htmlFor={`image-url-${selectedBlock.id}`}>
          {imageSourceType === "external_link" ? "Image URL" : "Image file"}
        </label>
        <div className="flex flex-col gap-2">
          {imageSourceType === "external_link" ? (
            <input
              className={`${compactInputClasses} mt-2`}
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              id={`image-url-${selectedBlock.id}`}
              name="imageUrl"
              placeholder="https://example.org/image.jpg"
            />
          ) : (
            <>
              <input
                className={`${compactInputClasses} mt-2`}
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                id={`image-url-${selectedBlock.id}`}
                name="imageUrl"
                placeholder="Will be filled after upload"
                readOnly
              />
              <div className="flex gap-2 items-center">
                <label className={`${compactButtonClasses} cursor-pointer`}>
                  {isUploading ? "Uploading..." : "Choose image"}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                    disabled={isUploading}
                  />
                </label>
                {isUploading && <span className="text-sm text-muted-text">Uploading...</span>}
              </div>
            </>
          )}
        </div>
      </div>

      <div>
        <label
          className="text-sm font-semibold text-deep-navy"
          htmlFor={`image-alt-${selectedBlock.id}`}
        >
          Alt text
        </label>
        <textarea
          className={`${textareaClasses} mt-2 min-h-24`}
          defaultValue={getConfigString(selectedBlock, "altText")}
          id={`image-alt-${selectedBlock.id}`}
          name="altText"
          placeholder="Describe the meaningful content of the image."
        />
      </div>

      <div>
        <label
          className="text-sm font-semibold text-deep-navy"
          htmlFor={`image-caption-${selectedBlock.id}`}
        >
          Caption
        </label>
        <textarea
          className={`${textareaClasses} mt-2 min-h-24`}
          defaultValue={getConfigString(selectedBlock, "caption")}
          id={`image-caption-${selectedBlock.id}`}
          name="caption"
          placeholder="Explain how this image supports the lesson."
        />
      </div>

      <div>
        <label
          className="text-sm font-semibold text-deep-navy"
          htmlFor={`image-display-size-${selectedBlock.id}`}
        >
          Display size
        </label>
        <select
          className={`${compactInputClasses} mt-2`}
          defaultValue={getImageDisplaySize(selectedBlock)}
          id={`image-display-size-${selectedBlock.id}`}
          name="displaySize"
        >
          <option value="standard">Standard</option>
          <option value="wide">Wide</option>
        </select>
      </div>

      <RequiredBlockCheckbox selectedBlock={selectedBlock} />
      <ReadinessWarning warning={selectedBlock.readinessWarning} />

      <button className={compactButtonClasses} disabled={!canEdit} type="submit">
        Save Image
      </button>
    </form>
  );
}
// ==================== END OF UPDATED IMAGE CONFIGURATION ====================


// ==================== UPDATED VIDEO CONFIGURATION FORM ====================
function VideoConfigurationForm({
  canEdit,
  courseId,
  selectedBlock,
  selectedLesson,
  courseTitle, // <-- new prop
}: {
  canEdit: boolean;
  courseId: string;
  selectedBlock: BuildStudioBlock;
  selectedLesson: BuildStudioLesson;
  courseTitle: string; // <-- declare it here
}) {
  const durationMinutes =
    getConfigNumber(selectedBlock, "durationMinutes") ??
    selectedBlock.estimatedDurationMinutes ??
    "";

  const [sourceType, setSourceType] = useState(getVideoSourceType(selectedBlock));
  const [sourceUrl, setSourceUrl] = useState(getConfigString(selectedBlock, "sourceUrl"));
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("video/")) {
      alert("Please select a valid video file (mp4, webm, etc.)");
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append("video", file);
    formData.append("courseId", courseId);
    formData.append("courseTitle", courseTitle); // <-- send courseTitle

    try {
      const res = await fetch("/api/upload-video", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      setSourceUrl(data.url);
    } catch (error) {
      console.error(error);
      alert("Upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <form action={updateBuildStudioVideoBlock} className="mt-6 grid gap-4">
      <input name="courseId" type="hidden" value={courseId} />
      <input name="lessonId" type="hidden" value={selectedLesson.id} />
      <input name="blockId" type="hidden" value={selectedBlock.id} />
      <BlockTitleField selectedBlock={selectedBlock} />

      <div>
        <label className="text-sm font-semibold text-deep-navy" htmlFor={`video-source-type-${selectedBlock.id}`}>
          Source type
        </label>
        <select
          className={`${compactInputClasses} mt-2`}
          value={sourceType}
          onChange={(e) => setSourceType(e.target.value)}
          id={`video-source-type-${selectedBlock.id}`}
          name="sourceType"
        >
          <option value="embed_url">Embed URL</option>
          <option value="uploaded_file">Uploaded file reference</option>
          <option value="external_link">External link</option>
        </select>
      </div>

      <div>
        <label className="text-sm font-semibold text-deep-navy" htmlFor={`video-source-url-${selectedBlock.id}`}>
          Video source
        </label>
        <div className="flex flex-col gap-2">
          <input
            className={`${compactInputClasses} mt-2`}
            value={sourceUrl}
            onChange={(e) => setSourceUrl(e.target.value)}
            id={`video-source-url-${selectedBlock.id}`}
            name="sourceUrl"
            placeholder={
              sourceType === "uploaded_file"
                ? "Will be filled after upload"
                : "https://example.org/video"
            }
          />
          {sourceType === "uploaded_file" && (
            <div className="flex gap-2 items-center">
              <label className={`${compactButtonClasses} cursor-pointer`}>
                {isUploading ? "Uploading..." : "Choose file"}
                <input
                  type="file"
                  accept="video/mp4,video/webm"
                  className="hidden"
                  onChange={handleFileUpload}
                  disabled={isUploading}
                />
              </label>
              {isUploading && <span className="text-sm text-muted-text">Uploading...</span>}
            </div>
          )}
        </div>
      </div>

      {/* The rest of the form stays the same */}
      <div>
        <label className="text-sm font-semibold text-deep-navy" htmlFor={`video-description-${selectedBlock.id}`}>
          Description
        </label>
        <textarea
          className={`${textareaClasses} mt-2 min-h-24`}
          defaultValue={getConfigString(selectedBlock, "description")}
          id={`video-description-${selectedBlock.id}`}
          name="description"
          placeholder="Explain what learners should focus on while watching."
        />
      </div>

      <div>
        <label className="text-sm font-semibold text-deep-navy" htmlFor={`video-duration-${selectedBlock.id}`}>
          Duration
        </label>
        <input
          className={`${compactInputClasses} mt-2`}
          defaultValue={durationMinutes}
          id={`video-duration-${selectedBlock.id}`}
          min={1}
          name="durationMinutes"
          placeholder="Minutes"
          type="number"
        />
      </div>

      <div>
        <label className="text-sm font-semibold text-deep-navy" htmlFor={`video-thumbnail-${selectedBlock.id}`}>
          Thumbnail URL
        </label>
        <input
          className={`${compactInputClasses} mt-2`}
          defaultValue={getConfigString(selectedBlock, "thumbnailUrl")}
          id={`video-thumbnail-${selectedBlock.id}`}
          name="thumbnailUrl"
          placeholder="https://example.org/video-thumbnail.jpg"
        />
      </div>

      <div>
        <label className="text-sm font-semibold text-deep-navy" htmlFor={`video-transcript-${selectedBlock.id}`}>
          Transcript
        </label>
        <textarea
          className={`${textareaClasses} mt-2`}
          defaultValue={getConfigString(selectedBlock, "transcript")}
          id={`video-transcript-${selectedBlock.id}`}
          name="transcript"
          placeholder="Add the transcript or main spoken content."
        />
      </div>

      <label className="flex items-start gap-3 rounded-control border border-design-border bg-soft-bg p-3 text-sm text-dark-ink">
        <input
          className="mt-1"
          defaultChecked={getBlockConfig(selectedBlock).captionsAvailable === true}
          name="captionsAvailable"
          type="checkbox"
        />
        <span>
          <span className="block font-semibold">Captions available</span>
          <span className="mt-1 block leading-5 text-muted-text">
            Confirm that learners can access captions for this video.
          </span>
        </span>
      </label>

      <RequiredBlockCheckbox selectedBlock={selectedBlock} />
      <ReadinessWarning warning={selectedBlock.readinessWarning} />

      <button className={compactButtonClasses} disabled={!canEdit} type="submit">
        Save Video
      </button>
    </form>
  );
}
// ==================== END OF UPDATED VIDEO CONFIGURATION ====================

function AccordionConfigurationForm({
  canEdit,
  courseId,
  selectedBlock,
  selectedLesson,
}: {
  canEdit: boolean;
  courseId: string;
  selectedBlock: BuildStudioBlock;
  selectedLesson: BuildStudioLesson;
}) {
  const items = getAccordionItems(selectedBlock);
  const itemRows = items.length > 0 ? items : [{ body: "", id: "item-1", title: "" }];

  return (
    <form action={updateBuildStudioAccordionBlock} className="mt-6 grid gap-4">
      <input name="courseId" type="hidden" value={courseId} />
      <input name="lessonId" type="hidden" value={selectedLesson.id} />
      <input name="blockId" type="hidden" value={selectedBlock.id} />
      <input name="itemCount" type="hidden" value={itemRows.length} />
      <BlockTitleField selectedBlock={selectedBlock} />

      <div>
        <label
          className="text-sm font-semibold text-deep-navy"
          htmlFor={`accordion-introduction-${selectedBlock.id}`}
        >
          Introduction
        </label>
        <textarea
          className={`${textareaClasses} mt-2 min-h-24`}
          defaultValue={getConfigString(selectedBlock, "introduction")}
          id={`accordion-introduction-${selectedBlock.id}`}
          name="introduction"
          placeholder="Optional short context before the expandable items."
        />
      </div>

      <label className="flex items-start gap-3 rounded-control border border-design-border bg-soft-bg p-3 text-sm text-dark-ink">
        <input
          className="mt-1"
          defaultChecked={getConfigBoolean(selectedBlock, "allowMultipleOpen", true)}
          name="allowMultipleOpen"
          type="checkbox"
        />
        <span>
          <span className="block font-semibold">Allow multiple open items</span>
          <span className="mt-1 block leading-5 text-muted-text">
            Learners can keep more than one section open while reading.
          </span>
        </span>
      </label>

      <div className="grid gap-3">
        <p className="text-sm font-semibold text-deep-navy">Accordion items</p>
        {itemRows.map((item, index) => {
          return (
            <div
              className="rounded-control border border-design-border bg-soft-bg p-3"
              key={`accordion-item-${selectedBlock.id}-${index}`}
            >
              <input
                name={`itemId-${index}`}
                type="hidden"
                value={item?.id ?? `item-${index + 1}`}
              />
              <label
                className="text-xs font-semibold text-muted-text"
                htmlFor={`accordion-item-title-${selectedBlock.id}-${index}`}
              >
                Item {index + 1} title
              </label>
              <input
                className={`${compactInputClasses} mt-2`}
                defaultValue={item?.title ?? ""}
                id={`accordion-item-title-${selectedBlock.id}-${index}`}
                maxLength={140}
                name={`itemTitle-${index}`}
                placeholder="Expandable item title"
              />
              <label
                className="mt-3 block text-xs font-semibold text-muted-text"
                htmlFor={`accordion-item-body-${selectedBlock.id}-${index}`}
              >
                Item {index + 1} body
              </label>
              <textarea
                className={`${textareaClasses} mt-2 min-h-24`}
                defaultValue={item?.body ?? ""}
                id={`accordion-item-body-${selectedBlock.id}-${index}`}
                name={`itemBody-${index}`}
                placeholder="Content learners reveal when they open this item."
              />
              {itemRows.length > 1 ? (
                <button
                  className={`${dangerButtonClasses} mt-3`}
                  disabled={!canEdit}
                  name="repeatableIntent"
                  type="submit"
                  value={`remove-accordion-item-${index}`}
                >
                  Remove item
                </button>
              ) : null}
            </div>
          );
        })}
        {itemRows.length < 8 ? (
          <button
            className={compactButtonClasses}
            disabled={!canEdit}
            name="repeatableIntent"
            type="submit"
            value="add-accordion-item"
          >
            Add item
          </button>
        ) : null}
      </div>

      <RequiredBlockCheckbox selectedBlock={selectedBlock} />
      <ReadinessWarning warning={selectedBlock.readinessWarning} />

      <button className={compactButtonClasses} disabled={!canEdit} type="submit">
        Save Accordion
      </button>
    </form>
  );
}

function FlashcardsConfigurationForm({
  canEdit,
  courseId,
  selectedBlock,
  selectedLesson,
}: {
  canEdit: boolean;
  courseId: string;
  selectedBlock: BuildStudioBlock;
  selectedLesson: BuildStudioLesson;
}) {
  const cards = getFlashcards(selectedBlock);
  const cardRows = cards.length > 0 ? cards : [{ back: "", front: "", id: "card-1" }];

  return (
    <form action={updateBuildStudioFlashcardsBlock} className="mt-6 grid gap-4">
      <input name="courseId" type="hidden" value={courseId} />
      <input name="lessonId" type="hidden" value={selectedLesson.id} />
      <input name="blockId" type="hidden" value={selectedBlock.id} />
      <input name="cardCount" type="hidden" value={cardRows.length} />
      <BlockTitleField selectedBlock={selectedBlock} />

      <div>
        <label
          className="text-sm font-semibold text-deep-navy"
          htmlFor={`flashcards-instructions-${selectedBlock.id}`}
        >
          Instructions
        </label>
        <textarea
          className={`${textareaClasses} mt-2 min-h-24`}
          defaultValue={getConfigString(selectedBlock, "instructions")}
          id={`flashcards-instructions-${selectedBlock.id}`}
          name="instructions"
          placeholder="Optional short guidance before learners reveal the cards."
        />
      </div>

      <div>
        <label
          className="text-sm font-semibold text-deep-navy"
          htmlFor={`flashcards-display-${selectedBlock.id}`}
        >
          Display mode
        </label>
        <select
          className={`${compactInputClasses} mt-2`}
          defaultValue={getFlashcardDisplayMode(selectedBlock)}
          id={`flashcards-display-${selectedBlock.id}`}
          name="displayMode"
        >
          <option value="grid">Grid</option>
          <option value="stack">Stack</option>
        </select>
      </div>

      <div className="grid gap-3">
        <p className="text-sm font-semibold text-deep-navy">Cards</p>
        {cardRows.map((card, index) => {
          return (
            <div
              className="rounded-control border border-design-border bg-soft-bg p-3"
              key={`flashcard-${selectedBlock.id}-${index}`}
            >
              <input
                name={`cardId-${index}`}
                type="hidden"
                value={card?.id ?? `card-${index + 1}`}
              />
              <label
                className="text-xs font-semibold text-muted-text"
                htmlFor={`flashcard-front-${selectedBlock.id}-${index}`}
              >
                Card {index + 1} front
              </label>
              <textarea
                className={`${textareaClasses} mt-2 min-h-20`}
                defaultValue={card?.front ?? ""}
                id={`flashcard-front-${selectedBlock.id}-${index}`}
                name={`cardFront-${index}`}
                placeholder="Term, question, or prompt."
              />
              <label
                className="mt-3 block text-xs font-semibold text-muted-text"
                htmlFor={`flashcard-back-${selectedBlock.id}-${index}`}
              >
                Card {index + 1} back
              </label>
              <textarea
                className={`${textareaClasses} mt-2 min-h-20`}
                defaultValue={card?.back ?? ""}
                id={`flashcard-back-${selectedBlock.id}-${index}`}
                name={`cardBack-${index}`}
                placeholder="Definition, answer, or explanation."
              />
              {cardRows.length > 1 ? (
                <button
                  className={`${dangerButtonClasses} mt-3`}
                  disabled={!canEdit}
                  name="repeatableIntent"
                  type="submit"
                  value={`remove-flashcard-${index}`}
                >
                  Remove card
                </button>
              ) : null}
            </div>
          );
        })}
        {cardRows.length < 8 ? (
          <button
            className={compactButtonClasses}
            disabled={!canEdit}
            name="repeatableIntent"
            type="submit"
            value="add-flashcard"
          >
            Add card
          </button>
        ) : null}
      </div>

      <RequiredBlockCheckbox selectedBlock={selectedBlock} />
      <ReadinessWarning warning={selectedBlock.readinessWarning} />

      <button className={compactButtonClasses} disabled={!canEdit} type="submit">
        Save Flashcards
      </button>
    </form>
  );
}

function KnowledgeCheckConfigurationForm({
  canEdit,
  courseId,
  selectedBlock,
  selectedLesson,
}: {
  canEdit: boolean;
  courseId: string;
  selectedBlock: BuildStudioBlock;
  selectedLesson: BuildStudioLesson;
}) {
  const options = getKnowledgeCheckOptions(selectedBlock);
  const optionRows =
    options.length > 0
      ? options
      : [
          { feedback: "", id: "option-1", isCorrect: true, label: "" },
          { feedback: "", id: "option-2", isCorrect: false, label: "" },
        ];
  const correctOptionId =
    optionRows.find((option) => option.isCorrect)?.id ?? optionRows[0]?.id ?? "option-1";

  return (
    <form action={updateBuildStudioKnowledgeCheckBlock} className="mt-6 grid gap-4">
      <input name="courseId" type="hidden" value={courseId} />
      <input name="lessonId" type="hidden" value={selectedLesson.id} />
      <input name="blockId" type="hidden" value={selectedBlock.id} />
      <input name="optionCount" type="hidden" value={optionRows.length} />
      <BlockTitleField selectedBlock={selectedBlock} />

      <div>
        <label
          className="text-sm font-semibold text-deep-navy"
          htmlFor={`knowledge-question-${selectedBlock.id}`}
        >
          Question
        </label>
        <textarea
          className={`${textareaClasses} mt-2 min-h-24`}
          defaultValue={getConfigString(selectedBlock, "question")}
          id={`knowledge-question-${selectedBlock.id}`}
          name="question"
          placeholder="Ask one low-stakes practice question."
        />
      </div>

      <div>
        <label
          className="text-sm font-semibold text-deep-navy"
          htmlFor={`knowledge-helper-${selectedBlock.id}`}
        >
          Helper text
        </label>
        <textarea
          className={`${textareaClasses} mt-2 min-h-20`}
          defaultValue={getConfigString(selectedBlock, "helperText")}
          id={`knowledge-helper-${selectedBlock.id}`}
          name="helperText"
          placeholder="Optional hint or context before learners answer."
        />
      </div>

      <fieldset className="grid gap-3">
        <legend className="text-sm font-semibold text-deep-navy">
          Answer options
        </legend>
        {optionRows.map((option, index) => {
          const optionId = option.id || `option-${index + 1}`;

          return (
            <div
              className="rounded-control border border-design-border bg-soft-bg p-3"
              key={`knowledge-option-${selectedBlock.id}-${index}`}
            >
              <input name={`optionId-${index}`} type="hidden" value={optionId} />
              <label className="flex items-center gap-2 text-xs font-semibold text-muted-text">
                <input
                  defaultChecked={correctOptionId === optionId}
                  name="correctOptionId"
                  type="radio"
                  value={optionId}
                />
                Correct answer
              </label>
              <label
                className="mt-3 block text-xs font-semibold text-muted-text"
                htmlFor={`knowledge-option-label-${selectedBlock.id}-${index}`}
              >
                Option {index + 1}
              </label>
              <textarea
                className={`${textareaClasses} mt-2 min-h-20`}
                defaultValue={option.label ?? ""}
                id={`knowledge-option-label-${selectedBlock.id}-${index}`}
                name={`optionLabel-${index}`}
                placeholder="Answer option"
              />
              <label
                className="mt-3 block text-xs font-semibold text-muted-text"
                htmlFor={`knowledge-option-feedback-${selectedBlock.id}-${index}`}
              >
                Option feedback
              </label>
              <textarea
                className={`${textareaClasses} mt-2 min-h-20`}
                defaultValue={option.feedback ?? ""}
                id={`knowledge-option-feedback-${selectedBlock.id}-${index}`}
                name={`optionFeedback-${index}`}
                placeholder="Optional feedback for this option."
              />
              {optionRows.length > 2 ? (
                <button
                  className={`${dangerButtonClasses} mt-3`}
                  disabled={!canEdit}
                  name="repeatableIntent"
                  type="submit"
                  value={`remove-knowledge-option-${index}`}
                >
                  Remove option
                </button>
              ) : null}
            </div>
          );
        })}
        {optionRows.length < 6 ? (
          <button
            className={compactButtonClasses}
            disabled={!canEdit}
            name="repeatableIntent"
            type="submit"
            value="add-knowledge-option"
          >
            Add option
          </button>
        ) : null}
      </fieldset>

      <div>
        <label
          className="text-sm font-semibold text-deep-navy"
          htmlFor={`knowledge-correct-feedback-${selectedBlock.id}`}
        >
          Correct feedback
        </label>
        <textarea
          className={`${textareaClasses} mt-2 min-h-20`}
          defaultValue={getConfigString(selectedBlock, "correctFeedback")}
          id={`knowledge-correct-feedback-${selectedBlock.id}`}
          name="correctFeedback"
          placeholder="Message shown when the learner chooses the correct answer."
        />
      </div>

      <div>
        <label
          className="text-sm font-semibold text-deep-navy"
          htmlFor={`knowledge-incorrect-feedback-${selectedBlock.id}`}
        >
          Incorrect feedback
        </label>
        <textarea
          className={`${textareaClasses} mt-2 min-h-20`}
          defaultValue={getConfigString(selectedBlock, "incorrectFeedback")}
          id={`knowledge-incorrect-feedback-${selectedBlock.id}`}
          name="incorrectFeedback"
          placeholder="Message shown when the learner needs to try again."
        />
      </div>

      <label className="flex items-start gap-3 rounded-control border border-design-border bg-soft-bg p-3 text-sm text-dark-ink">
        <input
          className="mt-1"
          defaultChecked={getConfigBoolean(selectedBlock, "retryAllowed", true)}
          name="retryAllowed"
          type="checkbox"
        />
        <span>
          <span className="block font-semibold">Allow retry</span>
          <span className="mt-1 block leading-5 text-muted-text">
            Learners can reset the practice question after feedback.
          </span>
        </span>
      </label>

      <RequiredBlockCheckbox selectedBlock={selectedBlock} />
      <ReadinessWarning warning={selectedBlock.readinessWarning} />

      <button className={compactButtonClasses} disabled={!canEdit} type="submit">
        Save Knowledge Check
      </button>
    </form>
  );
}

function BranchingScenarioConfigurationForm({
  canEdit,
  courseId,
  selectedBlock,
  selectedLesson,
}: {
  canEdit: boolean;
  courseId: string;
  selectedBlock: BuildStudioBlock;
  selectedLesson: BuildStudioLesson;
}) {
  const scenarioContext =
    getConfigString(selectedBlock, "context") ||
    getConfigString(selectedBlock, "scenario");
  const choices = getBranchingChoices(selectedBlock);
  const choiceRows =
    choices.length > 0
      ? choices
      : [
          { feedback: "", id: "choice-1", label: "", outcomeTone: "neutral" },
          { feedback: "", id: "choice-2", label: "", outcomeTone: "neutral" },
        ];
  const bestOptionId = getConfigString(selectedBlock, "bestOptionId");

  return (
    <form
      action={updateBuildStudioBranchingScenarioBlock}
      className="mt-6 grid gap-4"
    >
      <input name="courseId" type="hidden" value={courseId} />
      <input name="lessonId" type="hidden" value={selectedLesson.id} />
      <input name="blockId" type="hidden" value={selectedBlock.id} />
      <input name="choiceCount" type="hidden" value={choiceRows.length} />
      <BlockTitleField selectedBlock={selectedBlock} />

      <div>
        <label
          className="text-sm font-semibold text-deep-navy"
          htmlFor={`branching-context-${selectedBlock.id}`}
        >
          Scenario context
        </label>
        <textarea
          className={`${textareaClasses} mt-2 min-h-28`}
          defaultValue={scenarioContext}
          id={`branching-context-${selectedBlock.id}`}
          name="context"
          placeholder="Describe the realistic situation the learner faces."
        />
      </div>

      <div>
        <label
          className="text-sm font-semibold text-deep-navy"
          htmlFor={`branching-question-${selectedBlock.id}`}
        >
          Decision question
        </label>
        <textarea
          className={`${textareaClasses} mt-2 min-h-24`}
          defaultValue={getConfigStringAny(selectedBlock, [
            "decisionQuestion",
            "decisionPrompt",
          ])}
          id={`branching-question-${selectedBlock.id}`}
          name="decisionQuestion"
          placeholder="What decision should the learner make?"
        />
      </div>

      <fieldset className="grid gap-3">
        <legend className="text-sm font-semibold text-deep-navy">
          Choices
        </legend>
        {choiceRows.map((choice, index) => {
          const choiceId = choice.id || `choice-${index + 1}`;
          const currentTone = choice.outcomeTone ?? "neutral";

          return (
            <div
              className="rounded-control border border-design-border bg-soft-bg p-3"
              key={`branching-choice-${selectedBlock.id}-${index}`}
            >
              <input name={`choiceId-${index}`} type="hidden" value={choiceId} />
              <p className="text-xs font-semibold text-muted-text">
                Choice {index + 1}
              </p>
              <label className="mt-3 flex items-center gap-2 text-xs font-semibold text-muted-text">
                <input
                  defaultChecked={bestOptionId === choiceId}
                  name="bestOptionId"
                  type="radio"
                  value={choiceId}
                />
                Best option
              </label>

              <label
                className="mt-3 block text-xs font-semibold text-muted-text"
                htmlFor={`branching-choice-label-${selectedBlock.id}-${index}`}
              >
                Choice label
              </label>
              <textarea
                className={`${textareaClasses} mt-2 min-h-20`}
                defaultValue={choice.label ?? ""}
                id={`branching-choice-label-${selectedBlock.id}-${index}`}
                name={`choiceLabel-${index}`}
                placeholder="What the learner can choose."
              />

              <label
                className="mt-3 block text-xs font-semibold text-muted-text"
                htmlFor={`branching-choice-feedback-${selectedBlock.id}-${index}`}
              >
                Feedback
              </label>
              <textarea
                className={`${textareaClasses} mt-2 min-h-20`}
                defaultValue={choice.feedback ?? ""}
                id={`branching-choice-feedback-${selectedBlock.id}-${index}`}
                name={`choiceFeedback-${index}`}
                placeholder="Explain why this choice is stronger or weaker."
              />

              <label
                className="mt-3 block text-xs font-semibold text-muted-text"
                htmlFor={`branching-choice-tone-${selectedBlock.id}-${index}`}
              >
                Outcome tone
              </label>
              <select
                className={`${compactInputClasses} mt-2`}
                defaultValue={currentTone}
                id={`branching-choice-tone-${selectedBlock.id}-${index}`}
                name={`choiceOutcomeTone-${index}`}
              >
                <option value="positive">Positive</option>
                <option value="caution">Caution</option>
                <option value="neutral">Neutral</option>
              </select>
              {choiceRows.length > 2 ? (
                <button
                  className={`${dangerButtonClasses} mt-3`}
                  disabled={!canEdit}
                  name="repeatableIntent"
                  type="submit"
                  value={`remove-branching-choice-${index}`}
                >
                  Remove choice
                </button>
              ) : null}
            </div>
          );
        })}
        {choiceRows.length < 6 ? (
          <button
            className={compactButtonClasses}
            disabled={!canEdit}
            name="repeatableIntent"
            type="submit"
            value="add-branching-choice"
          >
            Add choice
          </button>
        ) : null}
      </fieldset>

      <div>
        <label
          className="text-sm font-semibold text-deep-navy"
          htmlFor={`branching-learning-point-${selectedBlock.id}`}
        >
          Learning point
        </label>
        <textarea
          className={`${textareaClasses} mt-2 min-h-24`}
          defaultValue={getConfigString(selectedBlock, "learningPoint")}
          id={`branching-learning-point-${selectedBlock.id}`}
          name="learningPoint"
          placeholder="The key takeaway learners should remember after this scenario."
        />
      </div>

      <label className="flex items-start gap-3 rounded-control border border-design-border bg-soft-bg p-3 text-sm text-dark-ink">
        <input
          className="mt-1"
          defaultChecked={getConfigBoolean(selectedBlock, "allowRetry", true)}
          name="allowRetry"
          type="checkbox"
        />
        <span>
          <span className="block font-semibold">Allow retry</span>
          <span className="mt-1 block leading-5 text-muted-text">
            Learners can reset the scenario and choose again.
          </span>
        </span>
      </label>

      <RequiredBlockCheckbox selectedBlock={selectedBlock} />
      <ReadinessWarning warning={selectedBlock.readinessWarning} />

      <button className={compactButtonClasses} disabled={!canEdit} type="submit">
        Save Branching Scenario
      </button>
    </form>
  );
}

function BlockTitleField({
  selectedBlock,
}: {
  selectedBlock: BuildStudioBlock;
}) {
  return (
    <div>
      <label
        className="text-sm font-semibold text-deep-navy"
        htmlFor={`block-title-${selectedBlock.id}`}
      >
        Block title
      </label>
      <input
        className={`${compactInputClasses} mt-2`}
        defaultValue={selectedBlock.title}
        id={`block-title-${selectedBlock.id}`}
        maxLength={140}
        name="title"
        required
      />
    </div>
  );
}

function RequiredBlockCheckbox({
  selectedBlock,
}: {
  selectedBlock: BuildStudioBlock;
}) {
  return (
    <label className="flex items-start gap-3 rounded-control border border-design-border bg-soft-bg p-3 text-sm text-dark-ink">
      <input
        className="mt-1"
        defaultChecked={selectedBlock.isRequired}
        name="isRequired"
        type="checkbox"
      />
      <span>
        <span className="block font-semibold">Required block</span>
        <span className="mt-1 block leading-5 text-muted-text">
          Participants should complete this block as part of the lesson.
        </span>
      </span>
    </label>
  );
}

function ReadinessWarning({ warning }: { warning: string | null }) {
  if (!warning) {
    return null;
  }

  return (
    <p className="rounded-control border border-[#f6d365] bg-[#fff7db] px-3 py-2 text-sm leading-6 text-[#7a4d00]">
      {warning}
    </p>
  );
}

function PanelEmptyState({
  description,
  title,
}: {
  description: string;
  title: string;
}) {
  return (
    <div className="mt-5 rounded-[20px] border border-dashed border-dec-blue/30 bg-soft-bg p-6 text-center">
      <div className="mx-auto flex size-11 items-center justify-center rounded-full bg-dec-blue/10 text-dec-blue">
        <span aria-hidden="true" className="block size-3 rounded-full bg-dec-blue" />
      </div>
      <h3 className="mt-4 text-lg font-semibold text-dark-ink">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-muted-text">{description}</p>
    </div>
  );
}

export function CreatorBuildStudio({
  course,
  studioNotice,
}: {
  course: BuildStudioCourse;
  studioNotice?: string;
}) {
  return (
    <div className="space-y-6">
      <BuildStudioHeader course={course} studioNotice={studioNotice} />
      <CreatorCourseContextBar
        ariaLabel="Build Studio course context"
        items={[
          { label: "Course", value: course.title },
          { label: "Status", value: course.statusLabel },
          { label: "Capacity area", value: course.capacityArea },
          { label: "Saved", value: course.lastSavedLabel },
          { label: "Current step", value: "Build Studio" },
        ]}
      />

      <section
        aria-label="Build Studio workspace"
        className="grid gap-5 xl:grid-cols-[320px_minmax(0,1fr)_360px] xl:items-start"
      >
        <BlockLibraryPanel course={course} />
        <CourseCanvasPanel course={course} />
        <BlockConfigurationPanel
          canEdit={course.canEditOutline}
          course={course}
          selectedBlock={course.selectedBlock}
          selectedLesson={course.selectedLesson}
          
        />
      </section>
    </div>
  );
}
