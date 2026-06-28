import { redirect } from "next/navigation";
import { clearCurrentSession } from "@/lib/auth/server";

export async function GET() {
  await clearCurrentSession();
  redirect("/sign-in");
}
