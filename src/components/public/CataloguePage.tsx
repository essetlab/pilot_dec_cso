import { ActionButton, EmptyState, SectionHeader, StatusBadge } from "@/components/ui";
import { CourseCoverVisual } from "@/components/course/CourseCoverVisual";
import { DEMO_CAPACITY_AREAS } from "@/lib/demo-data";
import type { PublicCourseFilters } from "@/lib/course-data";
import type { PublicCourseSummary } from "@/lib/course-types";

const badgeToneByCourseTone: Record<PublicCourseSummary["tone"], "blue" | "green" | "gold"> = {
  blue: "blue",
  gold: "gold",
  green: "green",
  navy: "blue",
};

function CataloguePageHeader() {
  return (
    <section className="grid gap-8 py-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-end lg:py-16">
      <div>
        <div className="flex items-center gap-3">
          <span className="h-1 w-12 rounded-full bg-dec-blue" />
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-dec-blue">
            Learning Portal
          </p>
        </div>
        <h1 className="mt-5 font-display text-5xl leading-[0.92] text-deep-navy sm:text-6xl lg:text-7xl">
          Course Catalog
        </h1>
      </div>
      <p className="max-w-2xl text-base leading-8 text-muted-text lg:pb-2">
        Explore practical courses designed for local and grassroots CSOs.
      </p>
    </section>
  );
}

