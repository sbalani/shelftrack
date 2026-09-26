import { StatusPill } from "@/components/status-pill";
import { auth } from "@/lib/auth/server";
import { submissions } from "@/lib/demo-data";
import { ArrowRight, Camera, CheckCircle2, Clock3, Images, MapPin, Plus } from "lucide-react";
import Link from "next/link";

export default async function DashboardPage() {
  const { data: session } = await auth.getSession();
  const firstName = session?.user.name?.split(" ")[0] || "there";

  return (
    <main className="page dashboard-page">
      <header className="page-head">
        <div><p className="eyebrow">Saturday, 26 September</p><h1>Good afternoon, {firstName}.</h1><p>Here is what your field team has captured today.</p></div>
        <Link href="/capture" className="button button-primary"><Plus size={18} />New shelf capture</Link>
      </header>

      <section className="metric-grid" aria-label="Today at a glance">
        <article className="metric-card"><span className="metric-icon coral"><Camera size={21} /></span><div><span>Captures today</span><strong>24</strong><small><b>+18%</b> from last Saturday</small></div></article>
        <article className="metric-card"><span className="metric-icon lime"><Images size={21} /></span><div><span>Photos collected</span><strong>146</strong><small>Across 9 store visits</small></div></article>
        <article className="metric-card"><span className="metric-icon aqua"><CheckCircle2 size={21} /></span><div><span>Verified</span><strong>19</strong><small>79% completion rate</small></div></article>
        <article className="metric-card"><span className="metric-icon sand"><Clock3 size={21} /></span><div><span>Needs review</span><strong>5</strong><small>Oldest waiting 2h 14m</small></div></article>
      </section>

      <section className="dashboard-grid">
        <div className="panel activity-panel">
          <div className="panel-head"><div><p className="eyebrow">Live activity</p><h2>Latest submissions</h2></div><Link href="/submissions" className="text-link">View all <ArrowRight size={16} /></Link></div>
          <div className="submission-list">
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
          <div className="panel-head"><div><p className="eyebrow">Coverage</p><h2>Today&apos;s route</h2></div><span className="count-badge">9 / 12</span></div>
          <div className="route-map" aria-label="Stylized map of Jakarta store visits">
            <span className="road road-a" /><span className="road road-b" /><span className="road road-c" />
            <i className="map-pin pin-a">1</i><i className="map-pin pin-b">2</i><i className="map-pin pin-c">3</i><i className="map-pin pin-d muted">4</i>
            <span className="map-label label-a">SCBD</span><span className="map-label label-b">Kemang</span><span className="map-label label-c">Pondok Indah</span>
          </div>
          <div className="progress-copy"><span>Route progress</span><strong>75%</strong></div>
          <div className="progress"><i style={{ width: "75%" }} /></div>
          <p className="coverage-note">3 stores remain on today&apos;s South Jakarta route.</p>
        </aside>
      </section>
    </main>
  );
}
