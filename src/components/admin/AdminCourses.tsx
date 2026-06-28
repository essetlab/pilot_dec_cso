import { ActionButton, EmptyState, FilterBar, MetricCard, StatusBadge } from "@/components/ui";
import type { AdminCourseListData, AdminCourseListItem } from "@/lib/admin-course-workflow";
import type { ReactNode } from "react";

type AdminCoursesProps = {
  data: AdminCourseListData;
};

function Panel({
  children,
  description,
  title,
}: {
  children: ReactNode;
  description?: string;
  title: string;
}) {
  return (
    <section className="rounded-[24px] border border-design-border bg-white-surface p-6 shadow-soft">
      <div className="max-w-3xl">
        <h2 className="text-2xl font-semibold leading-tight text-dark-ink">{title}</h2>
        {description ? (
          <p className="mt-2 text-sm leading-6 text-muted-text">{description}</p>
        ) : null}
      </div>
      <div className="mt-6">{children}</div>
    </section>
  );
}

function MetricIcon({ children, tone }: { children: string; tone: "blue" | "green" | "orange" }) {
  if (tone === "green") {
    return <span className="text-sm font-bold text-[#426f1c]">{children}</span>;
  }

  if (tone === "orange") {
    return <span className="text-sm font-bold text-orange-700">{children}</span>;
  }

  return <span className="text-sm font-bold text-[#216f9d]">{children}</span>;
}

function CoursesHeader({ data }: { data: AdminCourseListData }) {
  return (
    <section className="overflow-hidden rounded-[28px] border border-design-border bg-deep-navy p-6 text-white shadow-hero lg:p-8">
      <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_360px] xl:items-center">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge label="Course operations" tone="blue" />
            <StatusBadge label="Admin workspace" tone="green" />
          </div>
          <h1 className="mt-5 text-4xl font-semibold leading-tight sm:text-5xl">
            Courses
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-white/75">
            Review course status, creators, capacity areas, certificate
            readiness, and learning access context.
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <ActionButton href="/admin/review" size="lg">
              Review Courses
            </ActionButton>
            <ActionButton
              className="bg-white text-deep-navy hover:text-dec-blue"
              href="/admin/cohorts"
              size="lg"
              variant="secondary"
            >
              <span className="text-deep-navy">View Cohorts</span>
            </ActionButton>
            <ActionButton
              className="text-white hover:bg-white/10 hover:text-white"
              href="/admin"
              size="lg"
              variant="ghost"
            >
              Back to Dashboard
            </ActionButton>
          </div>
        </div>

        <article className="rounded-[24px] border border-white/15 bg-white/10 p-5">
          <p className="text-sm font-semibold text-dec-green">Course context</p>
          <h2 className="mt-3 text-2xl font-semibold leading-tight">
            Keep course oversight concise and clear.
          </h2>
          <p className="mt-3 text-sm leading-6 text-white/70">
            Scan status, creator ownership, capacity area, and certificate
            readiness without entering the authoring workspace.
          </p>
          <dl className="mt-6 grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-[16px] bg-white/10 p-3">
              <dt className="text-white/65">Total courses</dt>
              <dd className="mt-1 text-2xl font-semibold text-white">{data.metrics.total}</dd>
            </div>
            <div className="rounded-[16px] bg-white/10 p-3">
              <dt className="text-white/65">Published</dt>
              <dd className="mt-1 text-2xl font-semibold text-white">{data.metrics.published}</dd>
            </div>
          </dl>
        </article>
      </div>
    </section>
  );
}

function CourseMetricGrid({ data }: { data: AdminCourseListData }) {
  const courseMetrics = [
    {
      helperText: "Courses across all active statuses",
      label: "Total courses",
      tone: "blue",
      value: data.metrics.total,
    },
    {
      helperText: "Available to participants",
      label: "Published courses",
      tone: "green",
      value: data.metrics.published,
    },
    {
      helperText: "Still being prepared",
      label: "Draft courses",
      tone: "orange",
      value: data.metrics.draft,
    },
    {
      helperText: "Waiting for quality review",
      label: "Ready for review",
      tone: "blue",
      value: data.metrics.readyForReview,
    },
  ] as const;

  return (
    <section aria-labelledby="course-summary-heading" className="space-y-4">
      <div>
        <h2 className="text-2xl font-semibold leading-tight text-dark-ink" id="course-summary-heading">
          Course summary
        </h2>
        <p className="mt-2 text-sm leading-6 text-muted-text">
          A concise view of course status, publication coverage, and review
          readiness.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {courseMetrics.map((metric, index) => (
          <MetricCard
            helperText={metric.helperText}
            icon={
              <MetricIcon tone={metric.tone}>
                {String(index + 1).padStart(2, "0")}
              </MetricIcon>
            }
            key={metric.label}
            label={metric.label}
            tone={metric.tone}
            value={metric.value}
          />
        ))}
      </div>
    </section>
  );
}

