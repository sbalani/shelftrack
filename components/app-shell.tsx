import type { AppRole } from "@/lib/permissions";
import { canManageUsers, roleLabels } from "@/lib/permissions";
import { Camera, ClipboardList, LayoutDashboard, MapPinned, Users } from "lucide-react";
import Link from "next/link";
import { SignOutButton } from "./sign-out-button";

const nav = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/capture", label: "New capture", icon: Camera, primary: true },
  { href: "/submissions", label: "Submissions", icon: ClipboardList },
];

export function AppShell({ children, name, role }: { children: React.ReactNode; name: string; role: AppRole }) {
  const items = canManageUsers(role) ? [...nav, { href: "/users", label: "Team", icon: Users }] : nav;
  const initials = name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase();

  return (
    <div className="app-frame">
      <aside className="sidebar">
        <Link href="/dashboard" className="brand"><span className="brand-mark">ST</span><span>ShelfTrack</span></Link>
        <nav className="side-nav" aria-label="Main navigation">
          {items.map(({ href, label, icon: Icon, primary }) => (
            <Link href={href} key={href} className={primary ? "nav-item capture-link" : "nav-item"}>
              <Icon size={19} /><span>{label}</span>
            </Link>
          ))}
        </nav>
        <div className="sidebar-foot">
          <div className="territory"><MapPinned size={18} /><div><span>Active territory</span><strong>Indonesia</strong></div></div>
          <div className="account-row">
            <span className="avatar">{initials}</span>
            <div className="account-copy"><strong>{name}</strong><span>{roleLabels[role]}</span></div>
            <SignOutButton />
          </div>
        </div>
      </aside>
      <div className="app-main">
        <header className="mobile-header">
          <Link href="/dashboard" className="brand"><span className="brand-mark">ST</span><span>ShelfTrack</span></Link>
          <span className="avatar">{initials}</span>
        </header>
        {children}
      </div>
      <nav className="mobile-nav" aria-label="Mobile navigation">
        {items.slice(0, 4).map(({ href, label, icon: Icon, primary }) => (
          <Link href={href} key={href} className={primary ? "mobile-nav-item mobile-capture" : "mobile-nav-item"}>
            <Icon size={primary ? 23 : 20} /><span>{label.replace("New ", "")}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
