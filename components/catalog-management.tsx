"use client";

import { createProductBrand, createProductSku } from "@/app/(app)/master-data-actions";
import type { ProductBrand, ProductSku, RetailBrand } from "@/lib/domain-data";
import { AlertTriangle, Boxes, Building2, Check, Eye, PackagePlus, Plus, Search } from "lucide-react";
import { useState } from "react";

export function CatalogManagement({ brands, skus, retailBrands }: { brands: ProductBrand[]; skus: ProductSku[]; retailBrands: RetailBrand[] }) {
  const [relationship, setRelationship] = useState<"own" | "competitor">("own");
  const visibleBrands = brands.filter((brand) => brand.relationship === relationship);
  const [brandId, setBrandId] = useState(brands[0]?.id || "");
  const activeBrand = brands.find((brand) => brand.id === brandId && brand.relationship === relationship) || visibleBrands[0];
  const visibleSkus = skus.filter((sku) => sku.brandId === activeBrand?.id);
  const [showBrandForm, setShowBrandForm] = useState(false);
  const [showSkuForm, setShowSkuForm] = useState(false);
  const assignmentCount = visibleSkus.reduce((sum, sku) => sum + sku.assignments.length, 0);
  const sightingCount = visibleSkus.reduce((sum, sku) => sum + sku.sightings, 0);
  const unassignedCount = visibleSkus.filter((sku) => !sku.assignments.length).length;
  const observedCount = visibleSkus.filter((sku) => sku.sightings > 0).length;

  function switchRelationship(value: "own" | "competitor") {
    setRelationship(value);
    const first = brands.find((brand) => brand.relationship === value);
    setBrandId(first?.id || "");
  }

  return (
    <>
      <section className="catalog-switch">
        <button className={relationship === "own" ? "active" : ""} onClick={() => switchRelationship("own")}><Check size={17} /><span><strong>Our brands</strong><small>Managed assortment and expected placement</small></span></button>
        <button className={relationship === "competitor" ? "active" : ""} onClick={() => switchRelationship("competitor")}><Eye size={17} /><span><strong>Competitor brands</strong><small>Observed presence and market composition</small></span></button>
      </section>

      <section className="catalog-layout">
        <aside className="panel catalog-brand-panel">
          <div className="panel-head"><div><p className="eyebrow">Brand portfolio</p><h2>{relationship === "own" ? "Owned brands" : "Competitors"}</h2></div><button className="mini-add" onClick={() => setShowBrandForm((open) => !open)}><Plus size={15} /></button></div>
          {showBrandForm ? <form className="tree-form" action={createProductBrand}><input type="hidden" name="relationship" value={relationship} /><div className="field"><label htmlFor="product-brand-name">Brand name</label><input id="product-brand-name" name="name" required /></div><div className="field"><label htmlFor="product-category">Category</label><input id="product-category" name="category" required /></div><button className="button button-primary">Add brand</button></form> : null}
          <div className="catalog-brand-list">
            {visibleBrands.length ? visibleBrands.map((brand) => <button key={brand.id} className={brand.id === activeBrand?.id ? "selected" : ""} onClick={() => setBrandId(brand.id)}><span className="brand-letter">{brand.name[0]}</span><span><strong>{brand.name}</strong><small>{brand.category} · {skus.filter((sku) => sku.brandId === brand.id).length} SKUs</small></span></button>) : <div className="empty-directory"><Boxes size={23} /><strong>No brands yet</strong><span>Add one or upload CSV.</span></div>}
          </div>
        </aside>

        <div className="catalog-main">
          <section className="panel catalog-summary">
            <div><span className="catalog-icon"><Boxes size={25} /></span><div><p className="eyebrow">{relationship === "own" ? "Owned brand" : "Market brand"}</p><h2>{activeBrand?.name || "No brand selected"}</h2><p>{activeBrand?.category}</p></div></div>
            <div className="catalog-kpis"><div><span>SKUs</span><strong>{visibleSkus.length}</strong></div><div><span>{relationship === "own" ? "Retail assignments" : "Store sightings"}</span><strong>{relationship === "own" ? assignmentCount : sightingCount}</strong></div><div><span>{relationship === "own" ? "Unassigned SKUs" : "SKUs observed"}</span><strong>{relationship === "own" ? unassignedCount : observedCount}</strong></div></div>
          </section>

          <section className="panel sku-panel">
            <div className="panel-head"><div><p className="eyebrow">SKU catalog</p><h2>{relationship === "own" ? "Expected assortment" : "Observed competitor makeup"}</h2></div>{activeBrand ? <button className="button button-secondary button-small" onClick={() => setShowSkuForm((open) => !open)}><PackagePlus size={16} />Add SKU</button> : null}</div>
            {showSkuForm && activeBrand ? <form className="sku-create-form" action={createProductSku}><input type="hidden" name="brandId" value={activeBrand.id} /><div className="field"><label htmlFor="sku-name">SKU name</label><input id="sku-name" name="name" required /></div>{relationship === "own" ? <div className="field"><label htmlFor="sku-code">Internal code</label><input id="sku-code" name="code" required /></div> : <input type="hidden" name="code" value="" />}<div className="field"><label htmlFor="sku-pack">Pack / size</label><input id="sku-pack" name="pack" required /></div><button className="button button-primary">Create SKU</button></form> : null}
            <div className="sku-head"><span>Product</span><span>{relationship === "own" ? "Assigned retailers" : "Observed"}</span><span>{relationship === "own" ? "Assignment status" : "Sightings"}</span></div>
            <div className="sku-list">
              {visibleSkus.map((sku) => <article key={sku.id}><div><span className="sku-box">{sku.name.slice(0, 2).toUpperCase()}</span><span><strong>{sku.name}</strong><small>{sku.code || "Observed"} · {sku.packSize}</small></span></div>{relationship === "own" ? <div className="assignment-chips">{sku.assignments.map((assignment) => <span key={assignment}><Building2 size={11} />{retailBrands.find((brand) => brand.id === assignment)?.name}</span>)}<button type="button"><Plus size={12} />Assign via CSV</button></div> : <span className="observed-copy"><Search size={14} />Sightings are generated from verified shelf observations</span>}<span className={relationship === "own" && !sku.assignments.length ? "placement-gap" : "placement-ok"}>{relationship === "own" ? sku.assignments.length ? <><Check size={14} />Assigned to {sku.assignments.length} retailer{sku.assignments.length === 1 ? "" : "s"}</> : <><AlertTriangle size={14} />No retailer assignment</> : <><Eye size={14} />{sku.sightings} sightings</>}</span></article>)}
            </div>
          </section>
        </div>
      </section>
    </>
  );
}
