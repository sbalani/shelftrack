import { auth } from "@/lib/auth/server";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const { data: session } = await auth.getSession();
  redirect(session?.user ? "/dashboard" : "/auth/sign-in");
}
