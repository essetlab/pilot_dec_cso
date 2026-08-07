import { NextRequest, NextResponse } from "next/server";
import {
  COURSE_INVITATION_COOKIE_NAME,
  courseInvitationCookieOptions,
} from "@/lib/course-invitation-session";
import { getCurrentSession } from "@/lib/auth/server";
import { resolveCourseInvitationAcceptance } from "@/lib/course-invitation-workflow";

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token")?.trim() ?? "";
  if (!token || token.length > 512) {
    const response = NextResponse.redirect(
      new URL("/course-invitations/accept?state=unavailable", request.url),
    );
    response.cookies.delete(COURSE_INVITATION_COOKIE_NAME);
    return response;
  }

  const resolution = await resolveCourseInvitationAcceptance({
    plaintextToken: token,
    session: await getCurrentSession(),
  });
  if (!resolution.success) {
    const response = NextResponse.redirect(
      new URL(`/course-invitations/accept?state=${resolution.state}`, request.url),
    );
    response.cookies.delete(COURSE_INVITATION_COOKIE_NAME);
    return response;
  }

  const response = NextResponse.redirect(
    new URL("/course-invitations/accept", request.url),
  );
  response.cookies.set(
    COURSE_INVITATION_COOKIE_NAME,
    token,
    courseInvitationCookieOptions(),
  );
  return response;
}
