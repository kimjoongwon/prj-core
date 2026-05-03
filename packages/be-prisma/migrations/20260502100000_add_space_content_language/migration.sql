-- Drop the abandoned per-resource translation table from local/dev databases
-- where the short-lived per-resource translation experiment was already applied.
DROP TABLE IF EXISTS "resource_translations";
DROP TYPE IF EXISTS "resource_translation_type";

ALTER TABLE "spaces"
ADD COLUMN IF NOT EXISTS "content_language_code" "language_code" NOT NULL DEFAULT 'ko_KR';

CREATE INDEX IF NOT EXISTS "spaces_content_language_code_idx"
ON "spaces"("content_language_code");
