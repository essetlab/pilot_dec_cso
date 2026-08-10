import { createHash } from "node:crypto";
import {
  CourseStatus,
  CourseVisibility,
  EnrollmentStatus,
  UserStatus,
} from "../src/generated/prisma/client";
import {
  buildPmExternalCourseMetadata,
  PM_EXTERNAL_COURSE_ID,
  PM_EXTERNAL_COURSE_SLUG,
  PM_EXTERNAL_COURSE_TITLE,
  PM_EXTERNAL_COURSE_VERSION_ID,
} from "../src/lib/external-course-config";
import {
  getExternalCourseLaunchData,
  recordExternalCourseProgress,
} from "../src/lib/external-course-workflow";
import { prisma } from "../src/lib/prisma";
import type { AuthSession } from "../src/lib/auth/session-codec";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const session: AuthSession = {
  email: "pm-learner@example.local",
  issuedAt: new Date().toISOString(),
  name: "PM Learner",
  roles: ["PARTICIPANT"],
  userId: "pm-learner",
};
const learnerStateKey = Buffer.alloc(32, 0x4a).toString("base64url");
const now = new Date();
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
  completedAt: null,
  enrolledAt: new Date(now.getTime() - 60_000),
  externalLearnerStateKey: learnerStateKey,
  externalStateKeyIssuedAt: new Date(now.getTime() - 60_000),
  id: "pm-enrollment",
  progressPercent: 60,
  status: EnrollmentStatus.IN_PROGRESS,
  userId: user.id,
  courseId: course.id,
  courseVersionId: PM_EXTERNAL_COURSE_VERSION_ID,
};

type Restore = () => void;
const restores: Restore[] = [];
function stub(target: object, key: string, replacement: unknown) {
  const original = Reflect.get(target, key);
  Reflect.set(target, key, replacement);
  restores.push(() => Reflect.set(target, key, original));
}

let assigned = true;
let launchAttempts: Array<{
  createdAt: Date;
  externalEvidenceId: string;
  maxScore: number;
  passed: boolean;
  percentage: number;
  score: number;
  submittedAt: Date;
}> = [];
let launchProgressJson: unknown = { currentScreenId: "PM-M4-05" };
let tokenExpired = false;

