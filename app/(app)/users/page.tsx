import { CreateUserForm } from "@/components/create-user-form";
import { auth } from "@/lib/auth/server";
import { getUserRole, roleLabels } from "@/lib/permissions";
import { ShieldCheck, UserRound } from "lucide-react";
import { redirect } from "next/navigation";

export default async function UsersPage() {
  const { data: session } = await auth.getSession();
  if (!session?.user || getUserRole(session.user as { role?: unknown; appRole?: unknown }) !== "admin") redirect("/dashboard");

  const { data } = await auth.admin.listUsers({ query: { limit: 50, sortBy: "name", sortDirection: "asc" } });
  const users = data?.users || [session.user];

  return (
    <main className="page users-page">
      <header className="page-head compact"><div><p className="eyebrow">Administration</p><h1>Team access</h1><p>Create accounts and set who can capture for themselves, enter data for others, or manage the team.</p></div></header>
      <section className="user-layout">
        <div className="panel create-user-panel"><div className="panel-head"><div><p className="eyebrow">New account</p><h2>Add a team member</h2></div><span className="metric-icon lime"><UserRound size={21} /></span></div><CreateUserForm /></div>
        <div className="permission-card">
          <ShieldCheck size={25} />
          <div><strong>Permission model</strong><p><b>Field users</b> submit their own visits. <b>Data entry</b> can submit on behalf of others. <b>Administrators</b> can also create and manage users.</p></div>
        </div>
      </section>
      <section className="panel team-panel">
        <div className="panel-head"><div><p className="eyebrow">Directory</p><h2>{users.length} team member{users.length === 1 ? "" : "s"}</h2></div></div>
        <div className="team-list">
          {users.map((user) => {
            const role = getUserRole(user as { role?: unknown; appRole?: unknown });
            return <article key={user.id}><span className="avatar">{(user.name || user.email).slice(0, 2).toUpperCase()}</span><div><strong>{user.name || "Unnamed user"}</strong><span>{user.email}</span></div><span className={`role-chip role-${role}`}>{roleLabels[role]}</span></article>;
          })}
        </div>
      </section>
    </main>
  );
}
