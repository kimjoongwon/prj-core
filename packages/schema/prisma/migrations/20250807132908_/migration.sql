-- CreateEnum
CREATE TYPE "SMSStatus" AS ENUM ('PROGRESS', 'PENDING', 'SENT', 'FAILED');

-- CreateEnum
CREATE TYPE "ReservationStatus" AS ENUM ('PENDING', 'CONFIRMED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "SessionTypes" AS ENUM ('ONE_TIME', 'ONE_TIME_RANGE', 'RECURRING');

-- CreateEnum
CREATE TYPE "RepeatCycleTypes" AS ENUM ('WEEKLY', 'MONTHLY');

-- CreateEnum
CREATE TYPE "SessionEndTypes" AS ENUM ('NEVER', 'ON_DATE', 'AFTER_OCCURRENCES');

-- CreateEnum
CREATE TYPE "RecurringDayOfWeek" AS ENUM ('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY');

-- CreateEnum
CREATE TYPE "AbilityActions" AS ENUM ('CREATE', 'READ', 'UPDATE', 'DELETE', 'ACCESS');

-- CreateEnum
CREATE TYPE "AbilityTypes" AS ENUM ('CAN', 'CAN_NOT');

-- CreateEnum
CREATE TYPE "Roles" AS ENUM ('USER', 'SUPER_ADMIN', 'ADMIN');

-- CreateEnum
CREATE TYPE "TemplateNames" AS ENUM ('WELCOME', 'EMAIL_VERIFICATION', 'RESET_PASSWORD');

-- CreateEnum
CREATE TYPE "QnaStatus" AS ENUM ('OPEN', 'CLOSED');

-- CreateEnum
CREATE TYPE "TextTypes" AS ENUM ('Editor', 'Input', 'Textarea');

-- CreateEnum
CREATE TYPE "CategoryTypes" AS ENUM ('Role', 'Space', 'File', 'User');

-- CreateEnum
CREATE TYPE "GroupTypes" AS ENUM ('Role', 'Space', 'File', 'User');

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "seq" SERIAL NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6),
    "removedAt" TIMESTAMPTZ(6),
    "name" TEXT NOT NULL,
    "type" "CategoryTypes" NOT NULL DEFAULT 'User',
    "parentId" TEXT,
    "tenantId" TEXT NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Group" (
    "id" TEXT NOT NULL,
    "seq" SERIAL NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6),
    "removedAt" TIMESTAMPTZ(6),
    "name" TEXT NOT NULL,
    "type" "GroupTypes" NOT NULL DEFAULT 'User',
    "label" TEXT,
    "tenantId" TEXT NOT NULL,

    CONSTRAINT "Group_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Exercise" (
    "id" TEXT NOT NULL,
    "seq" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6),
    "removedAt" TIMESTAMPTZ(6),
    "duration" INTEGER NOT NULL,
    "count" INTEGER NOT NULL,
    "taskId" TEXT NOT NULL,
    "description" TEXT,
    "imageFileId" TEXT,
    "name" TEXT NOT NULL,
    "videoFileId" TEXT,

    CONSTRAINT "Exercise_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tenant" (
    "id" TEXT NOT NULL,
    "seq" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6),
    "removedAt" TIMESTAMPTZ(6),
    "userId" TEXT NOT NULL,
    "spaceId" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,
    "main" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Tenant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Timeline" (
    "id" TEXT NOT NULL,
    "seq" SERIAL NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6),
    "removedAt" TIMESTAMPTZ(6),
    "tenantId" TEXT NOT NULL,

    CONSTRAINT "Timeline_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "seq" SERIAL NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6),
    "removedAt" TIMESTAMPTZ(6),
    "type" "SessionTypes" NOT NULL DEFAULT 'ONE_TIME',
    "repeatCycleType" "RepeatCycleTypes",
    "startDateTime" TIMESTAMPTZ(6),
    "endDateTime" TIMESTAMPTZ(6),
    "recurringDayOfWeek" "RecurringDayOfWeek",
    "recurringMonth" INTEGER,
    "timelineId" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Program" (
    "id" TEXT NOT NULL,
    "seq" SERIAL NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6),
    "removedAt" TIMESTAMPTZ(6),
    "routineId" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "instructorId" TEXT NOT NULL,
    "capacity" INTEGER NOT NULL,

    CONSTRAINT "Program_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Activity" (
    "id" TEXT NOT NULL,
    "seq" SERIAL NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6),
    "removedAt" TIMESTAMPTZ(6),
    "routineId" TEXT NOT NULL,
    "taskId" TEXT NOT NULL,

    CONSTRAINT "Activity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Routine" (
    "id" TEXT NOT NULL,
    "seq" SERIAL NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6),
    "removedAt" TIMESTAMPTZ(6),
    "name" TEXT NOT NULL,
    "label" TEXT NOT NULL,

    CONSTRAINT "Routine_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Task" (
    "id" TEXT NOT NULL,
    "seq" SERIAL NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6),
    "removedAt" TIMESTAMPTZ(6),
    "tenantId" TEXT NOT NULL,

    CONSTRAINT "Task_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Assignment" (
    "id" TEXT NOT NULL,
    "seq" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6),
    "removedAt" TIMESTAMPTZ(6),
    "roleId" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,

    CONSTRAINT "Assignment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Action" (
    "id" TEXT NOT NULL,
    "seq" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6),
    "removedAt" TIMESTAMPTZ(6),
    "name" "AbilityActions" NOT NULL DEFAULT 'CREATE',
    "conditions" JSONB,
    "tenantId" TEXT NOT NULL,

    CONSTRAINT "Action_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subject" (
    "id" TEXT NOT NULL,
    "seq" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6),
    "removedAt" TIMESTAMPTZ(6),
    "name" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,

    CONSTRAINT "Subject_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ability" (
    "id" TEXT NOT NULL,
    "seq" SERIAL NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6),
    "removedAt" TIMESTAMPTZ(6),
    "type" "AbilityTypes" NOT NULL,
    "roleId" TEXT NOT NULL,
    "description" TEXT,
    "conditions" JSONB,
    "subjectId" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,

    CONSTRAINT "Ability_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Post" (
    "id" TEXT NOT NULL,
    "seq" SERIAL NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6),
    "removedAt" TIMESTAMPTZ(6),
    "contentId" TEXT NOT NULL,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Content" (
    "id" TEXT NOT NULL,
    "seq" SERIAL NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6),
    "removedAt" TIMESTAMPTZ(6),
    "title" TEXT,
    "description" TEXT,
    "type" "TextTypes" NOT NULL DEFAULT 'Editor',
    "text" VARCHAR(1000),
    "fileId" TEXT,
    "tenantId" TEXT NOT NULL,

    CONSTRAINT "Content_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "File" (
    "id" TEXT NOT NULL,
    "seq" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "parentId" TEXT,
    "mimeType" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6),
    "removedAt" TIMESTAMPTZ(6),

    CONSTRAINT "File_pkey" PRIMARY KEY ("id")
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
CREATE TABLE "FileAssociation" (
    "id" TEXT NOT NULL,
    "seq" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6),
    "removedAt" TIMESTAMPTZ(6),
    "fileId" TEXT NOT NULL,
    "groupId" TEXT NOT NULL,

    CONSTRAINT "FileAssociation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Role" (
    "id" TEXT NOT NULL,
    "seq" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6),
    "removedAt" TIMESTAMPTZ(6),
    "name" "Roles" NOT NULL DEFAULT 'USER',

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RoleAssociation" (
    "id" TEXT NOT NULL,
    "seq" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6),
    "removedAt" TIMESTAMPTZ(6),
    "roleId" TEXT NOT NULL,
    "groupId" TEXT NOT NULL,

    CONSTRAINT "RoleAssociation_pkey" PRIMARY KEY ("id")
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
CREATE TABLE "Space" (
    "id" TEXT NOT NULL,
    "seq" SERIAL NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6),
    "removedAt" TIMESTAMPTZ(6),

    CONSTRAINT "Space_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SpaceClassification" (
    "id" TEXT NOT NULL,
    "seq" SERIAL NOT NULL,
    "categoryId" TEXT NOT NULL,
    "spaceId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6),
    "removedAt" TIMESTAMPTZ(6),

    CONSTRAINT "SpaceClassification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SpaceAssociation" (
    "id" TEXT NOT NULL,
    "seq" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6),
    "removedAt" TIMESTAMPTZ(6),
    "spaceId" TEXT NOT NULL,
    "groupId" TEXT NOT NULL,

    CONSTRAINT "SpaceAssociation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ground" (
    "id" TEXT NOT NULL,
    "seq" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6),
    "removedAt" TIMESTAMPTZ(6),
    "name" TEXT NOT NULL,
    "label" TEXT,
    "address" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "businessNo" TEXT NOT NULL,
    "spaceId" TEXT NOT NULL,
    "logoImageFileId" TEXT,
    "imageFileId" TEXT,

    CONSTRAINT "Ground_pkey" PRIMARY KEY ("id")
);

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
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "seq" SERIAL NOT NULL,
    "updatedAt" TIMESTAMPTZ(6),
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "removedAt" TIMESTAMPTZ(6),
    "phone" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
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
CREATE TABLE "Profile" (
    "id" TEXT NOT NULL,
    "seq" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6),
    "removedAt" TIMESTAMPTZ(6),
    "name" TEXT NOT NULL,
    "nickname" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "avatarFileId" TEXT,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Category_seq_key" ON "Category"("seq");

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Group_seq_key" ON "Group"("seq");

