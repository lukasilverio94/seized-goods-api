/*
  Warnings:

  - You are about to drop the column `address` on the `SocialOrganization` table. All the data in the column will be lost.
  - Added the required column `city` to the `SocialOrganization` table without a default value. This is not possible if the table is not empty.
  - Added the required column `country` to the `SocialOrganization` table without a default value. This is not possible if the table is not empty.
  - Added the required column `number` to the `SocialOrganization` table without a default value. This is not possible if the table is not empty.
  - Added the required column `streetName` to the `SocialOrganization` table without a default value. This is not possible if the table is not empty.
  - Added the required column `zipCode` to the `SocialOrganization` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SocialOrganization" DROP COLUMN "address",
ADD COLUMN     "city" TEXT NOT NULL,
ADD COLUMN     "country" TEXT NOT NULL,
ADD COLUMN     "number" TEXT NOT NULL,
ADD COLUMN     "streetName" TEXT NOT NULL,
ADD COLUMN     "zipCode" TEXT NOT NULL;
