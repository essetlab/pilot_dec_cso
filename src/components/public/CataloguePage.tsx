import Image from "next/image";
import { CourseCoverVisual } from "@/components/course/CourseCoverVisual";
import { ActionButton, EmptyState, StatusBadge } from "@/components/ui";
import type { PublicCourseFilters } from "@/lib/course-data";
import { PUBLIC_CATALOGUE_CAPACITY_AREAS } from "@/lib/public-course-catalogue";
import type { PublicCatalogueCourseSummary } from "@/lib/course-types";
import { cx } from "@/components/ui/utils";

type FilterOption = {
  label: string;
  value: string;
};

// Accents Mapping based on Capacity Area ID
function getCapacityAccent(areaId: string) {
  switch (areaId) {
    case "CAP-ADV": // Advocacy and Civic Engagement (HRBA)
      return {
        badgeBg: "bg-[#e5f3fb]",
        badgeText: "text-dec-blue",
      };
    case "CAP-GOV": // Internal Governance and Leadership
      return {
        badgeBg: "bg-deep-navy/10",
        badgeText: "text-deep-navy",
      };
    case "CAP-MEAL": // Monitoring & Evaluation
    case "CAP-ACC": // Transparency & Accountability
      return {
        badgeBg: "bg-[#e2f2f1]",
        badgeText: "text-[#0f8f8c]",
      };
    case "CAP-FIN": // Financial Management
      return {
        badgeBg: "bg-deep-navy/10",
        badgeText: "text-deep-navy",
      };
    case "CAP-STRAT": // Strategic Planning
      return {
        badgeBg: "bg-deep-navy/10",
        badgeText: "text-deep-navy",
      };
    case "CAP-HRSAFE": // Human Resources and Safeguarding
      return {
        badgeBg: "bg-[#eaf7ef]",
        badgeText: "text-[#2f6b3b]",
      };
    case "CAP-DIG": // Digital Skills
      return {
        badgeBg: "bg-dec-blue/10",
        badgeText: "text-dec-blue",
      };
    case "CAP-PART": // Partnerships
      return {
        badgeBg: "bg-dec-green/10",
        badgeText: "text-[#2f6b3b]",
      };
    default:
      return {
        badgeBg: "bg-[#e5f3fb]",
        badgeText: "text-dec-blue",
      };
  }
}

function sanitizeFormatLabel(format: string) {
  const f = format.toLowerCase();
  if (f.includes("hub-tracked") || f.includes("embedded")) {
    return "Interactive online course";
  }
  return format;
}

const displayTitles: Record<string, string> = {
  "Applying the Human Rights-Based Approach in CSO Practice": "Apply HRBA in Everyday CSO Project Work",
  "Governance and Leadership for Local CSOs": "Lead with Accountability and Clear Direction",
  "Project Management for Local and Grassroots CSOs": "Plan and Manage Local CSO Projects with Greater Clarity",
};

