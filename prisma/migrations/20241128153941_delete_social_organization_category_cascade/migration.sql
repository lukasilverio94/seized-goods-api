-- DropForeignKey
ALTER TABLE "SocialOrganizationCategory" DROP CONSTRAINT "SocialOrganizationCategory_socialOrganizationId_fkey";

-- AddForeignKey
ALTER TABLE "SocialOrganizationCategory" ADD CONSTRAINT "SocialOrganizationCategory_socialOrganizationId_fkey" FOREIGN KEY ("socialOrganizationId") REFERENCES "SocialOrganization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
