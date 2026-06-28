import {
  addCreatorResourceAction,
  archiveCreatorResourceAction,
} from "@/lib/creator-materials-actions";
import type {
  CreatorResourceItem,
  CreatorResourcesData,
} from "@/lib/creator-materials-workflow";
import { ActionButton, EmptyState, StatusBadge } from "@/components/ui";
import { CreatorCourseContextBar } from "./CreatorCourseContextBar";
import type { ReactNode } from "react";

type CreatorResourcesProps = {
  data: CreatorResourcesData;
  materialsNotice?: string;
};

type ResourceFieldProps = {
  as?: "input" | "select" | "textarea";
  label: string;
  name: string;
  options?: string[];
  value: string;
};

const guidanceItems = [
  "Use clear titles.",
  "Keep resources directly linked to lesson activities.",
  "Mark internal-only resources clearly.",
  "Avoid including sensitive participant information.",
  "Use accessible file names and formats.",
];

const readinessItems = [
  "Resource titles are clear",
  "Learner-visible resources are useful for practice",
  "Internal resources are marked clearly",
  "Resource formats are appropriate",
  "Sensitive information is not included",
];

const noticeCopy: Record<string, { label: string; message: string; tone: "green" | "red" | "blue" }> = {
  archived: {
    label: "Archived",
    message: "The resource was removed from the active library.",
    tone: "green",
  },
  created: {
    label: "Added",
    message: "The resource was added to this course.",
    tone: "green",
  },
  invalid: {
    label: "Check resource",
    message: "Resource title, URL, file name, and file type are required.",
    tone: "red",
  },
  "missing-version": {
    label: "Missing version",
    message: "Create a draft course version before adding resources.",
    tone: "red",
  },
  unauthorized: {
    label: "Read-only",
    message: "This course cannot be edited while it is published or in review.",
    tone: "red",
  },
};

function ResourceField({
  as = "input",
  label,
  name,
  options,
  value,
}: ResourceFieldProps) {
  const id = `resource-${name}`;
  const controlClasses =
    "mt-2 min-h-11 w-full rounded-control border border-design-border bg-white px-4 text-sm text-dark-ink outline-none transition focus:border-dec-blue focus:ring-4 focus:ring-dec-blue/20";

  return (
    <label className="block text-sm font-medium text-dark-ink" htmlFor={id}>
      {label}
      {as === "textarea" ? (
        <textarea
          className={`${controlClasses} min-h-28 py-3 leading-6`}
          defaultValue={value}
          id={id}
          name={name}
        />
      ) : null}
      {as === "select" ? (
        <select className={controlClasses} defaultValue={value} id={id} name={name}>
          {(options ?? [value]).map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      ) : null}
      {as === "input" ? (
        <input
          className={controlClasses}
          defaultValue={value}
          id={id}
          name={name}
          type="text"
        />
      ) : null}
    </label>
  );
}

function ResourcesHeader({ data }: { data: CreatorResourcesData }) {
  const buildHref = `/creator/courses/${data.courseId}/quiz`;

  return (
    <section className="overflow-hidden rounded-[28px] border border-design-border bg-deep-navy p-6 text-white shadow-hero lg:p-8">
      <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_360px] xl:items-center">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge label={data.isEditable ? "Editable" : "Read-only"} tone={data.isEditable ? "green" : "gray"} />
            <StatusBadge label="Course materials" tone="blue" />
          </div>
          <h1 className="mt-5 text-4xl font-semibold leading-tight sm:text-5xl">
            Course Resources
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-white/75">
            Organize supporting materials that can strengthen lessons and
            participant practice.
          </p>
          <p className="mt-5 max-w-2xl text-sm font-semibold leading-6 text-white">
            {data.title}
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <ActionButton disabled={!data.isEditable} form="add-resource-form" type="submit" size="lg">
              Add Resource
            </ActionButton>
            <ActionButton
              href={`/creator/courses/${data.courseId}/outcomes`}
              size="lg"
              variant="secondary"
            >
              Back to Outcomes
            </ActionButton>
            <ActionButton href={buildHref} size="lg" variant="ghost">
              Continue to Final Test
            </ActionButton>
          </div>
        </div>

        <article className="rounded-[24px] border border-white/15 bg-white/10 p-5">
          <p className="text-sm font-semibold text-dec-green">Resource focus</p>
          <h2 className="mt-3 text-2xl font-semibold leading-tight">
            Keep materials purposeful and easy to use.
          </h2>
          <p className="mt-3 text-sm leading-6 text-white/70">
            Well-organized resources help participants practice course concepts
            and return to useful tools after the lesson.
          </p>
          <dl className="mt-6 grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-[16px] bg-white/10 p-3">
              <dt className="text-white/65">Resources</dt>
              <dd className="mt-1 text-2xl font-semibold text-white">
                {data.resources.length}
              </dd>
            </div>
            <div className="rounded-[16px] bg-white/10 p-3">
              <dt className="text-white/65">Current step</dt>
              <dd className="mt-1 font-semibold text-white">Resources</dd>
            </div>
          </dl>
        </article>
      </div>
    </section>
  );
}

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

