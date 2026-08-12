import "dotenv/config";

import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import {
  CourseStatus,
  CourseVisibility,
  RoleKey,
} from "../src/generated/prisma/client";
import type { AuthSession } from "../src/lib/auth/session-codec";
import { getAdminCourseInvitationOptions } from "../src/lib/admin-course-invitation-workflow";
import {
  HRBA_EXTERNAL_COURSE_ID,
  HRBA_EXTERNAL_COURSE_SLUG,
  HRBA_EXTERNAL_COURSE_VERSION_ID,
  PM_EXTERNAL_COURSE_ID,
  PM_EXTERNAL_COURSE_SLUG,
  PM_EXTERNAL_COURSE_TITLE,
  PM_EXTERNAL_COURSE_VERSION_ID,
} from "../src/lib/external-course-config";
import { prisma } from "../src/lib/prisma";

const session: AuthSession = {
  email: "step13-admin@example.test",
  issuedAt: new Date().toISOString(),
  name: "Step 13 Admin",
  roles: [RoleKey.PLATFORM_ADMIN],
  userId: "step13-admin",
};

const hrba = {
  id: HRBA_EXTERNAL_COURSE_ID,
  title: "Applying the Human Rights-Based Approach in CSO Practice",
  versions: [{ id: HRBA_EXTERNAL_COURSE_VERSION_ID, versionNumber: 1 }],
};
const pm = {
  id: PM_EXTERNAL_COURSE_ID,
  title: PM_EXTERNAL_COURSE_TITLE,
  versions: [{ id: PM_EXTERNAL_COURSE_VERSION_ID, versionNumber: 1 }],
};

type Restore = () => void;
const restores: Restore[] = [];

function stub(target: object, key: string, replacement: unknown) {
  const original = Reflect.get(target, key);
  Reflect.set(target, key, replacement);
  restores.push(() => Reflect.set(target, key, original));
}

const courseQueries: Array<Record<string, unknown>> = [];

try {
  stub(prisma.user, "findFirst", async () => ({ id: session.userId }));
  stub(prisma.organization, "findMany", async () => []);
  stub(prisma.cohort, "findMany", async () => []);
  stub(prisma.course, "findMany", async (query: Record<string, unknown>) => {
    courseQueries.push(query);
    return [hrba, pm];
  });

  const options = await getAdminCourseInvitationOptions(session);
  const courseQuery = courseQueries[0];
  assert(courseQuery, "The invitation options did not query eligible courses.");

  assert.deepEqual(
    options.courses.map((course) => ({
      id: course.id,
      title: course.title,
      versionId: course.versions[0]?.id,
    })),
    [
      {
        id: HRBA_EXTERNAL_COURSE_ID,
        title: hrba.title,
        versionId: HRBA_EXTERNAL_COURSE_VERSION_ID,
      },
      {
        id: PM_EXTERNAL_COURSE_ID,
        title: PM_EXTERNAL_COURSE_TITLE,
        versionId: PM_EXTERNAL_COURSE_VERSION_ID,
      },
    ],
    "The generic invitation options did not preserve the HRBA and PM identities.",
  );

  assert.deepEqual(
    courseQuery.where,
    {
      archivedAt: null,
      status: CourseStatus.PUBLISHED,
      visibility: CourseVisibility.ASSIGNED_ONLY,
      versions: {
        some: { archivedAt: null, status: CourseStatus.PUBLISHED },
      },
    },
    "Invitation eligibility no longer excludes archived, draft, unpublished, or non-assigned-only courses.",
  );
  assert.deepEqual(
    (courseQuery.select as { versions?: { where?: unknown } } | undefined)?.versions?.where,
    { archivedAt: null, status: CourseStatus.PUBLISHED },
    "The dropdown no longer selects only active published course versions.",
  );

  const [registrationSource, formSource, invitationSource, activationSource] =
    await Promise.all([
      readFile("src/lib/external-course-workflow.ts", "utf8"),
      readFile("src/components/admin/CourseInvitationActions.tsx", "utf8"),
      readFile("src/lib/course-invitation-workflow.ts", "utf8"),
      readFile("src/app/api/course-invitations/activate/route.ts", "utf8"),
    ]);
  const registrationStart = registrationSource.indexOf(
    "export async function registerPmExternalCourse()",
  );
  const registrationEnd = registrationSource.indexOf(
    "export function resolveExternalCourseResumeScreenId",
    registrationStart,
  );
  const pmRegistration = registrationSource.slice(
    registrationStart,
    registrationEnd,
  );

  assert(registrationStart >= 0 && registrationEnd > registrationStart);
  assert.match(
    pmRegistration,
    /courseVersion\.upsert\([\s\S]*?update:\s*{\s*archivedAt:\s*null,[\s\S]*?status:\s*CourseStatus\.PUBLISHED/,
    "PM registration does not reactivate its published course version.",
  );
  assert(!formSource.includes("Invite one learner to HRBA"));
  assert(formSource.includes("Invite one learner to a course"));
  assert(formSource.includes('<option key={course.id} value={course.id}>'));
  assert(formSource.includes('<input name="courseVersionId" type="hidden"'));
  assert(invitationSource.includes("createManagedCourseInvitation"));
  assert(invitationSource.includes("CourseVisibility.ASSIGNED_ONLY"));
  assert(invitationSource.includes("courseAssignment.create"));
  assert(activationSource.includes("activateCourseInvitation"));

  assert.equal(HRBA_EXTERNAL_COURSE_SLUG, "applying-human-rights-based-approach-in-cso-practice");
  assert.equal(PM_EXTERNAL_COURSE_SLUG, "project-management-local-grassroots-csos");

  console.log(
    JSON.stringify(
      {
        eligibleCourseIds: options.courses.map((course) => course.id),
        eligibility: "published + assigned-only + unarchived published version",
        hrbaPreserved: true,
        invitationWorkflowReused: true,
        pmCourseId: PM_EXTERNAL_COURSE_ID,
        pmCourseSlug: PM_EXTERNAL_COURSE_SLUG,
        pmCourseTitle: PM_EXTERNAL_COURSE_TITLE,
        pmCourseVersionId: PM_EXTERNAL_COURSE_VERSION_ID,
      },
      null,
      2,
    ),
  );
} finally {
  restores.reverse().forEach((restore) => restore());
  await prisma.$disconnect();
}
