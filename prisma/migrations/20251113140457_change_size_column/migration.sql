/*
  Warnings:

  - You are about to drop the column `size` on the `media` table. All the data in the column will be lost.
  - Added the required column `size_bytes` to the `media` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "public"."media_size_idx";

-- AlterTable
ALTER TABLE "media" DROP COLUMN "size",
ADD COLUMN     "size_bytes" INTEGER NOT NULL;

-- CreateIndex
CREATE INDEX "media_size_bytes_idx" ON "media"("size_bytes");
