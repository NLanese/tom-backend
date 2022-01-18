-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN', 'SUPERADMIN');

-- CreateTable
CREATE TABLE "SuperUser" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "role" "Role" NOT NULL DEFAULT E'SUPERADMIN',
    "firstname" TEXT NOT NULL,
    "lastname" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,

    CONSTRAINT "SuperUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Owner" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "role" "Role" NOT NULL DEFAULT E'ADMIN',
    "firstname" TEXT NOT NULL,
    "lastname" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "profile_Pick" JSONB,
    "paid" BOOLEAN NOT NULL DEFAULT false,
    "accountStanding" TEXT NOT NULL DEFAULT E'Free',
    "locked" BOOLEAN NOT NULL DEFAULT false,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "notified" BOOLEAN NOT NULL DEFAULT false,
    "resetPasswordToken" TEXT,
    "resetPasswordTokenExpiration" INTEGER,
    "signUpToken" TEXT,

    CONSTRAINT "Owner_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Admin" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "role" "Role" NOT NULL DEFAULT E'ADMIN',
    "firstname" TEXT NOT NULL,
    "lastname" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "profile_Pick" JSONB,
    "accountStanding" TEXT NOT NULL DEFAULT E'Free',
    "locked" BOOLEAN NOT NULL DEFAULT false,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "notified" BOOLEAN NOT NULL DEFAULT false,
    "resetPasswordToken" TEXT,
    "resetPasswordTokenExpiration" INTEGER,
    "ownerId" INTEGER NOT NULL,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Driver" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "role" "Role" NOT NULL DEFAULT E'USER',
    "firstname" TEXT NOT NULL,
    "lastname" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "profile_Pick" JSONB,
    "rank" JSONB,
    "employeeId" TEXT,
    "tier" JSONB,
    "delivered" JSONB,
    "keyFocusArea" JSONB,
    "fico" JSONB,
    "seatbeltAndSpeeding" JSONB,
    "seatbeltOffRate" JSONB,
    "speedingEventRate" JSONB,
    "distractionsRate" JSONB,
    "followingDistanceRate" JSONB,
    "signalViolationsRate" JSONB,
    "deliveryCompletionRate" JSONB,
    "deliveredNotRecieved" JSONB,
    "photoOnDelivery" JSONB,
    "callCompliance" JSONB,
    "scanCompliance" JSONB,
    "attendedDeliveryAccuracy" JSONB,
    "netradyne" JSONB,
    "deliveryAssociate" JSONB,
    "defects" JSONB,
    "customerDeliveryFeedback" JSONB,
    "hasManyAccidents" JSONB,
    "belongsToTeam" JSONB,
    "attendance" JSONB,
    "productivity" JSONB,
    "notified" BOOLEAN NOT NULL DEFAULT false,
    "accountStanding" TEXT NOT NULL DEFAULT E'Free',
    "locked" BOOLEAN NOT NULL DEFAULT false,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "resetPasswordToken" TEXT,
    "resetPasswordTokenExpiration" INTEGER,
    "ownerId" INTEGER NOT NULL,
    "adminId" INTEGER NOT NULL,

    CONSTRAINT "Driver_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Dsp" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "shortcode" TEXT NOT NULL,
    "leaderBoardLimit" JSONB NOT NULL,
    "ficoLimits" JSONB NOT NULL,
    "seatbeltLimits" JSONB NOT NULL,
    "speedingLimits" JSONB NOT NULL,
    "distractionLimits" JSONB NOT NULL,
    "followLimits" JSONB NOT NULL,
    "signalLimits" JSONB NOT NULL,
    "deliveryCompletionRateLimits" JSONB NOT NULL,
    "scanComplianceLimits" JSONB NOT NULL,
    "callComplianceLimits" JSONB NOT NULL,
    "deliveryNotRecievedLimits" JSONB NOT NULL,
    "photoOnDeliveryLimits" JSONB NOT NULL,
    "adminId" INTEGER NOT NULL,
    "driverId" INTEGER NOT NULL,
    "ownerId" INTEGER NOT NULL,

    CONSTRAINT "Dsp_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Messages" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "content" TEXT NOT NULL,
    "from" TEXT NOT NULL,
    "ownerId" INTEGER NOT NULL,
    "driverId" INTEGER NOT NULL,
    "adminId" INTEGER NOT NULL,

    CONSTRAINT "Messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NotifiedMessages" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "content" TEXT NOT NULL,
    "from" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "driverId" INTEGER,
    "adminId" INTEGER,
    "ownerId" INTEGER NOT NULL,

    CONSTRAINT "NotifiedMessages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vehicle" (
    "id" SERIAL NOT NULL,
    "driverId" INTEGER NOT NULL,
    "vehicle_number" TEXT,
    "amazon_logo" TEXT,

    CONSTRAINT "Vehicle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Accident" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "driverId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "using_safety" BOOLEAN,
    "safety_failed" BOOLEAN,
    "number_package_carried" INTEGER,
    "safety_equipment_used" TEXT,
    "police_report_information" JSONB,
    "police_report_photos" JSONB,
    "vehicle_number" TEXT,
    "amazon_logo" BOOLEAN,
    "location" TEXT NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "filled" BOOLEAN NOT NULL DEFAULT false,

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
    "deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "HitPerson_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Collision" (
    "id" SERIAL NOT NULL,
    "accidentId" INTEGER NOT NULL,
    "location" TEXT NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Collision_pkey" PRIMARY KEY ("id")
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
    "deleted" BOOLEAN NOT NULL DEFAULT false,
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
    "deleted" BOOLEAN NOT NULL DEFAULT false,
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
    "additional_information" TEXT NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
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
CREATE TABLE "_AccidentToCollision" (
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
CREATE UNIQUE INDEX "SuperUser_email_key" ON "SuperUser"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Owner_email_key" ON "Owner"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Admin_email_key" ON "Admin"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Driver_email_key" ON "Driver"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Dsp_name_key" ON "Dsp"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Dsp_shortcode_key" ON "Dsp"("shortcode");

-- CreateIndex
CREATE UNIQUE INDEX "Dsp_adminId_key" ON "Dsp"("adminId");

-- CreateIndex
CREATE UNIQUE INDEX "Dsp_driverId_key" ON "Dsp"("driverId");

-- CreateIndex
CREATE UNIQUE INDEX "Dsp_ownerId_key" ON "Dsp"("ownerId");

-- CreateIndex
CREATE UNIQUE INDEX "Vehicle_driverId_key" ON "Vehicle"("driverId");

-- CreateIndex
CREATE UNIQUE INDEX "_AccidentToHitPerson_AB_unique" ON "_AccidentToHitPerson"("A", "B");

-- CreateIndex
CREATE INDEX "_AccidentToHitPerson_B_index" ON "_AccidentToHitPerson"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_AccidentToCollision_AB_unique" ON "_AccidentToCollision"("A", "B");

-- CreateIndex
CREATE INDEX "_AccidentToCollision_B_index" ON "_AccidentToCollision"("B");

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
ALTER TABLE "Admin" ADD CONSTRAINT "Admin_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "Owner"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Driver" ADD CONSTRAINT "Driver_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "Owner"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Driver" ADD CONSTRAINT "Driver_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "Admin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Dsp" ADD CONSTRAINT "Dsp_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "Admin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Dsp" ADD CONSTRAINT "Dsp_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "Driver"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Dsp" ADD CONSTRAINT "Dsp_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "Owner"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Messages" ADD CONSTRAINT "Messages_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "Owner"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Messages" ADD CONSTRAINT "Messages_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "Driver"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Messages" ADD CONSTRAINT "Messages_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "Admin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NotifiedMessages" ADD CONSTRAINT "NotifiedMessages_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "Owner"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NotifiedMessages" ADD CONSTRAINT "NotifiedMessages_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "Driver"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NotifiedMessages" ADD CONSTRAINT "NotifiedMessages_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "Admin"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vehicle" ADD CONSTRAINT "Vehicle_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "Driver"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Accident" ADD CONSTRAINT "Accident_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "Driver"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HitPerson" ADD FOREIGN KEY ("accidentId") REFERENCES "Accident"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Collision" ADD FOREIGN KEY ("accidentId") REFERENCES "Accident"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InjuryAccident" ADD FOREIGN KEY ("accidentId") REFERENCES "Accident"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PropertyAccident" ADD FOREIGN KEY ("accidentId") REFERENCES "Accident"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InjuryReport" ADD FOREIGN KEY ("accidentId") REFERENCES "Accident"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

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
ALTER TABLE "_AccidentToCollision" ADD FOREIGN KEY ("A") REFERENCES "Accident"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AccidentToCollision" ADD FOREIGN KEY ("B") REFERENCES "Collision"("id") ON DELETE CASCADE ON UPDATE CASCADE;

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