function CataloguePageHeader() {
  return (
    <section className="relative grid gap-7 border-b border-[#d9e7df] py-10 sm:py-12 lg:grid-cols-[1.08fr_0.92fr] lg:items-end lg:gap-16 lg:py-14">
      <div>
        <div className="flex items-center gap-3">
          <span className="h-1 w-12 rounded-full bg-dec-blue" />
          <p className="text-xs font-black uppercase tracking-[0.22em] text-dec-blue">
            CSO Learning Hub
          </p>
        </div>
        <h1 className="mt-4 max-w-[17ch] font-display text-[2.4rem] font-bold leading-[1.05] tracking-[-0.028em] text-deep-navy sm:text-[3rem] lg:text-[3.35rem]">
          Practical learning catalogue
        </h1>
      </div>
      <div className="max-w-[38rem] lg:justify-self-end">
        <p className="text-[1rem] leading-7 text-muted-text sm:text-[1.05rem] sm:leading-8">
          Explore courses built for the operational realities of local and grassroots civil society organizations in Ethiopia.
        </p>
        <div className="mt-5 inline-flex flex-wrap gap-2 rounded-full border border-[#d8e5de] bg-white/75 p-1.5 shadow-[0_8px_20px_rgba(15,76,92,0.06)]">
          <StatusBadge label="Available now" tone="green" />
          <StatusBadge label="Coming soon" tone="gray" />
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
    <label className="flex min-w-0 flex-col gap-2 text-xs font-extrabold uppercase tracking-[0.1em] text-[#405568]">
      {label}
      <select
        className="min-h-[52px] w-full min-w-0 max-w-full rounded-xl border border-[#cfdde5] bg-white px-4 py-3 text-[0.95rem] font-semibold normal-case tracking-normal text-deep-navy shadow-[0_4px_12px_rgba(15,23,42,0.04)] outline-none transition hover:border-[#aebfcb] focus:border-dec-blue focus:ring-4 focus:ring-dec-blue/20"
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
      className="min-w-0 overflow-hidden rounded-[24px] border border-[#d5e2dd] bg-white/95 p-5 shadow-[0_16px_38px_rgba(15,76,92,0.08)] sm:p-6"
    >
      <h2 className="sr-only" id="catalogue-filters-title">
        Search and filter courses
      </h2>
      <div className="grid min-w-0 gap-4 lg:grid-cols-[1.45fr_1fr_0.8fr] lg:gap-5">
        <label className="flex min-w-0 flex-col gap-2 text-xs font-extrabold uppercase tracking-[0.1em] text-[#405568]">
          Search
          <input
            aria-label="Search courses"
            className="min-h-[52px] w-full min-w-0 max-w-full rounded-xl border border-[#cfdde5] bg-[#f7fbf8] px-4 py-3 text-[0.95rem] font-semibold normal-case tracking-normal text-deep-navy shadow-[0_4px_12px_rgba(15,23,42,0.04)] outline-none transition placeholder:font-normal placeholder:text-[#657789] hover:border-[#aebfcb] focus:border-dec-blue focus:bg-white focus:ring-4 focus:ring-dec-blue/20"
            defaultValue={filters.search ?? ""}
            name="search"
            placeholder="Search course titles or descriptions..."
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
            { label: "All availability", value: "" },
            { label: "Available now", value: "Available now" },
            { label: "Coming soon", value: "Coming soon" },
          ]}
          value={filters.access}
        />
      </div>
      <div className="mt-5 flex flex-col gap-3 border-t border-[#e1e9e5] pt-5 sm:flex-row sm:items-center sm:justify-end">
        <ActionButton className="min-h-12 sm:min-w-[8.5rem]" type="submit">Apply filters</ActionButton>
        <ActionButton className="min-h-12 sm:min-w-[8.5rem]" href="/courses" variant="secondary">
          Reset filters
        </ActionButton>
      </div>
    </form>
  );
}