function SelectControl({
  label,
  name,
  options,
  value,
}: {
  label: string;
  name: string;
  options: { id: string; label: string }[];
  value: string;
}) {
  const id = `admin-courses-${name}`;

  return (
    <label className="block min-w-40 text-sm font-semibold text-dark-ink" htmlFor={id}>
      {label}
      <select
        className="mt-2 min-h-11 w-full rounded-control border border-design-border bg-white px-4 text-sm text-dark-ink outline-none transition focus:border-dec-blue focus:ring-4 focus:ring-dec-blue/20"
        defaultValue={value}
        id={id}
        name={name}
      >
        {options.map((option) => (
          <option key={option.id} value={option.id}>{option.label}</option>
        ))}
      </select>
    </label>
  );
}

function CourseFilterCard({ data }: { data: AdminCourseListData }) {
  return (
    <form action="/admin/courses">
      <FilterBar
        actions={
          <>
            <ActionButton href="/admin/courses" variant="secondary">
              Reset
            </ActionButton>
            <ActionButton type="submit">Apply Filters</ActionButton>
          </>
        }
        filters={
          <>
            <SelectControl
              label="Status"
              name="status"
              options={[{ id: "", label: "All statuses" }, ...data.filterOptions.statuses]}
              value={data.filters.status}
            />
            <SelectControl
              label="Capacity area"
              name="capacityArea"
              options={[{ id: "", label: "All capacity areas" }, ...data.filterOptions.capacityAreas]}
              value={data.filters.capacityArea}
            />
            <SelectControl
              label="Creator"
              name="courseCreator"
              options={[{ id: "", label: "All creators" }, ...data.filterOptions.creators]}
              value={data.filters.creator}
            />
            <SelectControl
              label="Certificate"
              name="certificate"
              options={[
                { id: "", label: "All courses" },
                { id: "eligible", label: "Certificate eligible" },
                { id: "none", label: "No certificate" },
              ]}
              value={data.filters.certificate}
            />
          </>
        }
        search={
          <label className="block text-sm font-semibold text-dark-ink" htmlFor="admin-courses-search">
            Search courses
            <input
              aria-label="Search courses"
              className="mt-2 min-h-11 w-full rounded-control border border-design-border bg-white px-4 text-sm text-dark-ink outline-none transition focus:border-dec-blue focus:ring-4 focus:ring-dec-blue/20"
              defaultValue={data.filters.query}
              id="admin-courses-search"
              name="query"
              placeholder="Title, creator, capacity area..."
              type="search"
            />
          </label>
        }
      />
    </form>
  );
}

