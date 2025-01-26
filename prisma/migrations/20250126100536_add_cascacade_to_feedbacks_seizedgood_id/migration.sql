-- DropForeignKey
ALTER TABLE "Feedback" DROP CONSTRAINT "Feedback_seizedGoodId_fkey";

-- AddForeignKey
ALTER TABLE "Feedback" ADD CONSTRAINT "Feedback_seizedGoodId_fkey" FOREIGN KEY ("seizedGoodId") REFERENCES "SeizedGood"("id") ON DELETE CASCADE ON UPDATE CASCADE;
