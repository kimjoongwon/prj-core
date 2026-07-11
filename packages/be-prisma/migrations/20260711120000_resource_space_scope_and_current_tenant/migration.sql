-- Persist the user's selected membership. This is intentionally a scalar only:
-- validity is checked against the user's active tenants by the application.
ALTER TABLE "users"
ADD COLUMN IF NOT EXISTS "current_tenant_id" TEXT;

-- Resource tables historically moved between space and tenant scope. Reconcile
-- either shape without overwriting an existing creator or space.
DO $$
DECLARE
  resource_table TEXT;
  resource_tables TEXT[] := ARRAY[
    'policies',
    'safe_wallets',
    'folders',
    'categories',
    'contents',
    'tasks',
    'inquiries',
    'albums',
    'album_entries',
    'groups',
    'reservations',
    'routines',
    'assets',
    'derivatives',
    'timelines'
  ];
  has_tenant_id BOOLEAN;
  missing_space_count BIGINT;
  fk RECORD;
BEGIN
  FOREACH resource_table IN ARRAY resource_tables
  LOOP
    EXECUTE format(
      'ALTER TABLE %I ADD COLUMN IF NOT EXISTS "space_id" TEXT',
      resource_table
    );
    EXECUTE format(
      'ALTER TABLE %I ADD COLUMN IF NOT EXISTS "creator_id" TEXT',
      resource_table
    );

    SELECT EXISTS (
      SELECT 1
      FROM information_schema.columns AS columns_record
      WHERE columns_record.table_schema = current_schema()
        AND columns_record.table_name = resource_table
        AND columns_record.column_name = 'tenant_id'
    ) INTO has_tenant_id;

    IF has_tenant_id THEN
      EXECUTE format(
        'UPDATE %1$I AS resource
         SET "space_id" = COALESCE(resource."space_id", tenant."space_id"),
             "creator_id" = COALESCE(resource."creator_id", tenant."user_id")
         FROM "tenants" AS tenant
         WHERE resource."tenant_id" = tenant."id"
           AND (resource."space_id" IS NULL OR resource."creator_id" IS NULL)',
        resource_table
      );
    END IF;

    EXECUTE format(
      'SELECT count(*) FROM %I WHERE "space_id" IS NULL',
      resource_table
    ) INTO missing_space_count;

    IF missing_space_count > 0 THEN
      RAISE EXCEPTION
        'Cannot migrate %.space_id: % rows have no matching Tenant.space_id.',
        resource_table,
        missing_space_count;
    END IF;

    EXECUTE format(
      'ALTER TABLE %I ALTER COLUMN "space_id" SET NOT NULL',
      resource_table
    );

    -- Drop any previous FK definition on the reconciled columns so the final
    -- on-delete behavior is deterministic even when the old name differs.
    FOR fk IN
      SELECT constraint_record.conname
      FROM pg_constraint AS constraint_record
      JOIN pg_class AS table_record
        ON table_record.oid = constraint_record.conrelid
      JOIN pg_namespace AS namespace_record
        ON namespace_record.oid = table_record.relnamespace
      WHERE namespace_record.nspname = current_schema()
        AND table_record.relname = resource_table
        AND constraint_record.contype = 'f'
        AND EXISTS (
          SELECT 1
          FROM unnest(constraint_record.conkey) AS constrained_column(attnum)
          JOIN pg_attribute AS attribute_record
            ON attribute_record.attrelid = table_record.oid
           AND attribute_record.attnum = constrained_column.attnum
          WHERE attribute_record.attname IN ('space_id', 'creator_id')
        )
    LOOP
      EXECUTE format(
        'ALTER TABLE %I DROP CONSTRAINT %I',
        resource_table,
        fk.conname
      );
    END LOOP;

    EXECUTE format(
      'ALTER TABLE %1$I
       ADD CONSTRAINT %2$I
       FOREIGN KEY ("space_id") REFERENCES "spaces"("id")
       ON DELETE RESTRICT ON UPDATE CASCADE',
      resource_table,
      resource_table || '_space_id_fkey'
    );
    EXECUTE format(
      'ALTER TABLE %1$I
       ADD CONSTRAINT %2$I
       FOREIGN KEY ("creator_id") REFERENCES "users"("id")
       ON DELETE SET NULL ON UPDATE CASCADE',
      resource_table,
      resource_table || '_creator_id_fkey'
    );

    IF has_tenant_id THEN
      EXECUTE format(
        'ALTER TABLE %I DROP COLUMN "tenant_id"',
        resource_table
      );
    END IF;
  END LOOP;
END $$;

-- Single-column resource scope indexes.
CREATE INDEX IF NOT EXISTS "policies_space_id_idx" ON "policies"("space_id");
CREATE INDEX IF NOT EXISTS "safe_wallets_space_id_idx" ON "safe_wallets"("space_id");
CREATE INDEX IF NOT EXISTS "folders_space_id_idx" ON "folders"("space_id");
CREATE INDEX IF NOT EXISTS "categories_space_id_idx" ON "categories"("space_id");
CREATE INDEX IF NOT EXISTS "contents_space_id_idx" ON "contents"("space_id");
CREATE INDEX IF NOT EXISTS "tasks_space_id_idx" ON "tasks"("space_id");
CREATE INDEX IF NOT EXISTS "inquiries_space_id_idx" ON "inquiries"("space_id");
CREATE INDEX IF NOT EXISTS "albums_space_id_idx" ON "albums"("space_id");
CREATE INDEX IF NOT EXISTS "album_entries_space_id_idx" ON "album_entries"("space_id");
CREATE INDEX IF NOT EXISTS "groups_space_id_idx" ON "groups"("space_id");
CREATE INDEX IF NOT EXISTS "routines_space_id_idx" ON "routines"("space_id");
CREATE INDEX IF NOT EXISTS "assets_space_id_idx" ON "assets"("space_id");
CREATE INDEX IF NOT EXISTS "derivatives_space_id_idx" ON "derivatives"("space_id");
CREATE INDEX IF NOT EXISTS "timelines_space_id_idx" ON "timelines"("space_id");

-- Compound and unique indexes whose scope key changed from tenant to space.
DROP INDEX IF EXISTS "policies_tenant_id_name_key";
CREATE UNIQUE INDEX IF NOT EXISTS "policies_space_id_name_key"
ON "policies"("space_id", "name");

DROP INDEX IF EXISTS "routines_tenant_id_name_idx";
CREATE INDEX IF NOT EXISTS "routines_space_id_name_idx"
ON "routines"("space_id", "name");

DROP INDEX IF EXISTS "inquiries_tenant_id_status_idx";
CREATE INDEX IF NOT EXISTS "inquiries_space_id_status_idx"
ON "inquiries"("space_id", "status");

DROP INDEX IF EXISTS "reservations_tenant_id_occurrence_start_at_idx";
CREATE INDEX IF NOT EXISTS "reservations_space_id_occurrence_start_at_idx"
ON "reservations"("space_id", "occurrence_start_at");

DROP INDEX IF EXISTS "timelines_tenant_id_created_at_idx";
CREATE INDEX IF NOT EXISTS "timelines_space_id_created_at_idx"
ON "timelines"("space_id", "created_at");