function FilterSelect({
  label,
  name,
  options,
  value,
}: {
  label: string;
  name: string;
  options: string[];
  value?: string;
}) {
  return (
    <label className="flex flex-col gap-2 text-xs font-semibold uppercase tracking-[0.08em] text-muted-text">
      {label}
      <select
        className="min-h-12 rounded-control border border-design-border bg-white-surface px-4 py-3 text-sm font-semibold normal-case tracking-normal text-dark-ink shadow-soft outline-none transition focus:border-dec-blue focus:ring-4 focus:ring-dec-blue/20"
        defaultValue={value ?? ""}
        name={name}
      >
        {options.map((option) => (
          <option key={option} value={option === options[0] ? "" : option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

function CatalogueFilterBar({ filters }: { filters: PublicCourseFilters }) {
  return (
    <form
      action="/courses"
      aria-labelledby="catalogue-filters-title"
      className="rounded-panel border border-design-border bg-white-surface p-4 shadow-card sm:p-5"
    >
      <h2 className="sr-only" id="catalogue-filters-title">
        Search and filter courses
      </h2>
      <div className="grid gap-4 lg:grid-cols-[1.35fr_repeat(4,minmax(0,1fr))]">
        <label className="flex flex-col gap-2 text-xs font-semibold uppercase tracking-[0.08em] text-muted-text">
          Search
          <input
            aria-label="Search courses"
            className="min-h-12 rounded-control border border-design-border bg-soft-bg px-4 py-3 text-sm font-medium normal-case tracking-normal text-dark-ink shadow-soft outline-none transition placeholder:text-muted-text focus:border-dec-blue focus:ring-4 focus:ring-dec-blue/20"
            defaultValue={filters.search ?? ""}
            name="search"
            placeholder="Search courses..."
            type="search"
          />
        </label>
        <FilterSelect
          label="Capacity Area"
          name="capacityArea"
          options={[
            "All capacity areas",
            ...DEMO_CAPACITY_AREAS,
          ]}
          value={filters.capacityArea}
        />
        <FilterSelect
          label="Access"
          name="access"
          options={["All access", "Public", "Assigned"]}
          value={filters.access}
        />
        <FilterSelect
          label="Certificate"
          name="certificate"
          options={["Any certificate", "Certificate included"]}
          value={filters.certificate}
        />
        <FilterSelect
          label="Level"
          name="level"
          options={["All levels", "Introductory", "Foundational", "Intermediate"]}
          value={filters.level}
        />
      </div>
      <div className="mt-4 flex flex-wrap gap-3">
        <ActionButton type="submit">Apply Filters</ActionButton>
        <ActionButton href="/courses" variant="secondary">Reset</ActionButton>
      </div>
    </form>
  );
}

function CourseMetaPill({ label }: { label: string }) {
  return (
    <span className="inline-flex min-h-8 items-center rounded-full bg-soft-bg px-3 py-1.5 text-xs font-semibold text-dark-ink">
      {label}
    </span>
  );
}

function FeaturedCourseCard({ course }: { course: PublicCourseSummary }) {
  return (
    <section aria-labelledby="featured-course-title" className="py-14">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-text">
        Featured Course
      </p>
      <article className="mt-6 grid overflow-hidden rounded-panel border border-design-border bg-white-surface shadow-hero lg:grid-cols-[0.95fr_1.05fr]">
        <CourseCoverVisual {...course} />
        <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-12">
          <div className="flex flex-wrap gap-2">
            <StatusBadge label={course.capacityArea} tone="green" />
            <StatusBadge label={course.access} tone="blue" />
          </div>
          <h2
            className="mt-6 max-w-3xl font-display text-4xl leading-tight text-deep-navy sm:text-5xl"
            id="featured-course-title"
          >
            {course.title}
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-8 text-muted-text">
            {course.description}
          </p>
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <CourseMetaPill label={`Duration: ${course.duration}`} />
            <CourseMetaPill label={`Level: ${course.level}`} />
            <CourseMetaPill label={course.lessons} />
            <CourseMetaPill label="Certificate included" />
          </div>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
            <ActionButton href={course.href} size="lg">
              Explore Course
            </ActionButton>
            <p className="text-sm font-semibold text-[#426f1c]">
              Certificate included
            </p>
          </div>
        </div>
      </article>
    </section>
  );
}

function CourseCatalogueCard({ course }: { course: PublicCourseSummary }) {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-card border border-design-border bg-white-surface shadow-soft transition hover:-translate-y-1 hover:shadow-card">
      <CourseCoverVisual {...course} compact />
      <div className="flex flex-1 flex-col p-5">
        <div className="flex flex-wrap gap-2">
          <StatusBadge
            label={course.capacityArea}
            tone={badgeToneByCourseTone[course.tone]}
          />
          <StatusBadge label={course.access} tone="gray" />
        </div>
        <h3 className="mt-5 text-xl font-semibold leading-tight text-dark-ink">
          {course.title}
        </h3>
        <p className="mt-3 min-h-[72px] text-sm leading-6 text-muted-text">
          {course.description}
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          <CourseMetaPill label={course.duration} />
          <CourseMetaPill label={course.level} />
          <CourseMetaPill label={course.lessons} />
        </div>
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-design-border pt-5">
          <span className="text-xs font-semibold uppercase tracking-[0.08em] text-[#426f1c]">
            Certificate included
          </span>
          <ActionButton href={course.href} size="sm" variant="secondary">
            View Course
          </ActionButton>
        </div>
      </div>
    </article>
  );
}

function CourseGrid({ courses }: { courses: PublicCourseSummary[] }) {
  return (
    <section className="py-6 pb-20">
      <SectionHeader
        eyebrow="Available courses"
        title="Practical learning paths for CSO teams"
        description="Browse available courses aligned with current CSO capacity priorities."
      />
      {courses.length > 0 ? (
        <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {courses.map((course) => (
            <CourseCatalogueCard course={course} key={course.title} />
          ))}
        </div>
      ) : (
        <div className="mt-8">
          <EmptyState
            action={<ActionButton href="/courses" variant="secondary">Reset filters</ActionButton>}
            description="Try a broader search or clear the selected filters to review all available courses."
            title="No courses match the selected filters"
          />
        </div>
      )}
    </section>
  );
}

export function CataloguePage({
  courses,
  filters,
}: {
  courses: PublicCourseSummary[];
  filters: PublicCourseFilters;
}) {
  const featuredCourse = courses[0];

  return (
    <div>
      <CataloguePageHeader />
      <CatalogueFilterBar filters={filters} />
      {featuredCourse ? <FeaturedCourseCard course={featuredCourse} /> : null}
      <CourseGrid courses={courses} />
    </div>
  );
}
