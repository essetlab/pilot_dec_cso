import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import {
  CourseStatus,
  CourseVisibility,
  EnrollmentStatus,
  QuizAttemptStatus,
  UserStatus,
  type Prisma,
} from "../src/generated/prisma/client";
import {
  buildPmExternalCourseMetadata,
  getTrackedExternalCourseConfig,
  HRBA_EXTERNAL_COURSE_SLUG,
  PM_EXTERNAL_COURSE_ID,
  PM_EXTERNAL_COURSE_QUESTION_ID,
  PM_EXTERNAL_COURSE_QUIZ_ID,
  PM_EXTERNAL_COURSE_SLUG,
  PM_EXTERNAL_COURSE_TITLE,
  PM_EXTERNAL_COURSE_VERSION_ID,
} from "../src/lib/external-course-config";
import { recordExternalCourseProgress } from "../src/lib/external-course-workflow";
import { prisma } from "../src/lib/prisma";
import type { AuthSession } from "../src/lib/auth/session-codec";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

type MockAttempt = {
  answersJson: Prisma.JsonValue | null;
  courseId: string;
  courseVersionId: string;
  createdAt: Date;
  externalEvidenceId: string | null;
  externalLearnerStateKeyHash: string | null;
  id: string;
  maxScore: number | null;
  passed: boolean;
  percentage: number | null;
  quizId: string;
  score: number | null;
  status: QuizAttemptStatus;
  submittedAt: Date | null;
  userId: string;
};

type MockCertificate = {
  certificateCode: string;
  courseId: string;
  courseVersionId: string;
  enrollmentId: string;
  quizAttemptId: string;
  userId: string;
};

const session: AuthSession = {
  email: "pm-batch2@example.local",
  issuedAt: new Date("2026-08-11T08:00:00.000Z").toISOString(),
  name: "PM Batch 2 Learner",
  roles: ["PARTICIPANT"],
  userId: "pm-batch2-learner",
};
const learnerStateKey = Buffer.alloc(32, 0x6b).toString("base64url");
const launchToken = "pm-batch2-launch-token";
const user = {
  id: session.userId,
  email: session.email,
  fullName: session.name,
  organizationId: null,
  primaryCohortId: null,
  status: UserStatus.ACTIVE,
};
const course = {
  analysisMetadataJson: {
    externalCourse: buildPmExternalCourseMetadata(),
    learnerTemplate: "external-iframe",
  },
  defaultPassThreshold: 80,
  finalTestRequired: true,
  id: PM_EXTERNAL_COURSE_ID,
  slug: PM_EXTERNAL_COURSE_SLUG,
  status: CourseStatus.PUBLISHED,
  title: PM_EXTERNAL_COURSE_TITLE,
  versions: [{ id: PM_EXTERNAL_COURSE_VERSION_ID }],
  visibility: CourseVisibility.ASSIGNED_ONLY,
};
const enrollment = {
  completedAt: null as Date | null,
  courseId: course.id,
  courseVersionId: PM_EXTERNAL_COURSE_VERSION_ID,
  enrolledAt: new Date("2026-08-11T08:00:00.000Z"),
  externalLearnerStateKey: learnerStateKey,
  externalStateKeyIssuedAt: new Date("2026-08-11T08:00:00.000Z"),
  id: "pm-batch2-enrollment",
  lastAccessedAt: null as Date | null,
  progressPercent: 97,
  status: EnrollmentStatus.IN_PROGRESS,
  userId: user.id,
};
const tokenRecord = {
  allowedOrigin: "http://localhost:5173",
  courseId: course.id,
  courseSlug: course.slug,
  courseVersionId: PM_EXTERNAL_COURSE_VERSION_ID,
  enrollmentId: enrollment.id,
  expiresAt: new Date("2026-08-12T08:00:00.000Z"),
  id: "pm-batch2-token",
  learnerStateKeyHash: createHash("sha256").update(learnerStateKey).digest("hex"),
  portalOrigin: "http://localhost:3000",
  tokenHash: createHash("sha256").update(launchToken).digest("hex"),
  userId: user.id,
};
const quiz = {
  id: PM_EXTERNAL_COURSE_QUIZ_ID,
  passThreshold: 80,
  questions: [{ id: PM_EXTERNAL_COURSE_QUESTION_ID }],
};

const attempts: MockAttempt[] = [];
const certificates: MockCertificate[] = [];
let assigned = true;
let activeServerNow = new Date("2026-08-11T09:00:00.000Z");

