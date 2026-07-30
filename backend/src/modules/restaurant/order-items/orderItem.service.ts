import { Prisma } from "@prisma/client";

import prisma from "../../../lib/prisma";

import ApiError from "../../../utils/ApiError";

import {
  CreateRestaurantOrderItemRequest,
  UpdateRestaurantOrderItemRequest
} from "./orderItem.types";

async function recalculateOrderTotals(
  tx: Prisma.TransactionClient,
  orderId: string
) {
  const orderItems =
    await tx.barOrderItem.findMany({
      where: {
        orderId,
      },
    });

  const subtotal = orderItems.reduce(
    (sum, item) => sum.add(item.total),
    new Prisma.Decimal(0)
  );

  const order =
    await tx.restaurantOrder.findUnique({
      where: {
        id: orderId,
      },
    });

  if (!order) {
    throw new ApiError(
      404,
      "Restaurant order not found"
    );
  }

  const tax = subtotal.mul(0.16);

  const serviceCharge =
    subtotal.mul(0.10);

  const discount =
    new Prisma.Decimal(order.discount);

  const grandTotal = subtotal
    .add(tax)
    .add(serviceCharge)
    .sub(discount);

  await tx.restaurantOrder.update({
    where: {
      id: orderId,
    },
    data: {
      subtotal,
      tax,
      serviceCharge,
      total: grandTotal,
    },
  });
}

export async function getOrderItems(
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
    });

  if (!order) {
    throw new ApiError(
      404,
      "Restaurant order not found"
    );
  }

  return prisma.barOrderItem.findMany({
    where: {
      orderId,
    },
    include: {
      menuItem: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });
}

export async function getOrderItemById(
  tenantId: string,
  itemId: string
) {
  const item =
    await prisma.barOrderItem.findFirst({
      where: {
        id: itemId,
      },
      include: {
        menuItem: true,
        order: true,
      },
    });

  if (!item || item.order.tenantId !== tenantId) {
    throw new ApiError(
      404,
      "Order item not found"
    );
  }

  return item;
}

export async function addOrderItem(
  tenantId: string,
  userId: string,
  data: CreateRestaurantOrderItemRequest
) {
  return prisma.$transaction(async (tx) => {
    const order =
      await tx.restaurantOrder.findFirst({
        where: {
          id: data.orderId,
          tenantId,
          isActive: true,
        },
      });

    if (!order) {
      throw new ApiError(
        404,
        "Restaurant order not found"
      );
    }

    const menuItem =
      await tx.menuItem.findFirst({
        where: {
          id: data.menuItemId,
          tenantId,
          isActive: true,
          available: true,
        },
      });

    if (!menuItem) {
      throw new ApiError(
        404,
        "Menu item not found or unavailable"
      );
    }

    const unitPrice =
      new Prisma.Decimal(menuItem.price);

    const lineTotal = unitPrice.mul(
      data.quantity
    );

let item;

const existingItem =
  await tx.barOrderItem.findFirst({
    where: {
      orderId: order.id,
      menuItemId: menuItem.id,
      status: "PENDING",
    },
    include: {
      menuItem: true,
    },
  });

if (existingItem) {
  const newQuantity =
    existingItem.quantity + data.quantity;

  const newTotal =
    unitPrice.mul(newQuantity);

  item =
    await tx.barOrderItem.update({
      where: {
        id: existingItem.id,
      },
      data: {
        quantity: newQuantity,
        total: newTotal,
      },
      include: {
        menuItem: true,
      },
    });
} else {
  item =
    await tx.barOrderItem.create({
      data: {
        orderId: order.id,
        menuItemId: menuItem.id,
        quantity: data.quantity,
        unitPrice,
        total: lineTotal,
      },
      include: {
        menuItem: true,
      },
    });
}

await recalculateOrderTotals(
  tx,
  order.id
);

    await tx.auditLog.create({
      data: {
        userId,
        action:
          "RESTAURANT_ORDER_ITEM_ADDED",
        entity:
          "RESTAURANT_ORDER_ITEM",
        entityId: item.id,
        description: `Added ${data.quantity} x ${menuItem.name} to order ${order.orderNumber}.`,
      },
    });

    return tx.restaurantOrder.findUnique({
      where: {
        id: order.id,
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
  });
}

export async function updateOrderItemQuantity(
  tenantId: string,
  userId: string,
  itemId: string,
  data: UpdateRestaurantOrderItemRequest
) {
  return prisma.$transaction(async (tx) => {
    const item =
      await tx.barOrderItem.findFirst({
        where: {
          id: itemId,
        },
        include: {
          order: true,
          menuItem: true,
        },
      });

    if (!item || item.order.tenantId !== tenantId) {
      throw new ApiError(
        404,
        "Order item not found"
      );
    }

    const unitPrice =
      new Prisma.Decimal(item.unitPrice);

    const lineTotal = unitPrice.mul(
      data.quantity
    );

    const updatedItem =
      await tx.barOrderItem.update({
        where: {
          id: item.id,
        },
        data: {
          quantity: data.quantity,
          total: lineTotal,
        },
        include: {
          menuItem: true,
        },
      });

    await recalculateOrderTotals(
      tx,
      item.orderId
    );

    await tx.auditLog.create({
      data: {
        userId,
        action:
          "RESTAURANT_ORDER_ITEM_UPDATED",
        entity:
          "RESTAURANT_ORDER_ITEM",
        entityId: item.id,
        description: `Updated quantity of ${item.menuItem.name} to ${data.quantity}.`,
      },
    });

    return updatedItem;
  });
}

export async function cancelOrderItem(
  tenantId: string,
  userId: string,
  itemId: string
) {
  return prisma.$transaction(async (tx) => {
    const item =
      await tx.barOrderItem.findFirst({
        where: {
          id: itemId,
        },
        include: {
          order: true,
          menuItem: true,
        },
      });

    if (!item || item.order.tenantId !== tenantId) {
      throw new ApiError(
        404,
        "Order item not found"
      );
    }

    await tx.barOrderItem.update({
  where: {
    id: item.id,
  },
  data: {
    status: "CANCELLED",
  },
});

    await recalculateOrderTotals(
      tx,
      item.orderId
    );

    await tx.auditLog.create({
      data: {
        userId,
        action:
          "RESTAURANT_ORDER_ITEM_REMOVED",
        entity:
          "RESTAURANT_ORDER_ITEM",
        entityId: item.id,
        description: `Removed ${item.menuItem.name} from order ${item.order.orderNumber}.`,
      },
    });

    return {
      success: true,
    };
  });
}