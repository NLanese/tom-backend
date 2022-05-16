/*
  Warnings:

  - Added the required column `readAt` to the `NotifiedMessages` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "NotifiedMessages" ADD COLUMN     "readAt" TEXT NOT NULL;
