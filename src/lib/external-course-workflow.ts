import { revalidatePath } from "next/cache";
import { createHash, randomBytes, timingSafeEqual } from "node:crypto";
import {
  ContentBlockType,
  CourseLevel,
  CourseStatus,
  CourseVisibility,
  EnrollmentStatus,
  LessonProgressStatus,
  QuizAttemptStatus,
  QuizQuestionType,
  RoleKey,
  UserStatus,
  CertificateStatus,
  type Prisma,
} from "../generated/prisma/client";
import {
  buildHrbaExternalCourseMetadata,
  getExternalCourseMetadata,
  HRBA_EXTERNAL_COURSE_ID,
  HRBA_EXTERNAL_COURSE_LESSON_ID,
  HRBA_EXTERNAL_COURSE_MODULE_ID,
  HRBA_EXTERNAL_COURSE_QUESTION_ID,
  HRBA_EXTERNAL_COURSE_QUIZ_ID,
  HRBA_EXTERNAL_COURSE_SLUG,
  HRBA_EXTERNAL_COURSE_VERSION_ID,
} from "./external-course-config";
import type {
  ExternalCourseAssessmentResult,
  ExternalCourseLaunchData,
} from "./external-course-types";
import { isValidExternalCourseEvidenceId } from "./external-course-types";
import {
  deriveHrbaProgressPercent,
  extractStoredHrbaResumeState,
  type HrbaResumeState,
  type HrbaTrustedAssessmentState,
  validateHrbaProgressSummary,
  validateHrbaResumeState,
  withHrbaResumeRevision,
} from "./hrba-resume-contract";
import type { AuthSession } from "./auth/session-codec";
import { prisma } from "./prisma";
import { hasLearnerCourseEntitlement } from "./course-entitlement";
import { isLocalQaFixtureAllowed } from "./local-qa-guard";

const issuerName = "DEC / WHH CSF+ CSO Learning Hub";
const externalCourseLaunchTokenTtlMs = 8 * 60 * 60 * 1000;
const externalCourseFutureClockToleranceMs = 5 * 60 * 1000;
const externalCourseContextClockToleranceMs = 60 * 1000;
const opaqueLearnerStateKeyPattern = /^[A-Za-z0-9_-]{43}$/;

function toJson(value: unknown): Prisma.InputJsonValue {
  return JSON.parse(JSON.stringify(value ?? {})) as Prisma.InputJsonValue;
}

function createExternalCourseLaunchToken() {
  return randomBytes(32).toString("base64url");
}

function createExternalLearnerStateKey() {
  return randomBytes(32).toString("base64url");
}

function hashExternalCourseLaunchToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

function opaqueValueMatchesHash(value: string, expectedHash: string | null) {
  if (!expectedHash) {
    return false;
  }

  const actual = Buffer.from(hashExternalCourseLaunchToken(value), "hex");
  const expected = Buffer.from(expectedHash, "hex");

  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

function getPortalOrigin() {
  return process.env.NEXT_PUBLIC_APP_URL?.trim() || "http://localhost:3000";
}

function buildCertificateCode(courseVersionId: string, userId: string) {
  const versionSuffix = courseVersionId
    .substring(Math.max(0, courseVersionId.length - 4))
    .toUpperCase();
  const userSuffix = userId.substring(Math.max(0, userId.length - 4)).toUpperCase();
  const randSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();

  return `CERT-${versionSuffix}-${userSuffix}-${randSuffix}`;
}

function normalizeAssessmentResult(
  assessment: ExternalCourseAssessmentResult | undefined,
) {
  if (!assessment) {
    return null;
  }

  const score = assessment.score;
  const maxScore = assessment.maxScore;
  const computedPercentage =
    assessment.percentage ??
    (score !== undefined && maxScore !== undefined && maxScore > 0
      ? (score / maxScore) * 100
      : undefined);

  if (
    score !== undefined &&
    maxScore !== undefined &&
    (score < 0 || maxScore <= 0 || score > maxScore)
  ) {
    return null;
  }

  if (
    computedPercentage === undefined ||
    !Number.isFinite(computedPercentage) ||
    computedPercentage < 0 ||
    computedPercentage > 100 ||
    typeof assessment.passed !== "boolean"
  ) {
    return null;
  }

  if (
    !assessment.evidenceId ||
    !isValidExternalCourseEvidenceId(assessment.evidenceId) ||
    !assessment.submittedAt ||
    !Number.isInteger(assessment.attemptNumber) ||
    (assessment.attemptNumber ?? 0) < 1
  ) {
    return null;
  }

  const submittedAt = new Date(assessment.submittedAt);

  if (Number.isNaN(submittedAt.getTime())) {
    return null;
  }

  return {
    attemptNumber: assessment.attemptNumber,
    evidenceId: assessment.evidenceId,
    maxScore:
      maxScore !== undefined
        ? Math.round(maxScore)
        : score !== undefined
          ? Math.round(score)
          : 100,
    passed: assessment.passed,
    percentage: computedPercentage,
    score:
      score !== undefined
        ? Math.round(score)
        : Math.round(computedPercentage),
    submittedAt,
  };
}

type NormalizedExternalAssessment = NonNullable<
  ReturnType<typeof normalizeAssessmentResult>
>;

type ExternalAssessmentEvidenceContext = {
  assessment: NormalizedExternalAssessment;
  assessmentPassed: boolean;
  completedModuleIds: string[];
  courseId: string;
  courseVersionId: string;
  currentModuleId: string | null;
  currentScreenId: string | null;
  iframeOrigin: string;
  learnerStateKeyHash: string;
  maxScore: number;
  percentage: number;
  questionId: string;
  quizId: string;
  score: number;
  userId: string;
};

class ExternalCourseEvidenceConflictError extends Error {}
class ExternalCourseResumeConflictError extends Error {}

function asJsonRecord(value: Prisma.JsonValue | null): Record<string, Prisma.JsonValue> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value as Record<string, Prisma.JsonValue>
    : {};
}

