import { CourseCoverVisual } from "@/components/course/CourseCoverVisual";
import { ActionButton, EmptyState, StatusBadge } from "@/components/ui";
import type { PublicCourseFilters } from "@/lib/course-data";
import {
  PUBLIC_CATALOGUE_CAPACITY_AREAS,
} from "@/lib/public-course-catalogue";
import type { PublicCatalogueCourseSummary } from "@/lib/course-types";

type FilterOption = {
  label: string;
  value: string;
};

function CataloguePageHeader() {
  return (
    <section className="grid gap-8 py-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-end lg:py-16">
      <div>
        <div className="flex items-center gap-3">
          <span className="h-1 w-12 rounded-full bg-dec-blue" />
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-dec-blue">
            Phase One learning catalogue
          </p>
        </div>
        <h1 className="mt-5 font-display text-5xl leading-[0.92] text-deep-navy sm:text-6xl lg:text-7xl">
          Practical courses for CSOs
        </h1>
      </div>
      <div className="max-w-2xl lg:pb-2">
        <p className="text-base leading-8 text-muted-text">
          Browse available and upcoming courses across key CSO capacity areas.
          HRBA is available now, with more learning opportunities being prepared.
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          <StatusBadge label="Available now" tone="green" />
          <StatusBadge label="Coming soon" tone="gray" />
          <StatusBadge label="Course overviews" tone="blue" />
        </div>
      </div>
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
  options: FilterOption[];
  value?: string;
}) {
  return (
    <label className="flex min-w-0 flex-col gap-2 text-xs font-semibold uppercase tracking-[0.08em] text-muted-text">
      {label}
      <select
        className="min-h-12 w-full min-w-0 max-w-full rounded-control border border-design-border bg-white-surface px-4 py-3 text-sm font-semibold normal-case tracking-normal text-dark-ink shadow-soft outline-none transition focus:border-dec-blue focus:ring-4 focus:ring-dec-blue/20"
        defaultValue={value ?? ""}
        name={name}
      >
        {options.map((option) => (
          <option key={option.value || option.label} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function CatalogueFilterBar({ filters }: { filters: PublicCourseFilters }) {
  const capacityOptions = [
    { label: "All capacity areas", value: "" },
    ...PUBLIC_CATALOGUE_CAPACITY_AREAS.map((area) => ({
      label: area.name,
      value: area.id,
    })),
  ];

  return (
    <form
      action="/courses"
      aria-labelledby="catalogue-filters-title"
      className="min-w-0 overflow-hidden rounded-panel border border-design-border bg-white-surface p-4 shadow-card sm:p-5"
    >
      <h2 className="sr-only" id="catalogue-filters-title">
        Search and filter courses
      </h2>
      <div className="grid min-w-0 gap-4 lg:grid-cols-[1.35fr_1fr_0.8fr]">
        <label className="flex min-w-0 flex-col gap-2 text-xs font-semibold uppercase tracking-[0.08em] text-muted-text">
          Search
          <input
            aria-label="Search courses"
            className="min-h-12 w-full min-w-0 max-w-full rounded-control border border-design-border bg-soft-bg px-4 py-3 text-sm font-medium normal-case tracking-normal text-dark-ink shadow-soft outline-none transition placeholder:text-muted-text focus:border-dec-blue focus:ring-4 focus:ring-dec-blue/20"
            defaultValue={filters.search ?? ""}
            name="search"
            placeholder="Search titles, topics, or legacy labels..."
            type="search"
          />
        </label>
        <FilterSelect
          label="Capacity area"
          name="capacityArea"
          options={capacityOptions}
          value={filters.capacityArea}
        />
        <FilterSelect
          label="Availability"
          name="access"
          options={[
            { label: "All states", value: "" },
            { label: "Available now", value: "Available now" },
            { label: "Coming soon", value: "Coming soon" },
          ]}
          value={filters.access}
        />
      </div>
      <div className="mt-4 flex flex-wrap gap-3">
        <ActionButton type="submit">Apply filters</ActionButton>
        <ActionButton href="/courses" variant="secondary">
          Reset
        </ActionButton>
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

function CapacityMapping({ course }: { course: PublicCatalogueCourseSummary }) {
  return (
    <div className="mt-5 border-t border-design-border pt-5">
      <p className="text-xs font-bold uppercase tracking-[0.12em] text-muted-text">
        Capacity alignment
      </p>
      <p className="mt-2 text-sm font-semibold leading-6 text-dark-ink">
        {course.primaryCapacityArea.name}
      </p>
      {course.secondaryCapacityAreas.length > 0 ? (
        <p className="mt-1 text-xs leading-6 text-muted-text">
          Also connected to {course.secondaryCapacityAreas.map((area) => area.name).join(", ")}.
        </p>
      ) : null}
    </div>
  );
}

function CourseCatalogueCard({ course }: { course: PublicCatalogueCourseSummary }) {
  const isAvailable = course.availability === "available";
  const requiresInvitation = course.accessState === "invitation_required";

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-card border border-design-border bg-white-surface shadow-soft transition hover:-translate-y-1 hover:shadow-card">
      <div className="relative">
        <CourseCoverVisual
          capacityArea={course.primaryCapacityArea.name}
          compact
          imageAlt={course.imageAlt}
          imageUrl={course.imageUrl}
          title={course.title}
          tone={course.tone}
        />
        <div className="absolute left-4 top-4">
          <StatusBadge
            label={requiresInvitation ? "Invitation required" : isAvailable ? "Available now" : "Coming soon"}
            tone={requiresInvitation ? "gold" : isAvailable ? "green" : "gray"}
          />
        </div>
      </div>
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-dec-blue">
          Course overview
        </p>
        <h2 className="mt-3 text-xl font-semibold leading-tight text-dark-ink">
          {course.title}
        </h2>
        <p className="mt-3 flex-1 text-sm leading-7 text-muted-text">
          {course.shortDescription}
        </p>
        <CapacityMapping course={course} />
        <div className="mt-5 flex flex-wrap gap-2">
          <CourseMetaPill label={course.duration} />
          <CourseMetaPill label={course.deliveryFormat} />
          {isAvailable ? (
            <CourseMetaPill label={course.certificateLabel} />
          ) : null}
        </div>
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <span className="text-xs font-bold uppercase tracking-[0.1em] text-muted-text">
            {requiresInvitation
              ? "Individual assignment required"
              : isAvailable
                ? "Open for learning"
                : "Course information only"}
          </span>
          <ActionButton href={course.href} size="sm" variant="secondary">
            {isAvailable ? "View course" : "View course structure"}
          </ActionButton>
        </div>
      </div>
    </article>
  );
}

function CourseGrid({ courses }: { courses: PublicCatalogueCourseSummary[] }) {
  return (
    <section aria-labelledby="catalogue-results-title" className="py-14 pb-20">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-dec-blue">
            Confirmed catalogue
          </p>
          <h2 className="mt-3 font-display text-4xl text-deep-navy sm:text-5xl" id="catalogue-results-title">
            Courses across key CSO capacity areas
          </h2>
        </div>
        <p className="text-sm font-semibold text-muted-text">
          {courses.length} {courses.length === 1 ? "course" : "courses"} shown
        </p>
      </div>
      {courses.length > 0 ? (
        <div className="mt-9 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {courses.map((course) => (
            <CourseCatalogueCard course={course} key={course.slug} />
          ))}
        </div>
      ) : (
        <div className="mt-8">
          <EmptyState
            action={
              <ActionButton href="/courses" variant="secondary">
                Reset filters
              </ActionButton>
            }
            description="Try a broader search or clear the selected filters to review the full course catalogue."
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
  courses: PublicCatalogueCourseSummary[];
  filters: PublicCourseFilters;
}) {
  return (
    <div>
      <CataloguePageHeader />
      <CatalogueFilterBar filters={filters} />
      <CourseGrid courses={courses} />
    </div>
  );
}
