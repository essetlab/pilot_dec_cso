import "dotenv/config";

import { createHash, randomUUID } from "node:crypto";
import {
  EnrollmentStatus,
  QuizAttemptStatus,
  RoleKey,
  UserStatus,
} from "../src/generated/prisma/client";
import type { AuthSession } from "../src/lib/auth/session-codec";
import {
  HRBA_EXTERNAL_COURSE_SLUG,
  HRBA_EXTERNAL_COURSE_ID,
  HRBA_EXTERNAL_COURSE_VERSION_ID,
} from "../src/lib/external-course-config";
import {
  getExternalCourseLaunchData,
  recordExternalCourseProgress,
  registerHrbaExternalCourse,
} from "../src/lib/external-course-workflow";
import { prisma } from "../src/lib/prisma";

const fixtureEmails = new Set<string>();

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

function sessionFor(user: {
  email: string;
  fullName: string | null;
  id: string;
}, emailOverride?: string): AuthSession {
  return {
    email: emailOverride ?? user.email,
    issuedAt: new Date().toISOString(),
    name: user.fullName ?? user.email,
    roles: ["PARTICIPANT"],
    userId: user.id,
  };
}

async function ensureParticipantRole() {
  return prisma.role.upsert({
    create: {
      description: "Learner access to courses, progress, and certificates.",
      key: RoleKey.PARTICIPANT,
      name: "Participant",
    },
    update: {},
    where: { key: RoleKey.PARTICIPANT },
  });
}

async function createFixtureLearner(input: {
  assigned?: boolean;
  authProvider: "local" | "supabase";
  email: string;
}) {
  fixtureEmails.add(input.email);
  const role = await ensureParticipantRole();
  const user = await prisma.user.create({
    data: {
      authProvider: input.authProvider,
      authProviderId:
        input.authProvider === "supabase" ? `s7-${randomUUID()}` : null,
      email: input.email,
      fullName:
        input.authProvider === "supabase"
          ? "S7 Supabase Linked Learner"
          : "S7 Local Learner",
      status: UserStatus.ACTIVE,
    },
  });

  await prisma.userRoleAssignment.create({
    data: {
      assignedById: user.id,
      isActive: true,
      roleId: role.id,
      userId: user.id,
    },
  });

  if (input.assigned !== false) {
    await prisma.courseAssignment.create({
      data: {
        assignedById: user.id,
        assignmentType: "USER",
        courseId: HRBA_EXTERNAL_COURSE_ID,
        targetUserId: user.id,
      },
    });
  }

  return user;
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
  await prisma.enrollment.deleteMany({
    where: {
      courseVersionId: HRBA_EXTERNAL_COURSE_VERSION_ID,
      userId,
    },
  });
}

async function cleanupFixtureUsers(emails: string[]) {
  const users = await prisma.user.findMany({
    select: { id: true },
    where: { email: { in: emails } },
  });
  const userIds = users.map((user) => user.id);

  if (userIds.length === 0) {
    return;
  }

  await prisma.externalCourseLaunchToken.deleteMany({
    where: { userId: { in: userIds } },
  });
  await prisma.certificate.deleteMany({
    where: { userId: { in: userIds } },
  });
  await prisma.quizAttempt.deleteMany({
    where: { userId: { in: userIds } },
  });
  await prisma.lessonProgress.deleteMany({
    where: {
      enrollment: {
        userId: { in: userIds },
      },
    },
  });
  await prisma.enrollment.deleteMany({
    where: { userId: { in: userIds } },
  });
  await prisma.courseAssignment.deleteMany({
    where: {
      OR: [{ targetUserId: { in: userIds } }, { assignedById: { in: userIds } }],
    },
  });
  await prisma.userRoleAssignment.deleteMany({
    where: { userId: { in: userIds } },
  });
  await prisma.user.deleteMany({
    where: { id: { in: userIds } },
  });
}

