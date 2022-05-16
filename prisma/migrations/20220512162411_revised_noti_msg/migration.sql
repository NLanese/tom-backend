/*
  Warnings:

  - You are about to drop the column `adminId` on the `NotifiedMessages` table. All the data in the column will be lost.
  - You are about to drop the column `ownerId` on the `NotifiedMessages` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "NotifiedMessages" DROP CONSTRAINT "NotifiedMessages_adminId_fkey";

-- DropForeignKey
ALTER TABLE "NotifiedMessages" DROP CONSTRAINT "NotifiedMessages_ownerId_fkey";

-- AlterTable
ALTER TABLE "NotifiedMessages" DROP COLUMN "adminId",
DROP COLUMN "ownerId",
ALTER COLUMN "createdAt" DROP DEFAULT,
ALTER COLUMN "createdAt" SET DATA TYPE TEXT;
