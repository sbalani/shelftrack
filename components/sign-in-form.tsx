"use client";

import { authClient } from "@/lib/auth/client";
import { ArrowRight, LoaderCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function SignInForm() {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError("");
    const form = new FormData(event.currentTarget);
    const { error: signInError } = await authClient.signIn.email({
      email: String(form.get("email")),
      password: String(form.get("password")),
    });

    if (signInError) {
      setError(signInError.message || "We could not sign you in.");
      setPending(false);
      return;
    }
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <form className="auth-form" onSubmit={submit}>
      <div className="field">
        <label htmlFor="email">Work email</label>
        <input id="email" name="email" type="email" autoComplete="email" placeholder="name@company.com" required />
      </div>
      <div className="field">
        <div className="label-row">
          <label htmlFor="password">Password</label>
          <Link className="muted-link" href="/auth/forgot-password">Set or reset password</Link>
        </div>
        <input id="password" name="password" type="password" autoComplete="current-password" placeholder="Enter your password" required />
      </div>
      {error ? <p className="form-error" role="alert">{error}</p> : null}
      <button className="button button-primary button-wide" type="submit" disabled={pending}>
        {pending ? <LoaderCircle className="spin" size={18} /> : null}
        {pending ? "Signing in" : "Sign in"}
        {!pending ? <ArrowRight size={18} /> : null}
      </button>
      <p className="form-note">Accounts are issued by your ShelfTrack administrator.</p>
    </form>
  );
}
