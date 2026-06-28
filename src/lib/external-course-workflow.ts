import { revalidatePath } from "next/cache";
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
import type { ExternalCourseLaunchData } from "./external-course-types";
import type { AuthSession } from "./auth/session-codec";
import { prisma } from "./prisma";

const issuerName = "DEC / WHH CSF+ CSO Learning Hub";

function toJson(value: unknown): Prisma.InputJsonValue {
  return JSON.parse(JSON.stringify(value ?? {})) as Prisma.InputJsonValue;
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
        "Practical HRBA learning for local CSOs, including participation, accountability, inclusion, implementation, and MEAL.",
      isActive: true,
      sortOrder: 20,
    },
    update: {
      description:
        "Practical HRBA learning for local CSOs, including participation, accountability, inclusion, implementation, and MEAL.",
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
        "This interactive HRBA course is delivered through a dedicated course app embedded in the CSO Learning Hub. Participants move through five practical modules covering HRBA foundations, everyday CSO practice, project design, implementation, and MEAL. The portal keeps enrollment, completion, and certificate records while the embedded course provides the interactive learning experience.",
      shortDescription:
        "A five-module interactive course on applying a human rights-based approach in local CSO practice.",
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
        "This interactive HRBA course is delivered through a dedicated course app embedded in the CSO Learning Hub. Participants move through five practical modules covering HRBA foundations, everyday CSO practice, project design, implementation, and MEAL. The portal keeps enrollment, completion, and certificate records while the embedded course provides the interactive learning experience.",
      shortDescription:
        "A five-module interactive course on applying a human rights-based approach in local CSO practice.",
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
    "Explain HRBA concepts in plain language for everyday CSO work.",
    "Identify rights-holders, duty-bearers, supporting actors, power dynamics, and participation risks.",
    "Apply HRBA thinking to project design, implementation, and adaptation decisions.",
    "Use safe evidence, feedback, indicators, and reporting practices in HRBA-informed MEAL.",
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
  if (!session?.email) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { email: session.email },
  });
  if (!user) {
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

  iframeUrl.searchParams.set("embed", "portal");
  iframeUrl.searchParams.set("portalOrigin", getPortalOrigin());
  iframeUrl.searchParams.set("courseSlug", course.slug);
  iframeUrl.searchParams.set("userId", user.id);
  iframeUrl.searchParams.set("enrollmentId", enrollment.id);
  iframeUrl.searchParams.set("courseVersionId", version.id);

  return {
    allowedOrigin,
    courseSlug: course.slug,
    courseTitle: course.title,
    courseVersionId: version.id,
    enrollmentId: enrollment.id,
    iframeSrc: iframeUrl.toString(),
    userId: user.id,
  };
}

export async function recordExternalCourseProgress({
  completed,
  completedModuleIds,
  courseSlug,
  courseVersionId,
  currentModuleId,
  currentScreenId,
  enrollmentId,
  iframeOrigin,
  progressPercent,
  session,
  userId,
}: {
  completed: boolean;
  completedModuleIds: string[];
  courseSlug: string;
  courseVersionId: string;
  currentModuleId: string | null;
  currentScreenId: string | null;
  enrollmentId: string;
  iframeOrigin: string;
  progressPercent: number;
  session: AuthSession | null;
  userId: string;
}) {
  if (!session?.email || session.userId !== userId) {
    return { success: false, error: "Unauthorized" };
  }

  const user = await prisma.user.findUnique({
    where: { email: session.email },
  });
  if (!user || user.id !== userId) {
    return { success: false, error: "Unauthorized" };
  }

  const course = await prisma.course.findUnique({
    include: {
      versions: {
        where: { id: courseVersionId, status: CourseStatus.PUBLISHED },
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
    where: {
      userId_courseVersionId: {
        courseVersionId: version.id,
        userId: user.id,
      },
    },
  });

  if (!enrollment || enrollment.id !== enrollmentId) {
    return { success: false, error: "Enrollment not found" };
  }

  const alreadyCompleted = enrollment.status === EnrollmentStatus.COMPLETED;
  const shouldComplete = completed || alreadyCompleted;

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

  if (shouldComplete) {
    const quiz = await prisma.quiz.findUnique({
      include: { questions: true },
      where: { id: HRBA_EXTERNAL_COURSE_QUIZ_ID },
    });
    const question = quiz?.questions[0];

    if (!quiz || !question) {
      return { success: false, error: "Completion quiz is not configured" };
    }

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
    } else {
      const attempt = await prisma.quizAttempt.create({
        data: {
          answersJson: toJson({
            [question.id]: "completed",
            completedModuleIds,
            currentModuleId,
            currentScreenId,
            iframeOrigin,
            source: "external-course-postmessage",
          }),
          courseId: course.id,
          courseVersionId: version.id,
          maxScore: 1,
          passed: true,
          percentage: 100,
          quizId: quiz.id,
          score: 1,
          status: QuizAttemptStatus.PASSED,
          submittedAt: new Date(),
          userId: user.id,
        },
      });

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
          quizAttemptId: attempt.id,
          status: CertificateStatus.ISSUED,
          userId: user.id,
        },
      });

      certificateCode = certificate.certificateCode;
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
    completed: shouldComplete,
    progressPercent: shouldComplete ? 100 : boundedProgress,
  };
}
