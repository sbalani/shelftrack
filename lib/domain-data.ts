export type Employee = {
  id: string;
  name: string;
  email: string;
  title: string;
  territory: string;
  accountStatus: "linked" | "invited" | "none";
  accountRole?: "user" | "data_entry" | "admin";
};

export const employees: Employee[] = [
  { id: "EMP-001", name: "Sharan Balani", email: "sharan@rubiyat.co.id", title: "Commercial Director", territory: "National", accountStatus: "linked", accountRole: "admin" },
  { id: "EMP-014", name: "Dimas Pratama", email: "dimas@rubiyat.co.id", title: "Field Auditor", territory: "Greater Jakarta", accountStatus: "none" },
  { id: "EMP-021", name: "Maya Sari", email: "maya@rubiyat.co.id", title: "Merchandising Lead", territory: "West Java", accountStatus: "linked", accountRole: "data_entry" },
  { id: "EMP-026", name: "Rina Hartono", email: "rina@rubiyat.co.id", title: "Sales Executive", territory: "Central Java", accountStatus: "none" },
  { id: "EMP-031", name: "Arif Nugroho", email: "arif@rubiyat.co.id", title: "Field Auditor", territory: "East Java", accountStatus: "invited", accountRole: "user" },
];

export type RetailOwner = { id: string; name: string; type: "corporate" | "franchise_partner" };
export type RetailLocation = { id: string; name: string; brandId: string; city: string; province: string; format: string; ownerId: string };
export type RetailBrand = { id: string; name: string; parentId: string; model: "corporate" | "franchise" | "mixed"; color: string };
export type RetailCompany = { id: string; name: string; geography: string };

export const retailCompanies: RetailCompany[] = [
  { id: "RET-001", name: "Supra Retail Group", geography: "Indonesia" },
  { id: "RET-002", name: "Nusantara Commerce", geography: "Indonesia" },
  { id: "RET-003", name: "Independent Retailers", geography: "Indonesia" },
];

export const retailBrands: RetailBrand[] = [
  { id: "RB-001", name: "Ranch Market", parentId: "RET-001", model: "corporate", color: "mint" },
  { id: "RB-002", name: "Farmers Market", parentId: "RET-001", model: "corporate", color: "orange" },
  { id: "RB-003", name: "FreshMart", parentId: "RET-002", model: "mixed", color: "blue" },
  { id: "RB-004", name: "DailyBox", parentId: "RET-002", model: "franchise", color: "lime" },
  { id: "RB-005", name: "Independent", parentId: "RET-003", model: "mixed", color: "sand" },
];

export const retailOwners: RetailOwner[] = [
  { id: "OWN-001", name: "Supra Retail Group", type: "corporate" },
  { id: "OWN-002", name: "Nusantara Commerce", type: "corporate" },
  { id: "OWN-014", name: "PT Mitra Niaga Selatan", type: "franchise_partner" },
  { id: "OWN-018", name: "CV Bandung Makmur", type: "franchise_partner" },
  { id: "OWN-021", name: "Sari Family Retail", type: "franchise_partner" },
];

export const retailLocations: RetailLocation[] = [
  { id: "LOC-001", name: "Ranch Market Pondok Indah", brandId: "RB-001", city: "Jakarta Selatan", province: "DKI Jakarta", format: "Premium supermarket", ownerId: "OWN-001" },
  { id: "LOC-002", name: "Ranch Market Grand Indonesia", brandId: "RB-001", city: "Jakarta Pusat", province: "DKI Jakarta", format: "Premium supermarket", ownerId: "OWN-001" },
  { id: "LOC-003", name: "Farmers Market Summarecon", brandId: "RB-002", city: "Bekasi", province: "West Java", format: "Supermarket", ownerId: "OWN-001" },
  { id: "LOC-004", name: "DailyBox Kemang", brandId: "RB-004", city: "Jakarta Selatan", province: "DKI Jakarta", format: "Convenience", ownerId: "OWN-014" },
  { id: "LOC-005", name: "DailyBox Dago", brandId: "RB-004", city: "Bandung", province: "West Java", format: "Convenience", ownerId: "OWN-018" },
  { id: "LOC-006", name: "DailyBox Surabaya Barat", brandId: "RB-004", city: "Surabaya", province: "East Java", format: "Convenience", ownerId: "OWN-021" },
];

export type ProductBrand = { id: string; name: string; relationship: "own" | "competitor"; category: string };
export type ProductSku = { id: string; brandId: string; name: string; code: string; pack: string; assignments: string[]; sightings: number };

export const productBrands: ProductBrand[] = [
  { id: "PB-001", name: "Rubiyat", relationship: "own", category: "Beverages" },
  { id: "PB-002", name: "Coca-Cola", relationship: "competitor", category: "Carbonated drinks" },
  { id: "PB-003", name: "Pepsi", relationship: "competitor", category: "Carbonated drinks" },
  { id: "PB-004", name: "Teh Botol Sosro", relationship: "competitor", category: "Ready-to-drink tea" },
];

export const productSkus: ProductSku[] = [
  { id: "SKU-001", brandId: "PB-001", name: "Rubiyat Sparkling Original", code: "RBY-SPK-330", pack: "330ml can", assignments: ["RB-001", "RB-002", "RB-004"], sightings: 18 },
  { id: "SKU-002", brandId: "PB-001", name: "Rubiyat Sparkling Lime", code: "RBY-LIM-330", pack: "330ml can", assignments: ["RB-001", "RB-004"], sightings: 11 },
  { id: "SKU-003", brandId: "PB-001", name: "Rubiyat Original", code: "RBY-ORG-750", pack: "750ml bottle", assignments: ["RB-001", "RB-002"], sightings: 7 },
  { id: "SKU-011", brandId: "PB-002", name: "Coca-Cola Original", code: "Observed", pack: "330ml can", assignments: [], sightings: 42 },
  { id: "SKU-012", brandId: "PB-002", name: "Coca-Cola Zero", code: "Observed", pack: "330ml can", assignments: [], sightings: 31 },
  { id: "SKU-021", brandId: "PB-003", name: "Pepsi Black", code: "Observed", pack: "330ml can", assignments: [], sightings: 24 },
  { id: "SKU-031", brandId: "PB-004", name: "Teh Botol Sosro", code: "Observed", pack: "450ml bottle", assignments: [], sightings: 19 },
];