-- CreateIndex
CREATE UNIQUE INDEX "Exercise_seq_key" ON "Exercise"("seq");

-- CreateIndex
CREATE UNIQUE INDEX "Exercise_taskId_key" ON "Exercise"("taskId");

-- CreateIndex
CREATE UNIQUE INDEX "Tenant_seq_key" ON "Tenant"("seq");

-- CreateIndex
CREATE UNIQUE INDEX "Timeline_seq_key" ON "Timeline"("seq");

-- CreateIndex
CREATE UNIQUE INDEX "Session_seq_key" ON "Session"("seq");

-- CreateIndex
CREATE UNIQUE INDEX "Program_seq_key" ON "Program"("seq");

-- CreateIndex
CREATE UNIQUE INDEX "Program_routineId_key" ON "Program"("routineId");

-- CreateIndex
CREATE UNIQUE INDEX "Program_sessionId_key" ON "Program"("sessionId");

-- CreateIndex
CREATE UNIQUE INDEX "Activity_seq_key" ON "Activity"("seq");

-- CreateIndex
CREATE UNIQUE INDEX "Activity_routineId_taskId_key" ON "Activity"("routineId", "taskId");

-- CreateIndex
CREATE UNIQUE INDEX "Routine_seq_key" ON "Routine"("seq");