function getTrustedAssessmentState(
  attempt: {
    answersJson: Prisma.JsonValue | null;
    externalEvidenceId: string | null;
    maxScore: number | null;
    passed: boolean;
    percentage: number | null;
    score: number | null;
    submittedAt: Date | null;
  } | null,
): HrbaTrustedAssessmentState {
  if (!attempt?.externalEvidenceId
    || attempt.maxScore === null
    || attempt.percentage === null
    || attempt.score === null
    || !attempt.submittedAt) return null;
  const answers = asJsonRecord(attempt.answersJson);
  const assessment = answers.assessment;
  const attemptNumber = assessment && typeof assessment === "object" && !Array.isArray(assessment)
    && typeof assessment.attemptNumber === "number"
    ? assessment.attemptNumber
    : null;
  if (!Number.isInteger(attemptNumber) || (attemptNumber ?? 0) < 1) return null;
  return {
    attemptNumber: attemptNumber as number,
    evidenceId: attempt.externalEvidenceId,
    maxScore: attempt.maxScore,
    passed: attempt.passed,
    percentage: Math.round(attempt.percentage),
    score: attempt.score,
    submittedAt: attempt.submittedAt.toISOString(),
  };
}

function isUniqueConstraintError(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === "P2002"
  );
}

function buildExternalEvidenceFingerprint(
  context: ExternalAssessmentEvidenceContext,
) {
  return createHash("sha256")
    .update(
      JSON.stringify({
        assessment: {
          attemptNumber: context.assessment.attemptNumber,
          evidenceId: context.assessment.evidenceId,
          maxScore: context.maxScore,
          passed: context.assessment.passed,
          percentage: context.percentage,
          score: context.score,
          submittedAt: context.assessment.submittedAt.toISOString(),
        },
        completedModuleIds: [...context.completedModuleIds].sort(),
        courseId: context.courseId,
        courseVersionId: context.courseVersionId,
        currentModuleId: context.currentModuleId,
        currentScreenId: context.currentScreenId,
        iframeOrigin: context.iframeOrigin,
        learnerStateKeyHash: context.learnerStateKeyHash,
        quizId: context.quizId,
        userId: context.userId,
      }),
    )
    .digest("hex");
}

function getAttemptEvidenceFingerprint(answersJson: Prisma.JsonValue | null) {
  if (!answersJson || typeof answersJson !== "object" || Array.isArray(answersJson)) {
    return null;
  }

  return typeof answersJson.externalEvidenceFingerprint === "string"
    ? answersJson.externalEvidenceFingerprint
    : null;
}

function externalAttemptMatches(
  attempt: {
    answersJson: Prisma.JsonValue | null;
    courseId: string;
    courseVersionId: string;
    externalEvidenceId: string | null;
    externalLearnerStateKeyHash: string | null;
    quizId: string;
    userId: string;
  },
  context: ExternalAssessmentEvidenceContext,
) {
  return (
    attempt.externalEvidenceId === context.assessment.evidenceId &&
    attempt.externalLearnerStateKeyHash === context.learnerStateKeyHash &&
    attempt.userId === context.userId &&
    attempt.courseId === context.courseId &&
    attempt.courseVersionId === context.courseVersionId &&
    attempt.quizId === context.quizId &&
    getAttemptEvidenceFingerprint(attempt.answersJson) ===
      buildExternalEvidenceFingerprint(context)
  );
}

async function getExternalCompletionQuiz() {
  const quiz = await prisma.quiz.findUnique({
    include: { questions: true },
    where: { id: HRBA_EXTERNAL_COURSE_QUIZ_ID },
  });
  const question = quiz?.questions[0];

  if (!quiz || !question) {
    return null;
  }

  return { quiz, question };
}

async function upsertExternalAssessmentAttempt(
  tx: Prisma.TransactionClient,
  context: ExternalAssessmentEvidenceContext,
) {
  const evidenceFingerprint = buildExternalEvidenceFingerprint(context);
  const evidenceAttempt = await tx.quizAttempt.upsert({
    create: {
      answersJson: toJson({
        [context.questionId]: context.assessmentPassed
          ? "completed"
          : "not completed",
        assessment: {
          attemptNumber: context.assessment.attemptNumber,
          evidenceId: context.assessment.evidenceId,
          maxScore: context.maxScore,
          passed: context.assessment.passed,
          percentage: context.percentage,
          score: context.score,
          submittedAt: context.assessment.submittedAt.toISOString(),
        },
        completedModuleIds: [...context.completedModuleIds].sort(),
        currentModuleId: context.currentModuleId,
        currentScreenId: context.currentScreenId,
        externalEvidenceFingerprint: evidenceFingerprint,
        iframeOrigin: context.iframeOrigin,
        source: "external-course-postmessage",
      }),
      courseId: context.courseId,
      courseVersionId: context.courseVersionId,
      externalEvidenceId: context.assessment.evidenceId,
      externalLearnerStateKeyHash: context.learnerStateKeyHash,
      maxScore: context.maxScore,
      passed: context.assessmentPassed,
      percentage: context.percentage,
      quizId: context.quizId,
      score: context.score,
      status: context.assessmentPassed
        ? QuizAttemptStatus.PASSED
        : QuizAttemptStatus.FAILED,
      submittedAt: context.assessment.submittedAt,
      userId: context.userId,
    },
    update: {},
    where: { externalEvidenceId: context.assessment.evidenceId },
  });

  if (!externalAttemptMatches(evidenceAttempt, context)) {
    throw new ExternalCourseEvidenceConflictError(
      "Assessment evidence context mismatch",
    );
  }

  return evidenceAttempt;
}

