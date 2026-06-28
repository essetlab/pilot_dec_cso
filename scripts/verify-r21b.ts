import "dotenv/config";

import {
  CertificateStatus,
  QuizAttemptStatus,
  UserStatus,
} from "../src/generated/prisma/enums";
import type { AuthSession } from "../src/lib/auth/session-codec";
import { getMonitoringData } from "../src/lib/monitoring-workflow";
import { prisma } from "../src/lib/prisma";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

function sessionFor(
  user: { email: string; fullName: string | null; id: string },
  roles: AuthSession["roles"],
): AuthSession {
  return {
    email: user.email,
    issuedAt: new Date().toISOString(),
    name: user.fullName ?? user.email,
    roles,
    userId: user.id,
  };
}

function kpiValue(data: Awaited<ReturnType<typeof getMonitoringData>>, label: string) {
  return data.kpiCards.find((card) => card.label === label)?.value;
}

function thirtyDaysAgo() {
  const start = new Date();
  start.setUTCDate(start.getUTCDate() - 30);
  return start;
}

async function main() {
  console.log("=== R21B Verification: Monitoring Filters ===");

  const [admin, meViewer, participant, course, organization, cohort] = await Promise.all([
    prisma.user.findUnique({ where: { email: "admin@demo.local" } }),
    prisma.user.findUnique({ where: { email: "meviewer@demo.local" } }),
    prisma.user.findUnique({ where: { email: "participant2@demo.local" } }),
    prisma.course.findFirst({ orderBy: { title: "asc" }, select: { id: true, title: true } }),
    prisma.organization.findFirst({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
    prisma.cohort.findFirst({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
  ]);
  assert(admin, "Missing seeded Platform Admin user. Run npm run db:seed first.");
  assert(meViewer, "Missing seeded M&E Viewer user. Run npm run db:seed first.");
  assert(participant, "Missing seeded participant user. Run npm run db:seed first.");
  assert(course, "Missing seeded course. Run npm run db:seed first.");
  assert(organization, "Missing seeded organization. Run npm run db:seed first.");
  assert(cohort, "Missing seeded cohort. Run npm run db:seed first.");

  const adminSession = sessionFor(admin, ["PLATFORM_ADMIN"]);
  const meViewerSession = sessionFor(meViewer, ["ME_VIEWER"]);
  const participantSession = sessionFor(participant, ["PARTICIPANT"]);

  const courseData = await getMonitoringData(adminSession, {
    courseId: course.id,
    dateRange: "all",
  });
  const courseEnrollmentCount = await prisma.enrollment.count({
    where: { courseId: course.id },
  });
  assert(courseData.filters.courseId === course.id, "Expected selected course filter to persist.");
  assert(courseData.coursePerformance.length === 1, "Expected course filter to return one course row.");
  assert(courseData.coursePerformance[0]?.courseId === course.id, "Expected filtered course row id.");
  assert(kpiValue(courseData, "Enrollments") === String(courseEnrollmentCount), "Expected course-filtered enrollment count.");
  console.log("PASS: course filter limits monitoring aggregates and course rows.");

  const organizationUserIds = (
    await prisma.user.findMany({
      select: { id: true },
      where: { organizationId: organization.id },
    })
  ).map((user) => user.id);
  const organizationData = await getMonitoringData(adminSession, {
    dateRange: "all",
    organizationId: organization.id,
  });
  const organizationEnrollmentCount = await prisma.enrollment.count({
    where: { userId: { in: organizationUserIds } },
  });
  assert(organizationData.filters.organizationId === organization.id, "Expected selected organization filter to persist.");
  assert(kpiValue(organizationData, "Enrollments") === String(organizationEnrollmentCount), "Expected organization-filtered enrollment count.");
  console.log("PASS: organization filter limits learner-scoped monitoring aggregates.");

  const cohortUserIds = (
    await prisma.user.findMany({
      select: { id: true },
      where: { primaryCohortId: cohort.id },
    })
  ).map((user) => user.id);
  const cohortData = await getMonitoringData(adminSession, {
    cohortId: cohort.id,
    dateRange: "all",
  });
  const cohortEnrollmentCount = await prisma.enrollment.count({
    where: { userId: { in: cohortUserIds } },
  });
  assert(cohortData.filters.cohortId === cohort.id, "Expected selected cohort filter to persist.");
  assert(kpiValue(cohortData, "Enrollments") === String(cohortEnrollmentCount), "Expected cohort-filtered enrollment count.");
  console.log("PASS: cohort filter limits learner-scoped monitoring aggregates.");

  const recentData = await getMonitoringData(adminSession, { dateRange: "30d" });
  const recentEnrollmentCount = await prisma.enrollment.count({
    where: { enrolledAt: { gte: thirtyDaysAgo() } },
  });
  assert(recentData.filters.dateRange === "30d", "Expected date range filter to persist.");
  assert(kpiValue(recentData, "Enrollments") === String(recentEnrollmentCount), "Expected recent enrollment count.");
  console.log("PASS: date range filter limits time-scoped monitoring aggregates.");

  const meViewerData = await getMonitoringData(meViewerSession, {
    courseId: course.id,
    dateRange: "all",
  });
  assert(kpiValue(meViewerData, "Enrollments") === String(courseEnrollmentCount), "Expected M&E viewer filtered metrics.");
  console.log("PASS: M&E Viewer can use monitoring filters.");

  const participantData = await getMonitoringData(participantSession, {
    courseId: course.id,
    dateRange: "all",
  });
  assert(participantData.coursePerformance.length === 0, "Expected participant filtered data to be empty.");
  assert(participantData.filterOptions.courses.length === 0, "Expected participant filter options to be empty.");
  console.log("PASS: participant cannot use monitoring aggregate filters.");

  const passedAttempts = await prisma.quizAttempt.count({
    where: {
      courseId: course.id,
      OR: [{ passed: true }, { status: QuizAttemptStatus.PASSED }],
      status: {
        in: [
          QuizAttemptStatus.SUBMITTED,
          QuizAttemptStatus.PASSED,
          QuizAttemptStatus.FAILED,
        ],
      },
    },
  });
  const issuedCertificates = await prisma.certificate.count({
    where: { courseId: course.id, status: CertificateStatus.ISSUED },
  });
  assert(
    courseData.testSummary.passedAttempts === passedAttempts,
    "Expected course-filtered passed tests.",
  );
  assert(kpiValue(courseData, "Certificates issued") === String(issuedCertificates), "Expected course-filtered certificate count.");
  console.log("PASS: filtered final test and certificate summaries are DB-backed.");

  const activeLearners = await prisma.user.count({
    where: {
      enrollments: { some: { courseId: course.id } },
      status: UserStatus.ACTIVE,
    },
  });
  assert(kpiValue(courseData, "Active participants") === String(activeLearners), "Expected filtered active participant KPI.");

  console.log("ALL R21B CHECKS PASSED.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