stub(prisma.user, "findUnique", async () => user);
stub(prisma.courseAssignment, "findFirst", async () => assigned ? { id: "assignment" } : null);
stub(prisma.course, "findFirst", async () => course);
stub(prisma.course, "findUnique", async () => course);
stub(prisma.enrollment, "upsert", async () => enrollment);
stub(prisma.enrollment, "findUnique", async () => enrollment);
stub(prisma.lessonProgress, "upsert", async () => ({ progressJson: launchProgressJson }));
stub(prisma.quizAttempt, "findMany", async () => launchAttempts);
stub(prisma.certificate, "findUnique", async () => null);
stub(prisma.externalCourseLaunchToken, "deleteMany", async () => ({ count: 0 }));
stub(prisma.externalCourseLaunchToken, "create", async () => ({ id: "launch" }));
stub(prisma.externalCourseLaunchToken, "findUnique", async () => ({
  allowedOrigin: "http://localhost:5173",
  courseId: course.id,
  courseSlug: course.slug,
  courseVersionId: PM_EXTERNAL_COURSE_VERSION_ID,
  enrollmentId: enrollment.id,
  expiresAt: tokenExpired
    ? new Date(Date.now() - 1)
    : new Date(Date.now() + 60_000),
  id: "launch-token",
  learnerStateKeyHash: createHash("sha256").update(learnerStateKey).digest("hex"),
  portalOrigin: "http://localhost:3000",
  tokenHash: "ignored-by-mock",
  userId: user.id,
}));
try {
  const assignedLaunch = await getExternalCourseLaunchData(PM_EXTERNAL_COURSE_SLUG, session);
  assert(assignedLaunch, "An assigned learner could not obtain PM launch data.");
  assert(assignedLaunch.resumeScreenId === "PM-M4-05", "Valid persisted resume was not restored.");
  assert(assignedLaunch.initialProgressPercent === 60, "Persisted progress was not included.");
  assert(assignedLaunch.supportsSecureNewTab === false, "PM tracked new-tab launch is enabled.");
  assert(!assignedLaunch.iframeSrc.includes("userId="), "Raw user ID leaked into the iframe URL.");
  assert(!assignedLaunch.iframeSrc.includes("enrollmentId="), "Raw enrollment ID leaked into the iframe URL.");

  const failedAt = new Date();
  launchAttempts = [{
    createdAt: failedAt,
    externalEvidenceId: "afdf6b66-9d64-43f7-852f-23b1586857ed",
    maxScore: 25,
    passed: false,
    percentage: 76,
    score: 19,
    submittedAt: failedAt,
  }];
  const lockedLaunch = await getExternalCourseLaunchData(PM_EXTERNAL_COURSE_SLUG, session);
  assert(lockedLaunch?.assessmentState?.status === "locked", "A persisted failed attempt did not restore the lock.");
  assert(lockedLaunch.assessmentState.attemptCount === 1, "The authoritative attempt count was not restored.");
  assert(Boolean(lockedLaunch.assessmentState.retryAvailableAt), "The authoritative retry timestamp was not restored.");

  launchAttempts = [{ ...launchAttempts[0], passed: true, percentage: 80, score: 20 }];
  const passedLaunch = await getExternalCourseLaunchData(PM_EXTERNAL_COURSE_SLUG, session);
  assert(passedLaunch?.assessmentState?.status === "passed", "A persisted passing attempt was not restored.");
  launchAttempts = [];

  assigned = false;
  assert(
    await getExternalCourseLaunchData(PM_EXTERNAL_COURSE_SLUG, session) === null,
    "An unassigned learner obtained PM launch data.",
  );
  assigned = true;

  launchProgressJson = { currentScreenId: "PM-NOT-CANONICAL" };
  const invalidResumeLaunch = await getExternalCourseLaunchData(PM_EXTERNAL_COURSE_SLUG, session);
  assert(invalidResumeLaunch?.resumeScreenId === null, "Invalid persisted resume did not fall back safely.");

  const baseProgress = {
    completed: false,
    completedModuleIds: [],
    courseSlug: PM_EXTERNAL_COURSE_SLUG,
    currentModuleId: "module-3",
    currentScreenId: "PM-M3-03",
    iframeOrigin: "http://localhost:5173",
    learnerStateKey,
    launchToken: "opaque-launch-token",
    progressPercent: 20,
    sentAt: new Date().toISOString(),
    session,
  };

  const wrongOrigin = await recordExternalCourseProgress({
    ...baseProgress,
    iframeOrigin: "https://wrong-course.example",
  });
  assert(!wrongOrigin.success && wrongOrigin.error === "Invalid course origin", "Wrong iframe origin was accepted.");

  tokenExpired = true;
  const expired = await recordExternalCourseProgress(baseProgress);
  assert(!expired.success && expired.error === "Invalid launch token", "Expired token was accepted.");
  tokenExpired = false;

  const wrongSlug = await recordExternalCourseProgress({
    ...baseProgress,
    courseSlug: "wrong-course",
  });
  assert(!wrongSlug.success && wrongSlug.error === "Invalid launch context", "Wrong course slug was accepted.");

  assert(
    (await recordExternalCourseProgress({
      ...baseProgress,
      currentScreenId: "PM-NOT-CANONICAL",
    })).error === "Invalid canonical screen",
    "Invalid PM current screen was accepted.",
  );

  console.log(JSON.stringify({
    assignedLaunch: true,
    expiredTokenRejected: true,
    invalidResumeFallback: true,
    lockedAssessmentHydrated: true,
    passedAssessmentHydrated: true,
    unassignedLaunchRejected: true,
    wrongOriginRejected: true,
    wrongSlugRejected: true,
  }, null, 2));
} finally {
  restores.reverse().forEach((restore) => restore());
  await prisma.$disconnect();
}
