/*
  Warnings:

  - Added the required column `attendance` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `belongs_to_team` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cc` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cdf` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `da` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dar` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dcr` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `defects` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fico` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `has_many_accidents` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `netradyne` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pod` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productivity` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sc` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `seatbelt` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `speeding` to the `User` table without a default value. This is not possible if the table is not empty.
  - Made the column `firstname` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `lastname` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "attendance" JSONB NOT NULL,
ADD COLUMN     "belongs_to_team" BOOLEAN NOT NULL,
ADD COLUMN     "cc" INTEGER NOT NULL,
ADD COLUMN     "cdf" INTEGER NOT NULL,
ADD COLUMN     "da" INTEGER NOT NULL,
ADD COLUMN     "dar" INTEGER NOT NULL,
ADD COLUMN     "dcr" INTEGER NOT NULL,
ADD COLUMN     "defects" INTEGER NOT NULL,
ADD COLUMN     "fico" INTEGER NOT NULL,
ADD COLUMN     "has_many_accidents" INTEGER NOT NULL,
ADD COLUMN     "netradyne" INTEGER NOT NULL,
ADD COLUMN     "pod" INTEGER NOT NULL,
ADD COLUMN     "productivity" JSONB NOT NULL,
ADD COLUMN     "role" "Role" NOT NULL DEFAULT E'USER',
ADD COLUMN     "sc" INTEGER NOT NULL,
ADD COLUMN     "seatbelt" BOOLEAN NOT NULL,
ADD COLUMN     "speeding" BOOLEAN NOT NULL,
ALTER COLUMN "firstname" SET NOT NULL,
ALTER COLUMN "lastname" SET NOT NULL;

-- CreateTable
CREATE TABLE "Accident" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Accident_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HitPerson" (
    "id" SERIAL NOT NULL,
    "accidentId" INTEGER NOT NULL,
    "medical_attention" BOOLEAN NOT NULL,
    "vehicle_or_pedestrian" TEXT NOT NULL,
    "previous_damage" TEXT NOT NULL,
    "contact_infomation" JSONB NOT NULL,
    "injury" TEXT NOT NULL,

    CONSTRAINT "HitPerson_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ThirdParty" (
    "id" SERIAL NOT NULL,
    "accidentId" INTEGER NOT NULL,
    "location" TEXT NOT NULL,

    CONSTRAINT "ThirdParty_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InjuryAccident" (
    "id" SERIAL NOT NULL,
    "self_injured" BOOLEAN NOT NULL,
    "vehicle_number" TEXT NOT NULL,
    "amazon_logo" BOOLEAN NOT NULL,
    "exact_address" TEXT NOT NULL,
    "action_before_accident" JSONB NOT NULL,
    "police_report" JSONB NOT NULL,
    "weather" TEXT NOT NULL,
    "wet_ground" BOOLEAN NOT NULL,
    "slippery_ground" BOOLEAN NOT NULL,
    "extra_info" TEXT NOT NULL,
    "rushed_prior" BOOLEAN NOT NULL,
    "accidentId" INTEGER NOT NULL,

    CONSTRAINT "InjuryAccident_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PropertyAccident" (
    "id" SERIAL NOT NULL,
    "self_injured" BOOLEAN NOT NULL,
    "vehicle_number" TEXT NOT NULL,
    "amazon_logo" BOOLEAN NOT NULL,
    "exact_address" TEXT NOT NULL,
    "action_before_accident" JSONB NOT NULL,
    "police_report" JSONB NOT NULL,
    "weather" TEXT NOT NULL,
    "wet_ground" BOOLEAN NOT NULL,
    "slippery_ground" BOOLEAN NOT NULL,
    "extra_info" TEXT NOT NULL,
    "rushed_prior" BOOLEAN NOT NULL,
    "accidentId" INTEGER NOT NULL,

    CONSTRAINT "PropertyAccident_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InjuryReport" (
    "id" SERIAL NOT NULL,
    "immediate_attention" BOOLEAN NOT NULL,
    "late" JSONB NOT NULL,
    "self_injured" BOOLEAN NOT NULL,
    "injury_type" JSONB NOT NULL,
    "other_injured" BOOLEAN NOT NULL,
    "before_injury" TEXT NOT NULL,
    "packages" JSONB NOT NULL,
    "safety_equipment" JSONB NOT NULL,
    "unsafe_conditions" JSONB NOT NULL,
    "pain_level" INTEGER NOT NULL,
    "addtional_information" TEXT NOT NULL,
    "accidentId" INTEGER NOT NULL,

    CONSTRAINT "InjuryReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Image" (
    "id" SERIAL NOT NULL,
    "fieldname" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "mimetype" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "originalname" TEXT NOT NULL,
    "encoding" TEXT NOT NULL,
    "destination" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "injuryAccidentId" INTEGER NOT NULL,
    "hitPersonId" INTEGER NOT NULL,
    "propertyAccidentId" INTEGER NOT NULL,

    CONSTRAINT "Image_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_AccidentToHitPerson" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_AccidentToThirdParty" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_AccidentToInjuryAccident" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_AccidentToPropertyAccident" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_AccidentToInjuryReport" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_AccidentToHitPerson_AB_unique" ON "_AccidentToHitPerson"("A", "B");

-- CreateIndex
CREATE INDEX "_AccidentToHitPerson_B_index" ON "_AccidentToHitPerson"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_AccidentToThirdParty_AB_unique" ON "_AccidentToThirdParty"("A", "B");

-- CreateIndex
CREATE INDEX "_AccidentToThirdParty_B_index" ON "_AccidentToThirdParty"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_AccidentToInjuryAccident_AB_unique" ON "_AccidentToInjuryAccident"("A", "B");

-- CreateIndex
CREATE INDEX "_AccidentToInjuryAccident_B_index" ON "_AccidentToInjuryAccident"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_AccidentToPropertyAccident_AB_unique" ON "_AccidentToPropertyAccident"("A", "B");

-- CreateIndex
CREATE INDEX "_AccidentToPropertyAccident_B_index" ON "_AccidentToPropertyAccident"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_AccidentToInjuryReport_AB_unique" ON "_AccidentToInjuryReport"("A", "B");

-- CreateIndex
CREATE INDEX "_AccidentToInjuryReport_B_index" ON "_AccidentToInjuryReport"("B");

-- AddForeignKey
ALTER TABLE "Accident" ADD CONSTRAINT "Accident_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HitPerson" ADD CONSTRAINT "HitPerson_accidentId_fkey" FOREIGN KEY ("accidentId") REFERENCES "Accident"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ThirdParty" ADD CONSTRAINT "ThirdParty_accidentId_fkey" FOREIGN KEY ("accidentId") REFERENCES "Accident"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InjuryAccident" ADD CONSTRAINT "InjuryAccident_accidentId_fkey" FOREIGN KEY ("accidentId") REFERENCES "Accident"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PropertyAccident" ADD CONSTRAINT "PropertyAccident_accidentId_fkey" FOREIGN KEY ("accidentId") REFERENCES "Accident"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InjuryReport" ADD CONSTRAINT "InjuryReport_accidentId_fkey" FOREIGN KEY ("accidentId") REFERENCES "Accident"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_injuryAccidentId_fkey" FOREIGN KEY ("injuryAccidentId") REFERENCES "InjuryAccident"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_hitPersonId_fkey" FOREIGN KEY ("hitPersonId") REFERENCES "HitPerson"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_propertyAccidentId_fkey" FOREIGN KEY ("propertyAccidentId") REFERENCES "PropertyAccident"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AccidentToHitPerson" ADD FOREIGN KEY ("A") REFERENCES "Accident"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AccidentToHitPerson" ADD FOREIGN KEY ("B") REFERENCES "HitPerson"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AccidentToThirdParty" ADD FOREIGN KEY ("A") REFERENCES "Accident"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AccidentToThirdParty" ADD FOREIGN KEY ("B") REFERENCES "ThirdParty"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AccidentToInjuryAccident" ADD FOREIGN KEY ("A") REFERENCES "Accident"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AccidentToInjuryAccident" ADD FOREIGN KEY ("B") REFERENCES "InjuryAccident"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AccidentToPropertyAccident" ADD FOREIGN KEY ("A") REFERENCES "Accident"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AccidentToPropertyAccident" ADD FOREIGN KEY ("B") REFERENCES "PropertyAccident"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AccidentToInjuryReport" ADD FOREIGN KEY ("A") REFERENCES "Accident"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AccidentToInjuryReport" ADD FOREIGN KEY ("B") REFERENCES "InjuryReport"("id") ON DELETE CASCADE ON UPDATE CASCADE;
