-- Rename Ground service rows into FitnessCenter rows while preserving data.
-- Company no longer owns Space directly; each FitnessCenter carries the required Space link.

DO $$
DECLARE
  orphan_company_count INTEGER;
BEGIN
  SELECT COUNT(*)
  INTO orphan_company_count
  FROM "companies" AS c
  WHERE NOT EXISTS (
    SELECT 1
    FROM "grounds" AS g
    WHERE g."company_id" = c."id"
  );

  IF orphan_company_count > 0 THEN
    RAISE EXCEPTION 'Cannot migrate Ground to FitnessCenter: % companies have no linked ground row.', orphan_company_count;
  END IF;
END $$;

ALTER TABLE "grounds" ADD COLUMN "space_id" TEXT;

UPDATE "grounds" AS g
SET "space_id" = c."space_id"
FROM "companies" AS c
WHERE g."company_id" = c."id";

DO $$
DECLARE
  missing_company_count INTEGER;
  missing_space_count INTEGER;
  null_space_count INTEGER;
  duplicate_space_count INTEGER;
BEGIN
  SELECT COUNT(*)
  INTO missing_company_count
  FROM "grounds" AS g
  LEFT JOIN "companies" AS c ON c."id" = g."company_id"
  WHERE c."id" IS NULL;

  IF missing_company_count > 0 THEN
    RAISE EXCEPTION 'Cannot migrate Ground to FitnessCenter: % grounds reference a missing company.', missing_company_count;
  END IF;

  SELECT COUNT(*)
  INTO null_space_count
  FROM "grounds"
  WHERE "space_id" IS NULL;

  IF null_space_count > 0 THEN
    RAISE EXCEPTION 'Cannot migrate Ground to FitnessCenter: % grounds have no backfilled space_id.', null_space_count;
  END IF;

  SELECT COUNT(*)
  INTO missing_space_count
  FROM "grounds" AS g
  LEFT JOIN "spaces" AS s ON s."id" = g."space_id"
  WHERE s."id" IS NULL;

  IF missing_space_count > 0 THEN
    RAISE EXCEPTION 'Cannot migrate Ground to FitnessCenter: % grounds reference a missing space.', missing_space_count;
  END IF;

  SELECT COUNT(*)
  INTO duplicate_space_count
  FROM (
    SELECT "space_id"
    FROM "grounds"
    GROUP BY "space_id"
    HAVING COUNT(*) > 1
  ) AS duplicate_spaces;

  IF duplicate_space_count > 0 THEN
    RAISE EXCEPTION 'Cannot migrate Ground to FitnessCenter: % duplicate space_id groups exist.', duplicate_space_count;
  END IF;
END $$;

ALTER TABLE "grounds" ALTER COLUMN "space_id" SET NOT NULL;

CREATE UNIQUE INDEX "fitness_centers_space_id_key" ON "grounds"("space_id");

ALTER TABLE "grounds"
ADD CONSTRAINT "fitness_centers_space_id_fkey"
FOREIGN KEY ("space_id") REFERENCES "spaces"("id")
ON DELETE RESTRICT ON UPDATE CASCADE;

DROP INDEX IF EXISTS "grounds_company_id_key";
DROP INDEX IF EXISTS "grounds_company_id_idx";
CREATE INDEX "fitness_centers_company_id_idx" ON "grounds"("company_id");

ALTER TABLE "companies" DROP CONSTRAINT IF EXISTS "companies_space_id_fkey";
DROP INDEX IF EXISTS "companies_space_id_key";
ALTER TABLE "companies" DROP COLUMN "space_id";

ALTER TABLE "grounds" RENAME CONSTRAINT "grounds_pkey" TO "fitness_centers_pkey";
ALTER TABLE "grounds" RENAME CONSTRAINT "grounds_company_id_fkey" TO "fitness_centers_company_id_fkey";
ALTER TABLE "grounds" RENAME TO "fitness_centers";
