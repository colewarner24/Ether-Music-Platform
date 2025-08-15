-- CreateTable
CREATE TABLE "Track" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "originalName" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "mimetype" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "Track_filename_key" ON "Track"("filename");
