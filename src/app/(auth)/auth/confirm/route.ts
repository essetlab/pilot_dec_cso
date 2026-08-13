import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

function safeNextPath(value: string | null) {
  if (value?.startsWith("/") && !value.startsWith("//")) {
    return value;
  }

  return "/sign-in?notice=email-confirmed";
}

export async function GET(request: NextRequest) {
  const tokenHash = request.nextUrl.searchParams.get("token_hash");
  const type = request.nextUrl.searchParams.get("type");
  const next = safeNextPath(request.nextUrl.searchParams.get("next"));

  if (!tokenHash || type !== "signup") {
    return NextResponse.redirect(
      new URL("/sign-in?error=confirmation-required", request.url),
    );
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.verifyOtp({
    token_hash: tokenHash,
    type: "signup",
  });

  if (error) {
    return NextResponse.redirect(
      new URL("/sign-in?error=confirmation-required", request.url),
    );
  }

  return NextResponse.redirect(new URL(next, request.url));
}
