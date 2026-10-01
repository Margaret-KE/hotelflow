import {
  Prisma,
  ReservationStatus,
  RoomStatus,
} from "@prisma/client";

import prisma from "../../lib/prisma";
import ApiError from "../../utils/ApiError";

import {
  CreateReservationDto,
  UpdateReservationDto,
} from "./reservation.types";

function generateConfirmationNumber() {
  const now = new Date();

  const year = now.getFullYear();

  const month = String(
    now.getMonth() + 1
  ).padStart(2, "0");

  const day = String(
    now.getDate()
  ).padStart(2, "0");

  const random = Math.floor(
    1000 + Math.random() * 9000
  );

  return `GH-${year}${month}${day}-${random}`;
}

export async function getReservations(
  tenantId: string
) {
  return prisma.reservation.findMany({
    where: {
      tenantId,
      isActive: true,
    },
    include: {
      guest: true,
      room: {
        include: {
          roomType: true,
        },
      },
      payments: {
        orderBy: {
          paidAt: "desc",
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getReservationById(
  tenantId: string,
  reservationId: string
) {
  const reservation =
    await prisma.reservation.findFirst({
      where: {
        id: reservationId,
        tenantId,
        isActive: true,
      },
      include: {
        guest: true,
        room: {
          include: {
            roomType: true,
          },
        },
        payments: {
          orderBy: {
            paidAt: "desc",
          },
        },
      },
    });

  if (!reservation) {
    throw new ApiError(
      404,
      "Reservation not found"
    );
  }

  return reservation;
}

function calculateNights(
  checkInDate: Date,
  checkOutDate: Date
) {
  const millisecondsPerDay =
    1000 * 60 * 60 * 24;

  const difference =
    checkOutDate.getTime() -
    checkInDate.getTime();

  return Math.ceil(
    difference / millisecondsPerDay
  );
}

async function isRoomAvailable(
  tenantId: string,
  roomId: string,
  checkInDate: Date,
  checkOutDate: Date
) {
  const existingReservation =
    await prisma.reservation.findFirst({
      where: {
        tenantId,
        roomId,
        isActive: true,
        status: {
          in: [
            ReservationStatus.RESERVED,
            ReservationStatus.CHECKED_IN,
          ],
        },
        AND: [
          {
            checkInDate: {
              lt: checkOutDate,
            },
          },
          {
            checkOutDate: {
              gt: checkInDate,
            },
          },
        ],
      },
    });

  return !existingReservation;
}

export async function createReservation(
  tenantId: string,
  data: CreateReservationDto
) {
  const guest = await prisma.guest.findFirst({
    where: {
      id: data.guestId,
      tenantId,
      isActive: true,
    },
  });

  if (!guest) {
    throw new ApiError(
      404,
      "Guest not found"
    );
  }

  const room = await prisma.room.findFirst({
    where: {
      id: data.roomId,
      tenantId,
      isActive: true,
    },
    include: {
      roomType: true,
    },
  });

  if (!room) {
    throw new ApiError(
      404,
      "Room not found"
    );
  }

  const available = await isRoomAvailable(
    tenantId,
    room.id,
    data.checkInDate,
    data.checkOutDate
  );

  if (!available) {
    throw new ApiError(
      400,
      "Room is already reserved for the selected dates."
    );
  }

  const nights = calculateNights(
    data.checkInDate,
    data.checkOutDate
  );

  if (nights <= 0) {
    throw new ApiError(
      400,
      "Invalid stay duration."
    );
  }

  const roomPrice = Number(room.price);

  const totalAmount = new Prisma.Decimal(
    roomPrice * nights
  );

  const reservation =
    await prisma.reservation.create({
      data: {
        tenantId,
        guestId: guest.id,
        roomId: room.id,
        confirmationNumber:
          generateConfirmationNumber(),
        checkInDate: data.checkInDate,
        checkOutDate: data.checkOutDate,
        adults: data.adults ?? 1,
        children: data.children ?? 0,
        source: data.source,
        notes: data.notes,
        totalAmount,
      },
      include: {
        guest: true,
        room: {
          include: {
            roomType: true,
          },
        },
        payments: {
          orderBy: {
            paidAt: "desc",
          },
        },
      },
    });

  return reservation;
}

export async function updateReservation(
  tenantId: string,
  reservationId: string,
  data: UpdateReservationDto
) {
  const reservation =
    await prisma.reservation.findFirst({
      where: {
        id: reservationId,
        tenantId,
        isActive: true,
      },
    });

  if (!reservation) {
    throw new ApiError(
      404,
      "Reservation not found"
    );
  }

  const updateData: Prisma.ReservationUpdateInput =
    {};

  if (data.checkInDate) {
    updateData.checkInDate = data.checkInDate;
  }

  if (data.checkOutDate) {
    updateData.checkOutDate = data.checkOutDate;
  }

  if (data.adults !== undefined) {
    updateData.adults = data.adults;
  }

  if (data.children !== undefined) {
    updateData.children = data.children;
  }

  if (data.notes !== undefined) {
    updateData.notes = data.notes;
  }

  if (data.source) {
    updateData.source = data.source;
  }

  if (data.status) {
    updateData.status = data.status;
  }

  if (
    data.checkInDate ||
    data.checkOutDate
  ) {
    const room = await prisma.room.findFirst({
      where: {
        id: reservation.roomId,
        tenantId,
        isActive: true,
      },
    });

    if (!room) {
      throw new ApiError(
        404,
        "Room not found"
      );
    }

    const checkIn =
      data.checkInDate ??
      reservation.checkInDate;

    const checkOut =
      data.checkOutDate ??
      reservation.checkOutDate;

    const nights = calculateNights(
      checkIn,
      checkOut
    );

    if (nights <= 0) {
      throw new ApiError(
        400,
        "Invalid stay duration."
      );
    }

    updateData.totalAmount =
      new Prisma.Decimal(
        Number(room.price ?? 0) * nights
      );
  }

  await prisma.$transaction(
    async (tx) => {
      await tx.reservation.update({
        where: {
          id: reservationId,
        },
        data: updateData,
      });

      if (data.status) {
        switch (data.status) {
          case ReservationStatus.CHECKED_IN:
            await tx.room.updateMany({
              where: {
                id: reservation.roomId,
                tenantId,
                isActive: true,
              },
              data: {
                status: RoomStatus.OCCUPIED,
              },
            });
            break;

          case ReservationStatus.CHECKED_OUT:
            await tx.room.updateMany({
              where: {
                id: reservation.roomId,
                tenantId,
                isActive: true,
              },
              data: {
                status: RoomStatus.CLEANING,
              },
            });
            break;

          case ReservationStatus.CANCELLED:
            await tx.room.updateMany({
              where: {
                id: reservation.roomId,
                tenantId,
                isActive: true,
              },
              data: {
                status: RoomStatus.AVAILABLE,
              },
            });
            break;

          default:
            break;
        }
      }
    }
  );

  const updatedReservation =
    await prisma.reservation.findFirst({
      where: {
        id: reservationId,
        tenantId,
        isActive: true,
      },
      include: {
        guest: true,
        room: {
          include: {
            roomType: true,
          },
        },
        payments: {
          orderBy: {
            paidAt: "desc",
          },
        },
      },
    });

  if (!updatedReservation) {
    throw new ApiError(
      404,
      "Updated reservation not found"
    );
  }

  return updatedReservation;
}

export async function cancelReservation(
  tenantId: string,
  reservationId: string
) {
  const reservation =
    await prisma.reservation.findFirst({
      where: {
        id: reservationId,
        tenantId,
        isActive: true,
      },
    });

  if (!reservation) {
    throw new ApiError(
      404,
      "Reservation not found"
    );
  }

  if (
    reservation.status ===
    ReservationStatus.CHECKED_IN
  ) {
    throw new ApiError(
      400,
      "Checked-in reservations cannot be cancelled."
    );
  }

  if (
    reservation.status ===
    ReservationStatus.CHECKED_OUT
  ) {
    throw new ApiError(
      400,
      "Completed reservations cannot be cancelled."
    );
  }

  return prisma.reservation.update({
    where: {
      id: reservationId,
    },
    data: {
      status: ReservationStatus.CANCELLED,
    },
    include: {
      guest: true,
      room: {
        include: {
          roomType: true,
        },
      },
      payments: {
        orderBy: {
          paidAt: "desc",
        },
      },
    },
  });
}

export async function noShowReservation(
  tenantId: string,
  reservationId: string
) {
  const reservation =
    await prisma.reservation.findFirst({
      where: {
        id: reservationId,
        tenantId,
        isActive: true,
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
    ReservationStatus.RESERVED
  ) {
    throw new ApiError(
      400,
      "Only reserved reservations can be marked as no-show."
    );
  }

  await prisma.$transaction(
    async (tx) => {
      await tx.reservation.update({
        where: {
          id: reservationId,
        },
        data: {
          status: ReservationStatus.NO_SHOW,
        },
      });

      await tx.room.updateMany({
        where: {
          id: reservation.roomId,
          tenantId,
          isActive: true,
        },
        data: {
          status: RoomStatus.AVAILABLE,
        },
      });
    }
  );

  const updatedReservation =
    await prisma.reservation.findFirst({
      where: {
        id: reservationId,
        tenantId,
        isActive: true,
      },
      include: {
        guest: true,
        room: {
          include: {
            roomType: true,
          },
        },
        payments: {
          orderBy: {
            paidAt: "desc",
          },
        },
      },
    });

  if (!updatedReservation) {
    throw new ApiError(
      404,
      "Updated reservation not found"
    );
  }

  return updatedReservation;
}

export async function deleteReservation(
  tenantId: string,
  reservationId: string
) {
  const reservation =
    await prisma.reservation.findFirst({
      where: {
        id: reservationId,
        tenantId,
        isActive: true,
      },
    });

  if (!reservation) {
    throw new ApiError(
      404,
      "Reservation not found"
    );
  }

  return prisma.reservation.update({
    where: {
      id: reservationId,
    },
    data: {
      isActive: false,
    },
  });
}