import { LearnerTemplateRenderer } from "@/components/learner/LearnerTemplateRenderer";
import {
  LearnerCertificateDetail,
  LearnerCertificates,
} from "@/components/learner/LearnerCertificates";
import { LearnerDashboard } from "@/components/learner/LearnerDashboard";
import { LearnerFinalTest } from "@/components/learner/LearnerFinalTest";
import { LearnerCourseFeedback } from "@/components/learner/LearnerCourseFeedback";
import { ExternalCourseFrame } from "@/components/learner/ExternalCourseFrame";
import { ManagedExternalCourseFrame } from "@/components/learner/ManagedExternalCourseFrame";
import { LearnerMyCourses } from "@/components/learner/LearnerMyCourses";
import { LearnerProfile, LearnerSettings } from "@/components/learner/LearnerProfile";
import { EmptyState, PlaceholderPage } from "@/components/shell/PlaceholderPage";
import { canAccessPath } from "@/lib/auth/permissions";
import { getCurrentSession } from "@/lib/auth/server";
import {
  getLearnerCertificateDetailData,
  getLearnerCertificateListData,
  type LearnerCertificateListData,
} from "@/lib/certificate-workflow";
import { prisma } from "@/lib/prisma";
import {
  getLearnerCourseBySlug,
  getLearnerCourseSummaries,
} from "@/lib/course-data";
import { getExternalCourseLaunchData } from "@/lib/external-course-workflow";
import type { LearnerCourseDetail } from "@/lib/course-types";
import type { ExternalCourseLaunchData } from "@/lib/external-course-types";
import { getCourseFeedbackState } from "@/lib/feedback-workflow";
import { getLearnerProfileData } from "@/lib/learner-profile-workflow";
import { isComingSoonCatalogueSlug } from "@/lib/public-course-catalogue";
import {
  getManagedEmbeddedCourseLaunchData,
  getManagedExternalCoursePublicState,
  type ManagedEmbeddedCourseLaunchData,
} from "@/lib/managed-external-course-workflow";
import { parseSafeExternalUrl } from "@/lib/external-course-manager";
import {
  isPhaseOneLearnerRoute,
  learnerRoutes,
  matchRoute,
  routeFromSegments,
} from "@/lib/routes";
import { notFound, redirect } from "next/navigation";
import { LearnerShell } from "@/components/shell/LearnerShell";
import { CoursePlayerShell } from "@/components/shell/CoursePlayerShell";
import Link from "next/link";

type PageProps = {
  params: Promise<{
    segments?: string[];
  }>;
  searchParams: Promise<{
    lessonId?: string;
    profile?: string;
  }>;
};