async function ensureIntegrationOwner() {
  const existingAdmin = await prisma.user.findFirst({
    where: {
      roleAssignments: {
        some: {
          isActive: true,
          role: {
            key: {
              in: [RoleKey.SUPER_ADMIN, RoleKey.PLATFORM_ADMIN],
            },
          },
        },
      },
    },
  });

  if (existingAdmin) {
    return existingAdmin;
  }

  const role = await prisma.role.upsert({
    create: {
      key: RoleKey.SUPER_ADMIN,
      name: "Super Admin",
      description: "Full platform administration access.",
    },
    update: {},
    where: { key: RoleKey.SUPER_ADMIN },
  });

  const user = await prisma.user.upsert({
    create: {
      email: "integration-admin@example.local",
      fullName: "Integration Admin",
      status: UserStatus.ACTIVE,
    },
    update: {},
    where: { email: "integration-admin@example.local" },
  });

  await prisma.userRoleAssignment.upsert({
    create: {
      assignedById: user.id,
      isActive: true,
      roleId: role.id,
      userId: user.id,
    },
    update: { isActive: true },
    where: {
      userId_roleId: {
        roleId: role.id,
        userId: user.id,
      },
    },
  });

  return user;
}

async function ensureHrbaCapacityAreas() {
  const definitions = [
    {
      id: "CAP-ADV",
      name: "Evidence-Based Advocacy and Civic Engagement",
      slug: "evidence-based-advocacy-and-civic-engagement",
      sortOrder: 6,
    },
    {
      id: "CAP-HRSAFE",
      name: "Human Resources, Inclusion, and Safeguarding",
      slug: "human-resources-inclusion-and-safeguarding",
      sortOrder: 5,
    },
  ] as const;

  return Promise.all(
    definitions.map((definition) =>
      prisma.capacityArea.upsert({
        create: {
          ...definition,
          description: `${definition.name} capacity area.`,
          isActive: true,
        },
        update: {
          description: `${definition.name} capacity area.`,
          isActive: true,
          name: definition.name,
          slug: definition.slug,
          sortOrder: definition.sortOrder,
        },
        where: { id: definition.id },
      }),
    ),
  );
}

