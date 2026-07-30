import {
  BarOrderStatus,
  BarPaymentStatus,
} from "@prisma/client";

export interface CreateBarOrderRequest {
  guestId?: string;

  reservationId?: string;

  notes?: string;
}

export interface UpdateBarOrderRequest {
  status?: BarOrderStatus;

  paymentStatus?: BarPaymentStatus;

  notes?: string;
}