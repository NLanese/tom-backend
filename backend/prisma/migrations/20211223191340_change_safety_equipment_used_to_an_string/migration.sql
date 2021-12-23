-- AlterTable
ALTER TABLE "Accident" ALTER COLUMN "safety_equipment_used" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Admin" ADD COLUMN     "adminSignUpToken" TEXT,
ADD COLUMN     "resetPasswordToken" TEXT,
ADD COLUMN     "resetPasswordTokenExpiration" INTEGER;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "locked" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "SuperUser" (
    "id" SERIAL NOT NULL,
    "role" "Role" NOT NULL DEFAULT E'SUPERADMIN',
    "firstname" TEXT NOT NULL,
    "lastname" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,

    CONSTRAINT "SuperUser_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SuperUser_username_key" ON "SuperUser"("username");

-- CreateIndex
CREATE UNIQUE INDEX "SuperUser_email_key" ON "SuperUser"("email");