function assertIframeUrlIsOpaque(iframeSrc: string, userId: string) {
  const iframeUrl = new URL(iframeSrc);

  assert(
    iframeUrl.searchParams.get("embed") === "portal",
    "Expected iframe URL to include embed=portal.",
  );
  assert(
    Boolean(iframeUrl.searchParams.get("portalOrigin")),
    "Expected iframe URL to include portalOrigin.",
  );
  assert(
    iframeUrl.searchParams.get("courseSlug") === HRBA_EXTERNAL_COURSE_SLUG,
    "Expected iframe URL to include the course slug.",
  );
  assert(
    Boolean(iframeUrl.searchParams.get("launchToken")),
    "Expected iframe URL to include launchToken.",
  );

  for (const forbiddenKey of [
    "userId",
    "learnerId",
    "enrollmentId",
    "courseVersionId",
    "certificateId",
    "certificate",
    "answers",
    "assessment",
  ]) {
    assert(
      !iframeUrl.searchParams.has(forbiddenKey),
      `Expected iframe URL to exclude ${forbiddenKey}.`,
    );
  }

  assert(!iframeSrc.includes(userId), "Expected iframe URL to exclude raw Hub user id.");
}

async function verifyLaunchRecord(input: {
  learnerStateKey: string;
  launchToken: string;
  userId: string;
}) {
  const tokenRecord = await prisma.externalCourseLaunchToken.findFirst({
    orderBy: { createdAt: "desc" },
    where: {
      courseVersionId: HRBA_EXTERNAL_COURSE_VERSION_ID,
      userId: input.userId,
    },
  });

  assert(tokenRecord, "Expected launch token record to be stored.");
  assert(
    tokenRecord.userId === input.userId,
    "Expected launch token record to be tied to Hub User.id.",
  );
  assert(
    tokenRecord.tokenHash !== input.launchToken,
    "Expected stored launch token value to be hashed.",
  );
  assert(
    tokenRecord.learnerStateKeyHash ===
      createHash("sha256").update(input.learnerStateKey).digest("hex"),
    "Expected launch token to be bound to the learner state key hash.",
  );
  assert(
    tokenRecord.expiresAt.getTime() > Date.now(),
    "Expected launch token to have a future expiry.",
  );
  assert(
    tokenRecord.courseSlug === HRBA_EXTERNAL_COURSE_SLUG,
    "Expected launch token course slug to match HRBA.",
  );

  return tokenRecord;
}

