/*
  Warnings:

  - You are about to drop the column `date` on the `ShiftPlanner` table. All the data in the column will be lost.
  - Added the required column `fridayDate` to the `ShiftPlanner` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fridayHours` to the `ShiftPlanner` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mondayDate` to the `ShiftPlanner` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mondayHours` to the `ShiftPlanner` table without a default value. This is not possible if the table is not empty.
  - Added the required column `saturdayDate` to the `ShiftPlanner` table without a default value. This is not possible if the table is not empty.
  - Added the required column `saturdayHours` to the `ShiftPlanner` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sundayDate` to the `ShiftPlanner` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sundayHours` to the `ShiftPlanner` table without a default value. This is not possible if the table is not empty.
  - Added the required column `thuesdayHours` to the `ShiftPlanner` table without a default value. This is not possible if the table is not empty.
  - Added the required column `thursdayDate` to the `ShiftPlanner` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tuesdayDate` to the `ShiftPlanner` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tuesdayHours` to the `ShiftPlanner` table without a default value. This is not possible if the table is not empty.
  - Added the required column `wednesdayDate` to the `ShiftPlanner` table without a default value. This is not possible if the table is not empty.
  - Added the required column `wednesdayHours` to the `ShiftPlanner` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ShiftPlanner" DROP COLUMN "date",
ADD COLUMN     "fridayDate" TEXT NOT NULL,
ADD COLUMN     "fridayHours" TEXT NOT NULL,
ADD COLUMN     "mondayDate" TEXT NOT NULL,
ADD COLUMN     "mondayHours" TEXT NOT NULL,
ADD COLUMN     "saturdayDate" TEXT NOT NULL,
ADD COLUMN     "saturdayHours" TEXT NOT NULL,
ADD COLUMN     "sundayDate" TEXT NOT NULL,
ADD COLUMN     "sundayHours" TEXT NOT NULL,
ADD COLUMN     "thuesdayHours" TEXT NOT NULL,
ADD COLUMN     "thursdayDate" TEXT NOT NULL,
ADD COLUMN     "tuesdayDate" TEXT NOT NULL,
ADD COLUMN     "tuesdayHours" TEXT NOT NULL,
ADD COLUMN     "wednesdayDate" TEXT NOT NULL,
ADD COLUMN     "wednesdayHours" TEXT NOT NULL,
ALTER COLUMN "phoneId" DROP NOT NULL,
ALTER COLUMN "deviceId" DROP NOT NULL,
ALTER COLUMN "vehicleId" DROP NOT NULL,
ALTER COLUMN "cxNumber" DROP NOT NULL,
ALTER COLUMN "message" DROP NOT NULL;
