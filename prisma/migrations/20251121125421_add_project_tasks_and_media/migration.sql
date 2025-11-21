/*
  Warnings:

  - You are about to drop the `project_images` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."project_images" DROP CONSTRAINT "project_images_media_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."project_images" DROP CONSTRAINT "project_images_projects_id_fkey";

-- DropTable
DROP TABLE "public"."project_images";

-- CreateTable
CREATE TABLE "project_medias" (
    "id" BIGSERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "is_cover" BOOLEAN NOT NULL DEFAULT false,
    "caption" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ,
    "projects_id" BIGINT NOT NULL,
    "media_id" BIGINT,

    CONSTRAINT "project_medias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_tasks" (
    "id" BIGSERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "description" TEXT,
    "order" INTEGER DEFAULT 0,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ,
    "projects_id" BIGINT NOT NULL,

    CONSTRAINT "project_tasks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_task_images" (
    "id" BIGSERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "caption" TEXT,
    "is_cover" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ,
    "task_id" BIGINT NOT NULL,
    "media_id" BIGINT NOT NULL,

    CONSTRAINT "project_task_images_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "project_medias_uuid_key" ON "project_medias"("uuid");

-- CreateIndex
CREATE INDEX "project_medias_projects_id_idx" ON "project_medias"("projects_id");

-- CreateIndex
CREATE INDEX "project_medias_media_id_idx" ON "project_medias"("media_id");

-- CreateIndex
CREATE INDEX "project_medias_is_cover_idx" ON "project_medias"("is_cover");

-- CreateIndex
CREATE UNIQUE INDEX "project_medias_projects_id_media_id_key" ON "project_medias"("projects_id", "media_id");

-- CreateIndex
CREATE UNIQUE INDEX "project_tasks_uuid_key" ON "project_tasks"("uuid");

-- CreateIndex
CREATE INDEX "project_tasks_projects_id_idx" ON "project_tasks"("projects_id");

-- CreateIndex
CREATE UNIQUE INDEX "project_task_images_uuid_key" ON "project_task_images"("uuid");

-- CreateIndex
CREATE INDEX "project_task_images_task_id_idx" ON "project_task_images"("task_id");

-- CreateIndex
CREATE INDEX "project_task_images_media_id_idx" ON "project_task_images"("media_id");

-- CreateIndex
CREATE UNIQUE INDEX "project_task_images_task_id_media_id_key" ON "project_task_images"("task_id", "media_id");

-- AddForeignKey
ALTER TABLE "project_medias" ADD CONSTRAINT "project_medias_projects_id_fkey" FOREIGN KEY ("projects_id") REFERENCES "projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_medias" ADD CONSTRAINT "project_medias_media_id_fkey" FOREIGN KEY ("media_id") REFERENCES "media"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_tasks" ADD CONSTRAINT "project_tasks_projects_id_fkey" FOREIGN KEY ("projects_id") REFERENCES "projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_task_images" ADD CONSTRAINT "project_task_images_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "project_tasks"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_task_images" ADD CONSTRAINT "project_task_images_media_id_fkey" FOREIGN KEY ("media_id") REFERENCES "media"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
