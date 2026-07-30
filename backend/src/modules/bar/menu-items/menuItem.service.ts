import prisma from "../../../lib/prisma";
import ApiError from "../../../utils/ApiError";

import {
  CreateMenuItemRequest,
  UpdateMenuItemRequest,
} from "./menuItem.types";

export async function getMenuItems(
  tenantId: string
) {
  return prisma.barMenuItem.findMany({
    where: {
      tenantId,
      isActive: true,
    },
    include: {
      category: true,
    },
    orderBy: {
      name: "asc",
    },
  });
}

export async function getMenuItemById(
  tenantId: string,
  menuItemId: string
) {
  const menuItem =
    await prisma.barMenuItem.findFirst({
      where: {
        id: menuItemId,
        tenantId,
        isActive: true,
      },
      include: {
        category: true,
      },
    });

  if (!menuItem) {
    throw new ApiError(
      404,
      "Bar menu item not found"
    );
  }

  return menuItem;
}

export async function createMenuItem(
  tenantId: string,
  userId: string,
  data: CreateMenuItemRequest
) {
  const category =
    await prisma.barCategory.findFirst({
      where: {
        id: data.categoryId,
        tenantId,
        isActive: true,
      },
    });

  if (!category) {
    throw new ApiError(
      404,
      "Bar category not found"
    );
  }

  const existing =
    await prisma.barMenuItem.findFirst({
      where: {
        tenantId,
        name: data.name,
        isActive: true,
      },
    });

  if (existing) {
    throw new ApiError(
      409,
      "Bar menu item already exists"
    );
  }

  const menuItem =
    await prisma.barMenuItem.create({
      data: {
        tenantId,
        categoryId: data.categoryId,
        name: data.name,
        description: data.description,
        price: data.price,
        imageUrl: data.imageUrl,
        available: data.available ?? true,
      },
      include: {
        category: true,
      },
    });

  await prisma.auditLog.create({
    data: {
      userId,
      action: "BAR_MENU_ITEM_CREATED",
      entity: "BAR_MENU_ITEM",
      entityId: menuItem.id,
      description: `Created bar menu item '${menuItem.name}'.`,
    },
  });

  return menuItem;
}

export async function updateMenuItem(
  tenantId: string,
  userId: string,
  menuItemId: string,
  data: UpdateMenuItemRequest
) {
  const menuItem =
    await getMenuItemById(
      tenantId,
      menuItemId
    );

  if (
    data.categoryId &&
    data.categoryId !== menuItem.categoryId
  ) {
    const category =
      await prisma.barCategory.findFirst({
        where: {
          id: data.categoryId,
          tenantId,
          isActive: true,
        },
      });

    if (!category) {
      throw new ApiError(
        404,
        "Bar category not found"
      );
    }
  }

  if (
    data.name &&
    data.name !== menuItem.name
  ) {
    const existing =
      await prisma.barMenuItem.findFirst({
        where: {
          tenantId,
          name: data.name,
          isActive: true,
          NOT: {
            id: menuItemId,
          },
        },
      });

    if (existing) {
      throw new ApiError(
        409,
        "Bar menu item already exists"
      );
    }
  }

  const updated =
    await prisma.barMenuItem.update({
      where: {
        id: menuItemId,
      },
      data,
      include: {
        category: true,
      },
    });

  await prisma.auditLog.create({
    data: {
      userId,
      action: "BAR_MENU_ITEM_UPDATED",
      entity: "BAR_MENU_ITEM",
      entityId: updated.id,
      description: `Updated bar menu item '${updated.name}'.`,
    },
  });

  return updated;
}

export async function deleteMenuItem(
  tenantId: string,
  userId: string,
  menuItemId: string
) {
  const menuItem =
    await getMenuItemById(
      tenantId,
      menuItemId
    );

  await prisma.barMenuItem.update({
    where: {
      id: menuItem.id,
    },
    data: {
      isActive: false,
    },
  });

  await prisma.auditLog.create({
    data: {
      userId,
      action: "BAR_MENU_ITEM_DELETED",
      entity: "BAR_MENU_ITEM",
      entityId: menuItem.id,
      description: `Deleted bar menu item '${menuItem.name}'.`,
    },
  });

  return {
    success: true,
  };
}