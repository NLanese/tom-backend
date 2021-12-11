/*
  Warnings:

  - You are about to drop the column `userId` on the `ThirdParty` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "ThirdParty" DROP CONSTRAINT "ThirdParty_userId_fkey";

-- AlterTable
ALTER TABLE "ThirdParty" DROP COLUMN "userId";
