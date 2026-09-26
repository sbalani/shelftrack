import { AuthRecovery } from "@/components/auth-recovery";
import { notFound } from "next/navigation";

export default async function AuthUtilityPage({ params }: { params: Promise<{ path: string }> }) {
  const { path } = await params;
  if (path !== "forgot-password" && path !== "reset-password") notFound();
  return <AuthRecovery path={path} />;
}
