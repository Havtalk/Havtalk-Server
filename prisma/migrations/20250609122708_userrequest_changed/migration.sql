-- CreateEnum
CREATE TYPE "RequestStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- AlterTable
ALTER TABLE "UserRequest" ADD COLUMN     "status" "RequestStatus" NOT NULL DEFAULT 'PENDING';
