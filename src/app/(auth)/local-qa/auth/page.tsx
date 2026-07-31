import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { ActionButton, StatusBadge } from "@/components/ui";
import { DEMO_USERS } from "@/lib/auth/demo-users";
import { signInDemoUser } from "../../sign-in/actions";

type PageProps = {
  searchParams: Promise<{
    next?: string;
  }>;
};

const roleDetails: Record<
  string,
  {
    focus: string;
    access: string;
    tone: "blue" | "green" | "gray" | "purple" | "gold";
  }
> = {
  "super-admin": {
    access: "System admin",
    focus: "Full administrative controls for all hubs, courses, and participants.",
    tone: "purple",
  },
  "platform-admin": {
    access: "Operations",
    focus: "Invite users, assign courses, and monitor regional progress.",
    tone: "blue",
  },
  "course-creator": {
    access: "Content creator",
    focus: "Build courses, structure modules, edit lessons, and configure tests.",
    tone: "gold",
  },
  "course-reviewer": {
    access: "Quality assurance",
    focus: "Review and approve/return courses submitted for publication.",
    tone: "gray",
  },
  "me-viewer": {
    access: "M&E access",
    focus: "View aggregate analytics and regional enrollment patterns.",
    tone: "gray",
  },
  participant: {
    access: "Learning area",
    focus: "Access courses, progress, certificates, and your learning profile.",
    tone: "green",
  },
};

export default async function LocalQaAuthPage({ searchParams }: PageProps) {
  const { next } = await searchParams;

  // 1. Guard check: local-test environment only
  const isLocalTest = process.env.APP_ENVIRONMENT === "local-test";
  const allowDemoAuth = process.env.ALLOW_LOCAL_DEMO_AUTH === "true";
  if (!isLocalTest || !allowDemoAuth) {
    notFound();
  }

  // 2. Guard check: not in production NODE_ENV
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  // 3. Guard check: request hostname must be localhost or 127.0.0.1
  const headersList = await headers();
  const host = headersList.get("host") || "";
  const isLocalHostRequest =
    host.includes("localhost") || host.includes("127.0.0.1");
  if (!isLocalHostRequest) {
    notFound();
  }

  // 4. Guard check: database and Supabase URLs must not target staging or production project IDs
  const dbUrl = process.env.DATABASE_URL || "";
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

  const protectedProjectIds = ["fgyxbzwdvngqlksyxuwa", "bhzyrthinbyqgsetnoph"];
  const targetsProtectedProject = protectedProjectIds.some(
    (id) => dbUrl.includes(id) || supabaseUrl.includes(id) || supabaseKey.includes(id)
  );
  if (targetsProtectedProject) {
    notFound();
  }

  // 5. Guard check: database URL must point to localhost or dev.db
  const isLocalHostDb =
    dbUrl.includes("localhost") ||
    dbUrl.includes("127.0.0.1") ||
    dbUrl.includes("file:") ||
    dbUrl.includes("dev.db");
  if (!isLocalHostDb) {
    notFound();
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <div className="flex items-center justify-between gap-4">
          <span className="text-2xs font-extrabold uppercase tracking-wider text-[#d97706]">
            Developer Sandbox
          </span>
          <StatusBadge label="Local QA Only" tone="gold" />
        </div>
        <h1 className="mt-2 text-2xl font-bold text-deep-navy">
          Local QA Quick Access
        </h1>
        <p className="mt-2 text-xs leading-5 text-muted-text">
          Use the synthetic mock profiles below to bypass external login and verify portal features. This route is guarded and unavailable on remote deployments.
        </p>
      </div>

      {/* Quick Access User List */}
      <div className="grid gap-3">
        {DEMO_USERS.map((user) => {
          const details = roleDetails[user.id] || {
            access: "Access",
            focus: user.description,
            tone: "gray",
          };

          return (
            <form
              action={signInDemoUser}
              className="rounded-card border border-design-border bg-white p-4 shadow-soft hover:border-dec-blue/30 hover:shadow-card transition"
              key={user.id}
            >
              <input name="userId" type="hidden" value={user.id} />
              <input name="next" type="hidden" value={next ?? ""} />
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-deep-navy">
                      {user.name}
                    </h3>
                    <StatusBadge label={details.access} tone={details.tone} />
                  </div>
                  <p className="mt-1 text-xs text-muted-text">
                    Email: <span className="font-mono text-dark-ink">{user.email}</span>
                  </p>
                  <p className="mt-1 text-xs text-muted-text">
                    {details.focus}
                  </p>
                </div>
                <ActionButton
                  className="w-full sm:w-auto"
                  type="submit"
                  size="sm"
                >
                  Sign In
                </ActionButton>
              </div>
            </form>
          );
        })}
      </div>

      <div className="border-t border-design-border pt-4 text-center">
        <a
          href="/sign-in"
          className="text-xs font-bold text-dec-blue underline hover:text-deep-navy"
        >
          Return to Standard Sign-In
        </a>
      </div>
    </div>
  );
}
