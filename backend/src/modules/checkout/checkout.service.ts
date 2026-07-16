import {
  ReservationStatus,
  RoomStatus,
} from "@prisma/client";

import prisma from "../../lib/prisma";
import ApiError from "../../utils/ApiError";

export async function checkOut(
  tenantId: string,
  reservationId: string
) {
  return prisma.$transaction(async (tx) => {
    const reservation =
      await tx.reservation.findFirst({
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

    if (
      reservation.status !==
      ReservationStatus.CHECKED_IN
    ) {
      throw new ApiError(
        400,
        "Guest is not checked in."
      );
    }

    await tx.reservation.update({
      where: {
        id: reservation.id,
      },
      data: {
        status: ReservationStatus.CHECKED_OUT,
        actualCheckOut: new Date(),
      },
    });

    await tx.room.update({
      where: {
        id: reservation.room.id,
      },
      data: {
        status: RoomStatus.AVAILABLE,
      },
    });

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