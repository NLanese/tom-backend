-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'MANAGER', 'OWNER', 'SUPERADMIN');

-- CreateTable
CREATE TABLE "SuperUser" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "role" "Role" NOT NULL DEFAULT E'SUPERADMIN',
    "token" TEXT,
    "firstname" TEXT NOT NULL,
    "lastname" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "profilePick" JSONB,

    CONSTRAINT "SuperUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Owner" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "role" "Role" NOT NULL DEFAULT E'OWNER',
    "token" TEXT,
    "firstname" TEXT NOT NULL,
    "lastname" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "profilePick" JSONB,
    "locked" BOOLEAN NOT NULL DEFAULT false,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "notified" BOOLEAN NOT NULL DEFAULT false,
    "resetPasswordToken" TEXT,
    "resetPasswordTokenExpiration" INTEGER,
    "signUpToken" TEXT NOT NULL,

    CONSTRAINT "Owner_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Admin" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "role" "Role" NOT NULL DEFAULT E'MANAGER',
    "token" TEXT,
    "firstname" TEXT NOT NULL,
    "lastname" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "profilePick" JSONB,
    "locked" BOOLEAN NOT NULL DEFAULT false,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "notified" BOOLEAN NOT NULL DEFAULT false,
    "resetPasswordToken" TEXT,
    "resetPasswordTokenExpiration" INTEGER,
    "ownerId" TEXT NOT NULL,
    "dspId" TEXT,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Driver" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "role" "Role" NOT NULL DEFAULT E'USER',
    "token" TEXT,
    "firstname" TEXT NOT NULL,
    "lastname" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "profilePick" JSONB,
    "transporterId" TEXT,
    "locked" BOOLEAN NOT NULL DEFAULT false,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "notified" BOOLEAN NOT NULL DEFAULT false,
    "resetPasswordToken" TEXT,
    "resetPasswordTokenExpiration" INTEGER,
    "ownerId" TEXT NOT NULL,
    "dspId" TEXT,

    CONSTRAINT "Driver_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Dsp" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "shortcode" TEXT NOT NULL,
    "timeZone" TEXT NOT NULL,
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
    "topCardLimits" INTEGER NOT NULL,
    "smallCardLimits" INTEGER NOT NULL,
    "feedbackNotifications" JSONB NOT NULL,
    "autoSend" JSONB NOT NULL,
    "paid" BOOLEAN NOT NULL DEFAULT false,
    "accountStanding" TEXT NOT NULL DEFAULT E'Free',
    "ownerId" TEXT NOT NULL,

    CONSTRAINT "Dsp_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WeeklyReport" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "date" TEXT NOT NULL,
    "hadAccident" BOOLEAN NOT NULL DEFAULT false,
    "feedbackMessage" TEXT,
    "feedbackStatus" TEXT,
    "feedbackMessageSent" BOOLEAN NOT NULL DEFAULT false,
    "acknowledged" BOOLEAN NOT NULL DEFAULT false,
    "acknowledgedAt" TEXT,
    "rank" INTEGER NOT NULL,
    "tier" TEXT NOT NULL,
    "delivered" INTEGER NOT NULL,
    "keyFocusArea" TEXT NOT NULL,
    "fico" TEXT NOT NULL,
    "seatbeltOffRate" TEXT NOT NULL,
    "speedingEventRate" TEXT NOT NULL,
    "distractionsRate" TEXT NOT NULL,
    "followingDistanceRate" TEXT NOT NULL,
    "signalViolationsRate" TEXT NOT NULL,
    "deliveryCompletionRate" TEXT NOT NULL,
    "deliveredAndRecieved" TEXT NOT NULL,
    "photoOnDelivery" TEXT NOT NULL,
    "callCompliance" TEXT NOT NULL,
    "scanCompliance" TEXT NOT NULL,
    "attendedDeliveryAccuracy" INTEGER NOT NULL,
    "dnr" INTEGER NOT NULL,
    "podOpps" INTEGER NOT NULL,
    "ccOpps" INTEGER NOT NULL,
    "netradyne" JSONB,
    "deliveryAssociate" JSONB,
    "defects" JSONB,
    "customerDeliveryFeedback" JSONB,
    "hasManyAccidents" JSONB,
    "belongsToTeam" JSONB,
    "attendance" JSONB,
    "productivity" JSONB,
    "driverId" TEXT NOT NULL,

    CONSTRAINT "WeeklyReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WeeklySchedule" (
    "id" VARCHAR(10) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "weekStartDate" TEXT NOT NULL,
    "weekEndDate" TEXT NOT NULL,
    "mondayDate" TEXT NOT NULL,
    "mondayDayType" TEXT NOT NULL,
    "mondayStartTime" TEXT NOT NULL,
    "mondayEndTime" TEXT NOT NULL,
    "tuesdayDate" TEXT NOT NULL,
    "tuesdayDayType" TEXT NOT NULL,
    "tuesdayStartTime" TEXT NOT NULL,
    "tuesdayEndTime" TEXT NOT NULL,
    "wednesdayDate" TEXT NOT NULL,
    "wednesdayDayType" TEXT NOT NULL,
    "wednesdayStartTime" TEXT NOT NULL,
    "wednesdayEndTime" TEXT NOT NULL,
    "thursdayDate" TEXT NOT NULL,
    "thursdayDayType" TEXT NOT NULL,
    "thursdayStartTime" TEXT NOT NULL,
    "thursdayEndTime" TEXT NOT NULL,
    "fridayDate" TEXT NOT NULL,
    "fridayDayType" TEXT NOT NULL,
    "fridayStartTime" TEXT NOT NULL,
    "fridayEndTime" TEXT NOT NULL,
    "saturdayDate" TEXT NOT NULL,
    "saturdayDayType" TEXT NOT NULL,
    "saturdayStartTime" TEXT NOT NULL,
    "saturdayEndTime" TEXT NOT NULL,
    "sundayDate" TEXT NOT NULL,
    "sundayDayType" TEXT NOT NULL,
    "sundayStartTime" TEXT NOT NULL,
    "sundayEndTime" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "managerId" TEXT NOT NULL,
    "driverId" TEXT NOT NULL,

    CONSTRAINT "WeeklySchedule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Messages" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "content" TEXT NOT NULL,
    "from" TEXT NOT NULL,
    "ownerId" TEXT,
    "driverId" TEXT,
    "adminId" TEXT,

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
    "driverId" TEXT,
    "adminId" TEXT,
    "ownerId" TEXT,

    CONSTRAINT "NotifiedMessages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vehicle" (
    "id" SERIAL NOT NULL,
    "driverId" TEXT NOT NULL,
    "vehicleNumber" TEXT,
    "amazonLogo" TEXT,

    CONSTRAINT "Vehicle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Accident" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "driverId" TEXT NOT NULL,
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
CREATE TABLE "_AdminToDriver" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
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
CREATE UNIQUE INDEX "SuperUser_id_key" ON "SuperUser"("id");

-- CreateIndex
CREATE UNIQUE INDEX "SuperUser_email_key" ON "SuperUser"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Owner_id_key" ON "Owner"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Owner_email_key" ON "Owner"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Owner_signUpToken_key" ON "Owner"("signUpToken");

-- CreateIndex
CREATE UNIQUE INDEX "Admin_id_key" ON "Admin"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Admin_email_key" ON "Admin"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Driver_id_key" ON "Driver"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Driver_email_key" ON "Driver"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Driver_transporterId_key" ON "Driver"("transporterId");

-- CreateIndex
CREATE UNIQUE INDEX "Dsp_id_key" ON "Dsp"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Dsp_name_key" ON "Dsp"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Dsp_shortcode_key" ON "Dsp"("shortcode");

-- CreateIndex
CREATE UNIQUE INDEX "Dsp_ownerId_key" ON "Dsp"("ownerId");

-- CreateIndex
CREATE UNIQUE INDEX "WeeklyReport_id_key" ON "WeeklyReport"("id");

-- CreateIndex
CREATE UNIQUE INDEX "WeeklySchedule_id_key" ON "WeeklySchedule"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Vehicle_driverId_key" ON "Vehicle"("driverId");

-- CreateIndex
CREATE UNIQUE INDEX "_AdminToDriver_AB_unique" ON "_AdminToDriver"("A", "B");

-- CreateIndex
CREATE INDEX "_AdminToDriver_B_index" ON "_AdminToDriver"("B");

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
ALTER TABLE "Admin" ADD CONSTRAINT "Admin_dspId_fkey" FOREIGN KEY ("dspId") REFERENCES "Dsp"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Driver" ADD CONSTRAINT "Driver_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "Owner"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Driver" ADD CONSTRAINT "Driver_dspId_fkey" FOREIGN KEY ("dspId") REFERENCES "Dsp"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Dsp" ADD CONSTRAINT "Dsp_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "Owner"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WeeklyReport" ADD CONSTRAINT "WeeklyReport_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "Driver"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WeeklySchedule" ADD CONSTRAINT "WeeklySchedule_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "Owner"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WeeklySchedule" ADD CONSTRAINT "WeeklySchedule_managerId_fkey" FOREIGN KEY ("managerId") REFERENCES "Admin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WeeklySchedule" ADD CONSTRAINT "WeeklySchedule_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "Driver"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Messages" ADD CONSTRAINT "Messages_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "Owner"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Messages" ADD CONSTRAINT "Messages_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "Driver"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Messages" ADD CONSTRAINT "Messages_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "Admin"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NotifiedMessages" ADD CONSTRAINT "NotifiedMessages_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "Owner"("id") ON DELETE SET NULL ON UPDATE CASCADE;

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
ALTER TABLE "_AdminToDriver" ADD FOREIGN KEY ("A") REFERENCES "Admin"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AdminToDriver" ADD FOREIGN KEY ("B") REFERENCES "Driver"("id") ON DELETE CASCADE ON UPDATE CASCADE;

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