export default async function LearnerPage({ params, searchParams }: PageProps) {
  const { segments = [] } = await params;
  const { lessonId, profile } = await searchParams;

  const activeLessonId = typeof lessonId === "string" ? lessonId : undefined;
  const actualRoute = routeFromSegments("learn", segments);
  const definition = matchRoute(actualRoute, learnerRoutes);

  // General resolution variables
  let session = null;
  let managedExternalState = null;
  let launchData: ExternalCourseLaunchData | null = null;
  let managedLaunchData: ManagedEmbeddedCourseLaunchData | null = null;
  let courses = null;
  let certificateData: LearnerCertificateListData | null = null;
  let profileData = null;
  let course: LearnerCourseDetail | null = null;
  let feedbackState = null;
  let certificate = null;

  // Final Test specifics
  let latestAttempt: {
    id: string;
    status: string;
    score: number | null;
    maxScore: number | null;
    percentage: number | null;
    passed: boolean;
    submittedAt: string | null;
  } | null = null;
  let totalAttemptsCount = 0;
  let lessonsComplete = false;

  let isServiceUnavailable = false;

  try {
    session = await getCurrentSession();

    if (session) {
      if (canAccessPath(session, actualRoute) && isPhaseOneLearnerRoute(actualRoute) && definition) {
        if (segments[0] === "courses" && typeof segments[1] === "string") {
          managedExternalState = await getManagedExternalCoursePublicState(segments[1]);

          if (managedExternalState && managedExternalState.availability === "available") {
            if (managedExternalState.integrationMode === "embedded" && segments.length === 3 && segments[2] === "external") {
              managedLaunchData = await getManagedEmbeddedCourseLaunchData(segments[1], session);
            }
          }

          if (!managedExternalState || managedExternalState.availability !== "available" || managedExternalState.integrationMode !== "embedded" || segments.length !== 3 || segments[2] !== "external") {
            if (segments.length === 2) {
              course = await getLearnerCourseBySlug(segments[1]);
            } else if (segments.length === 3 && segments[2] === "external") {
              launchData = await getExternalCourseLaunchData(segments[1], session);
            } else if (segments.length === 3 && segments[2] === "final-test") {
              course = await getLearnerCourseBySlug(segments[1]);

              if (course?.isExternalCourse) {
                // Redirected to the integrated player outside this try/catch boundary.
              } else if (course && course.courseVersionId && session.userId) {
                const dbUser = await prisma.user.findUnique({
                  where: { id: session.userId },
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
                lessonsComplete = true;
              }
            } else if (segments.length === 3 && segments[2] === "feedback") {
              course = await getLearnerCourseBySlug(segments[1], {
                initializeEnrollment: false,
              });
              feedbackState = await getCourseFeedbackState(segments[1], session);
            }
          }
        } else if (actualRoute === "/learn") {
          const [resCourses, resCertificates] = await Promise.all([
            getLearnerCourseSummaries(),
            getLearnerCertificateListData(session),
          ]);
          courses = resCourses;
          certificateData = resCertificates;
        } else if (actualRoute === "/learn/my-courses") {
          courses = await getLearnerCourseSummaries();
        } else if (actualRoute === "/learn/certificates") {
          certificateData = await getLearnerCertificateListData(session);
        } else if (actualRoute === "/learn/profile" || actualRoute === "/learn/settings") {
          profileData = await getLearnerProfileData(session);
        } else if (segments.length === 2 && segments[0] === "certificates") {
          certificate = await getLearnerCertificateDetailData(segments[1], session);
        }
      }
    }
  } catch (error) {
    console.error("LearnerPage data fetch caught error:", error);
    isServiceUnavailable = true;
  }

  // Enforce fail-closed Service Unavailable checks
  if (isServiceUnavailable) {
    const isCoursePlayerRoute = segments[0] === "courses" && typeof segments[1] === "string";
    const courseTitle = isCoursePlayerRoute ? "Course Player" : undefined;

    if (isCoursePlayerRoute) {
      return (
        <CoursePlayerShell
          session={null}
          courseTitle={courseTitle || "Course Player"}
          currentStage="Service Unavailable"
        >
          <div className="flex flex-col items-center justify-center p-8 text-center bg-white-surface rounded-[24px] border border-design-border shadow-soft my-6 max-w-2xl mx-auto">
            <h1 className="text-xl font-bold text-[#b91c1c]">Course Temporarily Unavailable</h1>
            <p className="mt-2 text-sm text-muted-text max-w-md">
              We are unable to load this course right now due to a temporary service interruption. Please try again later.
            </p>
            <div className="mt-6 flex gap-4">
              <Link href="/learn" className="rounded-control bg-deep-navy px-4 py-2 text-sm font-semibold text-white hover:bg-dec-blue transition">
                Return to My Learning
              </Link>
              <Link href="/support" className="rounded-control border border-design-border bg-white px-4 py-2 text-sm font-semibold text-deep-navy hover:bg-slate-50 transition">
                Get Support
              </Link>
            </div>
          </div>
        </CoursePlayerShell>
      );
    }

    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-6 text-center">
        <h1 className="text-2xl font-bold text-[#b91c1c]">Service Temporarily Unavailable</h1>
        <p className="mt-2 text-sm text-muted-text max-w-md">
          The learning portal is experiencing a temporary service interruption. We are working to resolve the issue as quickly as possible.
        </p>
        <Link href="/support" className="mt-6 rounded-control bg-deep-navy px-5 py-2.5 text-sm font-semibold text-white hover:bg-dec-blue transition">
          Contact Support
        </Link>
      </div>
    );
  }

  // Next.js redirect & page guards (must remain outside try-catch boundaries)
  if (
    segments[0] === "courses" &&
    typeof segments[1] === "string" &&
    (isComingSoonCatalogueSlug(segments[1]) ||
      (managedExternalState && managedExternalState.availability !== "available"))
  ) {
    notFound();
  }

  if (!session) {
    redirect(`/sign-in?next=${encodeURIComponent(actualRoute)}`);
  }

  if (!canAccessPath(session, actualRoute)) {
    redirect(`/unauthorized?from=${encodeURIComponent(actualRoute)}`);
  }

  if (!isPhaseOneLearnerRoute(actualRoute)) {
    notFound();
  }

  if (!definition) {
    notFound();
  }

  // Route Rendering Paths (No database queries are executed below this line)
  if (
    managedExternalState &&
    managedExternalState.availability === "available" &&
    segments[0] === "courses" &&
    typeof segments[1] === "string"
  ) {
    if (managedExternalState.integrationMode === "external_link") {
      const url = parseSafeExternalUrl(managedExternalState.externalUrl ?? "");
      if (!url.url) {
        notFound();
      }
      redirect(url.url);
    }

    if (managedExternalState.integrationMode === "embedded") {
      if (segments.length === 2) {
        redirect(`/learn/courses/${segments[1]}/external`);
      }

      if (segments.length === 3 && segments[2] === "external") {
        if (!managedLaunchData) {
          notFound();
        }
        return (
          <CoursePlayerShell
            session={session}
            courseTitle={managedLaunchData.courseTitle}
            currentStage="Embedded Course"
          >
            <ManagedExternalCourseFrame launchData={managedLaunchData} />
          </CoursePlayerShell>
        );
      }
    }

    if (managedExternalState.integrationMode === "hub_tracked") {
      notFound();
    }
  }

  if (
    course?.isExternalCourse &&
    segments[0] === "courses" &&
    typeof segments[1] === "string" &&
    (segments.length === 2 ||
      (segments.length === 3 && segments[2] === "final-test"))
  ) {
    redirect(`/learn/courses/${encodeURIComponent(segments[1])}/external`);
  }

  if (actualRoute === "/learn") {
    if (!courses || !certificateData) {
      notFound();
    }
    return (
      <LearnerShell session={session}>
        <LearnerDashboard
          courses={courses}
          certificates={certificateData.certificates}
          certificateError={certificateData.error}
          learnerName={session.name}
        />
      </LearnerShell>
    );
  }

  if (actualRoute === "/learn/my-courses") {
    if (!courses) {
      notFound();
    }
    return (
      <LearnerShell session={session}>
        <LearnerMyCourses courses={courses} />
      </LearnerShell>
    );
  }

  if (actualRoute === "/learn/certificates") {
    if (!certificateData) {
      notFound();
    }
    return (
      <LearnerShell session={session}>
        <LearnerCertificates data={certificateData} />
      </LearnerShell>
    );
  }

  if (actualRoute === "/learn/profile") {
    if (!profileData) {
      notFound();
    }
    return (
      <LearnerShell session={session}>
        <LearnerProfile data={profileData} updateState={profile} />
      </LearnerShell>
    );
  }

  if (actualRoute === "/learn/settings") {
    if (!profileData) {
      notFound();
    }
    return (
      <LearnerShell session={session}>
        <LearnerSettings data={profileData} />
      </LearnerShell>
    );
  }

  if (
    segments.length === 2 &&
    segments[0] === "courses"
  ) {
    if (!course) {
      notFound();
    }
    return (
      <CoursePlayerShell
        session={session}
        courseTitle={course.title}
        currentStage={course.currentModule}
      >
        <LearnerTemplateRenderer course={course} activeLessonId={activeLessonId} />
      </CoursePlayerShell>
    );
  }

  if (
    segments.length === 3 &&
    segments[0] === "courses" &&
    segments[2] === "external"
  ) {
    if (!launchData) {
      notFound();
    }
    return (
      <CoursePlayerShell
        session={session}
        courseTitle={launchData.courseTitle}
        currentStage="External Course Content"
      >
        <ExternalCourseFrame launchData={launchData} />
      </CoursePlayerShell>
    );
  }

  if (
    segments.length === 3 &&
    segments[0] === "courses" &&
    segments[2] === "final-test"
  ) {
    if (!course) {
      notFound();
    }
    return (
      <CoursePlayerShell
        session={session}
        courseTitle={course.title}
        currentStage="Final Assessment"
      >
        <LearnerFinalTest
          course={course}
          initialAttempt={latestAttempt}
          totalAttemptsCount={totalAttemptsCount}
          lessonsComplete={lessonsComplete}
        />
      </CoursePlayerShell>
    );
  }

  if (
    segments.length === 3 &&
    segments[0] === "courses" &&
    segments[2] === "feedback"
  ) {
    if (!course || !feedbackState) {
      notFound();
    }
    return (
      <CoursePlayerShell
        session={session}
        courseTitle={course.title}
        currentStage="Course Feedback"
      >
        <LearnerCourseFeedback course={course} feedbackState={feedbackState} />
      </CoursePlayerShell>
    );
  }

  if (
    segments.length === 2 &&
    segments[0] === "certificates"
  ) {
    if (!certificate) {
      notFound();
    }
    return (
      <LearnerShell session={session}>
        <LearnerCertificateDetail certificate={certificate} />
      </LearnerShell>
    );
  }

  return (
    <LearnerShell session={session}>
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
    </LearnerShell>
  );
}
