import { ActionButton, SectionHeader, StatusBadge } from "@/components/ui";
import {
  BranchingScenarioInteraction,
  type BranchingChoice,
} from "@/components/learner/BranchingScenarioInteraction";
import {
  KnowledgeCheckInteraction,
  type KnowledgeCheckOption,
} from "@/components/learner/KnowledgeCheckInteraction";
import { ReflectionInteraction } from "@/components/learner/ReflectionInteraction";
import { LessonNavigationControls } from "@/components/learner/LessonNavigationControls";
import type {
  LearnerContentBlock,
  LearnerCourseDetail,
} from "@/lib/course-types";

function getBlockConfig(block: LearnerContentBlock) {
  if (block.configJson && typeof block.configJson === "object") {
    return block.configJson as Record<string, unknown>;
  }

  return {};
}

function getConfigString(block: LearnerContentBlock, key: string) {
  const value = getBlockConfig(block)[key];

  return typeof value === "string" ? value.trim() : "";
}

function getRecordString(record: Record<string, unknown>, keys: string[]) {
  for (const key of keys) {
    const value = record[key];

    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }

  return "";
}

function getConfigStringAny(block: LearnerContentBlock, keys: string[]) {
  for (const key of keys) {
    const value = getConfigString(block, key);

    if (value) {
      return value;
    }
  }

  return "";
}

function normalizeLearnerBlockType(type: string) {
  const normalized = type.trim().toUpperCase();

  if (normalized === "FLASHCARDS") {
    return "FLASHCARD";
  }

  if (normalized === "PRACTICAL_ACTIVITY") {
    return "PRACTICAL_ACTIVITY_PROMPT";
  }

  if (normalized === "MULTIPLE_CHOICE_QUESTION" || normalized === "TRUE_FALSE_QUESTION") {
    return "KNOWLEDGE_CHECK";
  }

  if (normalized === "SHORT_ANSWER_PROMPT") {
    return "REFLECTION_PROMPT";
  }

  return normalized;
}

function getKeyMessageStyle(block: LearnerContentBlock) {
  const style = getConfigStringAny(block, ["style", "tone"]);

  return ["info", "success", "warning", "neutral"].includes(style)
    ? style
    : "info";
}

function getKeyMessageClasses(style: string) {
  const styles: Record<string, string> = {
    info: "border-dec-blue/25 bg-dec-blue/10 text-[#26536c]",
    neutral: "border-design-border bg-soft-bg text-muted-text",
    success: "border-dec-green/30 bg-dec-green/15 text-[#365c19]",
    warning: "border-[#f6d365] bg-[#fff7db] text-[#7a4d00]",
  };

  return styles[style] ?? styles.info;
}

function getResourceType(block: LearnerContentBlock) {
  const resourceType = getConfigStringAny(block, ["resourceType", "fileType", "type"]).toLowerCase();

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

function getResourceSourceType(block: LearnerContentBlock) {
  const sourceType = getConfigString(block, "sourceType");

  return sourceType === "uploaded_file" || sourceType === "file"
    ? "uploaded_file"
    : "external_link";
}

function getImageDisplaySize(block: LearnerContentBlock) {
  const displaySize = getConfigString(block, "displaySize");

  return displaySize === "wide" ? "wide" : "standard";
}

function getVideoSourceType(block: LearnerContentBlock) {
  const sourceType = getConfigString(block, "sourceType");

  return ["embed_url", "uploaded_file", "external_link"].includes(sourceType)
    ? sourceType
    : "embed_url";
}

function getConfigNumber(block: LearnerContentBlock, key: string) {
  const value = getBlockConfig(block)[key];

  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function getConfigNumberAny(block: LearnerContentBlock, keys: string[]) {
  for (const key of keys) {
    const value = getConfigNumber(block, key);

    if (value !== null) {
      return value;
    }
  }

  return null;
}

function getConfigArray(block: LearnerContentBlock, key: string) {
  const value = getBlockConfig(block)[key];

  return Array.isArray(value) ? value : [];
}

function getConfigArrayAny(block: LearnerContentBlock, keys: string[]) {
  for (const key of keys) {
    const value = getConfigArray(block, key);

    if (value.length > 0) {
      return value;
    }
  }

  return [];
}

function getConfigBoolean(
  block: LearnerContentBlock,
  key: string,
  fallback = false,
) {
  const value = getBlockConfig(block)[key];

  return typeof value === "boolean" ? value : fallback;
}

function getAccordionItems(block: LearnerContentBlock) {
  return getConfigArrayAny(block, ["items", "accordionItems", "sections"])
    .map((item, index) => {
      if (!item || typeof item !== "object") {
        return null;
      }

      const record = item as Record<string, unknown>;
      const id = typeof record.id === "string" ? record.id : `item-${index + 1}`;
      const title = getRecordString(record, ["title", "heading", "label"]);
      const body = getRecordString(record, ["body", "content", "text", "description"]);

      return title && body ? { body, id, title } : null;
    })
    .filter((item): item is { body: string; id: string; title: string } =>
      Boolean(item),
    );
}

function getFlashcards(block: LearnerContentBlock) {
  return getConfigArrayAny(block, ["cards", "flashcards", "items"])
    .map((card, index) => {
      if (!card || typeof card !== "object") {
        return null;
      }

      const record = card as Record<string, unknown>;
      const id = typeof record.id === "string" ? record.id : `card-${index + 1}`;
      const front = getRecordString(record, ["front", "term", "question", "title"]);
      const back = getRecordString(record, ["back", "definition", "answer", "body"]);

      return front && back ? { back, front, id } : null;
    })
    .filter((card): card is { back: string; front: string; id: string } =>
      Boolean(card),
    );
}

function getKnowledgeCheckOptions(block: LearnerContentBlock) {
  const correctOptionId = getConfigString(block, "correctOptionId");
  const correctAnswer = getConfigStringAny(block, ["correctAnswer", "answer"]);
  const correctOptionIds = getConfigArray(block, "correctOptionIds").filter(
    (id): id is string => typeof id === "string",
  );

  return getConfigArray(block, "options")
    .map((option, index) => {
      if (typeof option === "string") {
        const id = `option-${index + 1}`;
        return {
          feedback: "",
          id,
          isCorrect: Boolean(
            correctAnswer && option.trim().toLowerCase() === correctAnswer.toLowerCase(),
          ),
          label: option.trim(),
        };
      }

      if (!option || typeof option !== "object") {
        return null;
      }

      const record = option as Record<string, unknown>;
      const id =
        typeof record.id === "string" ? record.id : `option-${index + 1}`;
      const rawLabel = record.label ?? record.text;
      const label = typeof rawLabel === "string" ? rawLabel.trim() : "";
      const feedback =
        typeof record.feedback === "string" ? record.feedback.trim() : "";
      const isCorrect =
        record.isCorrect === true ||
        (typeof record.id === "string" &&
          (record.id === correctOptionId || correctOptionIds.includes(record.id))) ||
        Boolean(correctAnswer && label.toLowerCase() === correctAnswer.toLowerCase());

      return label ? { feedback, id, isCorrect, label } : null;
    })
    .filter((option): option is KnowledgeCheckOption => Boolean(option));
}

function getBranchingChoices(block: LearnerContentBlock) {
  const bestOptionId = getConfigStringAny(block, ["bestOptionId", "correctOptionId"]);
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
      const id =
        typeof record.id === "string" ? record.id : `choice-${index + 1}`;
      const rawLabel = record.label ?? record.text;
      const rawFeedback = record.feedback ?? record.consequence;
      const rawTone = record.outcomeTone ?? record.quality;
      const label = typeof rawLabel === "string" ? rawLabel.trim() : "";
      const feedback =
        typeof rawFeedback === "string" ? rawFeedback.trim() : "";
      const configuredTone =
        typeof rawTone === "string" &&
        ["positive", "caution", "neutral"].includes(rawTone)
          ? rawTone
          : rawTone === "best" || rawTone === "strong"
            ? "positive"
            : rawTone === "unsafe" || rawTone === "weak" || rawTone === "risky"
              ? "caution"
              : "neutral";
      const outcomeTone = id === bestOptionId ? "positive" : configuredTone;

      return label ? { feedback, id, label, outcomeTone } : null;
    })
    .filter((choice): choice is BranchingChoice => Boolean(choice));
}

function getFlashcardDisplayMode(block: LearnerContentBlock) {
  return getConfigString(block, "displayMode") === "stack" ? "stack" : "grid";
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
    embed_url: "Embedded video",
    external_link: "External video",
    uploaded_file: "Video file",
  };

  return labels[value] ?? "Video";
}

