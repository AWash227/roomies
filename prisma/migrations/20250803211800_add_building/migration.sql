/*
  Warnings:

  - Added the required column `buildingId` to the `Address` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "Building" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT,
    "floors" INTEGER NOT NULL DEFAULT 1
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Address" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "buildingId" TEXT NOT NULL,
    "street1" TEXT NOT NULL,
    "street2" TEXT,
    "city" TEXT,
    "state" TEXT NOT NULL,
    "zip" TEXT NOT NULL,
    CONSTRAINT "Address_buildingId_fkey" FOREIGN KEY ("buildingId") REFERENCES "Building" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Address" ("city", "id", "state", "street1", "street2", "zip") SELECT "city", "id", "state", "street1", "street2", "zip" FROM "Address";
DROP TABLE "Address";
ALTER TABLE "new_Address" RENAME TO "Address";
CREATE UNIQUE INDEX "Address_buildingId_key" ON "Address"("buildingId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
