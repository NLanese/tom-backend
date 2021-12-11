/*
  Warnings:

  - Added the required column `userId` to the `ThirdParty` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ThirdParty" ADD COLUMN     "userId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "ThirdParty" ADD CONSTRAINT "ThirdParty_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
