/*
  Warnings:

  - You are about to drop the `ShiftPlannerDates` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ShiftPlannerDates" DROP CONSTRAINT "ShiftPlannerDates_dspId_fkey";

-- AlterTable
ALTER TABLE "WeeklyReport" ALTER COLUMN "delivered" DROP NOT NULL,
ALTER COLUMN "keyFocusArea" DROP NOT NULL,
ALTER COLUMN "seatbeltOffRate" DROP NOT NULL,
ALTER COLUMN "speedingEventRate" DROP NOT NULL,
ALTER COLUMN "distractionsRate" DROP NOT NULL,
ALTER COLUMN "followingDistanceRate" DROP NOT NULL,
ALTER COLUMN "signalViolationsRate" DROP NOT NULL,
ALTER COLUMN "deliveryCompletionRate" DROP NOT NULL,
ALTER COLUMN "deliveredAndRecieved" DROP NOT NULL,
ALTER COLUMN "photoOnDelivery" DROP NOT NULL,
ALTER COLUMN "attendedDeliveryAccuracy" DROP NOT NULL,
ALTER COLUMN "dnr" DROP NOT NULL,
ALTER COLUMN "podOpps" DROP NOT NULL,
ALTER COLUMN "ccOpps" DROP NOT NULL,
ALTER COLUMN "customerDeliveryFeedback" SET DATA TYPE TEXT;

-- DropTable
DROP TABLE "ShiftPlannerDates";