function Notice({ materialsNotice }: { materialsNotice?: string }) {
  if (!materialsNotice || !noticeCopy[materialsNotice]) {
    return null;
  }

  const notice = noticeCopy[materialsNotice];

  return (
    <section className="rounded-[20px] border border-design-border bg-white-surface p-4 shadow-soft">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <StatusBadge label={notice.label} tone={notice.tone} />
        <p className="text-sm font-medium leading-6 text-dark-ink">{notice.message}</p>
      </div>
    </section>
  );
}

function ResourceCard({
  courseId,
  isEditable,
  resource,
}: {
  courseId: string;
  isEditable: boolean;
  resource: CreatorResourceItem;
}) {
  return (
    <article className="rounded-[22px] border border-design-border bg-white p-5 shadow-soft">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge label={resource.fileType} tone="blue" />
            <StatusBadge label={resource.accessibilityChecked ? "Accessibility checked" : "Needs accessibility check"} tone={resource.accessibilityChecked ? "green" : "gold"} />
          </div>
          <h3 className="mt-4 text-xl font-semibold leading-tight text-dark-ink">
            {resource.title}
          </h3>
          <p className="mt-2 text-sm leading-6 text-muted-text">{resource.description}</p>
          <dl className="mt-4 grid gap-3 text-sm text-muted-text md:grid-cols-3">
            <div className="rounded-[16px] bg-soft-bg p-3">
              <dt className="font-semibold text-dark-ink">File name</dt>
              <dd className="mt-1 break-words">{resource.fileName}</dd>
            </div>
            <div className="rounded-[16px] bg-soft-bg p-3">
              <dt className="font-semibold text-dark-ink">Uploaded</dt>
              <dd className="mt-1">{resource.uploadedAt}</dd>
            </div>
            <div className="rounded-[16px] bg-soft-bg p-3">
              <dt className="font-semibold text-dark-ink">Action label</dt>
              <dd className="mt-1">{resource.downloadLabel}</dd>
            </div>
          </dl>
        </div>
        <div className="flex flex-wrap gap-2 xl:w-52 xl:justify-end">
          <ActionButton href={resource.fileUrl} variant="ghost" size="sm">
            View
          </ActionButton>
          <form action={archiveCreatorResourceAction}>
            <input name="courseId" type="hidden" value={courseId} />
            <input name="resourceId" type="hidden" value={resource.id} />
            <input name="returnPath" type="hidden" value={`/creator/courses/${courseId}/resources`} />
            <ActionButton disabled={!isEditable} type="submit" variant="ghost" size="sm">
              Archive
            </ActionButton>
          </form>
        </div>
      </div>
    </article>
  );
}

function ResourceLibrary({ data }: { data: CreatorResourcesData }) {
  return (
    <Panel
      description="Keep resource materials tied to the lessons where participants will use them."
      title="Resource library"
    >
      <div className="space-y-4">
        {data.resources.length > 0 ? (
          data.resources.map((resource) => (
            <ResourceCard
              courseId={data.courseId}
              isEditable={data.isEditable}
              key={resource.id}
              resource={resource}
            />
          ))
        ) : (
          <EmptyState
            description="Add a resource link, template, worksheet, checklist, or reading for this course."
            title="No resources yet"
          />
        )}
      </div>
    </Panel>
  );
}

