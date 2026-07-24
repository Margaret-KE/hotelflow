import prisma from "../../../lib/prisma";

export async function getKitchenQueue(
  tenantId: string
) {
  return prisma.restaurantOrderItem.findMany({
    where: {
      order: {
        tenantId,
        isActive: true,
        status: {
          not: "CANCELLED",
        },
      },

      status: {
        in: ["PENDING", "PREPARING"],
      },
    },

    include: {
      menuItem: true,

      order: {
        include: {
          guest: true,
        },
      },
    },

    orderBy: {
      createdAt: "asc",
    },
  });
}

import ApiError from "../../../utils/ApiError";

export async function startPreparing(
  tenantId: string,
  userId: string,
  itemId: string
) {
  const item =
    await prisma.restaurantOrderItem.findFirst({
      where: {
        id: itemId,
        order: {
          tenantId,
        },
      },
      include: {
        order: true,
        menuItem: true,
      },
    });

  if (!item) {
    throw new ApiError(
      404,
      "Kitchen item not found"
    );
  }

  if (item.status !== "PENDING") {
    throw new ApiError(
      400,
      "Only pending items can be prepared."
    );
  }

  const updated =
    await prisma.restaurantOrderItem.update({
      where: {
        id: item.id,
      },
      data: {
        status: "PREPARING",
      },
    });

  await prisma.auditLog.create({
    data: {
      userId,
      action: "KITCHEN_PREPARING",
      entity: "RESTAURANT_ORDER_ITEM",
      entityId: item.id,
      description: `Kitchen started preparing ${item.menuItem.name}.`,
    },
  });

  return updated;
}

export async function markReady(
  tenantId: string,
  userId: string,
  itemId: string
) {
  const item =
    await prisma.restaurantOrderItem.findFirst({
      where: {
        id: itemId,
        order: {
          tenantId,
        },
      },
      include: {
        order: true,
        menuItem: true,
      },
    });

  if (!item) {
    throw new ApiError(
      404,
      "Kitchen item not found"
    );
  }

  if (item.status !== "PREPARING") {
    throw new ApiError(
      400,
      "Only preparing items can be marked ready."
    );
  }

  const updated =
    await prisma.restaurantOrderItem.update({
      where: {
        id: item.id,
      },
      data: {
        status: "READY",
      },
    });

  await prisma.auditLog.create({
    data: {
      userId,
      action: "KITCHEN_READY",
      entity: "RESTAURANT_ORDER_ITEM",
      entityId: item.id,
      description: `${item.menuItem.name} is ready to serve.`,
    },
  });

  return updated;
}

export async function markServed(
  tenantId: string,
  userId: string,
  itemId: string
) {
  const item =
    await prisma.restaurantOrderItem.findFirst({
      where: {
        id: itemId,
        order: {
          tenantId,
        },
      },
      include: {
        order: true,
        menuItem: true,
      },
    });

  if (!item) {
    throw new ApiError(
      404,
      "Kitchen item not found"
    );
  }

  if (item.status !== "READY") {
    throw new ApiError(
      400,
      "Only ready items can be served."
    );
  }

  const updated =
    await prisma.restaurantOrderItem.update({
      where: {
        id: item.id,
      },
      data: {
        status: "SERVED",
      },
    });

  await prisma.auditLog.create({
    data: {
      userId,
      action: "KITCHEN_SERVED",
      entity: "RESTAURANT_ORDER_ITEM",
      entityId: item.id,
      description: `${item.menuItem.name} has been served.`,
    },
  });

  return updated;
}