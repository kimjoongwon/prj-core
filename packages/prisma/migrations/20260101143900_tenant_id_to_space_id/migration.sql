/*
  Warnings:

  - You are about to drop the `Ability` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Action` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Activity` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Assignment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Category` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Content` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Exercise` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `File` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FileAssociation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FileClassification` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Ground` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Group` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Post` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Profile` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Program` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Role` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RoleAssociation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RoleClassification` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Routine` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Session` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Space` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SpaceAssociation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SpaceClassification` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Subject` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Task` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Tenant` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Timeline` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserAssociation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserClassification` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Ability" DROP CONSTRAINT "Ability_roleId_fkey";

-- DropForeignKey
ALTER TABLE "Assignment" DROP CONSTRAINT "Assignment_roleId_fkey";

-- DropForeignKey
ALTER TABLE "Assignment" DROP CONSTRAINT "Assignment_tenantId_fkey";

-- DropForeignKey
ALTER TABLE "Category" DROP CONSTRAINT "Category_parentId_fkey";

-- DropForeignKey
ALTER TABLE "Category" DROP CONSTRAINT "Category_tenantId_fkey";

-- DropForeignKey
ALTER TABLE "Content" DROP CONSTRAINT "Content_tenantId_fkey";

-- DropForeignKey
ALTER TABLE "Exercise" DROP CONSTRAINT "Exercise_taskId_fkey";

-- DropForeignKey
ALTER TABLE "File" DROP CONSTRAINT "File_parentId_fkey";

-- DropForeignKey
ALTER TABLE "File" DROP CONSTRAINT "File_tenantId_fkey";

-- DropForeignKey
ALTER TABLE "FileAssociation" DROP CONSTRAINT "FileAssociation_fileId_fkey";

-- DropForeignKey
ALTER TABLE "FileAssociation" DROP CONSTRAINT "FileAssociation_groupId_fkey";

-- DropForeignKey
ALTER TABLE "FileClassification" DROP CONSTRAINT "FileClassification_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "FileClassification" DROP CONSTRAINT "FileClassification_fileId_fkey";

-- DropForeignKey
ALTER TABLE "Ground" DROP CONSTRAINT "Ground_spaceId_fkey";

-- DropForeignKey
ALTER TABLE "Group" DROP CONSTRAINT "Group_tenantId_fkey";

-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_contentId_fkey";

-- DropForeignKey
ALTER TABLE "Profile" DROP CONSTRAINT "Profile_userId_fkey";

-- DropForeignKey
ALTER TABLE "Program" DROP CONSTRAINT "Program_routineId_fkey";

-- DropForeignKey
ALTER TABLE "Program" DROP CONSTRAINT "Program_sessionId_fkey";

-- DropForeignKey
ALTER TABLE "RoleAssociation" DROP CONSTRAINT "RoleAssociation_groupId_fkey";

-- DropForeignKey
ALTER TABLE "RoleAssociation" DROP CONSTRAINT "RoleAssociation_roleId_fkey";

-- DropForeignKey
ALTER TABLE "RoleClassification" DROP CONSTRAINT "RoleClassification_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "RoleClassification" DROP CONSTRAINT "RoleClassification_roleId_fkey";

-- DropForeignKey
ALTER TABLE "Session" DROP CONSTRAINT "Session_timelineId_fkey";

-- DropForeignKey
ALTER TABLE "SpaceAssociation" DROP CONSTRAINT "SpaceAssociation_groupId_fkey";

-- DropForeignKey
ALTER TABLE "SpaceAssociation" DROP CONSTRAINT "SpaceAssociation_spaceId_fkey";

-- DropForeignKey
ALTER TABLE "SpaceClassification" DROP CONSTRAINT "SpaceClassification_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "SpaceClassification" DROP CONSTRAINT "SpaceClassification_spaceId_fkey";

-- DropForeignKey
ALTER TABLE "Tenant" DROP CONSTRAINT "Tenant_roleId_fkey";

-- DropForeignKey
ALTER TABLE "Tenant" DROP CONSTRAINT "Tenant_spaceId_fkey";

-- DropForeignKey
ALTER TABLE "Tenant" DROP CONSTRAINT "Tenant_userId_fkey";

-- DropForeignKey
ALTER TABLE "Timeline" DROP CONSTRAINT "Timeline_tenantId_fkey";

-- DropForeignKey
ALTER TABLE "UserAssociation" DROP CONSTRAINT "UserAssociation_groupId_fkey";

-- DropForeignKey
ALTER TABLE "UserClassification" DROP CONSTRAINT "UserClassification_categoryId_fkey";

-- DropTable
DROP TABLE "Ability";

-- DropTable
DROP TABLE "Action";

-- DropTable
DROP TABLE "Activity";

-- DropTable
DROP TABLE "Assignment";

-- DropTable
DROP TABLE "Category";

-- DropTable
DROP TABLE "Content";

-- DropTable
DROP TABLE "Exercise";

-- DropTable
DROP TABLE "File";

-- DropTable
DROP TABLE "FileAssociation";

-- DropTable
DROP TABLE "FileClassification";

-- DropTable
DROP TABLE "Ground";

-- DropTable
DROP TABLE "Group";

-- DropTable
DROP TABLE "Post";

-- DropTable
DROP TABLE "Profile";

-- DropTable
DROP TABLE "Program";

-- DropTable
DROP TABLE "Role";

-- DropTable
DROP TABLE "RoleAssociation";

-- DropTable
DROP TABLE "RoleClassification";

-- DropTable
DROP TABLE "Routine";

-- DropTable
DROP TABLE "Session";

-- DropTable
DROP TABLE "Space";

-- DropTable
DROP TABLE "SpaceAssociation";

-- DropTable
DROP TABLE "SpaceClassification";

-- DropTable
DROP TABLE "Subject";

-- DropTable
DROP TABLE "Task";

-- DropTable
DROP TABLE "Tenant";

-- DropTable
DROP TABLE "Timeline";

-- DropTable
DROP TABLE "User";

-- DropTable
DROP TABLE "UserAssociation";

-- DropTable
DROP TABLE "UserClassification";

-- CreateTable
CREATE TABLE "categories" (
    "id" TEXT NOT NULL,
    "seq" SERIAL NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6),
    "removed_at" TIMESTAMPTZ(6),
    "name" TEXT NOT NULL,
    "type" "CategoryTypes" NOT NULL DEFAULT 'User',
    "parent_id" TEXT,
    "space_id" TEXT NOT NULL,
    "creator_id" TEXT,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "groups" (
    "id" TEXT NOT NULL,
    "seq" SERIAL NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6),
    "removed_at" TIMESTAMPTZ(6),
    "name" TEXT NOT NULL,
    "type" "GroupTypes" NOT NULL DEFAULT 'User',
    "label" TEXT,
    "space_id" TEXT NOT NULL,
    "creator_id" TEXT,

    CONSTRAINT "groups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tenants" (
    "id" TEXT NOT NULL,
    "seq" SERIAL NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6),
    "removed_at" TIMESTAMPTZ(6),
    "user_id" TEXT NOT NULL,
    "space_id" TEXT NOT NULL,
    "role_id" TEXT NOT NULL,

    CONSTRAINT "tenants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "assignments" (
    "id" TEXT NOT NULL,
    "seq" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6),
    "removed_at" TIMESTAMPTZ(6),
    "role_id" TEXT NOT NULL,
    "tenant_id" TEXT NOT NULL,

    CONSTRAINT "assignments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "actions" (
    "id" TEXT NOT NULL,
    "seq" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6),
    "removed_at" TIMESTAMPTZ(6),
    "name" "AbilityActions" NOT NULL DEFAULT 'CREATE',
    "conditions" JSONB,
    "space_id" TEXT NOT NULL,

    CONSTRAINT "actions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subjects" (
    "id" TEXT NOT NULL,
    "seq" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6),
    "removed_at" TIMESTAMPTZ(6),
    "name" TEXT NOT NULL,
    "space_id" TEXT NOT NULL,

    CONSTRAINT "subjects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "abilities" (
    "id" TEXT NOT NULL,
    "seq" SERIAL NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6),
    "removed_at" TIMESTAMPTZ(6),
    "type" "AbilityTypes" NOT NULL,
    "role_id" TEXT NOT NULL,
    "description" TEXT,
    "conditions" JSONB,
    "subject_id" TEXT NOT NULL,
    "space_id" TEXT NOT NULL,

    CONSTRAINT "abilities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "posts" (
    "id" TEXT NOT NULL,
    "seq" SERIAL NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6),
    "removed_at" TIMESTAMPTZ(6),
    "content_id" TEXT NOT NULL,

    CONSTRAINT "posts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contents" (
    "id" TEXT NOT NULL,
    "seq" SERIAL NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6),
    "removed_at" TIMESTAMPTZ(6),
    "title" TEXT,
    "description" TEXT,
    "type" "TextTypes" NOT NULL DEFAULT 'Editor',
    "text" VARCHAR(1000),
    "file_id" TEXT,
    "space_id" TEXT NOT NULL,
    "creator_id" TEXT,

    CONSTRAINT "contents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "files" (
    "id" TEXT NOT NULL,
    "seq" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "parent_id" TEXT,
    "mime_type" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "space_id" TEXT NOT NULL,
    "creator_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6),
    "removed_at" TIMESTAMPTZ(6),

    CONSTRAINT "files_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "file_classifications" (
    "id" TEXT NOT NULL,
    "seq" SERIAL NOT NULL,
    "category_id" TEXT NOT NULL,
    "file_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6),
    "removed_at" TIMESTAMPTZ(6),

    CONSTRAINT "file_classifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "file_associations" (
    "id" TEXT NOT NULL,
    "seq" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6),
    "removed_at" TIMESTAMPTZ(6),
    "file_id" TEXT NOT NULL,
    "group_id" TEXT NOT NULL,

    CONSTRAINT "file_associations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roles" (
    "id" TEXT NOT NULL,
    "seq" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6),
    "removed_at" TIMESTAMPTZ(6),
    "name" "Roles" NOT NULL DEFAULT 'USER',

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "role_associations" (
    "id" TEXT NOT NULL,
    "seq" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6),
    "removed_at" TIMESTAMPTZ(6),
    "role_id" TEXT NOT NULL,
    "group_id" TEXT NOT NULL,

    CONSTRAINT "role_associations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "role_classifications" (
    "id" TEXT NOT NULL,
    "seq" SERIAL NOT NULL,
    "category_id" TEXT NOT NULL,
    "role_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6),
    "removed_at" TIMESTAMPTZ(6),

    CONSTRAINT "role_classifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "safe_wallets" (
    "id" TEXT NOT NULL,
    "seq" SERIAL NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6),
    "removed_at" TIMESTAMPTZ(6),
    "address" TEXT NOT NULL,
    "chain_id" INTEGER NOT NULL,
    "threshold" INTEGER NOT NULL DEFAULT 3,
    "nonce" INTEGER NOT NULL DEFAULT 0,
    "owners" TEXT[],
    "space_id" TEXT NOT NULL,
    "creator_id" TEXT,

    CONSTRAINT "safe_wallets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "safe_transactions" (
    "id" TEXT NOT NULL,
    "seq" SERIAL NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6),
    "removed_at" TIMESTAMPTZ(6),
    "safe_tx_hash" TEXT NOT NULL,
    "safe_wallet_id" TEXT NOT NULL,
    "to" TEXT NOT NULL,
    "value" TEXT NOT NULL DEFAULT '0',
    "data" TEXT NOT NULL DEFAULT '0x',
    "nonce" INTEGER NOT NULL,
    "operation" INTEGER NOT NULL DEFAULT 0,
    "token_address" TEXT,
    "token_symbol" TEXT,
    "token_decimals" INTEGER,
    "confirmations_required" INTEGER NOT NULL,
    "is_executed" BOOLEAN NOT NULL DEFAULT false,
    "execution_tx_hash" TEXT,
    "executed_at" TIMESTAMPTZ(6),

    CONSTRAINT "safe_transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "safe_confirmations" (
    "id" TEXT NOT NULL,
    "seq" SERIAL NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "safe_transaction_id" TEXT NOT NULL,
    "owner" TEXT NOT NULL,
    "signature" TEXT NOT NULL,

    CONSTRAINT "safe_confirmations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "spaces" (
    "id" TEXT NOT NULL,
    "seq" SERIAL NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6),
    "removed_at" TIMESTAMPTZ(6),

    CONSTRAINT "spaces_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "space_classifications" (
    "id" TEXT NOT NULL,
    "seq" SERIAL NOT NULL,
    "category_id" TEXT NOT NULL,
    "space_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6),
    "removed_at" TIMESTAMPTZ(6),

    CONSTRAINT "space_classifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "space_associations" (
    "id" TEXT NOT NULL,
    "seq" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6),
    "removed_at" TIMESTAMPTZ(6),
    "space_id" TEXT NOT NULL,
    "group_id" TEXT NOT NULL,

    CONSTRAINT "space_associations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "grounds" (
    "id" TEXT NOT NULL,
    "seq" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6),
    "removed_at" TIMESTAMPTZ(6),
    "name" TEXT NOT NULL,
    "label" TEXT,
    "address" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "business_no" TEXT NOT NULL,
    "space_id" TEXT NOT NULL,
    "logo_image_file_id" TEXT,
    "image_file_id" TEXT,

    CONSTRAINT "grounds_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "timelines" (
    "id" TEXT NOT NULL,
    "seq" SERIAL NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6),
    "removed_at" TIMESTAMPTZ(6),
    "space_id" TEXT NOT NULL,
    "creator_id" TEXT,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "timelines_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" TEXT NOT NULL,
    "seq" SERIAL NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6),
    "removed_at" TIMESTAMPTZ(6),
    "type" "SessionTypes" NOT NULL DEFAULT 'ONE_TIME',
    "repeat_cycle_type" "RepeatCycleTypes",
    "start_date_time" TIMESTAMPTZ(6),
    "end_date_time" TIMESTAMPTZ(6),
    "recurring_day_of_week" "RecurringDayOfWeek",
    "timeline_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "programs" (
    "id" TEXT NOT NULL,
    "seq" SERIAL NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6),
    "removed_at" TIMESTAMPTZ(6),
    "routine_id" TEXT NOT NULL,
    "session_id" TEXT NOT NULL,
    "instructor_id" TEXT NOT NULL,
    "capacity" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "level" TEXT,

    CONSTRAINT "programs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "routines" (
    "id" TEXT NOT NULL,
    "seq" SERIAL NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6),
    "removed_at" TIMESTAMPTZ(6),
    "name" TEXT NOT NULL,
    "label" TEXT NOT NULL,

    CONSTRAINT "routines_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "activities" (
    "id" TEXT NOT NULL,
    "seq" SERIAL NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6),
    "removed_at" TIMESTAMPTZ(6),
    "routine_id" TEXT NOT NULL,
    "task_id" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "repetitions" INTEGER NOT NULL DEFAULT 1,
    "rest_time" INTEGER NOT NULL DEFAULT 0,
    "notes" TEXT,

    CONSTRAINT "activities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tasks" (
    "id" TEXT NOT NULL,
    "seq" SERIAL NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6),
    "removed_at" TIMESTAMPTZ(6),
    "space_id" TEXT NOT NULL,
    "creator_id" TEXT,

    CONSTRAINT "tasks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "exercises" (
    "id" TEXT NOT NULL,
    "seq" SERIAL NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6),
    "removed_at" TIMESTAMPTZ(6),
    "duration" INTEGER NOT NULL,
    "count" INTEGER NOT NULL,
    "task_id" TEXT NOT NULL,
    "description" TEXT,
    "image_file_id" TEXT,
    "video_file_id" TEXT,
    "name" TEXT NOT NULL,

    CONSTRAINT "exercises_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "seq" SERIAL NOT NULL,
    "updated_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "removed_at" TIMESTAMPTZ(6),
    "phone" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "selected_space_id" TEXT,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_classifications" (
    "id" TEXT NOT NULL,
    "seq" SERIAL NOT NULL,
    "category_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6),
    "removed_at" TIMESTAMPTZ(6),

    CONSTRAINT "user_classifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_associations" (
    "id" TEXT NOT NULL,
    "seq" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6),
    "removed_at" TIMESTAMPTZ(6),
    "user_id" TEXT NOT NULL,
    "group_id" TEXT NOT NULL,

    CONSTRAINT "user_associations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "profiles" (
    "id" TEXT NOT NULL,
    "seq" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6),
    "removed_at" TIMESTAMPTZ(6),
    "name" TEXT NOT NULL,
    "nickname" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "avatar_file_id" TEXT,

    CONSTRAINT "profiles_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "categories_seq_key" ON "categories"("seq");

-- CreateIndex
CREATE UNIQUE INDEX "categories_name_key" ON "categories"("name");

-- CreateIndex
CREATE INDEX "categories_space_id_idx" ON "categories"("space_id");

-- CreateIndex
CREATE UNIQUE INDEX "groups_seq_key" ON "groups"("seq");

-- CreateIndex
CREATE INDEX "groups_space_id_idx" ON "groups"("space_id");

-- CreateIndex
CREATE UNIQUE INDEX "tenants_seq_key" ON "tenants"("seq");

-- CreateIndex
CREATE UNIQUE INDEX "assignments_seq_key" ON "assignments"("seq");

-- CreateIndex
CREATE UNIQUE INDEX "actions_seq_key" ON "actions"("seq");

-- CreateIndex
CREATE INDEX "actions_space_id_idx" ON "actions"("space_id");

-- CreateIndex
CREATE UNIQUE INDEX "subjects_seq_key" ON "subjects"("seq");

-- CreateIndex
CREATE UNIQUE INDEX "subjects_name_key" ON "subjects"("name");

-- CreateIndex
CREATE INDEX "subjects_space_id_idx" ON "subjects"("space_id");

-- CreateIndex
CREATE UNIQUE INDEX "abilities_seq_key" ON "abilities"("seq");

-- CreateIndex
CREATE INDEX "abilities_space_id_idx" ON "abilities"("space_id");

-- CreateIndex
CREATE UNIQUE INDEX "posts_seq_key" ON "posts"("seq");

-- CreateIndex
CREATE UNIQUE INDEX "contents_seq_key" ON "contents"("seq");

-- CreateIndex
CREATE INDEX "contents_space_id_idx" ON "contents"("space_id");

-- CreateIndex
CREATE UNIQUE INDEX "files_seq_key" ON "files"("seq");

-- CreateIndex
CREATE INDEX "files_space_id_idx" ON "files"("space_id");

-- CreateIndex
CREATE UNIQUE INDEX "file_classifications_seq_key" ON "file_classifications"("seq");

-- CreateIndex
CREATE UNIQUE INDEX "file_classifications_file_id_key" ON "file_classifications"("file_id");

-- CreateIndex
CREATE UNIQUE INDEX "file_classifications_category_id_file_id_key" ON "file_classifications"("category_id", "file_id");

-- CreateIndex
CREATE UNIQUE INDEX "file_associations_seq_key" ON "file_associations"("seq");

-- CreateIndex
CREATE UNIQUE INDEX "file_associations_group_id_file_id_key" ON "file_associations"("group_id", "file_id");

-- CreateIndex
CREATE UNIQUE INDEX "roles_seq_key" ON "roles"("seq");

-- CreateIndex
CREATE UNIQUE INDEX "roles_name_key" ON "roles"("name");

-- CreateIndex
CREATE UNIQUE INDEX "role_associations_seq_key" ON "role_associations"("seq");

-- CreateIndex
CREATE UNIQUE INDEX "role_associations_role_id_key" ON "role_associations"("role_id");

-- CreateIndex
CREATE UNIQUE INDEX "role_associations_group_id_role_id_key" ON "role_associations"("group_id", "role_id");

-- CreateIndex
CREATE UNIQUE INDEX "role_classifications_seq_key" ON "role_classifications"("seq");

-- CreateIndex
CREATE UNIQUE INDEX "role_classifications_role_id_key" ON "role_classifications"("role_id");

-- CreateIndex
CREATE UNIQUE INDEX "role_classifications_category_id_role_id_key" ON "role_classifications"("category_id", "role_id");

-- CreateIndex
CREATE UNIQUE INDEX "safe_wallets_seq_key" ON "safe_wallets"("seq");

-- CreateIndex
CREATE UNIQUE INDEX "safe_wallets_address_key" ON "safe_wallets"("address");

-- CreateIndex
CREATE INDEX "safe_wallets_space_id_idx" ON "safe_wallets"("space_id");

-- CreateIndex
CREATE UNIQUE INDEX "safe_transactions_seq_key" ON "safe_transactions"("seq");

-- CreateIndex
CREATE UNIQUE INDEX "safe_transactions_safe_tx_hash_key" ON "safe_transactions"("safe_tx_hash");

-- CreateIndex
CREATE UNIQUE INDEX "safe_confirmations_seq_key" ON "safe_confirmations"("seq");

-- CreateIndex
CREATE UNIQUE INDEX "safe_confirmations_safe_transaction_id_owner_key" ON "safe_confirmations"("safe_transaction_id", "owner");

-- CreateIndex
CREATE UNIQUE INDEX "spaces_seq_key" ON "spaces"("seq");

-- CreateIndex
CREATE UNIQUE INDEX "space_classifications_seq_key" ON "space_classifications"("seq");

-- CreateIndex
CREATE UNIQUE INDEX "space_classifications_space_id_key" ON "space_classifications"("space_id");

-- CreateIndex
CREATE UNIQUE INDEX "space_classifications_category_id_space_id_key" ON "space_classifications"("category_id", "space_id");

-- CreateIndex
CREATE UNIQUE INDEX "space_associations_seq_key" ON "space_associations"("seq");

-- CreateIndex
CREATE UNIQUE INDEX "space_associations_space_id_group_id_key" ON "space_associations"("space_id", "group_id");

-- CreateIndex
CREATE UNIQUE INDEX "grounds_seq_key" ON "grounds"("seq");

-- CreateIndex
CREATE UNIQUE INDEX "grounds_business_no_key" ON "grounds"("business_no");

-- CreateIndex
CREATE UNIQUE INDEX "grounds_space_id_key" ON "grounds"("space_id");

-- CreateIndex
CREATE UNIQUE INDEX "timelines_seq_key" ON "timelines"("seq");

-- CreateIndex
CREATE INDEX "timelines_space_id_idx" ON "timelines"("space_id");

-- CreateIndex
CREATE INDEX "timelines_space_id_created_at_idx" ON "timelines"("space_id", "created_at");

-- CreateIndex
CREATE INDEX "timelines_name_idx" ON "timelines"("name");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_seq_key" ON "sessions"("seq");

-- CreateIndex
CREATE INDEX "sessions_timeline_id_start_date_time_idx" ON "sessions"("timeline_id", "start_date_time");

-- CreateIndex
CREATE INDEX "sessions_start_date_time_end_date_time_idx" ON "sessions"("start_date_time", "end_date_time");

-- CreateIndex
CREATE INDEX "sessions_type_start_date_time_idx" ON "sessions"("type", "start_date_time");

-- CreateIndex
CREATE UNIQUE INDEX "programs_seq_key" ON "programs"("seq");

-- CreateIndex
CREATE INDEX "programs_session_id_idx" ON "programs"("session_id");

-- CreateIndex
CREATE INDEX "programs_routine_id_idx" ON "programs"("routine_id");

-- CreateIndex
CREATE INDEX "programs_instructor_id_idx" ON "programs"("instructor_id");

-- CreateIndex
CREATE UNIQUE INDEX "programs_session_id_routine_id_key" ON "programs"("session_id", "routine_id");

-- CreateIndex
CREATE UNIQUE INDEX "routines_seq_key" ON "routines"("seq");

-- CreateIndex
CREATE INDEX "routines_name_idx" ON "routines"("name");

-- CreateIndex
CREATE UNIQUE INDEX "activities_seq_key" ON "activities"("seq");

-- CreateIndex
CREATE INDEX "activities_routine_id_order_idx" ON "activities"("routine_id", "order");

-- CreateIndex
CREATE UNIQUE INDEX "activities_routine_id_task_id_key" ON "activities"("routine_id", "task_id");

-- CreateIndex
CREATE UNIQUE INDEX "tasks_seq_key" ON "tasks"("seq");

-- CreateIndex
CREATE INDEX "tasks_space_id_idx" ON "tasks"("space_id");

-- CreateIndex
CREATE UNIQUE INDEX "exercises_seq_key" ON "exercises"("seq");

-- CreateIndex
CREATE UNIQUE INDEX "exercises_task_id_key" ON "exercises"("task_id");

-- CreateIndex
CREATE INDEX "exercises_name_idx" ON "exercises"("name");

-- CreateIndex
CREATE UNIQUE INDEX "users_seq_key" ON "users"("seq");

-- CreateIndex
CREATE UNIQUE INDEX "users_phone_key" ON "users"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "users_name_key" ON "users"("name");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "user_classifications_seq_key" ON "user_classifications"("seq");

-- CreateIndex
CREATE UNIQUE INDEX "user_classifications_user_id_key" ON "user_classifications"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_classifications_category_id_user_id_key" ON "user_classifications"("category_id", "user_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_associations_seq_key" ON "user_associations"("seq");

-- CreateIndex
CREATE UNIQUE INDEX "profiles_seq_key" ON "profiles"("seq");

-- CreateIndex
CREATE UNIQUE INDEX "profiles_nickname_key" ON "profiles"("nickname");

-- AddForeignKey
ALTER TABLE "categories" ADD CONSTRAINT "categories_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "categories" ADD CONSTRAINT "categories_space_id_fkey" FOREIGN KEY ("space_id") REFERENCES "spaces"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "categories" ADD CONSTRAINT "categories_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "groups" ADD CONSTRAINT "groups_space_id_fkey" FOREIGN KEY ("space_id") REFERENCES "spaces"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "groups" ADD CONSTRAINT "groups_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenants" ADD CONSTRAINT "tenants_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenants" ADD CONSTRAINT "tenants_space_id_fkey" FOREIGN KEY ("space_id") REFERENCES "spaces"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenants" ADD CONSTRAINT "tenants_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assignments" ADD CONSTRAINT "assignments_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assignments" ADD CONSTRAINT "assignments_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "actions" ADD CONSTRAINT "actions_space_id_fkey" FOREIGN KEY ("space_id") REFERENCES "spaces"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subjects" ADD CONSTRAINT "subjects_space_id_fkey" FOREIGN KEY ("space_id") REFERENCES "spaces"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "abilities" ADD CONSTRAINT "abilities_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "abilities" ADD CONSTRAINT "abilities_space_id_fkey" FOREIGN KEY ("space_id") REFERENCES "spaces"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "posts_content_id_fkey" FOREIGN KEY ("content_id") REFERENCES "contents"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contents" ADD CONSTRAINT "contents_space_id_fkey" FOREIGN KEY ("space_id") REFERENCES "spaces"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contents" ADD CONSTRAINT "contents_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "files" ADD CONSTRAINT "files_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "files"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "files" ADD CONSTRAINT "files_space_id_fkey" FOREIGN KEY ("space_id") REFERENCES "spaces"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "files" ADD CONSTRAINT "files_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "file_classifications" ADD CONSTRAINT "file_classifications_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "file_classifications" ADD CONSTRAINT "file_classifications_file_id_fkey" FOREIGN KEY ("file_id") REFERENCES "files"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "file_associations" ADD CONSTRAINT "file_associations_file_id_fkey" FOREIGN KEY ("file_id") REFERENCES "files"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "file_associations" ADD CONSTRAINT "file_associations_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "groups"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_associations" ADD CONSTRAINT "role_associations_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "groups"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_associations" ADD CONSTRAINT "role_associations_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_classifications" ADD CONSTRAINT "role_classifications_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_classifications" ADD CONSTRAINT "role_classifications_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "safe_wallets" ADD CONSTRAINT "safe_wallets_space_id_fkey" FOREIGN KEY ("space_id") REFERENCES "spaces"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "safe_wallets" ADD CONSTRAINT "safe_wallets_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "safe_transactions" ADD CONSTRAINT "safe_transactions_safe_wallet_id_fkey" FOREIGN KEY ("safe_wallet_id") REFERENCES "safe_wallets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "safe_confirmations" ADD CONSTRAINT "safe_confirmations_safe_transaction_id_fkey" FOREIGN KEY ("safe_transaction_id") REFERENCES "safe_transactions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "space_classifications" ADD CONSTRAINT "space_classifications_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "space_classifications" ADD CONSTRAINT "space_classifications_space_id_fkey" FOREIGN KEY ("space_id") REFERENCES "spaces"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "space_associations" ADD CONSTRAINT "space_associations_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "groups"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "space_associations" ADD CONSTRAINT "space_associations_space_id_fkey" FOREIGN KEY ("space_id") REFERENCES "spaces"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grounds" ADD CONSTRAINT "grounds_space_id_fkey" FOREIGN KEY ("space_id") REFERENCES "spaces"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "timelines" ADD CONSTRAINT "timelines_space_id_fkey" FOREIGN KEY ("space_id") REFERENCES "spaces"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "timelines" ADD CONSTRAINT "timelines_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_timeline_id_fkey" FOREIGN KEY ("timeline_id") REFERENCES "timelines"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "programs" ADD CONSTRAINT "programs_routine_id_fkey" FOREIGN KEY ("routine_id") REFERENCES "routines"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "programs" ADD CONSTRAINT "programs_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "sessions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activities" ADD CONSTRAINT "activities_routine_id_fkey" FOREIGN KEY ("routine_id") REFERENCES "routines"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activities" ADD CONSTRAINT "activities_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "tasks"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_space_id_fkey" FOREIGN KEY ("space_id") REFERENCES "spaces"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exercises" ADD CONSTRAINT "exercises_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "tasks"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_selected_space_id_fkey" FOREIGN KEY ("selected_space_id") REFERENCES "spaces"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_classifications" ADD CONSTRAINT "user_classifications_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_classifications" ADD CONSTRAINT "user_classifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_associations" ADD CONSTRAINT "user_associations_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "groups"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_associations" ADD CONSTRAINT "user_associations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
