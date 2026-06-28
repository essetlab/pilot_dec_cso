import { CreatorShell } from "@/components/shell/CreatorShell";
import { getCurrentSession } from "@/lib/auth/server";

export default async function CreatorLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getCurrentSession();

  return <CreatorShell session={session}>{children}</CreatorShell>;
}