type Restore = () => void;
const restores: Restore[] = [];
function stub(target: object, key: string, replacement: unknown) {
  const original = Reflect.get(target, key);
  Reflect.set(target, key, replacement);
  restores.push(() => Reflect.set(target, key, original));
}

stub(prisma.user, "findUnique", async () => user);
stub(prisma.courseAssignment, "findFirst", async () => assigned ? { id: "assignment" } : null);
stub(prisma.course, "findUnique", async () => course);
stub(prisma.enrollment, "findUnique", async () => enrollment);
stub(prisma.quiz, "findUnique", async () => quiz);
stub(prisma.quizAttempt, "findUnique", async (args: { where: { externalEvidenceId: string } }) =>
  attempts.find((attempt) => attempt.externalEvidenceId === args.where.externalEvidenceId) ?? null);
stub(prisma.quizAttempt, "findMany", async () =>
  [...attempts]
    .filter((attempt) =>
      attempt.courseId === course.id &&
      attempt.courseVersionId === PM_EXTERNAL_COURSE_VERSION_ID &&
      attempt.externalLearnerStateKeyHash === tokenRecord.learnerStateKeyHash &&
      attempt.quizId === PM_EXTERNAL_COURSE_QUIZ_ID &&
      attempt.userId === user.id)
    .sort((left, right) => right.createdAt.getTime() - left.createdAt.getTime()));
stub(prisma.externalCourseLaunchToken, "findUnique", async () => tokenRecord);
stub(prisma.externalCourseLaunchToken, "update", async () => tokenRecord);
stub(prisma.enrollment, "update", async (args: { data: Record<string, unknown> }) => {
  Object.assign(enrollment, args.data);
  return enrollment;
});
stub(prisma.lessonProgress, "upsert", async () => ({ id: "pm-batch2-progress" }));
stub(prisma.quizAttempt, "upsert", async (args: { create: Record<string, unknown>; where: { externalEvidenceId: string } }) => {
  const existing = attempts.find((attempt) => attempt.externalEvidenceId === args.where.externalEvidenceId);
  if (existing) return existing;
  const created: MockAttempt = {
    answersJson: args.create.answersJson as Prisma.JsonValue,
    courseId: String(args.create.courseId),
    courseVersionId: String(args.create.courseVersionId),
    createdAt: new Date(activeServerNow),
    externalEvidenceId: String(args.create.externalEvidenceId),
    externalLearnerStateKeyHash: String(args.create.externalLearnerStateKeyHash),
    id: `attempt-${attempts.length + 1}`,
    maxScore: Number(args.create.maxScore),
    passed: args.create.passed === true,
    percentage: Number(args.create.percentage),
    quizId: String(args.create.quizId),
    score: Number(args.create.score),
    status: args.create.status as QuizAttemptStatus,
    submittedAt: args.create.submittedAt as Date,
    userId: String(args.create.userId),
  };
  attempts.push(created);
  return created;
});
stub(prisma.certificate, "findUnique", async () => certificates[0] ?? null);
stub(prisma.certificate, "upsert", async (args: { create: Record<string, unknown> }) => {
  if (certificates[0]) return certificates[0];
  const certificate: MockCertificate = {
    certificateCode: String(args.create.certificateCode),
    courseId: String(args.create.courseId),
    courseVersionId: String(args.create.courseVersionId),
    enrollmentId: String(args.create.enrollmentId),
    quizAttemptId: String(args.create.quizAttemptId),
    userId: String(args.create.userId),
  };
  certificates.push(certificate);
  return certificate;
});

const failureEvidence = "8d6d6219-c0e8-428e-a62c-3b6fc2b6f880";
const passEvidence = "e4c1a8f3-4445-4b22-bbc7-2b33c1e97559";
const failureSubmittedAt = new Date(activeServerNow).toISOString();

function assessment(score: number, attemptNumber: number, evidenceId: string, submittedAt: string) {
  return {
    attemptNumber,
    evidenceId,
    maxScore: 25,
    passed: score >= 20,
    percentage: (score / 25) * 100,
    score,
    submittedAt,
  };
}

