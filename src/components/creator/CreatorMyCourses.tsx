import { ActionButton, EmptyState, MetricCard, SectionHeader, StatusBadge } from "@/components/ui";
import type { CreatorCourseListData, CreatorCourseListItem } from "@/lib/creator-course-workflow";

type CreatorMyCoursesProps = {
  data: CreatorCourseListData;
};

const creationSteps = [
  "Set up course basics",
  "Add outcomes and structure",
  "Build lessons with blocks",
  "Preview learner experience",
  "Submit for review",
];

function statusTone(status: string) {
  if (status === "Published") {
    return "green" as const;
  }

  if (status === "Ready for review") {
    return "orange" as const;
  }

  if (status === "Returned for revision") {
    return "red" as const;
  }

  return "blue" as const;
}

function HeroCard({ data }: { data: CreatorCourseListData }) {
  return (
    <section className="overflow-hidden rounded-[28px] bg-deep-navy p-6 text-white shadow-hero lg:p-8">
      <div className="grid gap-8 lg:grid-cols-[1fr_360px] lg:items-center">
        <div>
          <StatusBadge label="Course production" tone="green" />
          <h1 className="mt-5 max-w-3xl text-4xl font-semibold leading-tight sm:text-5xl">
            My Courses
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-white/75">
            Create and manage structured digital courses for CSO participants.
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <ActionButton href="/creator/courses/new" size="lg">
              Create Course
            </ActionButton>
            <ActionButton href="/courses" size="lg" variant="secondary">
              Preview Learner Catalog
            </ActionButton>
          </div>
        </div>

        <article className="rounded-[24px] border border-white/15 bg-white/10 p-5 text-white">
          <p className="text-sm font-semibold text-dec-green">Creator focus</p>
          <h2 className="mt-3 text-2xl font-semibold leading-tight">
            Shape courses into learner-ready journeys
          </h2>
          <p className="mt-3 text-sm leading-6 text-white/70">
            Move from course setup to lessons, learner preview, and review
            readiness with a clear production flow.
          </p>
          <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-[16px] bg-white/10 p-3">
              <p className="text-white/65">Draft</p>
              <p className="mt-1 text-2xl font-semibold text-white">{data.metrics.draft}</p>
            </div>
            <div className="rounded-[16px] bg-white/10 p-3">
              <p className="text-white/65">Published</p>
              <p className="mt-1 text-2xl font-semibold text-white">{data.metrics.published}</p>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}

function CreatorFilterBar() {
  return (
    <section
      aria-label="Course search and filters"
      className="rounded-[24px] border border-design-border bg-white-surface p-5 shadow-soft"
    >
      <div className="flex flex-col gap-5 xl:flex-row xl:items-end">
        <div className="min-w-0 flex-1">
          <h2 className="text-sm font-semibold text-deep-navy">Find a course</h2>
          <label
            className="mt-4 block text-sm font-medium text-muted-text"
            htmlFor="creator-course-search"
          >
            Search courses
          </label>
          <input
            className="mt-2 min-h-11 w-full rounded-control border border-design-border bg-white px-4 text-sm text-dark-ink outline-none transition focus:border-dec-blue focus:ring-4 focus:ring-dec-blue/20"
            id="creator-course-search"
            name="creator-course-search"
            type="search"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:w-[620px]">
          <label className="block text-sm font-medium text-muted-text">
            Status
            <select
              className="mt-2 min-h-11 w-full rounded-control border border-design-border bg-white px-4 text-sm text-dark-ink outline-none transition focus:border-dec-blue focus:ring-4 focus:ring-dec-blue/20"
              defaultValue="All"
              name="creator-status"
            >
              <option>All</option>
              <option>Draft</option>
              <option>Ready for review</option>
              <option>Published</option>
              <option>Returned for revision</option>
            </select>
          </label>
          <label className="block text-sm font-medium text-muted-text">
            Capacity area
            <select
              className="mt-2 min-h-11 w-full rounded-control border border-design-border bg-white px-4 text-sm text-dark-ink outline-none transition focus:border-dec-blue focus:ring-4 focus:ring-dec-blue/20"
              defaultValue="All"
              name="creator-capacity-area"
            >
              <option>All</option>
              <option>Proposal Development</option>
              <option>Financial Management</option>
              <option>Safeguarding</option>
              <option>Organizational Development</option>
            </select>
          </label>
        </div>
      </div>
    </section>
  );
}

function CreatorCourseCard({
  capacityArea,
  primaryAction,
  primaryHref,
  readiness,
  secondaryAction,
  secondaryHref,
  status,
  title,
  updated,
}: CreatorCourseListItem) {
  return (
    <article className="rounded-[24px] border border-design-border bg-white-surface p-6 shadow-soft">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_260px] lg:items-start">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge label={status} tone={statusTone(status)} />
            <StatusBadge label={capacityArea} tone="blue" />
          </div>
          <h2 className="mt-4 text-2xl font-semibold leading-tight text-dark-ink">
            {title}
          </h2>
          <dl className="mt-5 grid gap-4 text-sm sm:grid-cols-2">
            <div className="rounded-[18px] bg-soft-bg p-4">
              <dt className="font-medium text-muted-text">Last updated</dt>
              <dd className="mt-1 font-semibold text-dark-ink">{updated}</dd>
            </div>
            <div className="rounded-[18px] bg-soft-bg p-4">
              <dt className="font-medium text-muted-text">Readiness</dt>
              <dd className="mt-1 font-semibold leading-6 text-dark-ink">
                {readiness}
              </dd>
            </div>
          </dl>
        </div>

        <div className="flex flex-col gap-3 rounded-[20px] border border-design-border bg-soft-bg p-4">
          <ActionButton href={primaryHref}>{primaryAction}</ActionButton>
          <ActionButton href={secondaryHref} variant="secondary">
            {secondaryAction}
          </ActionButton>
        </div>
      </div>
    </article>
  );
}

