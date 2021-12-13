/*
  Warnings:

  - You are about to drop the column `failed_safety` on the `Accident` table. All the data in the column will be lost.
  - You are about to drop the column `addtional_information` on the `InjuryReport` table. All the data in the column will be lost.
  - Added the required column `additional_information` to the `InjuryReport` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Accident" DROP COLUMN "failed_safety";

-- AlterTable
ALTER TABLE "InjuryReport" DROP COLUMN "addtional_information",
ADD COLUMN     "additional_information" TEXT NOT NULL;
