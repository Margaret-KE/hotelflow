import api from "../../../api/axios";

import type {
  CreateRestaurantCategoryPayload,
  CreateRestaurantMenuItemPayload,
  CreateRestaurantOrderItemPayload,
  CreateRestaurantOrderPayload,
  CreateRestaurantPaymentPayload,
  RestaurantBill,
  RestaurantCategory,
  RestaurantMenuItem,
  RestaurantOrder,
  RestaurantOrderItem,
  RestaurantPayment,
  UpdateRestaurantCategoryPayload,
  UpdateRestaurantMenuItemPayload,
  UpdateRestaurantOrderItemPayload,
} from "../types/restaurant.types";

export async function getRestaurantCategories() {
  const response = await api.get(
    "/restaurant/categories"
  );

  return response.data.data as RestaurantCategory[];
}

export async function getRestaurantCategory(
  id: string
) {
  const response = await api.get(
    `/restaurant/categories/${id}`
  );

  return response.data.data as RestaurantCategory;
}

export async function createRestaurantCategory(
  payload: CreateRestaurantCategoryPayload
) {
  const response = await api.post(
    "/restaurant/categories",
    payload
  );

  return response.data.data as RestaurantCategory;
}

export async function updateRestaurantCategory(
  id: string,
  payload: UpdateRestaurantCategoryPayload
) {
  const response = await api.put(
    `/restaurant/categories/${id}`,
    payload
  );

  return response.data.data as RestaurantCategory;
}

export async function deleteRestaurantCategory(
  id: string
) {
  const response = await api.delete(
    `/restaurant/categories/${id}`
  );

  return response.data.data;
}

export async function getRestaurantMenuItems() {
  const response = await api.get(
    "/restaurant/menu-items"
  );

  return response.data.data as RestaurantMenuItem[];
}

export async function getRestaurantMenuItem(
  id: string
) {
  const response = await api.get(
    `/restaurant/menu-items/${id}`
  );

  return response.data.data as RestaurantMenuItem;
}

export async function createRestaurantMenuItem(
  payload: CreateRestaurantMenuItemPayload
) {
  const response = await api.post(
    "/restaurant/menu-items",
    payload
  );

  return response.data.data as RestaurantMenuItem;
}

export async function updateRestaurantMenuItem(
  id: string,
  payload: UpdateRestaurantMenuItemPayload
) {
  const response = await api.put(
    `/restaurant/menu-items/${id}`,
    payload
  );

  return response.data.data as RestaurantMenuItem;
}

export async function deleteRestaurantMenuItem(
  id: string
) {
  const response = await api.delete(
    `/restaurant/menu-items/${id}`
  );

  return response.data.data;
}

export async function getRestaurantOrders() {
  const response = await api.get(
    "/restaurant/orders"
  );

  return response.data.data as RestaurantOrder[];
}

export async function getRestaurantOrder(
  id: string
) {
  const response = await api.get(
    `/restaurant/orders/${id}`
  );

  return response.data.data as RestaurantOrder;
}

export async function createRestaurantOrder(
  payload: CreateRestaurantOrderPayload = {}
) {
  const response = await api.post(
    "/restaurant/orders",
    payload
  );

  return response.data.data as RestaurantOrder;
}

export async function updateRestaurantOrderNotes(
  id: string,
  notes: string
) {
  const response = await api.patch(
    `/restaurant/orders/${id}/notes`,
    {
      notes,
    }
  );

  return response.data.data as RestaurantOrder;
}

export async function cancelRestaurantOrder(
  id: string
) {
  const response = await api.patch(
    `/restaurant/orders/${id}/cancel`
  );

  return response.data.data as RestaurantOrder;
}

export async function getRestaurantOrderItems(
  orderId: string
) {
  const response = await api.get(
    `/restaurant/order-items/order/${orderId}`
  );

  return response.data.data as RestaurantOrderItem[];
}

export async function getRestaurantOrderItem(
  id: string
) {
  const response = await api.get(
    `/restaurant/order-items/${id}`
  );

  return response.data.data as RestaurantOrderItem;
}

export async function addRestaurantOrderItem(
  payload: CreateRestaurantOrderItemPayload
) {
  const response = await api.post(
    "/restaurant/order-items",
    payload
  );

  return response.data.data as RestaurantOrder;
}

export async function updateRestaurantOrderItemQuantity(
  id: string,
  payload: UpdateRestaurantOrderItemPayload
) {
  const response = await api.put(
    `/restaurant/order-items/${id}`,
    payload
  );

  return response.data.data as RestaurantOrderItem;
}

export async function cancelRestaurantOrderItem(
  id: string
) {
  const response = await api.patch(
    `/restaurant/order-items/${id}/cancel`
  );

  return response.data.data;
}

export async function getRestaurantBill(
  orderId: string
) {
  const response = await api.get(
    `/restaurant/payments/orders/${orderId}/bill`
  );

  return response.data.data as RestaurantBill;
}

export async function receiveRestaurantPayment(
  payload: CreateRestaurantPaymentPayload
) {
  const response = await api.post(
    "/restaurant/payments",
    payload
  );

  return response.data.data as {
    payment: RestaurantPayment;
    bill: RestaurantBill;
  };
}