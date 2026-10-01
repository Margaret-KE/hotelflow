import api from "../../../api/axios";

import type {
  KitchenOrderItem,
} from "../types/kitchen.types";

export async function getKitchenOrders() {
  const response = await api.get(
    "/restaurant/kitchen/orders"
  );

  return response.data.data as KitchenOrderItem[];
}

export async function startKitchenItem(
  itemId: string
) {
  const response = await api.patch(
    `/restaurant/kitchen/items/${itemId}/preparing`
  );

  return response.data.data as KitchenOrderItem;
}

export async function markKitchenItemReady(
  itemId: string
) {
  const response = await api.patch(
    `/restaurant/kitchen/items/${itemId}/ready`
  );

  return response.data.data as KitchenOrderItem;
}

export async function markKitchenItemServed(
  itemId: string
) {
  const response = await api.patch(
    `/restaurant/kitchen/items/${itemId}/served`
  );

  return response.data.data as KitchenOrderItem;
}