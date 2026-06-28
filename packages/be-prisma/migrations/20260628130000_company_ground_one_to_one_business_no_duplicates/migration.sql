-- Company business numbers are descriptive data, not identity keys.
DROP INDEX IF EXISTS "companies_business_no_key";

-- Each company owns at most one ground.
DROP INDEX IF EXISTS "grounds_company_id_idx";
CREATE UNIQUE INDEX "grounds_company_id_key" ON "grounds"("company_id");
