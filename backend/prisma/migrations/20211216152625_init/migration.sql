/*
  Warnings:

  - You are about to drop the column `adminAccountStading` on the `User` table. All the data in the column will be lost.
  - Made the column `using_safety` on table `Accident` required. This step will fail if there are existing NULL values in that column.
  - Made the column `safety_failed` on table `Accident` required. This step will fail if there are existing NULL values in that column.
  - Made the column `number_package_carried` on table `Accident` required. This step will fail if there are existing NULL values in that column.
  - Made the column `safety_equipment_used` on table `Accident` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Accident" ADD COLUMN     "deleted" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "using_safety" SET NOT NULL,
ALTER COLUMN "safety_failed" SET NOT NULL,
ALTER COLUMN "number_package_carried" SET NOT NULL,
ALTER COLUMN "safety_equipment_used" SET NOT NULL;

-- AlterTable
ALTER TABLE "Admin" ADD COLUMN     "deleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "HitPerson" ADD COLUMN     "deleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "InjuryAccident" ADD COLUMN     "deleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "InjuryReport" ADD COLUMN     "deleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "PropertyAccident" ADD COLUMN     "deleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "ThirdParty" ADD COLUMN     "deleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "adminAccountStading",
ADD COLUMN     "adminAccountStanding" TEXT,
ADD COLUMN     "deleted" BOOLEAN NOT NULL DEFAULT false;
