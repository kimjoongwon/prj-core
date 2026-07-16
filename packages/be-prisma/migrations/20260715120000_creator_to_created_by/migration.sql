-- Normalize resource creation audit fields to `created_by_id` while preserving
-- every existing value and foreign-key behavior.
DO $$
DECLARE
  resource RECORD;
  foreign_key_name TEXT;
BEGIN
  FOR resource IN
    SELECT *
    FROM (
      VALUES
        ('policies', 'creator_id'),
        ('safe_wallets', 'creator_id'),
        ('categories', 'creator_id'),
        ('groups', 'creator_id'),
        ('contents', 'creator_id'),
        ('tasks', 'creator_id'),
        ('timelines', 'creator_id'),
        ('reservations', 'creator_id'),
        ('routines', 'creator_id'),
        ('assets', 'creator_id'),
        ('derivatives', 'creator_id'),
        ('folders', 'creator_id'),
        ('albums', 'creator_id'),
        ('album_entries', 'creator_id'),
        ('inquiries', 'creator_id'),
        ('inquiry_threads', 'created_by')
    ) AS resources(table_name, column_name)
  LOOP
    SELECT constraint_record.conname
    INTO foreign_key_name
    FROM pg_constraint AS constraint_record
    JOIN pg_class AS table_record
      ON table_record.oid = constraint_record.conrelid
    JOIN pg_namespace AS namespace_record
      ON namespace_record.oid = table_record.relnamespace
    WHERE namespace_record.nspname = current_schema()
      AND table_record.relname = resource.table_name
      AND constraint_record.contype = 'f'
      AND EXISTS (
        SELECT 1
        FROM unnest(constraint_record.conkey) AS constrained_column(attnum)
        JOIN pg_attribute AS attribute_record
          ON attribute_record.attrelid = table_record.oid
         AND attribute_record.attnum = constrained_column.attnum
        WHERE attribute_record.attname = resource.column_name
      );

    IF foreign_key_name IS NULL THEN
      RAISE EXCEPTION
        'Cannot rename %.%: foreign key was not found.',
        resource.table_name,
        resource.column_name;
    END IF;

    EXECUTE format(
      'ALTER TABLE %I RENAME COLUMN %I TO created_by_id',
      resource.table_name,
      resource.column_name
    );

    EXECUTE format(
      'ALTER TABLE %I RENAME CONSTRAINT %I TO %I',
      resource.table_name,
      foreign_key_name,
      resource.table_name || '_created_by_id_fkey'
    );
  END LOOP;
END $$;
