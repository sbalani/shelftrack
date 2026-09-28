"use server";

import { auth } from "@/lib/auth/server";
import { db } from "@/lib/db/client";
import { employees, productBrands, productSkus, retailBrands, retailCompanies, retailLocations, retailOwners, skuRetailAssignments } from "@/lib/db/schema";
import { getUserRole } from "@/lib/permissions";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { parse } from "csv-parse/sync";

const normalize = (value: string) => value.trim().toLocaleLowerCase("en").replace(/\s+/g, " ");
const retailerModels = ["corporate", "franchise", "mixed"] as const;

async function requireAdmin() {
  const { data: session } = await auth.getSession();
  if (!session?.user || getUserRole(session.user as { role?: unknown; appRole?: unknown }) !== "admin") throw new Error("Administrator access is required.");
}

function field(formData: FormData, name: string) {
  return String(formData.get(name) ?? "").trim();
}

export async function createEmployee(formData: FormData) {
  await requireAdmin();
  const email = field(formData, "email");
  await db.insert(employees).values({
    employeeCode: field(formData, "employeeCode").toLocaleUpperCase("en"),
    name: field(formData, "name"),
    email,
    emailNormalized: normalize(email),
    title: field(formData, "title"),
    territory: field(formData, "territory"),
  }).onConflictDoNothing();
  revalidatePath("/users");
}

export async function createRetailBrand(formData: FormData) {
  await requireAdmin();
  const name = field(formData, "name");
  const requestedModel = field(formData, "model");
  const model = retailerModels.find((value) => value === requestedModel) || "corporate";
  await db.insert(retailBrands).values({ companyId: field(formData, "companyId"), name, normalizedName: normalize(name), model }).onConflictDoNothing();
  revalidatePath("/retailers");
}

export async function createRetailLocation(formData: FormData) {
  await requireAdmin();
  const name = field(formData, "name");
  const city = field(formData, "city");
  await db.insert(retailLocations).values({
    retailBrandId: field(formData, "retailBrandId"),
    ownerId: field(formData, "ownerId") || null,
    name,
    normalizedName: normalize(name),
    city,
    cityNormalized: normalize(city),
    province: field(formData, "province"),
    format: field(formData, "format"),
  }).onConflictDoNothing();
  revalidatePath("/retailers");
}

export async function createProductBrand(formData: FormData) {
  await requireAdmin();
  const name = field(formData, "name");
  const relationship = field(formData, "relationship") === "competitor" ? "competitor" : "own";
  await db.insert(productBrands).values({ name, normalizedName: normalize(name), relationship, category: field(formData, "category") }).onConflictDoNothing();
  revalidatePath("/catalog");
}

export async function createProductSku(formData: FormData) {
  await requireAdmin();
  const name = field(formData, "name");
  const code = field(formData, "code");
  await db.insert(productSkus).values({
    brandId: field(formData, "brandId"),
    name,
    normalizedName: normalize(name),
    code: code || null,
    normalizedCode: code ? normalize(code) : null,
    packSize: normalize(field(formData, "pack")),
  }).onConflictDoNothing();
  revalidatePath("/catalog");
}

export type ImportState = { imported: number; duplicates: number; errors: string[]; message?: string } | null;

async function parseCsv(formData: FormData) {
  const file = formData.get("file");
  if (!(file instanceof File) || !file.size) throw new Error("Choose a CSV file.");
  if (file.size > 2_000_000) throw new Error("CSV files must be smaller than 2 MB.");
  const rows = parse(await file.text(), {
    columns: (headers: string[]) => headers.map((header) => normalize(header).replace(/ /g, "_")),
    skip_empty_lines: true,
    trim: true,
    bom: true,
  }) as Record<string, string>[];
  if (rows.length > 10_000) throw new Error("CSV files cannot contain more than 10,000 rows.");
  return rows;
}

