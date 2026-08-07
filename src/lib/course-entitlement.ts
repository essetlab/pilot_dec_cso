import { CourseVisibility } from "../generated/prisma/enums";
import { prisma } from "./prisma";
import { HRBA_EXTERNAL_COURSE_SLUG } from "./external-course-config";
import { isControlledHubAccess } from "./hub-access-policy";

type CourseEntitlementInput = {
  courseId: string;
  courseSlug: string;
  organizationId?: string | null;
  primaryCohortId?: string | null;
  userId: string;
  visibility: CourseVisibility;
};

export function isHrbaCourseSlug(slug: string) {
  return slug === HRBA_EXTERNAL_COURSE_SLUG;
}

export async function hasActiveIndividualCourseAssignment(
  userId: string,
  courseId: string,
) {
  const assignment = await prisma.courseAssignment.findFirst({
    select: { id: true },
    where: {
      assignmentType: "USER",
      courseId,
      isActive: true,
      targetUserId: userId,
    },
  });

  return Boolean(assignment);
}

export async function hasLearnerCourseEntitlement(input: CourseEntitlementInput) {
  if (input.visibility === CourseVisibility.PRIVATE) {
    return false;
  }

  // Controlled pilot access and HRBA both remain fail-closed even when a course
  // is publicly visible in the catalogue.
  if (isControlledHubAccess() || isHrbaCourseSlug(input.courseSlug)) {
    return hasActiveIndividualCourseAssignment(input.userId, input.courseId);
  }

  if (input.visibility === CourseVisibility.PUBLIC) {
    return true;
  }

  const assignment = await prisma.courseAssignment.findFirst({
    select: { id: true },
    where: {
      courseId: input.courseId,
      isActive: true,
      OR: [
        { targetUserId: input.userId },
        ...(input.primaryCohortId
          ? [{ targetCohortId: input.primaryCohortId }]
          : []),
        ...(input.organizationId
          ? [{ targetOrganizationId: input.organizationId }]
          : []),
      ],
    },
  });

  return Boolean(assignment);
}
