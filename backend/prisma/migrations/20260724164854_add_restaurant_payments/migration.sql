-- CreateEnum
CREATE TYPE "RestaurantPaymentMethod" AS ENUM ('CASH', 'MPESA', 'CARD', 'BANK_TRANSFER');

-- CreateTable
CREATE TABLE "RestaurantPayment" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "receivedById" TEXT NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "method" "RestaurantPaymentMethod" NOT NULL,
    "status" "RestaurantPaymentStatus" NOT NULL DEFAULT 'PAID',
    "reference" TEXT,
    "transactionId" TEXT,
    "notes" TEXT,
    "receiptNumber" TEXT,
    "paidAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RestaurantPayment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "RestaurantPayment_tenantId_idx" ON "RestaurantPayment"("tenantId");

-- CreateIndex
CREATE INDEX "RestaurantPayment_orderId_idx" ON "RestaurantPayment"("orderId");

-- CreateIndex
CREATE INDEX "RestaurantPayment_receivedById_idx" ON "RestaurantPayment"("receivedById");

-- CreateIndex
CREATE INDEX "RestaurantPayment_method_idx" ON "RestaurantPayment"("method");

-- CreateIndex
CREATE INDEX "RestaurantPayment_status_idx" ON "RestaurantPayment"("status");

-- AddForeignKey
ALTER TABLE "RestaurantPayment" ADD CONSTRAINT "RestaurantPayment_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RestaurantPayment" ADD CONSTRAINT "RestaurantPayment_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "RestaurantOrder"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RestaurantPayment" ADD CONSTRAINT "RestaurantPayment_receivedById_fkey" FOREIGN KEY ("receivedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
