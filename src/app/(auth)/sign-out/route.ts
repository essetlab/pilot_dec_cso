import { redirect } from "next/navigation";
import { clearCurrentSession } from "@/lib/auth/server";
import { readSupabasePublicConfig } from "@/lib/supabase/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET() {
  if (readSupabasePublicConfig()) {
    const supabase = await createSupabaseServerClient();
    await supabase.auth.signOut();
  }

  await clearCurrentSession();
  redirect("/sign-in");
}
