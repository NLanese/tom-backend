-- AlterTable
ALTER TABLE "Accident" ALTER COLUMN "using_safety" DROP NOT NULL,
ALTER COLUMN "safety_failed" DROP NOT NULL,
ALTER COLUMN "number_package_carried" DROP NOT NULL,
ALTER COLUMN "safety_equipment_used" DROP NOT NULL,
ALTER COLUMN "police_report_information" DROP NOT NULL,
ALTER COLUMN "police_report_photos" DROP NOT NULL,
ALTER COLUMN "vehicle_number" DROP NOT NULL,
ALTER COLUMN "amazon_logo" DROP NOT NULL;
