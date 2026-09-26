import { AppShell } from "@/components/app-shell";
import { auth } from "@/lib/auth/server";
import { getUserRole } from "@/lib/permissions";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const { data: session } = await auth.getSession();
  if (!session?.user) redirect("/auth/sign-in");
  const role = getUserRole(session.user as { role?: unknown; appRole?: unknown });

  return (
    <AppShell name={session.user.name || "Team member"} role={role}>
      {children}
    </AppShell>
  );
}
