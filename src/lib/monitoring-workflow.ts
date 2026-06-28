import {
  CertificateStatus,
  CourseStatus,
  EnrollmentStatus,
  QuizAttemptStatus,
  UserStatus,
} from "../generated/prisma/enums";
import { canAccessMonitoring } from "./auth/permissions";
import type { AuthSession } from "./auth/session-codec";
import { prisma } from "./prisma";

type BadgeTone = "blue" | "green" | "gray" | "orange" | "red" | "purple" | "gold";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export type MonitoringKpiCard = {
  helperText: string;
  label: string;
  tone: "blue" | "green" | "orange" | "gray";
  value: string;
};

export type MonitoringCoursePerformance = {
  courseId: string;
  averageRating: string;
  certificates: string;
  completion: string;
  completionNumeric: number;
  course: string;
  enrollments: string;
  passRate: string;
  passRateNumeric: number;
  status: string;
  statusTone: BadgeTone;
};

export type MonitoringCohortProgress = {
  assignedCourses: number;
  averageRating: string;
  certificates: number;
  cohortId: string;
  cohortName: string;
  completed: number;
  completionNumeric: number;
  completionRate: string;
  enrollments: number;
  organizations: number;
  participants: number;
};

export type MonitoringOrganizationProgress = {
  activeParticipants: number;
  certificates: number;
  completed: number;
  completionNumeric: number;
  completionRate: string;
  enrollments: number;
  organizationId: string;
  organizationName: string;
  participants: number;
};

export type MonitoringAttentionSignal = {
  detail: string;
  label: string;
  tone: "orange" | "red" | "gold";
  type: "low-completion" | "low-pass-rate" | "low-feedback" | "low-activity";
};

export type MonitoringFilterOptions = {
  cohorts: MonitoringFilterOption[];
  courses: MonitoringFilterOption[];
  dateRanges: MonitoringFilterOption[];
  organizations: MonitoringFilterOption[];
};

export type MonitoringFilterOption = {
  id: string;
  label: string;
};

export type MonitoringFilters = {
  cohortId?: string;
  courseId?: string;
  dateRange?: "30d" | "quarter" | "year" | "all";
  organizationId?: string;
};

export type MonitoringTestSummary = {
  averagePassScore: string;
  certificatesIssued: number;
  failedAttempts: number;
  learnersNearingCompletion: number;
  passRate: string;
  passRateNumeric: number;
  passedAttempts: number;
  totalAttempts: number;
};

export type MonitoringData = {
  attentionSignals: MonitoringAttentionSignal[];
  cohortProgress: MonitoringCohortProgress[];
  coursePerformance: MonitoringCoursePerformance[];
  filterOptions: MonitoringFilterOptions;
  filters: Required<MonitoringFilters>;
  hasActiveFilters: boolean;
  kpiCards: MonitoringKpiCard[];
  organizationProgress: MonitoringOrganizationProgress[];
  testSummary: MonitoringTestSummary;
};

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function percentage(numerator: number, denominator: number) {
  if (denominator === 0) {
    return "N/A";
  }

  return `${Math.round((numerator / denominator) * 100)}%`;
}

function numericPercent(numerator: number, denominator: number) {
  if (denominator === 0) {
    return 0;
  }

  return Math.round((numerator / denominator) * 100);
}

function completionStatus(completionRate: number, passRate: number | null): {
  status: string;
  statusTone: BadgeTone;
} {
  if (completionRate >= 70 && (passRate === null || passRate >= 80)) {
    return { status: "Strong progress", statusTone: "green" };
  }

  if (completionRate >= 35 || (passRate !== null && passRate >= 70)) {
    return { status: "On track", statusTone: "blue" };
  }

  return { status: "Needs support", statusTone: "gold" };
}

const dateRangeOptions: MonitoringFilterOption[] = [
  { id: "all", label: "All time" },
  { id: "30d", label: "Last 30 days" },
  { id: "quarter", label: "This quarter" },
  { id: "year", label: "This year" },
];

function normalizeDateRange(value: MonitoringFilters["dateRange"]) {
  return value && ["30d", "quarter", "year", "all"].includes(value) ? value : "all";
}

