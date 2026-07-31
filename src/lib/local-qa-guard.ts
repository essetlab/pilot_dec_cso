import { headers } from "next/headers";

/**
 * Strictly verifies whether developer sandbox/QA visual fixtures are allowed to render.
 * Requires:
 *  - APP_ENVIRONMENT === "local-test"
 *  - ALLOW_LOCAL_DEMO_AUTH === "true"
 *  - ALLOW_LOCAL_COURSE_FIXTURES === "true"
 *  - NODE_ENV !== "production"
 *  - Request host matches localhost or 127.0.0.1 (when header context is available)
 *  - DATABASE_URL / Supabase credentials do not point to any protected staging or production project IDs.
 *  - DATABASE_URL points to localhost, 127.0.0.1, file: or dev.db.
 */
export async function isLocalQaFixtureAllowed(): Promise<boolean> {
  const isLocalTest = process.env.APP_ENVIRONMENT === "local-test";
  const allowDemoAuth = process.env.ALLOW_LOCAL_DEMO_AUTH === "true";
  const allowFixtures = process.env.ALLOW_LOCAL_COURSE_FIXTURES === "true";

  if (!isLocalTest || !allowDemoAuth || !allowFixtures) {
    return false;
  }

  if (process.env.NODE_ENV === "production") {
    return false;
  }

  // Request host check
  try {
    const headersList = await headers();
    const host = headersList.get("host") || "";
    const isLocalHostRequest =
      host.includes("localhost") || host.includes("127.0.0.1");
    if (!isLocalHostRequest) {
      return false;
    }
  } catch {
    // Gracefully handle context where headers are not available (e.g. static generation)
  }

  // Database safety checks
  const dbUrl = process.env.DATABASE_URL || "";
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

  const protectedProjectIds = ["fgyxbzwdvngqlksyxuwa", "bhzyrthinbyqgsetnoph"];
  const targetsProtectedProject = protectedProjectIds.some(
    (id) => dbUrl.includes(id) || supabaseUrl.includes(id) || supabaseKey.includes(id)
  );
  if (targetsProtectedProject) {
    return false;
  }

  const isLocalHostDb =
    dbUrl.includes("localhost") ||
    dbUrl.includes("127.0.0.1") ||
    dbUrl.includes("file:") ||
    dbUrl.includes("dev.db");
  if (!isLocalHostDb && dbUrl !== "") {
    return false;
  }

  return true;
}
