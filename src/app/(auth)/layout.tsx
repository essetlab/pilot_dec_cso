import Link from "next/link";
import { PublicHeader } from "@/components/shell/PublicShell";
import { isControlledHubAccess } from "@/lib/hub-access-policy";

export default async function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-light-bg text-dark-ink">
      <PublicHeader controlledAccess={isControlledHubAccess()} />
      <div className="flex min-h-screen flex-col pt-[72px] lg:flex-row">
        <section className="relative hidden shrink-0 overflow-hidden bg-deep-navy p-10 text-white lg:flex lg:w-[38%] lg:flex-col lg:justify-between xl:p-14">
          <div aria-hidden="true" className="absolute -right-16 -top-16 h-64 w-64 rounded-full border-[24px] border-dec-blue/15" />
          <div aria-hidden="true" className="absolute -left-10 bottom-10 h-48 w-48 rounded-full border-[16px] border-dec-green/10" />

          <div className="relative z-10 max-w-sm">
            <Link href="/" className="text-sm font-black uppercase tracking-[0.2em] text-[#72bee8] transition hover:text-white">
              CSO Learning Hub
            </Link>
            <h2 className="mt-14 font-display text-4xl font-bold leading-tight">
              Practical learning for Ethiopian CSOs
            </h2>
            <p className="mt-6 text-sm leading-7 text-slate-200">
              Access case-led online learning, interactive activities, and downloadable tools tailored for local and grassroots civil society organizations.
            </p>
          </div>

          <div className="relative z-10 max-w-sm space-y-4 border-t border-white/10 pt-8">
            <div className="flex gap-3 text-xs leading-5 text-slate-300">
              <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-dec-green" />
              <p>
                <strong className="font-bold text-white">Individual progress:</strong> Your study records, quiz attempts, and eligible certificates stay linked to your own profile.
              </p>
            </div>
            <div className="flex gap-3 text-xs leading-5 text-slate-300">
              <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#72bee8]" />
              <p>
                <strong className="font-bold text-white">Privacy-conscious:</strong> Do not enter survivor stories, names, or sensitive records. Practice safely.
              </p>
            </div>
          </div>
        </section>

        <main className="flex flex-1 flex-col items-center justify-center px-4 py-10 sm:px-8 sm:py-12 lg:px-12 xl:px-16">
          <div className="w-full max-w-2xl rounded-card border border-design-border bg-white p-6 shadow-soft sm:p-8 lg:p-10">
            {children}
          </div>
          <footer className="mt-6 w-full max-w-2xl text-center text-2xs text-muted-text sm:text-left">
            <p>
              Need assistance accessing your account?{" "}
              <Link href="/support" className="font-semibold text-dec-blue underline hover:text-deep-navy">
                Open registration guidance
              </Link>
            </p>
          </footer>
        </main>
      </div>
    </div>
  );
}
