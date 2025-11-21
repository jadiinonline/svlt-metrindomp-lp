/*
  Warnings:

  - You are about to drop the column `logo` on the `clients` table. All the data in the column will be lost.
  - You are about to drop the column `image_link` on the `project_images` table. All the data in the column will be lost.
  - You are about to drop the column `image_link` on the `service_categories` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[projects_id,media_id]` on the table `project_images` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "public"."project_images_projects_id_image_link_key";

-- AlterTable
ALTER TABLE "clients" DROP COLUMN "logo",
ADD COLUMN     "media_id" BIGINT;

-- AlterTable
ALTER TABLE "project_images" DROP COLUMN "image_link",
ADD COLUMN     "media_id" BIGINT;

-- AlterTable
ALTER TABLE "service_categories" DROP COLUMN "image_link",
ADD COLUMN     "media_id" BIGINT;

-- CreateTable
CREATE TABLE "media" (
    "id" BIGSERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "mime_type" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "width" INTEGER,
    "height" INTEGER,
    "duration" DOUBLE PRECISION,
    "alt_text" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ,
    "uploader_id" BIGINT NOT NULL,

    CONSTRAINT "media_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "media_uuid_key" ON "media"("uuid");

-- CreateIndex
CREATE INDEX "media_uploader_id_idx" ON "media"("uploader_id");

-- CreateIndex
CREATE INDEX "media_mime_type_idx" ON "media"("mime_type");

-- CreateIndex
CREATE INDEX "media_size_idx" ON "media"("size");

-- CreateIndex
CREATE INDEX "clients_media_id_idx" ON "clients"("media_id");

-- CreateIndex
CREATE INDEX "platform_users_username_idx" ON "platform_users"("username");

-- CreateIndex
CREATE INDEX "project_categories_projects_id_idx" ON "project_categories"("projects_id");

-- CreateIndex
CREATE INDEX "project_categories_service_categories_id_idx" ON "project_categories"("service_categories_id");

-- CreateIndex
CREATE INDEX "project_images_projects_id_idx" ON "project_images"("projects_id");

-- CreateIndex
CREATE INDEX "project_images_media_id_idx" ON "project_images"("media_id");

-- CreateIndex
CREATE INDEX "project_images_is_cover_idx" ON "project_images"("is_cover");

-- CreateIndex
CREATE UNIQUE INDEX "project_images_projects_id_media_id_key" ON "project_images"("projects_id", "media_id");

-- CreateIndex
CREATE INDEX "projects_clients_id_idx" ON "projects"("clients_id");

-- CreateIndex
CREATE INDEX "projects_status_idx" ON "projects"("status");

-- CreateIndex
CREATE INDEX "projects_year_idx" ON "projects"("year");

-- CreateIndex
CREATE INDEX "service_categories_media_id_idx" ON "service_categories"("media_id");

-- AddForeignKey
ALTER TABLE "service_categories" ADD CONSTRAINT "service_categories_media_id_fkey" FOREIGN KEY ("media_id") REFERENCES "media"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clients" ADD CONSTRAINT "clients_media_id_fkey" FOREIGN KEY ("media_id") REFERENCES "media"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_images" ADD CONSTRAINT "project_images_media_id_fkey" FOREIGN KEY ("media_id") REFERENCES "media"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "media" ADD CONSTRAINT "media_uploader_id_fkey" FOREIGN KEY ("uploader_id") REFERENCES "platform_users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
