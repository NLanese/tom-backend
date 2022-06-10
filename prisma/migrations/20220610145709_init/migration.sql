-- CreateEnum
CREATE TYPE "Role" AS ENUM ('DRIVER', 'MANAGER', 'OWNER', 'SUPERADMIN');

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
    "signUpToken" TEXT,
    "mutedListIds" TEXT[],

    CONSTRAINT "Owner_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Manager" (
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
    "muted" BOOLEAN NOT NULL DEFAULT false,
    "locked" BOOLEAN NOT NULL DEFAULT false,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "notified" BOOLEAN NOT NULL DEFAULT false,
    "resetPasswordToken" TEXT,
    "resetPasswordTokenExpiration" INTEGER,
    "ownerId" TEXT NOT NULL,
    "mutedListIds" TEXT[],
    "dspId" TEXT,

    CONSTRAINT "Manager_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Driver" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "role" "Role" NOT NULL DEFAULT E'DRIVER',
    "token" TEXT,
    "firstname" TEXT NOT NULL,
    "lastname" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phoneNumber" TEXT,
    "password" TEXT,
    "profilePick" JSONB,
    "shifts" JSONB[],
    "transporterId" TEXT,
    "globallyMuted" BOOLEAN NOT NULL DEFAULT false,
    "mutedIds" TEXT[],
    "locked" BOOLEAN NOT NULL DEFAULT false,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "attendence" TEXT,
    "notified" BOOLEAN NOT NULL DEFAULT false,
    "resetPasswordToken" TEXT,
    "resetPasswordTokenExpiration" TEXT,
    "ownerId" TEXT NOT NULL,
    "dspId" TEXT,
    "dspTransporter" TEXT NOT NULL,

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
    "deliveryNotRecievedLimits" JSONB NOT NULL,
    "photoOnDeliveryLimits" JSONB NOT NULL,
    "topCardLimits" INTEGER NOT NULL,
    "smallCardLimits" INTEGER NOT NULL,
    "feedbackNotifications" JSONB NOT NULL,
    "autoSend" JSONB NOT NULL,
    "allDevices" JSONB[],
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
    "rank" INTEGER,
    "tier" TEXT,
    "delivered" INTEGER,
    "keyFocusArea" TEXT,
    "fico" TEXT,
    "seatbeltOffRate" TEXT,
    "speedingEventRate" TEXT,
    "distractionsRate" TEXT,
    "followingDistanceRate" TEXT,
    "signalViolationsRate" TEXT,
    "deliveryCompletionRate" TEXT,
    "deliveredAndRecieved" TEXT,
    "photoOnDelivery" TEXT,
    "customerDeliveryFeedback" TEXT,
    "attendedDeliveryAccuracy" INTEGER,
    "dnr" INTEGER,
    "podOpps" INTEGER,
    "ccOpps" INTEGER,
    "netradyne" JSONB,
    "deliveryAssociate" JSONB,
    "defects" JSONB,
    "hasManyAccidents" JSONB,
    "belongsToTeam" JSONB,
    "attendance" JSONB,
    "productivity" JSONB,
    "driverId" TEXT NOT NULL,
    "dspId" TEXT NOT NULL,

    CONSTRAINT "WeeklyReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Shift" (
    "id" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "dateDsp" TEXT NOT NULL,
    "allDriverShifts" JSONB[],
    "dspId" TEXT NOT NULL,

    CONSTRAINT "Shift_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Chatroom" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "chatroomName" TEXT NOT NULL,
    "guests" JSONB[],
    "mutedIds" TEXT[],
    "chatroomOwner" JSONB NOT NULL,
    "announcementChat" BOOLEAN NOT NULL DEFAULT false,
    "driverJoinOnSignUp" BOOLEAN NOT NULL DEFAULT false,
    "managerJoinOnSignUp" BOOLEAN NOT NULL DEFAULT true,
    "ownerId" TEXT,

    CONSTRAINT "Chatroom_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Messages" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "content" TEXT NOT NULL,
    "sentAt" TEXT,
    "from" JSONB NOT NULL,
    "visable" BOOLEAN NOT NULL DEFAULT true,
    "reported" BOOLEAN NOT NULL DEFAULT false,
    "reportedBy" JSONB,
    "chatroomId" TEXT NOT NULL,
    "ownerId" TEXT,
    "managerId" TEXT,
    "driverId" TEXT,

    CONSTRAINT "Messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AnnouncementMessages" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sentAt" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "from" JSONB NOT NULL,
    "readBy" JSONB[],
    "chatroomId" TEXT NOT NULL,
    "ownerId" TEXT,
    "dspId" TEXT,
    "managerId" TEXT,

    CONSTRAINT "AnnouncementMessages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NotifiedMessages" (
    "id" SERIAL NOT NULL,
    "createdAt" TEXT NOT NULL,
    "sentAt" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "readAt" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "from" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "driverId" TEXT,
    "dspId" TEXT,

    CONSTRAINT "NotifiedMessages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Accident" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "time" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "accident_report" JSONB,
    "police_report" JSONB,
    "before_accident_report" JSONB,
    "selfDamage" JSONB,
    "weather_and_distractions" JSONB,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "filled" BOOLEAN NOT NULL DEFAULT false,
    "driverId" TEXT NOT NULL,
    "dspId" TEXT NOT NULL,

    CONSTRAINT "Accident_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PropertyAccident" (
    "id" TEXT NOT NULL,
    "contact_info" JSONB NOT NULL,
    "damage_report" JSONB NOT NULL,
    "defective_equip" TEXT[],
    "safety_equip" TEXT[],
    "package_report" JSONB,
    "specific_pictures" JSONB NOT NULL,
    "extra_info" TEXT,
    "types_of_damage" JSONB NOT NULL,
    "accidentId" TEXT NOT NULL,

    CONSTRAINT "PropertyAccident_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CollisionAccident" (
    "id" TEXT NOT NULL,
    "specific_pictures" JSONB NOT NULL,
    "contact_info" JSONB NOT NULL,
    "extra_info" TEXT,
    "collision_report" JSONB NOT NULL,
    "accidentId" TEXT NOT NULL,

    CONSTRAINT "CollisionAccident_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InjuryAccident" (
    "id" TEXT NOT NULL,
    "contact_info" JSONB NOT NULL,
    "extra_info" TEXT,
    "injured_areas" JSONB NOT NULL,
    "injury_report" JSONB NOT NULL,
    "pain_level" TEXT NOT NULL,
    "specific_pictures" JSONB NOT NULL,
    "accidentId" TEXT NOT NULL,
    "collisionAccidentId" TEXT,

    CONSTRAINT "InjuryAccident_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SelfInjuryAccident" (
    "id" TEXT NOT NULL,
    "animal_report" JSONB,
    "injuries" JSONB NOT NULL,
    "injury_report" JSONB NOT NULL,
    "extra_info" TEXT,
    "specific_pictures" JSONB NOT NULL,
    "accidentId" TEXT NOT NULL,

    CONSTRAINT "SelfInjuryAccident_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Device" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "number" TEXT,
    "name" TEXT,
    "type" TEXT,
    "deviceIndex" INTEGER,
    "driverId" TEXT,
    "dspId" TEXT NOT NULL,

    CONSTRAINT "Device_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_DriverToManager" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_ChatroomToManager" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_ChatroomToDriver" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
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
CREATE UNIQUE INDEX "Manager_id_key" ON "Manager"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Manager_email_key" ON "Manager"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Driver_id_key" ON "Driver"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Driver_email_key" ON "Driver"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Driver_resetPasswordToken_key" ON "Driver"("resetPasswordToken");

-- CreateIndex
CREATE UNIQUE INDEX "Driver_dspTransporter_key" ON "Driver"("dspTransporter");

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
CREATE UNIQUE INDEX "Shift_id_key" ON "Shift"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Shift_dateDsp_key" ON "Shift"("dateDsp");

-- CreateIndex
CREATE UNIQUE INDEX "Chatroom_id_key" ON "Chatroom"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Accident_id_key" ON "Accident"("id");

-- CreateIndex
CREATE UNIQUE INDEX "PropertyAccident_id_key" ON "PropertyAccident"("id");

-- CreateIndex
CREATE UNIQUE INDEX "CollisionAccident_id_key" ON "CollisionAccident"("id");

-- CreateIndex
CREATE UNIQUE INDEX "InjuryAccident_id_key" ON "InjuryAccident"("id");

-- CreateIndex
CREATE UNIQUE INDEX "SelfInjuryAccident_id_key" ON "SelfInjuryAccident"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Device_id_key" ON "Device"("id");

-- CreateIndex
CREATE UNIQUE INDEX "_DriverToManager_AB_unique" ON "_DriverToManager"("A", "B");

-- CreateIndex
CREATE INDEX "_DriverToManager_B_index" ON "_DriverToManager"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ChatroomToManager_AB_unique" ON "_ChatroomToManager"("A", "B");

-- CreateIndex
CREATE INDEX "_ChatroomToManager_B_index" ON "_ChatroomToManager"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ChatroomToDriver_AB_unique" ON "_ChatroomToDriver"("A", "B");

-- CreateIndex
CREATE INDEX "_ChatroomToDriver_B_index" ON "_ChatroomToDriver"("B");

-- AddForeignKey
ALTER TABLE "Manager" ADD CONSTRAINT "Manager_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "Owner"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Manager" ADD CONSTRAINT "Manager_dspId_fkey" FOREIGN KEY ("dspId") REFERENCES "Dsp"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Driver" ADD CONSTRAINT "Driver_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "Owner"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Driver" ADD CONSTRAINT "Driver_dspId_fkey" FOREIGN KEY ("dspId") REFERENCES "Dsp"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Dsp" ADD CONSTRAINT "Dsp_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "Owner"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WeeklyReport" ADD CONSTRAINT "WeeklyReport_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "Driver"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WeeklyReport" ADD CONSTRAINT "WeeklyReport_dspId_fkey" FOREIGN KEY ("dspId") REFERENCES "Dsp"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Shift" ADD CONSTRAINT "Shift_dspId_fkey" FOREIGN KEY ("dspId") REFERENCES "Dsp"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chatroom" ADD CONSTRAINT "Chatroom_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "Owner"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Messages" ADD CONSTRAINT "Messages_chatroomId_fkey" FOREIGN KEY ("chatroomId") REFERENCES "Chatroom"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Messages" ADD CONSTRAINT "Messages_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "Owner"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Messages" ADD CONSTRAINT "Messages_managerId_fkey" FOREIGN KEY ("managerId") REFERENCES "Manager"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Messages" ADD CONSTRAINT "Messages_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "Driver"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnnouncementMessages" ADD CONSTRAINT "AnnouncementMessages_chatroomId_fkey" FOREIGN KEY ("chatroomId") REFERENCES "Chatroom"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnnouncementMessages" ADD CONSTRAINT "AnnouncementMessages_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "Owner"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnnouncementMessages" ADD CONSTRAINT "AnnouncementMessages_dspId_fkey" FOREIGN KEY ("dspId") REFERENCES "Dsp"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnnouncementMessages" ADD CONSTRAINT "AnnouncementMessages_managerId_fkey" FOREIGN KEY ("managerId") REFERENCES "Manager"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NotifiedMessages" ADD CONSTRAINT "NotifiedMessages_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "Driver"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NotifiedMessages" ADD CONSTRAINT "NotifiedMessages_dspId_fkey" FOREIGN KEY ("dspId") REFERENCES "Dsp"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Accident" ADD CONSTRAINT "Accident_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "Driver"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Accident" ADD CONSTRAINT "Accident_dspId_fkey" FOREIGN KEY ("dspId") REFERENCES "Dsp"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PropertyAccident" ADD CONSTRAINT "PropertyAccident_accidentId_fkey" FOREIGN KEY ("accidentId") REFERENCES "Accident"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CollisionAccident" ADD CONSTRAINT "CollisionAccident_accidentId_fkey" FOREIGN KEY ("accidentId") REFERENCES "Accident"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InjuryAccident" ADD CONSTRAINT "InjuryAccident_accidentId_fkey" FOREIGN KEY ("accidentId") REFERENCES "Accident"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InjuryAccident" ADD CONSTRAINT "InjuryAccident_collisionAccidentId_fkey" FOREIGN KEY ("collisionAccidentId") REFERENCES "CollisionAccident"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SelfInjuryAccident" ADD CONSTRAINT "SelfInjuryAccident_accidentId_fkey" FOREIGN KEY ("accidentId") REFERENCES "Accident"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Device" ADD CONSTRAINT "Device_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "Driver"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Device" ADD CONSTRAINT "Device_dspId_fkey" FOREIGN KEY ("dspId") REFERENCES "Dsp"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DriverToManager" ADD FOREIGN KEY ("A") REFERENCES "Driver"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DriverToManager" ADD FOREIGN KEY ("B") REFERENCES "Manager"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ChatroomToManager" ADD FOREIGN KEY ("A") REFERENCES "Chatroom"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ChatroomToManager" ADD FOREIGN KEY ("B") REFERENCES "Manager"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ChatroomToDriver" ADD FOREIGN KEY ("A") REFERENCES "Chatroom"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ChatroomToDriver" ADD FOREIGN KEY ("B") REFERENCES "Driver"("id") ON DELETE CASCADE ON UPDATE CASCADE;
