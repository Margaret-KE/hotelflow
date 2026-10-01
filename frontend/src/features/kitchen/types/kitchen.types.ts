export type KitchenItemStatus =
  | "PENDING"
  | "PREPARING"
  | "READY"
  | "SERVED"
  | "CANCELLED";

export interface KitchenGuest {
  id: string;
  firstName: string;
  lastName: string;
  phone?: string;
  email?: string;
}

export interface KitchenOrder {
  id: string;
  tenantId: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  subtotal: number;
  tax: number;
  serviceCharge: number;
  discount: number;
  total: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  guest?: KitchenGuest;
}

export interface KitchenMenuItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
}

export interface KitchenOrderItem {
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
  menuItem: KitchenMenuItem;
  order: KitchenOrder;
}