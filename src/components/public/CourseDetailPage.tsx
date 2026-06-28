import { CourseCoverVisual } from "@/components/course/CourseCoverVisual";
import { ActionButton, SectionHeader, StatusBadge } from "@/components/ui";
import type { PublicCourseDetail } from "@/lib/course-types";

function courseStartHref(course: PublicCourseDetail) {
  const learnerPath = course.isExternalCourse
    ? `/learn/courses/${course.slug}/external`
    : `/learn/courses/${course.slug}`;

  return `/sign-in?next=${encodeURIComponent(learnerPath)}`;
}

function CourseMetaPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-card border border-design-border bg-white-surface px-4 py-3 shadow-soft">
      <p className="text-xs font-semibold uppercase tracking-[0.1em] text-muted-text">
        {label}
      </p>
      <p className="mt-1 text-sm font-semibold text-dark-ink">{value}</p>
    </div>
  );
}

function CourseHero({ course }: { course: PublicCourseDetail }) {
  return (
    <section className="overflow-hidden rounded-panel bg-deep-navy text-white shadow-hero">
      <div className="grid gap-10 px-6 py-12 sm:px-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:px-12 lg:py-16">
        <div>
          <div className="flex flex-wrap gap-2">
            <StatusBadge label={course.capacityArea} tone="green" />
            <StatusBadge label={course.access} tone="blue" />
            <StatusBadge label={course.certificate} tone="gold" />
          </div>
          <h1 className="mt-7 max-w-4xl font-display text-5xl leading-[0.98] text-white sm:text-6xl lg:text-7xl">
            {course.title}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-200">
            {course.shortDescription}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ActionButton href={courseStartHref(course)} size="lg">
              Start Course
            </ActionButton>
            <ActionButton
              className="border-white/30 bg-white/10 text-white hover:bg-white/20 hover:text-white"
              href="/courses"
              size="lg"
              variant="secondary"
            >
              Back to Courses
            </ActionButton>
          </div>
          <p className="mt-5 text-sm leading-6 text-slate-300">
            Designed for: {course.audience}
          </p>
        </div>
        <div className="min-h-[360px] overflow-hidden rounded-panel border border-white/15 shadow-hero sm:min-h-[420px]">
          <CourseCoverVisual {...course} />
        </div>
      </div>
    </section>
  );
}

function CourseInfoCard({ course }: { course: PublicCourseDetail }) {
  const informationItems = [
    { label: "Duration", value: course.duration },
    { label: "Level", value: course.level },
    { label: "Lessons", value: course.lessons },
    { label: "Language", value: course.language },
    { label: "Access", value: course.access },
    { label: "Capacity area", value: course.capacityArea },
  ];
  const certificateIncluded = course.certificateEligible === "Yes";

  return (
    <aside className="rounded-panel border border-design-border bg-white-surface p-5 shadow-card lg:sticky lg:top-28">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-dec-blue">
        Course information
      </p>
      <div className="mt-5 grid gap-3">
        {informationItems.map((item) => (
          <CourseMetaPill key={item.label} {...item} />
        ))}
      </div>
      <div
        className={[
          "mt-6 rounded-card border p-4",
          certificateIncluded
            ? "border-dec-green/30 bg-dec-green/15"
            : "border-design-border bg-soft-bg",
        ].join(" ")}
      >
        <p className="text-sm font-semibold text-deep-navy">
          {course.certificate}
        </p>
        <p className="mt-2 text-sm leading-6 text-muted-text">
          {certificateIncluded
            ? "Participants can work toward a certificate after completing required lessons and the final test."
            : "This course focuses on learning and practice without a certificate requirement."}
        </p>
      </div>
      <div className="mt-6 grid gap-3">
        <ActionButton href={courseStartHref(course)}>Start Course</ActionButton>
        <ActionButton href="/courses" variant="secondary">
          Back to Courses
        </ActionButton>
      </div>
    </aside>
  );
}

