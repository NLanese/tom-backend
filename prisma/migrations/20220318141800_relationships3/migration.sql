/*
  Warnings:

  - You are about to drop the column `propertyAccidentId` on the `InjuryAccident` table. All the data in the column will be lost.
  - You are about to drop the `_AccidentToInjuryAccident` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_AccidentToPropertyAccident` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_CollisionAccidentToInjuryAccident` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_InjuryAccidentToPropertyAccident` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "InjuryAccident" DROP CONSTRAINT "InjuryAccident_propertyAccidentId_fkey";

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
ALTER TABLE "InjuryAccident" DROP COLUMN "propertyAccidentId";

-- DropTable
DROP TABLE "_AccidentToInjuryAccident";

-- DropTable
DROP TABLE "_AccidentToPropertyAccident";

-- DropTable
DROP TABLE "_CollisionAccidentToInjuryAccident";

-- DropTable
DROP TABLE "_InjuryAccidentToPropertyAccident";
