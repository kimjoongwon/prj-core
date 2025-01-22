/*
  Warnings:

  - The `recurringDayOfWeek` column on the `Session` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "RecurringDayOfWeek" AS ENUM ('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY');

-- AlterTable
ALTER TABLE "Session" DROP COLUMN "recurringDayOfWeek",
ADD COLUMN     "recurringDayOfWeek" "RecurringDayOfWeek";

-- DropEnum
DROP TYPE "RecurringDayOfTheWeek";
