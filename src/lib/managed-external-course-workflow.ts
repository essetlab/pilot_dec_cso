import "server-only";

import { CourseStatus, CourseVisibility } from "../generated/prisma/enums";
import { canAccessLearner } from "./auth/permissions";
import type { AuthSession } from "./auth/session-codec";
import {
  getManagedExternalCourseMetadata,
  parseSafeExternalUrl,
  validateApprovedOrigin,
  type ManagedExternalCourseAvailability,
  type ManagedExternalCourseMode,
  type ManagedExternalCourseOpenBehavior,
} from "./external-course-manager";
import { prisma } from "./prisma";

export type ManagedExternalCoursePublicState = {
  approvedOrigin: string | null;
  availability: ManagedExternalCourseAvailability;
  externalUrl: string | null;
  integrationMode: ManagedExternalCourseMode;
  openBehavior: ManagedExternalCourseOpenBehavior;
  title: string;
};

export type ManagedEmbeddedCourseLaunchData = {
  allowedOrigin: string;
  courseSlug: string;
  courseTitle: string;
  iframeSrc: string;
};

export async function getManagedExternalCoursePublicState(
  slug: string,
): Promise<ManagedExternalCoursePublicState | null> {
  try {
    const course = await prisma.course.findFirst({
      select: {
        analysisMetadataJson: true,
        status: true,
        title: true,
        visibility: true,
      },
      where: { archivedAt: null, slug },
    });
    const metadata = getManagedExternalCourseMetadata(course?.analysisMetadataJson);

    if (!course || !metadata) {
      return null;
    }

    if (
      course.status !== CourseStatus.PUBLISHED ||
      course.visibility !== CourseVisibility.PUBLIC
    ) {
      return {
        approvedOrigin: metadata.approvedOrigin,
        availability: metadata.availability,
        externalUrl: metadata.externalUrl,
        integrationMode: metadata.integrationMode,
        openBehavior: metadata.openBehavior,
        title: course.title,
      };
    }

    return {
      approvedOrigin: metadata.approvedOrigin,
      availability: metadata.availability,
      externalUrl: metadata.externalUrl,
      integrationMode: metadata.integrationMode,
      openBehavior: metadata.openBehavior,
      title: course.title,
    };
  } catch {
    return null;
  }
}

export async function getManagedEmbeddedCourseLaunchData(
  slug: string,
  session: AuthSession | null,
): Promise<ManagedEmbeddedCourseLaunchData | null> {
  if (!canAccessLearner(session)) {
    return null;
  }

  const state = await getManagedExternalCoursePublicState(slug);
  if (
    !state ||
    state.availability !== "available" ||
    state.integrationMode !== "embedded" ||
    state.openBehavior !== "inside_hub" ||
    !state.externalUrl ||
    !state.approvedOrigin
  ) {
    return null;
  }

  const url = parseSafeExternalUrl(state.externalUrl);
  const origin = validateApprovedOrigin(state.approvedOrigin, url.origin);
  if (!url.url || !url.origin || origin.error || origin.origin !== url.origin) {
    return null;
  }

  return {
    allowedOrigin: origin.origin,
    courseSlug: slug,
    courseTitle: state.title,
    iframeSrc: url.url,
  };
}
