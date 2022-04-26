/*
  Warnings:

  - You are about to drop the `ShiftPlanner` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Vehicle` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `WeeklySchedule` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ShiftPlanner" DROP CONSTRAINT "ShiftPlanner_driverId_fkey";

-- DropForeignKey
ALTER TABLE "Vehicle" DROP CONSTRAINT "Vehicle_driverId_fkey";

-- DropForeignKey
ALTER TABLE "WeeklySchedule" DROP CONSTRAINT "WeeklySchedule_driverId_fkey";

-- DropForeignKey
ALTER TABLE "WeeklySchedule" DROP CONSTRAINT "WeeklySchedule_managerId_fkey";

-- DropForeignKey
ALTER TABLE "WeeklySchedule" DROP CONSTRAINT "WeeklySchedule_ownerId_fkey";

-- DropTable
DROP TABLE "ShiftPlanner";

-- DropTable
DROP TABLE "Vehicle";

-- DropTable
DROP TABLE "WeeklySchedule";

-- CreateTable
CREATE TABLE "DailyRoster" (
    "id" TEXT NOT NULL,
    "date" TEXT NOT NULL,

    CONSTRAINT "DailyRoster_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_DailyRosterToDriver" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "DailyRoster_id_key" ON "DailyRoster"("id");

-- CreateIndex
CREATE UNIQUE INDEX "DailyRoster_date_key" ON "DailyRoster"("date");

-- CreateIndex
CREATE UNIQUE INDEX "_DailyRosterToDriver_AB_unique" ON "_DailyRosterToDriver"("A", "B");

-- CreateIndex
CREATE INDEX "_DailyRosterToDriver_B_index" ON "_DailyRosterToDriver"("B");

-- AddForeignKey
ALTER TABLE "_DailyRosterToDriver" ADD FOREIGN KEY ("A") REFERENCES "DailyRoster"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DailyRosterToDriver" ADD FOREIGN KEY ("B") REFERENCES "Driver"("id") ON DELETE CASCADE ON UPDATE CASCADE;
