import "dotenv/config";

import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
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
  canTransitionCourseInvitation,
  cancelCourseInvitation,
  createDraftCourseInvitation,
  expireCourseInvitation,
  hashCourseInvitationToken,
  markCourseInvitationFailed,
  markCourseInvitationSent,
  prepareCourseInvitationResend,
  resolveCourseInvitationToken,
} from "../src/lib/course-invitation-workflow";
import { prisma } from "../src/lib/prisma";

const suffix = randomUUID();
const prefix = `b1-${suffix}`;
const fictionalDomain = ["example", "test"].join(".");
const fixtureEmails = {
  admin: `${prefix}-admin@${fictionalDomain}`,
  expiredAdmin: `${prefix}-expired-admin@${fictionalDomain}`,
  inactiveAdmin: `${prefix}-inactive-admin@${fictionalDomain}`,
  invited: `${prefix}-invited@${fictionalDomain}`,
  learner: `${prefix}-learner@${fictionalDomain}`,
};
const organizationNames = {
  active: `B1 active fictional organization ${suffix}`,
  inactive: `B1 inactive fictional organization ${suffix}`,
};
const courseSlug = `${prefix}-restricted-course`;
const cohortName = `B1 fictional cohort ${suffix}`;

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
    where: { email: { in: Object.values(fixtureEmails) } },
  });
  const userIds = users.map((user) => user.id);
  const courses = await prisma.course.findMany({
    select: { id: true },
    where: { slug: courseSlug },
  });
  const courseIds = courses.map((course) => course.id);
  const organizations = await prisma.organization.findMany({
    select: { id: true },
    where: { name: { in: Object.values(organizationNames) } },
  });
  const organizationIds = organizations.map((organization) => organization.id);

  await prisma.courseInvitation.deleteMany({
    where: {
      OR: [
        { courseId: { in: courseIds } },
        { invitedByUserId: { in: userIds } },
        { invitedEmail: fixtureEmails.invited },
        { organizationId: { in: organizationIds } },
      ],
    },
  });
  await prisma.auditLog.deleteMany({
    where: {
      actorUserId: { in: userIds },
    },
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
  await prisma.enrollment.deleteMany({
    where: {
      OR: [{ courseId: { in: courseIds } }, { userId: { in: userIds } }],
    },
  });
  await prisma.userRoleAssignment.deleteMany({
    where: {
      OR: [{ assignedById: { in: userIds } }, { userId: { in: userIds } }],
    },
  });
  await prisma.course.deleteMany({ where: { id: { in: courseIds } } });
  await prisma.cohort.deleteMany({ where: { name: cohortName } });
  await prisma.organization.deleteMany({ where: { id: { in: organizationIds } } });
  await prisma.user.deleteMany({ where: { id: { in: userIds } } });
}

try {
  await cleanup();

  const [adminRole, participantRole] = await Promise.all([
    prisma.role.upsert({
      create: {
        description: "Platform administration.",
        key: RoleKey.PLATFORM_ADMIN,
        name: "Platform Admin",
      },
      update: {},
      where: { key: RoleKey.PLATFORM_ADMIN },
    }),
    prisma.role.upsert({
      create: {
        description: "Learner access.",
        key: RoleKey.PARTICIPANT,
        name: "Participant",
      },
      update: {},
      where: { key: RoleKey.PARTICIPANT },
    }),
  ]);

  const admin = await prisma.user.create({
    data: {
      email: fixtureEmails.admin,
      fullName: "B1 Fictional Platform Administrator",
      status: UserStatus.ACTIVE,
    },
  });
  const learner = await prisma.user.create({
    data: {
      email: fixtureEmails.learner,
      fullName: "B1 Fictional Learner",
      status: UserStatus.ACTIVE,
    },
  });
  const expiredAdmin = await prisma.user.create({
    data: {
      email: fixtureEmails.expiredAdmin,
      fullName: "B1 Fictional Expired Administrator",
      status: UserStatus.ACTIVE,
    },
  });
  const inactiveAdmin = await prisma.user.create({
    data: {
      email: fixtureEmails.inactiveAdmin,
      fullName: "B1 Fictional Inactive Administrator",
      status: UserStatus.ACTIVE,
    },
  });

  await prisma.userRoleAssignment.createMany({
    data: [
      {
        assignedById: admin.id,
        roleId: adminRole.id,
        userId: admin.id,
      },
      {
        assignedById: admin.id,
        roleId: participantRole.id,
        userId: learner.id,
      },
      {
        assignedById: admin.id,
        expiresAt: new Date(Date.now() - 60_000),
        roleId: adminRole.id,
        userId: expiredAdmin.id,
      },
      {
        assignedById: admin.id,
        isActive: false,
        roleId: adminRole.id,
        userId: inactiveAdmin.id,
      },
    ],
  });

  const [activeOrganization, inactiveOrganization, cohort] = await Promise.all([
    prisma.organization.create({
      data: {
        name: organizationNames.active,
        status: OrganizationStatus.ACTIVE,
      },
    }),
    prisma.organization.create({
      data: {
        name: organizationNames.inactive,
        status: OrganizationStatus.INACTIVE,
      },
    }),
    prisma.cohort.create({
      data: {
        name: cohortName,
        status: OrganizationStatus.ACTIVE,
      },
    }),
  ]);

  const course = await prisma.course.create({
    data: {
      assignedCreatorId: admin.id,
      createdById: admin.id,
      shortDescription: "A fictional restricted course used only for B1 lifecycle verification.",
      slug: courseSlug,
      status: CourseStatus.PUBLISHED,
      title: "B1 Fictional Restricted Course",
      visibility: CourseVisibility.ASSIGNED_ONLY,
    },
  });
  const courseVersion = await prisma.courseVersion.create({
    data: {
      courseId: course.id,
      createdById: admin.id,
      status: CourseStatus.PUBLISHED,
      versionNumber: 1,
    },
  });

  const adminSession = sessionFor(admin);
  const input = {
    cohortId: cohort.id,
    courseId: course.id,
    courseVersionId: courseVersion.id,
    invitedEmail: `  ${fixtureEmails.invited.toUpperCase()}  `,
    invitedName: "B1 Fictional Invited Learner",
    invitedRoleOrPosition: "Programme Officer",
    organizationId: activeOrganization.id,
    session: adminSession,
  };
  const organizationCountBefore = await prisma.organization.count();
  const assignmentCountBefore = await prisma.courseAssignment.count({
    where: { courseId: course.id },
  });
  const enrollmentCountBefore = await prisma.enrollment.count({
    where: { courseId: course.id },
  });

  const created = await createDraftCourseInvitation(input);
  assert(created.success);
  assert(created.plaintextToken);
  assert.equal(created.invitation.status, CourseInvitationStatus.DRAFT);

  const stored = await prisma.courseInvitation.findUniqueOrThrow({
    where: { id: created.invitation.id },
  });
  assert.equal(stored.invitedEmail, fixtureEmails.invited);
  assert.equal(stored.organizationId, activeOrganization.id);
  assert.equal(stored.courseId, course.id);
  assert.equal(stored.courseVersionId, courseVersion.id);
  assert.equal(stored.cohortId, cohort.id);
  assert.equal(stored.tokenHash, hashCourseInvitationToken(created.plaintextToken));
  assert.notEqual(stored.tokenHash, created.plaintextToken);
  assert.equal(stored.activationCodeHash, null);
  assert.equal(JSON.stringify(stored).includes(created.plaintextToken), false);

  const duplicate = await createDraftCourseInvitation(input);
  assert.deepEqual(duplicate, {
    code: "duplicate-active-invitation",
    success: false,
  });

  for (const session of [
    sessionFor(learner),
    sessionFor(expiredAdmin),
    sessionFor(inactiveAdmin),
    { ...adminSession, email: fixtureEmails.learner },
  ]) {
    const denied = await createDraftCourseInvitation({
      ...input,
      invitedEmail: `${randomUUID()}@${fictionalDomain}`,
      session,
    });
    assert.deepEqual(denied, { code: "unauthorized", success: false });
  }

  const inactiveOrganizationResult = await createDraftCourseInvitation({
    ...input,
    invitedEmail: `${randomUUID()}@${fictionalDomain}`,
    organizationId: inactiveOrganization.id,
  });
  assert.deepEqual(inactiveOrganizationResult, {
    code: "inactive-organization",
    success: false,
  });

  const unknownOrganizationResult = await createDraftCourseInvitation({
    ...input,
    invitedEmail: `${randomUUID()}@${fictionalDomain}`,
    organizationId: "missing-organization",
  });
  assert.deepEqual(unknownOrganizationResult, {
    code: "unknown-organization",
    success: false,
  });

  const unknownCourseResult = await createDraftCourseInvitation({
    ...input,
    courseId: "missing-course",
    courseVersionId: null,
    invitedEmail: `${randomUUID()}@${fictionalDomain}`,
  });
  assert.deepEqual(unknownCourseResult, {
    code: "unknown-course",
    success: false,
  });

  const unknownVersionResult = await createDraftCourseInvitation({
    ...input,
    courseVersionId: "missing-version",
    invitedEmail: `${randomUUID()}@${fictionalDomain}`,
  });
  assert.deepEqual(unknownVersionResult, {
    code: "unknown-course-version",
    success: false,
  });

  const sent = await markCourseInvitationSent({
    invitationId: created.invitation.id,
    session: adminSession,
  });
  assert(sent.success);
  assert.equal(sent.invitation.status, CourseInvitationStatus.SENT);

  const invalidToken = await resolveCourseInvitationToken("not-a-valid-token");
  assert.deepEqual(invalidToken, { code: "invalid-token", success: false });

  const resolved = await resolveCourseInvitationToken(created.plaintextToken);
  assert(resolved.success);
  assert.equal(resolved.context.id, created.invitation.id);
  assert.equal(resolved.context.invitedEmail, fixtureEmails.invited);
  assert.equal(resolved.context.course.id, course.id);
  assert.equal(resolved.context.organization.id, activeOrganization.id);
  assert.equal("tokenHash" in resolved.context, false);
  assert.equal("activationCodeHash" in resolved.context, false);

  const invalidTransition = await markCourseInvitationSent({
    invitationId: created.invitation.id,
    session: adminSession,
  });
  assert.deepEqual(invalidTransition, {
    code: "invalid-transition",
    success: false,
  });

  const resent = await prepareCourseInvitationResend({
    invitationId: created.invitation.id,
    session: adminSession,
  });
  assert(resent.success);
  assert(resent.plaintextToken);
  assert.notEqual(resent.plaintextToken, created.plaintextToken);
  assert.equal(
    (await resolveCourseInvitationToken(created.plaintextToken)).success,
    false,
  );
  assert.deepEqual(
    await resolveCourseInvitationToken(resent.plaintextToken),
    { code: "not-sent", success: false },
  );
  assert(
    (
      await markCourseInvitationSent({
        invitationId: created.invitation.id,
        session: adminSession,
      })
    ).success,
  );
  assert((await resolveCourseInvitationToken(resent.plaintextToken)).success);

  const cancelled = await cancelCourseInvitation({
    invitationId: created.invitation.id,
    session: adminSession,
  });
  assert(cancelled.success);
  assert.equal(
    (await prisma.courseInvitation.findUniqueOrThrow({
      where: { id: created.invitation.id },
    })).status,
    CourseInvitationStatus.CANCELLED,
  );
  assert.deepEqual(
    await resolveCourseInvitationToken(resent.plaintextToken),
    { code: "cancelled", success: false },
  );

  const replacement = await createDraftCourseInvitation({
    ...input,
    expiresAt: new Date(Date.now() + 60_000),
  });
  assert(replacement.success);
  assert(replacement.plaintextToken);
  assert(
    (
      await markCourseInvitationSent({
        invitationId: replacement.invitation.id,
        session: adminSession,
      })
    ).success,
  );
  assert.deepEqual(
    await resolveCourseInvitationToken(
      replacement.plaintextToken,
      new Date(Date.now() + 120_000),
    ),
    { code: "expired", success: false },
  );

  const expired = await expireCourseInvitation({
    invitationId: replacement.invitation.id,
    now: new Date(Date.now() + 120_000),
    session: adminSession,
  });
  assert(expired.success);
  assert.equal(expired.invitation.status, CourseInvitationStatus.EXPIRED);
  assert(
    (
      await expireCourseInvitation({
        invitationId: replacement.invitation.id,
        now: new Date(Date.now() + 180_000),
        session: adminSession,
      })
    ).success,
  );
  assert.equal(
    (await prisma.courseInvitation.findUniqueOrThrow({
      where: { id: replacement.invitation.id },
    })).status,
    CourseInvitationStatus.EXPIRED,
  );

  const afterExpiry = await createDraftCourseInvitation(input);
  assert(afterExpiry.success);
  const failed = await markCourseInvitationFailed({
    invitationId: afterExpiry.invitation.id,
    session: adminSession,
  });
  assert(failed.success);
  const failedRetry = await prepareCourseInvitationResend({
    invitationId: afterExpiry.invitation.id,
    session: adminSession,
  });
  assert(failedRetry.success);

  assert.equal(
    canTransitionCourseInvitation(
      CourseInvitationStatus.ACTIVATED,
      CourseInvitationStatus.PENDING,
    ),
    false,
  );
  assert.equal(
    canTransitionCourseInvitation(
      CourseInvitationStatus.EXPIRED,
      CourseInvitationStatus.SENT,
    ),
    false,
  );
  assert.equal(
    canTransitionCourseInvitation(
      CourseInvitationStatus.CANCELLED,
      CourseInvitationStatus.PENDING,
    ),
    false,
  );

  const audits = await prisma.auditLog.findMany({
    where: {
      entityId: {
        in: [
          created.invitation.id,
          replacement.invitation.id,
          afterExpiry.invitation.id,
        ],
      },
      entityType: "CourseInvitation",
    },
  });
  const auditActions = new Set(audits.map((entry) => entry.actionType));
  for (const action of [
    AuditActionType.COURSE_INVITATION_CREATED,
    AuditActionType.COURSE_INVITATION_SENT,
    AuditActionType.COURSE_INVITATION_RESENT,
    AuditActionType.COURSE_INVITATION_CANCELLED,
    AuditActionType.COURSE_INVITATION_EXPIRED,
    AuditActionType.COURSE_INVITATION_FAILED,
  ]) {
    assert(auditActions.has(action), `Expected audit action ${action}.`);
  }
  const auditText = JSON.stringify(audits);
  for (const sensitiveValue of [
    created.plaintextToken,
    resent.plaintextToken,
    replacement.plaintextToken,
    fixtureEmails.invited,
  ]) {
    assert.equal(auditText.includes(sensitiveValue), false);
  }

  assert.equal(await prisma.organization.count(), organizationCountBefore);
  assert.equal(
    await prisma.courseAssignment.count({ where: { courseId: course.id } }),
    assignmentCountBefore,
  );
  assert.equal(
    await prisma.enrollment.count({ where: { courseId: course.id } }),
    enrollmentCountBefore,
  );

  console.log("Course invitation lifecycle verification passed.");
} finally {
  await cleanup();
  await prisma.$disconnect();
}
