/*
  Warnings:

  - You are about to drop the column `baseDate` on the `Session` table. All the data in the column will be lost.
  - You are about to drop the column `endTime` on the `Session` table. All the data in the column will be lost.
  - You are about to drop the column `startTime` on the `Session` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Session" DROP COLUMN "baseDate",
DROP COLUMN "endTime",
DROP COLUMN "startTime",
ADD COLUMN     "recurringWeek" "RecurringDayOfTheWeek";
