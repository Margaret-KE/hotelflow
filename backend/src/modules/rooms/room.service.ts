import prisma from "../../lib/prisma";
import ApiError from "../../utils/ApiError";

import {
  CreateRoomDto,
  UpdateRoomDto,
} from "./room.types";

interface GetRoomsFilters {
  status?: string;
  roomTypeId?: string;
  floor?: string;
}

export async function getRooms(
  tenantId: string,
  filters: GetRoomsFilters = {}
) {
  return prisma.room.findMany({
    where: {
      tenantId,
      isActive: true,

      ...(filters.status && {
        status: filters.status as any,
      }),

      ...(filters.roomTypeId && {
        roomTypeId: filters.roomTypeId,
      }),

      ...(filters.floor && {
        floor: filters.floor,
      }),
    },

    include: {
      roomType: true,
    },

    orderBy: {
      roomNumber: "asc",
    },
  });
}

export async function getRoomById(
  tenantId: string,
  roomId: string
) {
  const room = await prisma.room.findFirst({
    where: {
      id: roomId,
      tenantId,
      isActive: true,
    },

    include: {
      roomType: true,
    },
  });

  if (!room) {
    throw new ApiError(404, "Room not found");
  }

  return room;
}

export async function createRoom(
  tenantId: string,
  data: CreateRoomDto
) {
  const roomType = await prisma.roomType.findFirst({
    where: {
      id: data.roomTypeId,
      tenantId,
      isActive: true,
    },
  });

  if (!roomType) {
    throw new ApiError(404, "Room type not found");
  }

  const existingRoom = await prisma.room.findFirst({
    where: {
      tenantId,
      roomNumber: data.roomNumber,
    },
  });

  if (existingRoom) {
    throw new ApiError(
      409,
      "Room number already exists"
    );
  }

  return prisma.room.create({
    data: {
      tenantId,
      roomTypeId: data.roomTypeId,
      roomNumber: data.roomNumber,
      floor: data.floor,
      notes: data.notes,
      price: roomType.basePrice,
    },

    include: {
      roomType: true,
    },
  });
}

export async function updateRoom(
  tenantId: string,
  roomId: string,
  data: UpdateRoomDto
) {
  const room = await prisma.room.findFirst({
    where: {
      id: roomId,
      tenantId,
      isActive: true,
    },
  });

  if (!room) {
    throw new ApiError(404, "Room not found");
  }

  if (
    data.roomNumber &&
    data.roomNumber !== room.roomNumber
  ) {
    const exists = await prisma.room.findFirst({
      where: {
        tenantId,
        roomNumber: data.roomNumber,
        NOT: {
          id: roomId,
        },
      },
    });

    if (exists) {
      throw new ApiError(
        409,
        "Room number already exists"
      );
    }
  }

  if (data.roomTypeId) {
    const roomType = await prisma.roomType.findFirst({
      where: {
        id: data.roomTypeId,
        tenantId,
        isActive: true,
      },
    });

    if (!roomType) {
      throw new ApiError(
        404,
        "Room type not found"
      );
    }
  }

  return prisma.room.update({
    where: {
      id: roomId,
    },

    data,

    include: {
      roomType: true,
    },
  });
}

export async function deleteRoom(
  tenantId: string,
  roomId: string
) {
  const room = await prisma.room.findFirst({
    where: {
      id: roomId,
      tenantId,
      isActive: true,
    },
  });

  if (!room) {
    throw new ApiError(404, "Room not found");
  }

  return prisma.room.update({
    where: {
      id: roomId,
    },

    data: {
      isActive: false,
    },
  });
}