"use client";

import type { Employee } from "@/lib/domain-data";
import { BriefcaseBusiness, Check, CircleUserRound, MapPin, Plus, UserRoundPlus } from "lucide-react";
import { useState } from "react";

const statusLabels = { linked: "Account linked", invited: "Invite pending", none: "No account" } as const;

export function EmployeeDirectory({ initialEmployees }: { initialEmployees: Employee[] }) {
  const [employees, setEmployees] = useState(initialEmployees);
  const [showForm, setShowForm] = useState(false);

  function addEmployee(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setEmployees((items) => [...items, {
      id: `EMP-${String(items.length + 32).padStart(3, "0")}`,
      name: String(form.get("name")),
      email: String(form.get("email")),
      title: String(form.get("title")),
      territory: String(form.get("territory")),
      accountStatus: "none",
    }]);
    event.currentTarget.reset();
    setShowForm(false);
  }

  return (
    <section className="panel employee-panel">
      <div className="panel-head"><div><p className="eyebrow">Employee directory</p><h2>{employees.length} employees</h2></div><button className="button button-secondary button-small" onClick={() => setShowForm((open) => !open)}><Plus size={16} />Add employee</button></div>
      {showForm ? <form className="inline-create-form" onSubmit={addEmployee}><div className="field"><label htmlFor="employee-name">Full name</label><input id="employee-name" name="name" required /></div><div className="field"><label htmlFor="employee-email">Work email</label><input id="employee-email" name="email" type="email" required /></div><div className="field"><label htmlFor="employee-title">Job title</label><input id="employee-title" name="title" required /></div><div className="field"><label htmlFor="employee-territory">Territory</label><input id="employee-territory" name="territory" required /></div><button className="button button-primary"><UserRoundPlus size={17} />Create employee</button></form> : null}
      <div className="employee-table-head"><span>Employee</span><span>Role</span><span>Territory</span><span>Account</span></div>
      <div className="employee-list">
        {employees.map((employee) => <article key={employee.id}><span className="avatar">{employee.name.split(" ").map((part) => part[0]).join("").slice(0, 2)}</span><div className="employee-name"><strong>{employee.name}</strong><span>{employee.id} · {employee.email}</span></div><span className="employee-meta"><BriefcaseBusiness size={14} />{employee.title}</span><span className="employee-meta"><MapPin size={14} />{employee.territory}</span><span className={`account-status account-${employee.accountStatus}`}>{employee.accountStatus === "linked" ? <Check size={13} /> : <CircleUserRound size={13} />}{statusLabels[employee.accountStatus]}</span></article>)}
      </div>
    </section>
  );
}
