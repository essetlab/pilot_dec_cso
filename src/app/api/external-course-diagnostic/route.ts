import { NextResponse, type NextRequest } from "next/server";
import { getCurrentSession } from "@/lib/auth/server";
import { validateResumeDiagnosticCheckpoint } from "@/lib/external-course-diagnostics";

export async function POST(request: NextRequest) {
  const session = await getCurrentSession();
  if (!session) {
    return NextResponse.json({ success: false }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const diagnostic = validateResumeDiagnosticCheckpoint(body);
  if (!diagnostic) {
    return NextResponse.json({ success: false }, { status: 400 });
  }

  console.info(JSON.stringify(diagnostic));
  return NextResponse.json({ success: true });
}
