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

async function main() {
  await registerHrbaExternalCourse();
  const session = await participantSession();

  await prisma.certificate.deleteMany({
    where: {
      courseVersionId: HRBA_EXTERNAL_COURSE_VERSION_ID,
      userId: session.userId,
    },
  });
  await prisma.quizAttempt.deleteMany({
    where: {
      courseVersionId: HRBA_EXTERNAL_COURSE_VERSION_ID,
      userId: session.userId,
    },
  });
  await prisma.lessonProgress.deleteMany({
    where: {
      enrollment: {
        courseVersionId: HRBA_EXTERNAL_COURSE_VERSION_ID,
        userId: session.userId,
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
      userId: session.userId,
    },
  });

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

  const progressResult = await recordExternalCourseProgress({
    completed: false,
    completedModuleIds: ["module_01_hrba_foundations"],
    courseSlug: HRBA_EXTERNAL_COURSE_SLUG,
    courseVersionId: launchData.courseVersionId,
    currentModuleId: "module_02_everyday_cso_work",
    currentScreenId: "M2-S05",
    enrollmentId: launchData.enrollmentId,
    iframeOrigin: launchData.allowedOrigin,
    progressPercent: 25,
    session,
    userId: session.userId,
  });

  assert(progressResult.success, `Expected progress save: ${progressResult.error}`);
  assert(progressResult.progressPercent === 25, "Expected partial progress to save as 25%.");

  const completionResult = await recordExternalCourseProgress({
    completed: true,
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
    progressPercent: 100,
    session,
    userId: session.userId,
  });

  assert(completionResult.success, `Expected completion save: ${completionResult.error}`);
  assert(completionResult.completed, "Expected completion result to be completed.");
  assert(completionResult.certificateCode, "Expected certificate code after completion.");

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
  assert(certificate.certificateCode === completionResult.certificateCode, "Expected matching certificate code.");

  console.log(
    JSON.stringify(
      {
        certificateCode: certificate.certificateCode,
        courseSlug: HRBA_EXTERNAL_COURSE_SLUG,
        iframeOrigin: launchData.allowedOrigin,
        iframeSrcIncludesPortalEmbed: launchData.iframeSrc.includes("embed=portal"),
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
