import { PublicShell } from "@/components/shell/PublicShell";
import { getCurrentSession } from "@/lib/auth/server";
import { isControlledHubAccess } from "@/lib/hub-access-policy";

export default async function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getCurrentSession();

  return (
    <PublicShell controlledAccess={isControlledHubAccess()} session={session}>
      {children}
    </PublicShell>
  );
}
