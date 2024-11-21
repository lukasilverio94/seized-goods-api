-- CreateTable
CREATE TABLE "SocialOrganizationCategory" (
    "id" SERIAL NOT NULL,
    "socialOrganizationId" INTEGER NOT NULL,
    "categoryId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SocialOrganizationCategory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SocialOrganizationCategory_socialOrganizationId_categoryId_key" ON "SocialOrganizationCategory"("socialOrganizationId", "categoryId");

-- AddForeignKey
ALTER TABLE "SocialOrganizationCategory" ADD CONSTRAINT "SocialOrganizationCategory_socialOrganizationId_fkey" FOREIGN KEY ("socialOrganizationId") REFERENCES "SocialOrganization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SocialOrganizationCategory" ADD CONSTRAINT "SocialOrganizationCategory_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
