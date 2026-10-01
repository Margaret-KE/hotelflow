import prisma from "../../../lib/prisma";
import ApiError from "../../../utils/ApiError";

import {
  CreateCategoryInput,
  UpdateCategoryInput,
} from "./category.types";

export async function getCategories(
  tenantId: string
) {
  return prisma.menuCategory.findMany({
    where: {
      tenantId,
      isActive: true,
    },
    orderBy: {
      name: "asc",
    },
  });
}

export async function getCategoryById(
  tenantId: string,
  id: string
) {
  const category =
    await prisma.menuCategory.findFirst({
      where: {
        id,
        tenantId,
        isActive: true,
      },
      include: {
        menuItems: true,
      },
    });

  if (!category) {
    throw new ApiError(
      404,
      "Restaurant category not found"
    );
  }

  return category;
}

export async function createCategory(
  tenantId: string,
  userId: string,
  data: CreateCategoryInput
) {
  const existing =
    await prisma.menuCategory.findFirst({
      where: {
        tenantId,
        name: data.name,
        isActive: true,
      },
    });

  if (existing) {
    throw new ApiError(
      409,
      "Restaurant category already exists"
    );
  }

  const category =
    await prisma.menuCategory.create({
      data: {
        tenantId,
        name: data.name,
        description: data.description,
      },
    });

  await prisma.auditLog.create({
    data: {
      userId,
      action: "RESTAURANT_CATEGORY_CREATED",
      entity: "MENU_CATEGORY",
      entityId: category.id,
      description: `Created restaurant category ${category.name}.`,
    },
  });

  return category;
}

export async function updateCategory(
  tenantId: string,
  userId: string,
  id: string,
  data: UpdateCategoryInput
) {
  const category =
    await prisma.menuCategory.findFirst({
      where: {
        id,
        tenantId,
        isActive: true,
      },
    });

  if (!category) {
    throw new ApiError(
      404,
      "Restaurant category not found"
    );
  }

  if (
    data.name &&
    data.name !== category.name
  ) {
    const existing =
      await prisma.menuCategory.findFirst({
        where: {
          tenantId,
          name: data.name,
          isActive: true,
          NOT: {
            id,
          },
        },
      });

    if (existing) {
      throw new ApiError(
        409,
        "Restaurant category already exists"
      );
    }
  }

  const updated =
    await prisma.menuCategory.update({
      where: {
        id,
      },
      data,
    });

  await prisma.auditLog.create({
    data: {
      userId,
      action: "RESTAURANT_CATEGORY_UPDATED",
      entity: "MENU_CATEGORY",
      entityId: updated.id,
      description: `Updated restaurant category ${updated.name}.`,
    },
  });

  return updated;
}

export async function deleteCategory(
  tenantId: string,
  userId: string,
  id: string
) {
  const category =
    await prisma.menuCategory.findFirst({
      where: {
        id,
        tenantId,
        isActive: true,
      },
      include: {
        menuItems: true,
      },
    });

  if (!category) {
    throw new ApiError(
      404,
      "Restaurant category not found"
    );
  }

  if (category.menuItems.length > 0) {
    throw new ApiError(
      400,
      "Cannot delete a category that has menu items"
    );
  }

  await prisma.menuCategory.update({
    where: {
      id,
    },
    data: {
      isActive: false,
    },
  });

  await prisma.auditLog.create({
    data: {
      userId,
      action: "RESTAURANT_CATEGORY_DELETED",
      entity: "MENU_CATEGORY",
      entityId: category.id,
      description: `Deleted restaurant category ${category.name}.`,
    },
  });

  return {
    success: true,
  };
}