"use client";

import { useState } from "react";
import { saveCreatorCourseSetupAction } from "@/lib/creator-course-actions";
import type { CreatorCourseSetupData } from "@/lib/creator-course-workflow";
import { ActionButton, StatusBadge } from "@/components/ui";
import { CreatorCourseContextBar } from "./CreatorCourseContextBar";
import type { ReactNode } from "react";

type CreatorCourseSetupProps = {
  setup: CreatorCourseSetupData;
  setupNotice?: string;
};

type FieldProps = {
  as?: "input" | "select" | "textarea";
  helper?: string;
  label: string;
  name: string;
  options?: Array<{ label: string; value: string }>;
  type?: "number" | "text";
  value: string;
};

const setupSteps = [
  "Complete course basics",
  "Add outcomes and structure",
  "Build lesson blocks",
  "Preview learner experience",
  "Submit for review",
];

const noticeCopy: Record<string, { label: string; message: string; tone: "green" | "red" | "blue" }> = {
  created: {
    label: "Created",
    message: "Course setup was created and is ready for editing.",
    tone: "green",
  },
  invalid: {
    label: "Check required fields",
    message: "Course title and short description are required.",
    tone: "red",
  },
  saved: {
    label: "Saved",
    message: "Course setup changes were saved.",
    tone: "green",
  },
  unauthorized: {
    label: "Not saved",
    message: "This course cannot be edited with the current account.",
    tone: "red",
  },
};

const languageOptions = ["English", "Amharic", "Afan Oromo", "Tigrinya"].map((value) => ({
  label: value,
  value,
}));

const levelOptions = ["Introductory", "Foundational", "Intermediate", "Advanced", "Mixed"].map(
  (value) => ({ label: value, value }),
);

const accessOptions = ["Public", "Assigned", "Restricted"].map((value) => ({
  label: value,
  value,
}));

const yesNoOptions = ["Yes", "No"].map((value) => ({
  label: value,
  value,
}));

const compactButtonClasses =
  "inline-flex min-h-9 items-center justify-center rounded-control border border-design-border bg-white px-3 py-2 text-xs font-semibold leading-none text-dark-ink transition hover:border-dec-blue hover:text-dec-blue focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dec-blue disabled:cursor-not-allowed disabled:opacity-50";

function Field({
  as = "input",
  helper,
  label,
  name,
  options,
  type = "text",
  value,
}: FieldProps) {
  const id = `course-setup-${name}`;
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
          {(options ?? [{ label: value, value }]).map((option) => (
            <option key={option.value || option.label} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : null}
      {as === "input" ? (
        <input
          className={controlClasses}
          defaultValue={value}
          id={id}
          min={type === "number" ? 1 : undefined}
          name={name}
          type={type}
        />
      ) : null}
      {helper ? (
        <span className="mt-2 block text-xs leading-5 text-muted-text">{helper}</span>
      ) : null}
    </label>
  );
}

function SetupHeader({
  isNew,
  setup,
}: {
  isNew: boolean;
  setup: CreatorCourseSetupData;
}) {
  const buildHref = setup.courseId ? `/creator/courses/${setup.courseId}/build` : "";

  return (
    <section className="overflow-hidden rounded-[28px] border border-design-border bg-deep-navy p-6 text-white shadow-hero lg:p-8">
      <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_360px] xl:items-center">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge label={setup.status} tone="green" />
            <StatusBadge label="Course preparation" tone="blue" />
          </div>
          <h1 className="mt-5 text-4xl font-semibold leading-tight sm:text-5xl">
            {isNew ? "Create Course" : "Course Setup"}
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-white/75">
            Define the basic course information before building lessons.
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <ActionButton type="submit" size="lg">
              Save Setup
            </ActionButton>
            <ActionButton href="/creator/courses" size="lg" variant="secondary">
              Back to My Courses
            </ActionButton>
            {buildHref ? (
              <ActionButton href={buildHref} size="lg" variant="ghost">
                Continue to Build Studio
              </ActionButton>
            ) : (
              <ActionButton disabled size="lg" variant="ghost">
                Continue to Build Studio
              </ActionButton>
            )}
          </div>
        </div>

        <article className="rounded-[24px] border border-white/15 bg-white/10 p-5">
          <p className="text-sm font-semibold text-dec-green">Setup focus</p>
          <h2 className="mt-3 text-2xl font-semibold leading-tight">
            Keep course basics clear before content building begins.
          </h2>
          <p className="mt-3 text-sm leading-6 text-white/70">
            Course title, audience, access, certificate settings, and capacity area
            are gathered here in a simple preparation view.
          </p>
          <dl className="mt-6 grid gap-3 text-sm">
            <div className="rounded-[16px] bg-white/10 p-3">
              <dt className="text-white/65">Current course</dt>
              <dd className="mt-1 font-semibold leading-5 text-white">
                {setup.courseTitle || "New course"}
              </dd>
            </div>
            <div className="rounded-[16px] bg-white/10 p-3">
              <dt className="text-white/65">Current step</dt>
              <dd className="mt-1 font-semibold text-white">Setup</dd>
            </div>
          </dl>
        </article>
      </div>
    </section>
  );
}

