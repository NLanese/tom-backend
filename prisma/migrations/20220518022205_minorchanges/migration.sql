/*
  Warnings:

  - You are about to drop the column `muted` on the `Driver` table. All the data in the column will be lost.
  - Added the required column `sentAt` to the `AnnouncementMessages` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AnnouncementMessages" ADD COLUMN     "sentAt" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Chatroom" ADD COLUMN     "mutedDrivers" JSONB[];

-- AlterTable
ALTER TABLE "Driver" DROP COLUMN "muted",
ADD COLUMN     "globallyMuted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "mutedDrivers" JSONB[];

-- AlterTable
ALTER TABLE "Messages" ADD COLUMN     "sentAt" TEXT;
