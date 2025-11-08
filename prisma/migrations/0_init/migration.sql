-- CreateTable
CREATE TABLE "service_categories" (
    "id" BIGSERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "image_link" TEXT,
    "description" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ,

    CONSTRAINT "service_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "clients" (
    "id" BIGSERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "logo" TEXT,
    "created_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ,

    CONSTRAINT "clients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "projects" (
    "id" BIGSERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" VARCHAR(200),
    "location" TEXT,
    "description" TEXT,
    "start_date" DATE,
    "end_date" DATE,
    "year" INTEGER,
    "po_price" BIGINT,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "created_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ,
    "clients_id" BIGINT NOT NULL,

    CONSTRAINT "projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_images" (
    "id" BIGSERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "image_link" TEXT,
    "is_cover" BOOLEAN NOT NULL DEFAULT false,
    "caption" TEXT,
    "created_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ,
    "projects_id" BIGINT NOT NULL,

    CONSTRAINT "project_images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_categories" (
    "id" BIGSERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ,
    "projects_id" BIGINT NOT NULL,
    "service_categories_id" BIGINT NOT NULL,

    CONSTRAINT "project_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "platform_users" (
    "id" BIGSERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "username" VARCHAR(100) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ,

    CONSTRAINT "platform_users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "service_categories_uuid_key" ON "service_categories"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "service_categories_name_key" ON "service_categories"("name");

-- CreateIndex
CREATE UNIQUE INDEX "clients_uuid_key" ON "clients"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "clients_name_key" ON "clients"("name");

-- CreateIndex
CREATE UNIQUE INDEX "projects_uuid_key" ON "projects"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "projects_slug_key" ON "projects"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "project_images_uuid_key" ON "project_images"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "project_images_projects_id_image_link_key" ON "project_images"("projects_id", "image_link");

-- CreateIndex
CREATE UNIQUE INDEX "project_categories_uuid_key" ON "project_categories"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "project_categories_projects_id_service_categories_id_key" ON "project_categories"("projects_id", "service_categories_id");

-- CreateIndex
CREATE UNIQUE INDEX "platform_users_uuid_key" ON "platform_users"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "platform_users_username_key" ON "platform_users"("username");

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_clients_id_fkey" FOREIGN KEY ("clients_id") REFERENCES "clients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_images" ADD CONSTRAINT "project_images_projects_id_fkey" FOREIGN KEY ("projects_id") REFERENCES "projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_categories" ADD CONSTRAINT "project_categories_projects_id_fkey" FOREIGN KEY ("projects_id") REFERENCES "projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_categories" ADD CONSTRAINT "project_categories_service_categories_id_fkey" FOREIGN KEY ("service_categories_id") REFERENCES "service_categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

