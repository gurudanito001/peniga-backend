/*
  Warnings:

  - You are about to drop the column `disputeId` on the `Contract` table. All the data in the column will be lost.
  - You are about to drop the column `escrowId` on the `Contract` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Contract_escrowId_key";

-- AlterTable
ALTER TABLE "Contract" DROP COLUMN "disputeId",
DROP COLUMN "escrowId",
ALTER COLUMN "currency" SET DEFAULT 'NGN';
