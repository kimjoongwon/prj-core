-- CreateEnum
CREATE TYPE "language_code" AS ENUM ('ko_KR', 'en_US', 'zh_CN', 'ja_JP');

-- DropForeignKey
ALTER TABLE "abilities" DROP CONSTRAINT "abilities_role_id_fkey";

-- DropForeignKey
ALTER TABLE "abilities" DROP CONSTRAINT "abilities_user_id_fkey";

-- DropIndex
DROP INDEX "abilities_is_active_idx";

-- DropIndex
DROP INDEX "abilities_role_id_idx";

-- DropIndex
DROP INDEX "abilities_user_id_idx";

-- AlterTable
ALTER TABLE "abilities" DROP COLUMN "is_active",
DROP COLUMN "priority",
DROP COLUMN "role_id",
DROP COLUMN "user_id",
ALTER COLUMN "name" SET NOT NULL;

-- CreateTable
CREATE TABLE "grants" (
    "id" TEXT NOT NULL,
    "seq" SERIAL NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6),
    "removed_at" TIMESTAMPTZ(6),
    "grantee_type" TEXT NOT NULL,
    "grantee_id" TEXT NOT NULL,
    "ability_id" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "priority" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "grants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "translations" (
    "id" TEXT NOT NULL,
    "language_code" "language_code" NOT NULL,
    "key" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "is_translated" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "translations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "grants_seq_key" ON "grants"("seq");

-- CreateIndex
CREATE INDEX "grants_grantee_type_grantee_id_idx" ON "grants"("grantee_type", "grantee_id");

-- CreateIndex
CREATE INDEX "grants_ability_id_idx" ON "grants"("ability_id");

-- CreateIndex
CREATE INDEX "grants_is_active_idx" ON "grants"("is_active");

-- CreateIndex
CREATE UNIQUE INDEX "grants_grantee_type_grantee_id_ability_id_key" ON "grants"("grantee_type", "grantee_id", "ability_id");

-- CreateIndex
CREATE INDEX "translations_category_language_code_idx" ON "translations"("category", "language_code");

-- CreateIndex
CREATE INDEX "translations_key_idx" ON "translations"("key");

-- CreateIndex
CREATE UNIQUE INDEX "translations_language_code_key_key" ON "translations"("language_code", "key");

-- CreateIndex
CREATE UNIQUE INDEX "abilities_name_key" ON "abilities"("name");

-- CreateIndex
CREATE INDEX "abilities_name_idx" ON "abilities"("name");

-- AddForeignKey
ALTER TABLE "grants" ADD CONSTRAINT "grants_ability_id_fkey" FOREIGN KEY ("ability_id") REFERENCES "abilities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

