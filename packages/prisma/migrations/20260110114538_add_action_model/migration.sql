/*
  Warnings:

  - You are about to drop the column `action` on the `abilities` table. All the data in the column will be lost.
  - You are about to drop the column `tenant_id` on the `abilities` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `abilities` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `subjects` table. All the data in the column will be lost.
  - You are about to drop the column `label` on the `subjects` table. All the data in the column will be lost.
  - You are about to drop the column `parent_id` on the `subjects` table. All the data in the column will be lost.
  - You are about to drop the column `sort_order` on the `subjects` table. All the data in the column will be lost.
  - You are about to drop the column `tenant_id` on the `subjects` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `subjects` table. All the data in the column will be lost.
  - You are about to drop the `field_visibilities` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `masking_patterns` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `action_id` to the `abilities` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "field_visibilities" DROP CONSTRAINT "field_visibilities_masking_pattern_id_fkey";

-- DropForeignKey
ALTER TABLE "field_visibilities" DROP CONSTRAINT "field_visibilities_role_category_id_fkey";

-- DropForeignKey
ALTER TABLE "field_visibilities" DROP CONSTRAINT "field_visibilities_role_group_id_fkey";

-- DropForeignKey
ALTER TABLE "subjects" DROP CONSTRAINT "subjects_parent_id_fkey";

-- DropIndex
DROP INDEX "abilities_role_id_subject_id_action_key";

-- DropIndex
DROP INDEX "abilities_tenant_id_idx";

-- DropIndex
DROP INDEX "subjects_parent_id_idx";

-- DropIndex
DROP INDEX "subjects_tenant_id_idx";

-- DropIndex
DROP INDEX "subjects_type_idx";

-- AlterTable
ALTER TABLE "abilities" DROP COLUMN "action",
DROP COLUMN "tenant_id",
DROP COLUMN "type",
ADD COLUMN     "action_id" TEXT NOT NULL,
ADD COLUMN     "inverted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "subjects" DROP COLUMN "description",
DROP COLUMN "label",
DROP COLUMN "parent_id",
DROP COLUMN "sort_order",
DROP COLUMN "tenant_id",
DROP COLUMN "type",
ADD COLUMN     "group" TEXT,
ADD COLUMN     "icon" TEXT,
ADD COLUMN     "is_system" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "order" INTEGER NOT NULL DEFAULT 0;

-- DropTable
DROP TABLE "field_visibilities";

-- DropTable
DROP TABLE "masking_patterns";

-- DropEnum
DROP TYPE "AbilityActions";

-- DropEnum
DROP TYPE "AbilityTypes";

-- DropEnum
DROP TYPE "FieldVisibilityType";

-- DropEnum
DROP TYPE "MaskingFieldType";

-- DropEnum
DROP TYPE "SubjectTypes";

-- CreateTable
CREATE TABLE "actions" (
    "id" TEXT NOT NULL,
    "seq" SERIAL NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6),
    "removed_at" TIMESTAMPTZ(6),
    "name" TEXT NOT NULL,
    "display_name" TEXT,
    "description" TEXT,
    "group" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "is_system" BOOLEAN NOT NULL DEFAULT true,
    "config" JSONB,

    CONSTRAINT "actions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "actions_seq_key" ON "actions"("seq");

-- CreateIndex
CREATE UNIQUE INDEX "actions_name_key" ON "actions"("name");

-- CreateIndex
CREATE INDEX "actions_group_idx" ON "actions"("group");

-- CreateIndex
CREATE INDEX "abilities_action_id_idx" ON "abilities"("action_id");

-- CreateIndex
CREATE INDEX "subjects_group_idx" ON "subjects"("group");

-- CreateIndex
CREATE INDEX "subjects_is_system_idx" ON "subjects"("is_system");

-- AddForeignKey
ALTER TABLE "abilities" ADD CONSTRAINT "abilities_action_id_fkey" FOREIGN KEY ("action_id") REFERENCES "actions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
