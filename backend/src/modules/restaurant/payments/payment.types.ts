export interface CreateRestaurantPaymentRequest {
  orderId: string;

  amount: number;

  method:
    | "CASH"
    | "MPESA"
    | "CARD"
    | "BANK_TRANSFER";

  reference?: string;

  transactionId?: string;

  receiptNumber?: string;

  notes?: string;
}

export interface UpdateRestaurantPaymentRequest {
  amount?: number;

  method?:
    | "CASH"
    | "MPESA"
    | "CARD"
    | "BANK_TRANSFER";

  reference?: string;

  transactionId?: string;

  receiptNumber?: string;

  notes?: string;

  status?:
    | "UNPAID"
    | "PARTIAL"
    | "PAID"
    | "REFUNDED";
}

export interface RestaurantBillResponse {
  orderId: string;

  orderNumber: string;

  subtotal: number;

  tax: number;

  serviceCharge: number;

  discount: number;

  total: number;

  amountPaid: number;

  balance: number;

  paymentStatus:
    | "UNPAID"
    | "PARTIAL"
    | "PAID"
    | "REFUNDED";
}