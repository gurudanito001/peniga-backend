-- CreateTable
CREATE TABLE "TempAccount" (
    "id" TEXT NOT NULL,
    "contractId" TEXT NOT NULL,
    "accountDetails" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TempAccount_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TempAccount_contractId_key" ON "TempAccount"("contractId");

-- AddForeignKey
ALTER TABLE "TempAccount" ADD CONSTRAINT "TempAccount_contractId_fkey" FOREIGN KEY ("contractId") REFERENCES "Contract"("id") ON DELETE CASCADE ON UPDATE CASCADE;
