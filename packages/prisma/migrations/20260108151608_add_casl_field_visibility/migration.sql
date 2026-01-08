-- CreateEnum
CREATE TYPE "FieldVisibilityType" AS ENUM ('FULL', 'MASKED', 'HIDDEN');

-- CreateEnum
CREATE TYPE "MaskingFieldType" AS ENUM ('EMAIL', 'PHONE', 'SSN', 'CARD_NUMBER', 'ACCOUNT', 'ADDRESS', 'NAME', 'CUSTOM');

-- DropForeignKey
ALTER TABLE "abilities" DROP CONSTRAINT "abilities_role_id_fkey";

-- AlterTable
ALTER TABLE "abilities" ADD COLUMN     "fields" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "name" TEXT,
ADD COLUMN     "priority" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "reason" TEXT,
ADD COLUMN     "user_id" TEXT,
ALTER COLUMN "role_id" DROP NOT NULL;

-- CreateTable
CREATE TABLE "masking_patterns" (
    "id" TEXT NOT NULL,
    "seq" SERIAL NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6),
    "removed_at" TIMESTAMPTZ(6),
    "name" TEXT NOT NULL,
    "fieldType" "MaskingFieldType" NOT NULL,
    "pattern" TEXT NOT NULL,
    "example" TEXT,
    "description" TEXT,

    CONSTRAINT "masking_patterns_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "field_visibilities" (
    "id" TEXT NOT NULL,
    "seq" SERIAL NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6),
    "removed_at" TIMESTAMPTZ(6),
    "subject" TEXT NOT NULL,
    "field" TEXT NOT NULL,
    "role_category_id" TEXT NOT NULL,
    "role_group_id" TEXT,
    "visibility" "FieldVisibilityType" NOT NULL DEFAULT 'FULL',
    "masking_pattern_id" TEXT,

    CONSTRAINT "field_visibilities_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "masking_patterns_seq_key" ON "masking_patterns"("seq");

-- CreateIndex
CREATE UNIQUE INDEX "masking_patterns_name_key" ON "masking_patterns"("name");

-- CreateIndex
CREATE UNIQUE INDEX "field_visibilities_seq_key" ON "field_visibilities"("seq");

-- CreateIndex
CREATE INDEX "field_visibilities_subject_idx" ON "field_visibilities"("subject");

-- CreateIndex
CREATE INDEX "field_visibilities_role_category_id_idx" ON "field_visibilities"("role_category_id");

-- CreateIndex
CREATE INDEX "field_visibilities_role_group_id_idx" ON "field_visibilities"("role_group_id");

-- CreateIndex
CREATE UNIQUE INDEX "field_visibilities_subject_field_role_category_id_role_grou_key" ON "field_visibilities"("subject", "field", "role_category_id", "role_group_id");

-- CreateIndex
CREATE INDEX "abilities_user_id_idx" ON "abilities"("user_id");

-- AddForeignKey
ALTER TABLE "abilities" ADD CONSTRAINT "abilities_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "abilities" ADD CONSTRAINT "abilities_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "field_visibilities" ADD CONSTRAINT "field_visibilities_role_category_id_fkey" FOREIGN KEY ("role_category_id") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "field_visibilities" ADD CONSTRAINT "field_visibilities_role_group_id_fkey" FOREIGN KEY ("role_group_id") REFERENCES "groups"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "field_visibilities" ADD CONSTRAINT "field_visibilities_masking_pattern_id_fkey" FOREIGN KEY ("masking_pattern_id") REFERENCES "masking_patterns"("id") ON DELETE SET NULL ON UPDATE CASCADE;
