-- AlterTable
ALTER TABLE "Mtr" ALTER COLUMN "shipmentItemId" SET DATA TYPE BIGINT,
ALTER COLUMN "invoiceAmount" SET DATA TYPE BIGINT;

-- AlterTable
ALTER TABLE "Payment" ALTER COLUMN "total" SET DATA TYPE BIGINT;
