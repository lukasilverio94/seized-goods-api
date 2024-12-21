/*
  Warnings:

  - Added the required column `condition` to the `SeizedGood` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "GoodCondition" AS ENUM ('USED', 'REFURBISHED', 'NEW', 'GOOD');

-- AlterTable
ALTER TABLE "SeizedGood" ADD COLUMN     "condition" "GoodCondition" NOT NULL;
