/*
  Warnings:

  - You are about to drop the column `artworkFile` on the `Track` table. All the data in the column will be lost.
  - You are about to drop the column `filename` on the `Track` table. All the data in the column will be lost.
  - You are about to drop the column `mimetype` on the `Track` table. All the data in the column will be lost.
  - You are about to drop the column `originalName` on the `Track` table. All the data in the column will be lost.
  - You are about to drop the column `size` on the `Track` table. All the data in the column will be lost.
  - Added the required column `userId` to the `Track` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "artistName" TEXT NOT NULL,
    "profilePhoto" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Track" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "artist" TEXT NOT NULL,
    "imageUrl" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER NOT NULL,
    CONSTRAINT "Track_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Track" ("artist", "createdAt", "id", "title") SELECT "artist", "createdAt", "id", "title" FROM "Track";
DROP TABLE "Track";
ALTER TABLE "new_Track" RENAME TO "Track";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
