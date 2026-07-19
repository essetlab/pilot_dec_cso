import { ActionButton, AlertMessage, StatusBadge } from "@/components/ui";
import { saveAdminExternalCourseAction } from "@/lib/admin-external-course-actions";
import type { AdminExternalCourseEditorData } from "@/lib/admin-external-course-workflow";
import { parseSafeExternalUrl } from "@/lib/external-course-manager";
import type { ReactNode } from "react";

type Props = {
  adminNotice?: string;
  data: AdminExternalCourseEditorData;
};

const noticeMessages: Record<
  string,
  { message: string; tone: "error" | "info" | "success" | "warning" }
> = {
  "approved-origin-required": {
    message: "Available embedded courses require the exact approved origin.",
    tone: "error",
  },
  "draft-saved": {
    message: "External course saved as a private draft and recorded in the audit log.",
    tone: "success",
  },
  "external-url-required": {
    message: "Available courses require a valid external course URL.",
    tone: "error",
  },
  "hub-tracked-adapter-required": {
    message:
      "Save this course as a draft or Coming soon until its trusted Hub-tracked adapter is implemented and verified.",
    tone: "warning",
  },
  "invalid-approved-origin": {
    message: "Use the exact HTTPS origin from the external course URL, without a path.",
    tone: "error",
  },
  "invalid-capacity-area": {
    message: "Choose active controlled capacity areas.",
    tone: "error",
  },
  "invalid-certificate-capabilities": {
    message: "Certificate eligibility requires trusted progress, assessment, and a pass threshold.",
    tone: "error",
  },
  "invalid-course-information": {
    message: "Complete the required public course information and use a valid lowercase slug.",
    tone: "error",
  },
  "invalid-embedded-capabilities": {
    message: "Embedded mode cannot claim tracking, assessment, or automatic certificates without a trusted adapter.",
    tone: "error",
  },
  "invalid-external-link-capabilities": {
    message: "External-link mode must open in a new tab and cannot claim automatic tracking or certificates.",
    tone: "error",
  },
  "invalid-external-url": {
    message: "Enter a complete HTTPS external course URL.",
    tone: "error",
  },
  "invalid-image-url": {
    message: "Use an HTTPS image URL or a root-relative Hub image path.",
    tone: "error",
  },
  "invalid-pass-threshold": {
    message: "Pass threshold must be a whole number from 1 to 100.",
    tone: "error",
  },
  "publish-state-required": {
    message: "Choose Coming soon or Available before publishing.",
    tone: "warning",
  },
  published: {
    message: "External course published and the catalogue cache refreshed.",
    tone: "success",
  },
  "reserved-hrba-slug": {
    message: "The existing HRBA slug is protected and cannot be reused by this manager.",
    tone: "error",
  },
  "slug-in-use": {
    message: "That slug is already used by another course.",
    tone: "error",
  },
  unauthorized: {
    message: "Only an authorized Hub administrator can save or publish external courses.",
    tone: "error",
  },
  unpublished: {
    message: "Course unpublished. Historical records remain preserved.",
    tone: "success",
  },
  "unsafe-external-url": {
    message:
      "The URL was rejected. Use HTTPS and do not include credentials or raw Hub record identifiers.",
    tone: "error",
  },
};

function Panel({
  children,
  description,
  id,
  title,
}: {
  children: ReactNode;
  description?: string;
  id?: string;
  title: string;
}) {
  return (
    <section
      className="rounded-[24px] border border-design-border bg-white-surface p-5 shadow-soft sm:p-6"
      id={id}
    >
      <h2 className="text-2xl font-semibold leading-tight text-dark-ink">{title}</h2>
      {description ? (
        <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-text">{description}</p>
      ) : null}
      <div className="mt-6">{children}</div>
    </section>
  );
}

function TextControl({
  defaultValue,
  description,
  label,
  name,
  placeholder,
  required = false,
  type = "text",
}: {
  defaultValue: string | number | null;
  description?: string;
  label: string;
  name: string;
  placeholder?: string;
  required?: boolean;
  type?: "number" | "text" | "url";
}) {
  return (
    <label className="block min-w-0 text-sm font-semibold text-dark-ink">
      {label}
      <input
        className="mt-2 min-h-11 w-full min-w-0 rounded-control border border-design-border bg-white px-4 py-3 text-sm text-dark-ink outline-none transition focus:border-dec-blue focus:ring-4 focus:ring-dec-blue/20"
        defaultValue={defaultValue ?? ""}
        name={name}
        placeholder={placeholder}
        required={required}
        type={type}
      />
      {description ? (
        <span className="mt-2 block text-xs font-normal leading-5 text-muted-text">
          {description}
        </span>
      ) : null}
    </label>
  );
}

