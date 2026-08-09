import { NextRequest, NextResponse } from "next/server";
import { resolveSupabaseHubSession } from "@/lib/auth/hub-session";
import { getCurrentSession } from "@/lib/auth/server";
import { COURSE_INVITATION_COOKIE_NAME } from "@/lib/course-invitation-session";
import {
  activateCourseInvitation,
  reconcileInvitedSupabaseLearnerProfile,
} from "@/lib/course-invitation-workflow";
import { readSupabasePublicConfig } from "@/lib/supabase/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const token = request.cookies.get(COURSE_INVITATION_COOKIE_NAME)?.value?.trim() ?? "";
  if (!token || token.length > 512) {
    return NextResponse.redirect(
      new URL("/course-invitations/accept?state=unavailable", request.url),
    );
  }

  let session = await getCurrentSession();
  if (!session && readSupabasePublicConfig()) {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user?.id && user.email) {
      const profile = await reconcileInvitedSupabaseLearnerProfile({
        authProviderId: user.id,
        email: user.email,
        plaintextToken: token,
      });
      if (profile.success) {
        const resolved = await resolveSupabaseHubSession({
          email: user.email,
          linkEmailFallback: true,
          supabaseUserId: user.id,
        });
        session = resolved.success ? resolved.session : null;
      }
    }
  }

  if (!session) {
    return NextResponse.redirect(
      new URL("/sign-in?next=%2Fcourse-invitations%2Freconcile", request.url),
    );
  }

  const result = await activateCourseInvitation({ plaintextToken: token, session });
  if (!result.success) {
    return NextResponse.redirect(
      new URL("/course-invitations/accept?state=unavailable", request.url),
    );
  }

  const coursePath = `/learn/courses/${encodeURIComponent(result.access.courseSlug)}`;
  const response = NextResponse.redirect(
    new URL(result.access.isExternalCourse ? `${coursePath}/external` : coursePath, request.url),
  );
  response.cookies.delete(COURSE_INVITATION_COOKIE_NAME);
  return response;
}
