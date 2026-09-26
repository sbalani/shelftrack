import { CaptureForm } from "@/components/capture-form";
import { auth } from "@/lib/auth/server";
import { canSubmitForOthers, getUserRole } from "@/lib/permissions";

export default async function CapturePage() {
  const { data: session } = await auth.getSession();
  const role = getUserRole((session?.user || {}) as { role?: unknown; appRole?: unknown });
  return (
    <main className="page capture-page">
      <header className="page-head compact"><div><p className="eyebrow">New field record</p><h1>Capture a shelf visit</h1><p>Add clear shelf photos and visit details. You can review everything before submitting.</p></div></header>
      <CaptureForm currentUser={session?.user.name || "Team member"} allowDelegation={canSubmitForOthers(role)} />
    </main>
  );
}
