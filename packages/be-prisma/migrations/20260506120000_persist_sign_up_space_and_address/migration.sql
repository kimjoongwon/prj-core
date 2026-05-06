ALTER TABLE "email_verifications"
ADD COLUMN "space_id" TEXT,
ADD COLUMN "address" TEXT NOT NULL DEFAULT '';

UPDATE "email_verifications"
SET "space_id" = (
	SELECT "id"
	FROM "spaces"
	WHERE "removed_at" IS NULL
	ORDER BY "created_at" ASC
	LIMIT 1
)
WHERE "space_id" IS NULL;

DELETE FROM "email_verifications"
WHERE "space_id" IS NULL;

ALTER TABLE "email_verifications"
ALTER COLUMN "space_id" SET NOT NULL;

ALTER TABLE "email_verifications"
ALTER COLUMN "address" DROP DEFAULT;

CREATE INDEX "email_verifications_space_id_idx" ON "email_verifications"("space_id");

ALTER TABLE "email_verifications"
ADD CONSTRAINT "email_verifications_space_id_fkey"
FOREIGN KEY ("space_id") REFERENCES "spaces"("id")
ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "profiles"
ADD COLUMN "address" TEXT NOT NULL DEFAULT '';

ALTER TABLE "profiles"
ALTER COLUMN "address" DROP DEFAULT;
