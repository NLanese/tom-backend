-- AlterTable
ALTER TABLE "Accident" ALTER COLUMN "accident_report" DROP NOT NULL,
ALTER COLUMN "has_logo" DROP NOT NULL,
ALTER COLUMN "police_report" DROP NOT NULL,
ALTER COLUMN "before_accident_report" DROP NOT NULL,
ALTER COLUMN "selfDamage" DROP NOT NULL,
ALTER COLUMN "weather_and_distractions" DROP NOT NULL;
