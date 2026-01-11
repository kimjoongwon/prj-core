/*
  Warnings:

  - You are about to drop the `ui_configs` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ui_configs" DROP CONSTRAINT "ui_configs_space_id_fkey";

-- DropTable
DROP TABLE "ui_configs";

-- DropEnum
DROP TYPE "UIConfigScope";
