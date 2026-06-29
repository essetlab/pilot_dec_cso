import "dotenv/config";

import {
  HRBA_EXTERNAL_COURSE_SLUG,
  HRBA_EXTERNAL_COURSE_VERSION_ID,
} from "../src/lib/external-course-config";
import {
  getExternalCourseLaunchData,
  recordExternalCourseProgress,
  registerHrbaExternalCourse,
} from "../src/lib/external-course-workflow";
import type { AuthSession } from "../src/lib/auth/session-codec";
import { EnrollmentStatus } from "../src/generated/prisma/client";
import { prisma } from "../src/lib/prisma";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

async function participantSession(): Promise<AuthSession> {
  const user = await prisma.user.findUnique({
    include: {
      roleAssignments: {
        include: {
          role: true,
        },
      },
    },
    where: { email: "participant2@demo.local" },
  });

  assert(user, "Expected demo participant participant2@demo.local to exist.");

  return {
    email: user.email,
    issuedAt: new Date().toISOString(),
    name: user.fullName,
    roles: user.roleAssignments
      .filter((assignment) => assignment.isActive)
      .map((assignment) => assignment.role.key),
    userId: user.id,
  };
}

async function resetExternalCourseState(userId: string) {
  await prisma.certificate.deleteMany({
    where: {
      courseVersionId: HRBA_EXTERNAL_COURSE_VERSION_ID,
      userId,
    },
  });
  await prisma.quizAttempt.deleteMany({
    where: {
      courseVersionId: HRBA_EXTERNAL_COURSE_VERSION_ID,
      userId,
    },
  });
  await prisma.lessonProgress.deleteMany({
    where: {
      enrollment: {
        courseVersionId: HRBA_EXTERNAL_COURSE_VERSION_ID,
        userId,
      },
    },
  });
  await prisma.enrollment.updateMany({
    data: {
      completedAt: null,
      lastAccessedAt: null,
      progressPercent: 0,
      startedAt: new Date(),
      status: EnrollmentStatus.IN_PROGRESS,
    },
    where: {
      courseVersionId: HRBA_EXTERNAL_COURSE_VERSION_ID,
      userId,
    },
  });
}

async function countCertificates(userId: string) {
  return prisma.certificate.count({
    where: {
      courseVersionId: HRBA_EXTERNAL_COURSE_VERSION_ID,
      userId,
    },
  });
}