function CourseCreationFlow() {
  return (
    <article className="rounded-[24px] border border-design-border bg-white-surface p-6 shadow-soft">
      <SectionHeader
        description="A concise path for moving a course from idea to learner preview."
        title="Course creation flow"
      />
      <ol className="mt-6 space-y-4">
        {creationSteps.map((step, index) => (
          <li className="flex gap-4" key={step}>
            <span className="flex size-9 shrink-0 items-center justify-center rounded-control bg-dec-green/15 text-sm font-semibold text-[#426f1c]">
              {index + 1}
            </span>
            <span className="pt-1 text-sm leading-6 text-muted-text">{step}</span>
          </li>
        ))}
      </ol>
    </article>
  );
}

function NewCoursePreview() {
  return (
    <article className="rounded-[24px] border border-dashed border-dec-blue/35 bg-dec-blue/10 p-6">
      <StatusBadge label="New course" tone="blue" />
      <h2 className="mt-4 text-xl font-semibold text-deep-navy">
        New courses appear in this workspace.
      </h2>
      <p className="mt-3 text-sm leading-7 text-[#26536c]">
        Use Create Course when you are ready to start preparing a new learning
        journey.
      </p>
      <div className="mt-5">
        <ActionButton href="/creator/courses/new" variant="secondary">
          Create Course
        </ActionButton>
      </div>
    </article>
  );
}

function metricCards(data: CreatorCourseListData) {
  return [
    {
      helperText: "Courses still being shaped in the authoring workflow.",
      label: "Draft courses",
      tone: "blue" as const,
      value: data.metrics.draft,
    },
    {
      helperText: "Courses prepared for quality review.",
      label: "Ready for review",
      tone: "orange" as const,
      value: data.metrics.readyForReview,
    },
    {
      helperText: "Courses visible to participants.",
      label: "Published",
      tone: "green" as const,
      value: data.metrics.published,
    },
    {
      helperText: "Courses needing creator updates.",
      label: "Returned for revision",
      tone: "gray" as const,
      value: data.metrics.returned,
    },
  ];
}

export function CreatorMyCourses({ data }: CreatorMyCoursesProps) {
  return (
    <div className="space-y-8">
      <HeroCard data={data} />

      <section aria-label="Creator course summary" className="space-y-5">
        <SectionHeader
          description="A quick view of course production activity across your workspace."
          title="Course summary"
        />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {metricCards(data).map((card) => (
            <MetricCard key={card.label} {...card} />
          ))}
        </div>
      </section>

      <CreatorFilterBar />

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px] xl:items-start">
        <div className="space-y-5">
          <SectionHeader
            description="Open a course production path, preview learner experience, or review readiness status."
            title="Course workspace"
          />
          <div className="space-y-5">
            {data.courses.length > 0 ? (
              data.courses.map((course) => (
                <CreatorCourseCard key={`${course.title}-${course.updated}`} {...course} />
              ))
            ) : (
              <EmptyState
                action={
                  <ActionButton href="/creator/courses/new">
                    Create Course
                  </ActionButton>
                }
                description="Create a draft course to begin the authoring workflow."
                title="No creator courses yet"
              />
            )}
          </div>
        </div>

        <aside className="space-y-5">
          <CourseCreationFlow />
          <NewCoursePreview />
        </aside>
      </section>
    </div>
  );
}