async function verifyProgressAndCertificate(input: {
  allowedOrigin: string;
  learnerStateKey: string;
  launchToken: string;
  session: AuthSession;
}) {
  const invalidTokenResult = await recordExternalCourseProgress({
    completed: false,
    completedModuleIds: ["module_01_hrba_foundations"],
    courseSlug: HRBA_EXTERNAL_COURSE_SLUG,
    currentModuleId: "module_01_hrba_foundations",
    currentScreenId: "M1-S01",
    iframeOrigin: input.allowedOrigin,
    learnerStateKey: input.learnerStateKey,
    launchToken: "not-a-valid-token",
    progressPercent: 10,
    sentAt: new Date().toISOString(),
    session: input.session,
  });
  assert(!invalidTokenResult.success, "Expected invalid token to be rejected.");

  const mismatchUser = await createFixtureLearner({
    authProvider: "local",
    email: `s7-mismatch-${randomUUID()}@example.test`,
  });
  const mismatchResult = await recordExternalCourseProgress({
    completed: false,
    completedModuleIds: ["module_01_hrba_foundations"],
    courseSlug: HRBA_EXTERNAL_COURSE_SLUG,
    currentModuleId: "module_01_hrba_foundations",
    currentScreenId: "M1-S01",
    iframeOrigin: input.allowedOrigin,
    learnerStateKey: input.learnerStateKey,
    launchToken: input.launchToken,
    progressPercent: 10,
    sentAt: new Date().toISOString(),
    session: sessionFor(mismatchUser),
  });
  assert(!mismatchResult.success, "Expected token/session mismatch to be rejected.");

  const invalidOriginResult = await recordExternalCourseProgress({
    completed: false,
    completedModuleIds: ["module_01_hrba_foundations"],
    courseSlug: HRBA_EXTERNAL_COURSE_SLUG,
    currentModuleId: "module_01_hrba_foundations",
    currentScreenId: "M1-S01",
    iframeOrigin: "https://invalid-origin.example.test",
    learnerStateKey: input.learnerStateKey,
    launchToken: input.launchToken,
    progressPercent: 10,
    sentAt: new Date().toISOString(),
    session: input.session,
  });
  assert(!invalidOriginResult.success, "Expected invalid iframe origin to be rejected.");

  const failedResult = await recordExternalCourseProgress({
    assessment: {
      attemptNumber: 1,
      evidenceId: randomUUID(),
      maxScore: 10,
      passed: false,
      percentage: 70,
      score: 7,
      submittedAt: new Date().toISOString(),
    },
    completed: true,
    completedModuleIds: [
      "module_01_hrba_foundations",
      "module_02_everyday_cso_work",
      "module_03_project_design",
      "module_04_implementation",
      "module_05_hrba_meal",
    ],
    courseSlug: HRBA_EXTERNAL_COURSE_SLUG,
    currentModuleId: "module_05_hrba_meal",
    currentScreenId: "M5-FINAL-ASSESSMENT",
    iframeOrigin: input.allowedOrigin,
    learnerStateKey: input.learnerStateKey,
    launchToken: input.launchToken,
    progressPercent: 100,
    sentAt: new Date().toISOString(),
    session: input.session,
  });
  assert(failedResult.success, `Expected failed assessment to record: ${failedResult.error}`);
  assert(
    failedResult.certificateStatus === "assessment-failed",
    "Expected failed assessment to block certificate.",
  );

  const passingResult = await recordExternalCourseProgress({
    assessment: {
      attemptNumber: 2,
      evidenceId: randomUUID(),
      maxScore: 10,
      passed: true,
      percentage: 90,
      score: 9,
      submittedAt: new Date().toISOString(),
    },
    completed: true,
    completedModuleIds: [
      "module_01_hrba_foundations",
      "module_02_everyday_cso_work",
      "module_03_project_design",
      "module_04_implementation",
      "module_05_hrba_meal",
    ],
    courseSlug: HRBA_EXTERNAL_COURSE_SLUG,
    currentModuleId: "module_05_hrba_meal",
    currentScreenId: "M5-FINAL-ASSESSMENT",
    iframeOrigin: input.allowedOrigin,
    learnerStateKey: input.learnerStateKey,
    launchToken: input.launchToken,
    progressPercent: 100,
    sentAt: new Date().toISOString(),
    session: input.session,
  });
  assert(passingResult.success, `Expected passing assessment to record: ${passingResult.error}`);
  assert(
    ["issued", "already-issued"].includes(passingResult.certificateStatus ?? ""),
    "Expected passing assessment to issue or return an existing Hub certificate.",
  );
  assert(passingResult.certificateCode, "Expected certificate code after passing assessment.");

  const attempts = await prisma.quizAttempt.findMany({
    where: {
      courseVersionId: HRBA_EXTERNAL_COURSE_VERSION_ID,
      userId: input.session.userId,
    },
  });
  assert(
    attempts.some((attempt) => attempt.status === QuizAttemptStatus.FAILED),
    "Expected failed assessment attempt to be recorded.",
  );
  assert(
    attempts.some((attempt) => attempt.status === QuizAttemptStatus.PASSED),
    "Expected passed assessment attempt to be recorded.",
  );

  const certificate = await prisma.certificate.findUnique({
    where: {
      userId_courseVersionId: {
        courseVersionId: HRBA_EXTERNAL_COURSE_VERSION_ID,
        userId: input.session.userId,
      },
    },
  });
  assert(certificate, "Expected Hub certificate to be issued.");

  const enrollment = await prisma.enrollment.findUnique({
    where: {
      userId_courseVersionId: {
        courseVersionId: HRBA_EXTERNAL_COURSE_VERSION_ID,
        userId: input.session.userId,
      },
    },
  });
  assert(enrollment?.status === EnrollmentStatus.COMPLETED, "Expected enrollment completed.");
  assert(enrollment.progressPercent === 100, "Expected enrollment progress to be 100%.");

  await cleanupFixtureUsers([mismatchUser.email]);

  return {
    certificateCode: certificate.certificateCode,
    failedAttemptRecorded: attempts.some((attempt) => attempt.status === QuizAttemptStatus.FAILED),
    passedAttemptRecorded: attempts.some((attempt) => attempt.status === QuizAttemptStatus.PASSED),
  };
}

