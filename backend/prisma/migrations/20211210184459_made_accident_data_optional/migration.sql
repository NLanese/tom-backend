-- AlterTable
ALTER TABLE "Accident" ALTER COLUMN "using_safety" DROP NOT NULL,
ALTER COLUMN "safety_failed" DROP NOT NULL,
ALTER COLUMN "number_package_carried" DROP NOT NULL,
ALTER COLUMN "safety_equipment_used" DROP NOT NULL,
ALTER COLUMN "failed_safety" DROP NOT NULL;
