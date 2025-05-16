-- AlterTable
ALTER TABLE "Character" ALTER COLUMN "environment" DROP NOT NULL;

-- AlterTable
ALTER TABLE "ChatSession" ADD COLUMN     "environment" TEXT;
