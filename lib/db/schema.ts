import { index, integer, numeric, pgEnum, pgTable, text, timestamp, uniqueIndex, uuid } from "drizzle-orm/pg-core";

export const appRole = pgEnum("app_role", ["user", "data_entry", "admin"]);
export const retailerModel = pgEnum("retailer_model", ["corporate", "franchise", "mixed"]);
export const ownerType = pgEnum("owner_type", ["corporate", "franchise_partner"]);
export const brandRelationship = pgEnum("brand_relationship", ["own", "competitor"]);
export const displayType = pgEnum("display_type", ["primary", "secondary", "additional"]);
export const aiStatus = pgEnum("ai_status", ["pending", "processed", "reviewed"]);

const timestamps = {
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
};

export const employees = pgTable("app_employees", {
  id: uuid("id").primaryKey().defaultRandom(),
  employeeCode: text("employee_code").notNull(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  emailNormalized: text("email_normalized").notNull(),
  title: text("title").notNull().default(""),
  territory: text("territory").notNull().default(""),
  authUserId: text("auth_user_id"),
  role: appRole("role"),
  ...timestamps,
}, (table) => [uniqueIndex("employees_code_unique").on(table.employeeCode), uniqueIndex("employees_email_unique").on(table.emailNormalized), uniqueIndex("employees_auth_user_unique").on(table.authUserId)]);

export const retailCompanies = pgTable("retail_companies", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  normalizedName: text("normalized_name").notNull(),
  geography: text("geography").notNull().default("Indonesia"),
  ...timestamps,
}, (table) => [uniqueIndex("retail_companies_name_unique").on(table.normalizedName)]);

export const retailBrands = pgTable("retail_brands", {
  id: uuid("id").primaryKey().defaultRandom(),
  companyId: uuid("company_id").notNull().references(() => retailCompanies.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  normalizedName: text("normalized_name").notNull(),
  model: retailerModel("model").notNull().default("corporate"),
  ...timestamps,
}, (table) => [uniqueIndex("retail_brands_company_name_unique").on(table.companyId, table.normalizedName), index("retail_brands_company_idx").on(table.companyId)]);

export const retailOwners = pgTable("retail_owners", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  normalizedName: text("normalized_name").notNull(),
  type: ownerType("type").notNull().default("corporate"),
  ...timestamps,
}, (table) => [uniqueIndex("retail_owners_name_unique").on(table.normalizedName)]);

export const retailLocations = pgTable("retail_locations", {
  id: uuid("id").primaryKey().defaultRandom(),
  retailBrandId: uuid("retail_brand_id").notNull().references(() => retailBrands.id, { onDelete: "cascade" }),
  ownerId: uuid("owner_id").references(() => retailOwners.id, { onDelete: "set null" }),
  name: text("name").notNull(),
  normalizedName: text("normalized_name").notNull(),
  city: text("city").notNull(),
  cityNormalized: text("city_normalized").notNull(),
  province: text("province").notNull().default(""),
  format: text("format").notNull().default(""),
  address: text("address").notNull().default(""),
  latitude: numeric("latitude", { precision: 9, scale: 6 }),
  longitude: numeric("longitude", { precision: 9, scale: 6 }),
  ...timestamps,
}, (table) => [uniqueIndex("retail_locations_brand_name_city_unique").on(table.retailBrandId, table.normalizedName, table.cityNormalized), index("retail_locations_brand_idx").on(table.retailBrandId), index("retail_locations_owner_idx").on(table.ownerId)]);

export const productBrands = pgTable("product_brands", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  normalizedName: text("normalized_name").notNull(),
  relationship: brandRelationship("relationship").notNull(),
  category: text("category").notNull().default(""),
  ...timestamps,
}, (table) => [uniqueIndex("product_brands_name_unique").on(table.normalizedName), index("product_brands_relationship_idx").on(table.relationship)]);

