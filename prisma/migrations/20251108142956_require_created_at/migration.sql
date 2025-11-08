/*
  Warnings:

  - Made the column `created_at` on table `clients` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `project_images` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `projects` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "clients" ALTER COLUMN "created_at" SET NOT NULL;

-- AlterTable
ALTER TABLE "project_images" ALTER COLUMN "created_at" SET NOT NULL;

-- AlterTable
ALTER TABLE "projects" ALTER COLUMN "created_at" SET NOT NULL;
