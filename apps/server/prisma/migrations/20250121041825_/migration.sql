/*
  Warnings:

  - You are about to drop the column `recurringDayOfTheWeek` on the `Session` table. All the data in the column will be lost.
  - You are about to drop the column `recurringWeek` on the `Session` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Session" DROP COLUMN "recurringDayOfTheWeek",
DROP COLUMN "recurringWeek",
ADD COLUMN     "recurringDayOfWeek" "RecurringDayOfTheWeek",
ADD COLUMN     "recurringMonth" INTEGER;
