import prisma from "../../../lib/prisma";
import ApiError from "../../../utils/ApiError";

import {
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from "./category.types";

export async function getCategories(
  tenantId: string
) {
  return prisma.barCategory.findMany({
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
  categoryId: string
) {
  const category =
    await prisma.menuCategory.findFirst({
      where: {
        id: categoryId,
        tenantId,
        isActive: true,
      },
    });

  if (!category) {
    throw new ApiError(
      404,
      "Category not found"
    );
  }

  return category;
}

export async function createCategory(
  tenantId: string,
  userId: string,
  data: CreateCategoryRequest
) {
  const existing = await prisma.barCategory.findFirst({
  where: {
    tenantId,
    name: data.name,
  },
});

if (existing) {
  throw new ApiError(
    409,
    "Category already exists"
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
      action: "CATEGORY_CREATED",
      entity: "MENU_CATEGORY",
      entityId: category.id,
      description: `Created menu category '${category.name}'.`,
    },
  });

  return category;
}

export async function updateCategory(
  tenantId: string,
  userId: string,
  categoryId: string,
  data: UpdateCategoryRequest
) {
  const category =
    await getCategoryById(
      tenantId,
      categoryId
    );

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
            id: categoryId,
          },
        },
      });

    if (existing) {
      throw new ApiError(
        409,
        "Category already exists"
      );
    }
  }

  const updated =
    await prisma.menuCategory.update({
      where: {
        id: categoryId,
      },
      data,
    });

  await prisma.auditLog.create({
    data: {
      userId,
      action: "CATEGORY_UPDATED",
      entity: "MENU_CATEGORY",
      entityId: updated.id,
      description: `Updated menu category '${updated.name}'.`,
    },
  });

  return updated;
}

export async function deleteCategory(
  tenantId: string,
  userId: string,
  categoryId: string
) {
  const category =
    await getCategoryById(
      tenantId,
      categoryId
    );

  await prisma.menuCategory.update({
    where: {
      id: category.id,
    },
    data: {
      isActive: false,
    },
  });

  await prisma.auditLog.create({
    data: {
      userId,
      action: "CATEGORY_DELETED",
      entity: "MENU_CATEGORY",
      entityId: category.id,
      description: `Deleted menu category '${category.name}'.`,
    },
  });

  return {
    success: true,
  };
}