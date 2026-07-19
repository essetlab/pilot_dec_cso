import { revalidatePath } from "next/cache";
import { createHash, randomBytes } from "node:crypto";
import {
  ContentBlockType,
  CourseLevel,
  CourseStatus,
  CourseVisibility,
  EnrollmentStatus,
  LessonProgressStatus,
  OrganizationStatus,
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
import type { AuthSession } from "./auth/session-codec";
import { prisma } from "./prisma";

const issuerName = "DEC / WHH CSF+ CSO Learning Hub";
const externalCourseLaunchTokenTtlMs = 8 * 60 * 60 * 1000;

function toJson(value: unknown): Prisma.InputJsonValue {
  return JSON.parse(JSON.stringify(value ?? {})) as Prisma.InputJsonValue;
}

function createExternalCourseLaunchToken() {
  return randomBytes(32).toString("base64url");
}

function hashExternalCourseLaunchToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
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

  const submittedAt = assessment.submittedAt ? new Date(assessment.submittedAt) : new Date();

  if (Number.isNaN(submittedAt.getTime())) {
    return null;
  }

  return {
    attemptNumber: assessment.attemptNumber,
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

function getAttemptAssessmentMetadata(answersJson: Prisma.JsonValue | null) {
  if (!answersJson || typeof answersJson !== "object" || Array.isArray(answersJson)) {
    return null;
  }

  const assessment = answersJson.assessment;

  if (!assessment || typeof assessment !== "object" || Array.isArray(assessment)) {
    return null;
  }

  return assessment as Record<string, unknown>;
}

function externalAttemptMatches(
  attempt: { answersJson: Prisma.JsonValue | null },
  assessment: NormalizedExternalAssessment,
) {
  const existingAssessment = getAttemptAssessmentMetadata(attempt.answersJson);

  return (
    existingAssessment?.attemptNumber === assessment.attemptNumber &&
    existingAssessment?.submittedAt === assessment.submittedAt.toISOString()
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

async function recordExternalAssessmentAttempt({
  assessment,
  assessmentPassed,
  completedModuleIds,
  courseId,
  courseVersionId,
  currentModuleId,
  currentScreenId,
  iframeOrigin,
  maxScore,
  percentage,
  questionId,
  quizId,
  score,
  userId,
}: {
  assessment: NormalizedExternalAssessment;
  assessmentPassed: boolean;
  completedModuleIds: string[];
  courseId: string;
  courseVersionId: string;
  currentModuleId: string | null;
  currentScreenId: string | null;
  iframeOrigin: string;
  maxScore: number;
  percentage: number;
  questionId: string;
  quizId: string;
  score: number;
  userId: string;
}) {
  const candidateAttempts = await prisma.quizAttempt.findMany({
    orderBy: { createdAt: "desc" },
    take: 25,
    where: {
      courseVersionId,
      quizId,
      userId,
    },
  });
  const duplicateAttempt = candidateAttempts.find((attempt) =>
    externalAttemptMatches(attempt, assessment),
  );

  if (duplicateAttempt) {
    return duplicateAttempt;
  }

  return prisma.quizAttempt.create({
    data: {
      answersJson: toJson({
        [questionId]: assessmentPassed ? "completed" : "not completed",
        assessment: {
          attemptNumber: assessment.attemptNumber,
          maxScore,
          passed: assessment.passed,
          percentage,
          score,
          submittedAt: assessment.submittedAt.toISOString(),
        },
        completedModuleIds,
        currentModuleId,
        currentScreenId,
        iframeOrigin,
        source: "external-course-postmessage",
      }),
      courseId,
      courseVersionId,
      maxScore,
      passed: assessmentPassed,
      percentage,
      quizId,
      score,
      status: assessmentPassed
        ? QuizAttemptStatus.PASSED
        : QuizAttemptStatus.FAILED,
      submittedAt: assessment.submittedAt,
      userId,
    },
  });
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

async function ensureHrbaCapacityArea() {
  return prisma.capacityArea.upsert({
    create: {
      id: "CAP-HRBA",
      name: "Human Rights-Based Approach",
      slug: "human-rights-based-approach",
      description:
        "Practical HRBA learning for local CSOs, including participation, inclusion, accountability, dignity, safe evidence use, and project-cycle decisions.",
      isActive: true,
      sortOrder: 20,
    },
    update: {
      description:
        "Practical HRBA learning for local CSOs, including participation, inclusion, accountability, dignity, safe evidence use, and project-cycle decisions.",
      isActive: true,
      sortOrder: 20,
    },
    where: { slug: "human-rights-based-approach" },
  });
}

export async function registerHrbaExternalCourse() {
  const owner = await ensureIntegrationOwner();
  const capacityArea = await ensureHrbaCapacityArea();
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
      visibility: CourseVisibility.PUBLIC,
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
      visibility: CourseVisibility.PUBLIC,
    },
    where: { slug: HRBA_EXTERNAL_COURSE_SLUG },
  });

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
  if (!session?.userId) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
  });
  const requiresActiveOrganization = session.roles.some(
    (role) => role === "PARTICIPANT" || role === "CSO_FOCAL_PERSON",
  );
  const organization = user?.organizationId
    ? await prisma.organization.findUnique({
        select: { status: true },
        where: { id: user.organizationId },
      })
    : null;

  if (
    !user ||
    user.status !== UserStatus.ACTIVE ||
    (requiresActiveOrganization && organization?.status !== OrganizationStatus.ACTIVE)
  ) {
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

  if (course.visibility === CourseVisibility.ASSIGNED_ONLY) {
    const assignment = await prisma.courseAssignment.findFirst({
      where: {
        courseId: course.id,
        isActive: true,
        OR: [
          { targetUserId: user.id },
          ...(user.primaryCohortId ? [{ targetCohortId: user.primaryCohortId }] : []),
          ...(user.organizationId ? [{ targetOrganizationId: user.organizationId }] : []),
        ],
      },
    });

    if (!assignment) {
      return null;
    }
  }

  const enrollment = await prisma.enrollment.upsert({
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

  await prisma.lessonProgress.upsert({
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
      portalOrigin: getPortalOrigin(),
      tokenHash: hashExternalCourseLaunchToken(launchToken),
      userId: user.id,
    },
  });

  iframeUrl.searchParams.set("embed", "portal");
  iframeUrl.searchParams.set("portalOrigin", getPortalOrigin());
  iframeUrl.searchParams.set("courseSlug", course.slug);
  iframeUrl.searchParams.set("launchToken", launchToken);

  return {
    allowedOrigin,
    courseSlug: course.slug,
    courseTitle: course.title,
    iframeSrc: iframeUrl.toString(),
    launchToken,
  };
}

export async function recordExternalCourseProgress({
  assessment,
  completed,
  completedModuleIds,
  courseSlug,
  currentModuleId,
  currentScreenId,
  iframeOrigin,
  launchToken,
  progressPercent,
  session,
}: {
  assessment?: ExternalCourseAssessmentResult;
  completed: boolean;
  completedModuleIds: string[];
  courseSlug: string;
  currentModuleId: string | null;
  currentScreenId: string | null;
  iframeOrigin: string;
  launchToken: string;
  progressPercent: number;
  session: AuthSession | null;
}) {
  if (!session?.userId) {
    return { success: false, error: "Unauthorized" };
  }

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
  });
  const requiresActiveOrganization = session.roles.some(
    (role) => role === "PARTICIPANT" || role === "CSO_FOCAL_PERSON",
  );
  const organization = user?.organizationId
    ? await prisma.organization.findUnique({
        select: { status: true },
        where: { id: user.organizationId },
      })
    : null;

  if (
    !user ||
    user.status !== UserStatus.ACTIVE ||
    (requiresActiveOrganization && organization?.status !== OrganizationStatus.ACTIVE)
  ) {
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

  if (!metadata.allowedOrigins.includes(iframeOrigin)) {
    return { success: false, error: "Invalid course origin" };
  }

  const boundedProgress = Math.max(0, Math.min(100, Math.round(progressPercent)));
  const enrollment = await prisma.enrollment.findUnique({
    where: { id: tokenRecord.enrollmentId },
  });

  if (
    !enrollment ||
    enrollment.userId !== user.id ||
    enrollment.courseId !== course.id ||
    enrollment.courseVersionId !== version.id
  ) {
    return { success: false, error: "Enrollment not found" };
  }

  await prisma.externalCourseLaunchToken.update({
    data: { lastUsedAt: new Date() },
    where: { id: tokenRecord.id },
  });

  const alreadyCompleted = enrollment.status === EnrollmentStatus.COMPLETED;
  const shouldComplete = completed || alreadyCompleted;
  const normalizedAssessment = normalizeAssessmentResult(assessment);
  let externalQuiz:
    | Awaited<ReturnType<typeof getExternalCompletionQuiz>>
    | null = null;
  let assessmentPassed = false;

  if (assessment && !normalizedAssessment) {
    return { success: false, error: "Invalid assessment result" };
  }

  if (normalizedAssessment) {
    externalQuiz = await getExternalCompletionQuiz();

    if (!externalQuiz) {
      return { success: false, error: "Completion quiz is not configured" };
    }

    const passThreshold =
      externalQuiz.quiz.passThreshold ?? course.defaultPassThreshold ?? 80;
    assessmentPassed =
      normalizedAssessment.passed &&
      normalizedAssessment.percentage >= passThreshold;
  }

  await prisma.$transaction(async (tx) => {
    await tx.enrollment.update({
      data: {
        completedAt: shouldComplete ? (enrollment.completedAt ?? new Date()) : null,
        lastAccessedAt: new Date(),
        progressPercent: shouldComplete ? 100 : boundedProgress,
        status: shouldComplete ? EnrollmentStatus.COMPLETED : EnrollmentStatus.IN_PROGRESS,
      },
      where: { id: enrollment.id },
    });

    await tx.lessonProgress.upsert({
      create: {
        completedAt: shouldComplete ? new Date() : null,
        enrollmentId: enrollment.id,
        lastAccessedAt: new Date(),
        lessonId: HRBA_EXTERNAL_COURSE_LESSON_ID,
        progressJson: toJson({
          completedModuleIds,
          currentModuleId,
          currentScreenId,
          iframeOrigin,
          source: "external-course-postmessage",
        }),
        startedAt: new Date(),
        status: shouldComplete
          ? LessonProgressStatus.COMPLETED
          : LessonProgressStatus.IN_PROGRESS,
      },
      update: {
        completedAt: shouldComplete ? (enrollment.completedAt ?? new Date()) : null,
        lastAccessedAt: new Date(),
        progressJson: toJson({
          completedModuleIds,
          currentModuleId,
          currentScreenId,
          iframeOrigin,
          source: "external-course-postmessage",
        }),
        status: shouldComplete
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
  });

  let certificateCode: string | null = null;
  let certificateStatus:
    | "not-completed"
    | "assessment-missing"
    | "assessment-failed"
    | "issued"
    | "already-issued" = shouldComplete ? "assessment-missing" : "not-completed";
  let assessmentAttempt:
    | Awaited<ReturnType<typeof recordExternalAssessmentAttempt>>
    | null = null;

  if (normalizedAssessment && externalQuiz) {
    assessmentAttempt = await recordExternalAssessmentAttempt({
      assessment: normalizedAssessment,
      assessmentPassed,
      completedModuleIds,
      courseId: course.id,
      courseVersionId: version.id,
      currentModuleId,
      currentScreenId,
      iframeOrigin,
      maxScore: normalizedAssessment.maxScore,
      percentage: normalizedAssessment.percentage,
      questionId: externalQuiz.question.id,
      quizId: externalQuiz.quiz.id,
      score: normalizedAssessment.score,
      userId: user.id,
    });

    if (!assessmentPassed) {
      certificateStatus = "assessment-failed";
    }
  }

  if (shouldComplete) {
    const existingCertificate = await prisma.certificate.findUnique({
      where: {
        userId_courseVersionId: {
          courseVersionId: version.id,
          userId: user.id,
        },
      },
    });

    if (existingCertificate) {
      certificateCode = existingCertificate.certificateCode;
      certificateStatus = "already-issued";
    } else if (!assessment) {
      certificateStatus = "assessment-missing";
    } else if (assessmentPassed && assessmentAttempt) {
      const certificate = await prisma.certificate.create({
        data: {
          certificateCode: buildCertificateCode(version.id, user.id),
          completionDate: new Date(),
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
      });

      certificateCode = certificate.certificateCode;
      certificateStatus = "issued";
    }
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
    certificateCode,
    certificateStatus,
    completed: shouldComplete,
    progressPercent: shouldComplete ? 100 : boundedProgress,
  };
}
