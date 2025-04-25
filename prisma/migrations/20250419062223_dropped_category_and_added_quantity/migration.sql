/*
  Warnings:

  - You are about to drop the column `category` on the `ContractItem` table. All the data in the column will be lost.

*/
-- AlterEnum
ALTER TYPE "EscrowFeePayers" ADD VALUE 'split';

-- AlterTable
ALTER TABLE "ContractItem" DROP COLUMN "category",
ADD COLUMN     "quantity" INTEGER NOT NULL DEFAULT 1;
