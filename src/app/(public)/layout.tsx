import { PublicShell } from "@/components/shell/PublicShell";
import { getCurrentSession } from "@/lib/auth/server";

export default async function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getCurrentSession();

  return <PublicShell session={session}>{children}</PublicShell>;
}