function CourseTable({ courses }: { courses: AdminCourseListItem[] }) {
  return (
    <Panel
      description="Review course title, status, creator, capacity area, level, certificate eligibility, publication date, and recent update."
      title="Course list"
    >
      {courses.length > 0 ? (
        <>
          <div className="hidden overflow-x-auto rounded-[20px] border border-design-border lg:block">
            <table className="w-full min-w-[1120px] border-collapse bg-white text-left text-sm">
              <thead className="bg-soft-bg text-xs font-semibold uppercase tracking-[0.12em] text-muted-text">
                <tr>
                  <th className="px-4 py-4">Course title</th>
                  <th className="px-4 py-4">Status</th>
                  <th className="px-4 py-4">Creator</th>
                  <th className="px-4 py-4">Capacity area</th>
                  <th className="px-4 py-4">Level</th>
                  <th className="px-4 py-4">Certificate</th>
                  <th className="px-4 py-4">Published</th>
                  <th className="px-4 py-4">Last updated</th>
                  <th className="px-4 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-design-border">
                {courses.map((course) => (
                  <tr className="align-top" key={course.href}>
                    <td className="px-4 py-4">
                      <p className="font-semibold leading-6 text-dark-ink">{course.title}</p>
                      <p className="mt-1 text-xs font-semibold uppercase tracking-[0.12em] text-muted-text">
                        {course.lessons} lessons | {course.resources} resources | {course.visibility}
                      </p>
                    </td>
                    <td className="px-4 py-4">
                      <StatusBadge label={course.status} tone={course.statusTone} />
                    </td>
                    <td className="px-4 py-4 text-muted-text">{course.creator}</td>
                    <td className="px-4 py-4 text-muted-text">{course.capacityArea}</td>
                    <td className="px-4 py-4 text-muted-text">{course.level}</td>
                    <td className="px-4 py-4 font-semibold text-dark-ink">{course.certificateEligible}</td>
                    <td className="px-4 py-4 text-muted-text">{course.publishedAt}</td>
                    <td className="px-4 py-4 text-muted-text">{course.lastUpdated}</td>
                    <td className="px-4 py-4">
                      <div className="flex flex-wrap gap-2">
                        <ActionButton href={course.href} size="sm" variant="secondary">
                          View
                        </ActionButton>
                        <ActionButton href="/admin/review" size="sm" variant="ghost">
                          Review
                        </ActionButton>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-5 grid gap-4 lg:hidden">
            {courses.map((course) => (
              <article className="rounded-[20px] border border-design-border bg-soft-bg p-4" key={course.href}>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h3 className="text-base font-semibold leading-6 text-dark-ink">
                      {course.title}
                    </h3>
                    <p className="mt-1 text-sm leading-6 text-muted-text">{course.creator}</p>
                  </div>
                  <StatusBadge label={course.status} tone={course.statusTone} />
                </div>
                <dl className="mt-4 grid gap-3 sm:grid-cols-2">
                  {[
                    ["Capacity area", course.capacityArea],
                    ["Level", course.level],
                    ["Lessons", course.lessons],
                    ["Certificate eligible", course.certificateEligible],
                    ["Published", course.publishedAt],
                    ["Last updated", course.lastUpdated],
                  ].map(([label, value]) => (
                    <div key={label}>
                      <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-text">
                        {label}
                      </dt>
                      <dd className="mt-1 text-sm font-semibold leading-6 text-dark-ink">
                        {value}
                      </dd>
                    </div>
                  ))}
                </dl>
                <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                  <ActionButton className="w-full" href={course.href} variant="secondary">
                    View
                  </ActionButton>
                  <ActionButton className="w-full" href="/admin/review" variant="ghost">
                    Review
                  </ActionButton>
                </div>
              </article>
            ))}
          </div>
        </>
      ) : (
        <EmptyState
          action={<ActionButton href="/admin/courses" variant="secondary">Reset filters</ActionButton>}
          description="Try a broader search or clear the selected filters to review all courses."
          title="No courses match the selected filters"
        />
      )}
    </Panel>
  );
}

function CourseDetailPreviewCard({ course }: { course: AdminCourseListItem | null }) {
  return (
    <Panel
      description="Most recently updated course summary for quick operational review."
      title="Course detail preview"
    >
      {course ? (
        <article className="rounded-[22px] border border-dec-blue/25 bg-dec-blue/10 p-5">
          <StatusBadge label="Selected" tone="blue" />
          <h3 className="mt-4 text-xl font-semibold leading-tight text-deep-navy">
            {course.title}
          </h3>
          <dl className="mt-5 grid gap-3">
            {[
              ["Status", course.status],
              ["Creator", course.creator],
              ["Capacity area", course.capacityArea],
              ["Level", course.level],
              ["Lessons", course.lessons],
              ["Resources", course.resources],
              ["Certificate eligible", course.certificateEligible],
              ["Visibility", course.visibility],
            ].map(([label, value]) => (
              <div className="rounded-[16px] bg-white/85 p-4" key={label}>
                <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-text">
                  {label}
                </dt>
                <dd className="mt-2 text-sm font-semibold leading-6 text-dark-ink">
                  {value}
                </dd>
              </div>
            ))}
          </dl>
          <div className="mt-5">
            <ActionButton href={course.href} variant="secondary">
              Open Detail
            </ActionButton>
          </div>
        </article>
      ) : (
        <EmptyState
          description="Create or seed a course to see detail context."
          title="No selected course"
        />
      )}
    </Panel>
  );
}

function CourseGuidanceCard() {
  return (
    <aside className="rounded-[24px] border border-dec-green/30 bg-dec-green/15 p-6 shadow-soft">
      <StatusBadge label="Course guidance" tone="green" />
      <p className="mt-4 text-sm leading-7 text-[#426f1c]">
        Use this page to review course status, creator ownership, certificate
        readiness, and learning access before opening detailed review areas.
      </p>
    </aside>
  );
}

export function AdminCourses({ data }: AdminCoursesProps) {
  return (
    <div className="space-y-6">
      <CoursesHeader data={data} />
      <CourseMetricGrid data={data} />
      <CourseFilterCard data={data} />

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px] xl:items-start">
        <div className="space-y-6">
          <CourseTable courses={data.courses} />
        </div>

        <aside className="space-y-6">
          <CourseDetailPreviewCard course={data.selectedCourse} />
          <CourseGuidanceCard />
        </aside>
      </section>
    </div>
  );
}
