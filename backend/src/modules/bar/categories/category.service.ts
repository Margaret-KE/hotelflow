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
    await prisma.barCategory.findFirst({
      where: {
        id: categoryId,
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

  return category;
}

export async function createCategory(
  tenantId: string,
  userId: string,
  data: CreateCategoryRequest
) {
  const existing =
    await prisma.barCategory.findFirst({
      where: {
        tenantId,
        name: data.name,
      },
    });

  if (existing) {
    throw new ApiError(
      409,
      "Bar category already exists"
    );
  }

  const category =
    await prisma.barCategory.create({
      data: {
        tenantId,
        name: data.name,
        description: data.description,
      },
    });

  await prisma.auditLog.create({
    data: {
      userId,
      action: "BAR_CATEGORY_CREATED",
      entity: "BAR_CATEGORY",
      entityId: category.id,
      description: `Created bar category '${category.name}'.`,
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
      await prisma.barCategory.findFirst({
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
        "Bar category already exists"
      );
    }
  }

  const updated =
    await prisma.barCategory.update({
      where: {
        id: categoryId,
      },
      data,
    });

  await prisma.auditLog.create({
    data: {
      userId,
      action: "BAR_CATEGORY_UPDATED",
      entity: "BAR_CATEGORY",
      entityId: updated.id,
      description: `Updated bar category '${updated.name}'.`,
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

  await prisma.barCategory.update({
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
      action: "BAR_CATEGORY_DELETED",
      entity: "BAR_CATEGORY",
      entityId: category.id,
      description: `Deleted bar category '${category.name}'.`,
    },
  });

  return {
    success: true,
  };
}