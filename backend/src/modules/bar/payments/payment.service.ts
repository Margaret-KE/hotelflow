import {
  Prisma,
  BarPaymentStatus,
} from "@prisma/client";

import prisma from "../../../lib/prisma";
import ApiError from "../../../utils/ApiError";

import {
  CreateBarPaymentRequest,
  BarBillResponse,
} from "./payment.types";

export async function getBarBill(
  tenantId: string,
  orderId: string
): Promise<BarBillResponse> {
  const order =
    await prisma.barOrder.findFirst({
      where: {
        id: orderId,
        tenantId,
        isActive: true,
      },
      include: {
        payments: true,
      },
    });

  if (!order) {
    throw new ApiError(
      404,
      "Bar order not found"
    );
  }

  const amountPaid = order.payments.reduce(
    (sum, payment) =>
      sum.add(payment.amount),
    new Prisma.Decimal(0)
  );

  const balance =
    new Prisma.Decimal(order.total).sub(
      amountPaid
    );

  return {
    orderId: order.id,
    orderNumber: order.orderNumber,
    subtotal: Number(order.subtotal),
    tax: Number(order.tax),
    serviceCharge: Number(
      order.serviceCharge
    ),
    discount: Number(order.discount),
    total: Number(order.total),
    amountPaid: Number(amountPaid),
    balance: Number(balance),
    paymentStatus:
      order.paymentStatus,
  };
}

export async function receiveBarPayment(
  tenantId: string,
  receivedById: string,
  data: CreateBarPaymentRequest
) {
  return prisma.$transaction(async (tx) => {
    const order =
      await tx.barOrder.findFirst({
        where: {
          id: data.orderId,
          tenantId,
          isActive: true,
        },
        include: {
          payments: true,
        },
      });

    if (!order) {
      throw new ApiError(
        404,
        "Bar order not found"
      );
    }

    const amountPaid =
      order.payments.reduce(
        (sum, payment) =>
          sum.add(payment.amount),
        new Prisma.Decimal(0)
      );

    const orderTotal =
      new Prisma.Decimal(order.total);

    const paymentAmount =
      new Prisma.Decimal(data.amount);

    const balance =
      orderTotal.sub(amountPaid);

    if (
      paymentAmount.greaterThan(balance)
    ) {
      throw new ApiError(
        400,
        "Payment exceeds outstanding balance"
      );
    }

    const payment =
      await tx.barPayment.create({
        data: {
          tenantId,
          orderId: order.id,
          receivedById,

          amount: paymentAmount,

          method: data.method,

          reference: data.reference,

          transactionId:
            data.transactionId,

          receiptNumber:
            data.receiptNumber,

          notes: data.notes,
        },
      });

    const newAmountPaid =
      amountPaid.add(paymentAmount);

    let paymentStatus: BarPaymentStatus =
      BarPaymentStatus.UNPAID;

    if (newAmountPaid.equals(orderTotal)) {
      paymentStatus =
        BarPaymentStatus.PAID;
    } else if (
      newAmountPaid.greaterThan(
        new Prisma.Decimal(0)
      )
    ) {
      paymentStatus =
        BarPaymentStatus.PARTIAL;
    }

    await tx.barOrder.update({
      where: {
        id: order.id,
      },
      data: {
        paymentStatus,
      },
    });

    await tx.auditLog.create({
      data: {
        userId: receivedById,
        action: "BAR_PAYMENT_RECEIVED",
        entity: "BAR_PAYMENT",
        entityId: payment.id,
        description: `Received ${paymentAmount} via ${data.method} for order ${order.orderNumber}.`,
      },
    });

    const updatedOrder =
      await tx.barOrder.findUnique({
        where: {
          id: order.id,
        },
        include: {
          payments: true,
        },
      });

    if (!updatedOrder) {
      throw new ApiError(
        404,
        "Bar order not found"
      );
    }

    const updatedAmountPaid =
      updatedOrder.payments.reduce(
        (sum, payment) =>
          sum.add(payment.amount),
        new Prisma.Decimal(0)
      );

    const updatedBalance =
      new Prisma.Decimal(updatedOrder.total).sub(
        updatedAmountPaid
      );

    return {
      payment,
      bill: {
        orderId: updatedOrder.id,
        orderNumber: updatedOrder.orderNumber,
        subtotal: Number(updatedOrder.subtotal),
        tax: Number(updatedOrder.tax),
        serviceCharge: Number(updatedOrder.serviceCharge),
        discount: Number(updatedOrder.discount),
        total: Number(updatedOrder.total),
        amountPaid: Number(updatedAmountPaid),
        balance: Number(updatedBalance),
        paymentStatus: updatedOrder.paymentStatus,
      },
    };
  });
}