export async function registerHrbaExternalCourse() {
  const owner = await ensureIntegrationOwner();
  const capacityAreas = await ensureHrbaCapacityAreas();
  const metadata = buildHrbaExternalCourseMetadata();

  const course = await prisma.course.upsert({
    create: {
      id: HRBA_EXTERNAL_COURSE_ID,
      analysisMetadataJson: toJson({
        externalCourse: metadata,
        learnerTemplate: "external-iframe",
      }),
      assignedCreatorId: owner.id,
      certificateEligible: true,
      createdById: owner.id,
      defaultPassThreshold: 80,
      estimatedDurationMinutes: 390,
      finalTestRequired: true,
      language: "English",
      level: CourseLevel.FOUNDATIONAL,
      longDescription:
        "Apply human rights-based thinking to everyday CSO programme work by strengthening participation, inclusion, accountability, dignity, and safe evidence use. This interactive HRBA course focuses on rights-holders, duty-bearers, participation, inclusion, non-discrimination, power and barriers, safe evidence, project-cycle decisions, final assessment, and certificate eligibility.",
      shortDescription:
        "Apply human rights-based thinking to everyday CSO programme work by strengthening participation, inclusion, accountability, dignity, and safe evidence use.",
      slug: HRBA_EXTERNAL_COURSE_SLUG,
      status: CourseStatus.PUBLISHED,
      targetAudience:
        "Local and grassroots CSO staff, focal persons, facilitators, and programme teams applying HRBA in practical project work.",
      title: "Applying the Human Rights-Based Approach in CSO Practice",
      visibility: CourseVisibility.ASSIGNED_ONLY,
    },
    update: {
      analysisMetadataJson: toJson({
        externalCourse: metadata,
        learnerTemplate: "external-iframe",
      }),
      archivedAt: null,
      certificateEligible: true,
      defaultPassThreshold: 80,
      estimatedDurationMinutes: 390,
      finalTestRequired: true,
      language: "English",
      level: CourseLevel.FOUNDATIONAL,
      longDescription:
        "Apply human rights-based thinking to everyday CSO programme work by strengthening participation, inclusion, accountability, dignity, and safe evidence use. This interactive HRBA course focuses on rights-holders, duty-bearers, participation, inclusion, non-discrimination, power and barriers, safe evidence, project-cycle decisions, final assessment, and certificate eligibility.",
      shortDescription:
        "Apply human rights-based thinking to everyday CSO programme work by strengthening participation, inclusion, accountability, dignity, and safe evidence use.",
      status: CourseStatus.PUBLISHED,
      targetAudience:
        "Local and grassroots CSO staff, focal persons, facilitators, and programme teams applying HRBA in practical project work.",
      title: "Applying the Human Rights-Based Approach in CSO Practice",
      visibility: CourseVisibility.ASSIGNED_ONLY,
    },
    where: { slug: HRBA_EXTERNAL_COURSE_SLUG },
  });

  for (const capacityArea of capacityAreas) {
    await prisma.courseCapacityArea.upsert({
      create: {
        capacityAreaId: capacityArea.id,
        courseId: course.id,
      },
      update: {},
      where: {
        courseId_capacityAreaId: {
          capacityAreaId: capacityArea.id,
          courseId: course.id,
        },
      },
    });
  }

  await prisma.courseVersion.upsert({
    create: {
      id: HRBA_EXTERNAL_COURSE_VERSION_ID,
      courseId: course.id,
      createdById: owner.id,
      publishedAt: new Date(),
      publishedById: owner.id,
      status: CourseStatus.PUBLISHED,
      versionNumber: 1,
    },
    update: {
      publishedAt: new Date(),
      publishedById: owner.id,
      status: CourseStatus.PUBLISHED,
    },
    where: {
      courseId_versionNumber: {
        courseId: course.id,
        versionNumber: 1,
      },
    },
  });

  await prisma.module.upsert({
    create: {
      id: HRBA_EXTERNAL_COURSE_MODULE_ID,
      courseVersionId: HRBA_EXTERNAL_COURSE_VERSION_ID,
      description: "Embedded HRBA course app covering Modules 1-5.",
      estimatedDurationMinutes: 390,
      order: 1,
      title: "Interactive HRBA course",
    },
    update: {
      description: "Embedded HRBA course app covering Modules 1-5.",
      estimatedDurationMinutes: 390,
      title: "Interactive HRBA course",
    },
    where: {
      courseVersionId_order: {
        courseVersionId: HRBA_EXTERNAL_COURSE_VERSION_ID,
        order: 1,
      },
    },
  });

  await prisma.lesson.upsert({
    create: {
      id: HRBA_EXTERNAL_COURSE_LESSON_ID,
      completionRequired: true,
      completionRule: "External course sends validated postMessage completion.",
      description: "Launch the embedded HRBA course and complete all five modules.",
      estimatedDurationMinutes: 390,
      moduleId: HRBA_EXTERNAL_COURSE_MODULE_ID,
      order: 1,
      title: "Complete the embedded HRBA course",
    },
    update: {
      completionRequired: true,
      completionRule: "External course sends validated postMessage completion.",
      description: "Launch the embedded HRBA course and complete all five modules.",
      estimatedDurationMinutes: 390,
      title: "Complete the embedded HRBA course",
    },
    where: {
      moduleId_order: {
        moduleId: HRBA_EXTERNAL_COURSE_MODULE_ID,
        order: 1,
      },
    },
  });

  await prisma.contentBlock.upsert({
    create: {
      id: "BLK-HRBA-EXTERNAL-VITE-LAUNCH",
      configJson: toJson({
        launchPath: `/learn/courses/${HRBA_EXTERNAL_COURSE_SLUG}/external`,
        source: metadata.launchUrl,
      }),
      estimatedDurationMinutes: 390,
      isRequired: true,
      lessonId: HRBA_EXTERNAL_COURSE_LESSON_ID,
      order: 1,
      title: "Embedded HRBA course app",
      type: ContentBlockType.EXTERNAL_LINK,
    },
    update: {
      configJson: toJson({
        launchPath: `/learn/courses/${HRBA_EXTERNAL_COURSE_SLUG}/external`,
        source: metadata.launchUrl,
      }),
      estimatedDurationMinutes: 390,
      title: "Embedded HRBA course app",
      type: ContentBlockType.EXTERNAL_LINK,
    },
    where: {
      lessonId_order: {
        lessonId: HRBA_EXTERNAL_COURSE_LESSON_ID,
        order: 1,
      },
    },
  });

  const outcomes = [
    "Identify rights-holders, duty-bearers, and supporting actors in practical CSO situations.",
    "Recognize barriers to participation, access, information, and accountability.",
    "Apply HRBA principles to project design and implementation choices.",
    "Use safe, practical analysis without exposing people or sensitive information.",
    "Prepare for a final assessment linked to HRBA practice.",
  ];

  for (const [index, statement] of outcomes.entries()) {
    await prisma.learningOutcome.upsert({
      create: {
        courseId: course.id,
        order: index + 1,
        statement,
      },
      update: { statement },
      where: {
        courseId_order: {
          courseId: course.id,
          order: index + 1,
        },
      },
    });
  }

  await prisma.quiz.upsert({
    create: {
      id: HRBA_EXTERNAL_COURSE_QUIZ_ID,
      courseVersionId: HRBA_EXTERNAL_COURSE_VERSION_ID,
      description:
        "Completion record created after the embedded HRBA course sends a validated completion event.",
      isFinalTest: true,
      passThreshold: 80,
      retakeAllowed: false,
      title: "External course completion check",
    },
    update: {
      description:
        "Completion record created after the embedded HRBA course sends a validated completion event.",
      isFinalTest: true,
      passThreshold: 80,
      retakeAllowed: false,
      title: "External course completion check",
    },
    where: { id: HRBA_EXTERNAL_COURSE_QUIZ_ID },
  });

  await prisma.quizQuestion.upsert({
    create: {
      id: HRBA_EXTERNAL_COURSE_QUESTION_ID,
      configJson: toJson({
        correctAnswer: "completed",
        options: ["completed", "not completed"],
        source: "external-course-postmessage",
      }),
      order: 1,
      points: 1,
      questionText: "Embedded HRBA course completed",
      quizId: HRBA_EXTERNAL_COURSE_QUIZ_ID,
      type: QuizQuestionType.TRUE_FALSE,
    },
    update: {
      configJson: toJson({
        correctAnswer: "completed",
        options: ["completed", "not completed"],
        source: "external-course-postmessage",
      }),
      questionText: "Embedded HRBA course completed",
    },
    where: {
      quizId_order: {
        order: 1,
        quizId: HRBA_EXTERNAL_COURSE_QUIZ_ID,
      },
    },
  });

  return course;
}