function CourseOverview({ course }: { course: PublicCourseDetail }) {
  return (
    <section className="rounded-panel border border-design-border bg-white-surface p-6 shadow-soft sm:p-8">
      <SectionHeader
        eyebrow="Course overview"
        title="What this course covers"
        description={course.shortDescription}
      />
      <div className="mt-6 space-y-4 text-base leading-8 text-muted-text">
        {course.longDescription
          .split(/\n{2,}/)
          .map((paragraph) => paragraph.trim())
          .filter(Boolean)
          .map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
      </div>
    </section>
  );
}

function LearningOutcomeList({ outcomes }: { outcomes: string[] }) {
  return (
    <section className="rounded-panel border border-design-border bg-white-surface p-6 shadow-soft sm:p-8">
      <SectionHeader
        eyebrow="Learning outcomes"
        title="By the end of this course, participants can"
      />
      {outcomes.length > 0 ? (
        <ol className="mt-7 grid gap-4">
          {outcomes.map((outcome, index) => (
            <li className="flex gap-4 rounded-card bg-soft-bg p-4" key={outcome}>
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-dec-blue text-sm font-bold text-white">
                {String(index + 1).padStart(2, "0")}
              </span>
              <p className="pt-1 text-sm leading-6 text-dark-ink">{outcome}</p>
            </li>
          ))}
        </ol>
      ) : (
        <p className="mt-6 rounded-card bg-soft-bg p-4 text-sm leading-7 text-muted-text">
          Learning outcomes will appear here when the course team publishes them.
        </p>
      )}
    </section>
  );
}

function ModuleOutline({
  modules,
}: {
  modules: PublicCourseDetail["modules"];
}) {
  return (
    <section className="rounded-panel border border-design-border bg-white-surface p-6 shadow-soft sm:p-8">
      <SectionHeader
        eyebrow="Module outline"
        title="Course structure"
        description="Follow the lessons in order and use the activities, resources, and checks to apply the learning."
      />
      <div className="mt-8 grid gap-5">
        {modules.map((module, index) => (
          <article
            className="rounded-card border border-design-border bg-soft-bg p-5"
            key={`${module.title}-${index}`}
          >
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-dec-blue">
                  Module {index + 1}
                </p>
                <h3 className="mt-1 text-xl font-semibold text-dark-ink">
                  {module.title}
                </h3>
              </div>
              <span className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-muted-text shadow-soft">
                {module.lessons.length} lessons
              </span>
            </div>
            <ul className="mt-5 grid gap-3">
              {module.lessons.map((lesson) => (
                <li
                  className="rounded-2xl border border-design-border bg-white-surface px-4 py-3 text-sm font-semibold text-dark-ink"
                  key={lesson}
                >
                  {lesson}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}

function AudienceAndAccess({ course }: { course: PublicCourseDetail }) {
  return (
    <section className="rounded-panel border border-design-border bg-white-surface p-6 shadow-soft sm:p-8">
      <SectionHeader
        eyebrow="Participation"
        title="Who this course supports"
        description="The course is structured for practical learning and can be completed on desktop or mobile."
      />
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <article className="rounded-card border border-design-border bg-soft-bg p-5">
          <h3 className="text-lg font-semibold text-dark-ink">Target audience</h3>
          <p className="mt-3 text-sm leading-6 text-muted-text">
            {course.audience}
          </p>
        </article>
        <article className="rounded-card border border-design-border bg-soft-bg p-5">
          <h3 className="text-lg font-semibold text-dark-ink">Learning format</h3>
          <p className="mt-3 text-sm leading-6 text-muted-text">
            {course.lessons} in {course.language}, with resources and activities
            shaped around {course.capacityArea.toLowerCase()}.
          </p>
        </article>
      </div>
    </section>
  );
}

function CourseDetailCTA({ course }: { course: PublicCourseDetail }) {
  return (
    <section className="py-16">
      <div className="rounded-panel bg-dec-blue px-6 py-12 text-center text-white shadow-hero sm:px-10">
        <h2 className="font-display text-4xl leading-tight sm:text-5xl">
          Ready to begin?
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-sky-50">
          Sign in to start learning, track your progress, complete the course,
          and continue toward any available certificate.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <ActionButton
            className="border-white bg-white text-dec-blue hover:border-white hover:bg-sky-50 hover:text-dec-blue"
            href={courseStartHref(course)}
            size="lg"
            variant="secondary"
          >
            Start Course
          </ActionButton>
          <ActionButton
            className="border-white/40 bg-dec-blue text-white hover:bg-[#2f88bf]"
            href="/courses"
            size="lg"
          >
            Back to Courses
          </ActionButton>
        </div>
      </div>
    </section>
  );
}

export function CourseDetailPage({ course }: { course: PublicCourseDetail }) {
  return (
    <div>
      <CourseHero course={course} />
      <div className="grid gap-8 py-12 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
        <div className="grid gap-8">
          <CourseOverview course={course} />
          <LearningOutcomeList outcomes={course.outcomes} />
          <ModuleOutline modules={course.modules} />
          <AudienceAndAccess course={course} />
        </div>
        <CourseInfoCard course={course} />
      </div>
      <CourseDetailCTA course={course} />
    </div>
  );
}
