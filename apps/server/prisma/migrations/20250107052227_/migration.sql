/*
  Warnings:

  - The values [user,space,post,role] on the enum `ServiceNames` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `spaceId` on the `Category` table. All the data in the column will be lost.
  - You are about to drop the column `spaceId` on the `File` table. All the data in the column will be lost.
  - You are about to drop the column `spaceId` on the `Group` table. All the data in the column will be lost.
  - You are about to drop the column `spaceId` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `spaceId` on the `Timeline` table. All the data in the column will be lost.
  - You are about to drop the column `spaceId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Element` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Page` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `serviceId` to the `Association` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tenancyId` to the `Association` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tenancyId` to the `Category` table without a default value. This is not possible if the table is not empty.
  - Added the required column `serviceId` to the `Classification` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tenancyId` to the `Classification` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tenancyId` to the `File` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tenancyId` to the `Group` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tenancyId` to the `Post` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tenancyId` to the `Timeline` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tenancyId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ServiceNames_new" AS ENUM ('USER', 'SPACE', 'POST', 'ROLE');
ALTER TABLE "Service" ALTER COLUMN "name" TYPE "ServiceNames_new" USING ("name"::text::"ServiceNames_new");
ALTER TYPE "ServiceNames" RENAME TO "ServiceNames_old";
ALTER TYPE "ServiceNames_new" RENAME TO "ServiceNames";
DROP TYPE "ServiceNames_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "Category" DROP CONSTRAINT "Category_spaceId_fkey";

-- DropForeignKey
ALTER TABLE "Classification" DROP CONSTRAINT "Classification_postId_fkey";

-- DropForeignKey
ALTER TABLE "Classification" DROP CONSTRAINT "Classification_roleId_fkey";

-- DropForeignKey
ALTER TABLE "Classification" DROP CONSTRAINT "Classification_spaceId_fkey";

-- DropForeignKey
ALTER TABLE "Classification" DROP CONSTRAINT "Classification_userId_fkey";

-- DropForeignKey
ALTER TABLE "Element" DROP CONSTRAINT "Element_pageId_fkey";

-- DropForeignKey
ALTER TABLE "File" DROP CONSTRAINT "File_spaceId_fkey";

-- DropForeignKey
ALTER TABLE "Group" DROP CONSTRAINT "Group_spaceId_fkey";

-- DropForeignKey
ALTER TABLE "Tenant" DROP CONSTRAINT "Tenant_spaceId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_spaceId_fkey";

-- DropIndex
DROP INDEX "Classification_postId_key";

-- DropIndex
DROP INDEX "Classification_roleId_key";

-- DropIndex
DROP INDEX "Classification_spaceId_key";

-- DropIndex
DROP INDEX "Classification_userId_key";

-- AlterTable
ALTER TABLE "Association" ADD COLUMN     "serviceId" TEXT NOT NULL,
ADD COLUMN     "tenancyId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Category" DROP COLUMN "spaceId",
ADD COLUMN     "tenancyId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Classification" ADD COLUMN     "serviceId" TEXT NOT NULL,
ADD COLUMN     "tenancyId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Depot" ADD COLUMN     "parentId" TEXT;

-- AlterTable
ALTER TABLE "File" DROP COLUMN "spaceId",
ADD COLUMN     "tenancyId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Group" DROP COLUMN "spaceId",
ADD COLUMN     "tenancyId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Post" DROP COLUMN "spaceId",
ADD COLUMN     "classificationId" TEXT,
ADD COLUMN     "tenancyId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Role" ADD COLUMN     "classificationId" TEXT;

-- AlterTable
ALTER TABLE "Space" ADD COLUMN     "classificationId" TEXT;

-- AlterTable
ALTER TABLE "Timeline" DROP COLUMN "spaceId",
ADD COLUMN     "tenancyId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "spaceId",
ADD COLUMN     "classificationId" TEXT,
ADD COLUMN     "tenancyId" TEXT NOT NULL;

-- DropTable
DROP TABLE "Element";

-- DropTable
DROP TABLE "Page";

-- DropEnum
DROP TYPE "ElementTypes";

-- DropEnum
DROP TYPE "PageTypes";

-- DropEnum
DROP TYPE "TenantTypes";

-- CreateTable
CREATE TABLE "Tenancy" (
    "id" TEXT NOT NULL,
    "seq" SERIAL NOT NULL,
    "spaceId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6),
    "removedAt" TIMESTAMPTZ(6),

    CONSTRAINT "Tenancy_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Tenancy_seq_key" ON "Tenancy"("seq");

-- CreateIndex
CREATE UNIQUE INDEX "Tenancy_spaceId_key" ON "Tenancy"("spaceId");

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_tenancyId_fkey" FOREIGN KEY ("tenancyId") REFERENCES "Tenancy"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Classification" ADD CONSTRAINT "Classification_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Classification" ADD CONSTRAINT "Classification_tenancyId_fkey" FOREIGN KEY ("tenancyId") REFERENCES "Tenancy"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Group" ADD CONSTRAINT "Group_tenancyId_fkey" FOREIGN KEY ("tenancyId") REFERENCES "Tenancy"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Association" ADD CONSTRAINT "Association_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Association" ADD CONSTRAINT "Association_tenancyId_fkey" FOREIGN KEY ("tenancyId") REFERENCES "Tenancy"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_classificationId_fkey" FOREIGN KEY ("classificationId") REFERENCES "Classification"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_tenancyId_fkey" FOREIGN KEY ("tenancyId") REFERENCES "Tenancy"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Space" ADD CONSTRAINT "Space_classificationId_fkey" FOREIGN KEY ("classificationId") REFERENCES "Classification"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Timeline" ADD CONSTRAINT "Timeline_tenancyId_fkey" FOREIGN KEY ("tenancyId") REFERENCES "Tenancy"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Role" ADD CONSTRAINT "Role_classificationId_fkey" FOREIGN KEY ("classificationId") REFERENCES "Classification"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_classificationId_fkey" FOREIGN KEY ("classificationId") REFERENCES "Classification"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_tenancyId_fkey" FOREIGN KEY ("tenancyId") REFERENCES "Tenancy"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Depot" ADD CONSTRAINT "Depot_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Depot"("id") ON DELETE SET NULL ON UPDATE CASCADE;
