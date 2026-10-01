import api from "../../../api/axios";

import type {
  BarBill,
  BarCategory,
  BarKitchenItem,
  BarMenuItem,
  BarOrder,
  BarOrderItem,
  BarPayment,
  CreateBarCategoryPayload,
  CreateBarMenuItemPayload,
  CreateBarOrderItemPayload,
  CreateBarOrderPayload,
  CreateBarPaymentPayload,
  UpdateBarCategoryPayload,
  UpdateBarMenuItemPayload,
  UpdateBarOrderItemPayload,
} from "../types/bar.types";

/* =========================
   CATEGORIES
========================= */

export async function getBarCategories() {
  const response = await api.get("/bar/categories");

  return response.data.data as BarCategory[];
}

export async function getBarCategory(id: string) {
  const response = await api.get(`/bar/categories/${id}`);

  return response.data.data as BarCategory;
}

export async function createBarCategory(
  payload: CreateBarCategoryPayload
) {
  const response = await api.post(
    "/bar/categories",
    payload
  );

  return response.data.data as BarCategory;
}

export async function updateBarCategory(
  id: string,
  payload: UpdateBarCategoryPayload
) {
  const response = await api.put(
    `/bar/categories/${id}`,
    payload
  );

  return response.data.data as BarCategory;
}

export async function deleteBarCategory(id: string) {
  const response = await api.delete(
    `/bar/categories/${id}`
  );

  return response.data.data;
}

/* =========================
   MENU ITEMS
========================= */

export async function getBarMenuItems() {
  const response = await api.get("/bar/menu-items");

  return response.data.data as BarMenuItem[];
}

export async function getBarMenuItem(id: string) {
  const response = await api.get(
    `/bar/menu-items/${id}`
  );

  return response.data.data as BarMenuItem;
}

export async function createBarMenuItem(
  payload: CreateBarMenuItemPayload
) {
  const response = await api.post(
    "/bar/menu-items",
    payload
  );

  return response.data.data as BarMenuItem;
}

export async function updateBarMenuItem(
  id: string,
  payload: UpdateBarMenuItemPayload
) {
  const response = await api.put(
    `/bar/menu-items/${id}`,
    payload
  );

  return response.data.data as BarMenuItem;
}

export async function deleteBarMenuItem(id: string) {
  const response = await api.delete(
    `/bar/menu-items/${id}`
  );

  return response.data.data;
}

/* =========================
   ORDERS
========================= */

export async function getBarOrders() {
  const response = await api.get("/bar/orders");

  return response.data.data as BarOrder[];
}

export async function getBarOrder(id: string) {
  const response = await api.get(
    `/bar/orders/${id}`
  );

  return response.data.data as BarOrder;
}

export async function createBarOrder(
  payload: CreateBarOrderPayload = {}
) {
  const response = await api.post(
    "/bar/orders",
    payload
  );

  return response.data.data as BarOrder;
}

export async function updateBarOrderNotes(
  id: string,
  notes: string
) {
  const response = await api.patch(
    `/bar/orders/${id}/notes`,
    { notes }
  );

  return response.data.data as BarOrder;
}

export async function cancelBarOrder(id: string) {
  const response = await api.patch(
    `/bar/orders/${id}/cancel`
  );

  return response.data.data as BarOrder;
}

/* =========================
   ORDER ITEMS
========================= */

export async function getBarOrderItems(
  orderId: string
) {
  const response = await api.get(
    `/bar/order-items/order/${orderId}`
  );

  return response.data.data as BarOrderItem[];
}

export async function getBarOrderItem(id: string) {
  const response = await api.get(
    `/bar/order-items/${id}`
  );

  return response.data.data as BarOrderItem;
}

export async function addBarOrderItem(
  payload: CreateBarOrderItemPayload
) {
  const response = await api.post(
    "/bar/order-items",
    payload
  );

  return response.data.data as BarOrder;
}

export async function updateBarOrderItemQuantity(
  id: string,
  payload: UpdateBarOrderItemPayload
) {
  const response = await api.put(
    `/bar/order-items/${id}`,
    payload
  );

  return response.data.data as BarOrderItem;
}

export async function cancelBarOrderItem(id: string) {
  const response = await api.patch(
    `/bar/order-items/${id}/cancel`
  );

  return response.data.data;
}

/* =========================
   PAYMENTS
========================= */

export async function getBarBill(orderId: string) {
  const response = await api.get(
    `/bar/payments/orders/${orderId}/bill`
  );

  return response.data.data as BarBill;
}

export async function receiveBarPayment(
  payload: CreateBarPaymentPayload
) {
  const response = await api.post(
    "/bar/payments",
    payload
  );

  return response.data.data as {
    payment: BarPayment;
    bill: BarBill;
  };
}

/* =========================
   KITCHEN
========================= */

export async function getBarKitchenQueue() {
  const response = await api.get(
    "/bar/kitchen/orders"
  );

  return response.data.data as BarKitchenItem[];
}

export async function startBarPreparing(id: string) {
  const response = await api.patch(
    `/bar/kitchen/items/${id}/preparing`
  );

  return response.data.data as BarKitchenItem;
}

export async function markBarReady(id: string) {
  const response = await api.patch(
    `/bar/kitchen/items/${id}/ready`
  );

  return response.data.data as BarKitchenItem;
}

export async function markBarServed(id: string) {
  const response = await api.patch(
    `/bar/kitchen/items/${id}/served`
  );

  return response.data.data as BarKitchenItem;
}