/*
  Warnings:

  - You are about to drop the column `benefactorId` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `beneficiaryId` on the `Transaction` table. All the data in the column will be lost.
  - Added the required column `senderId` to the `Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_benefactorId_fkey";

-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_beneficiaryId_fkey";

-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "benefactorId",
DROP COLUMN "beneficiaryId",
ADD COLUMN     "senderId" TEXT NOT NULL,
ALTER COLUMN "transactionData" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
