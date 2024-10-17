/*
  Warnings:

  - You are about to drop the column `spaceId` on the `Category` table. All the data in the column will be lost.
  - You are about to drop the column `spaceId` on the `Group` table. All the data in the column will be lost.
  - You are about to drop the column `serviceId` on the `Post` table. All the data in the column will be lost.
  - You are about to alter the column `content` on the `Post` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(1000)`.
  - You are about to drop the column `serviceId` on the `Template` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[serviceItemId,groupId]` on the table `Assignment` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[serviceItemId,categoryId]` on the table `Classification` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `tenantId` to the `Category` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tenantId` to the `Group` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "PageTypes" ADD VALUE 'LANDING';

-- DropForeignKey
ALTER TABLE "Group" DROP CONSTRAINT "Group_spaceId_fkey";

-- DropForeignKey
ALTER TABLE "Template" DROP CONSTRAINT "Template_serviceId_fkey";

-- AlterTable
ALTER TABLE "Category" DROP COLUMN "spaceId",
ADD COLUMN     "tenantId" TEXT NOT NULL,
ALTER COLUMN "ancestorIds" SET DEFAULT ARRAY[]::TEXT[];

-- AlterTable
ALTER TABLE "Group" DROP COLUMN "spaceId",
ADD COLUMN     "tenantId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Post" DROP COLUMN "serviceId",
ALTER COLUMN "content" SET DATA TYPE VARCHAR(1000);

-- AlterTable
ALTER TABLE "Template" DROP COLUMN "serviceId";

-- CreateIndex
CREATE UNIQUE INDEX "Assignment_serviceItemId_groupId_key" ON "Assignment"("serviceItemId", "groupId");

-- CreateIndex
CREATE UNIQUE INDEX "Classification_serviceItemId_categoryId_key" ON "Classification"("serviceItemId", "categoryId");

-- AddForeignKey
ALTER TABLE "Group" ADD CONSTRAINT "Group_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
