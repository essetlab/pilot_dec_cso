import "dotenv/config";

import {
  CertificateStatus,
  CourseStatus,
  EnrollmentStatus,
  OrganizationStatus,
  RoleKey,
  UserStatus,
} from "../src/generated/prisma/enums";
import type { AuthSession } from "../src/lib/auth/session-codec";
import { getAdminDashboardData } from "../src/lib/admin-dashboard-workflow";
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

function parseMetric(value: string) {
  return Number(value.replaceAll(",", ""));
}

function getMetricValue(
  data: NonNullable<Awaited<ReturnType<typeof getAdminDashboardData>>>,
  label: string,
) {
  const metric = data.metrics.find((item) => item.label === label);
  assert(metric, `Missing dashboard metric: ${label}`);

  return parseMetric(metric.value);
}

async function getExpectedCounts() {
  const [
    totalUsers,
    participants,
    organizations,
    cohorts,
    totalCourses,
    publishedCourses,
    activeEnrollments,
    courseCompletions,
    certificatesIssued,
    awaitingReview,
  ] = await Promise.all([
    prisma.user.count({
      where: {
        status: {
          not: UserStatus.DEACTIVATED,
        },
      },
    }),
    prisma.user.count({
      where: {
        roleAssignments: {
          some: {
            isActive: true,
            role: {
              key: RoleKey.PARTICIPANT,
            },
          },
        },
        status: {
          not: UserStatus.DEACTIVATED,
        },
      },
    }),
    prisma.organization.count({
      where: {
        status: {
          not: OrganizationStatus.ARCHIVED,
        },
      },
    }),
    prisma.cohort.count({
      where: {
        status: {
          not: OrganizationStatus.ARCHIVED,
        },
      },
    }),
    prisma.course.count({
      where: {
        archivedAt: null,
      },
    }),
    prisma.course.count({
      where: {
        archivedAt: null,
        status: CourseStatus.PUBLISHED,
      },
    }),
    prisma.enrollment.count({
      where: {
        status: EnrollmentStatus.IN_PROGRESS,
      },
    }),
    prisma.enrollment.count({
      where: {
        status: EnrollmentStatus.COMPLETED,
      },
    }),
    prisma.certificate.count({
      where: {
        status: CertificateStatus.ISSUED,
      },
    }),
    prisma.course.count({
      where: {
        archivedAt: null,
        status: {
          in: [CourseStatus.READY_FOR_REVIEW, CourseStatus.APPROVED],
        },
      },
    }),
  ]);

  return {
    activeEnrollments,
    awaitingReview,
    certificatesIssued,
    cohorts,
    courseCompletions,
    organizations,
    participants,
    publishedCourses,
    totalCourses,
    totalUsers,
  };
}

async function main() {
  console.log("=== R22E Verification: DB-backed Admin Dashboard ===");

  const [admin, meViewer, participant] = await Promise.all([
    prisma.user.findUnique({ where: { email: "admin@demo.local" } }),
    prisma.user.findUnique({ where: { email: "meviewer@demo.local" } }),
    prisma.user.findUnique({ where: { email: "participant2@demo.local" } }),
  ]);

  assert(admin, "Missing seeded admin user. Run npm run db:seed first.");
  assert(meViewer, "Missing seeded M&E viewer user. Run npm run db:seed first.");
  assert(participant, "Missing seeded participant user. Run npm run db:seed first.");

  const adminSession = sessionFor(admin, ["PLATFORM_ADMIN"]);
  const meViewerSession = sessionFor(meViewer, ["ME_VIEWER"]);
  const participantSession = sessionFor(participant, ["PARTICIPANT"]);

  const dashboardData = await getAdminDashboardData(adminSession);
  assert(dashboardData, "Expected admin dashboard data for Platform Admin.");

  const expected = await getExpectedCounts();
  assert(dashboardData.metrics.length === 10, "Expected ten admin dashboard KPI cards.");
  assert(getMetricValue(dashboardData, "Total users") === expected.totalUsers, "Total users count mismatch.");
  assert(getMetricValue(dashboardData, "Participants") === expected.participants, "Participant count mismatch.");
  assert(getMetricValue(dashboardData, "CSO organizations") === expected.organizations, "Organization count mismatch.");
  assert(getMetricValue(dashboardData, "Cohorts") === expected.cohorts, "Cohort count mismatch.");
  assert(getMetricValue(dashboardData, "Total courses") === expected.totalCourses, "Course count mismatch.");
  assert(getMetricValue(dashboardData, "Published courses") === expected.publishedCourses, "Published course count mismatch.");
  assert(getMetricValue(dashboardData, "Active enrollments") === expected.activeEnrollments, "Active enrollment count mismatch.");
  assert(getMetricValue(dashboardData, "Course completions") === expected.courseCompletions, "Course completion count mismatch.");
  assert(getMetricValue(dashboardData, "Certificates issued") === expected.certificatesIssued, "Certificate count mismatch.");
  assert(getMetricValue(dashboardData, "Awaiting review") === expected.awaitingReview, "Awaiting review count mismatch.");
  console.log("PASS: dashboard KPI counts match database counts.");

  assert(
    Number(dashboardData.focus.certificatesIssued.replaceAll(",", "")) ===
      expected.certificatesIssued,
    "Expected focus certificate count to match issued certificates.",
  );
  assert(
    Number(dashboardData.focus.coursesAwaitingReview.replaceAll(",", "")) ===
      expected.awaitingReview,
    "Expected focus review count to match awaiting review count.",
  );
  console.log("PASS: dashboard focus summary is database-backed.");

  const auditLogCount = await prisma.auditLog.count();
  if (auditLogCount > 0) {
    assert(dashboardData.recentActivity.length > 0, "Expected recent audit activity on dashboard.");
    assert(
      dashboardData.recentActivity.every((item) => item.description.trim()),
      "Expected every activity item to have a description.",
    );
    console.log("PASS: recent activity reads audit log records.");
  } else {
    assert(dashboardData.recentActivity.length === 0, "Expected no activity items in an empty audit log.");
    console.log("PASS: recent activity supports an empty audit log.");
  }

  const certificateCount = await prisma.certificate.count({
    where: { status: CertificateStatus.ISSUED },
  });
  if (certificateCount > 0) {
    assert(dashboardData.recentCertificates.length > 0, "Expected recent certificates on dashboard.");
    assert(
      dashboardData.recentCertificates.every((certificate) => certificate.href.startsWith("/admin/certificates/")),
      "Expected every recent certificate to link to admin certificate detail.",
    );
    console.log("PASS: recent certificates read certificate records.");
  } else {
    assert(dashboardData.recentCertificates.length === 0, "Expected no recent certificates in an empty certificate table.");
    console.log("PASS: recent certificates support an empty certificate table.");
  }

  assert(
    dashboardData.attentionCourses.every((course) => course.href.startsWith("/admin/")),
    "Expected attention course links to stay inside admin routes.",
  );
  console.log("PASS: courses needing attention are admin-routed records.");

  const meViewerData = await getAdminDashboardData(meViewerSession);
  const participantData = await getAdminDashboardData(participantSession);
  assert(meViewerData === null, "Expected M&E Viewer not to receive admin dashboard data.");
  assert(participantData === null, "Expected participant not to receive admin dashboard data.");
  console.log("PASS: non-admin roles cannot read admin dashboard data.");

  console.log("ALL R22E CHECKS PASSED.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
