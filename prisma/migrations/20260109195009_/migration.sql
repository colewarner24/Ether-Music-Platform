/*
  Warnings:

  - A unique constraint covering the columns `[artistName]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "User_artistName_key" ON "User"("artistName");