function FormCard({
  children,
  description,
  title,
}: {
  children: ReactNode;
  description: string;
  title: string;
}) {
  return (
    <section className="rounded-[24px] border border-design-border bg-white-surface p-6 shadow-soft">
      <div className="max-w-3xl">
        <h2 className="text-2xl font-semibold leading-tight text-dark-ink">{title}</h2>
        <p className="mt-2 text-sm leading-6 text-muted-text">{description}</p>
      </div>
      <div className="mt-6 grid gap-5 md:grid-cols-2">{children}</div>
    </section>
  );
}

function Notice({ setupNotice }: { setupNotice?: string }) {
  if (!setupNotice || !noticeCopy[setupNotice]) {
    return null;
  }

  const notice = noticeCopy[setupNotice];

  return (
    <section className="rounded-[20px] border border-design-border bg-white-surface p-4 shadow-soft">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <StatusBadge label={notice.label} tone={notice.tone} />
        <p className="text-sm font-medium leading-6 text-dark-ink">{notice.message}</p>
      </div>
    </section>
  );
}

// ==================== NEW THUMBNAIL FIELD WITH UPLOAD ====================
function ThumbnailField({
  courseId,
  courseTitle,
  initialUrl,
}: {
  courseId?: string | null;
  courseTitle?: string;
  initialUrl: string;
}) {
  const [thumbnailUrl, setThumbnailUrl] = useState(initialUrl);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSource, setUploadSource] = useState<"url" | "file">(
    initialUrl && !initialUrl.startsWith("/assets/") ? "url" : "file"
  );

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file (jpg, png, etc.)");
      return;
    }
    if (!courseId || !courseTitle) {
      alert("Please save the course first (title required) before uploading an image.");
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("courseId", courseId);
    formData.append("courseTitle", courseTitle);

    try {
      const res = await fetch("/api/upload-course-thumbnail", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      setThumbnailUrl(data.url);
    } catch (error) {
      console.error(error);
      alert("Upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="md:col-span-2">
      <label className="block text-sm font-medium text-dark-ink">
        Course Thumbnail / Cover Image
      </label>
      <div className="mt-2 flex gap-4">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="radio"
            name="thumbnailSource"
            value="url"
            checked={uploadSource === "url"}
            onChange={() => setUploadSource("url")}
          />
          External URL
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="radio"
            name="thumbnailSource"
            value="file"
            checked={uploadSource === "file"}
            onChange={() => setUploadSource("file")}
            disabled={!courseId}
          />
          Upload image {!courseId && "(save course first)"}
        </label>
      </div>

      {uploadSource === "url" ? (
        <input
          type="text"
          name="coverImageUrl"
          className="mt-2 min-h-11 w-full rounded-control border border-design-border bg-white px-4 text-sm text-dark-ink outline-none transition focus:border-dec-blue focus:ring-4 focus:ring-dec-blue/20"
          value={thumbnailUrl}
          onChange={(e) => setThumbnailUrl(e.target.value)}
          placeholder="https://example.com/course-thumbnail.jpg"
        />
      ) : (
        <div className="mt-2">
          {/* Hidden input to store the final URL for the server action */}
          <input type="hidden" name="coverImageUrl" value={thumbnailUrl} />
          <div className="flex gap-2 items-center">
            <label className={`${compactButtonClasses} cursor-pointer`}>
              {isUploading ? "Uploading..." : "Choose image"}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileUpload}
                disabled={isUploading || !courseId}
              />
            </label>
            {isUploading && <span className="text-sm text-muted-text">Uploading...</span>}
            {thumbnailUrl && !isUploading && (
              <span className="text-sm text-dec-green">✓ Image uploaded</span>
            )}
          </div>
          {thumbnailUrl && (
            <div className="mt-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={thumbnailUrl}
                alt="Thumbnail preview"
                className="max-h-32 rounded object-cover border border-design-border"
              />
            </div>
          )}
        </div>
      )}
      <p className="mt-2 text-xs leading-5 text-muted-text">
        Used on the course catalogue card, course detail page, and course preview.
      </p>
    </div>
  );
}
// ==================== END THUMBNAIL FIELD ====================

function GuidanceCard() {
  return (
    <aside className="space-y-5">
      <article className="rounded-[24px] border border-design-border bg-white-surface p-6 shadow-soft">
        <StatusBadge label="Course creation flow" tone="blue" />
        <h2 className="mt-4 text-xl font-semibold text-deep-navy">
          Course preparation steps
        </h2>
        <ol className="mt-6 space-y-4">
          {setupSteps.map((step, index) => (
            <li className="flex gap-4" key={step}>
              <span className="flex size-9 shrink-0 items-center justify-center rounded-control bg-dec-green/15 text-sm font-semibold text-[#426f1c]">
                {index + 1}
              </span>
              <span className="pt-1 text-sm leading-6 text-muted-text">{step}</span>
            </li>
          ))}
        </ol>
      </article>

      <article className="rounded-[24px] border border-dashed border-dec-blue/35 bg-dec-blue/10 p-6">
        <StatusBadge label="Setup note" tone="green" />
        <h2 className="mt-4 text-xl font-semibold text-deep-navy">
          Review before continuing
        </h2>
        <p className="mt-3 text-sm leading-7 text-[#26536c]">
          Review the setup details before continuing to the next course
          preparation step.
        </p>
      </article>
    </aside>
  );
}

export function CreatorCourseSetup({
  setup,
  setupNotice,
}: CreatorCourseSetupProps) {
  const isNew = setup.mode === "new";
  const buildHref = setup.courseId ? `/creator/courses/${setup.courseId}/build` : "";
  const capacityOptions = [
    { label: "Not selected", value: "" },
    ...setup.capacityOptions.map((option) => ({
      label: option.name,
      value: option.id,
    })),
  ];

  return (
    <form action={saveCreatorCourseSetupAction} className="space-y-6">
      <input name="courseId" type="hidden" value={setup.courseId ?? ""} />
      <SetupHeader isNew={isNew} setup={setup} />
      <Notice setupNotice={setupNotice} />
      <CreatorCourseContextBar
        ariaLabel="Course setup context"
        items={[
          { label: "Course", value: setup.courseTitle || "New course" },
          { label: "Status", value: setup.status },
          { label: "Capacity area", value: setup.capacityAreaName },
          { label: "Certificate", value: setup.certificateIncluded },
          { label: "Current step", value: "Setup" },
        ]}
      />

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px] xl:items-start">
        <div className="space-y-6">
          <FormCard
            description="Set the core title, summary, access, language, level, and duration."
            title="Basic course information"
          >
            <Field label="Course title" name="courseTitle" value={setup.courseTitle} />
            <Field
              as="select"
              label="Course language"
              name="language"
              options={languageOptions}
              value={setup.language}
            />
            <Field
              as="textarea"
              label="Short description"
              name="shortDescription"
              value={setup.shortDescription}
            />
            <Field
              helper="Enter minutes as a number."
              label="Estimated duration"
              name="duration"
              type="number"
              value={setup.duration}
            />
            <ThumbnailField
              courseId={setup.courseId}
              courseTitle={setup.courseTitle}
              initialUrl={setup.coverImageUrl}
            />
            <Field
              as="select"
              label="Course level"
              name="level"
              options={levelOptions}
              value={setup.level}
            />
            <Field
              as="select"
              label="Access type"
              name="accessType"
              options={accessOptions}
              value={setup.accessType}
            />
          </FormCard>

          <FormCard
            description="Describe who the course is for and the practical learning need it addresses."
            title="Audience and capacity area"
          >
            <Field
              as="textarea"
              label="Primary audience"
              name="primaryAudience"
              value={setup.primaryAudience}
            />
            <Field
              as="select"
              label="Capacity area"
              name="capacityAreaId"
              options={capacityOptions}
              value={setup.capacityAreaId}
            />
            <Field
              label="Target CSO profile"
              name="targetProfile"
              value={setup.targetProfile}
            />
            <Field
              as="textarea"
              label="Learning need addressed"
              name="learningNeed"
              value={setup.learningNeed}
            />
          </FormCard>

          <FormCard
            description="Confirm the certificate and final test settings that shape course completion."
            title="Certificate and final test settings"
          >
            <Field
              as="select"
              label="Certificate included"
              name="certificateIncluded"
              options={yesNoOptions}
              value={setup.certificateIncluded}
            />
            <Field
              as="select"
              label="Final test required"
              name="finalTestRequired"
              options={yesNoOptions}
              value={setup.finalTestRequired}
            />
            <Field
              helper="Use a whole-number pass percentage."
              label="Pass score"
              name="passScore"
              type="number"
              value={setup.passScore}
            />
            <Field
              label="Number of questions"
              name="questionCount"
              type="number"
              value={setup.questionCount}
            />
          </FormCard>

          <div className="flex flex-col gap-3 rounded-[24px] border border-design-border bg-white-surface p-5 shadow-soft sm:flex-row sm:flex-wrap sm:justify-end">
            <ActionButton type="submit">Save Setup</ActionButton>
            <ActionButton href="/creator/courses" variant="secondary">
              Back to My Courses
            </ActionButton>
            {buildHref ? (
              <ActionButton href={buildHref} variant="ghost">
                Continue to Build Studio
              </ActionButton>
            ) : (
              <ActionButton disabled variant="ghost">
                Continue to Build Studio
              </ActionButton>
            )}
          </div>
        </div>

        <GuidanceCard />
      </section>
    </form>
  );
}
