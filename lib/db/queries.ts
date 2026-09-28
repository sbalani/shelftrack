import { asc, count, eq } from "drizzle-orm";
import type { Employee, ProductSku } from "@/lib/domain-data";
import { db } from "./client";
import { employees, photoSkuObservations, productBrands, productSkus, retailBrands, retailCompanies, retailLocations, retailOwners, skuRetailAssignments } from "./schema";

export async function getEmployees(): Promise<Employee[]> {
  const rows = await db.select().from(employees).orderBy(asc(employees.name));
  return rows.map((employee) => ({
    id: employee.id,
    employeeCode: employee.employeeCode,
    name: employee.name,
    email: employee.email,
    title: employee.title,
    territory: employee.territory,
    accountStatus: employee.authUserId ? "linked" : "none",
    accountRole: employee.role,
  }));
}

export async function getRetailNetwork() {
  const [companies, brands, owners, locations] = await Promise.all([
    db.select().from(retailCompanies).orderBy(asc(retailCompanies.name)),
    db.select().from(retailBrands).orderBy(asc(retailBrands.name)),
    db.select().from(retailOwners).orderBy(asc(retailOwners.name)),
    db.select().from(retailLocations).orderBy(asc(retailLocations.name)),
  ]);
  return { companies, brands, owners, locations };
}

export async function getCatalog() {
  const [brands, skuRows, assignments, sightingRows] = await Promise.all([
    db.select().from(productBrands).orderBy(asc(productBrands.name)),
    db.select().from(productSkus).orderBy(asc(productSkus.name)),
    db.select().from(skuRetailAssignments),
    db.select({ skuId: photoSkuObservations.skuId, sightings: count() }).from(photoSkuObservations).groupBy(photoSkuObservations.skuId),
  ]);
  const skus: ProductSku[] = skuRows.map((sku) => ({
    id: sku.id,
    brandId: sku.brandId,
    name: sku.name,
    code: sku.code,
    packSize: sku.packSize,
    assignments: assignments.filter((item) => item.skuId === sku.id).map((item) => item.retailBrandId),
    sightings: Number(sightingRows.find((item) => item.skuId === sku.id)?.sightings || 0),
  }));
  return { brands, skus };
}

export async function getEmployeeById(id: string) {
  const [employee] = await db.select().from(employees).where(eq(employees.id, id)).limit(1);
  return employee;
}
