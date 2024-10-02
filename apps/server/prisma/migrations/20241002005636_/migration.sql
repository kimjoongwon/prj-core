/*
  Warnings:

  - The values [INVITATION,INVITATION_ACCEPTED,INVITATION_REJECTED,INVITATION_EXPIRED,INVITATION_REMINDER] on the enum `TemplateNames` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `status` on the `Email` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Email` table. All the data in the column will be lost.
  - You are about to drop the column `answerText` on the `Qna` table. All the data in the column will be lost.
  - You are about to drop the column `answererId` on the `Qna` table. All the data in the column will be lost.
  - You are about to drop the column `questionText` on the `Qna` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Qna` table. All the data in the column will be lost.
  - You are about to drop the column `endAfterOccurrences` on the `Session` table. All the data in the column will be lost.
  - You are about to drop the column `endOnDate` on the `Session` table. All the data in the column will be lost.
  - You are about to drop the column `endType` on the `Session` table. All the data in the column will be lost.
  - You are about to drop the column `htmlContent` on the `Template` table. All the data in the column will be lost.
  - You are about to drop the column `date` on the `Timeline` table. All the data in the column will be lost.
  - You are about to drop the column `timelineItemId` on the `Timeline` table. All the data in the column will be lost.
  - You are about to drop the column `test` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `Template` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `postId` to the `Email` table without a default value. This is not possible if the table is not empty.
  - Made the column `fromUserId` on table `Email` required. This step will fail if there are existing NULL values in that column.
  - Made the column `sentAt` on table `Email` required. This step will fail if there are existing NULL values in that column.
  - Changed the type of `name` on the `Service` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `baseDate` to the `Session` table without a default value. This is not possible if the table is not empty.
  - Added the required column `postId` to the `Template` table without a default value. This is not possible if the table is not empty.
  - Added the required column `serviceId` to the `Template` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Timeline` table without a default value. This is not possible if the table is not empty.
  - Made the column `timelineId` on table `TimelineItem` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "PageTypes" AS ENUM ('BOTTOM_TAB', 'TOP_TAB', 'BUTTON', 'MENU');

-- CreateEnum
CREATE TYPE "QnaStatus" AS ENUM ('OPEN', 'CLOSED');

-- CreateEnum
CREATE TYPE "PostTypes" AS ENUM ('HTML', 'TEXT');

-- AlterEnum
ALTER TYPE "EmailStatus" ADD VALUE 'COMPLETED';

-- AlterEnum
ALTER TYPE "Roles" ADD VALUE 'ADMIN';

-- AlterEnum
BEGIN;
CREATE TYPE "TemplateNames_new" AS ENUM ('WELCOME', 'EMAIL_VERIFICATION', 'RESET_PASSWORD');
ALTER TABLE "Template" ALTER COLUMN "name" DROP DEFAULT;
ALTER TABLE "Template" ALTER COLUMN "name" TYPE "TemplateNames_new" USING ("name"::text::"TemplateNames_new");
ALTER TYPE "TemplateNames" RENAME TO "TemplateNames_old";
ALTER TYPE "TemplateNames_new" RENAME TO "TemplateNames";
DROP TYPE "TemplateNames_old";
ALTER TABLE "Template" ALTER COLUMN "name" SET DEFAULT 'WELCOME';
COMMIT;

-- DropForeignKey
ALTER TABLE "TimelineItem" DROP CONSTRAINT "TimelineItem_timelineId_fkey";

-- DropIndex
DROP INDEX "Profile_userId_key";

-- DropIndex
DROP INDEX "Tenant_userId_key";

-- DropIndex
DROP INDEX "Tenant_userId_tenancyId_key";

-- AlterTable
ALTER TABLE "Email" DROP COLUMN "status",
DROP COLUMN "title",
ADD COLUMN     "postId" TEXT NOT NULL,
ALTER COLUMN "fromUserId" SET NOT NULL,
ALTER COLUMN "sentAt" SET NOT NULL,
ALTER COLUMN "sentAt" SET DATA TYPE TIMESTAMPTZ(6);

-- AlterTable
ALTER TABLE "Qna" DROP COLUMN "answerText",
DROP COLUMN "answererId",
DROP COLUMN "questionText",
DROP COLUMN "title",
ADD COLUMN     "status" "QnaStatus" NOT NULL DEFAULT 'OPEN';

-- AlterTable
ALTER TABLE "Service" DROP COLUMN "name",
ADD COLUMN     "name" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Session" DROP COLUMN "endAfterOccurrences",
DROP COLUMN "endOnDate",
DROP COLUMN "endType",
ADD COLUMN     "baseDate" DATE NOT NULL,
ADD COLUMN     "endDate" DATE;

-- AlterTable
ALTER TABLE "Template" DROP COLUMN "htmlContent",
ADD COLUMN     "postId" TEXT NOT NULL,
ADD COLUMN     "serviceId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Timeline" DROP COLUMN "date",
DROP COLUMN "timelineItemId",
ADD COLUMN     "name" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "TimelineItem" ALTER COLUMN "timelineId" SET NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "test";

-- DropEnum
DROP TYPE "SERVICE_NAME";

-- CreateTable
CREATE TABLE "SystemEmail" (
    "id" TEXT NOT NULL,
    "status" "EmailStatus" NOT NULL DEFAULT 'PROGRESS',
    "emailId" TEXT NOT NULL,
    "templateId" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6),
    "removedAt" TIMESTAMPTZ(6),

    CONSTRAINT "SystemEmail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Question" (
    "id" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "qnaId" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6),
    "removedAt" TIMESTAMPTZ(6),

    CONSTRAINT "Question_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Answer" (
    "id" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6),
    "removedAt" TIMESTAMPTZ(6),

    CONSTRAINT "Answer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Post" (
    "id" TEXT NOT NULL,
    "type" "PostTypes" NOT NULL DEFAULT 'TEXT',
    "title" TEXT,
    "content" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6),
    "removedAt" TIMESTAMPTZ(6),

    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Page" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "pathname" TEXT NOT NULL,
    "type" "PageTypes" NOT NULL DEFAULT 'BUTTON',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6),
    "removedAt" TIMESTAMPTZ(6),

    CONSTRAINT "Page_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Page_name_key" ON "Page"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Page_pathname_key" ON "Page"("pathname");

-- CreateIndex
CREATE UNIQUE INDEX "Service_name_key" ON "Service"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Template_name_key" ON "Template"("name");

-- AddForeignKey
ALTER TABLE "SystemEmail" ADD CONSTRAINT "SystemEmail_emailId_fkey" FOREIGN KEY ("emailId") REFERENCES "Email"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SystemEmail" ADD CONSTRAINT "SystemEmail_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "Template"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Email" ADD CONSTRAINT "Email_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TimelineItem" ADD CONSTRAINT "TimelineItem_timelineId_fkey" FOREIGN KEY ("timelineId") REFERENCES "Timeline"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Template" ADD CONSTRAINT "Template_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Template" ADD CONSTRAINT "Template_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_qnaId_fkey" FOREIGN KEY ("qnaId") REFERENCES "Qna"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Answer" ADD CONSTRAINT "Answer_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Answer" ADD CONSTRAINT "Answer_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
