import "server-only";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { getSupabasePublicConfig } from "./config";

export async function createSupabaseServerClient() {
  const config = getSupabasePublicConfig();
  const cookieStore = await cookies();

  // Dormant S2 utility for future Supabase Auth slices. This does not replace
  // the current Hub getCurrentSession() or cso_lh_session behavior.
  return createServerClient(config.url, config.publishableKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, options, value }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Server Components cannot always write cookies. Future middleware
          // should handle refresh writes before protected route rendering.
        }
      },
    },
  });
}
