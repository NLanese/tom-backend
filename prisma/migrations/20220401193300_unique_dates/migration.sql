/*
  Warnings:

  - A unique constraint covering the columns `[date]` on the table `Shift` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `date` on the `Shift` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Shift" DROP COLUMN "date",
ADD COLUMN     "date" JSONB NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Shift_date_key" ON "Shift"("date");