export const productSkus = pgTable("product_skus", {
  id: uuid("id").primaryKey().defaultRandom(),
  brandId: uuid("brand_id").notNull().references(() => productBrands.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  normalizedName: text("normalized_name").notNull(),
  code: text("code"),
  normalizedCode: text("normalized_code"),
  packSize: text("pack_size").notNull().default(""),
  ...timestamps,
}, (table) => [uniqueIndex("product_skus_brand_name_pack_unique").on(table.brandId, table.normalizedName, table.packSize), uniqueIndex("product_skus_code_unique").on(table.normalizedCode), index("product_skus_brand_idx").on(table.brandId)]);

export const skuRetailAssignments = pgTable("sku_retail_assignments", {
  id: uuid("id").primaryKey().defaultRandom(),
  skuId: uuid("sku_id").notNull().references(() => productSkus.id, { onDelete: "cascade" }),
  retailBrandId: uuid("retail_brand_id").notNull().references(() => retailBrands.id, { onDelete: "cascade" }),
  effectiveFrom: timestamp("effective_from", { withTimezone: true }).notNull().defaultNow(),
  effectiveTo: timestamp("effective_to", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [uniqueIndex("sku_retail_assignments_unique").on(table.skuId, table.retailBrandId), index("sku_retail_assignments_retailer_idx").on(table.retailBrandId)]);

export const shelfVisits = pgTable("shelf_visits", {
  id: uuid("id").primaryKey().defaultRandom(),
  locationId: uuid("location_id").notNull().references(() => retailLocations.id, { onDelete: "restrict" }),
  collectedByEmployeeId: uuid("collected_by_employee_id").notNull().references(() => employees.id, { onDelete: "restrict" }),
  submittedByAuthUserId: text("submitted_by_auth_user_id").notNull(),
  capturedAt: timestamp("captured_at", { withTimezone: true }).notNull(),
  notes: text("notes").notNull().default(""),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [index("shelf_visits_location_date_idx").on(table.locationId, table.capturedAt), index("shelf_visits_employee_idx").on(table.collectedByEmployeeId)]);

export const shelfPhotos = pgTable("shelf_photos", {
  id: uuid("id").primaryKey().defaultRandom(),
  visitId: uuid("visit_id").notNull().references(() => shelfVisits.id, { onDelete: "cascade" }),
  objectKey: text("object_key").notNull(),
  category: text("category").notNull(),
  shelfArea: text("shelf_area").notNull(),
  angle: text("angle").notNull(),
  displayType: displayType("display_type").notNull(),
  aiStatus: aiStatus("ai_status").notNull().default("pending"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [uniqueIndex("shelf_photos_object_key_unique").on(table.objectKey), index("shelf_photos_visit_idx").on(table.visitId)]);

export const photoBrandObservations = pgTable("photo_brand_observations", {
  id: uuid("id").primaryKey().defaultRandom(),
  photoId: uuid("photo_id").notNull().references(() => shelfPhotos.id, { onDelete: "cascade" }),
  brandId: uuid("brand_id").notNull().references(() => productBrands.id, { onDelete: "restrict" }),
  facings: integer("facings"),
  estimatedShare: numeric("estimated_share", { precision: 5, scale: 2 }),
  confidence: numeric("confidence", { precision: 5, scale: 2 }),
  humanVerified: timestamp("human_verified_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [uniqueIndex("photo_brand_observations_unique").on(table.photoId, table.brandId), index("photo_brand_observations_brand_idx").on(table.brandId)]);

export const photoSkuObservations = pgTable("photo_sku_observations", {
  id: uuid("id").primaryKey().defaultRandom(),
  photoId: uuid("photo_id").notNull().references(() => shelfPhotos.id, { onDelete: "cascade" }),
  skuId: uuid("sku_id").notNull().references(() => productSkus.id, { onDelete: "restrict" }),
  facings: integer("facings"),
  confidence: numeric("confidence", { precision: 5, scale: 2 }),
  humanVerified: timestamp("human_verified_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [uniqueIndex("photo_sku_observations_unique").on(table.photoId, table.skuId), index("photo_sku_observations_sku_idx").on(table.skuId)]);
