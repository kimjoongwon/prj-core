-- Remove the redundant Category type discriminator. Classification relations
-- remain the source of truth for Category classification.
ALTER TABLE "categories" DROP COLUMN "type";

DROP TYPE "CategoryTypes";
