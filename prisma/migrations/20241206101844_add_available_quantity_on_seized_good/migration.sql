/*
  Warnings:

  - Added the required column `quantity` to the `Request` table without a default value. This is not possible if the table is not empty.
  - Added the required column `availableQuantity` to the `SeizedGood` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Request" ADD COLUMN     "quantity" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "SeizedGood" ADD COLUMN     "availableQuantity" INTEGER NOT NULL;
