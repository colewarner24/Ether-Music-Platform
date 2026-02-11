/*
  Warnings:

  - You are about to drop the column `imageUrl` on the `Track` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Track" DROP COLUMN "imageUrl",
ADD COLUMN     "imageKey" TEXT;
