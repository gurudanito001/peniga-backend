/*
  Warnings:

  - Added the required column `toBeInformed` to the `Contract` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Contract" ADD COLUMN     "toBeInformed" JSONB NOT NULL;
