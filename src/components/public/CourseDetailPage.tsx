import { CourseCoverVisual } from "@/components/course/CourseCoverVisual";
import { ActionButton, SectionHeader, StatusBadge } from "@/components/ui";
import type { PublicCatalogueCourseDetail } from "@/lib/course-types";

export type PublicCourseAction = {
  href: string;
  label: "Start learning" | "Continue learning" | "Go to My Courses" | "Open course";
  rel?: "noreferrer";
  target?: "_blank";
};

function CourseMetaItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-card border border-design-border bg-white-surface px-4 py-3 shadow-soft">
      <p className="text-xs font-semibold uppercase tracking-[0.1em] text-muted-text">
        {label}
      </p>
      <p className="mt-1 text-sm font-semibold leading-6 text-dark-ink">{value}</p>
    </div>
  );
}

function CourseHero({
  action,
  course,
}: {
  action: PublicCourseAction | null;
  course: PublicCatalogueCourseDetail;
}) {
  const isAvailable = course.availability === "available";

  return (
    <section className="overflow-hidden rounded-panel bg-deep-navy text-white shadow-hero">
      <div className="grid gap-10 px-6 py-12 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:px-12 lg:py-16">
        <div>
          <div className="flex flex-wrap gap-2">
            <StatusBadge
              label={isAvailable ? "Available now" : "Coming soon"}
              tone={isAvailable ? "green" : "gray"}
            />
            <StatusBadge label={course.primaryCapacityArea.name} tone="blue" />
            {course.integrationStatus === "integration_pending" ? (
              <StatusBadge label="Integration pending" tone="gold" />
            ) : null}
          </div>
          <p className="mt-7 text-xs font-bold uppercase tracking-[0.18em] text-sky-200">
            Course overview
          </p>
          <h1 className="mt-3 max-w-4xl font-display text-5xl leading-[0.98] text-white sm:text-6xl lg:text-7xl">
            {course.title}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-200">
            {course.shortDescription}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            {action ? (
              <ActionButton href={action.href} rel={action.rel} size="lg" target={action.target}>
                {action.label}
              </ActionButton>
            ) : (
              <span className="inline-flex min-h-12 items-center justify-center rounded-control border border-white/25 bg-white/10 px-5 py-3 text-base font-semibold text-white">
                Coming soon
              </span>
            )}
            <ActionButton
              className="border-white/30 bg-white/10 text-white hover:bg-white/20 hover:text-white"
              href="/courses"
              size="lg"
              variant="secondary"
            >
              Back to courses
            </ActionButton>
          </div>
          {!isAvailable ? (
            <p className="mt-5 max-w-xl text-sm leading-6 text-slate-300">
              Course access is being prepared. Viewing this page does not enroll
              you or create a learner record.
            </p>
          ) : null}
        </div>
        <div className="min-h-[360px] overflow-hidden rounded-panel border border-white/15 shadow-hero sm:min-h-[420px]">
          <CourseCoverVisual
            capacityArea={course.primaryCapacityArea.name}
            imageAlt={course.imageAlt}
            imageUrl={course.imageUrl}
            title={course.title}
            tone={course.tone}
          />
        </div>
      </div>
    </section>
  );
}

function CourseInformation({ course }: { course: PublicCatalogueCourseDetail }) {
  const informationItems = [
    { label: "Availability", value: course.availability === "available" ? "Available now" : "Coming soon" },
    { label: "Estimated duration", value: course.duration },
    { label: "Delivery format", value: course.deliveryFormat },
    { label: "Language", value: course.language },
    { label: "Progress tracking", value: course.progressTrackingCapability },
  ];

  return (
    <aside className="rounded-panel border border-design-border bg-white-surface p-5 shadow-card lg:sticky lg:top-28">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-dec-blue">
        Course information
      </p>
      <div className="mt-5 grid gap-3">
        {informationItems.map((item) => (
          <CourseMetaItem key={item.label} {...item} />
        ))}
      </div>
      <div className="mt-6 rounded-card border border-design-border bg-soft-bg p-4">
        <p className="text-xs font-bold uppercase tracking-[0.1em] text-muted-text">
          Primary capacity area
        </p>
        <p className="mt-2 text-sm font-semibold leading-6 text-deep-navy">
          {course.primaryCapacityArea.name}
        </p>
      </div>
      <div className="mt-3 rounded-card border border-design-border bg-soft-bg p-4">
        <p className="text-xs font-bold uppercase tracking-[0.1em] text-muted-text">
          Secondary capacity areas
        </p>
        <ul className="mt-2 grid gap-2 text-sm leading-6 text-dark-ink">
          {course.secondaryCapacityAreas.map((area) => (
            <li key={area.id}>{area.name}</li>
          ))}
        </ul>
      </div>
      <ActionButton className="mt-6 w-full" href="/courses" variant="secondary">
        Back to courses
      </ActionButton>
    </aside>
  );
}

