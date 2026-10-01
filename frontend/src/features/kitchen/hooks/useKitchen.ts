import { useCallback, useEffect, useState } from "react";

import {
  getKitchenOrders,
  startKitchenItem,
  markKitchenItemReady,
  markKitchenItemServed,
} from "../services/kitchen.service";

import type {
  KitchenItemStatus,
  KitchenOrderItem,
} from "../types/kitchen.types";

export default function useKitchen() {
  const [items, setItems] = useState<KitchenOrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");

  const loadKitchen = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const kitchenItems = await getKitchenOrders();

      setItems(kitchenItems);
    } catch (err) {
      console.error("Failed to load kitchen orders:", err);
      setError("Failed to load kitchen orders.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadKitchen();
  }, [loadKitchen]);

  const updateItemStatus = async (
    itemId: string,
    status: KitchenItemStatus
  ) => {
    try {
      setActionLoading(true);
      setError("");

      let updatedItem: KitchenOrderItem;

      if (status === "PREPARING") {
        updatedItem = await startKitchenItem(itemId);
      } else if (status === "READY") {
        updatedItem = await markKitchenItemReady(itemId);
      } else if (status === "SERVED") {
        updatedItem = await markKitchenItemServed(itemId);
      } else {
        return;
      }

      if (status === "SERVED") {
        setItems((currentItems) =>
          currentItems.filter((item) => item.id !== updatedItem.id)
        );

        return;
      }

      setItems((currentItems) =>
        currentItems.map((item) => {
          if (item.id === updatedItem.id) {
            return {
              ...item,
              ...updatedItem,
            };
          }

          return item;
        })
      );
    } catch (err) {
      console.error("Failed to update kitchen item:", err);
      setError("Failed to update kitchen item.");
    } finally {
      setActionLoading(false);
    }
  };

  const startPreparing = async (itemId: string) => {
    await updateItemStatus(itemId, "PREPARING");
  };

  const markReady = async (itemId: string) => {
    await updateItemStatus(itemId, "READY");
  };

  const markServed = async (itemId: string) => {
    await updateItemStatus(itemId, "SERVED");
  };

  const pendingItems = items.filter(
    (item) => item.status === "PENDING"
  );

  const preparingItems = items.filter(
    (item) => item.status === "PREPARING"
  );

  const readyItems = items.filter(
    (item) => item.status === "READY"
  );

  return {
    items,
    pendingItems,
    preparingItems,
    readyItems,
    loading,
    actionLoading,
    error,
    reload: loadKitchen,
    startPreparing,
    markReady,
    markServed,
  };
}