function AddResourceCard({ data }: { data: CreatorResourcesData }) {
  return (
    <Panel
      description="Describe the material and where it supports the course before adding it to the resource library."
      title="Add resource"
    >
      <form action={addCreatorResourceAction} className="space-y-5" id="add-resource-form">
        <input name="courseId" type="hidden" value={data.courseId} />
        <input name="returnPath" type="hidden" value={`/creator/courses/${data.courseId}/resources`} />
        <div className="grid gap-5 md:grid-cols-2">
          <ResourceField label="Resource title" name="title" value="" />
          <ResourceField
            as="select"
            label="File type"
            name="fileType"
            options={["PDF", "DOCX", "PPTX", "Link", "Worksheet", "Template"]}
            value="PDF"
          />
          <ResourceField label="File URL" name="fileUrl" value="" />
          <ResourceField label="File name" name="fileName" value="" />
          <ResourceField label="Download label" name="downloadLabel" value="Open resource" />
          <label className="flex min-h-11 items-center gap-3 rounded-control border border-design-border bg-white px-4 text-sm font-medium text-dark-ink">
            <input className="size-4 accent-dec-blue" name="accessibilityChecked" type="checkbox" />
            Accessibility checked
          </label>
          <ResourceField
            as="textarea"
            label="Short description"
            name="description"
            value=""
          />
          <ResourceField
            as="textarea"
            label="Accessibility notes"
            name="accessibilityNotes"
            value=""
          />
        </div>
        <div>
          <ActionButton disabled={!data.isEditable} type="submit">
            Add Resource
          </ActionButton>
        </div>
      </form>
    </Panel>
  );
}

function GuidanceCard() {
  return (
    <article className="rounded-[24px] border border-design-border bg-white-surface p-6 shadow-soft">
      <StatusBadge label="Resource quality" tone="blue" />
      <h2 className="mt-4 text-xl font-semibold text-deep-navy">
        Resource quality guidance
      </h2>
      <ul className="mt-6 space-y-4">
        {guidanceItems.map((item) => (
          <li className="flex gap-3" key={item}>
            <span
              aria-hidden="true"
              className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-dec-blue/10 text-[10px] font-bold text-[#216f9d]"
            >
              OK
            </span>
            <span className="text-sm leading-6 text-muted-text">{item}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}

function ReadinessChecklist({ hasResources }: { hasResources: boolean }) {
  return (
    <article className="rounded-[24px] border border-design-border bg-white-surface p-6 shadow-soft">
      <StatusBadge label="Readiness" tone={hasResources ? "green" : "gold"} />
      <h2 className="mt-4 text-xl font-semibold text-deep-navy">
        Lightweight readiness checklist
      </h2>
      <ul className="mt-6 space-y-4">
        {readinessItems.map((item, index) => (
          <li className="flex gap-3" key={item}>
            <span
              aria-hidden="true"
              className={`mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
                index === 0 && !hasResources
                  ? "bg-amber-50 text-amber-700"
                  : "bg-dec-green/20 text-[#426f1c]"
              }`}
            >
              {index === 0 && !hasResources ? "!" : "OK"}
            </span>
            <span className="text-sm leading-6 text-muted-text">{item}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}

export function CreatorResources({
  data,
  materialsNotice,
}: CreatorResourcesProps) {
  return (
    <div className="space-y-6">
      <ResourcesHeader data={data} />
      <Notice materialsNotice={materialsNotice} />
      <CreatorCourseContextBar
        ariaLabel="Course resources context"
        items={[
          { label: "Course", value: data.title },
          { label: "Capacity area", value: data.capacityArea },
          { label: "Resources", value: String(data.resources.length) },
          { label: "Course status", value: data.status.replaceAll("_", " ").toLowerCase() },
          { label: "Current step", value: "Resources" },
        ]}
      />

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px] xl:items-start">
        <div className="space-y-6">
          <ResourceLibrary data={data} />
          <AddResourceCard data={data} />
          <div className="flex flex-col gap-3 rounded-[24px] border border-design-border bg-white-surface p-5 shadow-soft sm:flex-row sm:flex-wrap sm:justify-end">
            <ActionButton disabled={!data.isEditable} form="add-resource-form" type="submit">
              Add Resource
            </ActionButton>
            <ActionButton
              href={`/creator/courses/${data.courseId}/outcomes`}
              variant="secondary"
            >
              Back to Outcomes
            </ActionButton>
            <ActionButton href={`/creator/courses/${data.courseId}/quiz`} variant="ghost">
              Continue to Final Test
            </ActionButton>
          </div>
        </div>

        <aside className="space-y-5">
          <GuidanceCard />
          <ReadinessChecklist hasResources={data.resources.length > 0} />
        </aside>
      </section>
    </div>
  );
}
