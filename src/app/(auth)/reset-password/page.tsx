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
    <section className="mx-auto max-w-xl rounded-card border border-design-border bg-white p-6 shadow-card sm:p-8">
      <p className="text-sm font-semibold text-dec-blue">Account recovery</p>
      <h1 className="mt-2 font-display text-3xl font-semibold text-deep-navy">
        Choose a new password
      </h1>
      <p className="mt-3 text-sm leading-7 text-muted-text">
        Use at least 10 characters, including uppercase and lowercase letters and a number.
      </p>

      <RecoveryPasswordForm
        error={error}
        expectsFragment={recovery === "fragment"}
        hasServerSession={Boolean(user)}
      />

      <p className="mt-6 text-sm text-muted-text">
        Need a new link?{" "}
        <Link className="font-semibold text-dec-blue underline-offset-4 hover:underline" href="/forgot-password">
          Request another reset email
        </Link>
      </p>
    </section>
  );
}
