-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN', 'SUPERADMIN');

-- CreateTable
CREATE TABLE "Admin" (
    "id" SERIAL NOT NULL,
    "role" "Role" NOT NULL DEFAULT E'ADMIN',
    "firstname" TEXT NOT NULL,
    "lastname" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "role" "Role" NOT NULL DEFAULT E'USER',
    "firstname" TEXT NOT NULL,
    "lastname" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "fico" INTEGER,
    "netradyne" INTEGER,
    "da" INTEGER,
    "seatbelt" BOOLEAN,
    "speeding" BOOLEAN,
    "defects" INTEGER,
    "cdf" INTEGER,
    "dar" INTEGER,
    "dcr" INTEGER,
    "pod" INTEGER,
    "cc" INTEGER,
    "sc" INTEGER,
    "has_many_accidents" INTEGER,
    "belongs_to_team" BOOLEAN,
    "attendance" JSONB,
    "productivity" JSONB,
    "adminId" INTEGER NOT NULL,
    "adminEmail" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Accident" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "using_safety" BOOLEAN,
    "safety_failed" BOOLEAN,
    "number_package_carried" INTEGER,
    "safety_equipment_used" JSONB,
    "failed_safety" BOOLEAN,

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
CREATE UNIQUE INDEX "Admin_username_key" ON "Admin"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Admin_email_key" ON "Admin"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

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
ALTER TABLE "User" ADD CONSTRAINT "User_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "Admin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

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
