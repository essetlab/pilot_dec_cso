import "dotenv/config";

import { createHash, randomUUID } from "node:crypto";
import {
  RoleKey,
  UserStatus,
} from "../src/generated/prisma/client";
import type { AuthSession } from "../src/lib/auth/session-codec";
import {
  HRBA_EXTERNAL_COURSE_ID,
  HRBA_EXTERNAL_COURSE_LESSON_ID,
  HRBA_EXTERNAL_COURSE_SLUG,
  HRBA_EXTERNAL_COURSE_VERSION_ID,
} from "../src/lib/external-course-config";
import {
  getExternalCourseLaunchData,
  recordExternalCourseProgress,
  registerHrbaExternalCourse,
} from "../src/lib/external-course-workflow";
import { prisma } from "../src/lib/prisma";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

function sessionFor(user: { email: string; fullName: string; id: string }): AuthSession {
  return {
    email: user.email,
    issuedAt: new Date().toISOString(),
    name: user.fullName,
    roles: [RoleKey.PARTICIPANT],
    userId: user.id,
  };
}

function hashOpaqueValue(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

function assessment(evidenceId: string, submittedAt: string) {
  return {
    attemptNumber: 1,
    evidenceId,
    maxScore: 10,
    passed: true,
    percentage: 100,
    score: 10,
    submittedAt,
  };
}

async function cleanup(userIds: string[], organizationId?: string) {
  if (userIds.length > 0) {
    await prisma.externalCourseLaunchToken.deleteMany({
      where: { userId: { in: userIds } },
    });
    await prisma.certificate.deleteMany({ where: { userId: { in: userIds } } });
    await prisma.quizAttempt.deleteMany({ where: { userId: { in: userIds } } });
    await prisma.lessonProgress.deleteMany({
      where: { enrollment: { userId: { in: userIds } } },
    });
    await prisma.enrollment.deleteMany({ where: { userId: { in: userIds } } });
    await prisma.courseAssignment.deleteMany({
      where: { targetUserId: { in: userIds } },
    });
    await prisma.userRoleAssignment.deleteMany({
      where: { userId: { in: userIds } },
    });
    await prisma.user.deleteMany({ where: { id: { in: userIds } } });
  }

  if (organizationId) {
    await prisma.organization.deleteMany({ where: { id: organizationId } });
  }
}

async function main() {
  const fixture = randomUUID();
  const userIds: string[] = [];
  let organizationId: string | undefined;

  await registerHrbaExternalCourse();

  const admin = await prisma.user.findFirstOrThrow({
    where: {
      roleAssignments: {
        some: {
          isActive: true,
          role: { key: { in: [RoleKey.SUPER_ADMIN, RoleKey.PLATFORM_ADMIN] } },
        },
      },
    },
  });
  const participantRole = await prisma.role.upsert({
    create: {
      description: "Learner access to courses, progress, and certificates.",
      key: RoleKey.PARTICIPANT,
      name: "Participant",
    },
    update: {},
    where: { key: RoleKey.PARTICIPANT },
  });

  try {
    const organization = await prisma.organization.create({
      data: {
        name: `Isolation verification organization ${fixture}`,
        shortName: "Isolation QA",
      },
    });
    organizationId = organization.id;

    const learners = await Promise.all(
      ["A", "B"].map(async (label) => {
        const user = await prisma.user.create({
          data: {
            email: `isolation-${label.toLowerCase()}-${fixture}@example.test`,
            fullName: `Isolation Learner ${label}`,
            organizationId: organization.id,
            status: UserStatus.ACTIVE,
          },
        });
        userIds.push(user.id);

        await prisma.userRoleAssignment.create({
          data: {
            assignedById: admin.id,
            isActive: true,
            roleId: participantRole.id,
            userId: user.id,
          },
        });
        await prisma.courseAssignment.create({
          data: {
            assignedById: admin.id,
            assignmentType: "USER",
            courseId: HRBA_EXTERNAL_COURSE_ID,
            courseVersionId: HRBA_EXTERNAL_COURSE_VERSION_ID,
            targetUserId: user.id,
          },
        });

        return user;
      }),
    );
    const [learnerA, learnerB] = learners;
    const sessionA = sessionFor(learnerA);
    const sessionB = sessionFor(learnerB);

    const launchA1 = await getExternalCourseLaunchData(
      HRBA_EXTERNAL_COURSE_SLUG,
      sessionA,
    );
    const launchA2 = await getExternalCourseLaunchData(
      HRBA_EXTERNAL_COURSE_SLUG,
      sessionA,
    );
    const launchB1 = await getExternalCourseLaunchData(
      HRBA_EXTERNAL_COURSE_SLUG,
      sessionB,
    );

    assert(launchA1 && launchA2 && launchB1, "Expected both learners to launch HRBA.");
    assert(
      launchA1.learnerStateKey === launchA2.learnerStateKey,
      "Repeated launches for one active enrollment must retain one state key.",
    );
    assert(
      launchA1.learnerStateKey !== launchB1.learnerStateKey,
      "Two learners in the same organization must receive different state keys.",
    );
    assert(
      launchA1.launchToken !== launchA2.launchToken,
      "Authorization launch tokens must remain short-lived and independently rotated.",
    );

    const enrollmentA = await prisma.enrollment.findUniqueOrThrow({
      where: {
        userId_courseVersionId: {
          courseVersionId: HRBA_EXTERNAL_COURSE_VERSION_ID,
          userId: learnerA.id,
        },
      },
    });
    const enrollmentB = await prisma.enrollment.findUniqueOrThrow({
      where: {
        userId_courseVersionId: {
          courseVersionId: HRBA_EXTERNAL_COURSE_VERSION_ID,
          userId: learnerB.id,
        },
      },
    });
    assert(
      enrollmentA.externalLearnerStateKey === launchA1.learnerStateKey,
      "Learner A state key must be bound to the server-side enrollment.",
    );
    assert(
      enrollmentB.externalLearnerStateKey === launchB1.learnerStateKey,
      "Learner B state key must be bound to the server-side enrollment.",
    );

    const tokenA = await prisma.externalCourseLaunchToken.findFirstOrThrow({
      orderBy: { createdAt: "desc" },
      where: { enrollmentId: enrollmentA.id },
    });
    assert(
      tokenA.learnerStateKeyHash === hashOpaqueValue(launchA1.learnerStateKey),
      "Launch token must store only the learner state key hash.",
    );
    assert(
      !launchA1.iframeSrc.includes(launchA1.learnerStateKey),
      "Learner state key must be delivered by exact-origin handshake, not the URL.",
    );

    for (const rawId of [
      learnerA.id,
      enrollmentA.id,
      organization.id,
      HRBA_EXTERNAL_COURSE_VERSION_ID,
    ]) {
      assert(!launchA1.iframeSrc.includes(rawId), "Launch URL leaked a raw Hub id.");
    }

    const callbackA = {
      completedModuleIds: ["module_01_hrba_foundations"],
      courseSlug: HRBA_EXTERNAL_COURSE_SLUG,
      currentModuleId: "module_01_hrba_foundations",
      currentScreenId: "M1-S01",
      iframeOrigin: launchA1.allowedOrigin,
      learnerStateKey: launchA1.learnerStateKey,
      launchToken: launchA1.launchToken,
      sentAt: new Date().toISOString(),
      session: sessionA,
    };
    const legacyRawToken = `${randomUUID()}${randomUUID()}`;
    await prisma.externalCourseLaunchToken.create({
      data: {
        allowedOrigin: tokenA.allowedOrigin,
        courseId: tokenA.courseId,
        courseSlug: tokenA.courseSlug,
        courseVersionId: tokenA.courseVersionId,
        enrollmentId: tokenA.enrollmentId,
        expiresAt: new Date(Date.now() + 60 * 60 * 1000),
        learnerStateKeyHash: null,
        portalOrigin: tokenA.portalOrigin,
        tokenHash: hashOpaqueValue(legacyRawToken),
        userId: tokenA.userId,
      },
    });
    const legacyTokenResult = await recordExternalCourseProgress({
      ...callbackA,
      completed: false,
      launchToken: legacyRawToken,
      progressPercent: 5,
    });
    assert(
      !legacyTokenResult.success,
      "A legacy launch token without a state-key binding was accepted.",
    );

    const progressA = await recordExternalCourseProgress({
      ...callbackA,
      completed: false,
      progressPercent: 25,
    });
    assert(progressA.success && progressA.progressPercent === 25, "Valid progress failed.");

    const resumeA = await recordExternalCourseProgress({
      ...callbackA,
      launchToken: launchA2.launchToken,
      sentAt: new Date().toISOString(),
      completed: false,
      progressPercent: 40,
    });
    assert(
      resumeA.success && resumeA.progressPercent === 40,
      "Same-learner refresh/resume with a new launch token must remain valid.",
    );

    const submittedAtA = new Date().toISOString();
    const evidenceA = randomUUID();
    const completionPayloadA = {
      ...callbackA,
      assessment: assessment(evidenceA, submittedAtA),
      completed: true,
      completedModuleIds: [
        "module_01_hrba_foundations",
        "module_02_everyday_cso_work",
        "module_03_project_design",
        "module_04_implementation",
        "module_05_hrba_meal",
      ],
      currentModuleId: "final_assessment",
      currentScreenId: "FINAL-ASSESSMENT-COMPLETE",
      progressPercent: 100,
      sentAt: new Date().toISOString(),
    };
    const concurrentCompletionsA = await Promise.all([
      recordExternalCourseProgress(completionPayloadA),
      recordExternalCourseProgress(completionPayloadA),
    ]);
    assert(
      concurrentCompletionsA.every((result) => result.success && result.completed),
      "Concurrent identical completion callbacks must both resolve successfully.",
    );

    const replayA = await recordExternalCourseProgress({
      ...completionPayloadA,
      sentAt: new Date().toISOString(),
    });
    assert(
      replayA.success && replayA.certificateStatus === "already-issued",
      "Same-context completion replay must be idempotent.",
    );
    assert(
      await prisma.quizAttempt.count({ where: { externalEvidenceId: evidenceA } }) === 1,
      "Completion replay created a duplicate attempt.",
    );
    const persistedAttemptA = await prisma.quizAttempt.findUniqueOrThrow({
      where: { externalEvidenceId: evidenceA },
    });
    assert(
      persistedAttemptA.externalLearnerStateKeyHash ===
        hashOpaqueValue(launchA1.learnerStateKey),
      "Assessment attempt was not bound to the exact enrollment state-key hash.",
    );
    assert(
      await prisma.certificate.count({ where: { userId: learnerA.id } }) === 1,
      "Completion replay created a duplicate certificate.",
    );
    const alteredReplayA = await recordExternalCourseProgress({
      ...completionPayloadA,
      assessment: {
        ...assessment(evidenceA, submittedAtA),
        percentage: 90,
        score: 9,
      },
      sentAt: new Date().toISOString(),
    });
    assert(
      !alteredReplayA.success,
      "An altered retry of existing assessment evidence was accepted.",
    );
    assert(
      await prisma.quizAttempt.count({ where: { externalEvidenceId: evidenceA } }) === 1 &&
        await prisma.certificate.count({ where: { userId: learnerA.id } }) === 1,
      "Altered evidence changed attempt or certificate cardinality.",
    );

    const mismatchKey = await recordExternalCourseProgress({
      ...callbackA,
      learnerStateKey: launchA1.learnerStateKey,
      launchToken: launchB1.launchToken,
      session: sessionB,
      completed: false,
      progressPercent: 10,
      sentAt: new Date().toISOString(),
    });
    assert(!mismatchKey.success, "Mismatched launch token and state key was accepted.");

    const copiedEvidence = await recordExternalCourseProgress({
      ...callbackA,
      assessment: assessment(evidenceA, submittedAtA),
      learnerStateKey: launchB1.learnerStateKey,
      launchToken: launchB1.launchToken,
      session: sessionB,
      completed: true,
      progressPercent: 100,
      sentAt: new Date().toISOString(),
    });
    assert(!copiedEvidence.success, "Learner B accepted Learner A assessment evidence.");

    const predatingB = new Date(
      (enrollmentB.externalStateKeyIssuedAt ?? enrollmentB.enrolledAt).getTime() -
        2 * 60 * 1000,
    ).toISOString();
    const staleEvidence = await recordExternalCourseProgress({
      ...callbackA,
      assessment: assessment(randomUUID(), predatingB),
      learnerStateKey: launchB1.learnerStateKey,
      launchToken: launchB1.launchToken,
      session: sessionB,
      completed: true,
      progressPercent: 100,
      sentAt: new Date().toISOString(),
    });
    assert(!staleEvidence.success, "Predating assessment evidence was accepted.");

    const future = new Date(Date.now() + 10 * 60 * 1000).toISOString();
    const futureEvidence = await recordExternalCourseProgress({
      ...callbackA,
      assessment: assessment(randomUUID(), future),
      learnerStateKey: launchB1.learnerStateKey,
      launchToken: launchB1.launchToken,
      session: sessionB,
      completed: true,
      progressPercent: 100,
      sentAt: future,
    });
    assert(!futureEvidence.success, "Unreasonable future evidence was accepted.");
    assert(
      await prisma.quizAttempt.count({ where: { userId: learnerB.id } }) === 0,
      "Rejected Learner B callbacks created an assessment attempt.",
    );
    assert(
      await prisma.certificate.count({ where: { userId: learnerB.id } }) === 0,
      "Rejected Learner B callbacks created a certificate.",
    );

    const attemptA = await prisma.quizAttempt.findUniqueOrThrow({
      where: { externalEvidenceId: evidenceA },
    });
    const enrollmentBBeforeRollback = await prisma.enrollment.findUniqueOrThrow({
      where: { id: enrollmentB.id },
    });
    const lessonBBeforeRollback = await prisma.lessonProgress.findUniqueOrThrow({
      where: {
        enrollmentId_lessonId: {
          enrollmentId: enrollmentB.id,
          lessonId: HRBA_EXTERNAL_COURSE_LESSON_ID,
        },
      },
    });
    const rollbackFixtureCertificate = await prisma.certificate.create({
      data: {
        certificateCode: `ISOLATION-ROLLBACK-${fixture}`,
        completionDate: new Date(),
        courseId: HRBA_EXTERNAL_COURSE_ID,
        courseTitleSnapshot: "HRBA isolation rollback fixture",
        courseVersionId: HRBA_EXTERNAL_COURSE_VERSION_ID,
        enrollmentId: enrollmentA.id,
        issuerNameSnapshot: "Isolation verifier",
        participantNameSnapshot: learnerB.fullName,
        quizAttemptId: attemptA.id,
        userId: learnerB.id,
      },
    });
    const rollbackEvidenceId = randomUUID();
    const rollbackResult = await recordExternalCourseProgress({
      ...callbackA,
      assessment: assessment(rollbackEvidenceId, new Date().toISOString()),
      completed: true,
      completedModuleIds: [
        "module_01_hrba_foundations",
        "module_02_everyday_cso_work",
        "module_03_project_design",
        "module_04_implementation",
        "module_05_hrba_meal",
      ],
      currentModuleId: "final_assessment",
      currentScreenId: "FINAL-ASSESSMENT-COMPLETE",
      learnerStateKey: launchB1.learnerStateKey,
      launchToken: launchB1.launchToken,
      progressPercent: 100,
      sentAt: new Date().toISOString(),
      session: sessionB,
    });
    assert(
      !rollbackResult.success,
      "A certificate context conflict did not fail closed.",
    );
    assert(
      await prisma.quizAttempt.count({
        where: { externalEvidenceId: rollbackEvidenceId },
      }) === 0,
      "A failed completion transaction retained its assessment attempt.",
    );
    const enrollmentBAfterRollback = await prisma.enrollment.findUniqueOrThrow({
      where: { id: enrollmentB.id },
    });
    assert(
      enrollmentBAfterRollback.status === enrollmentBBeforeRollback.status &&
        enrollmentBAfterRollback.progressPercent ===
          enrollmentBBeforeRollback.progressPercent &&
        enrollmentBAfterRollback.completedAt?.toISOString() ===
          enrollmentBBeforeRollback.completedAt?.toISOString(),
      "A failed completion transaction changed enrollment completion state.",
    );
    const lessonBAfterRollback = await prisma.lessonProgress.findUniqueOrThrow({
      where: {
        enrollmentId_lessonId: {
          enrollmentId: enrollmentB.id,
          lessonId: HRBA_EXTERNAL_COURSE_LESSON_ID,
        },
      },
    });
    assert(
      lessonBAfterRollback.status === lessonBBeforeRollback.status &&
        JSON.stringify(lessonBAfterRollback.progressJson) ===
          JSON.stringify(lessonBBeforeRollback.progressJson),
      "A failed completion transaction changed lesson completion state.",
    );
    const certificatesBAfterRollback = await prisma.certificate.findMany({
      where: { userId: learnerB.id },
    });
    assert(
      certificatesBAfterRollback.length === 1 &&
        certificatesBAfterRollback[0]?.id === rollbackFixtureCertificate.id,
      "A failed completion transaction changed certificate state.",
    );
    await prisma.certificate.delete({
      where: { id: rollbackFixtureCertificate.id },
    });

    const progressB = await recordExternalCourseProgress({
      ...callbackA,
      learnerStateKey: launchB1.learnerStateKey,
      launchToken: launchB1.launchToken,
      session: sessionB,
      completed: false,
      progressPercent: 10,
      sentAt: new Date().toISOString(),
    });
    assert(progressB.success, "Valid isolated Learner B progress was rejected.");

    const evidenceB = randomUUID();
    const submittedAtB = new Date().toISOString();
    const completionPayloadB = {
      ...callbackA,
      assessment: assessment(evidenceB, submittedAtB),
      completed: true,
      completedModuleIds: [
        "module_01_hrba_foundations",
        "module_02_everyday_cso_work",
        "module_03_project_design",
        "module_04_implementation",
        "module_05_hrba_meal",
      ],
      currentModuleId: "final_assessment",
      currentScreenId: "FINAL-ASSESSMENT-COMPLETE",
      learnerStateKey: launchB1.learnerStateKey,
      launchToken: launchB1.launchToken,
      progressPercent: 100,
      sentAt: new Date().toISOString(),
      session: sessionB,
    };
    const completionB = await recordExternalCourseProgress(completionPayloadB);
    assert(completionB.success && completionB.completed, "Learner B completion failed.");
    assert(
      await prisma.quizAttempt.count({ where: { externalEvidenceId: evidenceB } }) === 1,
      "Learner B completion did not create exactly one evidence attempt.",
    );
    assert(
      await prisma.certificate.count({ where: { userId: learnerB.id } }) === 1,
      "Learner B completion did not create exactly one certificate.",
    );

    await prisma.externalCourseLaunchToken.deleteMany({
      where: { enrollmentId: enrollmentB.id },
    });
    await prisma.lessonProgress.deleteMany({
      where: { enrollmentId: enrollmentB.id },
    });
    await prisma.enrollment.delete({ where: { id: enrollmentB.id } });
    const launchB2 = await getExternalCourseLaunchData(
      HRBA_EXTERNAL_COURSE_SLUG,
      sessionB,
    );
    assert(launchB2, "Expected replacement enrollment to launch.");
    assert(
      launchB2.learnerStateKey !== launchB1.learnerStateKey,
      "A different enrollment must receive a different learner state key.",
    );

    const replacementEnrollmentB = await prisma.enrollment.findUniqueOrThrow({
      where: {
        userId_courseVersionId: {
          courseVersionId: HRBA_EXTERNAL_COURSE_VERSION_ID,
          userId: learnerB.id,
        },
      },
    });
    const replacedEnrollmentReplay = await recordExternalCourseProgress({
      ...completionPayloadB,
      iframeOrigin: launchB2.allowedOrigin,
      learnerStateKey: launchB2.learnerStateKey,
      launchToken: launchB2.launchToken,
      sentAt: new Date().toISOString(),
    });
    assert(
      !replacedEnrollmentReplay.success,
      "Replacement enrollment accepted evidence from the prior enrollment.",
    );
    const replacementEnrollmentAfterReplay =
      await prisma.enrollment.findUniqueOrThrow({
        where: { id: replacementEnrollmentB.id },
      });
    assert(
      replacementEnrollmentAfterReplay.status === replacementEnrollmentB.status &&
        replacementEnrollmentAfterReplay.progressPercent ===
          replacementEnrollmentB.progressPercent &&
        replacementEnrollmentAfterReplay.completedAt === null,
      "Rejected prior-enrollment evidence changed the replacement enrollment.",
    );
    assert(
      await prisma.quizAttempt.count({
        where: {
          externalLearnerStateKeyHash: hashOpaqueValue(
            launchB2.learnerStateKey,
          ),
        },
      }) === 0,
      "Rejected prior-enrollment evidence created a replacement-context attempt.",
    );
    assert(
      await prisma.certificate.count({ where: { userId: learnerB.id } }) === 0,
      "Rejected prior-enrollment evidence created a replacement certificate.",
    );

    const safeCallbackShape = {
      assessment: assessment(randomUUID(), new Date().toISOString()),
      completed: true,
      completedModuleIds: ["module_05_hrba_meal"],
      courseSlug: HRBA_EXTERNAL_COURSE_SLUG,
      currentModuleId: "final_assessment",
      currentScreenId: "FINAL-ASSESSMENT-COMPLETE",
      learnerStateKey: launchB2.learnerStateKey,
      progressPercent: 100,
      sentAt: new Date().toISOString(),
      type: "cso-learning-hub:external-course-progress",
      version: 1,
    };
    const serializedCallback = JSON.stringify(safeCallbackShape);
    for (const rawId of [
      learnerB.id,
      organization.id,
      enrollmentB.id,
      HRBA_EXTERNAL_COURSE_VERSION_ID,
    ]) {
      assert(!serializedCallback.includes(rawId), "Callback payload leaked a raw Hub id.");
    }

    console.log(
      JSON.stringify(
        {
          callbackPayloadExcludesRawIds: true,
          completionPersistenceIsAtomic: true,
          alteredEvidenceReplayRejected: true,
          attemptBoundToEnrollmentStateHash: true,
          copiedLearnerEvidenceRejected: true,
          concurrentCompletionIsIdempotent: true,
          differentEnrollmentRotatesStateKey: true,
          futureEvidenceRejected: true,
          launchUrlExcludesRawIdsAndStateKey: true,
          legacyUnboundTokenRejected: true,
          mismatchedTokenAndStateKeyRejected: true,
          predatingEvidenceRejected: true,
          replayIsIdempotent: true,
          replacedEnrollmentEvidenceRejected: true,
          sameEnrollmentStateKeyStable: true,
          sameLearnerRefreshResumeAccepted: true,
          separateLearnerStateKeys: true,
        },
        null,
        2,
      ),
    );
  } finally {
    await cleanup(userIds, organizationId);
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
