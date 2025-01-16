/*
  Warnings:

  - You are about to drop the column `subjectId` on the `Action` table. All the data in the column will be lost.
  - Added the required column `actionId` to the `Ability` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tenancyId` to the `Ability` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tenancyId` to the `Action` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tenancyId` to the `Subject` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Ability" DROP CONSTRAINT "Ability_subjectId_fkey";

-- DropForeignKey
ALTER TABLE "Action" DROP CONSTRAINT "Action_subjectId_fkey";

-- AlterTable
ALTER TABLE "Ability" ADD COLUMN     "actionId" TEXT NOT NULL,
ADD COLUMN     "tenancyId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Action" DROP COLUMN "subjectId",
ADD COLUMN     "tenancyId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Subject" ADD COLUMN     "tenancyId" TEXT NOT NULL;
