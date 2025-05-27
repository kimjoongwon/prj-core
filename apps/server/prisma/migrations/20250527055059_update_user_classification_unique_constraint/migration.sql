/*
  Warnings:

  - You are about to drop the `Association` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Classification` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[routineId,taskId]` on the table `Activity` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Activity" DROP CONSTRAINT "Activity_routineId_fkey";

-- DropForeignKey
ALTER TABLE "Activity" DROP CONSTRAINT "Activity_taskId_fkey";

-- DropForeignKey
ALTER TABLE "Association" DROP CONSTRAINT "Association_contentId_fkey";

-- DropForeignKey
ALTER TABLE "Association" DROP CONSTRAINT "Association_fileId_fkey";

-- DropForeignKey
ALTER TABLE "Association" DROP CONSTRAINT "Association_groupId_fkey";

-- DropForeignKey
ALTER TABLE "Association" DROP CONSTRAINT "Association_roleId_fkey";

-- DropForeignKey
ALTER TABLE "Association" DROP CONSTRAINT "Association_spaceId_fkey";

-- DropForeignKey
ALTER TABLE "Association" DROP CONSTRAINT "Association_taskId_fkey";

-- DropForeignKey
ALTER TABLE "Association" DROP CONSTRAINT "Association_timelineId_fkey";

-- DropForeignKey
ALTER TABLE "Association" DROP CONSTRAINT "Association_userId_fkey";

-- DropForeignKey
ALTER TABLE "Classification" DROP CONSTRAINT "Classification_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "Classification" DROP CONSTRAINT "Classification_fileId_fkey";

-- DropForeignKey
ALTER TABLE "Classification" DROP CONSTRAINT "Classification_roleId_fkey";

-- DropForeignKey
ALTER TABLE "Classification" DROP CONSTRAINT "Classification_spaceId_fkey";

-- DropForeignKey
ALTER TABLE "Classification" DROP CONSTRAINT "Classification_taskId_fkey";

-- DropForeignKey
ALTER TABLE "Classification" DROP CONSTRAINT "Classification_timelineId_fkey";

-- DropForeignKey
ALTER TABLE "Classification" DROP CONSTRAINT "Classification_userId_fkey";

-- DropTable
DROP TABLE "Association";

-- DropTable
DROP TABLE "Classification";

-- CreateTable
CREATE TABLE "UserClassification" (
    "id" TEXT NOT NULL,
    "seq" SERIAL NOT NULL,
    "categoryId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6),
    "removedAt" TIMESTAMPTZ(6),

    CONSTRAINT "UserClassification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RoleClassification" (
    "id" TEXT NOT NULL,
    "seq" SERIAL NOT NULL,
    "categoryId" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6),
    "removedAt" TIMESTAMPTZ(6),

    CONSTRAINT "RoleClassification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FileClassification" (
    "id" TEXT NOT NULL,
    "seq" SERIAL NOT NULL,
    "categoryId" TEXT NOT NULL,
    "fileId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6),
    "removedAt" TIMESTAMPTZ(6),

    CONSTRAINT "FileClassification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SpaceClassification" (
    "id" TEXT NOT NULL,
    "seq" SERIAL NOT NULL,
    "categoryId" TEXT NOT NULL,
    "spaceId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6),
    "removedAt" TIMESTAMPTZ(6),
    "taskId" TEXT,

    CONSTRAINT "SpaceClassification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserAssociation" (
    "id" TEXT NOT NULL,
    "seq" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6),
    "removedAt" TIMESTAMPTZ(6),
    "userId" TEXT NOT NULL,
    "groupId" TEXT NOT NULL,

    CONSTRAINT "UserAssociation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RoleAssociation" (
    "id" TEXT NOT NULL,
    "seq" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6),
    "removedAt" TIMESTAMPTZ(6),
    "groupId" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,

    CONSTRAINT "RoleAssociation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SpaceAssociation" (
    "id" TEXT NOT NULL,
    "seq" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6),
    "removedAt" TIMESTAMPTZ(6),
    "userId" TEXT NOT NULL,
    "spaceId" TEXT NOT NULL,

    CONSTRAINT "SpaceAssociation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FileAssociation" (
    "id" TEXT NOT NULL,
    "seq" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6),
    "removedAt" TIMESTAMPTZ(6),
    "userId" TEXT NOT NULL,
    "fileId" TEXT NOT NULL,

    CONSTRAINT "FileAssociation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserClassification_seq_key" ON "UserClassification"("seq");

-- CreateIndex
CREATE UNIQUE INDEX "UserClassification_userId_key" ON "UserClassification"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "RoleClassification_seq_key" ON "RoleClassification"("seq");

-- CreateIndex
CREATE UNIQUE INDEX "RoleClassification_categoryId_roleId_key" ON "RoleClassification"("categoryId", "roleId");

-- CreateIndex
CREATE UNIQUE INDEX "FileClassification_seq_key" ON "FileClassification"("seq");

-- CreateIndex
CREATE UNIQUE INDEX "FileClassification_categoryId_fileId_key" ON "FileClassification"("categoryId", "fileId");

-- CreateIndex
CREATE UNIQUE INDEX "SpaceClassification_seq_key" ON "SpaceClassification"("seq");

-- CreateIndex
CREATE UNIQUE INDEX "SpaceClassification_spaceId_key" ON "SpaceClassification"("spaceId");

-- CreateIndex
CREATE UNIQUE INDEX "SpaceClassification_taskId_key" ON "SpaceClassification"("taskId");

-- CreateIndex
CREATE UNIQUE INDEX "SpaceClassification_categoryId_spaceId_key" ON "SpaceClassification"("categoryId", "spaceId");

-- CreateIndex
CREATE UNIQUE INDEX "UserAssociation_seq_key" ON "UserAssociation"("seq");

-- CreateIndex
CREATE UNIQUE INDEX "UserAssociation_userId_groupId_key" ON "UserAssociation"("userId", "groupId");

-- CreateIndex
CREATE UNIQUE INDEX "RoleAssociation_seq_key" ON "RoleAssociation"("seq");

-- CreateIndex
CREATE UNIQUE INDEX "RoleAssociation_groupId_roleId_key" ON "RoleAssociation"("groupId", "roleId");

-- CreateIndex
CREATE UNIQUE INDEX "SpaceAssociation_seq_key" ON "SpaceAssociation"("seq");

-- CreateIndex
CREATE UNIQUE INDEX "SpaceAssociation_userId_spaceId_key" ON "SpaceAssociation"("userId", "spaceId");

-- CreateIndex
CREATE UNIQUE INDEX "FileAssociation_seq_key" ON "FileAssociation"("seq");

-- CreateIndex
CREATE UNIQUE INDEX "FileAssociation_userId_fileId_key" ON "FileAssociation"("userId", "fileId");

-- CreateIndex
CREATE UNIQUE INDEX "Activity_routineId_taskId_key" ON "Activity"("routineId", "taskId");

-- AddForeignKey
ALTER TABLE "UserClassification" ADD CONSTRAINT "UserClassification_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoleClassification" ADD CONSTRAINT "RoleClassification_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoleClassification" ADD CONSTRAINT "RoleClassification_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FileClassification" ADD CONSTRAINT "FileClassification_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "File"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FileClassification" ADD CONSTRAINT "FileClassification_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SpaceClassification" ADD CONSTRAINT "SpaceClassification_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SpaceClassification" ADD CONSTRAINT "SpaceClassification_spaceId_fkey" FOREIGN KEY ("spaceId") REFERENCES "Space"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SpaceClassification" ADD CONSTRAINT "SpaceClassification_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserAssociation" ADD CONSTRAINT "UserAssociation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserAssociation" ADD CONSTRAINT "UserAssociation_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoleAssociation" ADD CONSTRAINT "RoleAssociation_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoleAssociation" ADD CONSTRAINT "RoleAssociation_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SpaceAssociation" ADD CONSTRAINT "SpaceAssociation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SpaceAssociation" ADD CONSTRAINT "SpaceAssociation_spaceId_fkey" FOREIGN KEY ("spaceId") REFERENCES "Space"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FileAssociation" ADD CONSTRAINT "FileAssociation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FileAssociation" ADD CONSTRAINT "FileAssociation_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "File"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
