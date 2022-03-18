/*
  Warnings:

  - You are about to drop the column `actions_before` on the `Accident` table. All the data in the column will be lost.
  - You are about to drop the column `driver_status` on the `Accident` table. All the data in the column will be lost.
  - You are about to drop the column `observers` on the `Accident` table. All the data in the column will be lost.
  - You are about to drop the column `vehicle_status` on the `Accident` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Accident" DROP COLUMN "actions_before",
DROP COLUMN "driver_status",
DROP COLUMN "observers",
DROP COLUMN "vehicle_status",
ADD COLUMN     "actions_before_accidents" JSONB,
ADD COLUMN     "amazon_logo" BOOLEAN,
ADD COLUMN     "distracted" BOOLEAN,
ADD COLUMN     "general_pictures" JSONB,
ADD COLUMN     "number_packages_carried" INTEGER,
ADD COLUMN     "police_report_information" JSONB,
ADD COLUMN     "rushed_prior" BOOLEAN,
ADD COLUMN     "unsafe_conditions" JSONB,
ADD COLUMN     "vehicleId" TEXT,
ALTER COLUMN "extra_info" DROP NOT NULL,
ALTER COLUMN "weather" DROP NOT NULL,
ALTER COLUMN "weather" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "InjuryAccident" ADD COLUMN     "propertyAccidentId" TEXT;

-- CreateTable
CREATE TABLE "_AccidentToCollisionAccident" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_AccidentToPropertyAccident" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_AccidentToInjuryAccident" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_InjuryAccidentToPropertyAccident" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_CollisionAccidentToInjuryAccident" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_AccidentToCollisionAccident_AB_unique" ON "_AccidentToCollisionAccident"("A", "B");

-- CreateIndex
CREATE INDEX "_AccidentToCollisionAccident_B_index" ON "_AccidentToCollisionAccident"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_AccidentToPropertyAccident_AB_unique" ON "_AccidentToPropertyAccident"("A", "B");

-- CreateIndex
CREATE INDEX "_AccidentToPropertyAccident_B_index" ON "_AccidentToPropertyAccident"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_AccidentToInjuryAccident_AB_unique" ON "_AccidentToInjuryAccident"("A", "B");

-- CreateIndex
CREATE INDEX "_AccidentToInjuryAccident_B_index" ON "_AccidentToInjuryAccident"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_InjuryAccidentToPropertyAccident_AB_unique" ON "_InjuryAccidentToPropertyAccident"("A", "B");

-- CreateIndex
CREATE INDEX "_InjuryAccidentToPropertyAccident_B_index" ON "_InjuryAccidentToPropertyAccident"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_CollisionAccidentToInjuryAccident_AB_unique" ON "_CollisionAccidentToInjuryAccident"("A", "B");

-- CreateIndex
CREATE INDEX "_CollisionAccidentToInjuryAccident_B_index" ON "_CollisionAccidentToInjuryAccident"("B");

-- AddForeignKey
ALTER TABLE "InjuryAccident" ADD FOREIGN KEY ("propertyAccidentId") REFERENCES "PropertyAccident"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AccidentToCollisionAccident" ADD FOREIGN KEY ("A") REFERENCES "Accident"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AccidentToCollisionAccident" ADD FOREIGN KEY ("B") REFERENCES "CollisionAccident"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AccidentToPropertyAccident" ADD FOREIGN KEY ("A") REFERENCES "Accident"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AccidentToPropertyAccident" ADD FOREIGN KEY ("B") REFERENCES "PropertyAccident"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AccidentToInjuryAccident" ADD FOREIGN KEY ("A") REFERENCES "Accident"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AccidentToInjuryAccident" ADD FOREIGN KEY ("B") REFERENCES "InjuryAccident"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_InjuryAccidentToPropertyAccident" ADD FOREIGN KEY ("A") REFERENCES "InjuryAccident"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_InjuryAccidentToPropertyAccident" ADD FOREIGN KEY ("B") REFERENCES "PropertyAccident"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CollisionAccidentToInjuryAccident" ADD FOREIGN KEY ("A") REFERENCES "CollisionAccident"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CollisionAccidentToInjuryAccident" ADD FOREIGN KEY ("B") REFERENCES "InjuryAccident"("id") ON DELETE CASCADE ON UPDATE CASCADE;
