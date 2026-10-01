export interface ReservationPayment {
  id: string;
  amount: number;
  method: string;
  status: string;
  receiptNumber: string;
  transactionReference: string | null;
  notes: string | null;
  paidAt: string;
}

export interface Reservation {
  id: string;
  guest: string;
  guestNo: string;
  guestPhone: string;
  accommodation: string;
  stay: string;
  checkInDate: string;
  checkOutDate: string;
  adults: number;
  children: number;
  nights: number;

  totalAmount: number;
  paidAmount: number;
  balanceAmount: number;

  amount: string;
  payment: string;
  paymentMethod: string;

  payments: ReservationPayment[];

  notes: string;
  source: string;
  status: string;
}