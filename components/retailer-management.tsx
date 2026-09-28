"use client";

import type { RetailBrand, RetailCompany, RetailLocation, RetailOwner } from "@/lib/domain-data";
import { Building2, ChevronRight, MapPin, Network, Plus, Store, UsersRound } from "lucide-react";
import { useState } from "react";
import { createRetailBrand, createRetailLocation } from "@/app/(app)/master-data-actions";

export function RetailerManagement({ companies, brands, locations, owners }: { companies: RetailCompany[]; brands: RetailBrand[]; locations: RetailLocation[]; owners: RetailOwner[] }) {
  const [companyId, setCompanyId] = useState(companies[0]?.id || "");
  const companyBrands = brands.filter((brand) => brand.companyId === companyId);
  const [brandId, setBrandId] = useState(brands[0]?.id || "");
  const [showBrandForm, setShowBrandForm] = useState(false);
  const [showLocationForm, setShowLocationForm] = useState(false);
  const activeBrand = brands.find((brand) => brand.id === brandId) || companyBrands[0];
  const visibleLocations = locations.filter((location) => location.retailBrandId === activeBrand?.id);

  function chooseCompany(id: string) {
    setCompanyId(id);
    const firstBrand = brands.find((brand) => brand.companyId === id);
    if (firstBrand) setBrandId(firstBrand.id);
  }

  return (
    <>
      <section className="retailer-layout">
        <aside className="panel hierarchy-panel">
          <div className="panel-head"><div><p className="eyebrow">Hierarchy</p><h2>Retail companies</h2></div><Network size={20} /></div>
          <div className="retailer-tree">
            {companies.map((company) => <div key={company.id}><button className={company.id === companyId ? "company-node selected" : "company-node"} onClick={() => chooseCompany(company.id)}><span className="tree-icon"><Building2 size={16} /></span><span><strong>{company.name}</strong><small>{brands.filter((brand) => brand.companyId === company.id).length} retail brands</small></span><ChevronRight size={15} /></button>{company.id === companyId ? <div className="brand-branches">{companyBrands.map((brand) => <button className={brand.id === activeBrand?.id ? "brand-node selected" : "brand-node"} key={brand.id} onClick={() => setBrandId(brand.id)}><i /><span>{brand.name}</span><small>{brand.model}</small></button>)}<button className="tree-add" onClick={() => setShowBrandForm((open) => !open)}><Plus size={14} />Add sub-brand</button></div> : null}</div>)}
          </div>
          {showBrandForm ? <form className="tree-form" action={createRetailBrand}><input type="hidden" name="companyId" value={companyId} /><div className="field"><label htmlFor="retail-brand-name">Brand name</label><input id="retail-brand-name" name="name" required autoFocus /></div><div className="field"><label htmlFor="retail-model">Operating model</label><select id="retail-model" name="model"><option value="corporate">Corporate</option><option value="franchise">Franchise</option><option value="mixed">Mixed</option></select></div><button className="button button-primary">Create brand</button></form> : null}
        </aside>

        <div className="retailer-main">
          <section className="panel retailer-summary">
            <div className="retailer-brand-head"><div className="retailer-logo lime"><Store size={25} /></div><div><p className="eyebrow">Retail brand</p><h2>{activeBrand?.name || "Import or add a retail brand"}</h2><p>{companies.find((company) => company.id === activeBrand?.companyId)?.name} {activeBrand ? <>· <b>{activeBrand.model}</b> model</> : null}</p></div>{activeBrand ? <button className="button button-secondary" onClick={() => setShowLocationForm((open) => !open)}><Plus size={16} />Add location</button> : null}</div>
            <div className="retailer-stats"><div><span>Locations</span><strong>{visibleLocations.length}</strong></div><div><span>Provinces</span><strong>{new Set(visibleLocations.map((location) => location.province)).size}</strong></div><div><span>Owners</span><strong>{new Set(visibleLocations.map((location) => location.ownerId)).size}</strong></div><div><span>Operating model</span><strong>{activeBrand?.model}</strong></div></div>
          </section>
          {showLocationForm && activeBrand ? <form className="panel location-create-form" action={createRetailLocation}><input type="hidden" name="retailBrandId" value={activeBrand.id} /><div className="form-grid"><div className="field field-span"><label htmlFor="location-name">Location name</label><input id="location-name" name="name" placeholder={`${activeBrand.name} location`} required /></div><div className="field"><label htmlFor="location-city">City</label><input id="location-city" name="city" required /></div><div className="field"><label htmlFor="location-province">Province</label><input id="location-province" name="province" required /></div><div className="field"><label htmlFor="location-format">Store format</label><input id="location-format" name="format" placeholder="Supermarket" required /></div><div className="field"><label htmlFor="location-owner">Owner</label><select id="location-owner" name="ownerId"><option value="">Unassigned</option>{owners.map((owner) => <option value={owner.id} key={owner.id}>{owner.name}</option>)}</select></div></div><button className="button button-primary"><Plus size={16} />Create location</button></form> : null}
          <section className="panel location-panel">
            <div className="panel-head"><div><p className="eyebrow">Location directory</p><h2>{activeBrand?.name} stores</h2></div></div>
            <div className="location-head"><span>Location</span><span>Geography</span><span>Format</span><span>Ownership</span></div>
            <div className="location-list">{visibleLocations.length ? visibleLocations.map((location) => { const owner = owners.find((item) => item.id === location.ownerId); return <article key={location.id}><div><span className="location-pin"><MapPin size={15} /></span><span><strong>{location.name}</strong><small>{location.id.slice(0, 8)}</small></span></div><span>{location.city}<small>{location.province}</small></span><span>{location.format}</span><span className="owner-cell"><UsersRound size={14} /><span><strong>{owner?.name || "Unassigned"}</strong><small>{owner?.type === "franchise_partner" ? "Franchise partner" : owner ? "Corporate owned" : "No owner"}</small></span></span></article>; }) : <div className="empty-directory"><Store size={24} /><strong>No locations yet</strong><span>Add the first location for this retail brand.</span></div>}</div>
          </section>
        </div>
      </section>
    </>
  );
}
