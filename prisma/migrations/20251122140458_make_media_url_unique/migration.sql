/*
  Warnings:

  - A unique constraint covering the columns `[url]` on the table `media` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "media_url_key" ON "media"("url");
