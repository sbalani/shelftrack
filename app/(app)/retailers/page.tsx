import { RetailerManagement } from "@/components/retailer-management";
import { auth } from "@/lib/auth/server";
import { getUserRole } from "@/lib/permissions";
import { redirect } from "next/navigation";

export default async function RetailersPage() {
  const { data: session } = await auth.getSession();
  if (!session?.user || getUserRole(session.user as { role?: unknown; appRole?: unknown }) !== "admin") redirect("/dashboard");
  return <main className="page"><header className="page-head compact"><div><p className="eyebrow">Retail network</p><h1>Retailers, brands and locations</h1><p>Model corporate groups, sub-brands, franchise operators and individual stores so shelf performance can be analyzed at every level.</p></div></header><RetailerManagement /></main>;
}
