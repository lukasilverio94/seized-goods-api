-- CreateEnum
CREATE TYPE "GoodStatus" AS ENUM ('PENDING', 'ALLOCATED', 'RECEIVED', 'DESTROYED');

-- CreateEnum
CREATE TYPE "OrgStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "RequestStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('USER', 'ADMIN');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'USER',
    "organizationId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SocialOrganization" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "contactPerson" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "qualifications" TEXT NOT NULL,
    "status" "OrgStatus" NOT NULL DEFAULT 'APPROVED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SocialOrganization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SocialOrganizationCategory" (
    "id" SERIAL NOT NULL,
    "socialOrganizationId" INTEGER NOT NULL,
    "categoryId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SocialOrganizationCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SeizedGood" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "availableQuantity" INTEGER NOT NULL DEFAULT 0,
    "status" "GoodStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "categoryId" INTEGER NOT NULL,

    CONSTRAINT "SeizedGood_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Image" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "altText" TEXT,
    "seizedGoodId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Image_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Request" (
    "id" SERIAL NOT NULL,
    "organizationId" INTEGER NOT NULL,
    "seizedGoodId" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
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

-- CreateTable
CREATE TABLE "Allocation" (
    "id" SERIAL NOT NULL,
    "seizedGoodId" INTEGER NOT NULL,
    "organizationId" INTEGER NOT NULL,
    "allocatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "purpose" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Allocation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RefreshToken" (
    "id" TEXT NOT NULL,
    "hashedToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "revoked" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RefreshToken_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "SocialOrganizationCategory_socialOrganizationId_categoryId_key" ON "SocialOrganizationCategory"("socialOrganizationId", "categoryId");

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");

-- CreateIndex
CREATE INDEX "RefreshToken_userId_idx" ON "RefreshToken"("userId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "SocialOrganization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SocialOrganizationCategory" ADD CONSTRAINT "SocialOrganizationCategory_socialOrganizationId_fkey" FOREIGN KEY ("socialOrganizationId") REFERENCES "SocialOrganization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SocialOrganizationCategory" ADD CONSTRAINT "SocialOrganizationCategory_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SeizedGood" ADD CONSTRAINT "SeizedGood_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_seizedGoodId_fkey" FOREIGN KEY ("seizedGoodId") REFERENCES "SeizedGood"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Request" ADD CONSTRAINT "Request_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "SocialOrganization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Request" ADD CONSTRAINT "Request_seizedGoodId_fkey" FOREIGN KEY ("seizedGoodId") REFERENCES "SeizedGood"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Feedback" ADD CONSTRAINT "Feedback_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "SocialOrganization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Feedback" ADD CONSTRAINT "Feedback_seizedGoodId_fkey" FOREIGN KEY ("seizedGoodId") REFERENCES "SeizedGood"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Allocation" ADD CONSTRAINT "Allocation_seizedGoodId_fkey" FOREIGN KEY ("seizedGoodId") REFERENCES "SeizedGood"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Allocation" ADD CONSTRAINT "Allocation_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "SocialOrganization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RefreshToken" ADD CONSTRAINT "RefreshToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
