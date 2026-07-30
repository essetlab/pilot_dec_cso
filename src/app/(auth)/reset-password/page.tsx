import Link from "next/link";
import { RecoveryPasswordForm } from "@/components/auth/RecoveryPasswordForm";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type PageProps = {
  searchParams: Promise<{ error?: string; recovery?: string }>;
};

export default async function ResetPasswordPage({ searchParams }: PageProps) {
  const { error, recovery } = await searchParams;
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <span className="text-2xs font-extrabold uppercase tracking-wider text-dec-blue">
          Account Recovery
        </span>
        <h1 className="mt-2 text-2xl font-bold text-deep-navy">Choose a new password</h1>
        <p className="mt-2 text-xs leading-5 text-muted-text">
          Use at least 10 characters, including uppercase and lowercase letters and a number.
        </p>
      </div>

      <RecoveryPasswordForm
        error={error}
        expectsFragment={recovery === "fragment"}
        hasServerSession={Boolean(user)}
      />

      <div className="border-t border-design-border pt-4 text-center text-xs text-muted-text">
        <p>
          Need a new link?{" "}
          <Link className="font-bold text-dec-blue underline hover:text-deep-navy" href="/forgot-password">
            Request reset email
          </Link>
        </p>
      </div>
    </div>
  );
}