function TextAreaControl({
  defaultValue,
  description,
  label,
  name,
  required = false,
  rows = 5,
}: {
  defaultValue: string;
  description?: string;
  label: string;
  name: string;
  required?: boolean;
  rows?: number;
}) {
  return (
    <label className="block text-sm font-semibold text-dark-ink">
      {label}
      <textarea
        className="mt-2 w-full rounded-control border border-design-border bg-white px-4 py-3 text-sm leading-6 text-dark-ink outline-none transition focus:border-dec-blue focus:ring-4 focus:ring-dec-blue/20"
        defaultValue={defaultValue}
        name={name}
        required={required}
        rows={rows}
      />
      {description ? (
        <span className="mt-2 block text-xs font-normal leading-5 text-muted-text">
          {description}
        </span>
      ) : null}
    </label>
  );
}

function SelectControl({
  defaultValue,
  label,
  name,
  options,
}: {
  defaultValue: string;
  label: string;
  name: string;
  options: { label: string; value: string }[];
}) {
  return (
    <label className="block text-sm font-semibold text-dark-ink">
      {label}
      <select
        className="mt-2 min-h-11 w-full rounded-control border border-design-border bg-white px-4 text-sm text-dark-ink outline-none transition focus:border-dec-blue focus:ring-4 focus:ring-dec-blue/20"
        defaultValue={defaultValue}
        name={name}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function CheckControl({
  checked,
  description,
  label,
  name,
}: {
  checked: boolean;
  description?: string;
  label: string;
  name: string;
}) {
  return (
    <label className="flex min-h-12 items-start gap-3 rounded-control border border-design-border bg-soft-bg p-3 text-sm text-dark-ink">
      <input className="mt-1 size-4 accent-dec-blue" defaultChecked={checked} name={name} type="checkbox" />
      <span>
        <span className="block font-semibold">{label}</span>
        {description ? (
          <span className="mt-1 block text-xs leading-5 text-muted-text">{description}</span>
        ) : null}
      </span>
    </label>
  );
}

function PublicInformation({ data }: { data: AdminExternalCourseEditorData }) {
  const course = data.course;

  return (
    <Panel
      description="This information is used by the public catalogue card and reusable course overview."
      title="Public course information"
    >
      <div className="grid gap-5 md:grid-cols-2">
        <TextControl defaultValue={course.title} label="Course title" name="title" required />
        <TextControl
          defaultValue={course.slug}
          description="Lowercase letters, numbers, and hyphens. The database course ID remains the permanent identity."
          label="Slug"
          name="slug"
          placeholder="example-external-course"
          required
        />
      </div>
      <div className="mt-5 grid gap-5">
        <TextAreaControl
          defaultValue={course.shortDescription}
          label="Short description"
          name="shortDescription"
          required
          rows={3}
        />
        <TextAreaControl
          defaultValue={course.fullDescription}
          label="Full description"
          name="fullDescription"
          required
          rows={6}
        />
        <TextAreaControl
          defaultValue={course.targetAudience}
          label="Target audience"
          name="targetAudience"
          required
          rows={3}
        />
        <TextAreaControl
          defaultValue={course.learningOutcomes.join("\n")}
          description="Enter one learning outcome per line."
          label="Learning outcomes"
          name="learningOutcomes"
          rows={6}
        />
      </div>
      <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        <SelectControl
          defaultValue={course.primaryCapacityAreaId}
          label="Primary capacity area"
          name="primaryCapacityAreaId"
          options={data.capacityAreas.map((area) => ({ label: area.label, value: area.id }))}
        />
        <TextControl
          defaultValue={course.estimatedDurationMinutes}
          label="Estimated duration (minutes)"
          name="estimatedDurationMinutes"
          type="number"
        />
        <TextControl defaultValue={course.language} label="Language" name="language" required />
        <SelectControl
          defaultValue={course.level}
          label="Level"
          name="level"
          options={[
            { label: "Introductory", value: "INTRODUCTORY" },
            { label: "Foundational", value: "FOUNDATIONAL" },
            { label: "Intermediate", value: "INTERMEDIATE" },
            { label: "Advanced", value: "ADVANCED" },
            { label: "Mixed", value: "MIXED" },
          ]}
        />
        <TextControl
          defaultValue={course.imageUrl}
          description="Use an HTTPS URL or a Hub path such as /images/course-cover.jpg."
          label="Course image"
          name="imageUrl"
        />
        <TextControl defaultValue={course.displayOrder} label="Display order" name="displayOrder" required type="number" />
      </div>
      <fieldset className="mt-6">
        <legend className="text-sm font-semibold text-dark-ink">Secondary capacity areas</legend>
        <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {data.capacityAreas.map((area) => (
            <label
              className="flex items-start gap-3 rounded-control border border-design-border bg-soft-bg p-3 text-sm text-dark-ink"
              key={area.id}
            >
              <input
                className="mt-1 size-4 accent-dec-blue"
                defaultChecked={course.secondaryCapacityAreaIds.includes(area.id)}
                name="secondaryCapacityAreaIds"
                type="checkbox"
                value={area.id}
              />
              <span>
                <span className="block font-semibold">{area.label}</span>
                <span className="mt-1 block text-xs text-muted-text">{area.id}</span>
              </span>
            </label>
          ))}
        </div>
      </fieldset>
      <div className="mt-5">
        <CheckControl checked={course.featured} label="Featured course" name="featured" />
      </div>
    </Panel>
  );
}

function IntegrationSettings({ data }: { data: AdminExternalCourseEditorData }) {
  const course = data.course;
  const testedUrl = parseSafeExternalUrl(course.externalUrl);

  return (
    <Panel
      description="External-link and embedded courses do not receive automatic Hub progress, assessment, or certificates. Hub-tracked publication requires a separately verified adapter."
      title="Availability and integration"
    >
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        <SelectControl
          defaultValue={course.availability}
          label="Publication state"
          name="availability"
          options={[
            { label: "Draft", value: "draft" },
            { label: "Coming soon", value: "coming_soon" },
            { label: "Available", value: "available" },
            { label: "Unpublished", value: "unpublished" },
          ]}
        />
        <SelectControl
          defaultValue={course.integrationMode}
          label="Integration mode"
          name="integrationMode"
          options={[
            { label: "External link", value: "external_link" },
            { label: "Embedded course", value: "embedded" },
            { label: "Hub-tracked external course", value: "hub_tracked" },
          ]}
        />
        <SelectControl
          defaultValue={course.openBehavior}
          label="Open behavior"
          name="openBehavior"
          options={[
            { label: "Open in a new tab", value: "new_tab" },
            { label: "Open inside the Hub", value: "inside_hub" },
          ]}
        />
      </div>
      <div className="mt-5 grid gap-5 md:grid-cols-2">
        <TextControl
          defaultValue={course.externalUrl}
          description="HTTPS is required, except localhost during development. Raw Hub record IDs are rejected in query parameters."
          label="External course URL"
          name="externalUrl"
          placeholder="https://learning.example.org/course"
          type="url"
        />
        <TextControl
          defaultValue={course.approvedOrigin}
          description="Exact origin only, for example https://learning.example.org."
          label="Approved origin"
          name="approvedOrigin"
          placeholder="https://learning.example.org"
          type="url"
        />
        <TextControl defaultValue={course.courseVersion} label="Course version" name="courseVersion" />
        <TextControl
          defaultValue={course.passThreshold}
          label="Pass threshold (%)"
          name="passThreshold"
          type="number"
        />
      </div>
      <div className="mt-5">
        <TextAreaControl
          defaultValue={course.completionRule}
          label="Completion rule"
          name="completionRule"
          rows={3}
        />
      </div>
      <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        <CheckControl
          checked={course.progressTrackingSupported}
          description="Enable only for a verified Hub-tracked adapter."
          label="Progress tracking supported"
          name="progressTrackingSupported"
        />
        <CheckControl
          checked={course.assessmentSupported}
          description="Enable only when trusted assessment events are validated."
          label="Assessment supported"
          name="assessmentSupported"
        />
        <CheckControl
          checked={course.certificateEligible}
          description="Requires trusted completion and assessment rules."
          label="Certificate eligible"
          name="certificateEligible"
        />
      </div>
      {testedUrl.url ? (
        <div className="mt-5">
          <ActionButton
            forceDocumentNavigation
            href={testedUrl.url}
            rel="noreferrer"
            target="_blank"
            variant="secondary"
          >
            Test URL
          </ActionButton>
        </div>
      ) : null}
    </Panel>
  );
}

function PreviewCards({ data }: { data: AdminExternalCourseEditorData }) {
  const course = data.course;
  const primaryArea = data.capacityAreas.find((area) => area.id === course.primaryCapacityAreaId);
  const availabilityLabel =
    course.availability === "available"
      ? "Available now"
      : course.availability === "coming_soon"
        ? "Coming soon"
        : course.availability === "unpublished"
          ? "Unpublished"
          : "Draft";

  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <Panel
        description="Saved values shown in the public catalogue-card structure."
        id="catalogue-card-preview"
        title="Catalogue card preview"
      >
        <article className="overflow-hidden rounded-card border border-design-border bg-white shadow-card">
          <div className="bg-deep-navy p-6 text-white">
            <StatusBadge label={availabilityLabel} tone={course.availability === "available" ? "green" : "gray"} />
            <p className="mt-6 text-xs font-semibold uppercase tracking-[0.14em] text-sky-200">
              Course overview
            </p>
            <h3 className="mt-3 text-2xl font-semibold leading-tight">
              {course.title || "Untitled external course"}
            </h3>
          </div>
          <div className="p-5">
            <p className="text-sm leading-7 text-muted-text">
              {course.shortDescription || "Add a short public description."}
            </p>
            <p className="mt-5 text-xs font-semibold uppercase tracking-[0.12em] text-muted-text">
              Capacity alignment
            </p>
            <p className="mt-2 text-sm font-semibold text-dark-ink">
              {primaryArea?.label ?? "Choose a primary capacity area"}
            </p>
          </div>
        </article>
      </Panel>

      <Panel
        description="Saved values shown in the reusable public overview structure."
        id="course-overview-preview"
        title="Course overview preview"
      >
        <article className="rounded-card border border-design-border bg-soft-bg p-5 sm:p-6">
          <div className="flex flex-wrap gap-2">
            <StatusBadge label={availabilityLabel} tone={course.availability === "available" ? "green" : "gray"} />
            {primaryArea ? <StatusBadge label={primaryArea.label} tone="blue" /> : null}
          </div>
          <h3 className="mt-5 text-3xl font-semibold leading-tight text-deep-navy">
            {course.title || "Untitled external course"}
          </h3>
          <p className="mt-4 text-sm leading-7 text-muted-text">
            {course.fullDescription || "Add the full public course description."}
          </p>
          <dl className="mt-6 grid gap-3 sm:grid-cols-2">
            <div className="rounded-control bg-white p-4">
              <dt className="text-xs font-semibold uppercase text-muted-text">Language</dt>
              <dd className="mt-1 text-sm font-semibold text-dark-ink">{course.language}</dd>
            </div>
            <div className="rounded-control bg-white p-4">
              <dt className="text-xs font-semibold uppercase text-muted-text">Integration</dt>
              <dd className="mt-1 text-sm font-semibold text-dark-ink">
                {course.integrationMode.replaceAll("_", " ")}
              </dd>
            </div>
          </dl>
        </article>
      </Panel>
    </div>
  );
}

export function AdminExternalCourseManager({ adminNotice, data }: Props) {
  const course = data.course;
  const notice = adminNotice ? noticeMessages[adminNotice] : null;

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-[28px] bg-deep-navy p-6 text-white shadow-hero lg:p-8">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <div className="flex flex-wrap gap-2">
              <StatusBadge label="External Course Manager" tone="blue" />
              <StatusBadge label={course.statusLabel} tone="green" />
            </div>
            <h1 className="mt-5 text-4xl font-semibold leading-tight sm:text-5xl">
              {course.courseId ? "Edit external course" : "Add external course"}
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-white/75">
              Configure public course information and a safe external integration without using Build Studio or changing application code.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <ActionButton href="/admin/courses" variant="secondary">
              Back to Courses
            </ActionButton>
            <ActionButton href="#catalogue-card-preview" variant="outline">
              Preview catalogue card
            </ActionButton>
            <ActionButton href="#course-overview-preview" variant="outline">
              Preview course overview
            </ActionButton>
            {course.publicHref ? (
              <ActionButton href={course.publicHref} variant="secondary">
                Open public overview
              </ActionButton>
            ) : null}
          </div>
        </div>
      </section>

      {notice ? (
        <AlertMessage title="External course update" tone={notice.tone}>
          {notice.message}
        </AlertMessage>
      ) : null}

      <form action={saveAdminExternalCourseAction} className="space-y-6">
        {course.courseId ? <input name="courseId" type="hidden" value={course.courseId} /> : null}
        <PublicInformation data={data} />
        <IntegrationSettings data={data} />

        <section className="sticky bottom-4 z-20 rounded-[22px] border border-design-border bg-white/95 p-4 shadow-hero backdrop-blur">
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <ActionButton name="intent" type="submit" value="save_draft">
              Save draft
            </ActionButton>
            <ActionButton name="intent" type="submit" value="publish" variant="success">
              Publish
            </ActionButton>
            {course.courseId ? (
              <ActionButton name="intent" type="submit" value="unpublish" variant="warning">
                Unpublish
              </ActionButton>
            ) : null}
            <p className="text-xs leading-5 text-muted-text sm:ml-auto sm:max-w-md sm:text-right">
              No delete action is provided. Unpublish preserves historical course and audit records.
            </p>
          </div>
        </section>
      </form>

      <PreviewCards data={data} />
    </div>
  );
}