-- CreateIndex
CREATE UNIQUE INDEX "Task_seq_key" ON "Task"("seq");

-- CreateIndex
CREATE UNIQUE INDEX "Assignment_seq_key" ON "Assignment"("seq");

-- CreateIndex
CREATE UNIQUE INDEX "Action_seq_key" ON "Action"("seq");

-- CreateIndex
CREATE UNIQUE INDEX "Subject_seq_key" ON "Subject"("seq");

-- CreateIndex
CREATE UNIQUE INDEX "Subject_name_key" ON "Subject"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Ability_seq_key" ON "Ability"("seq");

-- CreateIndex
CREATE UNIQUE INDEX "Post_seq_key" ON "Post"("seq");

-- CreateIndex
CREATE UNIQUE INDEX "Content_seq_key" ON "Content"("seq");

-- CreateIndex
CREATE UNIQUE INDEX "File_seq_key" ON "File"("seq");

-- CreateIndex
CREATE UNIQUE INDEX "FileClassification_seq_key" ON "FileClassification"("seq");

-- CreateIndex
CREATE UNIQUE INDEX "FileClassification_categoryId_fileId_key" ON "FileClassification"("categoryId", "fileId");

-- CreateIndex
CREATE UNIQUE INDEX "FileAssociation_seq_key" ON "FileAssociation"("seq");

-- CreateIndex
CREATE UNIQUE INDEX "FileAssociation_groupId_fileId_key" ON "FileAssociation"("groupId", "fileId");

-- CreateIndex
CREATE UNIQUE INDEX "Role_seq_key" ON "Role"("seq");

-- CreateIndex
CREATE UNIQUE INDEX "Role_name_key" ON "Role"("name");

-- CreateIndex
CREATE UNIQUE INDEX "RoleAssociation_seq_key" ON "RoleAssociation"("seq");

-- CreateIndex
CREATE UNIQUE INDEX "RoleAssociation_groupId_roleId_key" ON "RoleAssociation"("groupId", "roleId");

