import {
  ReservationStatus,
  RoomStatus,
} from "@prisma/client";

import prisma from "../../lib/prisma";
import ApiError from "../../utils/ApiError";

export async function checkIn(
  tenantId: string,
  reservationId: string
) {
  return prisma.$transaction(async (tx) => {
    // Find reservation
    const reservation = await tx.reservation.findFirst({
      where: {
        id: reservationId,
        tenantId,
        isActive: true,
      },
      include: {
        room: true,
        guest: true,
      },
    });

    if (!reservation) {
      throw new ApiError(
        404,
        "Reservation not found"
      );
    }

    // Reservation must be RESERVED
    if (
      reservation.status !==
      ReservationStatus.RESERVED
    ) {
      throw new ApiError(
        400,
        "Reservation cannot be checked in."
      );
    }

    // Room must be AVAILABLE
    if (
      reservation.room.status !==
      RoomStatus.AVAILABLE
    ) {
      throw new ApiError(
        400,
        "Room is not available."
      );
    }

    // Update reservation
    await tx.reservation.update({
      where: {
        id: reservation.id,
      },
      data: {
        status: ReservationStatus.CHECKED_IN,
        actualCheckIn: new Date(),
      },
    });

    // Update room
    await tx.room.update({
      where: {
        id: reservation.room.id,
      },
      data: {
        status: RoomStatus.OCCUPIED,
      },
    });

    // Return fresh reservation with updated room
    return tx.reservation.findUnique({
      where: {
        id: reservation.id,
      },
      include: {
        guest: true,
        room: {
          include: {
            roomType: true,
          },
        },
      },
    });
  });
}