function splitParagraphs(value: string) {
  return value
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

/**
 * Converts a YouTube or Vimeo watch URL into an embeddable URL.
 * Handles:
 * - https://www.youtube.com/watch?v=VIDEO_ID
 * - https://youtu.be/VIDEO_ID
 * - https://vimeo.com/123456789
 * - Leaves other URLs (including already valid embed URLs) unchanged.
 */
function getEmbedUrl(url: string): string {
  // YouTube: watch?v= or youtu.be/
  const youtubeRegex = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/;
  const youtubeMatch = url.match(youtubeRegex);
  if (youtubeMatch) {
    return `https://www.youtube.com/embed/${youtubeMatch[1]}`;
  }

  // Vimeo
  const vimeoRegex = /vimeo\.com\/(\d+)/;
  const vimeoMatch = url.match(vimeoRegex);
  if (vimeoMatch) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
  }

  // Return unchanged if no pattern matches (assume it's already an embed URL or a different provider)
  return url;
}

function isStageOneLearnerBlock(block: LearnerContentBlock) {
  const blockType = normalizeLearnerBlockType(block.type);

  return (
    blockType === "TEXT" ||
    blockType === "KEY_MESSAGE" ||
    blockType === "CASE_STUDY" ||
    blockType === "RESOURCE" ||
    blockType === "EXTERNAL_LINK" ||
    blockType === "IMAGE" ||
    blockType === "VIDEO" ||
    blockType === "AUDIO" ||
    blockType === "ACCORDION" ||
    blockType === "FLASHCARD" ||
    blockType === "KNOWLEDGE_CHECK" ||
    blockType === "BRANCHING_SCENARIO" ||
    blockType === "REFLECTION_PROMPT" ||
    blockType === "PRACTICAL_ACTIVITY_PROMPT" ||
    blockType === "BUTTON_CTA"
  );
}

function getTemplateVisualKind(templateId: string) {
  if (templateId === "LT-PRACTICE-SCENARIO") {
    return "practice";
  }

  if (templateId === "LT-RESOURCE-TOOLKIT") {
    return "toolkit";
  }

  if (templateId === "LT-ASSESSMENT-PREP") {
    return "assessment";
  }

  return "guided";
}

function getTemplateChrome(templateId: string) {
  const kind = getTemplateVisualKind(templateId);

  if (kind === "practice") {
    return {
      accentText: "text-dec-blue",
      blockAccent: "border-l-4 border-l-dec-blue",
      header: "border-dec-blue/25 bg-gradient-to-br from-dec-blue/15 via-white to-dec-green/10",
      outline: "border-dec-blue/20 bg-white-surface",
      progress: "border-dec-blue/25 bg-dec-blue/10",
      surface: "border-dec-blue/20 bg-[#f8fcff]",
    };
  }

  if (kind === "toolkit") {
    return {
      accentText: "text-[#365c19]",
      blockAccent: "border-l-4 border-l-dec-green",
      header: "border-dec-green/30 bg-gradient-to-br from-dec-green/15 via-white to-dec-blue/5",
      outline: "border-dec-green/25 bg-white-surface",
      progress: "border-dec-green/30 bg-dec-green/15",
      surface: "border-dec-green/25 bg-[#fbfff7]",
    };
  }

  if (kind === "assessment") {
    return {
      accentText: "text-[#5b45a8]",
      blockAccent: "border-l-4 border-l-[#8B5CF6]",
      header: "border-[#ddd6fe] bg-gradient-to-br from-[#f5f3ff] via-white to-dec-blue/5",
      outline: "border-[#ddd6fe] bg-white-surface",
      progress: "border-[#ddd6fe] bg-[#f5f3ff]",
      surface: "border-[#ddd6fe] bg-[#fcfbff]",
    };
  }

  return {
    accentText: "text-dec-blue",
    blockAccent: "border-l-4 border-l-dec-blue",
    header: "border-dec-blue/20 bg-gradient-to-br from-dec-blue/10 via-white to-dec-green/10",
    outline: "border-design-border bg-white-surface",
    progress: "border-dec-blue/20 bg-dec-blue/10",
    surface: "border-design-border bg-white/70",
  };
}

function getCourseResourceCount(course: LearnerCourseDetail) {
  return course.modules
    .flatMap((module) => module.lessons)
    .flatMap((lesson) => lesson.blocks)
    .filter((block) => normalizeLearnerBlockType(block.type) === "RESOURCE")
    .length;
}

function ResponsivePill({
  label,
  tone = "blue",
}: {
  label: string;
  tone?: "blue" | "green" | "gray";
}) {
  const toneClasses = {
    blue: "border-[#145a85]/25 bg-[#dceef8] text-[#145a85]",
    green: "border-[#3a6118]/25 bg-[#e8f5d6] text-[#3a6118]",
    gray: "border-slate-200 bg-slate-50 text-slate-600",
  };

  return (
    <span
      className={`inline-flex min-h-7 max-w-full items-center rounded-full border px-3 py-1 text-left text-xs font-semibold leading-snug ${toneClasses[tone]}`}
    >
      {label}
    </span>
  );
}

