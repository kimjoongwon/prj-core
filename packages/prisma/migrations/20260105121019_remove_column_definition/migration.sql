/*
  Warnings:

  - You are about to drop the column `space_id` on the `abilities` table. All the data in the column will be lost.
  - You are about to drop the column `space_id` on the `subjects` table. All the data in the column will be lost.
  - You are about to drop the `actions` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[role_id,subject_id,action]` on the table `abilities` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `action` to the `abilities` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tenant_id` to the `abilities` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tenant_id` to the `subjects` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "SubjectTypes" AS ENUM ('Menu', 'Feature', 'Entity', 'API', 'Column');

-- CreateEnum
CREATE TYPE "UIConfigScope" AS ENUM ('GLOBAL', 'ROLE', 'USER');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "AbilityActions" ADD VALUE 'MANAGE';
ALTER TYPE "AbilityActions" ADD VALUE 'EXPORT';
ALTER TYPE "AbilityActions" ADD VALUE 'IMPORT';
ALTER TYPE "AbilityActions" ADD VALUE 'APPROVE';
ALTER TYPE "AbilityActions" ADD VALUE 'REJECT';

-- DropForeignKey
ALTER TABLE "abilities" DROP CONSTRAINT "abilities_space_id_fkey";

-- DropForeignKey
ALTER TABLE "actions" DROP CONSTRAINT "actions_space_id_fkey";

-- DropForeignKey
ALTER TABLE "subjects" DROP CONSTRAINT "subjects_space_id_fkey";

-- DropIndex
DROP INDEX "abilities_space_id_idx";

-- DropIndex
DROP INDEX "subjects_space_id_idx";

-- AlterTable
ALTER TABLE "abilities" DROP COLUMN "space_id",
ADD COLUMN     "action" "AbilityActions" NOT NULL,
ADD COLUMN     "is_active" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "tenant_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "subjects" DROP COLUMN "space_id",
ADD COLUMN     "description" TEXT,
ADD COLUMN     "label" TEXT,
ADD COLUMN     "parent_id" TEXT,
ADD COLUMN     "sort_order" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "tenant_id" TEXT NOT NULL,
ADD COLUMN     "type" "SubjectTypes" NOT NULL DEFAULT 'Entity',
ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMPTZ(6);

-- DropTable
DROP TABLE "actions";

-- CreateTable
CREATE TABLE "ui_configs" (
    "id" TEXT NOT NULL,
    "seq" SERIAL NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6),
    "removed_at" TIMESTAMPTZ(6),
    "space_id" TEXT NOT NULL,
    "entity" TEXT NOT NULL,
    "view" TEXT NOT NULL,
    "scope" "UIConfigScope" NOT NULL DEFAULT 'GLOBAL',
    "scope_id" TEXT,
    "config" JSONB NOT NULL,

    CONSTRAINT "ui_configs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ui_configs_seq_key" ON "ui_configs"("seq");

-- CreateIndex
CREATE INDEX "ui_configs_space_id_entity_view_idx" ON "ui_configs"("space_id", "entity", "view");

-- CreateIndex
CREATE INDEX "ui_configs_scope_idx" ON "ui_configs"("scope");

-- CreateIndex
CREATE UNIQUE INDEX "ui_configs_space_id_entity_view_scope_scope_id_key" ON "ui_configs"("space_id", "entity", "view", "scope", "scope_id");

-- CreateIndex
CREATE INDEX "abilities_tenant_id_idx" ON "abilities"("tenant_id");

-- CreateIndex
CREATE INDEX "abilities_role_id_idx" ON "abilities"("role_id");

-- CreateIndex
CREATE INDEX "abilities_subject_id_idx" ON "abilities"("subject_id");

-- CreateIndex
CREATE INDEX "abilities_is_active_idx" ON "abilities"("is_active");

-- CreateIndex
CREATE UNIQUE INDEX "abilities_role_id_subject_id_action_key" ON "abilities"("role_id", "subject_id", "action");

-- CreateIndex
CREATE INDEX "subjects_tenant_id_idx" ON "subjects"("tenant_id");

-- CreateIndex
CREATE INDEX "subjects_type_idx" ON "subjects"("type");

-- CreateIndex
CREATE INDEX "subjects_parent_id_idx" ON "subjects"("parent_id");

-- AddForeignKey
ALTER TABLE "subjects" ADD CONSTRAINT "subjects_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "subjects"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "abilities" ADD CONSTRAINT "abilities_subject_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "subjects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ui_configs" ADD CONSTRAINT "ui_configs_space_id_fkey" FOREIGN KEY ("space_id") REFERENCES "spaces"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
