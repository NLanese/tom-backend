/*
  Warnings:

  - Added the required column `failed_safety` to the `Accident` table without a default value. This is not possible if the table is not empty.
  - Added the required column `number_package_carried` to the `Accident` table without a default value. This is not possible if the table is not empty.
  - Added the required column `safety_equipment_used` to the `Accident` table without a default value. This is not possible if the table is not empty.
  - Added the required column `safety_failed` to the `Accident` table without a default value. This is not possible if the table is not empty.
  - Added the required column `using_safety` to the `Accident` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Accident" ADD COLUMN     "failed_safety" BOOLEAN NOT NULL,
ADD COLUMN     "number_package_carried" INTEGER NOT NULL,
ADD COLUMN     "safety_equipment_used" JSONB NOT NULL,
ADD COLUMN     "safety_failed" BOOLEAN NOT NULL,
ADD COLUMN     "using_safety" BOOLEAN NOT NULL;
