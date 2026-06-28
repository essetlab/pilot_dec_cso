import { AdminShell } from "@/components/shell/AdminShell";
import { getCurrentSession } from "@/lib/auth/server";

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getCurrentSession();

  return <AdminShell session={session}>{children}</AdminShell>;
}
