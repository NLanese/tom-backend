/*
  Warnings:

  - You are about to drop the column `mutedDrivers` on the `Driver` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Driver" DROP COLUMN "mutedDrivers",
ADD COLUMN     "mutedIds" JSONB[];
