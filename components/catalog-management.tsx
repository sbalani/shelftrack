"use client";

import { productBrands as initialBrands, productSkus as initialSkus, retailBrands } from "@/lib/domain-data";
import { AlertTriangle, Boxes, Building2, Check, Eye, PackagePlus, Plus, Search } from "lucide-react";
import { useState } from "react";

export function CatalogManagement() {
  const [brands, setBrands] = useState(initialBrands);
  const [skus, setSkus] = useState(initialSkus);
  const [relationship, setRelationship] = useState<"own" | "competitor">("own");
  const visibleBrands = brands.filter((brand) => brand.relationship === relationship);
  const [brandId, setBrandId] = useState(initialBrands[0].id);
  const activeBrand = brands.find((brand) => brand.id === brandId && brand.relationship === relationship) || visibleBrands[0];
  const visibleSkus = skus.filter((sku) => sku.brandId === activeBrand?.id);
  const [showBrandForm, setShowBrandForm] = useState(false);
  const [showSkuForm, setShowSkuForm] = useState(false);

  function switchRelationship(value: "own" | "competitor") {
    setRelationship(value);
    const first = brands.find((brand) => brand.relationship === value);
    if (first) setBrandId(first.id);
  }

  function addBrand(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); const form = new FormData(event.currentTarget); const id = `PB-${String(brands.length + 1).padStart(3, "0")}`;
    setBrands((items) => [...items, { id, name: String(form.get("name")), relationship, category: String(form.get("category")) }]); setBrandId(id); setShowBrandForm(false);
  }

  function addSku(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (!activeBrand) return; const form = new FormData(event.currentTarget);
    setSkus((items) => [...items, { id: `SKU-${String(items.length + 1).padStart(3, "0")}`, brandId: activeBrand.id, name: String(form.get("name")), code: relationship === "own" ? String(form.get("code")) : "Observed", pack: String(form.get("pack")), assignments: [], sightings: 0 }]); setShowSkuForm(false);
  }

  return (
    <>
      <section className="catalog-switch"><button className={relationship === "own" ? "active" : ""} onClick={() => switchRelationship("own")}><Check size={17} /><span><strong>Our brands</strong><small>Managed assortment and expected placement</small></span></button><button className={relationship === "competitor" ? "active" : ""} onClick={() => switchRelationship("competitor")}><Eye size={17} /><span><strong>Competitor brands</strong><small>Observed presence and market composition</small></span></button></section>
      <section className="catalog-layout">
        <aside className="panel catalog-brand-panel"><div className="panel-head"><div><p className="eyebrow">Brand portfolio</p><h2>{relationship === "own" ? "Owned brands" : "Competitors"}</h2></div><button className="mini-add" onClick={() => setShowBrandForm((open) => !open)}><Plus size={15} /></button></div>{showBrandForm ? <form className="tree-form" onSubmit={addBrand}><div className="field"><label htmlFor="product-brand-name">Brand name</label><input id="product-brand-name" name="name" required /></div><div className="field"><label htmlFor="product-category">Category</label><input id="product-category" name="category" required /></div><button className="button button-primary">Add brand</button></form> : null}<div className="catalog-brand-list">{visibleBrands.map((brand) => <button key={brand.id} className={brand.id === activeBrand?.id ? "selected" : ""} onClick={() => setBrandId(brand.id)}><span className="brand-letter">{brand.name[0]}</span><span><strong>{brand.name}</strong><small>{brand.category} · {skus.filter((sku) => sku.brandId === brand.id).length} SKUs</small></span></button>)}</div></aside>
        <div className="catalog-main">
          <section className="panel catalog-summary"><div><span className="catalog-icon"><Boxes size={25} /></span><div><p className="eyebrow">{relationship === "own" ? "Owned brand" : "Market brand"}</p><h2>{activeBrand?.name}</h2><p>{activeBrand?.category}</p></div></div><div className="catalog-kpis"><div><span>SKUs</span><strong>{visibleSkus.length}</strong></div><div><span>{relationship === "own" ? "Retail assignments" : "Store sightings"}</span><strong>{relationship === "own" ? visibleSkus.reduce((sum, sku) => sum + sku.assignments.length, 0) : visibleSkus.reduce((sum, sku) => sum + sku.sightings, 0)}</strong></div><div><span>{relationship === "own" ? "Missing placements" : "Areas observed"}</span><strong>{relationship === "own" ? "4" : "7"}</strong></div></div></section>
          <section className="panel sku-panel"><div className="panel-head"><div><p className="eyebrow">SKU catalog</p><h2>{relationship === "own" ? "Expected assortment" : "Observed competitor makeup"}</h2></div><button className="button button-secondary button-small" onClick={() => setShowSkuForm((open) => !open)}><PackagePlus size={16} />Add SKU</button></div>{showSkuForm ? <form className="sku-create-form" onSubmit={addSku}><div className="field"><label htmlFor="sku-name">SKU name</label><input id="sku-name" name="name" required /></div>{relationship === "own" ? <div className="field"><label htmlFor="sku-code">Internal code</label><input id="sku-code" name="code" required /></div> : null}<div className="field"><label htmlFor="sku-pack">Pack / size</label><input id="sku-pack" name="pack" required /></div><button className="button button-primary">Create SKU</button></form> : null}<div className="sku-head"><span>Product</span><span>{relationship === "own" ? "Assigned retailers" : "Observed"}</span><span>{relationship === "own" ? "Placement health" : "Sightings"}</span></div><div className="sku-list">{visibleSkus.map((sku, index) => <article key={sku.id}><div><span className="sku-box">{sku.name.slice(0, 2).toUpperCase()}</span><span><strong>{sku.name}</strong><small>{sku.code} · {sku.pack}</small></span></div>{relationship === "own" ? <div className="assignment-chips">{sku.assignments.map((assignment) => <span key={assignment}><Building2 size={11} />{retailBrands.find((brand) => brand.id === assignment)?.name}</span>)}<button><Plus size={12} />Assign</button></div> : <span className="observed-copy"><Search size={14} />Seen across multiple retailers; assignments inferred from observations</span>}<span className={relationship === "own" && index === 1 ? "placement-gap" : "placement-ok"}>{relationship === "own" ? index === 1 ? <><AlertTriangle size={14} />2 expected stores missing</> : <><Check size={14} />On shelf as expected</> : <><Eye size={14} />{sku.sightings} sightings</>}</span></article>)}</div></section>
        </div>
      </section>
    </>
  );
}