-- CreateIndex
CREATE UNIQUE INDEX "RoleClassification_seq_key" ON "RoleClassification"("seq");

-- CreateIndex
CREATE UNIQUE INDEX "RoleClassification_categoryId_roleId_key" ON "RoleClassification"("categoryId", "roleId");

-- CreateIndex
CREATE UNIQUE INDEX "Space_seq_key" ON "Space"("seq");

-- CreateIndex
CREATE UNIQUE INDEX "SpaceClassification_seq_key" ON "SpaceClassification"("seq");

-- CreateIndex
CREATE UNIQUE INDEX "SpaceClassification_categoryId_spaceId_key" ON "SpaceClassification"("categoryId", "spaceId");

-- CreateIndex
CREATE UNIQUE INDEX "SpaceAssociation_seq_key" ON "SpaceAssociation"("seq");

-- CreateIndex
CREATE UNIQUE INDEX "SpaceAssociation_spaceId_groupId_key" ON "SpaceAssociation"("spaceId", "groupId");

-- CreateIndex
CREATE UNIQUE INDEX "Ground_seq_key" ON "Ground"("seq");

-- CreateIndex
CREATE UNIQUE INDEX "Ground_businessNo_key" ON "Ground"("businessNo");

-- CreateIndex
CREATE UNIQUE INDEX "Ground_spaceId_key" ON "Ground"("spaceId");

-- CreateIndex
CREATE UNIQUE INDEX "UserClassification_seq_key" ON "UserClassification"("seq");

-- CreateIndex
CREATE UNIQUE INDEX "UserClassification_categoryId_userId_key" ON "UserClassification"("categoryId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "User_seq_key" ON "User"("seq");

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "User_name_key" ON "User"("name");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "UserAssociation_seq_key" ON "UserAssociation"("seq");

-- CreateIndex
CREATE UNIQUE INDEX "Profile_seq_key" ON "Profile"("seq");

-- CreateIndex
CREATE UNIQUE INDEX "Profile_nickname_key" ON "Profile"("nickname");

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Group" ADD CONSTRAINT "Group_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Exercise" ADD CONSTRAINT "Exercise_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tenant" ADD CONSTRAINT "Tenant_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tenant" ADD CONSTRAINT "Tenant_spaceId_fkey" FOREIGN KEY ("spaceId") REFERENCES "Space"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tenant" ADD CONSTRAINT "Tenant_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Timeline" ADD CONSTRAINT "Timeline_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_timelineId_fkey" FOREIGN KEY ("timelineId") REFERENCES "Timeline"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Program" ADD CONSTRAINT "Program_routineId_fkey" FOREIGN KEY ("routineId") REFERENCES "Routine"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Program" ADD CONSTRAINT "Program_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "Session"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Assignment" ADD CONSTRAINT "Assignment_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Assignment" ADD CONSTRAINT "Assignment_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ability" ADD CONSTRAINT "Ability_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_contentId_fkey" FOREIGN KEY ("contentId") REFERENCES "Content"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Content" ADD CONSTRAINT "Content_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "File"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FileClassification" ADD CONSTRAINT "FileClassification_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FileClassification" ADD CONSTRAINT "FileClassification_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "File"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FileAssociation" ADD CONSTRAINT "FileAssociation_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "File"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FileAssociation" ADD CONSTRAINT "FileAssociation_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoleAssociation" ADD CONSTRAINT "RoleAssociation_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoleAssociation" ADD CONSTRAINT "RoleAssociation_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoleClassification" ADD CONSTRAINT "RoleClassification_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoleClassification" ADD CONSTRAINT "RoleClassification_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SpaceClassification" ADD CONSTRAINT "SpaceClassification_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SpaceClassification" ADD CONSTRAINT "SpaceClassification_spaceId_fkey" FOREIGN KEY ("spaceId") REFERENCES "Space"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SpaceAssociation" ADD CONSTRAINT "SpaceAssociation_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SpaceAssociation" ADD CONSTRAINT "SpaceAssociation_spaceId_fkey" FOREIGN KEY ("spaceId") REFERENCES "Space"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ground" ADD CONSTRAINT "Ground_spaceId_fkey" FOREIGN KEY ("spaceId") REFERENCES "Space"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserClassification" ADD CONSTRAINT "UserClassification_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserAssociation" ADD CONSTRAINT "UserAssociation_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
