/*
  Warnings:

  - The values [LEAF,ROOT] on the enum `CategoryTypes` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "CategoryTypes_new" AS ENUM ('Role', 'Space', 'File', 'User');
ALTER TABLE "Category" ALTER COLUMN "type" DROP DEFAULT;
ALTER TABLE "Category" ALTER COLUMN "type" TYPE "CategoryTypes_new" USING ("type"::text::"CategoryTypes_new");
ALTER TYPE "CategoryTypes" RENAME TO "CategoryTypes_old";
ALTER TYPE "CategoryTypes_new" RENAME TO "CategoryTypes";
DROP TYPE "CategoryTypes_old";
ALTER TABLE "Category" ALTER COLUMN "type" SET DEFAULT 'Role';
COMMIT;

-- AlterTable
ALTER TABLE "Category" ALTER COLUMN "type" SET DEFAULT 'Role';

-- AddForeignKey
ALTER TABLE "Ground" ADD CONSTRAINT "Ground_spaceId_fkey" FOREIGN KEY ("spaceId") REFERENCES "Space"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
