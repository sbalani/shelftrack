export type Employee = {
  id: string;
  employeeCode: string;
  name: string;
  email: string;
  title: string;
  territory: string;
  accountStatus: "linked" | "none";
  accountRole: "user" | "data_entry" | "admin" | null;
};

export type RetailCompany = { id: string; name: string; geography: string };
export type RetailBrand = { id: string; name: string; companyId: string; model: "corporate" | "franchise" | "mixed" };
export type RetailOwner = { id: string; name: string; type: "corporate" | "franchise_partner" };
export type RetailLocation = { id: string; name: string; retailBrandId: string; city: string; province: string; format: string; ownerId: string | null };
export type ProductBrand = { id: string; name: string; relationship: "own" | "competitor"; category: string };
export type ProductSku = { id: string; brandId: string; name: string; code: string | null; packSize: string; assignments: string[]; sightings: number };
