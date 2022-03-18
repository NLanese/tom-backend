/*
  Warnings:

  - You are about to drop the column `actions_before_accidents` on the `Accident` table. All the data in the column will be lost.
  - You are about to drop the column `amazon_logo` on the `Accident` table. All the data in the column will be lost.
  - You are about to drop the column `distracted` on the `Accident` table. All the data in the column will be lost.
  - You are about to drop the column `general_pictures` on the `Accident` table. All the data in the column will be lost.
  - You are about to drop the column `number_packages_carried` on the `Accident` table. All the data in the column will be lost.
  - You are about to drop the column `police_report_information` on the `Accident` table. All the data in the column will be lost.
  - You are about to drop the column `rushed_prior` on the `Accident` table. All the data in the column will be lost.
  - You are about to drop the column `unsafe_conditions` on the `Accident` table. All the data in the column will be lost.
  - You are about to drop the column `vehicleId` on the `Accident` table. All the data in the column will be lost.
  - You are about to drop the column `propertyAccidentId` on the `InjuryAccident` table. All the data in the column will be lost.
  - You are about to drop the `_AccidentToCollisionAccident` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_AccidentToInjuryAccident` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_AccidentToPropertyAccident` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_CollisionAccidentToInjuryAccident` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_InjuryAccidentToPropertyAccident` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `actions_before` to the `Accident` table without a default value. This is not possible if the table is not empty.
  - Added the required column `driver_status` to the `Accident` table without a default value. This is not possible if the table is not empty.
  - Added the required column `vehicle_status` to the `Accident` table without a default value. This is not possible if the table is not empty.
  - Added the required column `weather` to the `Accident` table without a default value. This is not possible if the table is not empty.
  - Made the column `extra_info` on table `Accident` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "InjuryAccident" DROP CONSTRAINT "InjuryAccident_propertyAccidentId_fkey";

-- DropForeignKey
ALTER TABLE "_AccidentToCollisionAccident" DROP CONSTRAINT "_AccidentToCollisionAccident_A_fkey";

-- DropForeignKey
ALTER TABLE "_AccidentToCollisionAccident" DROP CONSTRAINT "_AccidentToCollisionAccident_B_fkey";

-- DropForeignKey
ALTER TABLE "_AccidentToInjuryAccident" DROP CONSTRAINT "_AccidentToInjuryAccident_A_fkey";

-- DropForeignKey
ALTER TABLE "_AccidentToInjuryAccident" DROP CONSTRAINT "_AccidentToInjuryAccident_B_fkey";

-- DropForeignKey
ALTER TABLE "_AccidentToPropertyAccident" DROP CONSTRAINT "_AccidentToPropertyAccident_A_fkey";

-- DropForeignKey
ALTER TABLE "_AccidentToPropertyAccident" DROP CONSTRAINT "_AccidentToPropertyAccident_B_fkey";

-- DropForeignKey
ALTER TABLE "_CollisionAccidentToInjuryAccident" DROP CONSTRAINT "_CollisionAccidentToInjuryAccident_A_fkey";

-- DropForeignKey
ALTER TABLE "_CollisionAccidentToInjuryAccident" DROP CONSTRAINT "_CollisionAccidentToInjuryAccident_B_fkey";

-- DropForeignKey
ALTER TABLE "_InjuryAccidentToPropertyAccident" DROP CONSTRAINT "_InjuryAccidentToPropertyAccident_A_fkey";

-- DropForeignKey
ALTER TABLE "_InjuryAccidentToPropertyAccident" DROP CONSTRAINT "_InjuryAccidentToPropertyAccident_B_fkey";

-- AlterTable
ALTER TABLE "Accident" DROP COLUMN "actions_before_accidents",
DROP COLUMN "amazon_logo",
DROP COLUMN "distracted",
DROP COLUMN "general_pictures",
DROP COLUMN "number_packages_carried",
DROP COLUMN "police_report_information",
DROP COLUMN "rushed_prior",
DROP COLUMN "unsafe_conditions",
DROP COLUMN "vehicleId",
ADD COLUMN     "actions_before" JSONB NOT NULL,
ADD COLUMN     "driver_status" JSONB NOT NULL,
ADD COLUMN     "observers" JSONB[],
ADD COLUMN     "vehicle_status" JSONB NOT NULL,
DROP COLUMN "weather",
ADD COLUMN     "weather" JSONB NOT NULL,
ALTER COLUMN "extra_info" SET NOT NULL;

-- AlterTable
ALTER TABLE "InjuryAccident" DROP COLUMN "propertyAccidentId";

-- DropTable
DROP TABLE "_AccidentToCollisionAccident";

-- DropTable
DROP TABLE "_AccidentToInjuryAccident";

-- DropTable
DROP TABLE "_AccidentToPropertyAccident";

-- DropTable
DROP TABLE "_CollisionAccidentToInjuryAccident";

-- DropTable
DROP TABLE "_InjuryAccidentToPropertyAccident";
