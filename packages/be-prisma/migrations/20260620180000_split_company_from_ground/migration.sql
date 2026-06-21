-- Split company-level identity from service-specific ground details.
-- Existing Ground rows become both Company rows and Ground service rows.

CREATE TABLE "companies" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6),
    "removed_at" TIMESTAMPTZ(6),
    "name" TEXT NOT NULL,
    "label" TEXT,
    "address" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "business_no" TEXT NOT NULL,
    "space_id" TEXT NOT NULL,
    "logo_image_file_id" TEXT,

    CONSTRAINT "companies_pkey" PRIMARY KEY ("id")
);

INSERT INTO "companies" (
    "id",
    "created_at",
    "updated_at",
    "removed_at",
    "name",
    "label",
    "address",
    "phone",
    "email",
    "business_no",
    "space_id",
    "logo_image_file_id"
)
SELECT
    "id",
    "created_at",
    "updated_at",
    "removed_at",
    "name",
    "label",
    "address",
    "phone",
    "email",
    "business_no",
    "space_id",
    "logo_image_file_id"
FROM "grounds";

ALTER TABLE "grounds" ADD COLUMN "company_id" TEXT;

UPDATE "grounds"
SET "company_id" = "id";

ALTER TABLE "grounds" ALTER COLUMN "company_id" SET NOT NULL;

ALTER TABLE "grounds" DROP CONSTRAINT "grounds_space_id_fkey";

DROP INDEX "grounds_business_no_key";
DROP INDEX "grounds_space_id_key";

ALTER TABLE "grounds"
DROP COLUMN "business_no",
DROP COLUMN "space_id",
DROP COLUMN "logo_image_file_id";

CREATE UNIQUE INDEX "companies_business_no_key" ON "companies"("business_no");
CREATE UNIQUE INDEX "companies_space_id_key" ON "companies"("space_id");
CREATE INDEX "grounds_company_id_idx" ON "grounds"("company_id");

ALTER TABLE "companies"
ADD CONSTRAINT "companies_space_id_fkey"
FOREIGN KEY ("space_id") REFERENCES "spaces"("id")
ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "grounds"
ADD CONSTRAINT "grounds_company_id_fkey"
FOREIGN KEY ("company_id") REFERENCES "companies"("id")
ON DELETE RESTRICT ON UPDATE CASCADE;
