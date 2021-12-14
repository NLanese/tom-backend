/*
  Warnings:

  - You are about to drop the column `cc` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `cdf` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `da` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `dar` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `dcr` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `pod` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `sc` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "cc",
DROP COLUMN "cdf",
DROP COLUMN "da",
DROP COLUMN "dar",
DROP COLUMN "dcr",
DROP COLUMN "pod",
DROP COLUMN "sc",
ADD COLUMN     "call_compliance" INTEGER,
ADD COLUMN     "customer_delivery_feedback" INTEGER,
ADD COLUMN     "delivered_and_recieved" INTEGER,
ADD COLUMN     "delivery_associate" INTEGER,
ADD COLUMN     "delivery_completion_rate" INTEGER,
ADD COLUMN     "photo_on_delivery" INTEGER,
ADD COLUMN     "scan_compliance" INTEGER;
