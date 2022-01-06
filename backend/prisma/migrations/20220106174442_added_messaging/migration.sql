-- AlterTable
ALTER TABLE "Admin" ADD COLUMN     "notified" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Driver" ADD COLUMN     "notified" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "profile_Pick" SET DATA TYPE JSONB,
ALTER COLUMN "attendance" SET DATA TYPE JSONB,
ALTER COLUMN "productivity" SET DATA TYPE JSONB;

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

    CONSTRAINT "NotifiedMessages_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "NotifiedMessages" ADD CONSTRAINT "NotifiedMessages_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "Driver"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NotifiedMessages" ADD CONSTRAINT "NotifiedMessages_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "Admin"("id") ON DELETE SET NULL ON UPDATE CASCADE;
