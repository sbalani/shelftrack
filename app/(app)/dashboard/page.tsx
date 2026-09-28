import { StatusPill } from "@/components/status-pill";
import { auth } from "@/lib/auth/server";
import { submissions } from "@/lib/demo-data";
import { ArrowRight, Camera, CheckCircle2, Clock3, Images, MapPin, Plus } from "lucide-react";
import Link from "next/link";

export default async function DashboardPage() {
  const { data: session } = await auth.getSession();
  const firstName = session?.user.name?.split(" ")[0] || "there";
  const today = new Intl.DateTimeFormat("en", { weekday: "long", day: "numeric", month: "long" }).format(new Date());

  return (
    <main className="page dashboard-page">
      <header className="page-head">
        <div><p className="eyebrow">{today}</p><h1>Good afternoon, {firstName}.</h1><p>Here is what your field team has captured today.</p></div>
        <Link href="/capture" className="button button-primary"><Plus size={18} />New shelf capture</Link>
      </header>

      <section className="metric-grid" aria-label="Today at a glance">
        <article className="metric-card"><span className="metric-icon coral"><Camera size={21} /></span><div><span>Captures today</span><strong>0</strong><small>Waiting for the first visit</small></div></article>
        <article className="metric-card"><span className="metric-icon lime"><Images size={21} /></span><div><span>Photos collected</span><strong>0</strong><small>No images uploaded yet</small></div></article>
        <article className="metric-card"><span className="metric-icon aqua"><CheckCircle2 size={21} /></span><div><span>Verified</span><strong>0</strong><small>No reviews completed</small></div></article>
        <article className="metric-card"><span className="metric-icon sand"><Clock3 size={21} /></span><div><span>Needs review</span><strong>0</strong><small>Review queue is clear</small></div></article>
      </section>

      <section className="dashboard-grid">
        <div className="panel activity-panel">
          <div className="panel-head"><div><p className="eyebrow">Live activity</p><h2>Latest submissions</h2></div><Link href="/submissions" className="text-link">View all <ArrowRight size={16} /></Link></div>
          <div className="submission-list">
            {!submissions.length ? <div className="shelf-empty-state"><div className="shelf-thumb orange" /><div><strong>No shelf submissions yet</strong><span>Real captures will appear here after your first field visit.</span></div><Link href="/capture" className="button button-secondary">Create first capture</Link></div> : null}
            {submissions.map((item) => (
              <Link className="submission-row" href={`/submissions/${item.id}`} key={item.id}>
                <div className={`shelf-thumb ${item.accent}`} aria-hidden="true"><i /><i /><i /></div>
                <div className="submission-main"><strong>{item.store}</strong><span><MapPin size={14} />{item.area}</span><small>{item.collectedBy} · {item.photos.length} photos</small></div>
                <div className="submission-meta"><StatusPill status={item.status} /><time>{item.capturedAt}</time></div>
              </Link>
            ))}
          </div>
        </div>

        <aside className="panel coverage-panel">
          <div className="panel-head"><div><p className="eyebrow">Coverage</p><h2>Today&apos;s route</h2></div><span className="count-badge">0 visits</span></div>
          <div className="route-map" aria-label="No mapped store visits">
            <span className="road road-a" /><span className="road road-b" /><span className="road road-c" />
            <span className="map-empty">No visits mapped</span>
          </div>
          <div className="progress-copy"><span>Route progress</span><strong>0%</strong></div>
          <div className="progress"><i style={{ width: "0%" }} /></div>
          <p className="coverage-note">Coverage begins when field visits are submitted.</p>
        </aside>
      </section>
    </main>
  );
}
