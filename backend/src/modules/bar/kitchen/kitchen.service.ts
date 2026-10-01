import prisma from "../../../lib/prisma";

import ApiError from "../../../utils/ApiError";

export async function getKitchenQueue(
  tenantId: string
) {
  return prisma.barOrderItem.findMany({
    where: {
      order: {
        tenantId,
        isActive: true,
        status: {
          not: "CANCELLED",
        },
      },
      status: {
        in: [
          "PENDING",
          "PREPARING",
          "READY",
        ],
      },
    },
    include: {
      menuItem: true,
      order: {
        include: {
          guest: true,
          reservation: true,
        },
      },
    },
    orderBy: {
      createdAt: "asc",
    },
  });
}

export async function startPreparing(
  tenantId: string,
  userId: string,
  itemId: string
) {
  const item =
    await prisma.barOrderItem.findFirst({
      where: {
        id: itemId,
        order: {
          tenantId,
          isActive: true,
          status: {
            not: "CANCELLED",
          },
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
      "Bar kitchen item not found"
    );
  }

  if (item.status !== "PENDING") {
    throw new ApiError(
      400,
      "Only pending items can be prepared."
    );
  }

  const updated =
    await prisma.barOrderItem.update({
      where: {
        id: item.id,
      },
      data: {
        status: "PREPARING",
      },
      include: {
        menuItem: true,
        order: {
          include: {
            guest: true,
            reservation: true,
          },
        },
      },
    });

  await prisma.auditLog.create({
    data: {
      userId,
      action: "BAR_KITCHEN_PREPARING",
      entity: "BAR_ORDER_ITEM",
      entityId: item.id,
      description: `Bar kitchen started preparing ${item.menuItem.name}.`,
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
    await prisma.barOrderItem.findFirst({
      where: {
        id: itemId,
        order: {
          tenantId,
          isActive: true,
          status: {
            not: "CANCELLED",
          },
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
      "Bar kitchen item not found"
    );
  }

  if (item.status !== "PREPARING") {
    throw new ApiError(
      400,
      "Only preparing items can be marked ready."
    );
  }

  const updated =
    await prisma.barOrderItem.update({
      where: {
        id: item.id,
      },
      data: {
        status: "READY",
      },
      include: {
        menuItem: true,
        order: {
          include: {
            guest: true,
            reservation: true,
          },
        },
      },
    });

  await prisma.auditLog.create({
    data: {
      userId,
      action: "BAR_KITCHEN_READY",
      entity: "BAR_ORDER_ITEM",
      entityId: item.id,
      description: `${item.menuItem.name} is ready to serve at the bar.`,
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
    await prisma.barOrderItem.findFirst({
      where: {
        id: itemId,
        order: {
          tenantId,
          isActive: true,
          status: {
            not: "CANCELLED",
          },
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
      "Bar kitchen item not found"
    );
  }

  if (item.status !== "READY") {
    throw new ApiError(
      400,
      "Only ready items can be served."
    );
  }

  const updated =
    await prisma.barOrderItem.update({
      where: {
        id: item.id,
      },
      data: {
        status: "SERVED",
      },
      include: {
        menuItem: true,
        order: {
          include: {
            guest: true,
            reservation: true,
          },
        },
      },
    });

  await prisma.auditLog.create({
    data: {
      userId,
      action: "BAR_KITCHEN_SERVED",
      entity: "BAR_ORDER_ITEM",
      entityId: item.id,
      description: `${item.menuItem.name} has been served from the bar.`,
    },
  });

  return updated;
}