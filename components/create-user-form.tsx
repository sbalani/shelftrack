"use client";

import { createUser } from "@/app/(app)/users/actions";
import { roleLabels, roles } from "@/lib/permissions";
import { Check, LoaderCircle, UserPlus } from "lucide-react";
import { useActionState, useEffect, useRef } from "react";

export function CreateUserForm() {
  const [state, action, pending] = useActionState(createUser, null);
  const formRef = useRef<HTMLFormElement>(null);
  useEffect(() => { if (state?.success) formRef.current?.reset(); }, [state]);

  return (
    <form ref={formRef} action={action} className="create-user-form">
      <div className="form-grid">
        <div className="field"><label htmlFor="name">Full name</label><input id="name" name="name" placeholder="Team member name" required /></div>
        <div className="field"><label htmlFor="email">Work email</label><input id="email" name="email" type="email" placeholder="name@company.com" required /></div>
        <div className="field"><label htmlFor="role">Permission level</label><select id="role" name="role" defaultValue="user">{roles.map((role) => <option key={role} value={role}>{roleLabels[role]}</option>)}</select></div>
        <div className="field"><label htmlFor="password">Temporary password</label><input id="password" name="password" type="password" minLength={8} placeholder="Minimum 8 characters" required /></div>
      </div>
      {state?.error ? <p className="form-error">{state.error}</p> : null}
      {state?.success ? <p className="form-success"><Check size={16} />{state.success}</p> : null}
      <button className="button button-primary" disabled={pending}>{pending ? <LoaderCircle className="spin" size={18} /> : <UserPlus size={18} />}{pending ? "Creating user" : "Create user"}</button>
    </form>
  );
}
