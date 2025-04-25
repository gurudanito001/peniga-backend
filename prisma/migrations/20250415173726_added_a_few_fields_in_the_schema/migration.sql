/*
  Warnings:

  - Changed the type of `inspectionPeriod` on the `Contract` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('USER', 'ADMIN', 'SUPPORT');

-- AlterTable
ALTER TABLE "Contract" DROP COLUMN "inspectionPeriod",
ADD COLUMN     "inspectionPeriod" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "ContractItem" ADD COLUMN     "imageUrl" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "role" "UserRole" NOT NULL DEFAULT 'USER';
