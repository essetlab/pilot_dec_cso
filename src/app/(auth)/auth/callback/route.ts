import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

function safeNextPath(value: string | null) {
  if (value?.startsWith("/") && !value.startsWith("//")) {
    return value;
  }

  return "/sign-in";
}

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const next = safeNextPath(request.nextUrl.searchParams.get("next"));

  if (!code) {
    const fallback = next.startsWith("/reset-password")
      ? "/reset-password?error=invalid-link"
      : "/sign-in?error=confirmation-required";
    return NextResponse.redirect(new URL(fallback, request.url));
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    const fallback = next.startsWith("/reset-password")
      ? "/reset-password?error=invalid-link"
      : "/sign-in?error=confirmation-required";
    return NextResponse.redirect(new URL(fallback, request.url));
  }

  return NextResponse.redirect(new URL(next, request.url));
}
