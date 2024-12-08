/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `SocialOrganization` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "SocialOrganization_contactPerson_key";

-- CreateIndex
CREATE UNIQUE INDEX "SocialOrganization_email_key" ON "SocialOrganization"("email");
