CREATE TYPE app_role AS ENUM ('user', 'data_entry', 'admin');
CREATE TYPE retailer_model AS ENUM ('corporate', 'franchise', 'mixed');
CREATE TYPE owner_type AS ENUM ('corporate', 'franchise_partner');
CREATE TYPE brand_relationship AS ENUM ('own', 'competitor');
CREATE TYPE display_type AS ENUM ('primary', 'secondary', 'additional');
CREATE TYPE ai_status AS ENUM ('pending', 'processed', 'reviewed');

CREATE TABLE app_employees (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), employee_code text NOT NULL, name text NOT NULL,
  email text NOT NULL, email_normalized text NOT NULL, title text NOT NULL DEFAULT '', territory text NOT NULL DEFAULT '',
  auth_user_id text, role app_role, created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX employees_code_unique ON app_employees (employee_code);
CREATE UNIQUE INDEX employees_email_unique ON app_employees (email_normalized);
CREATE UNIQUE INDEX employees_auth_user_unique ON app_employees (auth_user_id) WHERE auth_user_id IS NOT NULL;

CREATE TABLE retail_companies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), name text NOT NULL, normalized_name text NOT NULL,
  geography text NOT NULL DEFAULT 'Indonesia', created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX retail_companies_name_unique ON retail_companies (normalized_name);

CREATE TABLE retail_brands (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), company_id uuid NOT NULL REFERENCES retail_companies(id) ON DELETE CASCADE,
  name text NOT NULL, normalized_name text NOT NULL, model retailer_model NOT NULL DEFAULT 'corporate',
  created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX retail_brands_company_name_unique ON retail_brands (company_id, normalized_name);
CREATE INDEX retail_brands_company_idx ON retail_brands (company_id);

CREATE TABLE retail_owners (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), name text NOT NULL, normalized_name text NOT NULL,
  type owner_type NOT NULL DEFAULT 'corporate', created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX retail_owners_name_unique ON retail_owners (normalized_name);

CREATE TABLE retail_locations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), retail_brand_id uuid NOT NULL REFERENCES retail_brands(id) ON DELETE CASCADE,
  owner_id uuid REFERENCES retail_owners(id) ON DELETE SET NULL, name text NOT NULL, normalized_name text NOT NULL,
  city text NOT NULL, city_normalized text NOT NULL, province text NOT NULL DEFAULT '', format text NOT NULL DEFAULT '', address text NOT NULL DEFAULT '',
  latitude numeric(9,6), longitude numeric(9,6), created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX retail_locations_brand_name_city_unique ON retail_locations (retail_brand_id, normalized_name, city_normalized);
CREATE INDEX retail_locations_brand_idx ON retail_locations (retail_brand_id);
CREATE INDEX retail_locations_owner_idx ON retail_locations (owner_id);

CREATE TABLE product_brands (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), name text NOT NULL, normalized_name text NOT NULL,
  relationship brand_relationship NOT NULL, category text NOT NULL DEFAULT '', created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX product_brands_name_unique ON product_brands (normalized_name);
CREATE INDEX product_brands_relationship_idx ON product_brands (relationship);

CREATE TABLE product_skus (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), brand_id uuid NOT NULL REFERENCES product_brands(id) ON DELETE CASCADE,
  name text NOT NULL, normalized_name text NOT NULL, code text, normalized_code text, pack_size text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX product_skus_brand_name_pack_unique ON product_skus (brand_id, normalized_name, pack_size);
CREATE UNIQUE INDEX product_skus_code_unique ON product_skus (normalized_code) WHERE normalized_code IS NOT NULL;
CREATE INDEX product_skus_brand_idx ON product_skus (brand_id);

CREATE TABLE sku_retail_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), sku_id uuid NOT NULL REFERENCES product_skus(id) ON DELETE CASCADE,
  retail_brand_id uuid NOT NULL REFERENCES retail_brands(id) ON DELETE CASCADE, effective_from timestamptz NOT NULL DEFAULT now(),
  effective_to timestamptz, created_at timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX sku_retail_assignments_unique ON sku_retail_assignments (sku_id, retail_brand_id);
CREATE INDEX sku_retail_assignments_retailer_idx ON sku_retail_assignments (retail_brand_id);

CREATE TABLE shelf_visits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), location_id uuid NOT NULL REFERENCES retail_locations(id) ON DELETE RESTRICT,
  collected_by_employee_id uuid NOT NULL REFERENCES app_employees(id) ON DELETE RESTRICT, submitted_by_auth_user_id text NOT NULL,
  captured_at timestamptz NOT NULL, notes text NOT NULL DEFAULT '', created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX shelf_visits_location_date_idx ON shelf_visits (location_id, captured_at);
CREATE INDEX shelf_visits_employee_idx ON shelf_visits (collected_by_employee_id);

CREATE TABLE shelf_photos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), visit_id uuid NOT NULL REFERENCES shelf_visits(id) ON DELETE CASCADE,
  object_key text NOT NULL, category text NOT NULL, shelf_area text NOT NULL, angle text NOT NULL, display_type display_type NOT NULL,
  ai_status ai_status NOT NULL DEFAULT 'pending', created_at timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX shelf_photos_object_key_unique ON shelf_photos (object_key);
CREATE INDEX shelf_photos_visit_idx ON shelf_photos (visit_id);

CREATE TABLE photo_brand_observations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), photo_id uuid NOT NULL REFERENCES shelf_photos(id) ON DELETE CASCADE,
  brand_id uuid NOT NULL REFERENCES product_brands(id) ON DELETE RESTRICT, facings integer, estimated_share numeric(5,2), confidence numeric(5,2),
  human_verified_at timestamptz, created_at timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX photo_brand_observations_unique ON photo_brand_observations (photo_id, brand_id);
CREATE INDEX photo_brand_observations_brand_idx ON photo_brand_observations (brand_id);

CREATE TABLE photo_sku_observations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), photo_id uuid NOT NULL REFERENCES shelf_photos(id) ON DELETE CASCADE,
  sku_id uuid NOT NULL REFERENCES product_skus(id) ON DELETE RESTRICT, facings integer, confidence numeric(5,2),
  human_verified_at timestamptz, created_at timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX photo_sku_observations_unique ON photo_sku_observations (photo_id, sku_id);
CREATE INDEX photo_sku_observations_sku_idx ON photo_sku_observations (sku_id);
