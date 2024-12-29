/*
  Warnings:

  - You are about to drop the column `tenantId` on the `Answer` table. All the data in the column will be lost.
  - You are about to drop the column `tenantId` on the `Category` table. All the data in the column will be lost.
  - You are about to drop the column `tenantId` on the `DepotFile` table. All the data in the column will be lost.
  - You are about to drop the column `tenantId` on the `Group` table. All the data in the column will be lost.
  - You are about to drop the column `tenantId` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `tenantId` on the `Qna` table. All the data in the column will be lost.
  - You are about to drop the column `tenantId` on the `Question` table. All the data in the column will be lost.
  - You are about to drop the column `tenantId` on the `SMS` table. All the data in the column will be lost.
  - You are about to drop the column `tenantId` on the `SystemEmail` table. All the data in the column will be lost.
  - You are about to drop the column `tenantId` on the `Timeline` table. All the data in the column will be lost.
  - Added the required column `spaceId` to the `Answer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `spaceId` to the `Category` table without a default value. This is not possible if the table is not empty.
  - Added the required column `spaceId` to the `DepotFile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `spaceId` to the `Group` table without a default value. This is not possible if the table is not empty.
  - Added the required column `spaceId` to the `Post` table without a default value. This is not possible if the table is not empty.
  - Added the required column `spaceId` to the `Qna` table without a default value. This is not possible if the table is not empty.
  - Added the required column `spaceId` to the `Question` table without a default value. This is not possible if the table is not empty.
  - Added the required column `spaceId` to the `SMS` table without a default value. This is not possible if the table is not empty.
  - Added the required column `spaceId` to the `SystemEmail` table without a default value. This is not possible if the table is not empty.
  - Added the required column `spaceId` to the `Timeline` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_spaceId_fkey";

-- AlterTable
ALTER TABLE "Answer" DROP COLUMN "tenantId",
ADD COLUMN     "spaceId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Category" DROP COLUMN "tenantId",
ADD COLUMN     "spaceId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "DepotFile" DROP COLUMN "tenantId",
ADD COLUMN     "spaceId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Group" DROP COLUMN "tenantId",
ADD COLUMN     "spaceId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Post" DROP COLUMN "tenantId",
ADD COLUMN     "spaceId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Qna" DROP COLUMN "tenantId",
ADD COLUMN     "spaceId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Question" DROP COLUMN "tenantId",
ADD COLUMN     "spaceId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "SMS" DROP COLUMN "tenantId",
ADD COLUMN     "spaceId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "SystemEmail" DROP COLUMN "tenantId",
ADD COLUMN     "spaceId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Timeline" DROP COLUMN "tenantId",
ADD COLUMN     "spaceId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "spaceId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_spaceId_fkey" FOREIGN KEY ("spaceId") REFERENCES "Space"("id") ON DELETE SET NULL ON UPDATE CASCADE;
