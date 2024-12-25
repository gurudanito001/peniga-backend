/*
  Warnings:

  - The `category` column on the `Payment` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "PaymentCategory" AS ENUM ('REFUNDED', 'DISBURSED');

-- AlterTable
ALTER TABLE "Attachment" ADD COLUMN     "fileType" TEXT;

-- AlterTable
ALTER TABLE "Payment" DROP COLUMN "category",
ADD COLUMN     "category" "PaymentCategory" DEFAULT 'DISBURSED';
