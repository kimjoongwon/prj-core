/*
  Warnings:

  - You are about to drop the column `sessionId` on the `Routine` table. All the data in the column will be lost.
  - Added the required column `contentId` to the `Sequence` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Routine" DROP COLUMN "sessionId";

-- AlterTable
ALTER TABLE "Sequence" ADD COLUMN     "contentId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Program" (
    "id" TEXT NOT NULL,
    "seq" SERIAL NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6),
    "removedAt" TIMESTAMPTZ(6),
    "routineId" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "tenancyId" TEXT NOT NULL,

    CONSTRAINT "Program_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Program_seq_key" ON "Program"("seq");
