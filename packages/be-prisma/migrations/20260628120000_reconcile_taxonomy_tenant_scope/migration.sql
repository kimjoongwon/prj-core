ALTER TABLE "categories" ADD COLUMN IF NOT EXISTS "tenant_id" TEXT;
ALTER TABLE "groups" ADD COLUMN IF NOT EXISTS "tenant_id" TEXT;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = current_schema()
      AND table_name = 'categories'
      AND column_name = 'space_id'
  ) THEN
    EXECUTE '
      UPDATE "categories" AS c
      SET "tenant_id" = (
        SELECT t."id"
        FROM "tenants" AS t
        WHERE t."space_id" = c."space_id"
          AND t."removed_at" IS NULL
        ORDER BY
          CASE
            WHEN c."creator_id" IS NOT NULL AND t."user_id" = c."creator_id" THEN 0
            ELSE 1
          END,
          t."created_at" ASC,
          t."id" ASC
        LIMIT 1
      )
      WHERE c."tenant_id" IS NULL
        AND c."space_id" IS NOT NULL
    ';
  END IF;

  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = current_schema()
      AND table_name = 'groups'
      AND column_name = 'space_id'
  ) THEN
    EXECUTE '
      UPDATE "groups" AS g
      SET "tenant_id" = (
        SELECT t."id"
        FROM "tenants" AS t
        WHERE t."space_id" = g."space_id"
          AND t."removed_at" IS NULL
        ORDER BY
          CASE
            WHEN g."creator_id" IS NOT NULL AND t."user_id" = g."creator_id" THEN 0
            ELSE 1
          END,
          t."created_at" ASC,
          t."id" ASC
        LIMIT 1
      )
      WHERE g."tenant_id" IS NULL
        AND g."space_id" IS NOT NULL
    ';
  END IF;
END $$;

DO $$
DECLARE
  missing_category_count INTEGER;
  missing_group_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO missing_category_count
  FROM "categories"
  WHERE "tenant_id" IS NULL;

  IF missing_category_count > 0 THEN
    RAISE EXCEPTION 'Cannot migrate categories.tenant_id: % rows have no matching active tenant for their space_id.', missing_category_count;
  END IF;

  SELECT COUNT(*) INTO missing_group_count
  FROM "groups"
  WHERE "tenant_id" IS NULL;

  IF missing_group_count > 0 THEN
    RAISE EXCEPTION 'Cannot migrate groups.tenant_id: % rows have no matching active tenant for their space_id.', missing_group_count;
  END IF;
END $$;

ALTER TABLE "categories" ALTER COLUMN "tenant_id" SET NOT NULL;
ALTER TABLE "groups" ALTER COLUMN "tenant_id" SET NOT NULL;

ALTER TABLE "categories" DROP CONSTRAINT IF EXISTS "categories_space_id_fkey";
ALTER TABLE "groups" DROP CONSTRAINT IF EXISTS "groups_space_id_fkey";

DROP INDEX IF EXISTS "categories_space_id_idx";
DROP INDEX IF EXISTS "groups_space_id_idx";

ALTER TABLE "categories" DROP COLUMN IF EXISTS "space_id";
ALTER TABLE "groups" DROP COLUMN IF EXISTS "space_id";

CREATE INDEX IF NOT EXISTS "categories_tenant_id_idx" ON "categories"("tenant_id");
CREATE INDEX IF NOT EXISTS "groups_tenant_id_idx" ON "groups"("tenant_id");

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'categories_tenant_id_fkey'
      AND conrelid = '"categories"'::regclass
  ) THEN
    ALTER TABLE "categories"
    ADD CONSTRAINT "categories_tenant_id_fkey"
    FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id")
    ON DELETE RESTRICT
    ON UPDATE CASCADE;
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'groups_tenant_id_fkey'
      AND conrelid = '"groups"'::regclass
  ) THEN
    ALTER TABLE "groups"
    ADD CONSTRAINT "groups_tenant_id_fkey"
    FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id")
    ON DELETE RESTRICT
    ON UPDATE CASCADE;
  END IF;
END $$;
