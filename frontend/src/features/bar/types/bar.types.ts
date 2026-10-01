export interface BarCategory {
  id: string;
  tenantId: string;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BarMenuItem {
  id: string;
  tenantId: string;
  categoryId: string;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  available: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  category?: BarCategory;
}

export type BarOrderStatus =
  | "OPEN"
  | "COMPLETED"
  | "CANCELLED";

export type BarPaymentStatus =
  | "UNPAID"
  | "PARTIAL"
  | "PAID"
  | "REFUNDED";

export type BarOrderItemStatus =
  | "PENDING"
  | "PREPARING"
  | "READY"
  | "SERVED"
  | "CANCELLED";

export type BarPaymentMethod =
  | "CASH"
  | "MPESA"
  | "CARD"
  | "BANK_TRANSFER";

export type BarTransactionStatus =
  | "PENDING"
  | "COMPLETED"
  | "FAILED"
  | "REFUNDED";

export interface BarGuest {
  id: string;
  firstName: string;
  lastName: string;
  phone?: string;
  email?: string;
}

export interface BarReservation {
  id: string;
  confirmationNumber?: string;
  checkInDate?: string;
  checkOutDate?: string;
}

export interface BarOrderItem {
  id: string;
  orderId: string;
  menuItemId: string;
  quantity: number;
  unitPrice: number;
  total: number;
  notes?: string;
  status: BarOrderItemStatus;
  createdAt: string;
  updatedAt: string;
  menuItem: BarMenuItem;
  order?: BarOrder;
}

export interface BarOrder {
  id: string;
  tenantId: string;
  guestId?: string;
  reservationId?: string;
  createdById: string;
  orderNumber: string;
  status: BarOrderStatus;
  paymentStatus: BarPaymentStatus;
  subtotal: number;
  tax: number;
  serviceCharge: number;
  discount: number;
  total: number;
  notes?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  guest?: BarGuest;
  reservation?: BarReservation;
  items: BarOrderItem[];
}

export interface BarBill {
  orderId: string;
  orderNumber: string;
  subtotal: number;
  tax: number;
  serviceCharge: number;
  discount: number;
  total: number;
  amountPaid: number;
  balance: number;
  paymentStatus: BarPaymentStatus;
}

export interface BarPayment {
  id: string;
  tenantId: string;
  orderId: string;
  receivedById: string;
  amount: number;
  method: BarPaymentMethod;
  status: BarTransactionStatus;
  reference?: string;
  transactionId?: string;
  receiptNumber?: string;
  notes?: string;
  paidAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface BarKitchenItem extends BarOrderItem {
  order: BarOrder;
}

export interface CreateBarCategoryPayload {
  name: string;
  description?: string;
}

export interface UpdateBarCategoryPayload {
  name?: string;
  description?: string;
}

export interface CreateBarMenuItemPayload {
  categoryId: string;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  available?: boolean;
}

export interface UpdateBarMenuItemPayload {
  categoryId?: string;
  name?: string;
  description?: string;
  price?: number;
  imageUrl?: string;
  available?: boolean;
}

export interface CreateBarOrderPayload {
  guestId?: string;
  reservationId?: string;
  notes?: string;
}

export interface CreateBarOrderItemPayload {
  orderId: string;
  menuItemId: string;
  quantity: number;
}

export interface UpdateBarOrderItemPayload {
  quantity: number;
}

export interface CreateBarPaymentPayload {
  orderId: string;
  amount: number;
  method: BarPaymentMethod;
  reference?: string;
  transactionId?: string;
  receiptNumber?: string;
  notes?: string;
}