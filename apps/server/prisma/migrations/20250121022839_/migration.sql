/*
  Warnings:

  - The values [YEARLY] on the enum `RepeatCycleTypes` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "RepeatCycleTypes_new" AS ENUM ('WEEKLY', 'MONTHLY');
ALTER TABLE "Session" ALTER COLUMN "repeatCycleType" TYPE "RepeatCycleTypes_new" USING ("repeatCycleType"::text::"RepeatCycleTypes_new");
ALTER TYPE "RepeatCycleTypes" RENAME TO "RepeatCycleTypes_old";
ALTER TYPE "RepeatCycleTypes_new" RENAME TO "RepeatCycleTypes";
DROP TYPE "RepeatCycleTypes_old";
COMMIT;