async function main() {
  const localEmail = `s7-local-${randomUUID()}@example.test`;
  const supabaseEmail = `s7-supabase-${randomUUID()}@example.test`;
  const unassignedEmail = `s7-unassigned-${randomUUID()}@example.test`;

  await cleanupFixtureUsers([localEmail, supabaseEmail, unassignedEmail]);
  await registerHrbaExternalCourse();

  const localUser = await createFixtureLearner({
    authProvider: "local",
    email: localEmail,
  });
  const supabaseUser = await createFixtureLearner({
    authProvider: "supabase",
    email: supabaseEmail,
  });
  const unassignedUser = await createFixtureLearner({
    assigned: false,
    authProvider: "supabase",
    email: unassignedEmail,
  });

  try {
    await resetExternalCourseState(localUser.id);
    await resetExternalCourseState(supabaseUser.id);
    await resetExternalCourseState(unassignedUser.id);

    const deniedLaunch = await getExternalCourseLaunchData(
      HRBA_EXTERNAL_COURSE_SLUG,
      sessionFor(unassignedUser),
    );
    assert(!deniedLaunch, "Expected an unassigned learner to be denied HRBA launch.");
    assert(
      (await prisma.enrollment.count({ where: { userId: unassignedUser.id } })) === 0,
      "Expected denied HRBA launch not to create an enrollment.",
    );

    const localLaunch = await getExternalCourseLaunchData(
      HRBA_EXTERNAL_COURSE_SLUG,
      sessionFor(localUser),
    );
    assert(localLaunch, "Expected local fallback learner to launch HRBA.");
    assertIframeUrlIsOpaque(localLaunch.iframeSrc, localUser.id);
    await verifyLaunchRecord({
      learnerStateKey: localLaunch.learnerStateKey,
      launchToken: localLaunch.launchToken,
      userId: localUser.id,
    });

    const supabaseSession = sessionFor(
      supabaseUser,
      "stale-supabase-session-email@example.test",
    );
    const supabaseLaunch = await getExternalCourseLaunchData(
      HRBA_EXTERNAL_COURSE_SLUG,
      supabaseSession,
    );
    assert(supabaseLaunch, "Expected Supabase-linked Hub learner to launch HRBA by userId.");
    assertIframeUrlIsOpaque(supabaseLaunch.iframeSrc, supabaseUser.id);
    await verifyLaunchRecord({
      learnerStateKey: supabaseLaunch.learnerStateKey,
      launchToken: supabaseLaunch.launchToken,
      userId: supabaseUser.id,
    });

    const callbackResult = await verifyProgressAndCertificate({
      allowedOrigin: supabaseLaunch.allowedOrigin,
      learnerStateKey: supabaseLaunch.learnerStateKey,
      launchToken: supabaseLaunch.launchToken,
      session: supabaseSession,
    });

    console.log(
      JSON.stringify(
        {
          callbackRejectsInvalidOrigin: true,
          callbackRejectsInvalidToken: true,
          callbackRejectsSessionMismatch: true,
          certificateCode: callbackResult.certificateCode,
          failedAttemptRecorded: callbackResult.failedAttemptRecorded,
          iframeSrcExcludesRawIds:
            !supabaseLaunch.iframeSrc.includes(supabaseUser.id) &&
            !supabaseLaunch.iframeSrc.includes("userId=") &&
            !supabaseLaunch.iframeSrc.includes("learnerId=") &&
            !supabaseLaunch.iframeSrc.includes("enrollmentId=") &&
            !supabaseLaunch.iframeSrc.includes("courseVersionId="),
          iframeSrcIncludesLaunchToken: supabaseLaunch.iframeSrc.includes("launchToken="),
          localFallbackLaunchWorks: true,
          passedAttemptRecorded: callbackResult.passedAttemptRecorded,
          supabaseLinkedLaunchWorks: true,
        },
        null,
        2,
      ),
    );
  } finally {
    await cleanupFixtureUsers(Array.from(fixtureEmails));
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
