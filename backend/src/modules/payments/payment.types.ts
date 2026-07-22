import {
  PaymentMethod,
  PaymentStatus,
} from "@prisma/client";

export interface CreatePaymentDto {
  reservationId: string;

  amount: number;

  method: PaymentMethod;

  transactionReference?: string;

  notes?: string;
}

export interface UpdatePaymentDto {
  status?: PaymentStatus;

  notes?: string;

  transactionReference?: string;
}