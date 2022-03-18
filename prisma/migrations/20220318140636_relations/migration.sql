/*
  Warnings:

  - You are about to drop the `_AccidentToCollisionAccident` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_AccidentToCollisionAccident" DROP CONSTRAINT "_AccidentToCollisionAccident_A_fkey";

-- DropForeignKey
ALTER TABLE "_AccidentToCollisionAccident" DROP CONSTRAINT "_AccidentToCollisionAccident_B_fkey";

-- DropTable
DROP TABLE "_AccidentToCollisionAccident";
