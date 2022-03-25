/*
  Warnings:

  - You are about to drop the column `callComplianceLimits` on the `Dsp` table. All the data in the column will be lost.
  - You are about to drop the column `scanComplianceLimits` on the `Dsp` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Dsp" DROP COLUMN "callComplianceLimits",
DROP COLUMN "scanComplianceLimits";
