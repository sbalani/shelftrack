"use client";

import { StatusPill } from "@/components/status-pill";
import type { DisplayType, ShelfPhoto, Submission } from "@/lib/demo-data";
import { ArrowLeft, Bot, Check, ChevronRight, MapPin, Plus, Save, Sparkles, Tag, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const displayLabels: Record<DisplayType, string> = {
  primary: "Primary shelf",
  secondary: "Secondary display",
  additional: "Additional display",
};

function ShelfVisual({ photo, compact = false }: { photo: ShelfPhoto; compact?: boolean }) {
  return (
    <div className={`shelf-visual ${photo.accent} ${compact ? "compact" : ""}`}>
      <div className="product-row row-one"><i /><i /><i /><i /><i /><i /><i /></div>
      <div className="product-row row-two"><i /><i /><i /><i /><i /><i /></div>
      <div className="product-row row-three"><i /><i /><i /><i /><i /><i /><i /><i /></div>
      <span className="visual-angle">{photo.angle}</span>
    </div>
  );
}

function TokenEditor({ title, hint, values, onAdd, onRemove }: { title: string; hint: string; values: string[]; onAdd: (value: string) => void; onRemove: (value: string) => void }) {
  const [draft, setDraft] = useState("");
  function add() {
    const value = draft.trim();
    if (!value || values.includes(value)) return;
    onAdd(value);
    setDraft("");
  }
  return (
    <div className="annotation-block">
      <div className="annotation-heading"><div><strong>{title}</strong><span>{hint}</span></div><Tag size={16} /></div>
      <div className="token-list">{values.map((value) => <span key={value}>{value}<button type="button" onClick={() => onRemove(value)} aria-label={`Remove ${value}`}><X size={12} /></button></span>)}</div>
      <div className="token-input"><input value={draft} onChange={(event) => setDraft(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") { event.preventDefault(); add(); } }} placeholder={`Add ${title.toLowerCase()}`} /><button type="button" onClick={add}><Plus size={15} />Add</button></div>
    </div>
  );
}

export function SubmissionWorkspace({ submission }: { submission: Submission }) {
  const [photos, setPhotos] = useState(submission.photos);
  const [selectedId, setSelectedId] = useState(submission.photos[0].id);
  const [saved, setSaved] = useState(false);
  const selected = photos.find((photo) => photo.id === selectedId) || photos[0];

  function updateSelected(update: Partial<ShelfPhoto>) {
    setSaved(false);
    setPhotos((items) => items.map((photo) => photo.id === selected.id ? { ...photo, ...update } : photo));
  }

  const categories = Array.from(new Set(photos.map((photo) => photo.category)));
  const shelfAreas = Array.from(new Set(photos.map((photo) => photo.shelfArea)));
  const brandValues = selected.brands.map((brand) => brand.name);
  const skuValues = selected.skus.map((sku) => sku.name);

  return (
    <main className="page submission-detail-page">
      <Link href="/submissions" className="back-link"><ArrowLeft size={16} />All submissions</Link>
      <header className="detail-head">
        <div><div className="detail-title-row"><h1>{submission.store}</h1><StatusPill status={submission.status} /></div><p><span>{submission.id}</span><MapPin size={14} />{submission.area}<span>{submission.capturedAt}</span></p></div>
        <button className="button button-primary" onClick={() => setSaved(true)}>{saved ? <Check size={18} /> : <Save size={18} />}{saved ? "Changes saved" : "Save review"}</button>
      </header>

      <section className="visit-strip">
        <div><span>Collector</span><strong>{submission.collectedBy}</strong></div><div><span>Submitted by</span><strong>{submission.submittedBy}</strong></div><div><span>Images</span><strong>{photos.length}</strong></div><div><span>Categories</span><strong>{categories.length}</strong></div><div><span>Shelf areas</span><strong>{shelfAreas.length}</strong></div>
      </section>

      <section className="analysis-layout">
        <aside className="image-rail panel">
          <div className="workspace-heading"><div><p className="eyebrow">Image set</p><h2>{photos.length} shelf views</h2></div><span>All angles</span></div>
          <div className="area-groups">
            {shelfAreas.map((area) => (
              <div className="area-group" key={area}>
                <div className="area-label"><span>{area}</span><small>{photos.filter((photo) => photo.shelfArea === area).length} image{photos.filter((photo) => photo.shelfArea === area).length === 1 ? "" : "s"}</small></div>
                {photos.filter((photo) => photo.shelfArea === area).map((photo) => (
                  <button className={`photo-rail-card ${selected.id === photo.id ? "selected" : ""}`} onClick={() => setSelectedId(photo.id)} key={photo.id}>
                    <ShelfVisual photo={photo} compact />
                    <span><strong>{photo.label}</strong><small>{displayLabels[photo.displayType]} · AI {photo.aiConfidence}%</small></span>
                    <ChevronRight size={16} />
                  </button>
                ))}
              </div>
            ))}
          </div>
        </aside>

        <div className="review-column">
          <section className="selected-photo panel">
            <ShelfVisual photo={selected} />
            <div className="photo-caption"><div><span>{selected.id}</span><strong>{selected.label}</strong></div><span className="ai-score"><Sparkles size={14} />AI confidence {selected.aiConfidence}%</span></div>
          </section>

          <section className="panel annotation-panel">
            <div className="workspace-heading"><div><p className="eyebrow">Human review</p><h2>Image classification</h2></div><span className="ai-draft"><Bot size={14} />AI draft</span></div>
            <div className="classification-grid">
              <div className="field"><label htmlFor="category">Category</label><input id="category" value={selected.category} onChange={(event) => updateSelected({ category: event.target.value })} /></div>
              <div className="field"><label htmlFor="shelf-area">Shelf area</label><input id="shelf-area" value={selected.shelfArea} onChange={(event) => updateSelected({ shelfArea: event.target.value })} /></div>
              <div className="field"><label htmlFor="angle">Image angle / side</label><select id="angle" value={selected.angle} onChange={(event) => updateSelected({ angle: event.target.value })}><option>Front / full bay</option><option>Front / close</option><option>Left section</option><option>Right section</option><option>Left oblique</option><option>Right oblique</option></select></div>
              <div className="field"><label htmlFor="display-type">Display type</label><select id="display-type" value={selected.displayType} onChange={(event) => updateSelected({ displayType: event.target.value as DisplayType })}><option value="primary">Primary shelf</option><option value="secondary">Secondary display</option><option value="additional">Additional display</option></select></div>
            </div>
            <TokenEditor title="Brands visible" hint="AI suggested · editable" values={brandValues} onAdd={(name) => updateSelected({ brands: [...selected.brands, { name, confidence: 0, humanVerified: true }] })} onRemove={(name) => updateSelected({ brands: selected.brands.filter((brand) => brand.name !== name) })} />
            <TokenEditor title="SKUs visible" hint="AI suggested · editable" values={skuValues} onAdd={(name) => updateSelected({ skus: [...selected.skus, { name, brand: "Unassigned", confidence: 0, humanVerified: true }] })} onRemove={(name) => updateSelected({ skus: selected.skus.filter((sku) => sku.name !== name) })} />
          </section>
        </div>

        <aside className="insight-column">
          <section className="insight-card dark">
            <div className="workspace-heading"><div><p className="eyebrow light">AI extraction</p><h2>Image data points</h2></div><Sparkles size={20} /></div>
            <div className="data-point"><span>Estimated facings</span><strong>{selected.facings}</strong></div>
            <div className="data-point"><span>Leading brand share</span><strong>{selected.estimatedShare}%</strong></div>
            <div className="data-point"><span>Brands detected</span><strong>{selected.brands.length}</strong></div>
            <div className="data-point"><span>SKUs detected</span><strong>{selected.skus.length}</strong></div>
            <p>Estimates become reportable after human verification.</p>
          </section>
          <section className="panel share-card">
            <div className="workspace-heading"><div><p className="eyebrow">Share of shelf</p><h2>Detected brands</h2></div></div>
            {selected.brands.slice(0, 4).map((brand, index) => {
              const share = Math.max(8, selected.estimatedShare - index * 9);
              return <div className="share-row" key={brand.name}><div><span>{brand.name}</span><strong>{index === 0 ? share : Math.min(share, 27)}%</strong></div><div className="share-bar"><i style={{ width: `${index === 0 ? share : Math.min(share, 27)}%` }} /></div><small>{brand.humanVerified ? "Human verified" : `${brand.confidence}% AI confidence`}</small></div>;
            })}
          </section>
          <section className="trend-ready"><span><Bot size={18} /></span><div><strong>Ready for trend reporting</strong><p>Category, area, display type, brands, SKUs and facings can be compared by store and visit date.</p></div></section>
        </aside>
      </section>
    </main>
  );
}
