import { NextResponse, type NextRequest } from "next/server";
import { getCurrentSession } from "@/lib/auth/server";
import { activateCourseInvitation } from "@/lib/course-invitation-workflow";

function hasTrustedMutationOrigin(request: NextRequest) {
  const origin = request.headers.get("origin");
  if (!origin) {
    return false;
  }

  try {
    return new URL(origin).origin === request.nextUrl.origin;
  } catch {
    return false;
  }
}

export async function POST(request: NextRequest) {
  if (!hasTrustedMutationOrigin(request)) {
    return NextResponse.json(
      { error: "Request unavailable", success: false },
      { status: 403 },
    );
  }

  const body = await request.json().catch(() => null);
  const token =
    body && typeof body === "object" && "token" in body && typeof body.token === "string"
      ? body.token
      : "";
  if (!token || token.length > 512) {
    return NextResponse.json(
      { error: "Invitation unavailable", success: false },
      { status: 400 },
    );
  }

  const session = await getCurrentSession();
  const result = await activateCourseInvitation({ plaintextToken: token, session });

  if (!result.success) {
    const status = result.code === "unauthorized" ? 401 : result.code === "integrity-error" ? 409 : 400;
    return NextResponse.json(
      { error: "Invitation unavailable", success: false },
      { status },
    );
  }

  return NextResponse.json(result);
}
