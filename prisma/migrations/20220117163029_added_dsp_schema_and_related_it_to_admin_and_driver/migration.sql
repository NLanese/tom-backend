/*
  Warnings:

  - You are about to drop the column `badFeedbackSettings` on the `Admin` table. All the data in the column will be lost.
  - You are about to drop the column `goodFeedbackSettings` on the `Admin` table. All the data in the column will be lost.
  - You are about to drop the column `leaderBoardAmount` on the `Admin` table. All the data in the column will be lost.
  - You are about to drop the column `mediumFeedbackSettings` on the `Admin` table. All the data in the column will be lost.
  - You are about to drop the column `badFeedbackSettings` on the `Driver` table. All the data in the column will be lost.
  - You are about to drop the column `goodFeedbackSettings` on the `Driver` table. All the data in the column will be lost.
  - You are about to drop the column `leaderBoardAmount` on the `Driver` table. All the data in the column will be lost.
  - You are about to drop the column `mediumFeedbackSettings` on the `Driver` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Admin" DROP COLUMN "badFeedbackSettings",
DROP COLUMN "goodFeedbackSettings",
DROP COLUMN "leaderBoardAmount",
DROP COLUMN "mediumFeedbackSettings";

-- AlterTable
ALTER TABLE "Driver" DROP COLUMN "badFeedbackSettings",
DROP COLUMN "goodFeedbackSettings",
DROP COLUMN "leaderBoardAmount",
DROP COLUMN "mediumFeedbackSettings";

-- CreateTable
CREATE TABLE "Dsp" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "shortcode" TEXT NOT NULL,
    "leaderBoardLimit" JSONB NOT NULL,
    "ficoLimits" JSONB NOT NULL,
    "seatbeltLimits" JSONB NOT NULL,
    "speedingLimits" JSONB NOT NULL,
    "distractionLimits" JSONB NOT NULL,
    "followLimits" JSONB NOT NULL,
    "signalLimits" JSONB NOT NULL,
    "dcrLimits" JSONB NOT NULL,
    "scanComplianceLimits" JSONB NOT NULL,
    "adminId" INTEGER NOT NULL,
    "driverId" INTEGER NOT NULL,

    CONSTRAINT "Dsp_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Dsp_adminId_key" ON "Dsp"("adminId");

-- CreateIndex
CREATE UNIQUE INDEX "Dsp_driverId_key" ON "Dsp"("driverId");

-- AddForeignKey
ALTER TABLE "Dsp" ADD CONSTRAINT "Dsp_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "Admin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Dsp" ADD CONSTRAINT "Dsp_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "Driver"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
