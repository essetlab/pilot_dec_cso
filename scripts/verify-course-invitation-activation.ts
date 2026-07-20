import "dotenv/config";

import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { readFileSync } from "node:fs";
import {
  AuditActionType,
  CourseInvitationStatus,
  CourseStatus,
  CourseVisibility,
  OrganizationStatus,
  RoleKey,
  UserStatus,
} from "../src/generated/prisma/client";
import type { AuthSession } from "../src/lib/auth/session-codec";
import {
  activateCourseInvitation,
  createCourseInvitationToken,
  hashCourseInvitationToken,
} from "../src/lib/course-invitation-workflow";
import { prisma } from "../src/lib/prisma";

const suffix = randomUUID();
const prefix = `b2-${suffix}`;
const fictionalDomain = ["example", "test"].join(".");
const email = (label: string) => `${prefix}-${label}@${fictionalDomain}`;
const organizationName = (label: string) => `B2 ${label} fictional organization ${suffix}`;
const cohortName = (label: string) => `B2 ${label} fictional cohort ${suffix}`;
const courseSlug = (label: string) => `${prefix}-${label}-course`;

function sessionFor(user: { email: string; fullName: string; id: string }): AuthSession {
  return {
    email: user.email,
    issuedAt: new Date().toISOString(),
    name: user.fullName,
    roles: [],
    userId: user.id,
  };
}

async function cleanup() {
  const users = await prisma.user.findMany({
    select: { id: true },
    where: { email: { startsWith: `${prefix}-` } },
  });
  const userIds = users.map(({ id }) => id);
  const courses = await prisma.course.findMany({
    select: { id: true },
    where: { slug: { startsWith: `${prefix}-` } },
  });
  const courseIds = courses.map(({ id }) => id);
  const organizations = await prisma.organization.findMany({
    select: { id: true },
    where: { name: { contains: suffix } },
  });
  const organizationIds = organizations.map(({ id }) => id);
  const cohorts = await prisma.cohort.findMany({
    select: { id: true },
    where: { name: { contains: suffix } },
  });
  const cohortIds = cohorts.map(({ id }) => id);

  await prisma.courseInvitation.deleteMany({
    where: {
      OR: [
        { courseId: { in: courseIds } },
        { invitedByUserId: { in: userIds } },
        { invitedEmail: { startsWith: `${prefix}-` } },
      ],
    },
  });
  await prisma.auditLog.deleteMany({ where: { actorUserId: { in: userIds } } });
  await prisma.enrollment.deleteMany({
    where: { OR: [{ courseId: { in: courseIds } }, { userId: { in: userIds } }] },
  });
  await prisma.courseAssignment.deleteMany({
    where: {
      OR: [
        { assignedById: { in: userIds } },
        { courseId: { in: courseIds } },
        { targetUserId: { in: userIds } },
      ],
    },
  });
  await prisma.userRoleAssignment.deleteMany({
    where: { OR: [{ assignedById: { in: userIds } }, { userId: { in: userIds } }] },
  });
  await prisma.course.deleteMany({ where: { id: { in: courseIds } } });
  await prisma.user.deleteMany({ where: { id: { in: userIds } } });
  await prisma.cohortOrganization.deleteMany({
    where: {
      OR: [{ cohortId: { in: cohortIds } }, { organizationId: { in: organizationIds } }],
    },
  });
  await prisma.cohort.deleteMany({ where: { id: { in: cohortIds } } });
  await prisma.organization.deleteMany({ where: { id: { in: organizationIds } } });
}

async function createSentInvitation(input: {
  cohortId?: string | null;
  courseId: string;
  courseVersionId: string | null;
  email: string;
  expiresAt?: Date;
  invitedByUserId: string;
  organizationId: string;
  status?: CourseInvitationStatus;
}) {
  const plaintextToken = createCourseInvitationToken();
  const status = input.status ?? CourseInvitationStatus.SENT;
  const invitation = await prisma.courseInvitation.create({
    data: {
      cohortId: input.cohortId,
      courseId: input.courseId,
      courseVersionId: input.courseVersionId,
      expiresAt: input.expiresAt ?? new Date(Date.now() + 60 * 60 * 1000),
      invitedByUserId: input.invitedByUserId,
      invitedEmail: input.email.trim().toLowerCase(),
      invitedName: "B2 Fictional Invited Learner",
      organizationId: input.organizationId,
      sentAt: status === CourseInvitationStatus.SENT ? new Date() : null,
      status,
      tokenHash: hashCourseInvitationToken(plaintextToken),
      ...(status === CourseInvitationStatus.CANCELLED ? { cancelledAt: new Date() } : {}),
    },
  });

  return { invitation, plaintextToken };
}