async function record({
  assessmentResult,
  completed = false,
  now,
  origin = "http://localhost:5173",
  slug = PM_EXTERNAL_COURSE_SLUG,
  callbackSession = session,
}: {
  assessmentResult: ReturnType<typeof assessment>;
  callbackSession?: AuthSession | null;
  completed?: boolean;
  now: Date;
  origin?: string;
  slug?: string;
}) {
  activeServerNow = new Date(now);
  return recordExternalCourseProgress({
    assessment: assessmentResult,
    completed,
    completedModuleIds: [],
    courseSlug: slug,
    currentModuleId: null,
    currentScreenId: completed ? "PM-GL-03" : "PM-GL-02",
    iframeOrigin: origin,
    learnerStateKey,
    launchToken,
    progressPercent: completed ? 100 : 97,
    sentAt: now.toISOString(),
    session: callbackSession,
  }, {
    runTransaction: (callback) => callback(prisma as unknown as Prisma.TransactionClient),
    serverNow: now,
  });
}

try {
  const firstFailure = await record({
    assessmentResult: assessment(19, 1, failureEvidence, failureSubmittedAt),
    now: activeServerNow,
  });
  assert(firstFailure.success, "The first failed PM assessment was not persisted.");
  assert(firstFailure.assessmentState?.status === "locked", "The failed assessment did not start the cooldown.");
  assert(firstFailure.assessmentState.retryAvailableAt === "2026-08-11T09:15:00.000Z", "The retry timestamp is not server-derived.");
  assert(attempts.length === 1 && attempts[0].percentage === 76, "The 19/25 attempt was not recorded once at 76%.");
  assert(enrollment.status === EnrollmentStatus.IN_PROGRESS, "A failed assessment completed the enrollment.");
  assert(certificates.length === 0, "A failed assessment issued a certificate.");

  const replay = await record({
    assessmentResult: assessment(19, 1, failureEvidence, failureSubmittedAt),
    now: new Date("2026-08-11T09:01:00.000Z"),
  });
  assert(replay.success && attempts.length === 1, "Assessment evidence replay was not idempotent.");

  const earlyRetry = await record({
    assessmentResult: assessment(20, 2, passEvidence, "2026-08-11T09:05:00.000Z"),
    now: new Date("2026-08-11T09:05:00.000Z"),
  });
  assert(!earlyRetry.success && earlyRetry.error === "Assessment retry is locked", "An early retry was accepted.");
  assert(attempts.length === 1, "An early retry created an attempt.");

  const passingSubmission = assessment(20, 2, passEvidence, "2026-08-11T09:15:01.000Z");
  const pass = await record({
    assessmentResult: passingSubmission,
    now: new Date("2026-08-11T09:15:01.000Z"),
  });
  assert(pass.success && pass.assessmentState?.status === "passed", "The exact 20/25 boundary did not pass.");
  assert(Number(attempts.length) === 2 && attempts[1].percentage === 80, "The passing attempt was not recorded at 80%.");
  assert(enrollment.status === EnrollmentStatus.IN_PROGRESS, "Passing alone completed the course.");
  assert(certificates.length === 0, "Passing alone issued a certificate.");

  const completion = await record({
    assessmentResult: passingSubmission,
    completed: true,
    now: new Date("2026-08-11T09:16:00.000Z"),
  });
  assert(completion.success && completion.completed, "The explicit completion callback failed.");
  assert(completion.progressPercent === 100, "Completion did not set progress to 100%.");
  assert((enrollment.status as EnrollmentStatus) === EnrollmentStatus.COMPLETED && enrollment.completedAt, "Completion was not persisted.");
  assert(Number(certificates.length) === 1, "The generic certificate was not issued exactly once.");

  const duplicateCompletion = await record({
    assessmentResult: passingSubmission,
    completed: true,
    now: new Date("2026-08-11T09:17:00.000Z"),
  });
  assert(duplicateCompletion.success, "Duplicate completion was not idempotent.");
  assert(Number(attempts.length) === 2 && Number(certificates.length) === 1, "Duplicate completion created duplicate records.");

  const beforeStandalone = { attempts: attempts.length, certificates: certificates.length };
  const standalone = await record({
    assessmentResult: assessment(25, 3, "5768255b-7a08-43e0-80fa-4384b3bdb724", "2026-08-11T09:18:00.000Z"),
    callbackSession: null,
    now: new Date("2026-08-11T09:18:00.000Z"),
  });
  assert(!standalone.success, "Standalone PM submitted an authoritative Hub attempt.");
  assert(attempts.length === beforeStandalone.attempts && certificates.length === beforeStandalone.certificates, "Standalone PM changed Hub records.");

  assigned = false;
  const unassigned = await record({
    assessmentResult: assessment(25, 3, "4501ad31-f1c5-4b3c-b50d-040387b62b78", "2026-08-11T09:19:00.000Z"),
    now: new Date("2026-08-11T09:19:00.000Z"),
  });
  assigned = true;
  assert(!unassigned.success && unassigned.error === "Unauthorized", "An unassigned learner submitted PM assessment evidence.");

  const wrongOrigin = await record({
    assessmentResult: passingSubmission,
    completed: true,
    now: new Date("2026-08-11T09:20:00.000Z"),
    origin: "https://wrong-course.example",
  });
  assert(!wrongOrigin.success && wrongOrigin.error === "Invalid course origin", "A wrong PM origin was accepted.");

  const wrongSlug = await record({
    assessmentResult: passingSubmission,
    completed: true,
    now: new Date("2026-08-11T09:20:00.000Z"),
    slug: "wrong-course",
  });
  assert(!wrongSlug.success && wrongSlug.error === "Invalid launch context", "A wrong course slug was accepted.");

  const originalExpiry = tokenRecord.expiresAt;
  tokenRecord.expiresAt = new Date("2026-08-11T09:19:59.000Z");
  const expiredToken = await record({
    assessmentResult: passingSubmission,
    completed: true,
    now: new Date("2026-08-11T09:20:00.000Z"),
  });
  tokenRecord.expiresAt = originalExpiry;
  assert(!expiredToken.success && expiredToken.error === "Invalid launch token", "An expired launch token was accepted.");

  const originalProvider = course.analysisMetadataJson.externalCourse.provider;
  course.analysisMetadataJson.externalCourse.provider = "hrba-vite";
  const wrongProvider = await record({
    assessmentResult: passingSubmission,
    completed: true,
    now: new Date("2026-08-11T09:20:00.000Z"),
  });
  course.analysisMetadataJson.externalCourse.provider = originalProvider;
  assert(!wrongProvider.success && wrongProvider.error === "External course not found", "A wrong provider binding was accepted.");

  const foreignEvidence = "0a94c794-2274-4aaf-a3ca-a0f2d7fb3e18";
  attempts.push({
    ...attempts[0],
    answersJson: {},
    courseId: "another-course",
    externalEvidenceId: foreignEvidence,
    id: "foreign-attempt",
    userId: "another-learner",
  });
  const reboundEvidence = await record({
    assessmentResult: assessment(20, 3, foreignEvidence, "2026-08-11T09:20:00.000Z"),
    now: new Date("2026-08-11T09:20:00.000Z"),
  });
  attempts.pop();
  assert(!reboundEvidence.success && reboundEvidence.error === "Assessment evidence context mismatch", "Foreign assessment evidence was rebound.");

  const apiRouteSource = readFileSync(
    new URL("../src/app/api/external-course-progress/route.ts", import.meta.url),
    "utf8",
  );
  const workflowSource = readFileSync(
    new URL("../src/lib/external-course-workflow.ts", import.meta.url),
    "utf8",
  );
  assert(!apiRouteSource.includes("lockedUntil"), "The API accepts a client-provided unlock timestamp.");
  assert(
    workflowSource.includes("latestAttempt.createdAt.getTime() + failedAttemptCooldownMs"),
    "The cooldown is not derived from the persisted server attempt timestamp.",
  );

  const hrba = getTrackedExternalCourseConfig(HRBA_EXTERNAL_COURSE_SLUG);
  assert(hrba?.passThreshold === 80, "HRBA pass threshold changed.");
  assert(hrba.failedAttemptCooldownMs === 0, "PM cooldown was applied to HRBA.");
  assert(!hrba.requiresPriorPassingAssessmentForCompletion, "HRBA completion ordering changed.");

  console.log(JSON.stringify({
    certificateCount: certificates.length,
    completionIdempotent: true,
    earlyRetryRejected: true,
    expiredTokenRejected: true,
    exactPassBoundary: "20/25 = 80%",
    failedAttempt: "19/25 = 76%",
    forgedClientUnlockIgnored: true,
    hrbaConfigurationPreserved: true,
    pmAttemptCount: attempts.length,
    registrationExecuted: false,
    serverCooldownMinutes: 15,
    standaloneRejected: true,
    foreignEvidenceRejected: true,
    wrongProviderRejected: true,
  }, null, 2));
} finally {
  restores.reverse().forEach((restore) => restore());
  await prisma.$disconnect();
}
