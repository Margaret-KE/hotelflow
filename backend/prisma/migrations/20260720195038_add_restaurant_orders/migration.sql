-- CreateEnum
CREATE TYPE "RestaurantOrderStatus" AS ENUM ('OPEN', 'SENT_TO_KITCHEN', 'PREPARING', 'READY', 'SERVED', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "RestaurantPaymentStatus" AS ENUM ('UNPAID', 'PARTIAL', 'PAID', 'REFUNDED');

-- CreateEnum
CREATE TYPE "KitchenItemStatus" AS ENUM ('PENDING', 'PREPARING', 'READY', 'SERVED', 'CANCELLED');

-- CreateTable
CREATE TABLE "RestaurantOrder" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "guestId" TEXT,
    "reservationId" TEXT,
    "createdById" TEXT NOT NULL,
    "orderNumber" TEXT NOT NULL,
    "status" "RestaurantOrderStatus" NOT NULL DEFAULT 'OPEN',
    "paymentStatus" "RestaurantPaymentStatus" NOT NULL DEFAULT 'UNPAID',
    "subtotal" DECIMAL(10,2) NOT NULL,
    "tax" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "serviceCharge" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "discount" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "total" DECIMAL(10,2) NOT NULL,
    "notes" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RestaurantOrder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RestaurantOrderItem" (
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

    CONSTRAINT "RestaurantOrderItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "RestaurantOrder_tenantId_idx" ON "RestaurantOrder"("tenantId");

-- CreateIndex
CREATE INDEX "RestaurantOrder_guestId_idx" ON "RestaurantOrder"("guestId");

-- CreateIndex
CREATE INDEX "RestaurantOrder_reservationId_idx" ON "RestaurantOrder"("reservationId");

-- CreateIndex
CREATE INDEX "RestaurantOrder_status_idx" ON "RestaurantOrder"("status");

-- CreateIndex
CREATE INDEX "RestaurantOrder_paymentStatus_idx" ON "RestaurantOrder"("paymentStatus");

-- CreateIndex
CREATE UNIQUE INDEX "RestaurantOrder_tenantId_orderNumber_key" ON "RestaurantOrder"("tenantId", "orderNumber");

-- CreateIndex
CREATE INDEX "RestaurantOrderItem_orderId_idx" ON "RestaurantOrderItem"("orderId");

-- CreateIndex
CREATE INDEX "RestaurantOrderItem_menuItemId_idx" ON "RestaurantOrderItem"("menuItemId");

-- CreateIndex
CREATE INDEX "RestaurantOrderItem_status_idx" ON "RestaurantOrderItem"("status");

-- AddForeignKey
ALTER TABLE "RestaurantOrder" ADD CONSTRAINT "RestaurantOrder_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RestaurantOrder" ADD CONSTRAINT "RestaurantOrder_guestId_fkey" FOREIGN KEY ("guestId") REFERENCES "Guest"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RestaurantOrder" ADD CONSTRAINT "RestaurantOrder_reservationId_fkey" FOREIGN KEY ("reservationId") REFERENCES "Reservation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RestaurantOrder" ADD CONSTRAINT "RestaurantOrder_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RestaurantOrderItem" ADD CONSTRAINT "RestaurantOrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "RestaurantOrder"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RestaurantOrderItem" ADD CONSTRAINT "RestaurantOrderItem_menuItemId_fkey" FOREIGN KEY ("menuItemId") REFERENCES "MenuItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
