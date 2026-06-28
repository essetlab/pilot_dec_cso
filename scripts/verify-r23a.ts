import "dotenv/config";

import type { AuthSession } from "../src/lib/auth/session-codec";
import { getAdminCourseListData } from "../src/lib/admin-course-workflow";
import { getAdminUsersData } from "../src/lib/admin-people-workflow";
import { prisma } from "../src/lib/prisma";
import { getAuditLogData } from "../src/lib/review-workflow";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

function sessionFor(user: { email: string; fullName: string | null; id: string }): AuthSession {
  return {
    email: user.email,
    issuedAt: new Date().toISOString(),
    name: user.fullName ?? user.email,
    roles: ["PLATFORM_ADMIN"],
    userId: user.id,
  };
}

async function main() {
  console.log("=== R23A Verification: Functional Filters/Search ===");

  const admin = await prisma.user.findUnique({ where: { email: "admin@demo.local" } });
  assert(admin, "Missing seeded Platform Admin user. Run npm run db:seed first.");
  const adminSession = sessionFor(admin);

  const allUsers = await getAdminUsersData(adminSession);
  assert(allUsers.users.length > 0, "Expected admin users to be available.");
  const userProbe = allUsers.users[0];
  const userSearch = await getAdminUsersData(adminSession, { query: userProbe.email });
  assert(userSearch.filters.query === userProbe.email, "Expected user query filter to be preserved.");
  assert(userSearch.users.every((user) => user.email === userProbe.email), "Expected user search to limit visible records.");
  const participantUsers = await getAdminUsersData(adminSession, { role: "PARTICIPANT" });
  assert(participantUsers.filters.role === "PARTICIPANT", "Expected user role filter to be preserved.");
  assert(participantUsers.users.every((user) => user.roles.includes("Participant")), "Expected role filter to limit users.");
  console.log("PASS: admin user search and filters work.");

  const allCourses = await getAdminCourseListData(adminSession);
  assert(allCourses.courses.length > 0, "Expected admin courses to be available.");
  const courseProbe = allCourses.courses[0];
  const courseSearch = await getAdminCourseListData(adminSession, { query: courseProbe.title.slice(0, 8) });
  assert(courseSearch.filters.query === courseProbe.title.slice(0, 8), "Expected course query filter to be preserved.");
  assert(
    courseSearch.courses.every((course) =>
      [course.title, course.creator, course.capacityArea, course.level, course.status, course.visibility]
        .join(" ")
        .toLowerCase()
        .includes(courseProbe.title.slice(0, 8).toLowerCase()),
    ),
    "Expected admin course search to limit visible records.",
  );
  const courseStatus = await getAdminCourseListData(adminSession, { status: courseProbe.status });
  assert(courseStatus.courses.every((course) => course.status === courseProbe.status), "Expected course status filter to limit records.");
  console.log("PASS: admin course search and filters work.");

  const allAudit = await getAuditLogData(adminSession);
  assert(allAudit.entries.length > 0, "Expected audit entries to be available.");
  const auditProbe = allAudit.entries[0];
  const auditArea = await getAuditLogData(adminSession, { area: auditProbe.area });
  assert(auditArea.filters.area === auditProbe.area, "Expected audit area filter to be preserved.");
  assert(auditArea.entries.every((entry) => entry.area === auditProbe.area), "Expected audit area filter to limit entries.");
  const auditActor = await getAuditLogData(adminSession, { actor: auditProbe.actorName });
  assert(auditActor.entries.every((entry) => entry.actorName === auditProbe.actorName), "Expected audit actor filter to limit entries.");
  console.log("PASS: audit log filters work.");

  console.log("ALL R23A CHECKS PASSED.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
