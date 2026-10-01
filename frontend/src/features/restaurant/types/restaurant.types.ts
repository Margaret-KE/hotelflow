export interface RestaurantCategory {
  id: string;
  tenantId: string;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface RestaurantMenuItem {
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
  category?: RestaurantCategory;
}

export type RestaurantOrderStatus =
  | "OPEN"
  | "COMPLETED"
  | "CANCELLED";

export type RestaurantPaymentStatus =
  | "UNPAID"
  | "PARTIAL"
  | "PAID"
  | "REFUNDED";

export type KitchenItemStatus =
  | "PENDING"
  | "PREPARING"
  | "READY"
  | "SERVED"
  | "CANCELLED";

export type RestaurantPaymentMethod =
  | "CASH"
  | "MPESA"
  | "CARD"
  | "BANK_TRANSFER";

export interface RestaurantGuest {
  id: string;
  firstName: string;
  lastName: string;
  phone?: string;
  email?: string;
}

export interface RestaurantReservation {
  id: string;
  confirmationNumber?: string;
  checkInDate?: string;
  checkOutDate?: string;
}

export interface RestaurantOrderItem {
  id: string;
  orderId: string;
  menuItemId: string;
  quantity: number;
  unitPrice: number;
  total: number;
  notes?: string;
  status: KitchenItemStatus;
  createdAt: string;
  updatedAt: string;
  menuItem: RestaurantMenuItem;
}

export interface RestaurantOrder {
  id: string;
  tenantId: string;
  guestId?: string;
  reservationId?: string;
  createdById: string;
  orderNumber: string;
  status: RestaurantOrderStatus;
  paymentStatus: RestaurantPaymentStatus;
  subtotal: number;
  tax: number;
  serviceCharge: number;
  discount: number;
  total: number;
  notes?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  guest?: RestaurantGuest;
  reservation?: RestaurantReservation;
  items: RestaurantOrderItem[];
}

export interface RestaurantBill {
  orderId: string;
  orderNumber: string;
  subtotal: number;
  tax: number;
  serviceCharge: number;
  discount: number;
  total: number;
  amountPaid: number;
  balance: number;
  paymentStatus: RestaurantPaymentStatus;
}

export interface RestaurantPayment {
  id: string;
  tenantId: string;
  orderId: string;
  receivedById: string;
  amount: number;
  method: RestaurantPaymentMethod;
  status: RestaurantPaymentStatus;
  reference?: string;
  transactionId?: string;
  receiptNumber?: string;
  notes?: string;
  paidAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRestaurantOrderPayload {
  guestId?: string;
  reservationId?: string;
  notes?: string;
}

export interface CreateRestaurantOrderItemPayload {
  orderId: string;
  menuItemId: string;
  quantity: number;
}

export interface UpdateRestaurantOrderItemPayload {
  quantity: number;
}

export interface CreateRestaurantPaymentPayload {
  orderId: string;
  amount: number;
  method: RestaurantPaymentMethod;
  reference?: string;
  transactionId?: string;
  receiptNumber?: string;
  notes?: string;
}

export interface CreateRestaurantCategoryPayload {
  name: string;
  description?: string;
}

export interface UpdateRestaurantCategoryPayload {
  name?: string;
  description?: string;
}

export interface CreateRestaurantMenuItemPayload {
  categoryId: string;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  available?: boolean;
}

export interface UpdateRestaurantMenuItemPayload {
  categoryId?: string;
  name?: string;
  description?: string;
  price?: number;
  imageUrl?: string;
  available?: boolean;
}