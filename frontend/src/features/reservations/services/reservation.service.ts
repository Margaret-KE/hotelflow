import api from "../../../api/axios";

import type {
  Reservation,
  ReservationPayment,
} from "../types/reservation.types";

interface ApiPayment {
  id: string;
  amount: string | number;
  method: string;
  status: string;
  receiptNumber: string;
  transactionReference?: string | null;
  notes?: string | null;
  paidAt: string;
}

interface ApiReservation {
  id: string;
  confirmationNumber: string;
  checkInDate: string;
  checkOutDate: string;
  adults: number;
  children: number;
  totalAmount: string | number;
  status: string;
  notes?: string | null;
  source?: string | null;

  guest: {
    id: string;
    firstName: string;
    lastName: string;
    phone?: string | null;
  };

  room: {
    id: string;
    roomNumber?: string;
    name?: string;
    price?: string | number;
    roomType?: {
      name?: string;
    };
  };

  payments?: ApiPayment[];
}

export type PaymentMethod =
  | "CASH"
  | "MPESA"
  | "CARD"
  | "BANK_TRANSFER";

export interface CreatePaymentPayload {
  reservationId: string;
  amount: number;
  method: PaymentMethod;
  transactionReference?: string;
  notes?: string;
}

function calculateNights(
  checkInDate: string,
  checkOutDate: string
) {
  const checkIn = new Date(checkInDate);
  const checkOut = new Date(checkOutDate);

  const difference =
    checkOut.getTime() -
    checkIn.getTime();

  return Math.ceil(
    difference /
      (1000 * 60 * 60 * 24)
  );
}

function formatPaymentMethod(
  method: string
) {
  switch (method) {
    case "CASH":
      return "Cash";

    case "MPESA":
      return "M-Pesa";

    case "CARD":
      return "Card";

    case "BANK_TRANSFER":
      return "Bank Transfer";

    default:
      return method;
  }
}

function mapPayments(
  payments: ApiPayment[]
): ReservationPayment[] {
  return payments.map((payment) => ({
    id: payment.id,
    amount: Number(payment.amount),
    method: payment.method,
    status: payment.status,
    receiptNumber: payment.receiptNumber,
    transactionReference:
      payment.transactionReference || null,
    notes: payment.notes || null,
    paidAt: payment.paidAt,
  }));
}

function mapReservation(
  reservation: ApiReservation
): Reservation {
  const nights = calculateNights(
    reservation.checkInDate,
    reservation.checkOutDate
  );

  const checkIn = new Date(
    reservation.checkInDate
  ).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const checkOut = new Date(
    reservation.checkOutDate
  ).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const totalAmount =
    Number(reservation.totalAmount);

  const payments = mapPayments(
    reservation.payments || []
  );

  const completedPayments =
    payments.filter(
      (payment) =>
        payment.status === "COMPLETED"
    );

  const paidAmount =
    completedPayments.reduce(
      (total, payment) =>
        total + payment.amount,
      0
    );

  const balanceAmount = Math.max(
    totalAmount - paidAmount,
    0
  );

  let payment = "Pending";

  if (
    paidAmount >= totalAmount &&
    totalAmount > 0
  ) {
    payment = "Paid";
  } else if (paidAmount > 0) {
    payment = "Partial";
  }

  let paymentMethod = "Not paid";

  if (completedPayments.length === 1) {
    paymentMethod =
      formatPaymentMethod(
        completedPayments[0].method
      );
  }

  if (completedPayments.length > 1) {
    const methods =
      completedPayments.map(
        (item) =>
          formatPaymentMethod(item.method)
      );

    const uniqueMethods =
      Array.from(
        new Set(methods)
      );

    if (uniqueMethods.length === 1) {
      paymentMethod =
        uniqueMethods[0];
    } else {
      paymentMethod = "Multiple";
    }
  }

  let accommodation = "Room";

  if (
    reservation.room.roomType &&
    reservation.room.roomType.name
  ) {
    accommodation =
      reservation.room.roomType.name;
  } else if (reservation.room.roomNumber) {
    accommodation =
      reservation.room.roomNumber;
  }

  return {
    id: reservation.id,

    guest:
      `${reservation.guest.firstName} ${reservation.guest.lastName}`.trim(),

    guestNo:
      reservation.confirmationNumber,

    guestPhone:
      reservation.guest.phone ||
      "Phone not available",

    accommodation,

    stay:
      `${checkIn} - ${checkOut}`,

    checkInDate:
      reservation.checkInDate,

    checkOutDate:
      reservation.checkOutDate,

    adults: reservation.adults,
    children: reservation.children,
    nights,

    totalAmount,
    paidAmount,
    balanceAmount,

    amount:
      `KES ${totalAmount.toLocaleString()}`,

    payment,
    paymentMethod,

    payments,

    notes:
      reservation.notes ||
      "No notes added.",

    source:
      reservation.source ||
      "Not specified",

    status:
      reservation.status,
  };
}

export interface CreateReservationPayload {
  guestId: string;
  roomId: string;
  checkInDate: string;
  checkOutDate: string;
  adults?: number;
  children?: number;
  source?: string;
  notes?: string;
}

export interface UpdateReservationPayload {
  checkInDate?: string;
  checkOutDate?: string;
  adults?: number;
  children?: number;
  status?: string;
  source?: string;
  notes?: string;
}

export const reservationService = {
  async getReservations(): Promise<Reservation[]> {
    const response =
      await api.get("/reservations");

    const reservations =
      response.data.data as ApiReservation[];

    return reservations.map(
      mapReservation
    );
  },

  async getReservation(
    id: string
  ): Promise<Reservation> {
    const response =
      await api.get(
        `/reservations/${id}`
      );

    return mapReservation(
      response.data.data as ApiReservation
    );
  },

  async createReservation(
    data: CreateReservationPayload
  ): Promise<Reservation> {
    const response =
      await api.post(
        "/reservations",
        data
      );

    return mapReservation(
      response.data.data as ApiReservation
    );
  },

  async updateReservation(
    id: string,
    data: UpdateReservationPayload
  ): Promise<Reservation> {
    const response =
      await api.put(
        `/reservations/${id}`,
        data
      );

    return mapReservation(
      response.data.data as ApiReservation
    );
  },

  async checkInReservation(
    id: string
  ): Promise<Reservation> {
    const response =
      await api.put(
        `/reservations/${id}`,
        {
          status: "CHECKED_IN",
        }
      );

    return mapReservation(
      response.data.data as ApiReservation
    );
  },

  async checkOutReservation(
    id: string
  ): Promise<Reservation> {
    const response =
      await api.put(
        `/reservations/${id}`,
        {
          status: "CHECKED_OUT",
        }
      );

    return mapReservation(
      response.data.data as ApiReservation
    );
  },

  async cancelReservation(
    id: string
  ): Promise<Reservation> {
    const response =
      await api.patch(
        `/reservations/${id}/cancel`
      );

    return mapReservation(
      response.data.data as ApiReservation
    );
  },

  async noShowReservation(
    id: string
  ): Promise<Reservation> {
    const response =
      await api.patch(
        `/reservations/${id}/no-show`
      );

    return mapReservation(
      response.data.data as ApiReservation
    );
  },

  async createPayment(
    data: CreatePaymentPayload
  ) {
    const response =
      await api.post(
        "/payments",
        data
      );

    return response.data.data;
  },
};