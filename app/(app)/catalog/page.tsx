import { CatalogManagement } from "@/components/catalog-management";
import { auth } from "@/lib/auth/server";
import { getUserRole } from "@/lib/permissions";
import { redirect } from "next/navigation";

export default async function CatalogPage() {
  const { data: session } = await auth.getSession();
  if (!session?.user || getUserRole(session.user as { role?: unknown; appRole?: unknown }) !== "admin") redirect("/dashboard");
  return <main className="page"><header className="page-head compact"><div><p className="eyebrow">Product intelligence</p><h1>Brands, SKUs and expected distribution</h1><p>Manage your own assortment by retailer, while competitor SKUs accumulate naturally from verified shelf observations.</p></div></header><CatalogManagement /></main>;
}
