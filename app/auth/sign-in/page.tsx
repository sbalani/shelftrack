import { SignInForm } from "@/components/sign-in-form";
import { auth } from "@/lib/auth/server";
import { BarChart3, Camera, MapPin } from "lucide-react";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function SignInPage() {
  const { data: session } = await auth.getSession();
  if (session?.user) redirect("/dashboard");

  return (
    <main className="auth-page">
      <section className="auth-story">
        <div className="brand brand-light"><span className="brand-mark">ST</span><span>ShelfTrack</span></div>
        <div className="story-copy">
          <p className="eyebrow light">Retail visibility, from the aisle</p>
          <h1>See every shelf.<br /><em>Know every store.</em></h1>
          <p>Give field teams one fast, reliable way to capture what is happening in-store.</p>
        </div>
        <div className="story-features">
          <div><Camera size={20} /><span>Guided photo capture</span></div>
          <div><MapPin size={20} /><span>Location-verified visits</span></div>
          <div><BarChart3 size={20} /><span>One operational view</span></div>
        </div>
      </section>
      <section className="auth-panel">
        <div className="auth-card">
          <div className="mobile-brand brand"><span className="brand-mark">ST</span><span>ShelfTrack</span></div>
          <p className="eyebrow">Team access</p>
          <h2>Welcome back</h2>
          <p className="auth-intro">Sign in to capture store visits and review shelf activity.</p>
          <SignInForm />
        </div>
      </section>
    </main>
  );
}
