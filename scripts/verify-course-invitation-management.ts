import "dotenv/config";

import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
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
  createAdminCourseInvitation,
  getAdminCourseInvitationDetail,
  getAdminCourseInvitationList,
  getAdminCourseInvitationOptions,
  prepareAdminCourseInvitationLink,
} from "../src/lib/admin-course-invitation-workflow";
import {
  activateCourseInvitation,
  cancelCourseInvitation,
  createManagedCourseInvitation,
  hashCourseInvitationToken,
  markManagedCourseInvitationSent,
  prepareManagedCourseInvitationResend,
  resolveCourseInvitationAcceptance,
  resolveCourseInvitationToken,
} from "../src/lib/course-invitation-workflow";
import { prisma } from "../src/lib/prisma";

const suffix = randomUUID();
const prefix = `b3-${suffix}`;
const fictionalDomain = ["example", "test"].join(".");
const email = (name: string) => `${prefix}-${name}@${fictionalDomain}`;
const organizationName = (name: string) => `B3 ${name} fictional organization ${suffix}`;
const cohortName = (name: string) => `B3 ${name} fictional cohort ${suffix}`;
const courseSlug = (name: string) => `${prefix}-${name}`;
const originalAppUrl = process.env.NEXT_PUBLIC_APP_URL;
process.env.NEXT_PUBLIC_APP_URL = "https://preview.example.test";

function sessionFor(user: { email: string; fullName: string; id: string }): AuthSession {
  return {
    email: user.email,
    issuedAt: new Date().toISOString(),
    name: user.fullName,
    roles: [],
    userId: user.id,
  };
}

async function expectDenied(operation: () => Promise<unknown>) {
  await assert.rejects(operation, /course-invitation-management-unavailable/);
}

async function cleanup() {
  const users = await prisma.user.findMany({
    select: { id: true },
    where: { email: { startsWith: `${prefix}-` } },
  });
  const organizations = await prisma.organization.findMany({
    select: { id: true },
    where: { name: { startsWith: "B3", contains: suffix } },
  });
  const courses = await prisma.course.findMany({
    select: { id: true },
    where: { slug: { startsWith: prefix } },
  });
  const cohorts = await prisma.cohort.findMany({
    select: { id: true },
    where: { name: { startsWith: "B3", contains: suffix } },
  });
  const userIds = users.map((record) => record.id);
  const organizationIds = organizations.map((record) => record.id);
  const courseIds = courses.map((record) => record.id);
  const cohortIds = cohorts.map((record) => record.id);

  await prisma.courseInvitation.deleteMany({
    where: {
      OR: [
        { invitedEmail: { startsWith: `${prefix}-` } },
        { invitedByUserId: { in: userIds } },
        { courseId: { in: courseIds } },
      ],
    },
  });
  await prisma.auditLog.deleteMany({
    where: { OR: [{ actorUserId: { in: userIds } }, { entityId: { in: courseIds } }] },
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
    where: { OR: [{ courseId: { in: courseIds } }, { userId: { in: userIds } }] },
  });
  await prisma.userRoleAssignment.deleteMany({
    where: { OR: [{ assignedById: { in: userIds } }, { userId: { in: userIds } }] },
  });
  await prisma.cohortOrganization.deleteMany({
    where: { OR: [{ cohortId: { in: cohortIds } }, { organizationId: { in: organizationIds } }] },
  });
  await prisma.course.deleteMany({ where: { id: { in: courseIds } } });
  await prisma.cohort.deleteMany({ where: { id: { in: cohortIds } } });
  await prisma.organization.deleteMany({ where: { id: { in: organizationIds } } });
  await prisma.user.deleteMany({ where: { id: { in: userIds } } });
}