function ProgressBar({
  inverted = false,
  label,
  value,
}: {
  inverted?: boolean;
  label: string;
  value: number;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-4 text-sm">
        <span className={inverted ? "font-medium text-white/75" : "font-medium text-dark-ink"}>
          {label}
        </span>
        <span className={inverted ? "font-semibold text-white" : "font-semibold text-deep-navy"}>
          {value}%
        </span>
      </div>
      <div
        aria-label={`${label}: ${value}% complete`}
        aria-valuemax={100}
        aria-valuemin={0}
        aria-valuenow={value}
        className={[
          "h-2.5 overflow-hidden rounded-full",
          inverted ? "bg-white/15" : "bg-white/70",
        ].join(" ")}
        role="progressbar"
      >
        <div
          className="h-full rounded-full bg-dec-green"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

function LearnerInstitutionalHeader({ previewMode = false }: { previewMode?: boolean }) {
  return (
    <header className="overflow-hidden rounded-[24px] border border-deep-navy/10 bg-white-surface shadow-soft">
      <div className="flex flex-col gap-3 border-b border-design-border bg-deep-navy px-4 py-3 text-white sm:flex-row sm:items-center sm:justify-between lg:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-control bg-dec-blue text-sm font-bold">
            DEC
          </span>
          <div className="min-w-0">
            <p className="text-sm font-semibold">CSO Learning Hub</p>
            <p className="truncate text-xs text-white/65">
              Participant learning environment
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-white/75">
          {previewMode ? (
            <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1">
              Creator preview
            </span>
          ) : null}
          <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1">
            DEC branded course player
          </span>
        </div>
      </div>
    </header>
  );
}

function CoursePlayerHeader({ course }: { course: LearnerCourseDetail }) {
  const chrome = getTemplateChrome(course.template.templateId);

  return (
    <section className={`overflow-hidden rounded-[28px] border shadow-card ${chrome.header}`}>
      <div className="grid gap-0 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="p-6 lg:p-8">
          <div className="flex flex-wrap gap-2">
            <ResponsivePill label={course.capacityArea} tone="blue" />
            <StatusBadge label={course.statusLabel} tone="green" />
            <StatusBadge label={course.template.templateLabel} tone="gray" />
          </div>
          <h1 className="mt-4 max-w-4xl text-3xl font-semibold leading-tight text-deep-navy sm:text-4xl">
            {course.title}
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-muted-text">
            {course.description}
          </p>
          <dl className="mt-6 grid gap-3 text-sm sm:grid-cols-2">
            <div className="rounded-card border border-dec-blue/15 bg-white/80 p-4 shadow-soft">
              <dt className="font-semibold text-dark-ink">Current module</dt>
              <dd className="mt-1 text-muted-text">{course.currentModule}</dd>
            </div>
            <div className="rounded-card border border-dec-green/20 bg-white/80 p-4 shadow-soft">
              <dt className="font-semibold text-dark-ink">Current lesson</dt>
              <dd className="mt-1 text-muted-text">
                {course.currentLesson}
              </dd>
            </div>
          </dl>
        </div>
        <div className={`border-t p-6 lg:border-l lg:border-t-0 lg:p-8 ${chrome.progress}`}>
          <p className="text-xs font-semibold uppercase text-dec-blue">
            Learning journey
          </p>
          <ProgressBar label="Course progress" value={course.progress} />
          <p className={`mt-4 text-sm leading-6 ${chrome.accentText}`}>
            {course.template.templateSummary}. Continue through the course
            lessons and complete each activity at a steady pace.
          </p>
          <div className="mt-5 flex flex-col gap-3">
            <ActionButton href="#lesson-content" size="lg" variant="primary">
              Continue learning
            </ActionButton>
            <p className="text-xs leading-5 text-muted-text">
              Lessons are completed at lesson level; individual blocks remain part
              of the learning flow.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function CourseOutline({
  baseHref,
  className = "",
  course,
  displayedLessonId,
  finalTestHref,
}: {
  baseHref: string;
  className?: string;
  course: LearnerCourseDetail;
  displayedLessonId?: string;
  finalTestHref: string;
}) {
  const chrome = getTemplateChrome(course.template.templateId);
  const resourceCount = getCourseResourceCount(course);

  return (
    <aside
      aria-label="Course outline"
      className={`overflow-hidden rounded-[24px] border shadow-card lg:sticky lg:top-6 ${chrome.outline} ${className}`}
    >
      <div className="bg-deep-navy p-5 text-white">
        <div>
          <p className="text-xs font-semibold uppercase text-dec-green">
            Course outline
          </p>
          <h2 className="mt-2 text-lg font-semibold leading-snug">
            {course.title}
          </h2>
        </div>
        <div className="mt-5 rounded-card border border-white/10 bg-white/10 p-4">
          <ProgressBar inverted label="Progress" value={course.progress} />
        </div>
      </div>

      <div className="space-y-5 p-5">
      {course.modules.map((module, moduleIndex) => (
  <section
    key={module.id || `${module.title}-${moduleIndex}`}
    aria-labelledby={`course-module-${moduleIndex}`}
    className="rounded-card border border-design-border bg-soft-bg p-4"
  >
            <h3
              className="text-xs font-semibold uppercase leading-5 text-dec-blue"
              id={`course-module-${moduleIndex}`}
            >
              Module {moduleIndex + 1}
            </h3>
            <p className="mt-1 text-sm font-semibold leading-6 text-deep-navy">
              {module.title}
            </p>
            <ol className="mt-4 space-y-3">
              {module.lessons.map((lesson, lessonIndex) => {
                const isCurrent = lesson.id === displayedLessonId;
                const isCompleted = lesson.status === "Completed";
                const isActualCurrent = lesson.status === "Current";

                return (
                  <li key={lesson.id}>
                    <a
                      aria-current={isCurrent ? "step" : undefined}
                      className={[
                        "group block rounded-control border p-3 text-sm transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dec-blue",
                        isCurrent
                          ? "border-dec-blue bg-white text-dark-ink shadow-soft"
                          : "border-transparent bg-white/80 text-muted-text hover:border-dec-blue/30 hover:text-dark-ink",
                      ].join(" ")}
                      href={
                        lesson.id === "final-test"
                          ? finalTestHref
                          : `${baseHref}?lessonId=${lesson.id}`
                      }
                    >
                      <span className="flex items-start gap-3">
                        <span
                          className={[
                            "mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full border text-[11px] font-semibold",
                            isCompleted
                              ? "border-dec-green bg-dec-green text-white"
                              : isActualCurrent
                                ? "border-dec-blue bg-dec-blue text-white"
                                : "border-design-border bg-white text-muted-text group-hover:border-dec-blue/40",
                          ].join(" ")}
                        >
                          {isCompleted ? "✓" : lessonIndex + 1}
                        </span>
                        <span className="min-w-0">
                          <span className="block font-medium leading-6">{lesson.title}</span>
                          <span
                            className={[
                              "mt-1 inline-flex rounded-full px-2 py-1 text-[11px] font-semibold",
                              isCompleted
                                ? "bg-dec-green/15 text-[#426f1c]"
                                : isActualCurrent
                                  ? "bg-dec-blue/10 text-[#216f9d]"
                                  : "bg-white text-muted-text",
                            ].join(" ")}
                          >
                            {lesson.status}
                          </span>
                        </span>
                      </span>
                    </a>
                  </li>
                );
              })}
            </ol>
          </section>
        ))}
      </div>

      <div className="border-t border-design-border p-5">
        <a
          className="block rounded-card border border-dec-blue/25 bg-dec-blue/10 p-4 text-sm font-semibold text-[#145a85] transition hover:border-dec-blue focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dec-blue"
          href="#lesson-content"
        >
          Resources
          <span className="mt-1 block text-xs font-medium text-[#26536c]">
            {resourceCount > 0 ? `${resourceCount} toolkit item${resourceCount === 1 ? "" : "s"} in this course` : "Course resources appear inside lessons."}
          </span>
        </a>
        {course.finalTestQuestions.length > 0 ? (
          <a
            className="mt-3 block rounded-card border border-dec-green/30 bg-dec-green/15 p-4 text-sm font-semibold text-[#365c19] transition hover:border-dec-green focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dec-blue"
            href={finalTestHref}
          >
            Final test
            <span className="mt-1 block text-xs font-medium text-[#426f1c]">
              Available after the required lessons.
            </span>
          </a>
        ) : null}
      </div>
    </aside>
  );
}

function LessonBlock({
  accentClass = "",
  children,
  eyebrow,
  title,
}: {
  accentClass?: string;
  children: React.ReactNode;
  eyebrow: string;
  title: string;
}) {
  return (
    <article className={`overflow-hidden rounded-[28px] border border-design-border bg-white-surface shadow-soft ${accentClass}`}>
      <div className="border-b border-design-border bg-soft-bg/70 px-6 py-4">
        <p className="text-xs font-semibold uppercase text-dec-blue">
          {eyebrow}
        </p>
        <h3 className="mt-2 text-xl font-semibold leading-snug text-dark-ink">
          {title}
        </h3>
      </div>
      <div className="p-6 text-sm leading-7 text-muted-text">{children}</div>
    </article>
  );
}

function LearnerTextContentBlock({
  block,
  templateId,
}: {
  block: LearnerContentBlock;
  templateId: string;
}) {
  const chrome = getTemplateChrome(templateId);
  const heading = getConfigStringAny(block, ["heading", "blockTitle", "title"]);
  const body = getConfigStringAny(block, ["body", "content", "text"]);
  const highlightedNote = getConfigStringAny(block, [
    "highlightedNote",
    "note",
    "highlight",
  ]);
  const pullQuote = getConfigStringAny(block, ["pullQuote", "quote", "statement"]);
  const bulletItems = getConfigArrayAny(block, ["bullets", "bulletItems", "items"])
    .map((item) => (typeof item === "string" ? item.trim() : ""))
    .filter(Boolean);
  const stepItems = getConfigArrayAny(block, ["steps", "numberedSteps"])
    .map((item) => {
      if (typeof item === "string") {
        return item.trim();
      }

      if (item && typeof item === "object") {
        return getRecordString(item as Record<string, unknown>, [
          "label",
          "title",
          "body",
          "text",
        ]);
      }

      return "";
    })
    .filter(Boolean);
  const paragraphs = splitParagraphs(body);

  if (!body && !highlightedNote && !pullQuote && bulletItems.length === 0 && stepItems.length === 0) {
    return null;
  }

  return (
    <LessonBlock
      accentClass={chrome.blockAccent}
      eyebrow={block.typeLabel}
      title={heading || block.title}
    >
      <div className="max-w-3xl space-y-5">
        {paragraphs.map((paragraph, index) => (
          <p
            className={index === 0 ? "text-lg leading-9 text-dark-ink" : "text-base leading-8 text-muted-text"}
            key={`${index}-${paragraph}`}
          >
            {paragraph}
          </p>
        ))}
        {highlightedNote ? (
          <div className="rounded-card border border-dec-blue/20 bg-dec-blue/10 p-5 text-base font-semibold leading-8 text-[#26536c] shadow-soft">
            {highlightedNote}
          </div>
        ) : null}
        {pullQuote ? (
          <blockquote className="rounded-r-card border-l-4 border-dec-green bg-dec-green/10 px-5 py-4 text-lg font-semibold leading-9 text-deep-navy">
            {pullQuote}
          </blockquote>
        ) : null}
        {bulletItems.length > 0 ? (
          <ul className="grid gap-3 sm:grid-cols-2">
            {bulletItems.map((item) => (
              <li className="flex gap-3 rounded-card border border-design-border bg-soft-bg p-4" key={item}>
                <span aria-hidden="true" className="mt-2 size-2 shrink-0 rounded-full bg-dec-green" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        ) : null}
        {stepItems.length > 0 ? (
          <ol className="space-y-3">
            {stepItems.map((item, index) => (
              <li className="flex gap-3" key={item}>
                <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-dec-blue text-xs font-bold text-white">
                  {index + 1}
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ol>
        ) : null}
      </div>
    </LessonBlock>
  );
}

function LearnerKeyMessageContentBlock({
  block,
}: {
  block: LearnerContentBlock;
}) {
  const message = getConfigStringAny(block, ["message", "body", "text", "content"]);
  const supportingText = getConfigStringAny(block, [
    "supportingText",
    "description",
    "guidance",
  ]);
  const style = getKeyMessageStyle(block);

  if (!message) {
    return null;
  }

  return (
    <article
      className={`overflow-hidden rounded-[28px] border shadow-card ${getKeyMessageClasses(style)}`}
    >
      <div className="flex flex-col gap-5 p-6 sm:flex-row sm:items-start">
        <div
          aria-hidden="true"
          className="flex size-14 shrink-0 items-center justify-center rounded-control bg-deep-navy text-2xl font-bold text-white shadow-soft"
        >
          !
        </div>
        <div>
          <p className="text-xs font-semibold uppercase">
            {block.typeLabel}
          </p>
          <h3 className="mt-2 text-2xl font-semibold leading-snug text-deep-navy">
            {message}
          </h3>
          {supportingText ? (
            <p className="mt-3 text-sm leading-7">{supportingText}</p>
          ) : null}
        </div>
      </div>
    </article>
  );
}

function LearnerCaseStudyContentBlock({ block }: { block: LearnerContentBlock }) {
  const context = getConfigString(block, "context");
  const scenario = getConfigStringAny(block, ["scenario", "body", "caseText"]);
  const guidingQuestion = getConfigStringAny(block, [
    "guidingQuestion",
    "question",
    "prompt",
  ]);
  const learningPoint = getConfigString(block, "learningPoint");
  const discussionQuestion = getConfigString(block, "discussionQuestion");

  if (!scenario && !learningPoint) {
    return null;
  }

  return (
    <article className="overflow-hidden rounded-[28px] border border-dec-blue/25 bg-white-surface shadow-soft">
      <div className="bg-dec-blue px-6 py-5 text-white">
        <p className="text-xs font-semibold uppercase text-white/75">
          {block.typeLabel}
        </p>
        <h3 className="mt-2 text-2xl font-semibold leading-snug">
          {block.title}
        </h3>
      </div>
      <div className="p-6">
        {context ? (
          <p className="text-sm font-semibold leading-7 text-[#26536c]">
            {context}
          </p>
        ) : null}
        {scenario ? (
          <div className="mt-4 rounded-card border border-dec-blue/15 bg-dec-blue/5 p-5 text-sm leading-7 text-dark-ink">
            {splitParagraphs(scenario).map((paragraph, index) => (
              <p key={`${index}-${paragraph}`}>{paragraph}</p>
            ))}
          </div>
        ) : null}
        {guidingQuestion ? (
          <div className="mt-5 rounded-card border border-dec-blue/25 bg-white p-4">
            <p className="text-xs font-semibold uppercase text-dec-blue">
              Guiding question
            </p>
            <p className="mt-2 text-sm font-semibold leading-7 text-deep-navy">
              {guidingQuestion}
            </p>
          </div>
        ) : null}
        {learningPoint ? (
          <div className="mt-5 rounded-card border border-dec-green/30 bg-dec-green/15 p-4">
            <p className="text-xs font-semibold uppercase text-[#426f1c]">
              Learning point
            </p>
            <p className="mt-2 text-sm font-semibold leading-7 text-[#365c19]">
              {learningPoint}
            </p>
          </div>
        ) : null}
        {discussionQuestion ? (
          <p className="mt-5 text-sm leading-7 text-muted-text">
            {discussionQuestion}
          </p>
        ) : null}
      </div>
    </article>
  );
}

function LearnerResourceContentBlock({
  block,
  templateId,
}: {
  block: LearnerContentBlock;
  templateId: string;
}) {
  const chrome = getTemplateChrome(templateId);
  const title = getConfigString(block, "title") || block.title;
  const description = getConfigString(block, "description");
  const sourceUrl = getConfigStringAny(block, ["sourceUrl", "fileUrl", "url"]);
  const sourceType = getResourceSourceType(block);
  const resourceType = getResourceType(block);
  const fileName = getConfigString(block, "fileName");
  const fileSizeLabel = getConfigString(block, "fileSizeLabel");
  const buttonLabel =
    getConfigStringAny(block, ["buttonLabel", "downloadLabel", "label"]) ||
    (sourceType === "uploaded_file" ? "Download resource" : "Open resource");

  if (!sourceUrl) {
    return null;
  }

  return (
    <article className={`overflow-hidden rounded-[28px] border bg-white-surface shadow-soft ${chrome.blockAccent} ${getTemplateVisualKind(templateId) === "toolkit" ? "border-dec-green/30" : "border-design-border"}`}>
      <div className="border-b border-dec-green/20 bg-dec-green/10 px-6 py-4">
        <p className="text-xs font-semibold uppercase text-[#426f1c]">
          Toolkit resource
        </p>
      </div>
      <div className="p-6">
      <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
        <div className="flex min-w-0 gap-4">
          <div
            aria-hidden="true"
            className="flex size-16 shrink-0 items-center justify-center rounded-control border border-dec-green/25 bg-dec-green/15 text-sm font-bold uppercase text-[#365c19]"
          >
            {formatResourceType(resourceType).slice(0, 3)}
          </div>
          <div className="min-w-0">
          <div className="flex flex-wrap gap-2">
            <StatusBadge label={block.typeLabel} tone="blue" />
            <StatusBadge label={formatResourceType(resourceType)} tone="gray" />
          </div>
          <h3 className="mt-4 text-xl font-semibold leading-snug text-dark-ink">
            {title}
          </h3>
          {description ? (
            <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-text">
              {description}
            </p>
          ) : null}
          <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold text-muted-text">
            <span>
              {sourceType === "uploaded_file" ? "File reference" : "External link"}
            </span>
            {fileName ? <span>{fileName}</span> : null}
            {fileSizeLabel ? <span>{fileSizeLabel}</span> : null}
          </div>
          </div>
        </div>
        <a
          className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-control bg-dec-blue px-4 py-3 text-sm font-semibold text-white transition hover:bg-deep-navy focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dec-blue"
          href={sourceUrl}
          rel={sourceType === "external_link" ? "noreferrer" : undefined}
          target={sourceType === "external_link" ? "_blank" : undefined}
        >
          {buttonLabel}
        </a>
      </div>
      </div>
    </article>
  );
}

function LearnerExternalLinkContentBlock({ block }: { block: LearnerContentBlock }) {
  const title = getConfigString(block, "title") || block.title;
  const url = getConfigString(block, "url");
  const description = getConfigString(block, "description");
  const buttonLabel = getConfigStringAny(block, ["buttonLabel", "label"]) || "Open link";
  const openInNewTab = getConfigBoolean(block, "openInNewTab", true);

  if (!url) {
    return null;
  }

  return (
    <article className="rounded-[28px] border border-dec-blue/20 bg-white-surface p-6 shadow-soft">
      <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0">
          <StatusBadge label={block.typeLabel} tone="blue" />
          <h3 className="mt-4 text-xl font-semibold leading-snug text-dark-ink">
            {title}
          </h3>
          {description ? (
            <p className="mt-3 text-sm leading-7 text-muted-text">
              {description}
            </p>
          ) : null}
        </div>
        <a
          className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-control bg-dec-blue px-4 py-3 text-sm font-semibold text-white transition hover:bg-deep-navy focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dec-blue"
          href={url}
          rel={openInNewTab ? "noreferrer" : undefined}
          target={openInNewTab ? "_blank" : undefined}
        >
          {buttonLabel}
        </a>
      </div>
    </article>
  );
}

function LearnerImageContentBlock({ block }: { block: LearnerContentBlock }) {
  const title = getConfigString(block, "title") || block.title;
  const imageUrl = getConfigStringAny(block, ["imageUrl", "url", "sourceUrl"]);
  const altText =
    getConfigStringAny(block, ["altText", "alt", "description"]) ||
    `Course visual: ${title}`;
  const caption = getConfigString(block, "caption");
  const displaySize = getImageDisplaySize(block);

  if (!imageUrl || !altText) {
    return null;
  }

  return (
    <figure
      className={[
        "overflow-hidden rounded-[28px] border border-design-border bg-white-surface shadow-soft",
        displaySize === "wide" ? "lg:-mx-4" : "",
      ].join(" ")}
    >
      <div className="overflow-hidden border-b border-design-border bg-soft-bg">
        {/* eslint-disable-next-line @next/next/no-img-element -- Course content may reference arbitrary external media URLs. */}
        <img
          alt={altText}
          className="max-h-[520px] w-full object-cover"
          src={imageUrl}
        />
      </div>
      <figcaption className="p-5">
        <p className="text-xs font-semibold uppercase text-dec-blue">
          Visual example
        </p>
        {title ? (
          <h3 className="mt-2 text-xl font-semibold leading-snug text-dark-ink">
            {title}
          </h3>
        ) : null}
        {caption ? (
          <p className="mt-2 text-sm leading-7 text-muted-text">
            {caption}
          </p>
        ) : null}
      </figcaption>
    </figure>
  );
}
function encodeVideoUrl(url: string): string {
  try {
    // If it's an absolute URL, return as-is
    if (/^https?:\/\//i.test(url)) return url;
    // Split path into segments and encode each part
    return url.split('/').map(segment => encodeURIComponent(segment)).join('/');
  } catch {
    return url;
  }
}
function LearnerVideoContentBlock({ block }: { block: LearnerContentBlock }) {
  const title = getConfigString(block, "title") || block.title;
  const description = getConfigString(block, "description");
  const sourceType = getVideoSourceType(block);
  const sourceUrl = getConfigStringAny(block, ["sourceUrl", "videoUrl", "url"]);
  const thumbnailUrl = getConfigString(block, "thumbnailUrl");
  const transcript = getConfigString(block, "transcript");
  const captionsAvailable = getBlockConfig(block).captionsAvailable === true;
  const durationMinutes =
    getConfigNumberAny(block, ["durationMinutes", "duration"]) ??
    block.estimatedDurationMinutes;
    console.log('Video sourceUrl:', sourceUrl);
  if (!sourceUrl) {
    return null;
  }

  return (
    <article className="overflow-hidden rounded-[28px] border border-design-border bg-white-surface shadow-soft">
      <div className="bg-deep-navy px-6 py-4 text-white">
        <p className="text-xs font-semibold uppercase text-white/70">
          Media lesson
        </p>
        <h3 className="mt-2 text-xl font-semibold leading-snug">
          {title}
        </h3>
      </div>
      <div className="p-6">
      <div className="flex flex-wrap gap-2">
        <StatusBadge label={block.typeLabel} tone="blue" />
        <StatusBadge label={formatVideoSourceType(sourceType)} tone="gray" />
        {durationMinutes ? (
          <StatusBadge label={`${durationMinutes} minutes`} tone="green" />
        ) : null}
        <StatusBadge
          label={captionsAvailable ? "Captions available" : "Captions not confirmed"}
          tone={captionsAvailable ? "green" : "orange"}
        />
      </div>
      {description ? (
        <p className="mt-3 text-sm leading-7 text-muted-text">{description}</p>
      ) : null}

      {sourceType === "embed_url" ? (
        <div className="mt-5 overflow-hidden rounded-[18px] border border-design-border bg-soft-bg">
          <iframe
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="aspect-video w-full"
            src={getEmbedUrl(sourceUrl)} // FIXED: convert watch URL to embed URL
            title={title}
          />
        </div>
      ) : sourceType === "uploaded_file" ? (
        <div className="mt-5 overflow-hidden rounded-[18px] border border-design-border bg-soft-bg">
          <video
  className="aspect-video w-full bg-black"
  controls
  poster={thumbnailUrl || undefined}
  src={encodeVideoUrl(sourceUrl)}
>
  {transcript}
</video>
        </div>
      ) : (
        <div className="mt-5 rounded-card border border-design-border bg-soft-bg p-5">
          {thumbnailUrl ? (
            /* eslint-disable-next-line @next/next/no-img-element -- Course content may reference arbitrary external media URLs. */
            <img
              alt=""
              className="mb-4 aspect-video w-full rounded-control object-cover"
              src={thumbnailUrl}
            />
          ) : null}
          <a
            className="inline-flex min-h-11 items-center justify-center rounded-control bg-dec-blue px-4 py-3 text-sm font-semibold text-white transition hover:bg-deep-navy focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dec-blue"
            href={sourceUrl}
            rel="noreferrer"
            target="_blank"
          >
            Open video
          </a>
        </div>
      )}

      {transcript ? (
        <details className="mt-5 rounded-card border border-design-border bg-soft-bg p-4">
          <summary className="cursor-pointer text-sm font-semibold text-dark-ink">
            Transcript
          </summary>
          <div className="mt-3 space-y-4 text-sm leading-7 text-muted-text">
            {splitParagraphs(transcript).map((paragraph, index) => (
              <p key={`${index}-${paragraph}`}>{paragraph}</p>
            ))}
          </div>
        </details>
      ) : null}
      </div>
    </article>
  );
}

function LearnerAudioContentBlock({ block }: { block: LearnerContentBlock }) {
  const title = getConfigString(block, "title") || block.title;
  const description = getConfigString(block, "description");
  const sourceUrl = getConfigStringAny(block, ["sourceUrl", "audioUrl", "url"]);
  const transcript = getConfigString(block, "transcript");
  const durationMinutes =
    getConfigNumberAny(block, ["durationMinutes", "duration"]) ??
    block.estimatedDurationMinutes;

  if (!sourceUrl) {
    return null;
  }

  return (
    <article className="rounded-[28px] border border-design-border bg-white-surface p-6 shadow-soft">
      <div className="flex flex-wrap gap-2">
        <StatusBadge label="Audio" tone="blue" />
        {durationMinutes ? (
          <StatusBadge label={`${durationMinutes} minutes`} tone="green" />
        ) : null}
      </div>
      <h3 className="mt-4 text-xl font-semibold leading-snug text-dark-ink">
        {title}
      </h3>
      {description ? (
        <p className="mt-3 text-sm leading-7 text-muted-text">{description}</p>
      ) : null}
      <div className="mt-5 rounded-card border border-design-border bg-soft-bg p-4">
        <audio className="w-full" controls src={sourceUrl}>
          {transcript}
        </audio>
      </div>
      {transcript ? (
        <details className="mt-5 rounded-card border border-design-border bg-soft-bg p-4">
          <summary className="cursor-pointer text-sm font-semibold text-dark-ink">
            Transcript
          </summary>
          <div className="mt-3 space-y-4 text-sm leading-7 text-muted-text">
            {splitParagraphs(transcript).map((paragraph, index) => (
              <p key={`${index}-${paragraph}`}>{paragraph}</p>
            ))}
          </div>
        </details>
      ) : null}
    </article>
  );
}

function LearnerAccordionContentBlock({
  block,
}: {
  block: LearnerContentBlock;
}) {
  const title = getConfigString(block, "title") || block.title;
  const introduction = getConfigString(block, "introduction");
  const items = getAccordionItems(block);
  const allowMultipleOpen = getConfigBoolean(block, "allowMultipleOpen", true);

  if (items.length === 0) {
    return null;
  }

  return (
    <article className="overflow-hidden rounded-[28px] border border-dec-blue/20 bg-white-surface shadow-soft">
      <div className="border-b border-dec-blue/15 bg-dec-blue/10 px-6 py-4">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-dec-blue">
        {block.typeLabel}
      </p>
      <h3 className="mt-2 text-xl font-semibold leading-snug text-dark-ink">
        {title}
      </h3>
      </div>
      <div className="p-6">
      {introduction ? (
        <p className="mt-3 text-sm leading-7 text-muted-text">{introduction}</p>
      ) : null}
      <div className="mt-5 space-y-3">
        {items.map((item, index) => (
          <details
            className="group rounded-card border border-design-border bg-soft-bg p-4 transition open:border-dec-blue/35 open:bg-white open:shadow-soft"
            key={item.id}
            name={allowMultipleOpen ? undefined : `accordion-${block.id}`}
            open={index === 0}
          >
            <summary className="flex cursor-pointer items-center justify-between gap-4 text-sm font-semibold leading-6 text-dark-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dec-blue">
              <span>{item.title}</span>
              <span className="shrink-0 rounded-full bg-white px-2 py-1 text-[11px] font-semibold text-dec-blue group-open:bg-dec-blue/10">
                Expand
              </span>
            </summary>
            <div className="mt-3 space-y-4 text-sm leading-7 text-muted-text">
              {splitParagraphs(item.body).map((paragraph, paragraphIndex) => (
                <p key={`${paragraphIndex}-${paragraph}`}>{paragraph}</p>
              ))}
            </div>
          </details>
        ))}
      </div>
      </div>
    </article>
  );
}

function LearnerFlashcardsContentBlock({
  block,
}: {
  block: LearnerContentBlock;
}) {
  const title = getConfigString(block, "title") || block.title;
  const instructions = getConfigString(block, "instructions");
  const cards = getFlashcards(block);
  const displayMode = getFlashcardDisplayMode(block);

  if (cards.length === 0) {
    return null;
  }

  return (
    <article className="overflow-hidden rounded-[28px] border border-dec-green/25 bg-white-surface shadow-soft">
      <div className="border-b border-dec-green/20 bg-dec-green/10 px-6 py-4">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-dec-blue">
        {block.typeLabel}
      </p>
      <h3 className="mt-2 text-xl font-semibold leading-snug text-dark-ink">
        {title}
      </h3>
      </div>
      <div className="p-6">
      {instructions ? (
        <p className="mt-3 text-sm leading-7 text-muted-text">{instructions}</p>
      ) : null}
      <div
        className={
          displayMode === "stack"
            ? "mt-5 grid gap-4"
            : "mt-5 grid gap-4 md:grid-cols-2"
        }
      >
        {cards.map((card, index) => (
          <details
            className="group rounded-card border border-design-border bg-soft-bg p-5 transition open:border-dec-green/35 open:bg-white open:shadow-soft"
            key={card.id}
          >
            <summary className="cursor-pointer list-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dec-blue">
              <span className="block text-xs font-semibold uppercase tracking-[0.12em] text-dec-blue">
                Card {index + 1} front
              </span>
              <span className="mt-3 block text-sm font-semibold leading-7 text-dark-ink">
                {card.front}
              </span>
              <span className="mt-3 inline-flex rounded-control border border-dec-blue/20 bg-white px-3 py-2 text-xs font-semibold text-dec-blue group-open:border-dec-green/25 group-open:text-[#365c19]">
                Reveal back
              </span>
            </summary>
            <div className="mt-4 rounded-control border border-dec-blue/25 bg-white p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-dec-blue">
                Back
              </p>
              <div className="mt-2 space-y-4 text-sm leading-7 text-deep-navy">
                {splitParagraphs(card.back).map((paragraph, paragraphIndex) => (
                  <p key={`${paragraphIndex}-${paragraph}`}>{paragraph}</p>
                ))}
              </div>
            </div>
          </details>
        ))}
      </div>
      </div>
    </article>
  );
}

function LearnerKnowledgeCheckContentBlock({
  block,
  templateId,
}: {
  block: LearnerContentBlock;
  templateId: string;
}) {
  const isAssessment = getTemplateVisualKind(templateId) === "assessment";
  const question = getConfigStringAny(block, [
    "question",
    "questionText",
    "statement",
    "prompt",
  ]);
  const helperText = getConfigStringAny(block, ["helperText", "hint", "guidance"]);
  const correctFeedback = getConfigString(block, "correctFeedback");
  const incorrectFeedback = getConfigString(block, "incorrectFeedback");
  const retryAllowed = getConfigBoolean(block, "retryAllowed", true);
  const options = getKnowledgeCheckOptions(block);

  if (!question || options.length < 2 || !options.some((option) => option.isCorrect)) {
    return null;
  }

  return (
    <article
      className={[
        "overflow-hidden rounded-[28px] border border-l-4 border-l-[#8B5CF6] bg-white-surface shadow-soft",
        isAssessment ? "border-[#ddd6fe] bg-[#fcfbff]" : "border-design-border",
      ].join(" ")}
    >
      <div className="border-b border-[#ddd6fe] bg-[#f5f3ff] px-6 py-4">
      <div className="flex flex-wrap gap-2">
        <StatusBadge label={block.typeLabel} tone="blue" />
        <StatusBadge label="Practice" tone="gray" />
        <StatusBadge label="Ungraded" tone="green" />
      </div>
      <h3 className="mt-4 text-xl font-semibold leading-snug text-dark-ink">
        {question}
      </h3>
      </div>
      <div className="p-6">
      {helperText ? (
        <p className="mt-3 text-sm leading-7 text-muted-text">{helperText}</p>
      ) : null}
      <KnowledgeCheckInteraction
        correctFeedback={correctFeedback}
        incorrectFeedback={incorrectFeedback}
        options={options}
        questionId={block.id}
        retryAllowed={retryAllowed}
      />
      </div>
    </article>
  );
}

function LearnerBranchingScenarioContentBlock({
  block,
  templateId,
}: {
  block: LearnerContentBlock;
  templateId: string;
}) {
  const isPractice = getTemplateVisualKind(templateId) === "practice";
  const scenarioContext =
    getConfigString(block, "context") || getConfigString(block, "scenario");
  const decisionQuestion = getConfigStringAny(block, [
    "decisionQuestion",
    "decisionPrompt",
    "prompt",
    "question",
  ]);
  const choices = getBranchingChoices(block);
  const learningPoint = getConfigString(block, "learningPoint");
  const allowRetry = getConfigBoolean(block, "allowRetry", true);

  if (!scenarioContext || !decisionQuestion || choices.length < 2) {
    return null;
  }

  return (
    <article
      className={[
        "overflow-hidden rounded-[28px] border border-l-4 border-l-dec-blue bg-white-surface shadow-soft",
        isPractice ? "border-dec-blue/25 bg-[#f8fcff]" : "border-design-border",
      ].join(" ")}
    >
      <div className="bg-deep-navy px-6 py-5 text-white">
      <div className="flex flex-wrap gap-2">
        <StatusBadge label={block.typeLabel} tone="blue" />
        <StatusBadge label="Decision practice" tone="gray" />
        <StatusBadge label="Ungraded" tone="green" />
      </div>
      <h3 className="mt-4 text-2xl font-semibold leading-snug">
        {block.title}
      </h3>
      </div>
      <div className="p-6">
      <div className="rounded-card border border-dec-blue/20 bg-dec-blue/5 p-5 shadow-soft">
        <p className="text-xs font-semibold uppercase text-dec-blue">
          Scenario
        </p>
        <div className="mt-2 space-y-4 text-sm leading-7 text-dark-ink">
          {splitParagraphs(scenarioContext).map((paragraph, index) => (
            <p key={`${index}-${paragraph}`}>{paragraph}</p>
          ))}
        </div>
      </div>
      <p className="mt-5 text-base font-semibold leading-7 text-deep-navy">
        {decisionQuestion}
      </p>
      <BranchingScenarioInteraction
        allowRetry={allowRetry}
        choices={choices}
        learningPoint={learningPoint}
      />
      </div>
    </article>
  );
}

function LearnerReflectionContentBlock({ block }: { block: LearnerContentBlock }) {
  const question = getConfigStringAny(block, ["question", "prompt"]);
  const guidanceText = getConfigStringAny(block, ["guidanceText", "guidance"]);
  const responseMode = (getConfigString(block, "responseMode") || "thinking_only") as "thinking_only" | "private_note";
  const privacyNote = getConfigString(block, "privacyNote");

  if (!question) {
    return null;
  }

  return (
    <article className="rounded-[28px] border border-dec-blue/20 bg-white-surface p-6 shadow-soft">
      <div className="flex flex-wrap gap-2">
        <StatusBadge label="Reflection" tone="blue" />
        <StatusBadge label="Ungraded" tone="gray" />
      </div>

      <h3 className="mt-4 text-lg font-semibold leading-snug text-dark-ink">
        {question}
      </h3>

      <ReflectionInteraction
        guidanceText={guidanceText}
        privacyNote={privacyNote}
        responseMode={responseMode}
      />
    </article>
  );
}

function LearnerPracticalActivityContentBlock({
  block,
  siblingBlocks = [],
  templateId,
}: {
  block: LearnerContentBlock;
  siblingBlocks?: LearnerContentBlock[];
  templateId: string;
}) {
  const isPractice = getTemplateVisualKind(templateId) === "practice";
  const title = getConfigString(block, "title") || block.title;
  const taskInstructions = getConfigStringAny(block, [
    "taskInstructions",
    "instruction",
  ]);
  const expectedOutput = getConfigString(block, "expectedOutput");
  const estimatedTimeMinutes = getConfigNumber(block, "estimatedTimeMinutes");
  const estimatedDurationMinutes =
    estimatedTimeMinutes ?? getConfigNumber(block, "estimatedDurationMinutes");
  const materialsNeeded = getConfigString(block, "materialsNeeded");
  const linkedResourceBlockId = getConfigString(block, "linkedResourceBlockId");
  const completionGuidance = getConfigStringAny(block, [
    "completionGuidance",
    "guidance",
  ]);

  if (!taskInstructions) {
    return null;
  }

  // Find the linked resource block in the siblings
  const linkedResourceBlock = linkedResourceBlockId
    ? siblingBlocks.find((s) => s.id === linkedResourceBlockId)
    : null;
  const resourceUrl = linkedResourceBlock ? getConfigString(linkedResourceBlock, "sourceUrl") : null;
  const resourceTitle = linkedResourceBlock ? (getConfigString(linkedResourceBlock, "title") || linkedResourceBlock.title) : null;
  const resourceSourceType = linkedResourceBlock ? getResourceSourceType(linkedResourceBlock) : null;
  const resourceButtonLabel = linkedResourceBlock
    ? getConfigString(linkedResourceBlock, "buttonLabel") ||
      (resourceSourceType === "uploaded_file" ? "Download resource" : "Open resource")
    : null;

  return (
    <article
      className={[
        "overflow-hidden rounded-[28px] border border-l-4 border-l-dec-green bg-white-surface shadow-soft",
        isPractice ? "border-dec-green/30 bg-[#fbfff7]" : "border-design-border",
      ].join(" ")}
    >
      <div className="border-b border-dec-green/20 bg-dec-green/10 px-6 py-4">
      <div className="flex flex-wrap gap-2">
        <StatusBadge label="Practical Activity" tone="blue" />
        <StatusBadge label="Applied exercise" tone="gray" />
        {estimatedDurationMinutes ? (
          <StatusBadge label={`${estimatedDurationMinutes} min`} tone="gray" />
        ) : null}
      </div>

      <h3 className="mt-4 text-xl font-semibold leading-snug text-dark-ink">
        {title}
      </h3>
      </div>

      <div className="p-6">
      <div className="space-y-4 text-sm leading-7 text-muted-text">
        {splitParagraphs(taskInstructions).map((paragraph, index) => (
          <p key={`${index}-${paragraph}`}>{paragraph}</p>
        ))}
      </div>

      {expectedOutput ? (
        <div className="mt-5 rounded-card border border-dec-green/25 bg-white p-4 text-sm leading-6 shadow-soft">
          <p className="font-semibold text-dark-ink mb-1">Expected Output</p>
          <p className="text-muted-text">{expectedOutput}</p>
        </div>
      ) : null}

      {materialsNeeded ? (
        <div className="mt-4 rounded-card border border-design-border bg-soft-bg p-4 text-sm leading-6">
          <p className="font-semibold text-dark-ink mb-1">Materials Needed</p>
          <p className="text-muted-text">{materialsNeeded}</p>
        </div>
      ) : null}

      {resourceUrl ? (
        <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-card border border-dec-blue/20 bg-dec-blue/5 p-4">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-dec-blue">
              Activity Attachment
            </p>
            <p className="mt-1 text-sm font-semibold text-dark-ink truncate">
              {resourceTitle}
            </p>
          </div>
          <a
            className="inline-flex min-h-10 shrink-0 items-center justify-center rounded-control bg-dec-blue px-4 py-2 text-sm font-semibold text-white transition hover:bg-deep-navy focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dec-blue"
            href={resourceUrl}
            rel={resourceSourceType === "external_link" ? "noreferrer" : undefined}
            target={resourceSourceType === "external_link" ? "_blank" : undefined}
          >
            {resourceButtonLabel}
          </a>
        </div>
      ) : null}

      {completionGuidance ? (
        <div className="mt-5 rounded-card border border-dec-green/20 bg-dec-green/5 p-4 text-sm leading-6">
          <p className="font-semibold text-[#365c19] mb-1">Completion Guidance</p>
          <p className="text-muted-text">{completionGuidance}</p>
        </div>
      ) : null}
      </div>
    </article>
  );
}

function LearnerButtonCtaContentBlock({ block }: { block: LearnerContentBlock }) {
  const title = getConfigString(block, "title") || block.title;
  const description = getConfigString(block, "description");
  const label = getConfigStringAny(block, ["label", "buttonLabel"]) || "Open resource";
  const targetUrl = getConfigStringAny(block, ["targetUrl", "url", "href"]);

  if (!targetUrl) {
    return null;
  }

  return (
    <article className="rounded-[24px] border border-dec-blue/20 bg-dec-blue/10 p-6 shadow-soft">
      <StatusBadge label="Action" tone="blue" />
      <h3 className="mt-4 text-xl font-semibold leading-snug text-deep-navy">
        {title}
      </h3>
      {description ? (
        <p className="mt-3 text-sm leading-7 text-[#26536c]">{description}</p>
      ) : null}
      <div className="mt-5">
        <a
          className="inline-flex min-h-11 items-center justify-center rounded-control bg-dec-blue px-4 py-3 text-sm font-semibold text-white transition hover:bg-deep-navy focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dec-blue"
          href={targetUrl}
        >
          {label}
        </a>
      </div>
    </article>
  );
}

function LearnerSafeFallbackContentBlock({ block }: { block: LearnerContentBlock }) {
  return (
    <article className="rounded-[24px] border border-design-border bg-white-surface p-6 shadow-soft">
      <div className="flex flex-wrap gap-2">
        <StatusBadge label={block.typeLabel || "Learning activity"} tone="gray" />
        {block.estimatedDurationMinutes ? (
          <StatusBadge label={`${block.estimatedDurationMinutes} min`} tone="gray" />
        ) : null}
      </div>
      <h3 className="mt-4 text-xl font-semibold leading-snug text-dark-ink">
        {block.title || "Learning activity"}
      </h3>
      <p className="mt-3 text-sm leading-7 text-muted-text">
        This learning activity is being prepared for participants. You can continue
        to the next lesson item.
      </p>
    </article>
  );
}

function LearnerConfiguredContentBlock({
  block,
  siblingBlocks = [],
  templateId,
}: {
  block: LearnerContentBlock;
  siblingBlocks?: LearnerContentBlock[];
  templateId: string;
}) {
  let rendered: React.ReactNode = null;
  const blockType = normalizeLearnerBlockType(block.type);

  if (blockType === "TEXT") {
    rendered = <LearnerTextContentBlock block={block} templateId={templateId} />;
  } else if (blockType === "KEY_MESSAGE") {
    rendered = <LearnerKeyMessageContentBlock block={block} />;
  } else if (blockType === "CASE_STUDY") {
    rendered = <LearnerCaseStudyContentBlock block={block} />;
  } else if (blockType === "RESOURCE") {
    rendered = <LearnerResourceContentBlock block={block} templateId={templateId} />;
  } else if (blockType === "EXTERNAL_LINK") {
    rendered = <LearnerExternalLinkContentBlock block={block} />;
  } else if (blockType === "IMAGE") {
    rendered = <LearnerImageContentBlock block={block} />;
  } else if (blockType === "VIDEO") {
    rendered = <LearnerVideoContentBlock block={block} />;
  } else if (blockType === "AUDIO") {
    rendered = <LearnerAudioContentBlock block={block} />;
  } else if (blockType === "ACCORDION") {
    rendered = <LearnerAccordionContentBlock block={block} />;
  } else if (blockType === "FLASHCARD") {
    rendered = <LearnerFlashcardsContentBlock block={block} />;
  } else if (blockType === "KNOWLEDGE_CHECK") {
    rendered = <LearnerKnowledgeCheckContentBlock block={block} templateId={templateId} />;
  } else if (blockType === "BRANCHING_SCENARIO") {
    rendered = <LearnerBranchingScenarioContentBlock block={block} templateId={templateId} />;
  } else if (blockType === "REFLECTION_PROMPT") {
    rendered = <LearnerReflectionContentBlock block={block} />;
  } else if (blockType === "PRACTICAL_ACTIVITY_PROMPT") {
    rendered = (
      <LearnerPracticalActivityContentBlock
        block={block}
        siblingBlocks={siblingBlocks}
        templateId={templateId}
      />
    );
  } else if (blockType === "BUTTON_CTA") {
    rendered = <LearnerButtonCtaContentBlock block={block} />;
  }

  return rendered ?? <LearnerSafeFallbackContentBlock block={block} />;
}

function PreviewLessonNavigation({
  nextLessonHref,
  prevLessonHref,
}: {
  nextLessonHref?: string;
  prevLessonHref?: string;
}) {
  return (
    <nav
      aria-label="Preview lesson navigation"
      className="rounded-[24px] border border-design-border bg-white-surface p-5 shadow-soft"
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm font-semibold text-dark-ink">Lesson navigation</p>
          <p className="mt-1 text-sm leading-6 text-muted-text">
            Move through the course preview without changing participant progress.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          {prevLessonHref ? (
            <ActionButton href={prevLessonHref} variant="secondary">
              Previous lesson
            </ActionButton>
          ) : (
            <ActionButton disabled type="button" variant="secondary">
              Previous lesson
            </ActionButton>
          )}
          {nextLessonHref ? (
            <ActionButton href={nextLessonHref} variant="secondary">
              Next lesson
            </ActionButton>
          ) : (
            <ActionButton disabled type="button" variant="secondary">
              Next lesson
            </ActionButton>
          )}
        </div>
      </div>
    </nav>
  );
}

function LessonContent({
  baseHref,
  course,
  displayedLessonId,
  finalTestHref,
  previewMode = false,
}: {
  baseHref: string;
  course: LearnerCourseDetail;
  displayedLessonId?: string;
  finalTestHref: string;
  previewMode?: boolean;
}) {
  const chrome = getTemplateChrome(course.template.templateId);
  const allLessons = course.modules.flatMap((module) => module.lessons);
  const displayedLesson =
    allLessons.find((lesson) => lesson.id === displayedLessonId) ??
    allLessons.find((lesson) => lesson.status === "Current") ??
    course.modules[0]?.lessons[0] ??
    null;

  const configuredBlocks =
    displayedLesson?.blocks.filter(isStageOneLearnerBlock) ?? [];
  const lessonDescription = displayedLesson?.description || course.description;
  const displayedModuleIndex = course.modules.findIndex((module) =>
    module.lessons.some((lesson) => lesson.id === displayedLesson?.id),
  );
  const displayedModule =
    displayedModuleIndex >= 0 ? course.modules[displayedModuleIndex] : null;
  const displayedLessonIndex =
    displayedModule?.lessons.findIndex((lesson) => lesson.id === displayedLesson?.id) ?? -1;

  const idx = allLessons.findIndex((l) => l.id === displayedLesson?.id);
  const prevLesson = idx > 0 ? allLessons[idx - 1] : null;
  const nextLesson = idx < allLessons.length - 1 ? allLessons[idx + 1] : null;

  const prevLessonHref = prevLesson ? `${baseHref}?lessonId=${prevLesson.id}` : undefined;
  const nextLessonHref = nextLesson
    ? `${baseHref}?lessonId=${nextLesson.id}`
    : finalTestHref;

  // Map lesson status to appropriate badge tone
  const currentStatus = displayedLesson?.status ?? "Next";
  const badgeLabels = {
    Completed: "Completed",
    Current: "Current lesson",
    Next: "Next lesson",
  };
  const badgeTones = {
    Completed: "green" as const,
    Current: "blue" as const,
    Next: "gray" as const,
  };

  return (
    <section
      aria-labelledby="lesson-title"
      className={`min-w-0 overflow-hidden rounded-[28px] border shadow-card ${chrome.surface}`}
      id="lesson-content"
    >
      <div className="bg-deep-navy text-white">
        <div className="grid gap-0 lg:grid-cols-[minmax(0,1fr)_220px]">
          <div className="p-6 lg:p-8">
            <div className="flex flex-wrap gap-2">
              <StatusBadge
                label={badgeLabels[currentStatus]}
                tone={badgeTones[currentStatus]}
              />
              {displayedModule ? (
                <StatusBadge
                  label={`Module ${displayedModuleIndex + 1}`}
                  tone="gray"
                />
              ) : null}
            </div>
            <p className="mt-6 text-sm font-semibold text-dec-green">
              {displayedModule?.title ?? course.currentModule}
            </p>
            <h2
              className="mt-3 text-3xl font-semibold leading-tight sm:text-4xl"
              id="lesson-title"
            >
              {displayedLesson?.title ?? course.currentLesson}
            </h2>
            <p className="mt-4 max-w-3xl text-base leading-8 text-white/75">
              {lessonDescription}
            </p>
          </div>
          <div className="border-t border-white/10 bg-dec-blue p-6 text-white lg:border-l lg:border-t-0">
            <p className="text-xs font-semibold uppercase text-white/70">
              Lesson position
            </p>
            <p className="mt-3 text-3xl font-semibold">
              {displayedLessonIndex >= 0 ? displayedLessonIndex + 1 : 1}
              <span className="text-base font-medium text-white/70">
                /{displayedModule?.lessons.length ?? allLessons.length}
              </span>
            </p>
            <p className="mt-3 text-sm leading-6 text-white/75">
              Follow the sections below, then continue when the lesson is complete.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white/70 px-4 py-5 sm:px-6 lg:px-8">
        <div className="rounded-card border border-design-border bg-white-surface px-5 py-4 shadow-soft">
          <p className="text-xs font-semibold uppercase text-dec-blue">
            Lesson sections
          </p>
          <p className="mt-1 text-sm leading-6 text-muted-text">
            Content is arranged as a vertical course page with reading,
            interaction, practice, and resources clearly separated.
          </p>
        </div>
      </div>

      <div className="space-y-6 px-4 pb-6 sm:px-6 lg:px-8">
        {configuredBlocks.length > 0 ? (
          configuredBlocks.map((block, blockIndex) => (
            <div className="relative" key={block.id}>
              <div className="mb-3 flex flex-wrap items-center gap-3">
                <span className="inline-flex size-9 items-center justify-center rounded-full bg-dec-blue text-xs font-bold text-white shadow-soft">
                  {String(blockIndex + 1).padStart(2, "0")}
                </span>
                <span className="rounded-full border border-design-border bg-white px-3 py-1 text-xs font-semibold text-muted-text">
                  {block.typeLabel}
                </span>
              </div>
              <LearnerConfiguredContentBlock
                block={block}
                siblingBlocks={displayedLesson?.blocks}
                templateId={course.template.templateId}
              />
            </div>
          ))
        ) : (
          <article className="rounded-[24px] border border-design-border bg-white-surface p-6 shadow-soft">
            <StatusBadge label="Lesson content" tone="gray" />
            <h3 className="mt-4 text-xl font-semibold leading-snug text-dark-ink">
              No lesson blocks have been added yet
            </h3>
            <p className="mt-3 text-sm leading-7 text-muted-text">
              The course team is preparing this lesson content. You can continue
              through the outline when the remaining learning activities are ready.
            </p>
          </article>
        )}
      </div>

      <div className="border-t border-design-border bg-white px-4 py-5 sm:px-6 lg:px-8">
        {previewMode ? (
          <PreviewLessonNavigation
            nextLessonHref={nextLessonHref}
            prevLessonHref={prevLessonHref}
          />
        ) : (
          <LessonNavigationControls
            courseSlug={course.slug}
            lessonId={displayedLesson?.id ?? ""}
            nextLessonHref={nextLessonHref}
            prevLessonHref={prevLessonHref}
            status={currentStatus}
          />
        )}
      </div>
    </section>
  );
}

export function LearnerCoursePlayer({
  activeLessonId,
  baseHref,
  course,
  finalTestHref,
  previewMode = false,
}: {
  activeLessonId?: string;
  baseHref?: string;
  course: LearnerCourseDetail;
  finalTestHref?: string;
  previewMode?: boolean;
}) {
  const resolvedBaseHref = baseHref ?? `/learn/courses/${course.slug}`;
  const resolvedFinalTestHref = finalTestHref ?? course.finalTestHref;
  const allLessons = course.modules.flatMap((module) => module.lessons);
  const displayedLesson =
    allLessons.find((lesson) => lesson.id === activeLessonId) ??
    allLessons.find((lesson) => lesson.status === "Current") ??
    course.modules[0]?.lessons[0] ??
    null;

  return (
    <div className="space-y-6">
      <LearnerInstitutionalHeader previewMode={previewMode} />
      <CoursePlayerHeader course={course} />

      <div className="grid gap-6 lg:grid-cols-[340px_minmax(0,1fr)] lg:items-start">
        <details className="overflow-hidden rounded-[24px] border border-design-border bg-white-surface shadow-soft lg:hidden">
          <summary className="cursor-pointer bg-deep-navy px-5 py-4 text-sm font-semibold text-white">
            Course outline
          </summary>
          <CourseOutline
            baseHref={resolvedBaseHref}
            className="rounded-none border-0 shadow-none"
            course={course}
            displayedLessonId={displayedLesson?.id}
            finalTestHref={resolvedFinalTestHref}
          />
        </details>
        <CourseOutline
          baseHref={resolvedBaseHref}
          className="hidden lg:block"
          course={course}
          displayedLessonId={displayedLesson?.id}
          finalTestHref={resolvedFinalTestHref}
        />
        <LessonContent
          baseHref={resolvedBaseHref}
          course={course}
          displayedLessonId={displayedLesson?.id}
          finalTestHref={resolvedFinalTestHref}
          previewMode={previewMode}
        />
      </div>

      <section
        className="rounded-[28px] border border-design-border bg-white-surface p-6 shadow-soft"
        id={previewMode ? "final-test-preview" : undefined}
      >
        <SectionHeader
          action={
            <div className="flex flex-wrap gap-3">
              {!previewMode && (course.progress === 100 || course.certificateStatus === "Issued") && (
                <ActionButton href={`/learn/courses/${course.slug}/feedback`} variant="primary">
                  Submit Feedback
                </ActionButton>
              )}
              <ActionButton href={resolvedFinalTestHref} variant="secondary">
                {course.certificateStatus === "Issued" ? "View Final Test Results" : "View Final Test"}
              </ActionButton>
            </div>
          }
          description={
            course.certificateStatus === "Issued"
              ? "You have completed this course and earned your certificate! Please take a moment to submit course feedback."
              : "The final test appears at the end of the required lessons."
          }
          title="Course completion path"
        />
      </section>
    </div>
  );
}