-- AlterTable
ALTER TABLE "Driver" ADD COLUMN     "shifts" JSONB[];

-- CreateTable
CREATE TABLE "Shift" (
    "id" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "allDevices" JSONB[],

    CONSTRAINT "Shift_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Shift_id_key" ON "Shift"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Shift_date_key" ON "Shift"("date");
