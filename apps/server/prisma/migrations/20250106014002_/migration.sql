/*
  Warnings:

  - You are about to drop the column `fileIds` on the `Depot` table. All the data in the column will be lost.
  - You are about to drop the column `assignemntIds` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `classificationId` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `assignmentIds` on the `Role` table. All the data in the column will be lost.
  - You are about to drop the column `classificationId` on the `Role` table. All the data in the column will be lost.
  - You are about to drop the column `assignmentIds` on the `Space` table. All the data in the column will be lost.
  - You are about to drop the column `classificationId` on the `Space` table. All the data in the column will be lost.
  - You are about to drop the column `assignmentIds` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `classificationId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `DepotFile` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[userId]` on the table `Classification` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[postId]` on the table `Classification` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[spaceId]` on the table `Classification` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[roleId]` on the table `Classification` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[categoryId,userId]` on the table `Classification` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[categoryId,postId]` on the table `Classification` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[categoryId,spaceId]` on the table `Classification` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[categoryId,roleId]` on the table `Classification` will be added. If there are existing duplicate values, this will fail.
  - Made the column `spaceId` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Classification" DROP CONSTRAINT "Classification_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "DepotFile" DROP CONSTRAINT "DepotFile_classificationId_fkey";

-- DropForeignKey
ALTER TABLE "DepotFile" DROP CONSTRAINT "DepotFile_depotId_fkey";

-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_classificationId_fkey";

-- DropForeignKey
ALTER TABLE "Space" DROP CONSTRAINT "Space_classificationId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_spaceId_fkey";

-- DropIndex
DROP INDEX "Space_assignmentIds_key";

-- DropIndex
DROP INDEX "User_assignmentIds_key";

-- AlterTable
ALTER TABLE "Assignment" ADD COLUMN     "postId" TEXT,
ADD COLUMN     "spaceId" TEXT,
ADD COLUMN     "userId" TEXT;

-- AlterTable
ALTER TABLE "Classification" ADD COLUMN     "postId" TEXT,
ADD COLUMN     "roleId" TEXT,
ADD COLUMN     "spaceId" TEXT,
ADD COLUMN     "userId" TEXT;

-- AlterTable
ALTER TABLE "Depot" DROP COLUMN "fileIds";

-- AlterTable
ALTER TABLE "Post" DROP COLUMN "assignemntIds",
DROP COLUMN "classificationId";

-- AlterTable
ALTER TABLE "Role" DROP COLUMN "assignmentIds",
DROP COLUMN "classificationId";

-- AlterTable
ALTER TABLE "Space" DROP COLUMN "assignmentIds",
DROP COLUMN "classificationId";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "assignmentIds",
DROP COLUMN "classificationId",
ALTER COLUMN "spaceId" SET NOT NULL;

-- DropTable
DROP TABLE "DepotFile";

-- CreateTable
CREATE TABLE "File" (
    "id" TEXT NOT NULL,
    "seq" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "depotId" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "mimeType" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "spaceId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6),
    "removedAt" TIMESTAMPTZ(6),

    CONSTRAINT "File_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "File_seq_key" ON "File"("seq");

-- CreateIndex
CREATE UNIQUE INDEX "Classification_userId_key" ON "Classification"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Classification_postId_key" ON "Classification"("postId");

-- CreateIndex
CREATE UNIQUE INDEX "Classification_spaceId_key" ON "Classification"("spaceId");

-- CreateIndex
CREATE UNIQUE INDEX "Classification_roleId_key" ON "Classification"("roleId");

-- CreateIndex
CREATE UNIQUE INDEX "Classification_categoryId_userId_key" ON "Classification"("categoryId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "Classification_categoryId_postId_key" ON "Classification"("categoryId", "postId");

-- CreateIndex
CREATE UNIQUE INDEX "Classification_categoryId_spaceId_key" ON "Classification"("categoryId", "spaceId");

-- CreateIndex
CREATE UNIQUE INDEX "Classification_categoryId_roleId_key" ON "Classification"("categoryId", "roleId");

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_spaceId_fkey" FOREIGN KEY ("spaceId") REFERENCES "Space"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Classification" ADD CONSTRAINT "Classification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Classification" ADD CONSTRAINT "Classification_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Classification" ADD CONSTRAINT "Classification_spaceId_fkey" FOREIGN KEY ("spaceId") REFERENCES "Space"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Classification" ADD CONSTRAINT "Classification_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Group" ADD CONSTRAINT "Group_spaceId_fkey" FOREIGN KEY ("spaceId") REFERENCES "Space"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Assignment" ADD CONSTRAINT "Assignment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Assignment" ADD CONSTRAINT "Assignment_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Assignment" ADD CONSTRAINT "Assignment_spaceId_fkey" FOREIGN KEY ("spaceId") REFERENCES "Space"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_spaceId_fkey" FOREIGN KEY ("spaceId") REFERENCES "Space"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_depotId_fkey" FOREIGN KEY ("depotId") REFERENCES "Depot"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_spaceId_fkey" FOREIGN KEY ("spaceId") REFERENCES "Space"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
