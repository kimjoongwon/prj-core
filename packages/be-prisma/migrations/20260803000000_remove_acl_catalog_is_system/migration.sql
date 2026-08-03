-- Drop indexes that directly depend on the removed system flag columns.
DROP INDEX IF EXISTS "policies_is_system_idx";
DROP INDEX IF EXISTS "subjects_is_system_idx";

ALTER TABLE "actions" DROP COLUMN IF EXISTS "is_system";
ALTER TABLE "policies" DROP COLUMN IF EXISTS "is_system";
ALTER TABLE "roles" DROP COLUMN IF EXISTS "is_system";
ALTER TABLE "subjects" DROP COLUMN IF EXISTS "is_system";
