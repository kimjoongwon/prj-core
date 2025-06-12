/*
  Warnings:

  - You are about to drop the column `serviceId` on the `Category` table. All the data in the column will be lost.
  - You are about to drop the column `depotId` on the `Content` table. All the data in the column will be lost.
  - You are about to drop the column `imageDepotId` on the `Exercise` table. All the data in the column will be lost.
  - You are about to drop the column `videoDepotId` on the `Exercise` table. All the data in the column will be lost.
  - You are about to drop the column `depotId` on the `File` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `FileAssociation` table. All the data in the column will be lost.
  - You are about to drop the column `imageDepotId` on the `Ground` table. All the data in the column will be lost.
  - You are about to drop the column `workspaceId` on the `Ground` table. All the data in the column will be lost.
  - You are about to drop the column `serviceId` on the `Group` table. All the data in the column will be lost.
  - You are about to drop the column `depotId` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `tenantId` on the `Role` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `SpaceAssociation` table. All the data in the column will be lost.
  - You are about to drop the column `taskId` on the `SpaceClassification` table. All the data in the column will be lost.
  - You are about to drop the `Depot` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Workspace` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[groupId,fileId]` on the table `FileAssociation` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[businessNo]` on the table `Ground` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[spaceId]` on the table `Ground` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `Role` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[spaceId,groupId]` on the table `SpaceAssociation` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[categoryId,userId]` on the table `UserClassification` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `groupId` to the `FileAssociation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `address` to the `Ground` table without a default value. This is not possible if the table is not empty.
  - Added the required column `businessNo` to the `Ground` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `Ground` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Ground` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone` to the `Ground` table without a default value. This is not possible if the table is not empty.
  - Added the required column `spaceId` to the `Ground` table without a default value. This is not possible if the table is not empty.
  - Added the required column `groupId` to the `SpaceAssociation` table without a default value. This is not possible if the table is not empty.
  - Made the column `spaceId` on table `SpaceClassification` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `roleId` to the `Tenant` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Category" DROP CONSTRAINT "Category_serviceId_fkey";

-- DropForeignKey
ALTER TABLE "Content" DROP CONSTRAINT "Content_depotId_fkey";

-- DropForeignKey
ALTER TABLE "File" DROP CONSTRAINT "File_depotId_fkey";

-- DropForeignKey
ALTER TABLE "FileAssociation" DROP CONSTRAINT "FileAssociation_userId_fkey";

-- DropForeignKey
ALTER TABLE "Ground" DROP CONSTRAINT "Ground_imageDepotId_fkey";

-- DropForeignKey
ALTER TABLE "Ground" DROP CONSTRAINT "Ground_workspaceId_fkey";

-- DropForeignKey
ALTER TABLE "Group" DROP CONSTRAINT "Group_serviceId_fkey";

-- DropForeignKey
ALTER TABLE "Profile" DROP CONSTRAINT "Profile_depotId_fkey";

-- DropForeignKey
ALTER TABLE "Role" DROP CONSTRAINT "Role_tenantId_fkey";

-- DropForeignKey
ALTER TABLE "RoleAssociation" DROP CONSTRAINT "RoleAssociation_roleId_fkey";

-- DropForeignKey
ALTER TABLE "RoleClassification" DROP CONSTRAINT "RoleClassification_roleId_fkey";

-- DropForeignKey
ALTER TABLE "SpaceAssociation" DROP CONSTRAINT "SpaceAssociation_userId_fkey";

-- DropForeignKey
ALTER TABLE "SpaceClassification" DROP CONSTRAINT "SpaceClassification_spaceId_fkey";

-- DropForeignKey
ALTER TABLE "SpaceClassification" DROP CONSTRAINT "SpaceClassification_taskId_fkey";

-- DropForeignKey
ALTER TABLE "UserAssociation" DROP CONSTRAINT "UserAssociation_userId_fkey";

-- DropForeignKey
ALTER TABLE "Workspace" DROP CONSTRAINT "Workspace_logoImageDepotId_fkey";

-- DropForeignKey
ALTER TABLE "Workspace" DROP CONSTRAINT "Workspace_spaceId_fkey";

-- DropIndex
DROP INDEX "FileAssociation_userId_fileId_key";

-- DropIndex
DROP INDEX "Ground_workspaceId_key";

-- DropIndex
DROP INDEX "SpaceAssociation_userId_spaceId_key";

-- DropIndex
DROP INDEX "SpaceClassification_spaceId_key";

-- DropIndex
DROP INDEX "SpaceClassification_taskId_key";

-- DropIndex
DROP INDEX "UserAssociation_userId_groupId_key";

-- DropIndex
DROP INDEX "UserClassification_userId_key";

-- AlterTable
ALTER TABLE "Category" DROP COLUMN "serviceId";

-- AlterTable
ALTER TABLE "Content" DROP COLUMN "depotId",
ADD COLUMN     "fileId" TEXT;

-- AlterTable
ALTER TABLE "Exercise" DROP COLUMN "imageDepotId",
DROP COLUMN "videoDepotId",
ADD COLUMN     "imageFileId" TEXT,
ADD COLUMN     "videoFileId" TEXT;

-- AlterTable
ALTER TABLE "File" DROP COLUMN "depotId",
ADD COLUMN     "parentId" TEXT;

-- AlterTable
ALTER TABLE "FileAssociation" DROP COLUMN "userId",
ADD COLUMN     "groupId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Ground" DROP COLUMN "imageDepotId",
DROP COLUMN "workspaceId",
ADD COLUMN     "address" TEXT NOT NULL,
ADD COLUMN     "businessNo" TEXT NOT NULL,
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "imageFileId" TEXT,
ADD COLUMN     "label" TEXT,
ADD COLUMN     "logoImageFileId" TEXT,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "phone" TEXT NOT NULL,
ADD COLUMN     "spaceId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Group" DROP COLUMN "serviceId";

-- AlterTable
ALTER TABLE "Profile" DROP COLUMN "depotId",
ADD COLUMN     "avatarFileId" TEXT;

-- AlterTable
ALTER TABLE "Role" DROP COLUMN "tenantId";

-- AlterTable
ALTER TABLE "SpaceAssociation" DROP COLUMN "userId",
ADD COLUMN     "groupId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "SpaceClassification" DROP COLUMN "taskId",
ALTER COLUMN "spaceId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Tenant" ADD COLUMN     "roleId" TEXT NOT NULL;

-- DropTable
DROP TABLE "Depot";

-- DropTable
DROP TABLE "Workspace";

-- DropEnum
DROP TYPE "DepotTypes";

-- CreateIndex
CREATE UNIQUE INDEX "FileAssociation_groupId_fileId_key" ON "FileAssociation"("groupId", "fileId");

-- CreateIndex
CREATE UNIQUE INDEX "Ground_businessNo_key" ON "Ground"("businessNo");

-- CreateIndex
CREATE UNIQUE INDEX "Ground_spaceId_key" ON "Ground"("spaceId");

-- CreateIndex
CREATE UNIQUE INDEX "Role_name_key" ON "Role"("name");

-- CreateIndex
CREATE UNIQUE INDEX "SpaceAssociation_spaceId_groupId_key" ON "SpaceAssociation"("spaceId", "groupId");

-- CreateIndex
CREATE UNIQUE INDEX "UserClassification_categoryId_userId_key" ON "UserClassification"("categoryId", "userId");

-- AddForeignKey
ALTER TABLE "Tenant" ADD CONSTRAINT "Tenant_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "File"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FileAssociation" ADD CONSTRAINT "FileAssociation_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SpaceClassification" ADD CONSTRAINT "SpaceClassification_spaceId_fkey" FOREIGN KEY ("spaceId") REFERENCES "Space"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SpaceAssociation" ADD CONSTRAINT "SpaceAssociation_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
