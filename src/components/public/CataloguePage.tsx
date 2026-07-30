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
        cardBorder: "border-dec-blue",
        markerBg: "bg-dec-blue",
      };
    case "CAP-GOV": // Internal Governance and Leadership
      return {
        badgeBg: "bg-deep-navy/10",
        badgeText: "text-deep-navy",
        cardBorder: "border-[#72bee8]",
        markerBg: "bg-deep-navy",
      };
    case "CAP-MEAL": // Monitoring & Evaluation
    case "CAP-ACC": // Transparency & Accountability
      return {
        badgeBg: "bg-[#e2f2f1]",
        badgeText: "text-[#0f8f8c]",
        cardBorder: "border-[#f59e0b]",
        markerBg: "bg-[#0f8f8c]",
      };
    case "CAP-FIN": // Financial Management
      return {
        badgeBg: "bg-deep-navy/10",
        badgeText: "text-deep-navy",
        cardBorder: "border-dec-green",
        markerBg: "bg-dec-green",
      };
    case "CAP-STRAT": // Strategic Planning
      return {
        badgeBg: "bg-deep-navy/10",
        badgeText: "text-deep-navy",
        cardBorder: "border-dec-green",
        markerBg: "bg-[#91c852]",
      };
    case "CAP-HRSAFE": // Human Resources and Safeguarding
      return {
        badgeBg: "bg-[#eaf7ef]",
        badgeText: "text-[#2f6b3b]",
        cardBorder: "border-[#d97706]",
        markerBg: "bg-[#0f8f8c]",
      };
    case "CAP-DIG": // Digital Skills
      return {
        badgeBg: "bg-dec-blue/10",
        badgeText: "text-dec-blue",
        cardBorder: "border-cyan-500",
        markerBg: "bg-cyan-500",
      };
    case "CAP-PART": // Partnerships
      return {
        badgeBg: "bg-dec-green/10",
        badgeText: "text-[#2f6b3b]",
        cardBorder: "border-[#72bee8]",
        markerBg: "bg-[#91c852]",
      };
    default:
      return {
        badgeBg: "bg-[#e5f3fb]",
        badgeText: "text-dec-blue",
        cardBorder: "border-design-border",
        markerBg: "bg-dec-blue",
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

function CataloguePageHeader({ count }: { count: number }) {
  return (
    <section className="grid gap-8 py-12 lg:grid-cols-[1fr_1.1fr] lg:items-end lg:py-16">
      <div>
        <div className="flex items-center gap-3">
          <span className="h-1 w-12 rounded-full bg-dec-blue" />
          <p className="text-xs font-black uppercase tracking-[0.22em] text-dec-blue">
            CSO Learning Hub
          </p>
        </div>
        <h1 className="mt-5 font-display text-4xl font-bold leading-tight text-deep-navy sm:text-5xl lg:text-6xl">
          Practical learning catalogue
        </h1>
      </div>
      <div className="max-w-2xl lg:pb-2">
        <p className="text-base leading-8 text-muted-text">
          Explore {count} courses built for the operational realities of local and grassroots civil society organizations in Ethiopia. HRBA is open for learning, with additional courses coming soon.
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
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
    <label className="flex min-w-0 flex-col gap-2 text-xs font-bold uppercase tracking-[0.08em] text-muted-text">
      {label}
      <select
        className="min-h-12 w-full min-w-0 max-w-full rounded-control border border-design-border bg-white px-4 py-3 text-sm font-semibold normal-case tracking-normal text-deep-navy shadow-soft outline-none transition focus:border-dec-blue focus:ring-4 focus:ring-dec-blue/20"
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
      className="min-w-0 overflow-hidden rounded-card border border-design-border bg-white p-5 shadow-soft"
    >
      <h2 className="sr-only" id="catalogue-filters-title">
        Search and filter courses
      </h2>
      <div className="grid min-w-0 gap-4 md:grid-cols-[1.35fr_1fr_0.8fr]">
        <label className="flex min-w-0 flex-col gap-2 text-xs font-bold uppercase tracking-[0.08em] text-muted-text">
          Search
          <input
            aria-label="Search courses"
            className="min-h-12 w-full min-w-0 max-w-full rounded-control border border-design-border bg-light-bg px-4 py-3 text-sm font-semibold normal-case tracking-normal text-deep-navy shadow-soft outline-none transition placeholder:text-muted-text/80 focus:border-dec-blue focus:ring-4 focus:ring-dec-blue/20"
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
      <div className="mt-5 flex flex-wrap gap-3">
        <ActionButton type="submit">Apply filters</ActionButton>
        <ActionButton href="/courses" variant="secondary">
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
      className={cx(
        "flex h-full flex-col overflow-hidden rounded-card border bg-white shadow-soft transition-all duration-300 hover:shadow-card",
        isAvailable ? accent.cardBorder : "border-design-border"
      )}
    >
      <div className="relative aspect-video shrink-0 overflow-hidden">
        <CourseCoverVisual
          capacityArea={course.primaryCapacityArea.name}
          compact
          imageAlt={course.imageAlt}
          imageUrl={course.imageUrl}
          title={course.title}
          tone={course.tone}
        />
        <div className="absolute right-4 top-4">
          <StatusBadge
            label={isAvailable ? "Available now" : "Coming soon"}
            tone={isAvailable ? "green" : "gray"}
          />
        </div>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <span
          className={cx(
            "inline-self-start rounded-full px-2.5 py-0.5 text-2xs font-extrabold uppercase tracking-wider",
            accent.badgeBg,
            accent.badgeText
          )}
        >
          {course.primaryCapacityArea.name}
        </span>
        <h3 className="mt-3 text-lg font-bold leading-tight text-deep-navy">
          {displayTitle}
        </h3>
        {displayTitle !== course.title && (
          <p className="mt-2 text-2xs leading-5 text-muted-text italic">
            Official title: {course.title}
          </p>
        )}
        <p className="mt-3 flex-1 text-xs leading-6 text-muted-text">
          {course.shortDescription}
        </p>

        {/* Dynamic, clean metadata display */}
        <div className="mt-5 border-t border-design-border pt-4 text-2xs space-y-2 text-muted-text">
          <p>
            <strong className="text-deep-navy font-bold">Format:</strong> {formattedFormat}
          </p>
          {isAvailable ? (
            <>
              <p>
                <strong className="text-deep-navy font-bold">Duration:</strong> {course.duration}
              </p>
              <p>
                <strong className="text-deep-navy font-bold">Progress:</strong> Saved to your account
              </p>
            </>
          ) : (
            <p className="italic text-muted-soft">Duration and launch details to be confirmed</p>
          )}
        </div>

        <div className="mt-5 flex items-center justify-between gap-4 border-t border-design-border pt-4">
          <span className="text-2xs font-black uppercase tracking-wider text-muted-text">
            {requiresInvitation
              ? "Invitation only"
              : isAvailable
                ? "Open registration"
                : "Overview only"}
          </span>
          <ActionButton href={course.href} size="sm" variant={isAvailable ? "primary" : "secondary"}>
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
    <div className="flex flex-col bg-light-bg pb-20">
      <CataloguePageHeader count={courses.length} />
      <CatalogueFilterBar filters={filters} />

      {/* Screen Reader Result Announcements */}
      <div aria-live="polite" className="sr-only">
        Showing {courses.length} courses total. {availableCourses.length} available now, {forthcomingCourses.length} coming soon.
      </div>

      {courses.length > 0 ? (
        <div className="mt-12 space-y-16">
          {/* Available Learning Section */}
          {availableCourses.length > 0 && (
            <section aria-labelledby="available-title">
              <div className="border-b border-design-border pb-4">
                <h2 id="available-title" className="font-display text-2xl font-bold text-deep-navy">
                  Available learning
                </h2>
                <p className="mt-1 text-xs text-muted-text">
                  Start these self-paced courses directly by creating or signing in to your account.
                </p>
              </div>
              <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {availableCourses.map((course) => (
                  <PublicCourseCard course={course} key={course.slug} />
                ))}
              </div>
            </section>
          )}

          {/* Forthcoming Learning Section */}
          {forthcomingCourses.length > 0 && (
            <section aria-labelledby="upcoming-title">
              <div className="border-b border-design-border pb-4">
                <h2 id="upcoming-title" className="font-display text-2xl font-bold text-deep-navy">
                  Forthcoming learning
                </h2>
                <p className="mt-1 text-xs text-muted-text">
                  Upcoming capacity development topics. Browse overviews and structure to prepare.
                </p>
              </div>
              <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {forthcomingCourses.map((course) => (
                  <PublicCourseCard course={course} key={course.slug} />
                ))}
              </div>
            </section>
          )}
        </div>
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
