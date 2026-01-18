/*
  Warnings:

  - You are about to drop the column `selected_space_id` on the `users` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_selected_space_id_fkey";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "selected_space_id";
