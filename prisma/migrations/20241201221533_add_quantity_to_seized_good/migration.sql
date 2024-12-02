-- CreateEnum
CREATE TYPE "OrgStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "RequestStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- AlterEnum
ALTER TYPE "GoodStatus" ADD VALUE 'RECEIVED';

-- DropForeignKey
ALTER TABLE "SocialOrganizationCategory" DROP CONSTRAINT "SocialOrganizationCategory_socialOrganizationId_fkey";

-- AlterTable
ALTER TABLE "SeizedGood" ADD COLUMN     "quantity" INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "SocialOrganization" ADD COLUMN     "status" "OrgStatus" NOT NULL DEFAULT 'PENDING';

-- CreateTable
CREATE TABLE "Request" (
    "id" SERIAL NOT NULL,
    "organizationId" INTEGER NOT NULL,
    "seizedGoodId" INTEGER NOT NULL,
    "purpose" TEXT NOT NULL,
    "impactEstimate" TEXT,
    "status" "RequestStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Request_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Feedback" (
    "id" SERIAL NOT NULL,
    "organizationId" INTEGER NOT NULL,
    "seizedGoodId" INTEGER NOT NULL,
    "testimonial" TEXT,
    "photos" TEXT[],
    "impactStats" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Feedback_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SocialOrganizationCategory" ADD CONSTRAINT "SocialOrganizationCategory_socialOrganizationId_fkey" FOREIGN KEY ("socialOrganizationId") REFERENCES "SocialOrganization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Request" ADD CONSTRAINT "Request_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "SocialOrganization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Request" ADD CONSTRAINT "Request_seizedGoodId_fkey" FOREIGN KEY ("seizedGoodId") REFERENCES "SeizedGood"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Feedback" ADD CONSTRAINT "Feedback_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "SocialOrganization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Feedback" ADD CONSTRAINT "Feedback_seizedGoodId_fkey" FOREIGN KEY ("seizedGoodId") REFERENCES "SeizedGood"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
