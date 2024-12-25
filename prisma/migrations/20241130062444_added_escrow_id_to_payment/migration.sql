/*
  Warnings:

  - A unique constraint covering the columns `[escrowId]` on the table `Payment` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `escrowId` to the `Payment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Payment" ADD COLUMN     "escrowId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Payment_escrowId_key" ON "Payment"("escrowId");

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_escrowId_fkey" FOREIGN KEY ("escrowId") REFERENCES "Escrow"("id") ON DELETE CASCADE ON UPDATE CASCADE;
