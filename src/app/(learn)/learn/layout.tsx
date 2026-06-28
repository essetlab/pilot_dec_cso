import { LearnerShell } from "@/components/shell/LearnerShell";
import { getCurrentSession } from "@/lib/auth/server";

export default async function LearnerLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getCurrentSession();

  return <LearnerShell session={session}>{children}</LearnerShell>;
}
