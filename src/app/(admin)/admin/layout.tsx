import { AdminShell } from "@/components/shell/AdminShell";
import { getCurrentSession } from "@/lib/auth/server";

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getCurrentSession();

  if (!session) {
    return (
      <div className="min-h-screen bg-light-bg px-4 py-8 text-dark-ink sm:px-6 lg:px-8">
        <main className="mx-auto max-w-5xl">{children}</main>
      </div>
    );
  }

  return <AdminShell session={session}>{children}</AdminShell>;
}
