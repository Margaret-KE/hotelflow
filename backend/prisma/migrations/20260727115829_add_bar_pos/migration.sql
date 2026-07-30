-- CreateEnum
CREATE TYPE "BarOrderStatus" AS ENUM ('OPEN', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "BarPaymentStatus" AS ENUM ('UNPAID', 'PARTIAL', 'PAID', 'REFUNDED');

-- CreateTable
CREATE TABLE "BarCategory" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BarCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BarMenuItem" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "price" DECIMAL(10,2) NOT NULL,
    "imageUrl" TEXT,
    "available" BOOLEAN NOT NULL DEFAULT true,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BarMenuItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BarOrder" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "guestId" TEXT,
    "reservationId" TEXT,
    "createdById" TEXT NOT NULL,
    "orderNumber" TEXT NOT NULL,
    "status" "BarOrderStatus" NOT NULL DEFAULT 'OPEN',
    "paymentStatus" "BarPaymentStatus" NOT NULL DEFAULT 'UNPAID',
    "subtotal" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "tax" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "serviceCharge" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "discount" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "total" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "notes" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BarOrder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BarOrderItem" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "menuItemId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unitPrice" DECIMAL(10,2) NOT NULL,
    "total" DECIMAL(10,2) NOT NULL,
    "notes" TEXT,
    "status" "KitchenItemStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BarOrderItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BarPayment" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "receivedById" TEXT NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "method" "PaymentMethod" NOT NULL,
    "status" "PaymentStatus" NOT NULL DEFAULT 'COMPLETED',
    "reference" TEXT,
    "transactionId" TEXT,
    "notes" TEXT,
    "receiptNumber" TEXT,
    "paidAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BarPayment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BarCategory_tenantId_name_key" ON "BarCategory"("tenantId", "name");

-- CreateIndex
CREATE INDEX "BarMenuItem_tenantId_idx" ON "BarMenuItem"("tenantId");

-- CreateIndex
CREATE INDEX "BarMenuItem_categoryId_idx" ON "BarMenuItem"("categoryId");

-- CreateIndex
CREATE INDEX "BarOrder_tenantId_idx" ON "BarOrder"("tenantId");

-- CreateIndex
CREATE INDEX "BarOrder_status_idx" ON "BarOrder"("status");

-- CreateIndex
CREATE UNIQUE INDEX "BarOrder_tenantId_orderNumber_key" ON "BarOrder"("tenantId", "orderNumber");

-- CreateIndex
CREATE INDEX "BarOrderItem_orderId_idx" ON "BarOrderItem"("orderId");

-- CreateIndex
CREATE INDEX "BarOrderItem_menuItemId_idx" ON "BarOrderItem"("menuItemId");

-- CreateIndex
CREATE INDEX "BarOrderItem_status_idx" ON "BarOrderItem"("status");

-- CreateIndex
CREATE INDEX "BarPayment_tenantId_idx" ON "BarPayment"("tenantId");

-- CreateIndex
CREATE INDEX "BarPayment_orderId_idx" ON "BarPayment"("orderId");

-- CreateIndex
CREATE INDEX "BarPayment_paidAt_idx" ON "BarPayment"("paidAt");

-- AddForeignKey
ALTER TABLE "BarCategory" ADD CONSTRAINT "BarCategory_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BarMenuItem" ADD CONSTRAINT "BarMenuItem_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BarMenuItem" ADD CONSTRAINT "BarMenuItem_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "BarCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BarOrder" ADD CONSTRAINT "BarOrder_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BarOrder" ADD CONSTRAINT "BarOrder_guestId_fkey" FOREIGN KEY ("guestId") REFERENCES "Guest"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BarOrder" ADD CONSTRAINT "BarOrder_reservationId_fkey" FOREIGN KEY ("reservationId") REFERENCES "Reservation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BarOrder" ADD CONSTRAINT "BarOrder_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BarOrderItem" ADD CONSTRAINT "BarOrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "BarOrder"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BarOrderItem" ADD CONSTRAINT "BarOrderItem_menuItemId_fkey" FOREIGN KEY ("menuItemId") REFERENCES "BarMenuItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BarPayment" ADD CONSTRAINT "BarPayment_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BarPayment" ADD CONSTRAINT "BarPayment_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "BarOrder"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BarPayment" ADD CONSTRAINT "BarPayment_receivedById_fkey" FOREIGN KEY ("receivedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
