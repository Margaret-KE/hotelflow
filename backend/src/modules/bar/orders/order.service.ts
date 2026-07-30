import {
  Prisma,
  BarOrderStatus,
  BarPaymentStatus,
} from "@prisma/client";

import prisma from "../../../lib/prisma";

import ApiError from "../../../utils/ApiError";

import { generateOrderNumber } from "../../../utils/generateOrderNumber";

import {
  CreateBarOrderRequest,
  UpdateBarOrderRequest,
} from "./order.types";

export async function getOrders(
  tenantId: string
) {
  return prisma.barOrder.findMany({
    where: {
      tenantId,
      isActive: true,
    },

    include: {
      guest: true,

      reservation: true,

      items: {
        include: {
          menuItem: true,
        },
      },
    },

    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getOrderById(
  tenantId: string,
  orderId: string
) {
  const order =
    await prisma.barOrder.findFirst({
      where: {
        id: orderId,
        tenantId,
        isActive: true,
      },

      include: {
        guest: true,

        reservation: true,

        items: {
          include: {
            menuItem: true,
          },
        },
      },
    });

  if (!order) {
    throw new ApiError(
      404,
      "Bar order not found"
    );
  }

  return order;
}

export async function createOrder(
  tenantId: string,
  userId: string,
  data: CreateBarOrderRequest
) {
  return prisma.$transaction(async (tx) => {
    if (data.guestId) {
      const guest =
        await tx.guest.findFirst({
          where: {
            id: data.guestId,
            tenantId,
            isActive: true,
          },
        });

      if (!guest) {
        throw new ApiError(
          404,
          "Guest not found"
        );
      }
    }

    if (data.reservationId) {
      const reservation =
        await tx.reservation.findFirst({
          where: {
            id: data.reservationId,
            tenantId,
            isActive: true,
          },
        });

      if (!reservation) {
        throw new ApiError(
          404,
          "Reservation not found"
        );
      }
    }

    const orderNumber =
      await generateOrderNumber(
        "BAR",
        tenantId
      );

    const order =
      await tx.barOrder.create({
        data: {
          tenantId,

          guestId: data.guestId,

          reservationId:
            data.reservationId,

          createdById: userId,

          orderNumber,

          status:
            BarOrderStatus.OPEN,

          paymentStatus:
            BarPaymentStatus.UNPAID,

          subtotal:
            new Prisma.Decimal(0),

          tax:
            new Prisma.Decimal(0),

          serviceCharge:
            new Prisma.Decimal(0),

          discount:
            new Prisma.Decimal(0),

          total:
            new Prisma.Decimal(0),

          notes: data.notes,
        },
      });

    await tx.auditLog.create({
      data: {
        userId,

        action:
          "BAR_ORDER_CREATED",

        entity:
          "BAR_ORDER",

        entityId: order.id,

        description: `Created bar order ${order.orderNumber}.`,
      },
    });

    return tx.barOrder.findUnique({
      where: {
        id: order.id,
      },

      include: {
        guest: true,

        reservation: true,

        items: true,
      },
    });
  });
}

export async function updateOrderNotes(
  tenantId: string,
  orderId: string,
  notes?: string
) {
  const order =
    await getOrderById(
      tenantId,
      orderId
    );

  return prisma.barOrder.update({
    where: {
      id: order.id,
    },
    data: {
      notes,
    },
  });
}

export async function cancelOrder(
  tenantId: string,
  userId: string,
  orderId: string
) {
  const order =
    await getOrderById(
      tenantId,
      orderId
    );

  if (
    order.status ===
      BarOrderStatus.COMPLETED ||
    order.status ===
      BarOrderStatus.CANCELLED
  ) {
    throw new ApiError(
      400,
      "Order cannot be cancelled."
    );
  }

  const cancelled =
    await prisma.barOrder.update({
      where: {
        id: order.id,
      },
      data: {
        status:
          BarOrderStatus.CANCELLED,
      },
    });

  await prisma.auditLog.create({
    data: {
      userId,
      action:
        "BAR_ORDER_CANCELLED",
      entity:
        "BAR_ORDER",
      entityId: order.id,
      description: `Cancelled bar order ${order.orderNumber}.`,
    },
  });

  return cancelled;
}