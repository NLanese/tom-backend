/*
  Warnings:

  - Added the required column `types_of_damage` to the `PropertyAccident` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PropertyAccident" ADD COLUMN     "types_of_damage" JSONB NOT NULL;
