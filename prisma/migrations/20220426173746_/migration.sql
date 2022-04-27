-- DropForeignKey
ALTER TABLE "Device" DROP CONSTRAINT "Device_driverId_fkey";

-- AlterTable
ALTER TABLE "Device" ALTER COLUMN "driverId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Device" ADD CONSTRAINT "Device_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "Driver"("id") ON DELETE SET NULL ON UPDATE CASCADE;
