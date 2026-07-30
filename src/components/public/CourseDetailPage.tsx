import { CourseCoverVisual } from "@/components/course/CourseCoverVisual";
import { ActionButton, StatusBadge } from "@/components/ui";
import type { PublicCatalogueCourseDetail } from "@/lib/course-types";
import Link from "next/link";

export type PublicCourseAction = {
  href?: string;
  label:
    | "Start course"
    | "Continue course"
    | "Sign in to access"
    | "Invitation required"
    | "Open course";
  rel?: "noreferrer";
  target?: "_blank";
};

type IconProps = { className?: string };

const ShieldIcon = ({ className }: IconProps) => (
  <svg aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path d="M12 3 19 6v5c0 4.6-2.9 8.1-7 10-4.1-1.9-7-5.4-7-10V6l7-3Z" strokeLinejoin="round" />
    <path d="m9 12 2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

function sanitizeFormatLabel(format: string) {
  const f = format.toLowerCase();
  if (f.includes("hub-tracked") || f.includes("embedded")) {
    return "Interactive online course";
  }
  return format;
}

const HRBA_DETAILED_JOURNEY = [
  { num: "01", title: "Starting the Journey", desc: "Introduction to the Capacity Development Program context, system navigation, and safe learning boundaries." },
  { num: "02", title: "HRBA Foundations", desc: "Recognizing rights-holders, duty-bearers, and supporting actors in your local civil society context." },
  { num: "03", title: "HRBA in Project Design", desc: "Analyzing structural power relationships, mapping barriers to inclusion, and crafting proposals." },
  { num: "04", title: "HRBA in Implementation", desc: "Applying active participation, non-discrimination, and dignity standards in everyday project delivery." },
  { num: "05", title: "HRBA in MEAL", desc: "Formulating rights-oriented progress indicators and utilizing safe qualitative evidence files." },
  { num: "06", title: "Final Assessment and Certificate", desc: "Complete the online quiz (80% passing score threshold) to earn your digital course certificate." },
];

function Breadcrumb({ title }: { title: string }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-300">
      <Link className="hover:text-white transition" href="/">
        Home
      </Link>
      <span aria-hidden="true">&bull;</span>
      <Link className="hover:text-white transition" href="/courses">
        Courses
      </Link>
      <span aria-hidden="true">&bull;</span>
      <span className="text-slate-100 truncate max-w-[240px] sm:max-w-none" aria-current="page">
        {title}
      </span>
    </nav>
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
  const requiresInvitation = course.accessState === "invitation_required";
  const isAssigned =
    requiresInvitation &&
    Boolean(action?.href) &&
    (action?.label === "Start course" || action?.label === "Continue course");

  const statusLabel = !isAvailable
    ? "Coming soon"
    : isAssigned
      ? "Assigned"
      : requiresInvitation
        ? "Invitation required"
        : "Available now";

  return (
    <section className="overflow-hidden rounded-card bg-deep-navy text-white shadow-hero" aria-labelledby="detail-hero-title">
      <div className="grid gap-10 px-6 py-12 sm:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:px-12 lg:py-16">
        <div>
          <Breadcrumb title={course.title} />
          
          <div className="flex flex-wrap gap-2">
            <StatusBadge
              label={statusLabel}
              tone={isAssigned ? "green" : isAvailable ? (requiresInvitation ? "gold" : "green") : "gray"}
            />
            <StatusBadge label={course.primaryCapacityArea.name} tone="blue" />
            {course.integrationStatus === "integration_pending" && (
              <StatusBadge label="Integration pending" tone="gold" />
            )}
          </div>

          <h1 id="detail-hero-title" className="mt-6 font-display text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">
            {course.title}
          </h1>
          <p className="mt-5 text-base leading-7 text-slate-200">
            {course.shortDescription}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            {action?.href ? (
              <ActionButton href={action.href} rel={action.rel} size="lg" target={action.target}>
                {action.label}
              </ActionButton>
            ) : action ? (
              <span className="inline-flex min-h-12 items-center justify-center rounded-control border border-white/25 bg-white/10 px-5 py-3 text-base font-semibold text-white">
                {action.label}
              </span>
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
              Back to catalogue
            </ActionButton>
          </div>
        </div>

        <div className="relative aspect-video overflow-hidden rounded-card border border-white/10 shadow-hero">
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

function CourseMetaItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-card border border-design-border bg-white px-4 py-3 shadow-soft">
      <p className="text-2xs font-extrabold uppercase tracking-wider text-muted-text">
        {label}
      </p>
      <p className="mt-1 text-xs font-semibold leading-relaxed text-deep-navy">{value}</p>
    </div>
  );
}

function CourseInformationSidebar({
  action,
  course,
}: {
  action: PublicCourseAction | null;
  course: PublicCatalogueCourseDetail;
}) {
  const isAvailable = course.availability === "available";
  const requiresInvitation = course.accessState === "invitation_required";
  const isAssigned =
    requiresInvitation &&
    Boolean(action?.href) &&
    (action?.label === "Start course" || action?.label === "Continue course");

  const informationItems = [
    { label: "Format", value: sanitizeFormatLabel(course.deliveryFormat) },
    { label: "Duration", value: course.duration },
    { label: "Language", value: course.language },
    {
      label: "Access",
      value: !isAvailable
        ? "Coming soon"
        : isAssigned
          ? "Assigned to your profile"
          : requiresInvitation
            ? "Invitation required"
            : "Open registration",
    },
  ];

  if (isAvailable) {
    informationItems.push(
      { label: "Progress tracking", value: "Saved to your account" },
      { label: "Assessment", value: "Online quiz (80% threshold)" },
      { label: "Certificate", value: "Verified PDF eligible" }
    );
  }

  return (
    <aside className="rounded-card border border-design-border bg-white p-5 shadow-soft lg:sticky lg:top-28" aria-labelledby="sidebar-title">
      <h2 id="sidebar-title" className="text-xs font-black uppercase tracking-[0.16em] text-dec-blue">
        Course at a glance
      </h2>
      <div className="mt-5 grid gap-3">
        {informationItems.map((item) => (
          <CourseMetaItem key={item.label} {...item} />
        ))}
      </div>
      <div className="mt-5 rounded-card border border-design-border bg-soft-bg p-4">
        <p className="text-2xs font-extrabold uppercase tracking-wider text-muted-text">
          Primary capacity area
        </p>
        <p className="mt-1 text-xs font-bold leading-normal text-deep-navy">
          {course.primaryCapacityArea.name}
        </p>
      </div>
      {course.secondaryCapacityAreas.length > 0 && (
        <div className="mt-3 rounded-card border border-design-border bg-soft-bg p-4">
          <p className="text-2xs font-extrabold uppercase tracking-wider text-muted-text">
            Secondary capacity areas
          </p>
          <ul className="mt-1.5 grid gap-1.5 text-xs font-semibold text-deep-navy">
            {course.secondaryCapacityAreas.map((area) => (
              <li key={area.id}>&bull; {area.name}</li>
            ))}
          </ul>
        </div>
      )}
      <ActionButton className="mt-5 w-full" href="/courses" variant="secondary">
        Back to catalogue
      </ActionButton>
    </aside>
  );
}

function CourseOverview({ course }: { course: PublicCatalogueCourseDetail }) {
  return (
    <section className="rounded-card border border-design-border bg-white p-6 shadow-soft sm:p-8" aria-labelledby="about-title">
      <div className="border-b border-design-border pb-4">
        <span className="text-2xs font-extrabold uppercase tracking-wider text-dec-blue">Overview</span>
        <h2 id="about-title" className="mt-1 font-display text-2xl font-bold text-deep-navy">
          About this course
        </h2>
      </div>
      <div className="mt-6 space-y-4 text-sm leading-7 text-muted-text">
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

function LearningOutcomes({ course }: { course: PublicCatalogueCourseDetail }) {
  return (
    <section className="rounded-card border border-design-border bg-white p-6 shadow-soft sm:p-8" aria-labelledby="outcomes-title">
      <div className="border-b border-design-border pb-4">
        <span className="text-2xs font-extrabold uppercase tracking-wider text-dec-blue">Outcomes</span>
        <h2 id="outcomes-title" className="mt-1 font-display text-2xl font-bold text-deep-navy">
          What this course helps learners do
        </h2>
      </div>
      {course.learningOutcomes.length > 0 ? (
        <ol className="mt-6 grid gap-4">
          {course.learningOutcomes.map((outcome, index) => (
            <li className="flex gap-4 rounded-card bg-light-bg p-4 border border-design-border" key={outcome}>
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-dec-blue text-sm font-black text-white">
                {String(index + 1).padStart(2, "0")}
              </span>
              <p className="pt-1 text-xs leading-6 text-deep-navy font-semibold">{outcome}</p>
            </li>
          ))}
        </ol>
      ) : (
        <p className="mt-6 rounded-card bg-light-bg p-5 border border-design-border text-xs leading-6 text-muted-text italic">
          Learning outcomes have not yet been approved for this course.
        </p>
      )}
    </section>
  );
}

function ModuleJourney({ course }: { course: PublicCatalogueCourseDetail }) {
  const isHrba = course.slug === "applying-human-rights-based-approach-in-cso-practice";
  const items = isHrba
    ? HRBA_DETAILED_JOURNEY
    : course.modules.map((m, idx) => ({
        num: `0${idx + 1}`,
        title: m.title,
        desc: m.summary || m.topics.join(", "),
      }));

  if (items.length === 0) {
    return (
      <section className="rounded-card bg-white border border-design-border p-6 shadow-soft" aria-labelledby="journey-title">
        <h2 id="journey-title" className="text-base font-bold text-deep-navy">Proposed course structure</h2>
        <p className="mt-3 text-xs leading-6 text-muted-text">{course.proposedStructureSummary}</p>
      </section>
    );
  }

  return (
    <section aria-labelledby="journey-title" className="rounded-card border border-design-border bg-white p-6 shadow-soft sm:p-8">
      <div className="border-b border-design-border pb-4 mb-8">
        <span className="text-2xs font-extrabold uppercase tracking-wider text-dec-blue">Journey</span>
        <h2 id="journey-title" className="mt-1 font-display text-2xl font-bold text-deep-navy">
          Module learning journey
        </h2>
      </div>

      <div className="relative pl-6 sm:pl-8 border-l-2 border-design-border space-y-8">
        {items.map((item) => (
          <article className="relative flex flex-col items-start" key={item.title}>
            <span className="absolute -left-[39px] sm:-left-[47px] top-0.5 flex h-7 w-7 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-dec-blue font-sans text-xs font-black text-white ring-4 ring-white">
              {item.num}
            </span>
            <div className="ml-4">
              <h3 className="text-base font-bold text-deep-navy">{item.title}</h3>
              <p className="mt-2 text-xs leading-6 text-muted-text">{item.desc}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function LearningApproachSection({ course }: { course: PublicCatalogueCourseDetail }) {
  return (
    <section className="rounded-card border border-design-border bg-white p-6 shadow-soft sm:p-8" aria-labelledby="approach-title">
      <div className="border-b border-design-border pb-4">
        <span className="text-2xs font-extrabold uppercase tracking-wider text-dec-blue">Method</span>
        <h2 id="approach-title" className="mt-1 font-display text-2xl font-bold text-deep-navy">
          How learning works in the course
        </h2>
      </div>
      <p className="mt-4 text-sm leading-6 text-muted-text">
        The Hub is built around the actual workloads of CSO staff. Rather than reading textbooks, you will analyze situations, decide on courses of action, and download templates to review offline.
      </p>
      {course.learningApproach.length > 0 ? (
        <ul className="mt-6 grid gap-3 sm:grid-cols-2">
          {course.learningApproach.map((item) => (
            <li className="rounded-card border border-design-border bg-light-bg p-4 text-xs font-semibold leading-relaxed text-deep-navy" key={item}>
              {item}
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-6 rounded-card border border-design-border bg-light-bg p-5 text-xs leading-6 text-muted-text italic">
          Learning methods and expected activities are still being designed.
        </p>
      )}
    </section>
  );
}

function PracticalOutputs({ course }: { course: PublicCatalogueCourseDetail }) {
  return (
    <section className="rounded-card border border-design-border bg-white p-6 shadow-soft sm:p-8" aria-labelledby="outputs-title">
      <div className="border-b border-design-border pb-4">
        <span className="text-2xs font-extrabold uppercase tracking-wider text-dec-blue">Application</span>
        <h2 id="outputs-title" className="mt-1 font-display text-2xl font-bold text-deep-navy">
          Practical outputs and team reflection
        </h2>
      </div>
      <p className="mt-4 text-sm leading-6 text-muted-text">
        Each learner tracks progress individually. After compiling templates or checklists in the course player, download them to run a team review session within your local organization.
      </p>
      {course.practicalOutputs.length > 0 ? (
        <ul className="mt-6 grid gap-3">
          {course.practicalOutputs.map((output) => (
            <li className="rounded-card border border-design-border bg-light-bg p-4 text-xs font-semibold leading-relaxed text-deep-navy" key={output}>
              {output}
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-6 rounded-card border border-design-border bg-light-bg p-5 text-xs leading-6 text-muted-text italic">
          Practical outputs have not yet been defined for this course.
        </p>
      )}
    </section>
  );
}

function SafeParticipationNotice() {
  return (
    <article className="rounded-card border border-[#cad5df] bg-[#f7f8f5] p-6 shadow-soft" aria-labelledby="safety-notice-title">
      <div className="flex gap-4 items-start">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-soft-bg text-[#0f8f8c]">
          <ShieldIcon className="h-5 w-5" />
        </span>
        <div>
          <h3 id="safety-notice-title" className="text-base font-bold text-deep-navy">
            Safe participation guidelines
          </h3>
          <p className="mt-2 text-xs leading-5 text-muted-text">
            To protect individual safety and institutional records, please **do not upload or enter survivor names, private case histories, sensitive donor files, or confidential practitioner records** in any learning activities. Use fictional names or non-confidential scenarios for all practice exercises.
          </p>
        </div>
      </div>
    </article>
  );
}

function AssessmentAndSupport({ course }: { course: PublicCatalogueCourseDetail }) {
  const isAvailable = course.availability === "available";

  return (
    <section className="grid gap-6 sm:grid-cols-2" aria-label="Assessment and support details">
      <article className="rounded-card border border-design-border bg-white p-6 shadow-soft sm:p-8">
        <span className="text-2xs font-extrabold uppercase tracking-wider text-dec-blue">Evaluation</span>
        <h3 className="mt-1 text-xl font-bold text-deep-navy">Assessment and certificate</h3>
        <p className="mt-4 text-xs leading-6 text-muted-text">{course.assessmentStatus}</p>
        <p className="mt-3 text-xs leading-6 text-muted-text">{course.certificateStatus}</p>
        {isAvailable && course.completionRule && (
          <p className="mt-4 rounded-card bg-[#eaf7ef] p-4 text-xs font-bold leading-normal text-[#2f6b3b] border border-dec-green/30">
            {course.completionRule}
          </p>
        )}
      </article>
      <article className="rounded-card border border-design-border bg-white p-6 shadow-soft sm:p-8">
        <span className="text-2xs font-extrabold uppercase tracking-wider text-dec-blue">Resources</span>
        <h3 className="mt-1 text-xl font-bold text-deep-navy">Help while learning</h3>
        <p className="mt-4 text-xs leading-6 text-muted-text">{course.resourcesAndSupport}</p>
        <ActionButton className="mt-5" href="/support" variant="secondary">
          Visit support page
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
    <section className="py-12" aria-labelledby="closing-cta-title">
      <div className="rounded-card bg-deep-navy px-6 py-12 text-center text-white shadow-hero sm:px-10">
        <h2 id="closing-cta-title" className="font-display text-3xl font-bold leading-tight sm:text-4xl">
          {isAvailable ? "Ready to begin?" : "Course access is being prepared"}
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-xs leading-6 text-slate-200">
          {isAvailable
            ? availableDescription
            : "You can review the confirmed course position now. Enrollment and launch will be enabled only after the course is integrated and approved."}
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          {action ? (
            <ActionButton
              className="border-white bg-white text-deep-navy hover:bg-slate-100 hover:text-deep-navy"
              href={action.href}
              rel={action.rel}
              size="md"
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
          <ActionButton
            className="border-white/40 bg-transparent text-white hover:bg-white/10"
            href="/courses"
            size="md"
          >
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
    <div className="flex flex-col bg-light-bg pb-20">
      {/* 1. Hero (includes Breadcrumb) */}
      <CourseHero action={action} course={course} />

      <div className="grid gap-8 py-12 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
        <div className="grid gap-8">
          {/* 2. Overview */}
          <CourseOverview course={course} />

          {/* 3. Outcomes */}
          <LearningOutcomes course={course} />

          {/* 4. Journey timeline */}
          <ModuleJourney course={course} />

          {/* 5. Method */}
          <LearningApproachSection course={course} />

          {/* 6. Application */}
          <PracticalOutputs course={course} />

          {/* 7. Safety notice */}
          <SafeParticipationNotice />

          {/* 8. Assessment and support */}
          <AssessmentAndSupport course={course} />
        </div>

        {/* 9. Sidebar At-a-glance */}
        <CourseInformationSidebar action={action} course={course} />
      </div>

      {/* 10. Bottom Action Block */}
      <ClosingAction action={action} course={course} />
    </div>
  );
}
