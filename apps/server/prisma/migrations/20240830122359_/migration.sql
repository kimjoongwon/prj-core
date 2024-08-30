/*
  Warnings:

  - The values [SETTING] on the enum `SERVICE_NAME` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `deletedAt` on the `Ability` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `Assignment` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `Category` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `Classification` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `Group` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `Reservation` table. All the data in the column will be lost.
  - The `status` column on the `Reservation` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `deletedAt` on the `Role` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `Service` table. All the data in the column will be lost.
  - You are about to drop the column `dates` on the `Session` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `Session` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `Space` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `Subject` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `Tenant` table. All the data in the column will be lost.
  - You are about to drop the column `spaceId` on the `Tenant` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `Timeline` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Timeline` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `TimelineItem` table. All the data in the column will be lost.
  - You are about to drop the column `sessionId` on the `TimelineItem` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `EmailTemplate` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Presence` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[userId]` on the table `Profile` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId]` on the table `Reservation` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[timelineItemId]` on the table `Reservation` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,timelineItemId]` on the table `Reservation` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `Role` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `Service` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId]` on the table `Tenant` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,tenancyId]` on the table `Tenant` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `tenantId` to the `Reservation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Reservation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tenancyId` to the `Tenant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tenantId` to the `Timeline` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tenantId` to the `TimelineItem` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TenantTypes" AS ENUM ('PHYSICAL', 'ABSTRACT');

-- CreateEnum
CREATE TYPE "TemplateNames" AS ENUM ('WELCOME', 'RESET_PASSWORD', 'INVITATION', 'INVITATION_ACCEPTED', 'INVITATION_REJECTED', 'INVITATION_EXPIRED', 'INVITATION_REMINDER');

-- CreateEnum
CREATE TYPE "EmailStatus" AS ENUM ('PROGRESS', 'PENDING', 'SENT', 'FAILED');

-- CreateEnum
CREATE TYPE "SMSStatus" AS ENUM ('PROGRESS', 'PENDING', 'SENT', 'FAILED');

-- CreateEnum
CREATE TYPE "ReservationStatus" AS ENUM ('PENDING', 'CONFIRMED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "SessionTypes" AS ENUM ('ONE_TIME', 'RECURRING');

-- CreateEnum
CREATE TYPE "RepeatCycleTypes" AS ENUM ('DAY', 'WEEK', 'MONTH', 'YEAR');

-- CreateEnum
CREATE TYPE "SessionEndTypes" AS ENUM ('NEVER', 'ON_DATE', 'AFTER_OCCURRENCES');

-- CreateEnum
CREATE TYPE "RecurringDayOfTheWeek" AS ENUM ('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY');

-- AlterEnum
BEGIN;
CREATE TYPE "SERVICE_NAME_new" AS ENUM ('USER', 'RESERVATION', 'SPACE');
ALTER TABLE "Service" ALTER COLUMN "name" TYPE "SERVICE_NAME_new" USING ("name"::text::"SERVICE_NAME_new");
ALTER TYPE "SERVICE_NAME" RENAME TO "SERVICE_NAME_old";
ALTER TYPE "SERVICE_NAME_new" RENAME TO "SERVICE_NAME";
DROP TYPE "SERVICE_NAME_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "Tenant" DROP CONSTRAINT "Tenant_spaceId_fkey";

-- AlterTable
ALTER TABLE "Ability" DROP COLUMN "deletedAt",
ADD COLUMN     "removedAt" TIMESTAMPTZ(6);

-- AlterTable
ALTER TABLE "Assignment" DROP COLUMN "deletedAt",
ADD COLUMN     "removedAt" TIMESTAMPTZ(6);

-- AlterTable
ALTER TABLE "Category" DROP COLUMN "deletedAt",
ADD COLUMN     "removedAt" TIMESTAMPTZ(6);

-- AlterTable
ALTER TABLE "Classification" DROP COLUMN "deletedAt",
ADD COLUMN     "removedAt" TIMESTAMPTZ(6);

-- AlterTable
ALTER TABLE "Group" DROP COLUMN "deletedAt",
ADD COLUMN     "removedAt" TIMESTAMPTZ(6);

-- AlterTable
ALTER TABLE "Profile" DROP COLUMN "deletedAt",
ADD COLUMN     "removedAt" TIMESTAMPTZ(6);

-- AlterTable
ALTER TABLE "Reservation" DROP COLUMN "deletedAt",
ADD COLUMN     "removedAt" TIMESTAMPTZ(6),
ADD COLUMN     "tenantId" TEXT NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" "ReservationStatus" NOT NULL DEFAULT 'CONFIRMED';

-- AlterTable
ALTER TABLE "Role" DROP COLUMN "deletedAt",
ADD COLUMN     "removedAt" TIMESTAMPTZ(6);

-- AlterTable
ALTER TABLE "Service" DROP COLUMN "deletedAt",
ADD COLUMN     "removedAt" TIMESTAMPTZ(6);

-- AlterTable
ALTER TABLE "Session" DROP COLUMN "dates",
DROP COLUMN "deletedAt",
ADD COLUMN     "endAfterOccurrences" INTEGER DEFAULT 0,
ADD COLUMN     "endOnDate" DATE,
ADD COLUMN     "endType" "SessionEndTypes" NOT NULL DEFAULT 'NEVER',
ADD COLUMN     "recurringDayOfTheWeek" "RecurringDayOfTheWeek"[] DEFAULT ARRAY[]::"RecurringDayOfTheWeek"[],
ADD COLUMN     "removedAt" TIMESTAMPTZ(6),
ADD COLUMN     "repeatCycle" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "repeatCycleType" "RepeatCycleTypes" NOT NULL DEFAULT 'DAY',
ADD COLUMN     "type" "SessionTypes" NOT NULL DEFAULT 'ONE_TIME';

-- AlterTable
ALTER TABLE "Space" DROP COLUMN "deletedAt",
ADD COLUMN     "removedAt" TIMESTAMPTZ(6);

-- AlterTable
ALTER TABLE "Subject" DROP COLUMN "deletedAt",
ADD COLUMN     "removedAt" TIMESTAMPTZ(6);

-- AlterTable
ALTER TABLE "Tenant" DROP COLUMN "deletedAt",
DROP COLUMN "spaceId",
ADD COLUMN     "active" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "removedAt" TIMESTAMPTZ(6),
ADD COLUMN     "tenancyId" TEXT NOT NULL,
ADD COLUMN     "type" "TenantTypes" NOT NULL DEFAULT 'PHYSICAL';

-- AlterTable
ALTER TABLE "Timeline" DROP COLUMN "deletedAt",
DROP COLUMN "name",
ADD COLUMN     "removedAt" TIMESTAMPTZ(6),
ADD COLUMN     "tenantId" TEXT NOT NULL,
ADD COLUMN     "timelineItemId" TEXT;

-- AlterTable
ALTER TABLE "TimelineItem" DROP COLUMN "deletedAt",
DROP COLUMN "sessionId",
ADD COLUMN     "removedAt" TIMESTAMPTZ(6),
ADD COLUMN     "tenantId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "deletedAt",
ADD COLUMN     "removedAt" TIMESTAMPTZ(6),
ADD COLUMN     "test" TEXT;

-- DropTable
DROP TABLE "EmailTemplate";

-- DropTable
DROP TABLE "Presence";

-- DropEnum
DROP TYPE "EmailTemplates";

-- CreateTable
CREATE TABLE "Tenancy" (
    "id" TEXT NOT NULL,
    "spaceId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6),
    "removedAt" TIMESTAMPTZ(6),

    CONSTRAINT "Tenancy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Template" (
    "id" TEXT NOT NULL,
    "name" "TemplateNames" NOT NULL DEFAULT 'WELCOME',
    "htmlContent" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6),
    "removedAt" TIMESTAMPTZ(6),

    CONSTRAINT "Template_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SMS" (
    "id" TEXT NOT NULL,
    "toUserIds" TEXT[],
    "fromUserId" TEXT,
    "status" "SMSStatus" NOT NULL DEFAULT 'PROGRESS',
    "sentAt" TIMESTAMP(3),
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6),
    "removedAt" TIMESTAMPTZ(6),

    CONSTRAINT "SMS_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Email" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "toUserIds" TEXT[],
    "fromUserId" TEXT,
    "status" "EmailStatus" NOT NULL DEFAULT 'PROGRESS',
    "sentAt" TIMESTAMP(3),
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6),
    "removedAt" TIMESTAMPTZ(6),

    CONSTRAINT "Email_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Qna" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "questionText" TEXT NOT NULL,
    "answerText" TEXT NOT NULL,
    "answererId" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6),
    "removedAt" TIMESTAMPTZ(6),

    CONSTRAINT "Qna_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Tenancy_spaceId_key" ON "Tenancy"("spaceId");

-- CreateIndex
CREATE UNIQUE INDEX "Profile_userId_key" ON "Profile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Reservation_userId_key" ON "Reservation"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Reservation_timelineItemId_key" ON "Reservation"("timelineItemId");

-- CreateIndex
CREATE UNIQUE INDEX "Reservation_userId_timelineItemId_key" ON "Reservation"("userId", "timelineItemId");

-- CreateIndex
CREATE UNIQUE INDEX "Role_name_key" ON "Role"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Service_name_key" ON "Service"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Tenant_userId_key" ON "Tenant"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Tenant_userId_tenancyId_key" ON "Tenant"("userId", "tenancyId");

-- AddForeignKey
ALTER TABLE "Tenancy" ADD CONSTRAINT "Tenancy_spaceId_fkey" FOREIGN KEY ("spaceId") REFERENCES "Space"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tenant" ADD CONSTRAINT "Tenant_tenancyId_fkey" FOREIGN KEY ("tenancyId") REFERENCES "Tenancy"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
