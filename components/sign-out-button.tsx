"use client";

import { authClient } from "@/lib/auth/client";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function SignOutButton() {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  return (
    <button
      className="icon-button"
      title="Sign out"
      disabled={pending}
      onClick={async () => {
        setPending(true);
        await authClient.signOut();
        router.push("/auth/sign-in");
        router.refresh();
      }}
    >
      <LogOut size={19} />
      <span className="sr-only">Sign out</span>
    </button>
  );
}
