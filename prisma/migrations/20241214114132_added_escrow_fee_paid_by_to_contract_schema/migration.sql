/*
  Warnings:

  - Added the required column `escrowFeePaidBy` to the `Contract` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "EscrowFeePayers" AS ENUM ('buyer', 'seller');

-- AlterTable
ALTER TABLE "Contract" ADD COLUMN     "escrowFeePaidBy" "EscrowFeePayers" NOT NULL;
