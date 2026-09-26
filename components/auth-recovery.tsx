"use client";

import { authClient } from "@/lib/auth/client";
import { AuthView, NeonAuthUIProvider } from "@neondatabase/auth-ui";
import Link from "next/link";

export function AuthRecovery({ path }: { path: "forgot-password" | "reset-password" }) {
  return (
    <main className="recovery-page">
      <div className="recovery-shell">
        <Link href="/auth/sign-in" className="brand"><span className="brand-mark">ST</span><span>ShelfTrack</span></Link>
        <NeonAuthUIProvider authClient={authClient} defaultTheme="light">
          <AuthView path={path} redirectTo="/dashboard" />
        </NeonAuthUIProvider>
      </div>
    </main>
  );
}