export async function importRetailers(_previous: ImportState, formData: FormData): Promise<ImportState> {
  await requireAdmin();
  try {
    const rows = await parseCsv(formData);
    const result = await db.transaction(async (tx) => {
      let imported = 0;
      let duplicates = 0;
      const errors: string[] = [];

      for (const [index, row] of rows.entries()) {
        const companyName = row.company_name?.trim();
        const brandName = row.retail_brand?.trim();
        if (!companyName || !brandName) {
          errors.push(`Row ${index + 2}: company_name and retail_brand are required.`);
          continue;
        }
        if (row.location_name && !row.city) {
          errors.push(`Row ${index + 2}: city is required when location_name is provided.`);
          continue;
        }

        let created = false;
        const companyKey = normalize(companyName);
        let [company] = await tx.select().from(retailCompanies).where(eq(retailCompanies.normalizedName, companyKey)).limit(1);
        if (!company) {
          const inserted = await tx.insert(retailCompanies).values({ name: companyName, normalizedName: companyKey, geography: row.geography || "Indonesia" }).onConflictDoNothing().returning();
          company = inserted[0];
          created = Boolean(company);
          if (!company) [company] = await tx.select().from(retailCompanies).where(eq(retailCompanies.normalizedName, companyKey)).limit(1);
        }

        const brandKey = normalize(brandName);
        let [brand] = await tx.select().from(retailBrands).where(and(eq(retailBrands.companyId, company.id), eq(retailBrands.normalizedName, brandKey))).limit(1);
        if (!brand) {
          const requestedModel = normalize(row.operating_model || "corporate");
          const model = retailerModels.find((value) => value === requestedModel) || "corporate";
          const inserted = await tx.insert(retailBrands).values({ companyId: company.id, name: brandName, normalizedName: brandKey, model }).onConflictDoNothing().returning();
          brand = inserted[0];
          created ||= Boolean(brand);
          if (!brand) [brand] = await tx.select().from(retailBrands).where(and(eq(retailBrands.companyId, company.id), eq(retailBrands.normalizedName, brandKey))).limit(1);
        }

        if (row.location_name) {
          const locationKey = normalize(row.location_name);
          const cityKey = normalize(row.city);
          const [existing] = await tx.select({ id: retailLocations.id }).from(retailLocations).where(and(eq(retailLocations.retailBrandId, brand.id), eq(retailLocations.normalizedName, locationKey), eq(retailLocations.cityNormalized, cityKey))).limit(1);
          if (!existing) {
            let ownerId: string | null = null;
            if (row.owner_name) {
              const ownerKey = normalize(row.owner_name);
              let [owner] = await tx.select().from(retailOwners).where(eq(retailOwners.normalizedName, ownerKey)).limit(1);
              if (!owner) {
                const inserted = await tx.insert(retailOwners).values({ name: row.owner_name, normalizedName: ownerKey, type: normalize(row.owner_type || "") === "franchise_partner" ? "franchise_partner" : "corporate" }).onConflictDoNothing().returning();
                owner = inserted[0];
                created ||= Boolean(owner);
                if (!owner) [owner] = await tx.select().from(retailOwners).where(eq(retailOwners.normalizedName, ownerKey)).limit(1);
              }
              ownerId = owner.id;
            }
            const inserted = await tx.insert(retailLocations).values({ retailBrandId: brand.id, ownerId, name: row.location_name, normalizedName: locationKey, city: row.city, cityNormalized: cityKey, province: row.province || "", format: row.format || "", address: row.address || "" }).onConflictDoNothing().returning({ id: retailLocations.id });
            created ||= Boolean(inserted.length);
          }
        }

        if (created) imported++;
        else duplicates++;
      }
      return { imported, duplicates, errors: errors.slice(0, 20) };
    });
    revalidatePath("/retailers");
    return result;
  } catch (error) {
    return { imported: 0, duplicates: 0, errors: [error instanceof Error ? error.message : "Import failed."] };
  }
}

export async function importProducts(_previous: ImportState, formData: FormData): Promise<ImportState> {
  await requireAdmin();
  try {
    const rows = await parseCsv(formData);
    const result = await db.transaction(async (tx) => {
      let imported = 0;
      let duplicates = 0;
      const errors: string[] = [];

      for (const [index, row] of rows.entries()) {
        const brandName = row.brand_name?.trim();
        if (!brandName) {
          errors.push(`Row ${index + 2}: brand_name is required.`);
          continue;
        }

        const relationship = normalize(row.relationship || "") === "competitor" ? "competitor" : "own";
        const brandKey = normalize(brandName);
        let created = false;
        let [brand] = await tx.select().from(productBrands).where(eq(productBrands.normalizedName, brandKey)).limit(1);
        if (!brand) {
          const inserted = await tx.insert(productBrands).values({ name: brandName, normalizedName: brandKey, relationship, category: row.category || "" }).onConflictDoNothing().returning();
          brand = inserted[0];
          created = Boolean(brand);
          if (!brand) [brand] = await tx.select().from(productBrands).where(eq(productBrands.normalizedName, brandKey)).limit(1);
        }
        if (brand.relationship !== relationship) {
          errors.push(`Row ${index + 2}: brand "${brandName}" already exists as ${brand.relationship}.`);
          duplicates++;
          continue;
        }

        if (row.sku_name) {
          const skuKey = normalize(row.sku_name);
          const pack = normalize(row.pack_size || "");
          const code = relationship === "own" ? row.sku_code?.trim() || null : null;
          const normalizedCode = code ? normalize(code) : null;
          let [sku] = await tx.select().from(productSkus).where(and(eq(productSkus.brandId, brand.id), eq(productSkus.normalizedName, skuKey), eq(productSkus.packSize, pack))).limit(1);

          if (!sku && normalizedCode) {
            const [codeMatch] = await tx.select().from(productSkus).where(eq(productSkus.normalizedCode, normalizedCode)).limit(1);
            if (codeMatch) {
              errors.push(`Row ${index + 2}: sku_code "${code}" is already assigned to another SKU.`);
              duplicates++;
              continue;
            }
          }

          if (!sku) {
            const inserted = await tx.insert(productSkus).values({ brandId: brand.id, name: row.sku_name, normalizedName: skuKey, code, normalizedCode, packSize: pack }).onConflictDoNothing().returning();
            sku = inserted[0];
            created ||= Boolean(sku);
            if (!sku) {
              duplicates++;
              continue;
            }
          }

          if (relationship === "own" && row.assigned_retail_brand) {
            const assignmentKey = normalize(row.assigned_retail_brand);
            const matchingBrands = await tx.select().from(retailBrands).where(eq(retailBrands.normalizedName, assignmentKey));
            if (matchingBrands.length === 1) {
              const inserted = await tx.insert(skuRetailAssignments).values({ skuId: sku.id, retailBrandId: matchingBrands[0].id }).onConflictDoNothing().returning({ id: skuRetailAssignments.id });
              created ||= Boolean(inserted.length);
            } else if (!matchingBrands.length) {
              errors.push(`Row ${index + 2}: retailer brand "${row.assigned_retail_brand}" was not found.`);
            } else {
              errors.push(`Row ${index + 2}: retailer brand "${row.assigned_retail_brand}" is ambiguous.`);
            }
          }
        }

        if (created) imported++;
        else duplicates++;
      }
      return { imported, duplicates, errors: errors.slice(0, 20) };
    });
    revalidatePath("/catalog");
    return result;
  } catch (error) {
    return { imported: 0, duplicates: 0, errors: [error instanceof Error ? error.message : "Import failed."] };
  }
}
