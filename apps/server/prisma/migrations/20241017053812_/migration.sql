/*
  Warnings:

  - A unique constraint covering the columns `[seq]` on the table `Ability` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[seq]` on the table `Answer` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[seq]` on the table `Assignment` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[seq]` on the table `Category` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[seq]` on the table `Classification` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[seq]` on the table `Email` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[seq]` on the table `Group` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[seq]` on the table `Page` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[seq]` on the table `Post` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[seq]` on the table `Profile` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[seq]` on the table `Qna` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[seq]` on the table `Question` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[seq]` on the table `Reservation` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[seq]` on the table `Role` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[seq]` on the table `SMS` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[seq]` on the table `Service` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[seq]` on the table `Session` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[seq]` on the table `Space` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[seq]` on the table `Subject` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[seq]` on the table `SystemEmail` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[seq]` on the table `Template` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[seq]` on the table `Tenancy` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[seq]` on the table `Tenant` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[seq]` on the table `Timeline` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[seq]` on the table `TimelineItem` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[seq]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Ability" ADD COLUMN     "seq" SERIAL NOT NULL;

-- AlterTable
ALTER TABLE "Answer" ADD COLUMN     "seq" SERIAL NOT NULL;

-- AlterTable
ALTER TABLE "Assignment" ADD COLUMN     "seq" SERIAL NOT NULL;

-- AlterTable
ALTER TABLE "Category" ADD COLUMN     "seq" SERIAL NOT NULL;

-- AlterTable
ALTER TABLE "Classification" ADD COLUMN     "seq" SERIAL NOT NULL;

-- AlterTable
ALTER TABLE "Email" ADD COLUMN     "seq" SERIAL NOT NULL;

-- AlterTable
ALTER TABLE "Group" ADD COLUMN     "seq" SERIAL NOT NULL;

-- AlterTable
ALTER TABLE "Page" ADD COLUMN     "seq" SERIAL NOT NULL;

-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "seq" SERIAL NOT NULL;

-- AlterTable
ALTER TABLE "Profile" ADD COLUMN     "seq" SERIAL NOT NULL;

-- AlterTable
ALTER TABLE "Qna" ADD COLUMN     "seq" SERIAL NOT NULL;

-- AlterTable
ALTER TABLE "Question" ADD COLUMN     "seq" SERIAL NOT NULL;

-- AlterTable
ALTER TABLE "Reservation" ADD COLUMN     "seq" SERIAL NOT NULL;

-- AlterTable
ALTER TABLE "Role" ADD COLUMN     "seq" SERIAL NOT NULL;

-- AlterTable
ALTER TABLE "SMS" ADD COLUMN     "seq" SERIAL NOT NULL;

-- AlterTable
ALTER TABLE "Service" ADD COLUMN     "seq" SERIAL NOT NULL;

-- AlterTable
ALTER TABLE "Session" ADD COLUMN     "seq" SERIAL NOT NULL;

-- AlterTable
ALTER TABLE "Space" ADD COLUMN     "seq" SERIAL NOT NULL;

-- AlterTable
ALTER TABLE "Subject" ADD COLUMN     "seq" SERIAL NOT NULL;

-- AlterTable
ALTER TABLE "SystemEmail" ADD COLUMN     "seq" SERIAL NOT NULL;

-- AlterTable
ALTER TABLE "Template" ADD COLUMN     "seq" SERIAL NOT NULL;

-- AlterTable
ALTER TABLE "Tenancy" ADD COLUMN     "seq" SERIAL NOT NULL;

-- AlterTable
ALTER TABLE "Tenant" ADD COLUMN     "seq" SERIAL NOT NULL;

-- AlterTable
ALTER TABLE "Timeline" ADD COLUMN     "seq" SERIAL NOT NULL;

-- AlterTable
ALTER TABLE "TimelineItem" ADD COLUMN     "seq" SERIAL NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "seq" SERIAL NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Ability_seq_key" ON "Ability"("seq");

-- CreateIndex
CREATE UNIQUE INDEX "Answer_seq_key" ON "Answer"("seq");

-- CreateIndex
CREATE UNIQUE INDEX "Assignment_seq_key" ON "Assignment"("seq");

-- CreateIndex
CREATE UNIQUE INDEX "Category_seq_key" ON "Category"("seq");

-- CreateIndex
CREATE UNIQUE INDEX "Classification_seq_key" ON "Classification"("seq");

-- CreateIndex
CREATE UNIQUE INDEX "Email_seq_key" ON "Email"("seq");

-- CreateIndex
CREATE UNIQUE INDEX "Group_seq_key" ON "Group"("seq");

-- CreateIndex
CREATE UNIQUE INDEX "Page_seq_key" ON "Page"("seq");

-- CreateIndex
CREATE UNIQUE INDEX "Post_seq_key" ON "Post"("seq");

-- CreateIndex
CREATE UNIQUE INDEX "Profile_seq_key" ON "Profile"("seq");

-- CreateIndex
CREATE UNIQUE INDEX "Qna_seq_key" ON "Qna"("seq");

-- CreateIndex
CREATE UNIQUE INDEX "Question_seq_key" ON "Question"("seq");

-- CreateIndex
CREATE UNIQUE INDEX "Reservation_seq_key" ON "Reservation"("seq");

-- CreateIndex
CREATE UNIQUE INDEX "Role_seq_key" ON "Role"("seq");

-- CreateIndex
CREATE UNIQUE INDEX "SMS_seq_key" ON "SMS"("seq");

-- CreateIndex
CREATE UNIQUE INDEX "Service_seq_key" ON "Service"("seq");

-- CreateIndex
CREATE UNIQUE INDEX "Session_seq_key" ON "Session"("seq");

-- CreateIndex
CREATE UNIQUE INDEX "Space_seq_key" ON "Space"("seq");

-- CreateIndex
CREATE UNIQUE INDEX "Subject_seq_key" ON "Subject"("seq");

-- CreateIndex
CREATE UNIQUE INDEX "SystemEmail_seq_key" ON "SystemEmail"("seq");

-- CreateIndex
CREATE UNIQUE INDEX "Template_seq_key" ON "Template"("seq");

-- CreateIndex
CREATE UNIQUE INDEX "Tenancy_seq_key" ON "Tenancy"("seq");

-- CreateIndex
CREATE UNIQUE INDEX "Tenant_seq_key" ON "Tenant"("seq");

-- CreateIndex
CREATE UNIQUE INDEX "Timeline_seq_key" ON "Timeline"("seq");

-- CreateIndex
CREATE UNIQUE INDEX "TimelineItem_seq_key" ON "TimelineItem"("seq");

-- CreateIndex
CREATE UNIQUE INDEX "User_seq_key" ON "User"("seq");
