/*
  Warnings:

  - Added the required column `iv` to the `Note` table without a default value. This is not possible if the table is not empty.
  - Added the required column `iv` to the `Passwords` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Note" ADD COLUMN     "iv" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Passwords" ADD COLUMN     "iv" TEXT NOT NULL;
