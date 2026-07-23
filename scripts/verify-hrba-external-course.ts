import "dotenv/config";

import { randomUUID } from "node:crypto";
import {
  HRBA_EXTERNAL_COURSE_SLUG,
  HRBA_EXTERNAL_COURSE_VERSION_ID,
} from "../src/lib/external-course-config";
import {
  getExternalCourseLaunchData,
  recordExternalCourseProgress,
  registerHrbaExternalCourse,
} from "../src/lib/external-course-workflow";
import {
  getLearnerCertificatePdfData,
  getPublicCertificateVerificationData,
} from "../src/lib/certificate-workflow";
import type { AuthSession } from "../src/lib/auth/session-codec";
import { EnrollmentStatus, QuizAttemptStatus } from "../src/generated/prisma/client";
import { prisma } from "../src/lib/prisma";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

async function participantSession(email = "participant2@demo.local"): Promise<AuthSession> {
  const user = await prisma.user.findUnique({
    include: {
      roleAssignments: {
        include: {
          role: true,
        },
      },
    },
    where: { email },
  });

  assert(user, `Expected demo participant ${email} to exist.`);

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
  await prisma.externalCourseLaunchToken.deleteMany({
    where: {
      courseVersionId: HRBA_EXTERNAL_COURSE_VERSION_ID,
      userId,
    },
  });
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

async function countAttempts(userId: string, status?: QuizAttemptStatus) {
  return prisma.quizAttempt.count({
    where: {
      courseVersionId: HRBA_EXTERNAL_COURSE_VERSION_ID,
      status,
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
    !launchData.iframeSrc.includes("userId="),
    "Expected iframe source to exclude raw user id.",
  );
  assert(
    !launchData.iframeSrc.includes("enrollmentId="),
    "Expected iframe source to exclude raw enrollment id.",
  );
  assert(
    !launchData.iframeSrc.includes("courseVersionId="),
    "Expected iframe source to exclude raw course version id.",
  );
  assert(
    launchData.iframeSrc.includes("launchToken="),
    "Expected iframe source to include an opaque launch token.",
  );
  assert(
    launchData.launchToken && !launchData.launchToken.includes(session.userId),
    "Expected launch token to be opaque and not contain the participant id.",
  );
  assert(
    launchData.learnerStateKey &&
      !launchData.learnerStateKey.includes(session.userId) &&
      !launchData.iframeSrc.includes(launchData.learnerStateKey),
    "Expected learner state key to be opaque and delivered outside the iframe URL.",
  );

  const launchEnrollment = await prisma.enrollment.findUnique({
    include: {
      lessonProgress: true,
    },
    where: {
      userId_courseVersionId: {
        courseVersionId: HRBA_EXTERNAL_COURSE_VERSION_ID,
        userId: session.userId,
      },
    },
  });

  assert(launchEnrollment, "Expected enrollment to exist after external launch.");

  const invalidTokenResult = await recordExternalCourseProgress({
    completed: false,
    completedModuleIds: ["module_01_hrba_foundations"],
    courseSlug: HRBA_EXTERNAL_COURSE_SLUG,
    currentModuleId: "module_01_hrba_foundations",
    currentScreenId: "M1-S01",
    iframeOrigin: launchData.allowedOrigin,
    learnerStateKey: launchData.learnerStateKey,
    launchToken: "not-a-valid-launch-token",
    progressPercent: 10,
    sentAt: new Date().toISOString(),
    session,
  });

  assert(!invalidTokenResult.success, "Expected invalid launch token to be rejected.");

  const otherSession = await participantSession("participant1@demo.local");
  const mismatchResult = await recordExternalCourseProgress({
    completed: false,
    completedModuleIds: ["module_01_hrba_foundations"],
    courseSlug: HRBA_EXTERNAL_COURSE_SLUG,
    currentModuleId: "module_01_hrba_foundations",
    currentScreenId: "M1-S01",
    iframeOrigin: launchData.allowedOrigin,
    learnerStateKey: launchData.learnerStateKey,
    launchToken: launchData.launchToken,
    progressPercent: 10,
    sentAt: new Date().toISOString(),
    session: otherSession,
  });

  assert(!mismatchResult.success, "Expected launch token/session mismatch to be rejected.");

  const invalidOriginResult = await recordExternalCourseProgress({
    completed: false,
    completedModuleIds: ["module_01_hrba_foundations"],
    courseSlug: HRBA_EXTERNAL_COURSE_SLUG,
    currentModuleId: "module_01_hrba_foundations",
    currentScreenId: "M1-S01",
    iframeOrigin: "http://invalid-origin.local",
    learnerStateKey: launchData.learnerStateKey,
    launchToken: launchData.launchToken,
    progressPercent: 10,
    sentAt: new Date().toISOString(),
    session,
  });

  assert(
    !invalidOriginResult.success,
    "Expected launch token/origin mismatch to be rejected.",
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
    currentModuleId: "module_05_hrba_meal",
    currentScreenId: "M5-PLAYER-COMPLETE",
    iframeOrigin: launchData.allowedOrigin,
    learnerStateKey: launchData.learnerStateKey,
    launchToken: launchData.launchToken,
    sentAt: new Date().toISOString(),
    session,
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

  const failedSubmittedAt = new Date().toISOString();
  const failedEvidenceId = randomUUID();
  const failedIncompleteAssessmentResult = await recordExternalCourseProgress({
    ...baseMessage,
    assessment: {
      attemptNumber: 1,
      evidenceId: failedEvidenceId,
      maxScore: 10,
      passed: false,
      percentage: 70,
      score: 7,
      submittedAt: failedSubmittedAt,
    },
    completed: false,
    currentModuleId: "module_05_hrba_meal",
    currentScreenId: "M5-FINAL-ASSESSMENT",
    progressPercent: 90,
  });

  assert(
    failedIncompleteAssessmentResult.success,
    `Expected incomplete failing assessment save: ${failedIncompleteAssessmentResult.error}`,
  );
  assert(
    failedIncompleteAssessmentResult.certificateStatus === "assessment-failed",
    "Expected completed=false failing assessment to return assessment-failed.",
  );
  assert(
    !failedIncompleteAssessmentResult.completed,
    "Expected completed=false failing assessment to keep enrollment incomplete.",
  );
  assert(
    failedIncompleteAssessmentResult.progressPercent === 90,
    "Expected completed=false failing assessment to preserve partial progress.",
  );
  assert(
    (await countAttempts(session.userId, QuizAttemptStatus.FAILED)) === 1,
    "Expected completed=false failing assessment to record one failed attempt.",
  );
  assert(
    (await countCertificates(session.userId)) === 0,
    "Completed=false failing assessment must not issue a certificate.",
  );

  const duplicateFailedIncompleteAssessmentResult =
    await recordExternalCourseProgress({
      ...baseMessage,
      assessment: {
        attemptNumber: 1,
        evidenceId: failedEvidenceId,
        maxScore: 10,
        passed: false,
        percentage: 70,
        score: 7,
        submittedAt: failedSubmittedAt,
      },
      completed: false,
      currentModuleId: "module_05_hrba_meal",
      currentScreenId: "M5-FINAL-ASSESSMENT",
      progressPercent: 90,
    });

  assert(
    duplicateFailedIncompleteAssessmentResult.success,
    `Expected duplicate failed assessment to be accepted: ${duplicateFailedIncompleteAssessmentResult.error}`,
  );
  assert(
    (await countAttempts(session.userId, QuizAttemptStatus.FAILED)) === 1,
    "Repeated identical failed assessment must not create duplicate attempts.",
  );

  const missingAssessmentResult = await recordExternalCourseProgress({
    ...baseMessage,
    completed: true,
    progressPercent: 100,
  });

  assert(
    !missingAssessmentResult.success,
    "Expected completion without assessment evidence to fail closed.",
  );
  assert(
    missingAssessmentResult.error === "Assessment evidence is required for completion",
    "Expected a specific missing-assessment rejection.",
  );
  assert(
    (await countCertificates(session.userId)) === 0,
    "Completion without assessment must not issue a certificate.",
  );

  const failingEvidenceId = randomUUID();
  const failingAssessmentResult = await recordExternalCourseProgress({
    ...baseMessage,
    assessment: {
      attemptNumber: 2,
      evidenceId: failingEvidenceId,
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
  assert(
    (await countAttempts(session.userId, QuizAttemptStatus.FAILED)) === 2,
    "Expected different failing retake evidence to record a second failed attempt.",
  );

  const passingSubmittedAt = new Date().toISOString();
  const passingEvidenceId = randomUUID();
  const passingAssessmentResult = await recordExternalCourseProgress({
    ...baseMessage,
    assessment: {
      attemptNumber: 3,
      evidenceId: passingEvidenceId,
      maxScore: 10,
      passed: true,
      percentage: 90,
      score: 9,
      submittedAt: passingSubmittedAt,
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
  assert(
    (await countCertificates(session.userId)) === 1,
    "Passing assessment must issue exactly one certificate.",
  );

  const repeatedPassingAssessmentResult = await recordExternalCourseProgress({
    ...baseMessage,
    assessment: {
      attemptNumber: 3,
      evidenceId: passingEvidenceId,
      maxScore: 10,
      passed: true,
      percentage: 90,
      score: 9,
      submittedAt: passingSubmittedAt,
    },
    completed: true,
    progressPercent: 100,
  });

  assert(
    repeatedPassingAssessmentResult.success,
    `Expected repeated passing completion to be accepted: ${repeatedPassingAssessmentResult.error}`,
  );
  assert(
    repeatedPassingAssessmentResult.certificateStatus === "already-issued",
    "Expected repeated passing completion to return already-issued.",
  );
  assert(
    (await countCertificates(session.userId)) === 1,
    "Repeated passing completion must not issue a duplicate certificate.",
  );

  const invalidContextResult = await recordExternalCourseProgress({
    ...baseMessage,
    completed: false,
    courseSlug: "not-this-course",
    progressPercent: 40,
  });

  assert(!invalidContextResult.success, "Expected invalid launch context to fail.");

  const enrollment = await prisma.enrollment.findUnique({
    include: {
      lessonProgress: true,
    },
    where: {
      userId_courseVersionId: {
        courseVersionId: HRBA_EXTERNAL_COURSE_VERSION_ID,
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
        courseVersionId: HRBA_EXTERNAL_COURSE_VERSION_ID,
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
      courseVersionId: HRBA_EXTERNAL_COURSE_VERSION_ID,
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

  const publicVerification = await getPublicCertificateVerificationData(certificate.certificateCode);
  assert(publicVerification, "Expected public certificate verification data.");
  assert(
    publicVerification.certificateCode === certificate.certificateCode,
    "Expected public verification to return the issued certificate code.",
  );

  const pdfData = await getLearnerCertificatePdfData(certificate.certificateCode, session);
  assert(pdfData, "Expected learner certificate PDF data.");
  assert(
    pdfData.certificateCode === certificate.certificateCode,
    "Expected learner certificate PDF data to match the issued certificate.",
  );

  console.log(
    JSON.stringify(
      {
        certificateCode: certificate.certificateCode,
        courseSlug: HRBA_EXTERNAL_COURSE_SLUG,
        failedAttemptCount: attempts.filter((attempt) => attempt.status === "FAILED")
          .length,
        failedAttemptRecorded: attempts.some((attempt) => attempt.status === "FAILED"),
        iframeOrigin: launchData.allowedOrigin,
        iframeSrcExcludesRawIds:
          !launchData.iframeSrc.includes("userId=") &&
          !launchData.iframeSrc.includes("enrollmentId=") &&
          !launchData.iframeSrc.includes("courseVersionId="),
        iframeSrcIncludesPortalEmbed: launchData.iframeSrc.includes("embed=portal"),
        iframeSrcIncludesLaunchToken: launchData.iframeSrc.includes("launchToken="),
        invalidLaunchContextRejected: !invalidContextResult.success,
        invalidTokenRejected: !invalidTokenResult.success,
        certificatePdfDataAvailable: pdfData.certificateCode === certificate.certificateCode,
        passedAttemptRecorded: attempts.some((attempt) => attempt.status === "PASSED"),
        progressPercent: enrollment.progressPercent,
        publicVerificationWorks: publicVerification.certificateCode === certificate.certificateCode,
        tokenSessionMismatchRejected: !mismatchResult.success,
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