export async function getExternalCourseLaunchData(
  courseSlug: string,
  session: AuthSession | null,
): Promise<ExternalCourseLaunchData | null> {
  try {
    if (!session?.userId) {
      return null;
    }

    const user = await prisma.user.findUnique({
      where: { id: session.userId },
    });
    if (!user || user.status !== UserStatus.ACTIVE) {
      return null;
    }

    const course = await prisma.course.findFirst({
      include: {
        versions: {
          orderBy: { versionNumber: "desc" },
          take: 1,
          where: { status: CourseStatus.PUBLISHED },
        },
      },
      where: {
        archivedAt: null,
        slug: courseSlug,
        status: CourseStatus.PUBLISHED,
        visibility: {
          in: [CourseVisibility.PUBLIC, CourseVisibility.ASSIGNED_ONLY],
        },
      },
    });

    const version = course?.versions[0];
    const metadata = getExternalCourseMetadata(course?.analysisMetadataJson);

    if (!course || !version || !metadata) {
      return null;
    }

    if (!(await hasLearnerCourseEntitlement({
      courseId: course.id,
      courseSlug: course.slug,
      organizationId: user.organizationId,
      primaryCohortId: user.primaryCohortId,
      userId: user.id,
      visibility: course.visibility,
    }))) {
      return null;
    }

    let enrollment = await prisma.enrollment.upsert({
      create: {
        courseId: course.id,
        courseVersionId: version.id,
        progressPercent: 0,
        startedAt: new Date(),
        status: EnrollmentStatus.IN_PROGRESS,
        userId: user.id,
      },
      update: {
        lastAccessedAt: new Date(),
      },
      where: {
        userId_courseVersionId: {
          courseVersionId: version.id,
          userId: user.id,
        },
      },
    });

    if (!enrollment.externalLearnerStateKey || !enrollment.externalStateKeyIssuedAt) {
      const learnerStateKey = createExternalLearnerStateKey();
      const stateKeyIssuedAt = new Date();

      await prisma.enrollment.updateMany({
        data: {
          externalLearnerStateKey: learnerStateKey,
          externalStateKeyIssuedAt: stateKeyIssuedAt,
        },
        where: {
          externalLearnerStateKey: null,
          id: enrollment.id,
        },
      });

      enrollment = await prisma.enrollment.findUniqueOrThrow({
        where: { id: enrollment.id },
      });
    }

    const learnerStateKey = enrollment.externalLearnerStateKey;

    if (!learnerStateKey || !enrollment.externalStateKeyIssuedAt) {
      return null;
    }

    const lessonProgress = await prisma.lessonProgress.upsert({
      create: {
        enrollmentId: enrollment.id,
        lessonId: HRBA_EXTERNAL_COURSE_LESSON_ID,
        progressJson: toJson({ source: "external-course-launch" }),
        startedAt: new Date(),
        status: LessonProgressStatus.IN_PROGRESS,
      },
      update: {
        lastAccessedAt: new Date(),
        startedAt: new Date(),
        status:
          enrollment.status === EnrollmentStatus.COMPLETED
            ? LessonProgressStatus.COMPLETED
            : LessonProgressStatus.IN_PROGRESS,
      },
      where: {
        enrollmentId_lessonId: {
          enrollmentId: enrollment.id,
          lessonId: HRBA_EXTERNAL_COURSE_LESSON_ID,
        },
      },
    });

    const iframeUrl = new URL(metadata.launchUrl);
    const allowedOrigin = iframeUrl.origin;

    if (!metadata.allowedOrigins.includes(allowedOrigin)) {
      return null;
    }

    const now = new Date();
    const launchToken = createExternalCourseLaunchToken();

    await prisma.externalCourseLaunchToken.deleteMany({
      where: {
        expiresAt: {
          lt: now,
        },
      },
    });

    await prisma.externalCourseLaunchToken.create({
      data: {
        allowedOrigin,
        courseId: course.id,
        courseSlug: course.slug,
        courseVersionId: version.id,
        enrollmentId: enrollment.id,
        expiresAt: new Date(now.getTime() + externalCourseLaunchTokenTtlMs),
        learnerStateKeyHash: hashExternalCourseLaunchToken(learnerStateKey),
        portalOrigin: getPortalOrigin(),
        tokenHash: hashExternalCourseLaunchToken(launchToken),
        userId: user.id,
      },
    });

    iframeUrl.searchParams.set("embed", "portal");
    iframeUrl.searchParams.set("portalOrigin", getPortalOrigin());
    iframeUrl.searchParams.set("courseSlug", course.slug);
    iframeUrl.searchParams.set("launchToken", launchToken);

    const storedResumeState = extractStoredHrbaResumeState(lessonProgress.progressJson);
    const resumeRevision = lessonProgress.updatedAt.toISOString();
    const latestAssessmentAttempt = await prisma.quizAttempt.findFirst({
      orderBy: [
        { submittedAt: "desc" },
        { createdAt: "desc" },
      ],
      where: {
        courseId: course.id,
        courseVersionId: version.id,
        externalLearnerStateKeyHash: hashExternalCourseLaunchToken(learnerStateKey),
        quizId: HRBA_EXTERNAL_COURSE_QUIZ_ID,
        status: { in: [QuizAttemptStatus.SUBMITTED, QuizAttemptStatus.PASSED, QuizAttemptStatus.FAILED] },
        userId: user.id,
      },
    });

    return {
      allowedOrigin,
      courseSlug: course.slug,
      courseTitle: course.title,
      iframeSrc: iframeUrl.toString(),
      launchToken,
      learnerStateKey,
      resumeRevision,
      resumeState: storedResumeState
        ? withHrbaResumeRevision(storedResumeState, resumeRevision)
        : null,
      trustedAssessmentState: getTrustedAssessmentState(latestAssessmentAttempt),
    };
  } catch (error) {
    console.warn("getExternalCourseLaunchData database error, attempting fallback:", error);
    const allowFixtures = await isLocalQaFixtureAllowed();
    if (!allowFixtures) {
      throw error;
    }
  }

  const allowFixtures = await isLocalQaFixtureAllowed();
  if (allowFixtures && courseSlug === HRBA_EXTERNAL_COURSE_SLUG) {
    return {
      allowedOrigin: "https://pilot-hrba-e-learn-v1-wajj.vercel.app",
      courseSlug: HRBA_EXTERNAL_COURSE_SLUG,
      courseTitle: "Applying the Human Rights-Based Approach in CSO Practice",
      iframeSrc: "https://pilot-hrba-e-learn-v1-wajj.vercel.app?embed=portal&courseSlug=" + HRBA_EXTERNAL_COURSE_SLUG + "&launchToken=mock_launch_token",
      launchToken: "mock_launch_token",
      learnerStateKey: "mock_learner_state_key",
      resumeRevision: new Date(0).toISOString(),
      resumeState: null,
      trustedAssessmentState: null,
    };
  }

  return null;
}

