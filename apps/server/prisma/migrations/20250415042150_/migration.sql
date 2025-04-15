/*
  Warnings:

  - The values [USER,ROLE,SPACE,CONTENT,TIMELINE,FILE] on the enum `ServiceNames` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `taskId` on the `Activity` table. All the data in the column will be lost.
  - You are about to drop the column `contentId` on the `Classification` table. All the data in the column will be lost.
  - You are about to drop the column `businessNumber` on the `Gym` table. All the data in the column will be lost.
  - You are about to drop the column `contentId` on the `Routine` table. All the data in the column will be lost.
  - You are about to drop the column `label` on the `Space` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Space` table. All the data in the column will be lost.
  - You are about to drop the column `contentId` on the `Task` table. All the data in the column will be lost.
  - You are about to drop the column `label` on the `Task` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Task` table. All the data in the column will be lost.
  - You are about to drop the column `label` on the `Timeline` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Timeline` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[taskId]` on the table `Classification` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[categoryId,taskId]` on the table `Classification` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[businessNo]` on the table `Gym` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[routineId]` on the table `Program` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `exerciseId` to the `Activity` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Exercise` table without a default value. This is not possible if the table is not empty.
  - Added the required column `businessNo` to the `Gym` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Gym` table without a default value. This is not possible if the table is not empty.
  - Added the required column `label` to the `Session` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Session` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tenantId` to the `Task` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ServiceNames_new" AS ENUM ('user', 'role', 'space', 'timeline', 'file', 'task');
ALTER TABLE "Service" ALTER COLUMN "name" TYPE "ServiceNames_new" USING ("name"::text::"ServiceNames_new");
ALTER TYPE "ServiceNames" RENAME TO "ServiceNames_old";
ALTER TYPE "ServiceNames_new" RENAME TO "ServiceNames";
DROP TYPE "ServiceNames_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "Activity" DROP CONSTRAINT "Activity_taskId_fkey";

-- DropForeignKey
ALTER TABLE "Routine" DROP CONSTRAINT "Routine_contentId_fkey";

-- DropForeignKey
ALTER TABLE "Task" DROP CONSTRAINT "Task_contentId_fkey";

-- DropIndex
DROP INDEX "Classification_categoryId_contentId_key";

-- DropIndex
DROP INDEX "Classification_contentId_key";

-- DropIndex
DROP INDEX "Gym_businessNumber_key";

-- AlterTable
ALTER TABLE "Activity" DROP COLUMN "taskId",
ADD COLUMN     "exerciseId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Association" ADD COLUMN     "taskId" TEXT;

-- AlterTable
ALTER TABLE "Classification" DROP COLUMN "contentId",
ADD COLUMN     "taskId" TEXT;

-- AlterTable
ALTER TABLE "Exercise" ADD COLUMN     "description" TEXT,
ADD COLUMN     "imageDepotId" TEXT,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "videoDepotId" TEXT;

-- AlterTable
ALTER TABLE "Gym" DROP COLUMN "businessNumber",
ADD COLUMN     "businessNo" TEXT NOT NULL,
ADD COLUMN     "label" TEXT,
ADD COLUMN     "name" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Routine" DROP COLUMN "contentId";

-- AlterTable
ALTER TABLE "Session" ADD COLUMN     "label" TEXT NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Space" DROP COLUMN "label",
DROP COLUMN "name";

-- AlterTable
ALTER TABLE "Task" DROP COLUMN "contentId",
DROP COLUMN "label",
DROP COLUMN "name",
ADD COLUMN     "tenantId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Timeline" DROP COLUMN "label",
DROP COLUMN "name";

-- CreateIndex
CREATE UNIQUE INDEX "Classification_taskId_key" ON "Classification"("taskId");

-- CreateIndex
CREATE UNIQUE INDEX "Classification_categoryId_taskId_key" ON "Classification"("categoryId", "taskId");

-- CreateIndex
CREATE UNIQUE INDEX "Gym_businessNo_key" ON "Gym"("businessNo");

-- CreateIndex
CREATE UNIQUE INDEX "Program_routineId_key" ON "Program"("routineId");

-- AddForeignKey
ALTER TABLE "Classification" ADD CONSTRAINT "Classification_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Association" ADD CONSTRAINT "Association_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Program" ADD CONSTRAINT "Program_routineId_fkey" FOREIGN KEY ("routineId") REFERENCES "Routine"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "Exercise"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
