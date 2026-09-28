import { CreateUserForm } from "@/components/create-user-form";
import { auth } from "@/lib/auth/server";
import { getUserRole, roleLabels } from "@/lib/permissions";
import { getEmployees } from "@/lib/db/queries";
import { EmployeeDirectory } from "@/components/employee-directory";
import { Building2, PackageSearch, ShieldCheck, UserRound } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function UsersPage() {
  const { data: session } = await auth.getSession();
  if (!session?.user || getUserRole(session.user as { role?: unknown; appRole?: unknown }) !== "admin") redirect("/dashboard");

  const { data } = await auth.admin.listUsers({ query: { limit: 50, sortBy: "name", sortDirection: "asc" } });
  const users = data?.users || [session.user];
  const employees = await getEmployees();

  return (
    <main className="page users-page">
      <header className="page-head compact"><div><p className="eyebrow">People & access</p><h1>Employees first. Accounts when ready.</h1><p>Every collector is an employee. Login access can be assigned now or later, but every account must belong to exactly one employee.</p></div></header>
      <section className="admin-jump-grid"><Link href="/retailers"><Building2 size={20} /><div><strong>Retail network</strong><span>Companies, brands, franchise owners and locations</span></div></Link><Link href="/catalog"><PackageSearch size={20} /><div><strong>Product catalog</strong><span>Own brands, competitors, SKUs and assignments</span></div></Link></section>
      <EmployeeDirectory initialEmployees={employees} />
      <section className="user-layout">
        <div className="panel create-user-panel"><div className="panel-head"><div><p className="eyebrow">Login access</p><h2>Assign an account</h2></div><span className="metric-icon lime"><UserRound size={21} /></span></div><CreateUserForm employees={employees.filter((employee) => employee.accountStatus === "none")} /></div>
        <div className="permission-card">
          <ShieldCheck size={25} />
          <div><strong>Employee ≠ account</strong><p><b>Employees</b> can own shelf visits without logging in. <b>Accounts</b> provide app access and must reference an employee. Data entry and admins can submit work for employees who have no account yet.</p></div>
        </div>
      </section>
      <section className="panel team-panel">
        <div className="panel-head"><div><p className="eyebrow">Auth accounts</p><h2>{users.length} active login{users.length === 1 ? "" : "s"}</h2></div></div>
        <div className="team-list">
          {users.map((user) => {
            const role = getUserRole(user as { role?: unknown; appRole?: unknown });
            const employee = employees.find((item) => item.email === user.email || item.id === (user as { employeeId?: unknown }).employeeId);
            return <article key={user.id}><span className="avatar">{(user.name || user.email).slice(0, 2).toUpperCase()}</span><div><strong>{user.name || "Unnamed user"}</strong><span>{employee ? `${employee.employeeCode} · ${user.email}` : `Employee assignment required · ${user.email}`}</span></div><span className={`role-chip role-${role}`}>{roleLabels[role]}</span></article>;
          })}
        </div>
      </section>
    </main>
  );
}
