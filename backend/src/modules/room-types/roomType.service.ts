import prisma from "../../lib/prisma";
import ApiError from "../../utils/ApiError";
import {
  CreateRoomTypeDto,
  UpdateRoomTypeDto,
} from "./roomType.types";

export const getRoomTypes = async (tenantId: string) => {
  return prisma.roomType.findMany({
    where: {
      tenantId,
    },
    orderBy: {
      name: "asc",
    },
    include: {
      amenities: {
        include: {
          amenity: true,
        },
      },
    },
  });
};

export const getRoomTypeById = async (
  tenantId: string,
  id: string
) => {
  const roomType = await prisma.roomType.findFirst({
    where: {
      id,
      tenantId,
    },
    include: {
      amenities: {
        include: {
          amenity: true,
        },
      },
    },
  });

  if (!roomType) {
    throw new ApiError(404, "Room type not found");
  }

  return roomType;
};

export const createRoomType = async (
  tenantId: string,
  data: CreateRoomTypeDto
) => {
  const exists = await prisma.roomType.findUnique({
    where: {
      tenantId_name: {
        tenantId,
        name: data.name,
      },
    },
  });

  if (exists) {
    throw new ApiError(409, "Room type already exists");
  }

  return prisma.roomType.create({
    data: {
      tenantId,
      ...data,
    },
  });
};

export const updateRoomType = async (
  tenantId: string,
  id: string,
  data: UpdateRoomTypeDto
) => {
  await getRoomTypeById(tenantId, id);

  return prisma.roomType.update({
    where: {
      id,
    },
    data,
  });
};

export const deleteRoomType = async (
  tenantId: string,
  id: string
) => {
  await getRoomTypeById(tenantId, id);

  return prisma.roomType.update({
    where: {
      id,
    },
    data: {
      isActive: false,
    },
  });
};