async function main() {
try {
  await cleanup();

  const roleKeys = [
    RoleKey.PLATFORM_ADMIN,
    RoleKey.SUPER_ADMIN,
    RoleKey.PARTICIPANT,
    RoleKey.CSO_FOCAL_PERSON,
  ];
  const roles = new Map(
    await Promise.all(
      roleKeys.map(async (key) => {
        const role = await prisma.role.upsert({
          create: { key, name: key.replaceAll("_", " ") },
          update: {},
          where: { key },
        });
        return [key, role] as const;
      }),
    ),
  );

  const users = {
    admin: await prisma.user.create({ data: { email: email("admin"), fullName: "B3 Fictional Platform Admin" } }),
    superAdmin: await prisma.user.create({ data: { email: email("super"), fullName: "B3 Fictional Super Admin" } }),
    participant: await prisma.user.create({ data: { email: email("participant"), fullName: "B3 Fictional Participant" } }),
    orgAdmin: await prisma.user.create({ data: { email: email("org-admin"), fullName: "B3 Fictional Organization Admin" } }),
    expiredAdmin: await prisma.user.create({ data: { email: email("expired-admin"), fullName: "B3 Fictional Expired Admin" } }),
    inactiveAdmin: await prisma.user.create({ data: { email: email("inactive-admin"), fullName: "B3 Fictional Inactive Admin", status: UserStatus.SUSPENDED } }),
  };

  await prisma.userRoleAssignment.createMany({
    data: [
      { assignedById: users.admin.id, roleId: roles.get(RoleKey.PLATFORM_ADMIN)!.id, userId: users.admin.id },
      { assignedById: users.admin.id, roleId: roles.get(RoleKey.SUPER_ADMIN)!.id, userId: users.superAdmin.id },
      { assignedById: users.admin.id, roleId: roles.get(RoleKey.PARTICIPANT)!.id, userId: users.participant.id },
      { assignedById: users.admin.id, roleId: roles.get(RoleKey.CSO_FOCAL_PERSON)!.id, userId: users.orgAdmin.id },
      { assignedById: users.admin.id, expiresAt: new Date(Date.now() - 60_000), roleId: roles.get(RoleKey.PLATFORM_ADMIN)!.id, userId: users.expiredAdmin.id },
      { assignedById: users.admin.id, roleId: roles.get(RoleKey.PLATFORM_ADMIN)!.id, userId: users.inactiveAdmin.id },
    ],
  });

  const organizations = {
    active: await prisma.organization.create({ data: { name: organizationName("active"), status: OrganizationStatus.ACTIVE } }),
    other: await prisma.organization.create({ data: { name: organizationName("other"), status: OrganizationStatus.ACTIVE } }),
    inactive: await prisma.organization.create({ data: { name: organizationName("inactive"), status: OrganizationStatus.INACTIVE } }),
  };
  const cohorts = {
    active: await prisma.cohort.create({ data: { name: cohortName("active"), status: OrganizationStatus.ACTIVE } }),
    foreign: await prisma.cohort.create({ data: { name: cohortName("foreign"), status: OrganizationStatus.ACTIVE } }),
    inactive: await prisma.cohort.create({ data: { name: cohortName("inactive"), status: OrganizationStatus.INACTIVE } }),
  };
  await prisma.cohortOrganization.createMany({
    data: [
      { cohortId: cohorts.active.id, organizationId: organizations.active.id },
      { cohortId: cohorts.foreign.id, organizationId: organizations.other.id },
      { cohortId: cohorts.inactive.id, organizationId: organizations.active.id },
    ],
  });

  const courses = {
    eligible: await prisma.course.create({
      data: {
        assignedCreatorId: users.admin.id,
        createdById: users.admin.id,
        shortDescription: "Fictional assigned-only course.",
        slug: courseSlug("eligible"),
        status: CourseStatus.PUBLISHED,
        title: "B3 Fictional Eligible Course",
        visibility: CourseVisibility.ASSIGNED_ONLY,
      },
    }),
    draft: await prisma.course.create({
      data: {
        assignedCreatorId: users.admin.id,
        createdById: users.admin.id,
        shortDescription: "Fictional draft course.",
        slug: courseSlug("draft"),
        status: CourseStatus.DRAFT,
        title: "B3 Fictional Draft Course",
        visibility: CourseVisibility.ASSIGNED_ONLY,
      },
    }),
    other: await prisma.course.create({
      data: {
        assignedCreatorId: users.admin.id,
        createdById: users.admin.id,
        shortDescription: "Fictional other course.",
        slug: courseSlug("other"),
        status: CourseStatus.PUBLISHED,
        title: "B3 Fictional Other Course",
        visibility: CourseVisibility.ASSIGNED_ONLY,
      },
    }),
  };
  const versions = {
    eligible: await prisma.courseVersion.create({ data: { courseId: courses.eligible.id, createdById: users.admin.id, publishedAt: new Date(), publishedById: users.admin.id, status: CourseStatus.PUBLISHED, versionNumber: 1 } }),
    draft: await prisma.courseVersion.create({ data: { courseId: courses.draft.id, createdById: users.admin.id, status: CourseStatus.DRAFT, versionNumber: 1 } }),
    other: await prisma.courseVersion.create({ data: { courseId: courses.other.id, createdById: users.admin.id, publishedAt: new Date(), publishedById: users.admin.id, status: CourseStatus.PUBLISHED, versionNumber: 1 } }),
  };

  const adminSession = sessionFor(users.admin);
  const superSession = sessionFor(users.superAdmin);
  const participantSession = sessionFor(users.participant);
  const options = await getAdminCourseInvitationOptions(adminSession);
  assert(options.organizations.some((record) => record.id === organizations.active.id));
  assert(!options.organizations.some((record) => record.id === organizations.inactive.id));
  assert(options.courses.some((record) => record.id === courses.eligible.id));
  assert(!options.courses.some((record) => record.id === courses.draft.id));
  await getAdminCourseInvitationOptions(superSession);
  await expectDenied(() => getAdminCourseInvitationOptions(participantSession));
  await expectDenied(() => getAdminCourseInvitationOptions(sessionFor(users.orgAdmin)));
  await expectDenied(() => getAdminCourseInvitationOptions(sessionFor(users.expiredAdmin)));
  await expectDenied(() => getAdminCourseInvitationOptions(sessionFor(users.inactiveAdmin)));
  await expectDenied(() => getAdminCourseInvitationOptions(null));

  const baseInput = (invitedEmail: string) => ({
    cohortId: cohorts.active.id,
    courseId: courses.eligible.id,
    courseVersionId: versions.eligible.id,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    invitedEmail,
    invitedName: "B3 Fictional Invited Learner",
    organizationId: organizations.active.id,
    session: adminSession,
  });

  const prepared = await createAdminCourseInvitation(baseInput(email("activate")));
  assert(prepared.success, prepared.success ? undefined : prepared.code);
  assert.equal(prepared.invitation.status, CourseInvitationStatus.DRAFT);
  const preparedUrl = new URL(prepared.deliveryUrl);
  assert.equal(preparedUrl.origin, "https://preview.example.test");
  const activationToken = preparedUrl.searchParams.get("token");
  assert(activationToken);
  assert.equal(preparedUrl.searchParams.size, 1);
  const stored = await prisma.courseInvitation.findUniqueOrThrow({ where: { id: prepared.invitation.id } });
  assert.equal(stored.tokenHash, hashCourseInvitationToken(activationToken));
  assert(!JSON.stringify(stored).includes(activationToken));
  assert(!JSON.stringify(stored).includes(prepared.deliveryUrl));
  assert.deepEqual(await resolveCourseInvitationToken(activationToken), { code: "not-sent", success: false });
  const createdAudit = await prisma.auditLog.findFirstOrThrow({ where: { actionType: AuditActionType.COURSE_INVITATION_CREATED, entityId: stored.id } });
  assert(!JSON.stringify(createdAudit).includes(activationToken));
  assert(!JSON.stringify(createdAudit).includes(stored.invitedEmail));

  const list = await getAdminCourseInvitationList(adminSession, { query: email("activate") });
  assert.equal(list.total, 1);
  assert.equal(list.records[0].id, stored.id);
  const detail = await getAdminCourseInvitationDetail(stored.id, superSession);
  assert(detail);
  assert.equal(detail.history.length, 1);

  const unauthorizedCreate = await createManagedCourseInvitation({ ...baseInput(email("unauthorized")), session: participantSession });
  assert.equal(unauthorizedCreate.success, false);
  assert.equal(unauthorizedCreate.code, "unauthorized");
  const invalidCases = [
    ["bad-email", { invitedEmail: "not-an-email" }, "invalid-email"],
    ["unknown-org", { organizationId: randomUUID() }, "unknown-organization"],
    ["inactive-org", { organizationId: organizations.inactive.id, cohortId: null }, "inactive-organization"],
    ["draft-course", { courseId: courses.draft.id, courseVersionId: versions.draft.id, cohortId: null }, "invalid-course-state"],
    ["wrong-version", { courseVersionId: versions.other.id }, "unknown-course-version"],
    ["inactive-cohort", { cohortId: cohorts.inactive.id }, "inactive-cohort"],
    ["foreign-cohort", { cohortId: cohorts.foreign.id }, "unknown-cohort"],
  ] as const;
  for (const [name, overrides, code] of invalidCases) {
    const result = await createManagedCourseInvitation({ ...baseInput(email(name)), ...overrides });
    assert.equal(
      result.success,
      false,
      `${name}: ${result.success ? "unexpected-success" : result.code}`,
    );
    assert.equal(result.code, code);
  }

  const conflictUser = await prisma.user.create({ data: { email: email("conflict-user"), fullName: "B3 Fictional Conflict Learner", organizationId: organizations.other.id } });
  const inactiveUser = await prisma.user.create({ data: { email: email("inactive-user"), fullName: "B3 Fictional Inactive Learner", status: UserStatus.SUSPENDED } });
  const elevatedUser = await prisma.user.create({ data: { email: email("elevated-user"), fullName: "B3 Fictional Elevated User" } });
  const ineligibleUser = await prisma.user.create({ data: { email: email("ineligible-user"), fullName: "B3 Fictional Ineligible User" } });
  const assignedUser = await prisma.user.create({ data: { email: email("assigned-user"), fullName: "B3 Fictional Assigned Learner", organizationId: organizations.active.id } });
  const conflictingAssignmentUser = await prisma.user.create({ data: { email: email("conflicting-assignment-user"), fullName: "B3 Fictional Conflicting Assignment Learner", organizationId: organizations.active.id } });
  await prisma.userRoleAssignment.createMany({ data: [
    { assignedById: users.admin.id, roleId: roles.get(RoleKey.PARTICIPANT)!.id, userId: conflictUser.id },
    { assignedById: users.admin.id, roleId: roles.get(RoleKey.PARTICIPANT)!.id, userId: inactiveUser.id },
    { assignedById: users.admin.id, roleId: roles.get(RoleKey.PLATFORM_ADMIN)!.id, userId: elevatedUser.id },
    { assignedById: users.admin.id, roleId: roles.get(RoleKey.CSO_FOCAL_PERSON)!.id, userId: ineligibleUser.id },
    { assignedById: users.admin.id, roleId: roles.get(RoleKey.PARTICIPANT)!.id, userId: assignedUser.id },
    { assignedById: users.admin.id, roleId: roles.get(RoleKey.PARTICIPANT)!.id, userId: conflictingAssignmentUser.id },
  ] });
  await prisma.courseAssignment.create({ data: { assignedById: users.admin.id, assignmentType: "USER", courseId: courses.eligible.id, courseVersionId: versions.eligible.id, targetUserId: assignedUser.id } });
  await prisma.courseAssignment.create({ data: { assignedById: users.admin.id, assignmentType: "USER", courseId: courses.eligible.id, courseVersionId: versions.other.id, targetUserId: conflictingAssignmentUser.id } });
  for (const [targetEmail, code] of [
    [conflictUser.email, "conflicting-organization"],
    [inactiveUser.email, "inactive-user"],
    [elevatedUser.email, "elevated-user"],
    [ineligibleUser.email, "ineligible-user"],
    [assignedUser.email, "already-assigned"],
    [conflictingAssignmentUser.email, "conflicting-assignment"],
  ] as const) {
    const result = await createManagedCourseInvitation(baseInput(targetEmail));
    assert.equal(
      result.success,
      false,
      `${targetEmail}: ${result.success ? "unexpected-success" : result.code}`,
    );
    assert.equal(result.code, code);
  }

  const duplicateEmail = email("duplicate");
  const duplicateResults = await Promise.all([
    createManagedCourseInvitation(baseInput(duplicateEmail)),
    createManagedCourseInvitation(baseInput(duplicateEmail)),
  ]);
  assert.equal(duplicateResults.filter((result) => result.success).length, 1);
  const duplicateFailure = duplicateResults.find((result) => !result.success);
  assert(duplicateFailure && duplicateFailure.code === "duplicate-active-invitation");
  assert.equal(await prisma.courseInvitation.count({ where: { courseId: courses.eligible.id, invitedEmail: duplicateEmail } }), 1);
  const duplicateInvitation = await prisma.courseInvitation.findFirstOrThrow({ where: { courseId: courses.eligible.id, invitedEmail: duplicateEmail } });
  assert.equal(await prisma.auditLog.count({ where: { actionType: AuditActionType.COURSE_INVITATION_CREATED, entityId: duplicateInvitation.id } }), 1);

  const markedSent = await markManagedCourseInvitationSent({ invitationId: stored.id, session: adminSession });
  assert(markedSent.success);
  const unauthenticatedResolution = await resolveCourseInvitationAcceptance({ plaintextToken: activationToken, session: null });
  assert(
    unauthenticatedResolution.success &&
      unauthenticatedResolution.state === "available" &&
      unauthenticatedResolution.authentication === "required",
  );

  const activationLearner = await prisma.user.create({ data: { email: email("activate"), fullName: "B3 Fictional Activation Learner" } });
  const mismatchLearner = await prisma.user.create({ data: { email: email("mismatch"), fullName: "B3 Fictional Mismatch Learner" } });
  await prisma.userRoleAssignment.createMany({ data: [
    { assignedById: users.admin.id, roleId: roles.get(RoleKey.PARTICIPANT)!.id, userId: activationLearner.id },
    { assignedById: users.admin.id, roleId: roles.get(RoleKey.PARTICIPANT)!.id, userId: mismatchLearner.id },
  ] });
  const matchingSession = sessionFor(activationLearner);
  const matchingResolution = await resolveCourseInvitationAcceptance({ plaintextToken: activationToken, session: matchingSession });
  assert(
    matchingResolution.success &&
      matchingResolution.state === "available" &&
      matchingResolution.authentication === "matching",
  );
  const mismatchResolution = await resolveCourseInvitationAcceptance({ plaintextToken: activationToken, session: sessionFor(mismatchLearner) });
  assert(
    mismatchResolution.success &&
      mismatchResolution.state === "available" &&
      mismatchResolution.authentication === "mismatch",
  );
  const mismatchActivation = await activateCourseInvitation({ plaintextToken: activationToken, session: sessionFor(mismatchLearner) });
  assert.equal(mismatchActivation.success, false);
  const activated = await activateCourseInvitation({ plaintextToken: activationToken, session: matchingSession });
  assert(activated.success && activated.code === "activated");
  assert.equal(activated.access.courseSlug, courses.eligible.slug);
  const replay = await activateCourseInvitation({ plaintextToken: activationToken, session: matchingSession });
  assert(replay.success && replay.code === "already-activated");
  const assignment = await prisma.courseAssignment.findUniqueOrThrow({ where: { courseId_targetUserId: { courseId: courses.eligible.id, targetUserId: activationLearner.id } } });
  assert.equal(assignment.assignmentType, "USER");
  assert.equal(assignment.courseVersionId, versions.eligible.id);
  assert.equal(assignment.targetOrganizationId, null);
  assert.equal(assignment.targetCohortId, null);
  const activatedResolution = await resolveCourseInvitationAcceptance({ plaintextToken: activationToken, session: matchingSession });
  assert(activatedResolution.success && activatedResolution.state === "already-activated");
  assert.equal((await cancelCourseInvitation({ invitationId: stored.id, session: adminSession })).success, false);
  assert.equal((await prepareManagedCourseInvitationResend({ invitationId: stored.id, session: adminSession })).success, false);

  const resendPrepared = await createAdminCourseInvitation(baseInput(email("resend")));
  assert(resendPrepared.success);
  const oldToken = new URL(resendPrepared.deliveryUrl).searchParams.get("token");
  assert(oldToken);
  assert((await markManagedCourseInvitationSent({ invitationId: resendPrepared.invitation.id, session: adminSession })).success);
  const resent = await prepareAdminCourseInvitationLink({ expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), invitationId: resendPrepared.invitation.id, session: adminSession });
  assert(resent.success);
  const newToken = new URL(resent.deliveryUrl).searchParams.get("token");
  assert(newToken && newToken !== oldToken);
  assert.deepEqual(await resolveCourseInvitationToken(oldToken), { code: "invalid-token", success: false });
  assert.deepEqual(await resolveCourseInvitationToken(newToken), { code: "not-sent", success: false });
  assert((await markManagedCourseInvitationSent({ invitationId: resent.invitation.id, session: adminSession })).success);
  assert((await resolveCourseInvitationToken(newToken)).success);
  assert.equal(await prisma.courseInvitation.count({ where: { id: resent.invitation.id } }), 1);

  const cancelPrepared = await createAdminCourseInvitation(baseInput(email("cancel")));
  assert(cancelPrepared.success);
  const cancelToken = new URL(cancelPrepared.deliveryUrl).searchParams.get("token");
  assert(cancelToken);
  assert((await cancelCourseInvitation({ invitationId: cancelPrepared.invitation.id, session: adminSession })).success);
  assert.deepEqual(await resolveCourseInvitationToken(cancelToken), { code: "cancelled", success: false });
  assert.deepEqual(await resolveCourseInvitationAcceptance({ plaintextToken: cancelToken, session: null }), { state: "cancelled", success: false });
  const cancelledResend = await prepareManagedCourseInvitationResend({ invitationId: cancelPrepared.invitation.id, session: adminSession });
  assert.equal(cancelledResend.success, false);
  assert.equal(cancelledResend.code, "invalid-transition");
  const repeatedCancellation = await cancelCourseInvitation({ invitationId: cancelPrepared.invitation.id, session: adminSession });
  assert.equal(repeatedCancellation.success, false);
  assert.equal(repeatedCancellation.code, "invalid-transition");
  assert.equal(await prisma.auditLog.count({ where: { actionType: AuditActionType.COURSE_INVITATION_CANCELLED, entityId: cancelPrepared.invitation.id } }), 1);

  const stalePrepared = await createAdminCourseInvitation(baseInput(email("stale")));
  assert(stalePrepared.success);
  assert((await markManagedCourseInvitationSent({ invitationId: stalePrepared.invitation.id, session: adminSession })).success);
  await prisma.organization.update({ data: { status: OrganizationStatus.INACTIVE }, where: { id: organizations.active.id } });
  const staleResend = await prepareManagedCourseInvitationResend({ invitationId: stalePrepared.invitation.id, session: adminSession });
  assert.equal(staleResend.success, false);
  assert.equal(staleResend.code, "inactive-organization");
  await prisma.organization.update({ data: { status: OrganizationStatus.ACTIVE }, where: { id: organizations.active.id } });

  const staleCoursePrepared = await createAdminCourseInvitation(baseInput(email("stale-course")));
  assert(staleCoursePrepared.success);
  assert((await markManagedCourseInvitationSent({ invitationId: staleCoursePrepared.invitation.id, session: adminSession })).success);
  await prisma.course.update({ data: { status: CourseStatus.UNPUBLISHED }, where: { id: courses.eligible.id } });
  const staleCourseResend = await prepareManagedCourseInvitationResend({ invitationId: staleCoursePrepared.invitation.id, session: adminSession });
  assert.equal(staleCourseResend.success, false);
  assert.equal(staleCourseResend.code, "invalid-course-state");
  await prisma.course.update({ data: { status: CourseStatus.PUBLISHED }, where: { id: courses.eligible.id } });

  const staleVersionPrepared = await createAdminCourseInvitation(baseInput(email("stale-version")));
  assert(staleVersionPrepared.success);
  assert((await markManagedCourseInvitationSent({ invitationId: staleVersionPrepared.invitation.id, session: adminSession })).success);
  await prisma.courseVersion.update({ data: { status: CourseStatus.UNPUBLISHED }, where: { id: versions.eligible.id } });
  const staleVersionResend = await prepareManagedCourseInvitationResend({ invitationId: staleVersionPrepared.invitation.id, session: adminSession });
  assert.equal(staleVersionResend.success, false);
  assert.equal(staleVersionResend.code, "invalid-version-state");
  await prisma.courseVersion.update({ data: { status: CourseStatus.PUBLISHED }, where: { id: versions.eligible.id } });

  const staleCohortPrepared = await createAdminCourseInvitation(baseInput(email("stale-cohort")));
  assert(staleCohortPrepared.success);
  assert((await markManagedCourseInvitationSent({ invitationId: staleCohortPrepared.invitation.id, session: adminSession })).success);
  await prisma.cohort.update({ data: { status: OrganizationStatus.INACTIVE }, where: { id: cohorts.active.id } });
  const staleCohortResend = await prepareManagedCourseInvitationResend({ invitationId: staleCohortPrepared.invitation.id, session: adminSession });
  assert.equal(staleCohortResend.success, false);
  assert.equal(staleCohortResend.code, "inactive-cohort");
  await prisma.cohort.update({ data: { status: OrganizationStatus.ACTIVE }, where: { id: cohorts.active.id } });

  const assignedResendPrepared = await createAdminCourseInvitation(baseInput(email("assigned-after-send")));
  assert(assignedResendPrepared.success);
  assert((await markManagedCourseInvitationSent({ invitationId: assignedResendPrepared.invitation.id, session: adminSession })).success);
  const assignedAfterSend = await prisma.user.create({ data: { email: email("assigned-after-send"), fullName: "B3 Fictional Assigned After Send", organizationId: organizations.active.id } });
  await prisma.userRoleAssignment.create({ data: { assignedById: users.admin.id, roleId: roles.get(RoleKey.PARTICIPANT)!.id, userId: assignedAfterSend.id } });
  await prisma.courseAssignment.create({ data: { assignedById: users.admin.id, assignmentType: "USER", courseId: courses.eligible.id, courseVersionId: versions.eligible.id, targetUserId: assignedAfterSend.id } });
  const assignedResend = await prepareManagedCourseInvitationResend({ invitationId: assignedResendPrepared.invitation.id, session: adminSession });
  assert.equal(assignedResend.success, false);
  assert.equal(assignedResend.code, "already-assigned");

  const expiredPrepared = await createAdminCourseInvitation(baseInput(email("expired")));
  assert(expiredPrepared.success);
  const expiredToken = new URL(expiredPrepared.deliveryUrl).searchParams.get("token");
  assert(expiredToken);
  await prisma.courseInvitation.update({ data: { expiresAt: new Date(Date.now() - 60_000), status: CourseInvitationStatus.EXPIRED }, where: { id: expiredPrepared.invitation.id } });
  assert.deepEqual(await resolveCourseInvitationAcceptance({ plaintextToken: expiredToken, session: null }), { state: "expired", success: false });
  assert.deepEqual(await resolveCourseInvitationAcceptance({ plaintextToken: "fictional-invalid-token", session: null }), { state: "unavailable", success: false });

  const [acceptPage, acceptClient, nextConfig, adminUi] = await Promise.all([
    readFile("src/app/(public)/course-invitations/accept/page.tsx", "utf8"),
    readFile("src/components/public/CourseInvitationAcceptance.tsx", "utf8"),
    readFile("next.config.ts", "utf8"),
    readFile("src/components/admin/AdminCourseInvitations.tsx", "utf8"),
  ]);
  assert(acceptPage.includes('referrer: "no-referrer"'));
  assert(acceptPage.includes('dynamic = "force-dynamic"'));
  assert(!acceptPage.includes("activateCourseInvitation("));
  assert(acceptClient.includes('fetch("/api/course-invitations/activate"'));
  assert(acceptClient.includes("/sign-in?next="));
  assert(acceptClient.includes("/register?next="));
  assert(acceptClient.includes('state === "cancelled"'));
  assert(acceptClient.includes('state === "expired"'));
  assert(acceptClient.includes('state === "already-activated"'));
  assert(!acceptClient.includes("localStorage"));
  assert(nextConfig.includes('value: "private, no-store, max-age=0"'));
  assert(nextConfig.includes('value: "no-referrer"'));
  assert(!adminUi.includes("tokenHash"));
  assert(adminUi.includes("Manual delivery is the approved staging mode"));

  const activationAudits = await prisma.auditLog.count({ where: { actionType: AuditActionType.COURSE_INVITATION_ACTIVATED, entityId: stored.id } });
  assert.equal(activationAudits, 1);
  assert.equal(await prisma.courseAssignment.count({ where: { courseId: courses.eligible.id, targetUserId: activationLearner.id } }), 1);

  await cleanup();
  assert.equal(await prisma.user.count({ where: { email: { startsWith: `${prefix}-` } } }), 0);
  assert.equal(await prisma.organization.count({ where: { name: { startsWith: "B3", contains: suffix } } }), 0);
  assert.equal(await prisma.course.count({ where: { slug: { startsWith: prefix } } }), 0);
  assert.equal(await prisma.courseInvitation.count({ where: { invitedEmail: { startsWith: `${prefix}-` } } }), 0);

  console.log("Course invitation management verification passed.");
} finally {
  await cleanup();
  if (originalAppUrl === undefined) {
    delete process.env.NEXT_PUBLIC_APP_URL;
  } else {
    process.env.NEXT_PUBLIC_APP_URL = originalAppUrl;
  }
  await prisma.$disconnect();
}
}

void main();