async function main() {
  await registerHrbaExternalCourse();
  const session = await participantSession();

  await resetExternalCourseState(session.userId);

  const launchData = await getExternalCourseLaunchData(
    HRBA_EXTERNAL_COURSE_SLUG,
    session,
  );

  assert(launchData, "Expected external course launch data.");
  assert(
    launchData.iframeSrc.includes("embed=portal"),
    "Expected iframe source to include embed=portal.",
  );
  assert(
    launchData.iframeSrc.includes(`userId=${encodeURIComponent(session.userId)}`),
    "Expected iframe source to include the participant user id.",
  );

  const baseMessage = {
    completedModuleIds: [
      "module_01_hrba_foundations",
      "module_02_everyday_cso_work",
      "module_03_project_design",
      "module_04_implementation",
      "module_05_hrba_meal",
    ],
    courseSlug: HRBA_EXTERNAL_COURSE_SLUG,
    courseVersionId: launchData.courseVersionId,
    currentModuleId: "module_05_hrba_meal",
    currentScreenId: "M5-PLAYER-COMPLETE",
    enrollmentId: launchData.enrollmentId,
    iframeOrigin: launchData.allowedOrigin,
    session,
    userId: session.userId,
  };

  const progressResult = await recordExternalCourseProgress({
    ...baseMessage,
    completed: false,
    completedModuleIds: ["module_01_hrba_foundations"],
    currentModuleId: "module_02_everyday_cso_work",
    currentScreenId: "M2-S05",
    progressPercent: 25,
  });

  assert(progressResult.success, `Expected progress save: ${progressResult.error}`);
  assert(progressResult.progressPercent === 25, "Expected partial progress to save as 25%.");
  assert(
    (await countCertificates(session.userId)) === 0,
    "Partial progress must not issue a certificate.",
  );

  const missingAssessmentResult = await recordExternalCourseProgress({
    ...baseMessage,
    completed: true,
    progressPercent: 100,
  });

  assert(
    missingAssessmentResult.success,
    `Expected completion save without assessment: ${missingAssessmentResult.error}`,
  );
  assert(missingAssessmentResult.completed, "Expected completion to be recorded.");
  assert(
    missingAssessmentResult.certificateStatus === "assessment-missing",
    "Expected certificate to remain blocked when assessment is missing.",
  );
  assert(
    (await countCertificates(session.userId)) === 0,
    "Completion without assessment must not issue a certificate.",
  );

  const failingAssessmentResult = await recordExternalCourseProgress({
    ...baseMessage,
    assessment: {
      attemptNumber: 1,
      maxScore: 10,
      passed: false,
      percentage: 70,
      score: 7,
      submittedAt: new Date().toISOString(),
    },
    completed: true,
    progressPercent: 100,
  });

  assert(
    failingAssessmentResult.success,
    `Expected failing assessment save: ${failingAssessmentResult.error}`,
  );
  assert(
    failingAssessmentResult.certificateStatus === "assessment-failed",
    "Expected failing assessment to block certificate.",
  );
  assert(
    (await countCertificates(session.userId)) === 0,
    "Failing assessment must not issue a certificate.",
  );

  const passingAssessmentResult = await recordExternalCourseProgress({
    ...baseMessage,
    assessment: {
      attemptNumber: 2,
      maxScore: 10,
      passed: true,
      percentage: 90,
      score: 9,
      submittedAt: new Date().toISOString(),
    },
    completed: true,
    progressPercent: 100,
  });

  assert(
    passingAssessmentResult.success,
    `Expected passing assessment save: ${passingAssessmentResult.error}`,
  );
  assert(
    passingAssessmentResult.certificateStatus === "issued",
    "Expected passing assessment to issue certificate.",
  );
  assert(
    passingAssessmentResult.certificateCode,
    "Expected certificate code after passing assessment.",
  );

  const invalidContextResult = await recordExternalCourseProgress({
    ...baseMessage,
    completed: false,
    enrollmentId: "not-this-enrollment",
    progressPercent: 40,
  });

  assert(!invalidContextResult.success, "Expected invalid enrollment context to fail.");

  const enrollment = await prisma.enrollment.findUnique({
    include: {
      lessonProgress: true,
    },
    where: {
      userId_courseVersionId: {
        courseVersionId: launchData.courseVersionId,
        userId: session.userId,
      },
    },
  });

  assert(enrollment?.progressPercent === 100, "Expected enrollment to be 100% complete.");
  assert(enrollment.status === "COMPLETED", "Expected enrollment status COMPLETED.");
  assert(
    enrollment.lessonProgress.some((item) => item.status === "COMPLETED"),
    "Expected lesson progress to be completed.",
  );

  const certificate = await prisma.certificate.findUnique({
    where: {
      userId_courseVersionId: {
        courseVersionId: launchData.courseVersionId,
        userId: session.userId,
      },
    },
  });

  assert(certificate, "Expected issued certificate.");
  assert(
    certificate.certificateCode === passingAssessmentResult.certificateCode,
    "Expected matching certificate code.",
  );

  const attempts = await prisma.quizAttempt.findMany({
    orderBy: { submittedAt: "asc" },
    where: {
      courseVersionId: launchData.courseVersionId,
      userId: session.userId,
    },
  });

  assert(
    attempts.some((attempt) => attempt.status === "FAILED" && attempt.percentage === 70),
    "Expected failed external assessment attempt to be recorded.",
  );
  assert(
    attempts.some((attempt) => attempt.status === "PASSED" && attempt.percentage === 90),
    "Expected passed external assessment attempt to be recorded.",
  );

  console.log(
    JSON.stringify(
      {
        certificateCode: certificate.certificateCode,
        courseSlug: HRBA_EXTERNAL_COURSE_SLUG,
        failedAttemptRecorded: attempts.some((attempt) => attempt.status === "FAILED"),
        iframeOrigin: launchData.allowedOrigin,
        iframeSrcIncludesPortalEmbed: launchData.iframeSrc.includes("embed=portal"),
        passedAttemptRecorded: attempts.some((attempt) => attempt.status === "PASSED"),
        progressPercent: enrollment.progressPercent,
        status: enrollment.status,
      },
      null,
      2,
    ),
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