function PublicCourseCard({ course }: { course: PublicCatalogueCourseSummary }) {
  const isAvailable = course.availability === "available";
  const requiresInvitation = course.accessState === "invitation_required";
  const displayTitle = displayTitles[course.title] ?? course.title;
  const accent = getCapacityAccent(course.primaryCapacityArea.id);
  const formattedFormat = sanitizeFormatLabel(course.deliveryFormat);

  return (
    <article
      className="group flex h-full flex-col overflow-hidden rounded-[22px] border border-slate-200 bg-white shadow-[0_8px_24px_rgba(15,23,42,0.07)] transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-[0_18px_42px_rgba(15,23,42,0.12)] focus-within:border-dec-blue focus-within:ring-2 focus-within:ring-dec-blue/35 motion-reduce:transform-none motion-reduce:transition-none"
    >
      <div className="relative aspect-video shrink-0 overflow-hidden bg-[#edf3ef]">
        {course.imageUrl ? (
          <Image
            alt={course.imageAlt}
            className="object-cover object-center transition-transform duration-500 group-hover:scale-[1.025] motion-reduce:transform-none motion-reduce:transition-none"
            fill
            sizes="(min-width: 1280px) 31vw, (min-width: 768px) 46vw, calc(100vw - 2.5rem)"
            src={course.imageUrl}
          />
        ) : (
          <CourseCoverVisual
            capacityArea={course.primaryCapacityArea.name}
            compact
            imageAlt={course.imageAlt}
            imageUrl={course.imageUrl}
            showTextOverlay={false}
            title={course.title}
            tone={course.tone}
          />
        )}
      </div>
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <span
            className={cx(
              "inline-flex max-w-[72%] self-start rounded-full px-3 py-1.5 text-xs font-bold leading-4",
              accent.badgeBg,
              accent.badgeText
            )}
          >
            {course.primaryCapacityArea.name}
          </span>
          <div className="shrink-0 [&>span]:min-h-8 [&>span]:whitespace-nowrap [&>span]:text-[0.78rem]">
            <StatusBadge
              label={isAvailable ? "Available now" : "Coming soon"}
              tone={isAvailable ? "green" : "gray"}
            />
          </div>
        </div>
        <h3 className="mt-4 font-display text-[1.4rem] font-bold leading-[1.12] tracking-[-0.018em] text-deep-navy">
          {displayTitle}
        </h3>
        {displayTitle !== course.title ? (
          <p className="mt-2 text-sm leading-6 text-[#526477]">
            Official title: {course.title}
          </p>
        ) : null}
        <p className="mt-3 flex-1 text-[0.95rem] leading-6 text-muted-text">
          {course.shortDescription}
        </p>

        {/* Dynamic, clean metadata display */}
        <div className="mt-5 space-y-2.5 border-t border-design-border pt-4 text-[0.8125rem] leading-5 text-[#526477]">
          <p>
            <strong className="font-bold text-deep-navy">Format:</strong> {formattedFormat}
          </p>
          {isAvailable ? (
            <>
              <p>
                <strong className="font-bold text-deep-navy">Duration:</strong> {course.duration}
              </p>
              <p>
                <strong className="font-bold text-deep-navy">Certificate:</strong> {course.certificateLabel}
              </p>
              <p>
                <strong className="font-bold text-deep-navy">Progress:</strong> Saved to your account
              </p>
            </>
          ) : (
            <p className="font-medium text-[#667789]">Duration and launch details to be confirmed</p>
          )}
        </div>

        <div className="mt-5 flex items-center justify-between gap-4 border-t border-design-border pt-4">
          <span className="text-xs font-bold uppercase tracking-[0.08em] text-muted-text">
            {requiresInvitation
              ? "Invitation only"
              : isAvailable
                ? "Open registration"
                : "Overview only"}
          </span>
          <ActionButton className="min-h-11 shrink-0" href={course.href} size="sm" variant={isAvailable ? "primary" : "secondary"}>
            {isAvailable ? "View course" : "View overview"}
          </ActionButton>
        </div>
      </div>
    </article>
  );
}

export function CataloguePage({
  courses,
  filters,
}: {
  courses: PublicCatalogueCourseSummary[];
  filters: PublicCourseFilters;
}) {
  const availableCourses = courses.filter((c) => c.availability === "available");
  const forthcomingCourses = courses.filter((c) => c.availability === "coming_soon");

  return (
    <div className="flex flex-col bg-light-bg pb-16 sm:pb-20">
      <CataloguePageHeader />
      <CatalogueFilterBar filters={filters} />

      {/* Screen Reader Result Announcements */}
      <div aria-live="polite" className="sr-only">
        Showing {courses.length} courses total. {availableCourses.length} available now, {forthcomingCourses.length} coming soon.
      </div>

      {courses.length > 0 ? (
        <section aria-label="Course catalogue results" className="mt-10 sm:mt-12">
          <div className="grid grid-cols-1 gap-5 md:auto-rows-fr md:grid-cols-2 md:gap-6 xl:grid-cols-3 xl:gap-7">
            {courses.map((course) => (
              <PublicCourseCard course={course} key={course.slug} />
            ))}
          </div>
        </section>
      ) : (
        <div className="mt-12">
          <EmptyState
            action={
              <ActionButton href="/courses" variant="secondary">
                Reset filters
              </ActionButton>
            }
            description="Try adjusting your search keywords, or selecting 'All capacity areas' and 'All availability'."
            title="No courses match your active filters"
          />
        </div>
      )}
    </div>
  );
}
