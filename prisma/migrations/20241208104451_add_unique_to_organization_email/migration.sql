/*
  Warnings:

  - A unique constraint covering the columns `[contactPerson]` on the table `SocialOrganization` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "SocialOrganization_contactPerson_key" ON "SocialOrganization"("contactPerson");
