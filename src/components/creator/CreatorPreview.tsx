import { LearnerTemplateRenderer } from "@/components/learner/LearnerTemplateRenderer";
import { ActionButton, SectionHeader, StatusBadge } from "@/components/ui";
import { CreatorCourseContextBar } from "./CreatorCourseContextBar";
import type { LearnerCourseDetail } from "@/lib/course-types";
import type { CreatorPreviewData } from "@/lib/creator-preview-data";

function toLearnerPreviewCourse(data: CreatorPreviewData): LearnerCourseDetail {
  const firstLesson = data.modules[0]?.lessons[0] ?? null;

  return {
    access: "Preview",
    audience: "Course participants",
    capacityArea: data.capacityArea,
    certificate: data.certificateEligible ? "Certificate included" : "No certificate",
    certificateEligible: data.certificateEligible ? "Yes" : "No",
    certificateHref: `/creator/courses/${data.courseId}/preview#final-test-preview`,
    certificateStatus: data.certificateEligible ? "Certificate path" : "No certificate",
    creator: "Course team",
    currentLesson: firstLesson?.title ?? "First lesson",
    currentModule: data.modules[0]?.title ?? "Course outline",
    description: data.description,
    duration: data.durationLabel,
    finalTest: data.finalTestRequired ? "Configured" : "Not required",
    finalTestHref: `/creator/courses/${data.courseId}/preview#final-test-preview`,
    finalTestQuestions: Array.from(
      { length: data.finalTestQuestionCount },
      (_, index) => ({
        options: [],
        text: `Final test question ${index + 1}`,
        type: "Question",
      }),
    ),
    href: `/courses/${data.slug}`,
    id: data.courseId,
    imageAlt: data.coverImageAlt,
    imageUrl: data.coverImageUrl,
    language: data.language,
    lastUpdated: "Preview",
    lessons: `${data.totalLessons} lessons`,
    lessonsCount: data.totalLessons,
    level: data.level,
    longDescription: data.description,
    modules: data.modules.map((module) => ({
      title: module.title,
      lessons: module.lessons.map((lesson, lessonIndex) => ({
        blocks: lesson.blocks.map((block) => ({
          configJson: block.configJson,
          estimatedDurationMinutes: block.estimatedDurationMinutes,
          id: block.id,
          order: block.order,
          title: block.title,
          type: block.type,
          typeLabel: block.typeLabel,
        })),
        description: lesson.description,
        estimatedDurationMinutes: lesson.estimatedDurationMinutes,
        id: lesson.id,
        status: module.order === 1 && lessonIndex === 0 ? "Current" as const : "Next" as const,
        title: lesson.title,
      })),
    })),
    outcomes: data.outcomes,
    passThresholdLabel: data.passThresholdLabel,
    passThresholdRule: `Pass threshold: ${data.passThresholdLabel}`,
    progress: 0,
    resources: String(data.resources.length),
    reviewStatus: data.status,
    shortDescription: data.description,
    shortTitle: data.title,
    slug: data.slug,
    status: data.status,
    statusLabel: "Preview mode",
    template: data.template,
    title: data.title,
    tone: "blue",
  };
}

function PreviewHeader({ data }: { data: CreatorPreviewData }) {
  return (
    <section className="overflow-hidden rounded-[28px] border border-design-border bg-deep-navy p-6 text-white shadow-hero lg:p-8">
      <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_340px] xl:items-center">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge label={data.status} tone="blue" />
            <StatusBadge label="Participant experience" tone="green" />
          </div>
          <h1 className="mt-5 text-4xl font-semibold leading-tight sm:text-5xl">
            Learner Preview
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-white/75">
            Review the saved course as participants will experience it before
            submitting or publishing.
          </p>
          <p className="mt-5 max-w-2xl text-sm font-semibold leading-6 text-white">
            {data.title}
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <ActionButton
              className="bg-white text-deep-navy hover:text-dec-blue"
              href={`/creator/courses/${data.courseId}/build`}
              size="lg"
              variant="secondary"
            >
              <span className="text-deep-navy">Return to Build Studio</span>
            </ActionButton>
            <ActionButton
              className="text-white hover:bg-white/10 hover:text-white"
              href={`/creator/courses/${data.courseId}/submit`}
              size="lg"
              variant="ghost"
            >
              Continue to Submit / Feedback
            </ActionButton>
          </div>
        </div>

        <article className="rounded-[24px] border border-white/15 bg-white/10 p-5">
          <p className="text-sm font-semibold text-dec-green">Preview summary</p>
          <dl className="mt-5 grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-[16px] bg-white/10 p-3">
              <dt className="text-white/65">Lessons</dt>
              <dd className="mt-1 text-2xl font-semibold text-white">
                {data.totalLessons}
              </dd>
            </div>
            <div className="rounded-[16px] bg-white/10 p-3">
              <dt className="text-white/65">Blocks</dt>
              <dd className="mt-1 text-2xl font-semibold text-white">
                {data.totalBlocks}
              </dd>
            </div>
            <div className="rounded-[16px] bg-white/10 p-3">
              <dt className="text-white/65">Resources</dt>
              <dd className="mt-1 text-2xl font-semibold text-white">
                {data.resources.length}
              </dd>
            </div>
            <div className="rounded-[16px] bg-white/10 p-3">
              <dt className="text-white/65">Pass score</dt>
              <dd className="mt-1 text-2xl font-semibold text-white">
                {data.passThresholdLabel}
              </dd>
            </div>
          </dl>
        </article>
      </div>
    </section>
  );
}

export function CreatorPreview({
  activeLessonId,
  data,
}: {
  activeLessonId?: string;
  data: CreatorPreviewData;
}) {
  const previewCourse = toLearnerPreviewCourse(data);

  return (
    <div className="space-y-6">
      <PreviewHeader data={data} />
      <CreatorCourseContextBar
        ariaLabel="Course preview context"
        items={[
          { label: "Capacity area", value: data.capacityArea },
          { label: "Level", value: data.level },
          { label: "Duration", value: data.durationLabel },
          { label: "Language", value: data.language },
          { label: "Current step", value: "Preview" },
        ]}
      />

      <SectionHeader
        description="This frame uses saved modules, lessons, blocks, outcomes, resources, and final test settings without Build Studio editing controls."
        title="Participant-facing course preview"
      />

      <div className="rounded-[28px] border border-design-border bg-light-bg p-4 shadow-card sm:p-6">
        <LearnerTemplateRenderer
          activeLessonId={activeLessonId}
          baseHref={`/creator/courses/${data.courseId}/preview`}
          course={previewCourse}
          finalTestHref={`/creator/courses/${data.courseId}/preview#final-test-preview`}
          previewMode
        />
      </div>
    </div>
  );
}
