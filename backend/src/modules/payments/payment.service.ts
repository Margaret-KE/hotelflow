import {
  PaymentStatus,
  Prisma,
} from "@prisma/client";

import prisma from "../../lib/prisma";
import ApiError from "../../utils/ApiError";

import { CreatePaymentDto } from "./payment.types";

function generateReceiptNumber() {
  const now = new Date();

  const year = now.getFullYear();

  const month = String(now.getMonth() + 1).padStart(2, "0");

  const day = String(now.getDate()).padStart(2, "0");

  const random = Math.floor(1000 + Math.random() * 9000);

  return `GH-REC-${year}${month}${day}-${random}`;
}

export async function getReservationPaymentSummary(
  reservationId: string
) {
  const reservation =
    await prisma.reservation.findUnique({
      where: {
        id: reservationId,
      },
      include: {
        payments: {
          where: {
            status: PaymentStatus.COMPLETED,
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

  const totalPaid =
    reservation.payments.reduce(
      (sum, payment) =>
        sum + Number(payment.amount),
      0
    );

  const reservationTotal = Number(
    reservation.totalAmount
  );

  return {
    reservationTotal,

    paidAmount: totalPaid,

    balance:
      reservationTotal - totalPaid,

    isFullyPaid:
      totalPaid >= reservationTotal,
  };
}

export async function createPayment(
  tenantId: string,
  userId: string,
  data: CreatePaymentDto
) {
  return prisma.$transaction(async (tx) => {
    const reservation =
      await tx.reservation.findFirst({
        where: {
          id: data.reservationId,
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

    const existingPayments =
      await tx.payment.findMany({
        where: {
          reservationId: reservation.id,
          status: PaymentStatus.COMPLETED,
        },
      });

    const totalPaid =
      existingPayments.reduce(
        (sum, payment) =>
          sum + Number(payment.amount),
        0
      );

    const reservationTotal = Number(
      reservation.totalAmount
    );

    const balance =
      reservationTotal - totalPaid;

    if (data.amount > balance) {
      throw new ApiError(
        400,
        `Payment exceeds outstanding balance of KES ${balance}`
      );
    }

    const payment =
      await tx.payment.create({
        data: {
          tenantId,

          reservationId: reservation.id,

          amount: new Prisma.Decimal(
            data.amount
          ),

          method: data.method,

          status:
            PaymentStatus.COMPLETED,

          receiptNumber:
            generateReceiptNumber(),

          transactionReference:
            data.transactionReference,

          notes: data.notes,

          receivedBy: userId,
        },
      });

    await tx.auditLog.create({
      data: {
        userId,

        action: "PAYMENT_RECEIVED",

        entity: "PAYMENT",

        entityId: payment.id,

        description: `Payment of KES ${data.amount} received for reservation ${reservation.confirmationNumber}.`,
      },
    });

    const updatedPayments =
      await tx.payment.findMany({
        where: {
          reservationId: reservation.id,
          status: PaymentStatus.COMPLETED,
        },
      });

    const updatedPaid =
      updatedPayments.reduce(
        (sum, payment) =>
          sum + Number(payment.amount),
        0
      );

    return {
      payment,

      summary: {
        reservationTotal,

        paidAmount: updatedPaid,

        balance:
          reservationTotal -
          updatedPaid,

        isFullyPaid:
          updatedPaid >=
          reservationTotal,
      },
    };
  });
}