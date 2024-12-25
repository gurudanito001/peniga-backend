-- CreateEnum
CREATE TYPE "ContractStage" AS ENUM ('CREATED', 'AGREED', 'PAID', 'DELIVERED', 'COMPLETED');

-- AlterTable
ALTER TABLE "Contract" ADD COLUMN     "stage" "ContractStage" NOT NULL DEFAULT 'CREATED';
