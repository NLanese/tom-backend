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

-- CreateIndex
CREATE UNIQUE INDEX "SelfInjuryAccident_id_key" ON "SelfInjuryAccident"("id");

-- AddForeignKey
ALTER TABLE "SelfInjuryAccident" ADD CONSTRAINT "SelfInjuryAccident_accidentId_fkey" FOREIGN KEY ("accidentId") REFERENCES "Accident"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
