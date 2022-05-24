/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `Driver` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Driver_email_key" ON "Driver"("email");
