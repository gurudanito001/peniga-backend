/*
  Warnings:

  - The `agreementTerms` column on the `Contract` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Attachment" ALTER COLUMN "contractId" DROP NOT NULL,
ALTER COLUMN "disputeId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Contract" DROP COLUMN "agreementTerms",
ADD COLUMN     "agreementTerms" JSONB;
