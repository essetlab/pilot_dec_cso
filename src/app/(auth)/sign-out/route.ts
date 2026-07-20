import { redirect } from "next/navigation";
import type { NextRequest } from "next/server";
import { clearCurrentSession } from "@/lib/auth/server";
import { readSupabasePublicConfig } from "@/lib/supabase/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";

function safeNextPath(value: string | null) {
  return value?.startsWith("/") && !value.startsWith("//") ? value : "";
}

export async function GET(request: NextRequest) {
  if (readSupabasePublicConfig()) {
    const supabase = await createSupabaseServerClient();
    await supabase.auth.signOut();
  }

  await clearCurrentSession();
  const next = safeNextPath(request.nextUrl.searchParams.get("next"));
  redirect(next ? `/sign-in?next=${encodeURIComponent(next)}` : "/sign-in");
}
