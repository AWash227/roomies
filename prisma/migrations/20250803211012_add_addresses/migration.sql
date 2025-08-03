-- CreateTable
CREATE TABLE "Address" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "street1" TEXT NOT NULL,
    "street2" TEXT,
    "city" TEXT,
    "state" TEXT NOT NULL,
    "zip" TEXT NOT NULL
);
