import {
  Prisma,
  RestaurantOrderStatus,
  RestaurantPaymentStatus,
} from "@prisma/client";

import prisma from "../../../lib/prisma";

import ApiError from "../../../utils/ApiError";

import { generateOrderNumber } from "../../../utils/generateOrderNumber";

import {
  CreateRestaurantOrderRequest,
  UpdateRestaurantOrderRequest,
} from "./order.types";

export async function getOrders(
  tenantId: string
) {
  return prisma.restaurantOrder.findMany({
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
    await prisma.restaurantOrder.findFirst({
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
      "Restaurant order not found"
    );
  }

  return order;
}

export async function createOrder(
  tenantId: string,
  userId: string,
  data: CreateRestaurantOrderRequest
) {
  return prisma.$transaction(async (tx) => {
    if (data.guestId) {
      const guest = await tx.guest.findFirst({
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
        "REST",
        tenantId
      );

    const order =
      await tx.restaurantOrder.create({
        data: {
          tenantId,

          guestId: data.guestId,

          reservationId:
            data.reservationId,

          createdById: userId,

          orderNumber,

          status:
            RestaurantOrderStatus.OPEN,

          paymentStatus:
            RestaurantPaymentStatus.UNPAID,

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
          "RESTAURANT_ORDER_CREATED",

        entity:
          "RESTAURANT_ORDER",

        entityId: order.id,

        description: `Created restaurant order ${order.orderNumber}.`,
      },
    });

    return tx.restaurantOrder.findUnique({
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
  const order = await getOrderById(
    tenantId,
    orderId
  );

  return prisma.restaurantOrder.update({
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
  const order = await getOrderById(
    tenantId,
    orderId
  );

  if (
    order.status ===
      RestaurantOrderStatus.COMPLETED ||
    order.status ===
      RestaurantOrderStatus.CANCELLED
  ) {
    throw new ApiError(
      400,
      "Order cannot be cancelled."
    );
  }

  const cancelled =
    await prisma.restaurantOrder.update({
      where: {
        id: order.id,
      },
      data: {
        status:
          RestaurantOrderStatus.CANCELLED,
      },
    });

  await prisma.auditLog.create({
    data: {
      userId,
      action:
        "RESTAURANT_ORDER_CANCELLED",
      entity:
        "RESTAURANT_ORDER",
      entityId: order.id,
      description: `Cancelled restaurant order ${order.orderNumber}.`,
    },
  });

  return cancelled;
}