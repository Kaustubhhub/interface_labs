-- CreateTable
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "total" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "Mtr" (
    "id" TEXT NOT NULL,
    "invoiceDate" TEXT NOT NULL,
    "transactionType" TEXT NOT NULL,
    "shipmentDate" TEXT NOT NULL,
    "orderDate" TEXT NOT NULL,
    "shipmentItemId" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "invoiceAmount" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Payment_id_key" ON "Payment"("id");

-- CreateIndex
CREATE INDEX "Payment_orderId_idx" ON "Payment"("orderId");

-- CreateIndex
CREATE UNIQUE INDEX "Mtr_id_key" ON "Mtr"("id");

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Mtr"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
