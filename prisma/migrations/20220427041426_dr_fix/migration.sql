-- AlterTable
ALTER TABLE "DailyRoster" ADD COLUMN     "dspId" TEXT;

-- AddForeignKey
ALTER TABLE "DailyRoster" ADD CONSTRAINT "DailyRoster_dspId_fkey" FOREIGN KEY ("dspId") REFERENCES "Dsp"("id") ON DELETE SET NULL ON UPDATE CASCADE;
