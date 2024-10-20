/*
  Warnings:

  - The values [DAY] on the enum `RepeatCycleTypes` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `baseDate` on the `Session` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Timeline` table. All the data in the column will be lost.
  - Added the required column `startDate` to the `Session` table without a default value. This is not possible if the table is not empty.
  - Added the required column `date` to the `Timeline` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "RepeatCycleTypes_new" AS ENUM ('WEEK', 'MONTH', 'YEAR');
ALTER TABLE "Session" ALTER COLUMN "repeatCycleType" DROP DEFAULT;
ALTER TABLE "Session" ALTER COLUMN "repeatCycleType" TYPE "RepeatCycleTypes_new" USING ("repeatCycleType"::text::"RepeatCycleTypes_new");
ALTER TYPE "RepeatCycleTypes" RENAME TO "RepeatCycleTypes_old";
ALTER TYPE "RepeatCycleTypes_new" RENAME TO "RepeatCycleTypes";
DROP TYPE "RepeatCycleTypes_old";
ALTER TABLE "Session" ALTER COLUMN "repeatCycleType" SET DEFAULT 'WEEK';
COMMIT;

-- AlterEnum
ALTER TYPE "SessionTypes" ADD VALUE 'ONE_TIME_RANGE';

-- AlterTable
ALTER TABLE "Session" DROP COLUMN "baseDate",
ADD COLUMN     "startDate" DATE NOT NULL,
ALTER COLUMN "repeatCycleType" SET DEFAULT 'WEEK';

-- AlterTable
ALTER TABLE "Timeline" DROP COLUMN "name",
ADD COLUMN     "date" DATE NOT NULL;