function rangeStart(value: Required<MonitoringFilters>["dateRange"]) {
  const now = new Date();
  if (value === "all") {
    return null;
  }

  if (value === "year") {
    return new Date(Date.UTC(now.getUTCFullYear(), 0, 1));
  }

  if (value === "quarter") {
    const quarterStartMonth = Math.floor(now.getUTCMonth() / 3) * 3;
    return new Date(Date.UTC(now.getUTCFullYear(), quarterStartMonth, 1));
  }

  const start = new Date(now);
  start.setUTCDate(start.getUTCDate() - 30);
  return start;
}

function averageRating(values: Array<number | null>) {
  const numeric = values.filter((v): v is number => typeof v === "number");
  if (numeric.length === 0) {
    return "N/A";
  }

  return (numeric.reduce((sum, v) => sum + v, 0) / numeric.length).toFixed(1);
}

/* ------------------------------------------------------------------ */
/*  Empty state                                                        */
/* ------------------------------------------------------------------ */

const emptyTestSummary: MonitoringTestSummary = {
  averagePassScore: "N/A",
  certificatesIssued: 0,
  failedAttempts: 0,
  learnersNearingCompletion: 0,
  passRate: "N/A",
  passRateNumeric: 0,
  passedAttempts: 0,
  totalAttempts: 0,
};

const emptyMonitoringData: MonitoringData = {
  attentionSignals: [],
  cohortProgress: [],
  coursePerformance: [],
  filterOptions: {
    cohorts: [],
    courses: [],
    dateRanges: [],
    organizations: [],
  },
  filters: {
    cohortId: "",
    courseId: "",
    dateRange: "all",
    organizationId: "",
  },
  hasActiveFilters: false,
  kpiCards: [
    { helperText: "Users with Participant role", label: "Registered participants", tone: "blue", value: "0" },
    { helperText: "Participants with recent activity", label: "Active participants", tone: "blue", value: "0" },
    { helperText: "Active organizations", label: "CSO organizations", tone: "blue", value: "0" },
    { helperText: "Active cohorts", label: "Cohorts", tone: "blue", value: "0" },
    { helperText: "Courses available to participants", label: "Published courses", tone: "green", value: "0" },
    { helperText: "Active course registrations", label: "Enrollments", tone: "blue", value: "0" },
    { helperText: "Completed ÷ total enrollments", label: "Completion rate", tone: "green", value: "N/A" },
    { helperText: "Passed ÷ submitted test attempts", label: "Final test pass rate", tone: "green", value: "N/A" },
    { helperText: "Certificates recorded", label: "Certificates issued", tone: "orange", value: "0" },
    { helperText: "Average participant course rating", label: "Average course rating", tone: "gray", value: "N/A" },
  ],
  organizationProgress: [],
  testSummary: emptyTestSummary,
};

/* ------------------------------------------------------------------ */
/*  Main data function                                                 */
/* ------------------------------------------------------------------ */

