-- DropForeignKey
ALTER TABLE "Request" DROP CONSTRAINT "Request_seizedGoodId_fkey";

-- AddForeignKey
ALTER TABLE "Request" ADD CONSTRAINT "Request_seizedGoodId_fkey" FOREIGN KEY ("seizedGoodId") REFERENCES "SeizedGood"("id") ON DELETE CASCADE ON UPDATE CASCADE;
