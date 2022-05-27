/*
  Warnings:

  - You are about to drop the column `mutedDrivers` on the `Chatroom` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Chatroom" DROP COLUMN "mutedDrivers",
ADD COLUMN     "mutedIds" TEXT[];
