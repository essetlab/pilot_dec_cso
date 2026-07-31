import { notFound } from "next/navigation";
import { isLocalQaFixtureAllowed } from "@/lib/local-qa-guard";
import { getCurrentSession } from "@/lib/auth/server";
import { getLearnerCourseBySlug, getDemoDetail, getLearnerDetail } from "@/lib/course-data";
import { CoursePlayerShell } from "@/components/shell/CoursePlayerShell";
import { LearnerTemplateRenderer } from "@/components/learner/LearnerTemplateRenderer";
import type { LearnerCourseDetail } from "@/lib/course-types";

export default async function LocalQaCoursePlayerCompletedPage() {
  // Enforce strict local-qa guards
  const allowed = await isLocalQaFixtureAllowed();
  if (!allowed) {
    notFound();
  }

  const session = await getCurrentSession();
  if (!session) {
    notFound();
  }

  const slug = "proposal-development-fundamentals-grassroots-csos";
  let course: LearnerCourseDetail | null = null;

  try {
    course = await getLearnerCourseBySlug(slug);
  } catch {
    console.warn("Database offline during QA completed visual page render, falling back to static course metadata.");
  }

  // If database lookup failed or returns null, assemble guarded local visual fallback
  if (!course) {
    const demo = getDemoDetail(slug);
    course = getLearnerDetail(demo);
    // Force completion state
    course.progress = 100;
    course.certificateStatus = "Issued";
    course.certificateHref = `/learn/certificates/${slug}`;
    course.certificateCode = "CERT-DEMO-100-PROPOSAL";
  } else {
    // Force completion state
    course.progress = 100;
    course.certificateStatus = "Issued";
    course.certificateHref = `/learn/certificates/${course.slug}`;
    course.certificateCode = "CERT-DEMO-100-PROPOSAL";
  }

  return (
    <CoursePlayerShell
      session={session}
      courseTitle={course.title}
      currentStage={course.currentModule}
    >
      <LearnerTemplateRenderer course={course} />
    </CoursePlayerShell>
  );
}
