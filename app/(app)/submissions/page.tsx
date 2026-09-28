import { StatusPill } from "@/components/status-pill";
import { submissions } from "@/lib/demo-data";
import { CalendarDays, Filter, MapPin, Search } from "lucide-react";
import Link from "next/link";

export default function SubmissionsPage() {
  return (
    <main className="page">
      <header className="page-head compact"><div><p className="eyebrow">Field records</p><h1>Submissions</h1><p>Review shelf visits, photo counts, ownership, and processing status.</p></div></header>
      <section className="toolbar"><label className="search-box"><Search size={18} /><input placeholder="Search stores, people, or IDs" /></label><button className="button button-secondary"><CalendarDays size={17} />Date</button><button className="button button-secondary"><Filter size={17} />Filters</button></section>
      <section className="panel table-panel">
        <div className="data-table-head"><span>Store visit</span><span>Collected by</span><span>Photos</span><span>Status</span><span>Captured</span></div>
        {!submissions.length ? <div className="shelf-empty-state large"><div className="shelf-thumb mint" /><div><strong>No submission data</strong><span>New field captures will populate this workspace.</span></div></div> : null}
        {submissions.map((item) => (
          <Link className="data-table-row" href={`/submissions/${item.id}`} key={item.id}>
            <div className="table-store"><div className={`shelf-thumb ${item.accent}`}><i /><i /><i /></div><div><strong>{item.store}</strong><span>{item.id} · <MapPin size={12} />{item.area}</span></div></div>
            <span data-label="Collected by">{item.collectedBy}</span><span data-label="Photos">{item.photos.length}</span><span data-label="Status"><StatusPill status={item.status} /></span><time data-label="Captured">{item.capturedAt}</time>
          </Link>
        ))}
      </section>
    </main>
  );
}
