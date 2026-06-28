import "dotenv/config";

import {
  CertificateStatus,
  EnrollmentStatus,
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

async function main() {
  console.log("=== R21A Verification: Monitoring Aggregation ===");

  const [admin, meViewer, participant] = await Promise.all([
    prisma.user.findUnique({ where: { email: "admin@demo.local" } }),
    prisma.user.findUnique({ where: { email: "meviewer@demo.local" } }),
    prisma.user.findUnique({ where: { email: "participant2@demo.local" } }),
  ]);
  assert(admin, "Missing seeded Platform Admin user. Run npm run db:seed first.");
  assert(meViewer, "Missing seeded M&E Viewer user. Run npm run db:seed first.");
  assert(participant, "Missing seeded participant user. Run npm run db:seed first.");

  const adminSession = sessionFor(admin, ["PLATFORM_ADMIN"]);
  const meViewerSession = sessionFor(meViewer, ["ME_VIEWER"]);
  const participantSession = sessionFor(participant, ["PARTICIPANT"]);

  const [
    enrollmentCount,
    ,
    certificateCount,
    quizAttempts,
    activeLearners,
    courseCount,
    cohortCount,
    organizationCount,
  ] = await Promise.all([
    prisma.enrollment.count(),
    prisma.enrollment.count({
      where: { status: EnrollmentStatus.COMPLETED },
    }),
    prisma.certificate.count({
      where: { status: CertificateStatus.ISSUED },
    }),
    prisma.quizAttempt.findMany({
      select: { passed: true, status: true },
      where: {
        status: {
          in: [
            QuizAttemptStatus.SUBMITTED,
            QuizAttemptStatus.PASSED,
            QuizAttemptStatus.FAILED,
          ],
        },
      },
    }),
    prisma.user.count({
      where: {
        enrollments: { some: {} },
        status: UserStatus.ACTIVE,
      },
    }),
    prisma.course.count({ where: { archivedAt: null } }),
    prisma.cohort.count(),
    prisma.organization.count(),
  ]);

  const adminData = await getMonitoringData(adminSession);
  assert(kpiValue(adminData, "Enrollments") === String(enrollmentCount), "Expected enrollment metric to match DB count.");
  assert(kpiValue(adminData, "Certificates issued") === String(certificateCount), "Expected certificate metric to match DB count.");
  assert(kpiValue(adminData, "Active participants") === String(activeLearners), "Expected active participant KPI to match DB count.");
  assert(adminData.coursePerformance.length === courseCount, "Expected course performance rows to match course count.");
  assert(adminData.filterOptions.cohorts.length === cohortCount, "Expected cohort filter options to match DB count.");
  assert(adminData.filterOptions.organizations.length === organizationCount, "Expected organization filter options to match DB count.");
  console.log("PASS: admin monitoring aggregates match DB counts.");

  const passedAttempts = quizAttempts.filter(
    (attempt) => attempt.passed || attempt.status === QuizAttemptStatus.PASSED,
  ).length;
  const expectedPassRate =
    quizAttempts.length === 0
      ? "N/A"
      : `${Math.round((passedAttempts / quizAttempts.length) * 100)}%`;
  assert(kpiValue(adminData, "Final test pass rate") === expectedPassRate, "Expected pass rate metric to match DB attempts.");
  assert(
    adminData.testSummary.passedAttempts === passedAttempts,
    "Expected test summary to include passed test count.",
  );
  console.log("PASS: quiz attempt and pass-rate aggregation is DB-backed.");

  const meViewerData = await getMonitoringData(meViewerSession);
  assert(kpiValue(meViewerData, "Enrollments") === String(enrollmentCount), "Expected M&E viewer to see monitoring metrics.");
  assert(meViewerData.coursePerformance.length === adminData.coursePerformance.length, "Expected M&E viewer course rows.");
  console.log("PASS: M&E Viewer can read monitoring aggregates.");

  const participantData = await getMonitoringData(participantSession);
  assert(participantData.kpiCards.every((card) => card.value === "0" || card.value === "N/A"), "Expected participant metrics to be empty.");
  assert(participantData.coursePerformance.length === 0, "Expected participant course performance to be empty.");
  assert(participantData.filterOptions.cohorts.length === 0, "Expected participant filter options to be empty.");
  console.log("PASS: participant cannot read monitoring aggregates.");

  console.log("ALL R21A CHECKS PASSED.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
