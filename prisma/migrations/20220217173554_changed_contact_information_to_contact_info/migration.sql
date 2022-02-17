/*
  Warnings:

  - You are about to drop the column `contact_information` on the `PropertyAccident` table. All the data in the column will be lost.
  - Added the required column `contact_info` to the `PropertyAccident` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PropertyAccident" DROP COLUMN "contact_information",
ADD COLUMN     "contact_info" JSONB NOT NULL;