let cleanupCompleted = false;

try {
  await cleanup();

  const adminRole = await prisma.role.upsert({
    create: { key: RoleKey.PLATFORM_ADMIN, name: "Platform Admin" },
    update: {},
    where: { key: RoleKey.PLATFORM_ADMIN },
  });
  const participantRole = await prisma.role.upsert({
    create: { key: RoleKey.PARTICIPANT, name: "Participant" },
    update: {},
    where: { key: RoleKey.PARTICIPANT },
  });

  const userLabels = [
    "admin",
    "success",
    "different",
    "mismatch",
    "expired",
    "cancelled",
    "inactive",
    "existing",
    "organization-conflict",
    "assignment-conflict",
    "concurrent",
    "wrong-version",
    "inactive-organization",
    "inactive-cohort",
    "unpublished-course",
  ];
  const createdUsers: { email: string; fullName: string; id: string }[] = [];
  for (const label of userLabels) {
    createdUsers.push(
      await prisma.user.create({
        data: {
          email: email(label),
          fullName: `B2 Fictional ${label} user`,
          status: label === "inactive" ? UserStatus.SUSPENDED : UserStatus.ACTIVE,
        },
      }),
    );
  }
  const users = Object.fromEntries(
    userLabels.map((label, index) => [label, createdUsers[index]]),
  ) as Record<string, (typeof createdUsers)[number]>;

  await prisma.userRoleAssignment.createMany({
    data: [
      {
        assignedById: users.admin.id,
        roleId: adminRole.id,
        userId: users.admin.id,
      },
      {
        assignedById: users.admin.id,
        roleId: participantRole.id,
        userId: users.admin.id,
      },
      ...userLabels
        .filter((label) => label !== "admin")
        .map((label) => ({
          assignedById: users.admin.id,
          roleId: participantRole.id,
          userId: users[label].id,
        })),
    ],
  });

  const activeOrganization = await prisma.organization.create({
    data: { name: organizationName("active"), status: OrganizationStatus.ACTIVE },
  });
  const inactiveOrganization = await prisma.organization.create({
    data: { name: organizationName("inactive"), status: OrganizationStatus.INACTIVE },
  });
  const otherOrganization = await prisma.organization.create({
    data: { name: organizationName("other"), status: OrganizationStatus.ACTIVE },
  });
  const activeCohort = await prisma.cohort.create({
    data: { name: cohortName("active"), status: OrganizationStatus.ACTIVE },
  });
  const inactiveCohort = await prisma.cohort.create({
    data: { name: cohortName("inactive"), status: OrganizationStatus.INACTIVE },
  });
  await prisma.cohortOrganization.createMany({
    data: [
      { cohortId: activeCohort.id, organizationId: activeOrganization.id },
      { cohortId: inactiveCohort.id, organizationId: activeOrganization.id },
    ],
  });

  const course = await prisma.course.create({
    data: {
      assignedCreatorId: users.admin.id,
      createdById: users.admin.id,
      shortDescription: "B2 fictional restricted course.",
      slug: courseSlug("restricted"),
      status: CourseStatus.PUBLISHED,
      title: "B2 Fictional Restricted Course",
      visibility: CourseVisibility.ASSIGNED_ONLY,
    },
  });
  const otherCourse = await prisma.course.create({
    data: {
      assignedCreatorId: users.admin.id,
      createdById: users.admin.id,
      shortDescription: "B2 fictional alternate course.",
      slug: courseSlug("alternate"),
      status: CourseStatus.PUBLISHED,
      title: "B2 Fictional Alternate Course",
      visibility: CourseVisibility.ASSIGNED_ONLY,
    },
  });
  const unpublishedCourse = await prisma.course.create({
    data: {
      assignedCreatorId: users.admin.id,
      createdById: users.admin.id,
      shortDescription: "B2 fictional unpublished course.",
      slug: courseSlug("unpublished"),
      status: CourseStatus.DRAFT,
      title: "B2 Fictional Unpublished Course",
      visibility: CourseVisibility.ASSIGNED_ONLY,
    },
  });
  const courseVersion = await prisma.courseVersion.create({
    data: {
      courseId: course.id,
      createdById: users.admin.id,
      status: CourseStatus.PUBLISHED,
      versionNumber: 1,
    },
  });
  const alternateVersion = await prisma.courseVersion.create({
    data: {
      courseId: course.id,
      createdById: users.admin.id,
      status: CourseStatus.PUBLISHED,
      versionNumber: 2,
    },
  });
  const otherCourseVersion = await prisma.courseVersion.create({
    data: {
      courseId: otherCourse.id,
      createdById: users.admin.id,
      status: CourseStatus.PUBLISHED,
      versionNumber: 1,
    },
  });
  const unpublishedVersion = await prisma.courseVersion.create({
    data: {
      courseId: unpublishedCourse.id,
      createdById: users.admin.id,
      status: CourseStatus.DRAFT,
      versionNumber: 1,
    },
  });

  const successFixture = await createSentInvitation({
    cohortId: activeCohort.id,
    courseId: course.id,
    courseVersionId: courseVersion.id,
    email: `  ${users.success.email.toUpperCase()}  `,
    invitedByUserId: users.admin.id,
    organizationId: activeOrganization.id,
  });
  const successfulActivation = await activateCourseInvitation({
    plaintextToken: successFixture.plaintextToken,
    session: sessionFor(users.success),
  });
  assert.equal(successfulActivation.success, true);
  assert.equal(successfulActivation.code, "activated");

  const linkedSuccessUser = await prisma.user.findUniqueOrThrow({
    where: { id: users.success.id },
  });
  const activatedInvitation = await prisma.courseInvitation.findUniqueOrThrow({
    where: { id: successFixture.invitation.id },
  });
  const successAssignments = await prisma.courseAssignment.findMany({
    where: { courseId: course.id, targetUserId: users.success.id },
  });
  const successAudits = await prisma.auditLog.findMany({
    where: {
      actionType: AuditActionType.COURSE_INVITATION_ACTIVATED,
      entityId: successFixture.invitation.id,
    },
  });
  assert.equal(linkedSuccessUser.organizationId, activeOrganization.id);
  assert.equal(linkedSuccessUser.primaryCohortId, activeCohort.id);
  assert.equal(successAssignments.length, 1);
  assert.equal(successAssignments[0].assignmentType, "USER");
  assert.equal(successAssignments[0].courseVersionId, courseVersion.id);
  assert.equal(successAssignments[0].targetOrganizationId, null);
  assert.equal(successAssignments[0].targetCohortId, null);
  assert.equal(activatedInvitation.status, CourseInvitationStatus.ACTIVATED);
  assert.equal(activatedInvitation.activatedUserId, users.success.id);
  assert.equal(activatedInvitation.courseAssignmentId, successAssignments[0].id);
  assert(activatedInvitation.activatedAt);
  assert.equal(successAudits.length, 1);

  const replay = await activateCourseInvitation({
    plaintextToken: successFixture.plaintextToken,
    session: sessionFor(users.success),
  });
  assert.equal(replay.success, true);
  assert.equal(replay.code, "already-activated");
  assert.equal(
    await prisma.courseAssignment.count({
      where: { courseId: course.id, targetUserId: users.success.id },
    }),
    1,
  );
  assert.equal(
    await prisma.auditLog.count({
      where: {
        actionType: AuditActionType.COURSE_INVITATION_ACTIVATED,
        entityId: successFixture.invitation.id,
      },
    }),
    1,
  );

  const differentUserReplay = await activateCourseInvitation({
    plaintextToken: successFixture.plaintextToken,
    session: sessionFor(users.different),
  });
  assert.deepEqual(differentUserReplay, {
    code: "invalid-or-unavailable",
    success: false,
  });

  const mismatchFixture = await createSentInvitation({
    courseId: course.id,
    courseVersionId: courseVersion.id,
    email: email("intended-mismatch-user"),
    invitedByUserId: users.admin.id,
    organizationId: activeOrganization.id,
  });
  assert.deepEqual(
    await activateCourseInvitation({
      plaintextToken: mismatchFixture.plaintextToken,
      session: sessionFor(users.mismatch),
    }),
    { code: "invalid-or-unavailable", success: false },
  );

  const expiredFixture = await createSentInvitation({
    courseId: course.id,
    courseVersionId: courseVersion.id,
    email: users.expired.email,
    expiresAt: new Date(Date.now() - 60_000),
    invitedByUserId: users.admin.id,
    organizationId: activeOrganization.id,
  });
  const cancelledFixture = await createSentInvitation({
    courseId: course.id,
    courseVersionId: courseVersion.id,
    email: users.cancelled.email,
    invitedByUserId: users.admin.id,
    organizationId: activeOrganization.id,
    status: CourseInvitationStatus.CANCELLED,
  });
  for (const [fixture, user] of [
    [expiredFixture, users.expired],
    [cancelledFixture, users.cancelled],
  ] as const) {
    assert.deepEqual(
      await activateCourseInvitation({
        plaintextToken: fixture.plaintextToken,
        session: sessionFor(user),
      }),
      { code: "invalid-or-unavailable", success: false },
    );
  }

  const inactiveUserFixture = await createSentInvitation({
    courseId: course.id,
    courseVersionId: courseVersion.id,
    email: users.inactive.email,
    invitedByUserId: users.admin.id,
    organizationId: activeOrganization.id,
  });
  assert.deepEqual(
    await activateCourseInvitation({
      plaintextToken: inactiveUserFixture.plaintextToken,
      session: sessionFor(users.inactive),
    }),
    { code: "unauthorized", success: false },
  );

  const wrongVersionFixture = await createSentInvitation({
    courseId: course.id,
    courseVersionId: otherCourseVersion.id,
    email: users["wrong-version"].email,
    invitedByUserId: users.admin.id,
    organizationId: activeOrganization.id,
  });
  const inactiveOrganizationFixture = await createSentInvitation({
    courseId: course.id,
    courseVersionId: courseVersion.id,
    email: users["inactive-organization"].email,
    invitedByUserId: users.admin.id,
    organizationId: inactiveOrganization.id,
  });
  const inactiveCohortFixture = await createSentInvitation({
    cohortId: inactiveCohort.id,
    courseId: course.id,
    courseVersionId: courseVersion.id,
    email: users["inactive-cohort"].email,
    invitedByUserId: users.admin.id,
    organizationId: activeOrganization.id,
  });
  const unpublishedCourseFixture = await createSentInvitation({
    courseId: unpublishedCourse.id,
    courseVersionId: unpublishedVersion.id,
    email: users["unpublished-course"].email,
    invitedByUserId: users.admin.id,
    organizationId: activeOrganization.id,
  });
  for (const [label, fixture, user] of [
    ["wrong version", wrongVersionFixture, users["wrong-version"]],
    ["inactive organization", inactiveOrganizationFixture, users["inactive-organization"]],
    ["inactive cohort", inactiveCohortFixture, users["inactive-cohort"]],
    ["unpublished course", unpublishedCourseFixture, users["unpublished-course"]],
  ] as const) {
    assert.deepEqual(
      await activateCourseInvitation({
        plaintextToken: fixture.plaintextToken,
        session: sessionFor(user),
      }),
      { code: "invalid-or-unavailable", success: false },
      label,
    );
  }

  await prisma.user.update({
    data: {
      organizationId: activeOrganization.id,
      primaryCohortId: activeCohort.id,
    },
    where: { id: users.existing.id },
  });
  const existingAssignment = await prisma.courseAssignment.create({
    data: {
      assignedById: users.admin.id,
      assignmentType: "USER",
      courseId: course.id,
      courseVersionId: courseVersion.id,
      targetUserId: users.existing.id,
    },
  });
  const existingFixture = await createSentInvitation({
    cohortId: activeCohort.id,
    courseId: course.id,
    courseVersionId: courseVersion.id,
    email: users.existing.email,
    invitedByUserId: users.admin.id,
    organizationId: activeOrganization.id,
  });
  assert.equal(
    (
      await activateCourseInvitation({
        plaintextToken: existingFixture.plaintextToken,
        session: sessionFor(users.existing),
      })
    ).code,
    "activated",
  );
  assert.equal(
    (
      await prisma.courseInvitation.findUniqueOrThrow({
        where: { id: existingFixture.invitation.id },
      })
    ).courseAssignmentId,
    existingAssignment.id,
  );

  await prisma.user.update({
    data: { organizationId: otherOrganization.id },
    where: { id: users["organization-conflict"].id },
  });
  const organizationConflictFixture = await createSentInvitation({
    courseId: course.id,
    courseVersionId: courseVersion.id,
    email: users["organization-conflict"].email,
    invitedByUserId: users.admin.id,
    organizationId: activeOrganization.id,
  });
  assert.deepEqual(
    await activateCourseInvitation({
      plaintextToken: organizationConflictFixture.plaintextToken,
      session: sessionFor(users["organization-conflict"]),
    }),
    { code: "integrity-error", success: false },
  );
  assert.equal(
    (
      await prisma.user.findUniqueOrThrow({
        where: { id: users["organization-conflict"].id },
      })
    ).organizationId,
    otherOrganization.id,
  );

  await prisma.user.update({
    data: { organizationId: activeOrganization.id },
    where: { id: users["assignment-conflict"].id },
  });
  await prisma.courseAssignment.create({
    data: {
      assignedById: users.admin.id,
      assignmentType: "USER",
      courseId: course.id,
      courseVersionId: alternateVersion.id,
      targetUserId: users["assignment-conflict"].id,
    },
  });
  const assignmentConflictFixture = await createSentInvitation({
    courseId: course.id,
    courseVersionId: courseVersion.id,
    email: users["assignment-conflict"].email,
    invitedByUserId: users.admin.id,
    organizationId: activeOrganization.id,
  });
  assert.deepEqual(
    await activateCourseInvitation({
      plaintextToken: assignmentConflictFixture.plaintextToken,
      session: sessionFor(users["assignment-conflict"]),
    }),
    { code: "integrity-error", success: false },
  );

  const concurrentFixture = await createSentInvitation({
    cohortId: activeCohort.id,
    courseId: course.id,
    courseVersionId: courseVersion.id,
    email: users.concurrent.email,
    invitedByUserId: users.admin.id,
    organizationId: activeOrganization.id,
  });
  const concurrentResults = await Promise.all([
    activateCourseInvitation({
      plaintextToken: concurrentFixture.plaintextToken,
      session: sessionFor(users.concurrent),
    }),
    activateCourseInvitation({
      plaintextToken: concurrentFixture.plaintextToken,
      session: sessionFor(users.concurrent),
    }),
  ]);
  assert.deepEqual(
    concurrentResults.map((result) => result.code).sort(),
    ["activated", "already-activated"],
  );
  assert.equal(
    await prisma.courseAssignment.count({
      where: { courseId: course.id, targetUserId: users.concurrent.id },
    }),
    1,
  );
  assert.equal(
    await prisma.auditLog.count({
      where: {
        actionType: AuditActionType.COURSE_INVITATION_ACTIVATED,
        entityId: concurrentFixture.invitation.id,
      },
    }),
    1,
  );

  const adminImpersonationFixture = await createSentInvitation({
    courseId: course.id,
    courseVersionId: courseVersion.id,
    email: users.admin.email,
    invitedByUserId: users.admin.id,
    organizationId: activeOrganization.id,
  });
  assert.deepEqual(
    await activateCourseInvitation({
      plaintextToken: adminImpersonationFixture.plaintextToken,
      session: sessionFor(users.admin),
    }),
    { code: "unauthorized", success: false },
  );

  const activationAudits = await prisma.auditLog.findMany({
    where: {
      actionType: AuditActionType.COURSE_INVITATION_ACTIVATED,
      actorUserId: { in: Object.values(users).map((user) => user.id) },
    },
  });
  const sensitiveValues = [
    successFixture.plaintextToken,
    successFixture.invitation.tokenHash,
    users.success.email,
  ];
  const auditText = JSON.stringify(activationAudits);
  for (const sensitiveValue of sensitiveValues) {
    assert.equal(auditText.includes(sensitiveValue), false);
  }
  assert.equal(
    await prisma.enrollment.count({ where: { courseId: course.id } }),
    0,
  );

  const routeSource = readFileSync(
    "src/app/api/course-invitations/activate/route.ts",
    "utf8",
  );
  assert.match(routeSource, /getCurrentSession/);
  assert.match(routeSource, /activateCourseInvitation/);
  assert.match(routeSource, /request\.headers\.get\("origin"\)/);
  assert.doesNotMatch(routeSource, /organizationId|courseVersionId|courseId/);

  await cleanup();
  cleanupCompleted = true;
  assert.equal(
    await prisma.user.count({ where: { email: { startsWith: `${prefix}-` } } }),
    0,
  );
  assert.equal(
    await prisma.course.count({ where: { slug: { startsWith: `${prefix}-` } } }),
    0,
  );
  assert.equal(
    await prisma.organization.count({ where: { name: { contains: suffix } } }),
    0,
  );

  console.log("Course invitation activation verification passed.");
} finally {
  if (!cleanupCompleted) {
    await cleanup();
  }
}