export async function getMonitoringData(
  session: AuthSession | null,
  filters: MonitoringFilters = {},
): Promise<MonitoringData> {
  if (!canAccessMonitoring(session)) {
    return emptyMonitoringData;
  }

  const selectedFilters: Required<MonitoringFilters> = {
    cohortId: filters.cohortId ?? "",
    courseId: filters.courseId ?? "",
    dateRange: normalizeDateRange(filters.dateRange),
    organizationId: filters.organizationId ?? "",
  };
  const hasActiveFilters = !!(selectedFilters.cohortId || selectedFilters.courseId || selectedFilters.organizationId || selectedFilters.dateRange !== "all");
  const startedAt = rangeStart(selectedFilters.dateRange);

  /* ---------- Base reference data ---------- */

  const [
    filterUsers,
    courses,
    cohorts,
    organizations,
    registeredParticipantCount,
    publishedCourseCount,
    organizationCount,
    cohortCount,
  ] = await Promise.all([
    selectedFilters.organizationId || selectedFilters.cohortId
      ? prisma.user.findMany({
          select: { id: true },
          where: {
            ...(selectedFilters.organizationId
              ? { organizationId: selectedFilters.organizationId }
              : {}),
            ...(selectedFilters.cohortId
              ? { primaryCohortId: selectedFilters.cohortId }
              : {}),
          },
        })
      : Promise.resolve([]),
    prisma.course.findMany({
      orderBy: { title: "asc" },
      select: {
        defaultPassThreshold: true,
        id: true,
        title: true,
        status: true,
      },
      where: { archivedAt: null },
    }),
    prisma.cohort.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
    prisma.organization.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
    prisma.user.count({
      where: {
        roleAssignments: { some: { role: { key: "PARTICIPANT" } } },
        status: { in: [UserStatus.ACTIVE, UserStatus.INVITED] },
      },
    }),
    prisma.course.count({
      where: { status: CourseStatus.PUBLISHED, archivedAt: null },
    }),
    prisma.organization.count(),
    prisma.cohort.count(),
  ]);

  /* ---------- Scoped filters ---------- */

  const scopedUserIds =
    selectedFilters.organizationId || selectedFilters.cohortId
      ? new Set(filterUsers.map((user) => user.id))
      : null;
  const scopedCourseIds = selectedFilters.courseId ? new Set([selectedFilters.courseId]) : null;
  const enrollmentWhereNoDate = {
    ...(scopedCourseIds ? { courseId: { in: Array.from(scopedCourseIds) } } : {}),
    ...(scopedUserIds ? { userId: { in: Array.from(scopedUserIds) } } : {}),
  };
  const attemptWhere = {
    quiz: {
      isFinalTest: true,
    },
    status: {
      in: [
        QuizAttemptStatus.SUBMITTED,
        QuizAttemptStatus.PASSED,
        QuizAttemptStatus.FAILED,
      ],
    },
    ...(scopedCourseIds ? { courseId: { in: Array.from(scopedCourseIds) } } : {}),
    ...(scopedUserIds ? { userId: { in: Array.from(scopedUserIds) } } : {}),
    ...(startedAt ? { submittedAt: { gte: startedAt } } : {}),
  };
  const certificateWhere = {
    status: CertificateStatus.ISSUED,
    ...(scopedCourseIds ? { courseId: { in: Array.from(scopedCourseIds) } } : {}),
    ...(scopedUserIds ? { userId: { in: Array.from(scopedUserIds) } } : {}),
    ...(startedAt ? { issuedAt: { gte: startedAt } } : {}),
  };

  /* ---------- Core monitoring aggregation ---------- */

  const [allEnrollments, quizAttempts, certificates, activeParticipantCount, feedbackRecords] =
    await Promise.all([
      prisma.enrollment.findMany({
        select: {
          course: { select: { id: true, title: true } },
          courseId: true,
          progressPercent: true,
          status: true,
          userId: true,
          enrolledAt: true,
          startedAt: true,
          lastAccessedAt: true,
        },
        where: enrollmentWhereNoDate,
      }),
      prisma.quizAttempt.findMany({
        select: {
          courseId: true,
          passed: true,
          score: true,
          status: true,
        },
        where: attemptWhere,
      }),
      prisma.certificate.findMany({
        select: {
          courseId: true,
          userId: true,
        },
        where: certificateWhere,
      }),
      prisma.user.count({
        where: {
          roleAssignments: { some: { role: { key: "PARTICIPANT" } } },
          status: { in: [UserStatus.ACTIVE, UserStatus.INVITED] },
          enrollments: {
            some: {
              ...(scopedCourseIds ? { courseId: { in: Array.from(scopedCourseIds) } } : {}),
              ...(scopedUserIds ? { userId: { in: Array.from(scopedUserIds) } } : {}),
              ...(startedAt
                ? {
                    OR: [
                      { startedAt: { gte: startedAt } },
                      { lastAccessedAt: { gte: startedAt } },
                    ],
                  }
                : {
                    OR: [
                      { progressPercent: { gt: 0 } },
                      { startedAt: { not: null } },
                      { lastAccessedAt: { not: null } },
                    ],
                  }),
            },
          },
        },
      }),
      prisma.feedback.findMany({
        select: {
          courseId: true,
          rating: true,
          userId: true,
        },
        where: {
          courseId: { not: null },
          ...(scopedCourseIds ? { courseId: { in: Array.from(scopedCourseIds) } } : {}),
          ...(scopedUserIds ? { userId: { in: Array.from(scopedUserIds) } } : {}),
          ...(startedAt ? { createdAt: { gte: startedAt } } : {}),
        },
      }),
    ]);

  // Enrolled in range
  const enrollments = startedAt
    ? allEnrollments.filter((e) => new Date(e.enrolledAt) >= startedAt)
    : allEnrollments;

  // Active in range (started/accessed in range)
  const activeEnrollments = allEnrollments.filter((e) => {
    const hasStarted = e.progressPercent > 0 || e.startedAt !== null || e.lastAccessedAt !== null;
    if (!hasStarted) return false;
    if (startedAt) {
      const startMs = e.startedAt ? new Date(e.startedAt).getTime() : 0;
      const accessMs = e.lastAccessedAt ? new Date(e.lastAccessedAt).getTime() : 0;
      const limitMs = startedAt.getTime();
      return startMs >= limitMs || accessMs >= limitMs;
    }
    return true;
  });

  const certificateCount = certificates.length;

  /* ---------- Derived metrics ---------- */

  const completions = enrollments.filter(
    (enrollment) =>
      enrollment.status === EnrollmentStatus.COMPLETED ||
      enrollment.progressPercent >= 100,
  ).length;
  const passedAttempts = quizAttempts.filter(
    (attempt) => attempt.passed || attempt.status === QuizAttemptStatus.PASSED,
  ).length;
  const failedAttempts = quizAttempts.filter(
    (attempt) => !attempt.passed && attempt.status === QuizAttemptStatus.FAILED,
  ).length;
  const passRate = percentage(passedAttempts, quizAttempts.length);
  const passRateNumeric = numericPercent(passedAttempts, quizAttempts.length);
  const completionRate = percentage(completions, enrollments.length);
  const defaultPassThreshold =
    courses.length > 0
      ? Math.round(
          courses.reduce((total, course) => total + course.defaultPassThreshold, 0) /
            courses.length,
        )
      : null;
  const avgFeedbackRating = averageRating(feedbackRecords.map((f) => f.rating));
  const learnersNearingCompletion = enrollments.filter(
    (enrollment) =>
      enrollment.status !== EnrollmentStatus.COMPLETED &&
      enrollment.progressPercent >= 75,
  ).length;

  /* ---------- Course performance ---------- */

  const enrollmentsByCourse = new Map<string, typeof enrollments>();
  for (const enrollment of enrollments) {
    enrollmentsByCourse.set(enrollment.courseId, [
      ...(enrollmentsByCourse.get(enrollment.courseId) ?? []),
      enrollment,
    ]);
  }

  const attemptsByCourse = new Map<string, typeof quizAttempts>();
  for (const attempt of quizAttempts) {
    attemptsByCourse.set(attempt.courseId, [
      ...(attemptsByCourse.get(attempt.courseId) ?? []),
      attempt,
    ]);
  }

  const certificatesByCourse = new Map<string, number>();
  for (const cert of certificates) {
    certificatesByCourse.set(cert.courseId, (certificatesByCourse.get(cert.courseId) ?? 0) + 1);
  }

  const feedbackByCourse = new Map<string, number[]>();
  for (const fb of feedbackRecords) {
    if (fb.courseId && fb.rating !== null) {
      feedbackByCourse.set(fb.courseId, [
        ...(feedbackByCourse.get(fb.courseId) ?? []),
        fb.rating,
      ]);
    }
  }

  const visibleCourses = scopedCourseIds
    ? courses.filter((course) => scopedCourseIds.has(course.id))
    : courses;

  const coursePerformance = visibleCourses
    .map((course) => {
      const courseEnrollments = enrollmentsByCourse.get(course.id) ?? [];
      const courseAttempts = attemptsByCourse.get(course.id) ?? [];
      const courseCompletions = courseEnrollments.filter(
        (enrollment) =>
          enrollment.status === EnrollmentStatus.COMPLETED ||
          enrollment.progressPercent >= 100,
      ).length;
      const coursePassedAttempts = courseAttempts.filter(
        (attempt) => attempt.passed || attempt.status === QuizAttemptStatus.PASSED,
      ).length;
      const completionRate =
        courseEnrollments.length === 0
          ? 0
          : Math.round((courseCompletions / courseEnrollments.length) * 100);
      const numericPassRate =
        courseAttempts.length === 0
          ? null
          : Math.round((coursePassedAttempts / courseAttempts.length) * 100);
      const status = completionStatus(completionRate, numericPassRate);
      const courseRatings = feedbackByCourse.get(course.id) ?? [];
      const avgRating = averageRating(courseRatings);

      return {
        courseId: course.id,
        averageRating: avgRating,
        certificates: String(certificatesByCourse.get(course.id) ?? 0),
        completion: percentage(courseCompletions, courseEnrollments.length),
        completionNumeric: completionRate,
        course: course.title,
        enrollments: String(courseEnrollments.length),
        passRate: percentage(coursePassedAttempts, courseAttempts.length),
        passRateNumeric: numericPassRate ?? 0,
        status: status.status,
        statusTone: status.statusTone,
      };
    })
    .sort((left, right) => Number(right.enrollments) - Number(left.enrollments));

  /* ---------- Cohort progress ---------- */

  const cohortUsers = await prisma.user.findMany({
    select: {
      id: true,
      organizationId: true,
      primaryCohortId: true,
    },
    where: {
      primaryCohortId: { not: null },
      roleAssignments: { some: { role: { key: "PARTICIPANT" } } },
    },
  });

  const cohortProgress: MonitoringCohortProgress[] = cohorts.map((cohort) => {
    const users = cohortUsers.filter((u) => u.primaryCohortId === cohort.id);
    const userIds = new Set(users.map((u) => u.id));
    const orgIds = new Set(users.map((u) => u.organizationId).filter(Boolean));
    const cohortEnrollments = enrollments.filter((e) => userIds.has(e.userId));
    const cohortCompleted = cohortEnrollments.filter(
      (e) => e.status === EnrollmentStatus.COMPLETED || e.progressPercent >= 100,
    ).length;
    const cohortCerts = certificates.filter((c) => userIds.has(c.userId)).length;
    const cohortFeedback = feedbackRecords.filter(
      (f) => f.rating !== null && userIds.has(f.userId),
    );

    return {
      assignedCourses: new Set(cohortEnrollments.map((e) => e.courseId)).size,
      averageRating: averageRating(cohortFeedback.map((f) => f.rating)),
      certificates: cohortCerts,
      cohortId: cohort.id,
      cohortName: cohort.name,
      completed: cohortCompleted,
      completionNumeric: numericPercent(cohortCompleted, cohortEnrollments.length),
      completionRate: percentage(cohortCompleted, cohortEnrollments.length),
      enrollments: cohortEnrollments.length,
      organizations: orgIds.size,
      participants: users.length,
    };
  });

  /* ---------- Organization progress ---------- */

  const orgUsers = await prisma.user.findMany({
    select: {
      id: true,
      organizationId: true,
    },
    where: {
      organizationId: { not: null },
      roleAssignments: { some: { role: { key: "PARTICIPANT" } } },
    },
  });

  const organizationProgress: MonitoringOrganizationProgress[] = organizations.map((org) => {
    const users = orgUsers.filter((u) => u.organizationId === org.id);
    const userIds = new Set(users.map((u) => u.id));
    const orgEnrollments = enrollments.filter((e) => userIds.has(e.userId));
    const orgActive = new Set(
      activeEnrollments
        .filter((e) => userIds.has(e.userId))
        .map((e) => e.userId),
    ).size;
    const orgCompleted = orgEnrollments.filter(
      (e) => e.status === EnrollmentStatus.COMPLETED || e.progressPercent >= 100,
    ).length;
    const orgCerts = certificates.filter((c) => userIds.has(c.userId)).length;

    return {
      activeParticipants: orgActive,
      certificates: orgCerts,
      completed: orgCompleted,
      completionNumeric: numericPercent(orgCompleted, orgEnrollments.length),
      completionRate: percentage(orgCompleted, orgEnrollments.length),
      enrollments: orgEnrollments.length,
      organizationId: org.id,
      organizationName: org.name,
      participants: users.length,
    };
  });

  /* ---------- Attention signals ---------- */

  const attentionSignals: MonitoringAttentionSignal[] = [];

  for (const cp of coursePerformance) {
    if (Number(cp.enrollments) > 0 && cp.completionNumeric < 50) {
      attentionSignals.push({
        detail: `${cp.completion} completion rate`,
        label: cp.course,
        tone: "orange",
        type: "low-completion",
      });
    }

    if (Number(cp.enrollments) > 0 && cp.passRateNumeric > 0 && cp.passRateNumeric < 60) {
      attentionSignals.push({
        detail: `${cp.passRate} pass rate`,
        label: cp.course,
        tone: "red",
        type: "low-pass-rate",
      });
    }

    if (cp.averageRating !== "N/A" && parseFloat(cp.averageRating) < 3) {
      attentionSignals.push({
        detail: `${cp.averageRating}/5 average rating`,
        label: cp.course,
        tone: "gold",
        type: "low-feedback",
      });
    }
  }

  for (const ch of cohortProgress) {
    if (ch.participants > 0 && ch.enrollments === 0) {
      attentionSignals.push({
        detail: "No enrollments recorded",
        label: ch.cohortName,
        tone: "orange",
        type: "low-activity",
      });
    }
  }

  /* ---------- KPI cards ---------- */

  const kpiCards: MonitoringKpiCard[] = [
    { helperText: "Users with Participant role", label: "Registered participants", tone: "blue", value: String(registeredParticipantCount) },
    { helperText: "Participants with recent activity", label: "Active participants", tone: "blue", value: String(activeParticipantCount) },
    { helperText: "Active organizations", label: "CSO organizations", tone: "blue", value: String(organizationCount) },
    { helperText: "Active cohorts", label: "Cohorts", tone: "blue", value: String(cohortCount) },
    { helperText: "Courses available to participants", label: "Published courses", tone: "green", value: String(publishedCourseCount) },
    { helperText: "Active course registrations", label: "Enrollments", tone: "blue", value: String(enrollments.length) },
    { helperText: "Completed ÷ total enrollments", label: "Completion rate", tone: "green", value: completionRate },
    { helperText: "Passed ÷ submitted test attempts", label: "Final test pass rate", tone: "green", value: passRate },
    { helperText: "Certificates recorded", label: "Certificates issued", tone: "orange", value: String(certificateCount) },
    { helperText: "Average participant course rating", label: "Average course rating", tone: "gray", value: avgFeedbackRating },
  ];

  /* ---------- Test summary ---------- */

  const testSummary: MonitoringTestSummary = {
    averagePassScore: defaultPassThreshold ? `${defaultPassThreshold}%` : "N/A",
    certificatesIssued: certificateCount,
    failedAttempts,
    learnersNearingCompletion,
    passRate,
    passRateNumeric,
    passedAttempts,
    totalAttempts: quizAttempts.length,
  };

  /* ---------- Return ---------- */

  return {
    attentionSignals,
    cohortProgress,
    coursePerformance,
    filterOptions: {
      cohorts: cohorts.map((cohort) => ({ id: cohort.id, label: cohort.name })),
      courses: courses.map((course) => ({ id: course.id, label: course.title })),
      dateRanges: dateRangeOptions,
      organizations: organizations.map((organization) => ({
        id: organization.id,
        label: organization.name,
      })),
    },
    filters: {
      cohortId: selectedFilters.cohortId,
      courseId: selectedFilters.courseId,
      dateRange: selectedFilters.dateRange,
      organizationId: selectedFilters.organizationId,
    },
    hasActiveFilters,
    kpiCards,
    organizationProgress,
    testSummary,
  };
}
