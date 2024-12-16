-- AlterTable
ALTER TABLE "User" ADD COLUMN     "resetPassToken" TEXT,
ADD COLUMN     "resetPassTokenExpiry" TIMESTAMP(3);
