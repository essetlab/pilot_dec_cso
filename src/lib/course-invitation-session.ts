import "server-only";

import { cookies } from "next/headers";
import { COURSE_INVITATION_VALIDITY_DAYS } from "./hub-access-policy";

export const COURSE_INVITATION_COOKIE_NAME = "cso_course_invitation";

export async function getCourseInvitationToken() {
  const cookieStore = await cookies();
  return cookieStore.get(COURSE_INVITATION_COOKIE_NAME)?.value?.trim() ?? "";
}

export function courseInvitationCookieOptions() {
  return {
    httpOnly: true,
    maxAge: COURSE_INVITATION_VALIDITY_DAYS * 24 * 60 * 60,
    path: "/",
    priority: "high" as const,
    sameSite: "lax" as const,
    secure:
      process.env.NODE_ENV === "production" ||
      (process.env.NEXT_PUBLIC_APP_URL?.startsWith("https://") ?? false),
  };
}