function CourseOverview({ course }: { course: PublicCatalogueCourseDetail }) {
  return (
    <section className="rounded-panel border border-design-border bg-white-surface p-6 shadow-soft sm:p-8">
      <SectionHeader
        description={course.shortDescription}
        eyebrow="Course overview"
        title="About this course"
      />
      <div className="mt-6 space-y-4 text-base leading-8 text-muted-text">
        {course.fullDescription
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

function IntendedLearners({ course }: { course: PublicCatalogueCourseDetail }) {
  return (
    <section className="rounded-panel border border-design-border bg-white-surface p-6 shadow-soft sm:p-8">
      <SectionHeader
        description={course.intendedLearners}
        eyebrow="Intended learners"
        title="Who this course supports"
      />
    </section>
  );
}

function LearningOutcomes({ course }: { course: PublicCatalogueCourseDetail }) {
  return (
    <section className="rounded-panel border border-design-border bg-white-surface p-6 shadow-soft sm:p-8">
      <SectionHeader
        eyebrow="Learning outcomes"
        title="What learners will be able to do"
      />
      {course.learningOutcomes.length > 0 ? (
        <ol className="mt-7 grid gap-4">
          {course.learningOutcomes.map((outcome, index) => (
            <li className="flex gap-4 rounded-card bg-soft-bg p-4" key={outcome}>
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-dec-blue text-sm font-bold text-white">
                {String(index + 1).padStart(2, "0")}
              </span>
              <p className="pt-1 text-sm leading-6 text-dark-ink">{outcome}</p>
            </li>
          ))}
        </ol>
      ) : (
        <p className="mt-6 rounded-card bg-soft-bg p-5 text-sm leading-7 text-muted-text">
          Learning outcomes have not yet been approved for this course. They
          will appear here when the course design is ready.
        </p>
      )}
    </section>
  );
}

function ModuleOutline({ course }: { course: PublicCatalogueCourseDetail }) {
  return (
    <section className="rounded-panel border border-design-border bg-white-surface p-6 shadow-soft sm:p-8">
      <SectionHeader
        description={course.proposedStructureSummary}
        eyebrow="Course structure"
        title={course.modules.length > 0 ? "Modules and topics" : "Proposed structure"}
      />
      {course.modules.length > 0 ? (
        <div className="mt-8 grid gap-5">
          {course.modules.map((module, index) => (
            <article className="rounded-card border border-design-border bg-soft-bg p-5" key={module.title}>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-dec-blue">
                Module {index + 1}
              </p>
              <h3 className="mt-1 text-xl font-semibold text-dark-ink">{module.title}</h3>
              {module.summary ? (
                <p className="mt-2 text-sm leading-6 text-muted-text">{module.summary}</p>
              ) : null}
              <ul className="mt-5 grid gap-3">
                {module.topics.map((topic) => (
                  <li className="rounded-2xl border border-design-border bg-white-surface px-4 py-3 text-sm font-semibold text-dark-ink" key={topic}>
                    {topic}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      ) : (
        <p className="mt-6 rounded-card bg-soft-bg p-5 text-sm leading-7 text-muted-text">
          No modules or activities are being promised at this stage. The
          approved structure will be published before course access opens.
        </p>
      )}
    </section>
  );
}

function LearningApproach({ course }: { course: PublicCatalogueCourseDetail }) {
  return (
    <section className="rounded-panel border border-design-border bg-white-surface p-6 shadow-soft sm:p-8">
      <SectionHeader
        eyebrow="Learning approach"
        title="Learning and expected activities"
      />
      {course.learningApproach.length > 0 ? (
        <ul className="mt-7 grid gap-3 sm:grid-cols-2">
          {course.learningApproach.map((item) => (
            <li className="rounded-card bg-soft-bg p-4 text-sm font-semibold leading-6 text-dark-ink" key={item}>
              {item}
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-6 rounded-card bg-soft-bg p-5 text-sm leading-7 text-muted-text">
          Learning methods and expected activities are still being designed.
        </p>
      )}
    </section>
  );
}

function PracticalOutputs({ course }: { course: PublicCatalogueCourseDetail }) {
  return (
    <section className="rounded-panel border border-design-border bg-white-surface p-6 shadow-soft sm:p-8">
      <SectionHeader eyebrow="Practical application" title="Practical outputs" />
      {course.practicalOutputs.length > 0 ? (
        <ul className="mt-7 grid gap-3">
          {course.practicalOutputs.map((output) => (
            <li className="rounded-card bg-soft-bg p-4 text-sm leading-6 text-dark-ink" key={output}>
              {output}
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-6 rounded-card bg-soft-bg p-5 text-sm leading-7 text-muted-text">
          Practical outputs have not yet been defined for this course.
        </p>
      )}
    </section>
  );
}

function AssessmentAndSupport({ course }: { course: PublicCatalogueCourseDetail }) {
  return (
    <section className="grid gap-5 sm:grid-cols-2">
      <article className="rounded-panel border border-design-border bg-white-surface p-6 shadow-soft sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-dec-blue">
          Assessment and certificate
        </p>
        <h2 className="mt-3 text-2xl font-semibold text-deep-navy">Current status</h2>
        <p className="mt-4 text-sm leading-7 text-muted-text">{course.assessmentStatus}</p>
        <p className="mt-3 text-sm leading-7 text-muted-text">{course.certificateStatus}</p>
        {course.completionRule ? (
          <p className="mt-3 rounded-card bg-[#edf7df] p-4 text-sm leading-6 text-[#426f1c]">
            {course.completionRule}
          </p>
        ) : null}
      </article>
      <article className="rounded-panel border border-design-border bg-white-surface p-6 shadow-soft sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-dec-blue">
          Resources and support
        </p>
        <h2 className="mt-3 text-2xl font-semibold text-deep-navy">Help while learning</h2>
        <p className="mt-4 text-sm leading-7 text-muted-text">{course.resourcesAndSupport}</p>
        <ActionButton className="mt-5" href="/support" variant="secondary">
          Visit support
        </ActionButton>
      </article>
    </section>
  );
}

function ClosingAction({
  action,
  course,
}: {
  action: PublicCourseAction | null;
  course: PublicCatalogueCourseDetail;
}) {
  const isAvailable = course.availability === "available";
  const availableDescription =
    course.launchMode === "external_link"
      ? "Open the approved external course site in a new tab. The Hub does not claim automatic progress, completion, assessment, or certificate tracking for this mode."
      : course.progressTrackingCapability === "Hub-tracked progress available"
        ? "Use the Hub to start or continue this course through its existing learning, progress, assessment, and certificate flow."
        : "Open the approved external course inside the Hub. Progress, completion, assessment, and certificates are not automatically tracked for this mode.";

  return (
    <section className="py-16">
      <div className="rounded-panel bg-[#0e4a6e] px-6 py-12 text-center text-white shadow-hero sm:px-10">
        <h2 className="font-display text-4xl leading-tight sm:text-5xl">
          {isAvailable ? "Ready to begin?" : "Course access is being prepared"}
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-sky-50">
          {isAvailable
            ? availableDescription
            : "You can review the confirmed course position now. Enrollment and launch will be enabled only after the course is integrated and approved."}
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          {action ? (
            <ActionButton
              className="border-white bg-white text-[#0e4a6e] hover:border-white hover:bg-sky-50 hover:text-[#0e4a6e]"
              href={action.href}
              rel={action.rel}
              size="lg"
              target={action.target}
              variant="secondary"
            >
              {action.label}
            </ActionButton>
          ) : (
            <span className="inline-flex min-h-12 items-center justify-center rounded-control border border-white/30 bg-white/10 px-5 py-3 text-base font-semibold text-white">
              Coming soon
            </span>
          )}
          <ActionButton className="border-white/40 bg-transparent text-white hover:bg-white/10" href="/courses" size="lg">
            Back to courses
          </ActionButton>
        </div>
      </div>
    </section>
  );
}

export function CourseDetailPage({
  action,
  course,
}: {
  action: PublicCourseAction | null;
  course: PublicCatalogueCourseDetail;
}) {
  return (
    <div>
      <CourseHero action={action} course={course} />
      <div className="grid gap-8 py-12 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
        <div className="grid gap-8">
          <CourseOverview course={course} />
          <IntendedLearners course={course} />
          <LearningOutcomes course={course} />
          <ModuleOutline course={course} />
          <LearningApproach course={course} />
          <PracticalOutputs course={course} />
          <AssessmentAndSupport course={course} />
        </div>
        <CourseInformation course={course} />
      </div>
      <ClosingAction action={action} course={course} />
    </div>
  );
}