export async function recordExternalCourseProgress({
  assessment,
  baseRevision,
  completed,
  completedModuleIds,
  courseSlug,
  currentModuleId,
  currentScreenId,
  iframeOrigin,
  learnerStateKey,
  legacyBootstrap,
  launchToken,
  resumeState,
  sentAt,
  session,
}: {
  assessment?: ExternalCourseAssessmentResult;
  baseRevision?: string | null;
  completed: boolean;
  completedModuleIds: string[];
  courseSlug: string;
  currentModuleId: string | null;
  currentScreenId: string | null;
  iframeOrigin: string;
  learnerStateKey: string;
  legacyBootstrap?: boolean;
  launchToken: string;
  progressPercent: number;
  resumeState?: unknown;
  sentAt: string;
  session: AuthSession | null;
}) {
  if (!session?.userId) {
    return { success: false, error: "Unauthorized" };
  }

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
  });
  if (!user || user.status !== UserStatus.ACTIVE) {
    return { success: false, error: "Unauthorized" };
  }

  if (!launchToken) {
    return { success: false, error: "Invalid launch token" };
  }

  const tokenRecord = await prisma.externalCourseLaunchToken.findUnique({
    where: { tokenHash: hashExternalCourseLaunchToken(launchToken) },
  });

  if (!tokenRecord || tokenRecord.expiresAt.getTime() <= Date.now()) {
    return { success: false, error: "Invalid launch token" };
  }

  if (tokenRecord.userId !== user.id) {
    return { success: false, error: "Unauthorized" };
  }

  if (tokenRecord.courseSlug !== courseSlug) {
    return { success: false, error: "Invalid launch context" };
  }

  if (tokenRecord.allowedOrigin !== iframeOrigin) {
    return { success: false, error: "Invalid course origin" };
  }

  if (tokenRecord.portalOrigin !== getPortalOrigin()) {
    return { success: false, error: "Invalid Hub origin" };
  }

  if (
    !learnerStateKey ||
    !opaqueLearnerStateKeyPattern.test(learnerStateKey) ||
    !opaqueValueMatchesHash(learnerStateKey, tokenRecord.learnerStateKeyHash)
  ) {
    return { success: false, error: "Invalid learner state context" };
  }

  const callbackSentAt = new Date(sentAt);
  const serverNow = new Date();

  if (
    !sentAt ||
    Number.isNaN(callbackSentAt.getTime()) ||
    callbackSentAt.getTime() >
      serverNow.getTime() + externalCourseFutureClockToleranceMs
  ) {
    return { success: false, error: "Invalid callback timestamp" };
  }

  const course = await prisma.course.findUnique({
    include: {
      versions: {
        where: { id: tokenRecord.courseVersionId, status: CourseStatus.PUBLISHED },
      },
    },
    where: { slug: courseSlug },
  });
  const version = course?.versions[0];
  const metadata = getExternalCourseMetadata(course?.analysisMetadataJson);

  if (!course || !version || !metadata) {
    return { success: false, error: "External course not found" };
  }

  if (!(await hasLearnerCourseEntitlement({
    courseId: course.id,
    courseSlug: course.slug,
    organizationId: user.organizationId,
    primaryCohortId: user.primaryCohortId,
    userId: user.id,
    visibility: course.visibility,
  }))) {
    return { success: false, error: "Unauthorized" };
  }

  if (!metadata.allowedOrigins.includes(iframeOrigin)) {
    return { success: false, error: "Invalid course origin" };
  }

  const enrollment = await prisma.enrollment.findUnique({
    where: { id: tokenRecord.enrollmentId },
  });

  if (
    !enrollment ||
    enrollment.userId !== user.id ||
    enrollment.courseId !== course.id ||
    enrollment.courseVersionId !== version.id ||
    !enrollment.externalLearnerStateKey ||
    !enrollment.externalStateKeyIssuedAt ||
    enrollment.externalLearnerStateKey !== learnerStateKey
  ) {
    return { success: false, error: "Enrollment not found" };
  }

  const lessonProgress = await prisma.lessonProgress.findUnique({
    where: {
      enrollmentId_lessonId: {
        enrollmentId: enrollment.id,
        lessonId: HRBA_EXTERNAL_COURSE_LESSON_ID,
      },
    },
  });
  if (!lessonProgress) {
    return { success: false, error: "Learning progress not initialized" };
  }
  const progressRecord = asJsonRecord(lessonProgress.progressJson);
  const hasStoredResumeState = Object.hasOwn(progressRecord, "resumeState");
  const storedResumeState = extractStoredHrbaResumeState(lessonProgress.progressJson);
  if (hasStoredResumeState && !storedResumeState) {
    return { success: false, error: "Stored resume state is invalid" };
  }
  const authoritativeConflictState = () => ({
    resumeRevision: lessonProgress.updatedAt.toISOString(),
    resumeState: storedResumeState
      ? withHrbaResumeRevision(storedResumeState, lessonProgress.updatedAt.toISOString())
      : null,
  });
  const rejectResume = (error: string) => ({
    success: false as const,
    error,
    ...authoritativeConflictState(),
  });
  if (!validateHrbaProgressSummary(completedModuleIds, currentModuleId, currentScreenId)) {
    return {
      success: false,
      error: "Invalid HRBA progress summary",
      ...authoritativeConflictState(),
    };
  }

  let acceptedResumeState: HrbaResumeState | null = null;
  if (resumeState !== undefined) {
    const validatedResume = validateHrbaResumeState(resumeState);
    if (!validatedResume.success) {
      return {
        success: false,
        error: validatedResume.error,
        ...authoritativeConflictState(),
      };
    }
    acceptedResumeState = validatedResume.state;
    if (baseRevision !== acceptedResumeState.baseRevision
      || baseRevision !== lessonProgress.updatedAt.toISOString()) {
      return {
        success: false,
        conflict: true,
        error: "Resume state conflict",
        resumeRevision: lessonProgress.updatedAt.toISOString(),
        resumeState: storedResumeState
          ? withHrbaResumeRevision(storedResumeState, lessonProgress.updatedAt.toISOString())
          : null,
      };
    }
    if (legacyBootstrap && storedResumeState) {
      return {
        success: false,
        conflict: true,
        error: "Legacy bootstrap is closed",
        resumeRevision: lessonProgress.updatedAt.toISOString(),
        resumeState: withHrbaResumeRevision(storedResumeState, lessonProgress.updatedAt.toISOString()),
      };
    }
    if (storedResumeState) {
      const previousModules = storedResumeState.completedModuleIds;
      const nextModules = acceptedResumeState.completedModuleIds;
      if (previousModules.some((moduleId) => !nextModules.includes(moduleId))) {
        return rejectResume("Completed modules cannot regress");
      }
      if (nextModules.length > previousModules.length + 1) {
        return rejectResume("Completed modules cannot skip prerequisites");
      }
    }
    const summaryModules = completedModuleIds.filter((moduleId) => moduleId !== "final_assessment");
    if (JSON.stringify(summaryModules) !== JSON.stringify(acceptedResumeState.completedModuleIds)
      || acceptedResumeState.navigation.currentModuleId !== currentModuleId
      || acceptedResumeState.navigation.currentScreenId !== currentScreenId) {
      return rejectResume("Resume state does not match progress summary");
    }
  } else if (legacyBootstrap) {
    return rejectResume("Legacy bootstrap requires resume state");
  }

  const authoritativeCompletedModuleIds = acceptedResumeState?.completedModuleIds
    ?? storedResumeState?.completedModuleIds
    ?? completedModuleIds.filter((moduleId) => moduleId !== "final_assessment");
  const authoritativeCurrentModuleId = acceptedResumeState
    ? acceptedResumeState.navigation.currentModuleId
    : storedResumeState
      ? storedResumeState.navigation.currentModuleId
      : currentModuleId;
  const authoritativeCurrentScreenId = acceptedResumeState
    ? acceptedResumeState.navigation.currentScreenId
    : storedResumeState
      ? storedResumeState.navigation.currentScreenId
      : currentScreenId;

  const validContextFrom = Math.max(
    enrollment.enrolledAt.getTime(),
    enrollment.externalStateKeyIssuedAt.getTime(),
  );

  if (
    callbackSentAt.getTime() <
    validContextFrom - externalCourseContextClockToleranceMs
  ) {
    return { success: false, error: "Stale callback evidence" };
  }

  const alreadyCompleted = enrollment.status === EnrollmentStatus.COMPLETED;
  const normalizedAssessment = normalizeAssessmentResult(assessment);
  let externalQuiz:
    | Awaited<ReturnType<typeof getExternalCompletionQuiz>>
    | null = null;
  let assessmentPassed = false;
  let evidenceContext: ExternalAssessmentEvidenceContext | null = null;
  const learnerStateKeyHash = hashExternalCourseLaunchToken(learnerStateKey);

  if (assessment && !normalizedAssessment) {
    return { success: false, error: "Invalid assessment result" };
  }

  if (normalizedAssessment) {
    if (
      normalizedAssessment.submittedAt.getTime() >
        serverNow.getTime() + externalCourseFutureClockToleranceMs ||
      normalizedAssessment.submittedAt.getTime() <
        validContextFrom - externalCourseContextClockToleranceMs
    ) {
      return { success: false, error: "Stale assessment evidence" };
    }

    externalQuiz = await getExternalCompletionQuiz();

    if (!externalQuiz) {
      return { success: false, error: "Completion quiz is not configured" };
    }

    const passThreshold =
      externalQuiz.quiz.passThreshold ?? course.defaultPassThreshold ?? 80;
    assessmentPassed =
      normalizedAssessment.passed &&
      normalizedAssessment.percentage >= passThreshold;

    evidenceContext = {
      assessment: normalizedAssessment,
      assessmentPassed,
      completedModuleIds,
      courseId: course.id,
      courseVersionId: version.id,
      currentModuleId: authoritativeCurrentModuleId,
      currentScreenId: authoritativeCurrentScreenId,
      iframeOrigin,
      learnerStateKeyHash,
      maxScore: normalizedAssessment.maxScore,
      percentage: normalizedAssessment.percentage,
      questionId: externalQuiz.question.id,
      quizId: externalQuiz.quiz.id,
      score: normalizedAssessment.score,
      userId: user.id,
    };

    const evidenceAttempt = await prisma.quizAttempt.findUnique({
      where: { externalEvidenceId: normalizedAssessment.evidenceId },
    });

    if (evidenceAttempt && !externalAttemptMatches(evidenceAttempt, evidenceContext)) {
      return { success: false, error: "Assessment evidence context mismatch" };
    }
  }

  if (completed && course.finalTestRequired && !normalizedAssessment) {
    return { success: false, error: "Assessment evidence is required for completion" };
  }

  const allRequiredModulesComplete = authoritativeCompletedModuleIds.length === 5;
  if (normalizedAssessment && !allRequiredModulesComplete) {
    return { success: false, error: "Course prerequisites are incomplete" };
  }

  const shouldComplete =
    alreadyCompleted ||
    (
      completed &&
      allRequiredModulesComplete &&
      (!course.finalTestRequired || assessmentPassed)
    );
  const effectiveProgress = deriveHrbaProgressPercent(
    authoritativeCompletedModuleIds,
    shouldComplete,
  );

  const persistCompletion = () =>
    prisma.$transaction(async (tx) => {
      const persistedAt = new Date();
      let assessmentAttempt = null;
      let certificateCode: string | null = null;
      let certificateStatus:
        | "not-completed"
        | "assessment-missing"
        | "assessment-failed"
        | "issued"
        | "already-issued" = shouldComplete
          ? "assessment-missing"
          : "not-completed";

      await tx.externalCourseLaunchToken.update({
        data: { lastUsedAt: persistedAt },
        where: { id: tokenRecord.id },
      });

      if (evidenceContext) {
        assessmentAttempt = await upsertExternalAssessmentAttempt(
          tx,
          evidenceContext,
        );

        if (!assessmentPassed) {
          certificateStatus = "assessment-failed";
        }
      }

      await tx.enrollment.update({
        data: {
          completedAt: shouldComplete
            ? (enrollment.completedAt ?? persistedAt)
            : null,
          lastAccessedAt: persistedAt,
          progressPercent: effectiveProgress,
          status: shouldComplete
            ? EnrollmentStatus.COMPLETED
            : EnrollmentStatus.IN_PROGRESS,
        },
        where: { id: enrollment.id },
      });

      const resumeRevision = persistedAt.toISOString();
      const persistedResumeState = acceptedResumeState
        ? withHrbaResumeRevision(acceptedResumeState, resumeRevision)
        : storedResumeState;
      const nextProgressJson = toJson({
        ...progressRecord,
        completedModuleIds: authoritativeCompletedModuleIds,
        currentModuleId: authoritativeCurrentModuleId,
        currentScreenId: authoritativeCurrentScreenId,
        iframeOrigin,
        ...(persistedResumeState ? { resumeState: persistedResumeState } : {}),
        source: "external-course-postmessage",
      });
      const lessonUpdate = {
        completedAt: shouldComplete ? (lessonProgress.completedAt ?? persistedAt) : null,
        lastAccessedAt: persistedAt,
        progressJson: nextProgressJson,
        status: shouldComplete
          ? LessonProgressStatus.COMPLETED
          : LessonProgressStatus.IN_PROGRESS,
        updatedAt: persistedAt,
      };

      if (acceptedResumeState) {
        const conditionalUpdate = await tx.lessonProgress.updateMany({
          data: lessonUpdate,
          where: {
            id: lessonProgress.id,
            updatedAt: new Date(baseRevision as string),
          },
        });
        if (conditionalUpdate.count !== 1) {
          throw new ExternalCourseResumeConflictError("Resume state conflict");
        }
      } else {
        await tx.lessonProgress.update({
          data: lessonUpdate,
          where: { id: lessonProgress.id },
        });
      }

      if (shouldComplete) {
        const existingCertificate = await tx.certificate.findUnique({
          where: {
            userId_courseVersionId: {
              courseVersionId: version.id,
              userId: user.id,
            },
          },
        });

        if (
          existingCertificate &&
          (
            existingCertificate.userId !== user.id ||
            existingCertificate.courseId !== course.id ||
            existingCertificate.courseVersionId !== version.id ||
            existingCertificate.enrollmentId !== enrollment.id ||
            (
              assessmentAttempt &&
              existingCertificate.quizAttemptId !== assessmentAttempt.id
            )
          )
        ) {
          throw new ExternalCourseEvidenceConflictError(
            "Certificate enrollment context mismatch",
          );
        }

        if (existingCertificate) {
          certificateCode = existingCertificate.certificateCode;
          certificateStatus = "already-issued";
        } else if (!assessmentAttempt) {
          certificateStatus = "assessment-missing";
        } else if (assessmentPassed) {
          const certificate = await tx.certificate.upsert({
            create: {
              certificateCode: buildCertificateCode(version.id, user.id),
              completionDate: persistedAt,
              courseId: course.id,
              courseTitleSnapshot: course.title,
              courseVersionId: version.id,
              enrollmentId: enrollment.id,
              issuerNameSnapshot: issuerName,
              participantNameSnapshot: user.fullName || user.email,
              quizAttemptId: assessmentAttempt.id,
              status: CertificateStatus.ISSUED,
              userId: user.id,
            },
            update: {},
            where: {
              userId_courseVersionId: {
                courseVersionId: version.id,
                userId: user.id,
              },
            },
          });

          if (
            certificate.userId !== user.id ||
            certificate.courseId !== course.id ||
            certificate.courseVersionId !== version.id ||
            certificate.enrollmentId !== enrollment.id ||
            certificate.quizAttemptId !== assessmentAttempt.id
          ) {
            throw new ExternalCourseEvidenceConflictError(
              "Certificate enrollment context mismatch",
            );
          }

          certificateCode = certificate.certificateCode;
          certificateStatus = "issued";
        }
      }

      return {
        certificateCode,
        certificateStatus,
        resumeRevision,
        resumeState: persistedResumeState
          ? withHrbaResumeRevision(persistedResumeState, resumeRevision)
          : null,
      };
    });

  let persistenceResult:
    | Awaited<ReturnType<typeof persistCompletion>>
    | null = null;

  for (let attemptIndex = 0; attemptIndex < 2; attemptIndex += 1) {
    try {
      persistenceResult = await persistCompletion();
      break;
    } catch (error) {
      if (error instanceof ExternalCourseResumeConflictError) {
        const authoritative = await prisma.lessonProgress.findUnique({
          where: { id: lessonProgress.id },
        });
        const authoritativeState = authoritative
          ? extractStoredHrbaResumeState(authoritative.progressJson)
          : null;
        return {
          success: false,
          conflict: true,
          error: error.message,
          resumeRevision: authoritative?.updatedAt.toISOString() ?? lessonProgress.updatedAt.toISOString(),
          resumeState: authoritativeState && authoritative
            ? withHrbaResumeRevision(authoritativeState, authoritative.updatedAt.toISOString())
            : null,
        };
      }
      if (error instanceof ExternalCourseEvidenceConflictError) {
        return { success: false, error: error.message };
      }

      if (isUniqueConstraintError(error)) {
        if (attemptIndex === 0) {
          continue;
        }

        return { success: false, error: "Conflicting completion evidence" };
      }

      throw error;
    }
  }

  if (!persistenceResult) {
    return { success: false, error: "Completion persistence failed" };
  }

  try {
    revalidatePath(`/learn/courses/${course.slug}`);
    revalidatePath(`/learn/courses/${course.slug}/external`);
    revalidatePath("/learn");
    revalidatePath("/learn/my-courses");
    revalidatePath("/learn/certificates");
    revalidatePath("/admin/certificates");
    revalidatePath("/admin/monitoring");
  } catch {
    // Cache revalidation is unavailable in some script/test contexts.
  }

  return {
    success: true,
    certificateCode: persistenceResult.certificateCode,
    certificateStatus: persistenceResult.certificateStatus,
    completed: shouldComplete,
    progressPercent: effectiveProgress,
    resumeRevision: persistenceResult.resumeRevision,
    resumeState: persistenceResult.resumeState,
  };
}
