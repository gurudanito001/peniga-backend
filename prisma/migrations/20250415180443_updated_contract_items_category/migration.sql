/*
  Warnings:

  - The `category` column on the `ContractItem` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "ProductCategory" AS ENUM ('techGadgets', 'automobiles', 'realEstate');

-- AlterTable
ALTER TABLE "ContractItem" DROP COLUMN "category",
ADD COLUMN     "category" "ProductCategory";
