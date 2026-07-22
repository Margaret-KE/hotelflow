import {
  RestaurantOrderStatus,
  RestaurantPaymentStatus,
} from "@prisma/client";

export interface CreateRestaurantOrderRequest {
  guestId?: string;

  reservationId?: string;

  notes?: string;
}

export interface UpdateRestaurantOrderRequest {
  status?: RestaurantOrderStatus;

  paymentStatus?: RestaurantPaymentStatus;

  notes?: string;
}