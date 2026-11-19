-- AlterTable
ALTER TABLE "Note" ADD COLUMN     "isTrash" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Passwords" ADD COLUMN     "isTrash" BOOLEAN NOT NULL DEFAULT false;
