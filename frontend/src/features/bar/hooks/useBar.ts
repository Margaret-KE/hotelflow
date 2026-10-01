import { useCallback, useEffect, useState } from "react";

import {
  createBarCategory,
  createBarMenuItem,
  createBarOrder,
  getBarCategories,
  getBarMenuItems,
  getBarOrders,
} from "../services/bar.service";

import type {
  BarCategory,
  BarMenuItem,
  BarOrder,
  CreateBarCategoryPayload,
  CreateBarMenuItemPayload,
} from "../types/bar.types";

export default function useBar() {
  const [categories, setCategories] = useState<BarCategory[]>([]);
  const [menuItems, setMenuItems] = useState<BarMenuItem[]>([]);
  const [orders, setOrders] = useState<BarOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadBar = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const [
        categoriesData,
        menuItemsData,
        ordersData,
      ] = await Promise.all([
        getBarCategories(),
        getBarMenuItems(),
        getBarOrders(),
      ]);

      setCategories(categoriesData);
      setMenuItems(menuItemsData);
      setOrders(ordersData);
    } catch (err) {
      console.error(
        "Failed to load bar data:",
        err
      );

      setError("Failed to load bar data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBar();
  }, [loadBar]);

  const addCategory = async (
    payload: CreateBarCategoryPayload
  ) => {
    const category =
      await createBarCategory(payload);

    setCategories((current) => [
      ...current,
      category,
    ]);

    return category;
  };

  const addMenuItem = async (
    payload: CreateBarMenuItemPayload
  ) => {
    const menuItem =
      await createBarMenuItem(payload);

    setMenuItems((current) => [
      ...current,
      menuItem,
    ]);

    return menuItem;
  };

  const createOrder = async () => {
    const order = await createBarOrder();

    setOrders((current) => [
      order,
      ...current,
    ]);

    return order;
  };

  return {
    categories,
    menuItems,
    orders,
    loading,
    error,
    reload: loadBar,
    addCategory,
    addMenuItem,
    createOrder,
  };
}