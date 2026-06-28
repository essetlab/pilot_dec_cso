import { LearnerTemplateRenderer } from "@/components/learner/LearnerTemplateRenderer";
import {
  LearnerCertificateDetail,
  LearnerCertificates,
} from "@/components/learner/LearnerCertificates";
import { LearnerDashboard } from "@/components/learner/LearnerDashboard";
import { LearnerFinalTest } from "@/components/learner/LearnerFinalTest";
import { LearnerCourseFeedback } from "@/components/learner/LearnerCourseFeedback";
import { ExternalCourseFrame } from "@/components/learner/ExternalCourseFrame";
import { LearnerMyCourses } from "@/components/learner/LearnerMyCourses";
import { LearnerProfile } from "@/components/learner/LearnerProfile";
import { EmptyState, PlaceholderPage } from "@/components/shell/PlaceholderPage";
import { canAccessPath } from "@/lib/auth/permissions";
import { getCurrentSession } from "@/lib/auth/server";
import {
  getLearnerCertificateDetailData,
  getLearnerCertificateListData,
} from "@/lib/certificate-workflow";
import { prisma } from "@/lib/prisma";
import {
  getLearnerCourseBySlug,
  getLearnerCourseSummaries,
} from "@/lib/course-data";
import { getExternalCourseLaunchData } from "@/lib/external-course-workflow";
import { getCourseFeedbackState } from "@/lib/feedback-workflow";
import { learnerRoutes, matchRoute, routeFromSegments } from "@/lib/routes";
import { notFound, redirect } from "next/navigation";

type PageProps = {
  params: Promise<{
    segments?: string[];
  }>;
  searchParams: Promise<{
    lessonId?: string;
  }>;
};

export default async function LearnerPage({ params, searchParams }: PageProps) {
  const { segments = [] } = await params;
  const { lessonId } = await searchParams;
  const activeLessonId = typeof lessonId === "string" ? lessonId : undefined;
  const actualRoute = routeFromSegments("learn", segments);
  const definition = matchRoute(actualRoute, learnerRoutes);
  const session = await getCurrentSession();

  if (!session) {
    redirect(`/sign-in?next=${encodeURIComponent(actualRoute)}`);
  }

  if (!canAccessPath(session, actualRoute)) {
    redirect(`/unauthorized?from=${encodeURIComponent(actualRoute)}`);
  }

  if (!definition) {
    notFound();
  }

  if (actualRoute === "/learn") {
    const courses = await getLearnerCourseSummaries();

    return <LearnerDashboard courses={courses} />;
  }

  if (actualRoute === "/learn/my-courses") {
    const courses = await getLearnerCourseSummaries();

    return <LearnerMyCourses courses={courses} />;
  }

  if (actualRoute === "/learn/certificates") {
    const certificateData = await getLearnerCertificateListData(session);

    return <LearnerCertificates data={certificateData} />;
  }

  if (actualRoute === "/learn/profile") {
    return <LearnerProfile />;
  }

  if (
    segments.length === 2 &&
    segments[0] === "courses"
  ) {
    const course = await getLearnerCourseBySlug(segments[1]);

    if (!course) {
      notFound();
    }

    return <LearnerTemplateRenderer course={course} activeLessonId={activeLessonId} />;
  }

  if (
    segments.length === 3 &&
    segments[0] === "courses" &&
    segments[2] === "external"
  ) {
    const launchData = await getExternalCourseLaunchData(segments[1], session);

    if (!launchData) {
      notFound();
    }

    return <ExternalCourseFrame launchData={launchData} />;
  }

  if (
    segments.length === 3 &&
    segments[0] === "courses" &&
    segments[2] === "final-test"
  ) {
    const course = await getLearnerCourseBySlug(segments[1]);

    if (!course) {
      notFound();
    }

    let latestAttempt = null;
    let totalAttemptsCount = 0;
    let lessonsComplete = false;

    if (course.courseVersionId && session?.email) {
      const dbUser = await prisma.user.findUnique({
        where: { email: session.email },
      });
      if (dbUser) {
        const attempt = await prisma.quizAttempt.findFirst({
          where: {
            userId: dbUser.id,
            courseVersionId: course.courseVersionId,
          },
          orderBy: { createdAt: "desc" },
        });
        if (attempt) {
          latestAttempt = {
            id: attempt.id,
            status: attempt.status,
            score: attempt.score,
            maxScore: attempt.maxScore,
            percentage: attempt.percentage,
            passed: attempt.passed,
            submittedAt: attempt.submittedAt ? attempt.submittedAt.toISOString() : null,
          };
        }
        totalAttemptsCount = await prisma.quizAttempt.count({
          where: {
            userId: dbUser.id,
            courseVersionId: course.courseVersionId,
          },
        });

        const enrollment = await prisma.enrollment.findUnique({
          where: {
            userId_courseVersionId: {
              userId: dbUser.id,
              courseVersionId: course.courseVersionId,
            },
          },
          include: {
            lessonProgress: true,
          },
        });
        if (enrollment) {
          const completedCount = enrollment.lessonProgress.filter(
            (lp) => lp.status === "COMPLETED",
          ).length;
          const totalCount = enrollment.lessonProgress.length;
          lessonsComplete = totalCount > 0 && completedCount === totalCount;
        }
      }
    } else {
      // Seeded course fallback: allow taking the test when no persisted version is attached.
      lessonsComplete = true;
    }

    return (
      <LearnerFinalTest
        course={course}
        initialAttempt={latestAttempt}
        totalAttemptsCount={totalAttemptsCount}
        lessonsComplete={lessonsComplete}
      />
    );
  }

  if (
    segments.length === 3 &&
    segments[0] === "courses" &&
    segments[2] === "feedback"
  ) {
    const course = await getLearnerCourseBySlug(segments[1]);

    if (!course) {
      notFound();
    }

    const feedbackState = await getCourseFeedbackState(segments[1], session);

    return <LearnerCourseFeedback course={course} feedbackState={feedbackState} />;
  }

  if (
    segments.length === 2 &&
    segments[0] === "certificates"
  ) {
    const certificate = await getLearnerCertificateDetailData(segments[1], session);

    if (!certificate) {
      notFound();
    }

    return <LearnerCertificateDetail certificate={certificate} />;
  }

  return (
    <PlaceholderPage
      purpose={definition.purpose}
      route={actualRoute}
      section="Learner"
      title={definition.title}
    >
      {definition.emptyTitle ? (
        <EmptyState
          description={definition.emptyDescription ?? ""}
          href="/courses"
          action="Browse available courses"
          title={definition.emptyTitle}
        />
      ) : null}
    </PlaceholderPage>
  );
}
