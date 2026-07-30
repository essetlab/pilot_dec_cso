import Link from "next/link";

export default async function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-light-bg flex flex-col lg:flex-row">
      {/* 1. Identity & Guidance Panel (Left Sidebar, hidden on mobile) */}
      <section className="hidden lg:flex lg:w-5/12 bg-deep-navy text-white p-12 flex-col justify-between relative overflow-hidden shrink-0">
        <div aria-hidden="true" className="absolute -right-16 -top-16 h-64 w-64 rounded-full border-[24px] border-dec-blue/15" />
        <div aria-hidden="true" className="absolute -left-10 bottom-10 h-48 w-48 rounded-full border-[16px] border-dec-green/10" />

        <div className="relative z-10">
          <Link href="/" className="text-sm font-black uppercase tracking-[0.2em] text-[#72bee8] hover:text-white transition">
            CSO Learning Hub
          </Link>
          <h2 className="mt-16 font-display text-4xl font-bold leading-tight">
            Practical learning for Ethiopian CSOs
          </h2>
          <p className="mt-6 text-sm leading-7 text-slate-200">
            Access case-led online learning, interactive activities, and downloadable tools tailored for local and grassroots civil society organizations.
          </p>
        </div>

        <div className="relative z-10 border-t border-white/10 pt-8 space-y-4">
          <div className="flex gap-3 text-xs leading-5 text-slate-300">
            <span className="h-2 w-2 rounded-full bg-dec-green mt-1.5 shrink-0" />
            <p>
              <strong className="text-white font-bold">Individual progress:</strong> Your study records, quiz attempts, and eligible certificates stay linked to your own profile.
            </p>
          </div>
          <div className="flex gap-3 text-xs leading-5 text-slate-300">
            <span className="h-2 w-2 rounded-full bg-[#72bee8] mt-1.5 shrink-0" />
            <p>
              <strong className="text-white font-bold">Privacy-conscious:</strong> Do not enter survivor stories, names, or sensitive records. Practice safely.
            </p>
          </div>
        </div>
      </section>

      {/* 2. Form Panel (Right Area) */}
      <main className="flex-1 flex flex-col justify-center items-center px-4 py-12 sm:px-8">
        <div className="w-full max-w-lg bg-white border border-design-border rounded-card p-6 sm:p-8 shadow-soft">
          <div className="mb-6 lg:hidden text-center">
            <Link href="/" className="text-xs font-black uppercase tracking-[0.16em] text-dec-blue">
              CSO Learning Hub
            </Link>
          </div>
          {children}
        </div>
        <footer className="mt-8 text-center text-2xs text-muted-text max-w-md">
          <p>
            Need assistance accessing your account?{" "}
            <Link href="/support" className="font-semibold text-dec-blue underline hover:text-deep-navy">
              Open registration guidance
            </Link>
          </p>
        </footer>
      </main>
    </div>
  );
}
