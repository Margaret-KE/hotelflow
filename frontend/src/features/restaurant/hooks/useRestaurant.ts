import { useCallback, useEffect, useState } from "react";

import {
  createRestaurantCategory,
  createRestaurantMenuItem,
  createRestaurantOrder,
  getRestaurantCategories,
  getRestaurantMenuItems,
  getRestaurantOrders,
} from "../services/restaurant.service";

import type {
  CreateRestaurantCategoryPayload,
  CreateRestaurantMenuItemPayload,
  RestaurantCategory,
  RestaurantMenuItem,
  RestaurantOrder,
} from "../types/restaurant.types";

export default function useRestaurant() {
  const [categories, setCategories] = useState<
    RestaurantCategory[]
  >([]);

  const [menuItems, setMenuItems] = useState<
    RestaurantMenuItem[]
  >([]);

  const [orders, setOrders] = useState<
    RestaurantOrder[]
  >([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const loadRestaurant = useCallback(
    async () => {
      try {
        setLoading(true);
        setError("");

        const [
          categoriesData,
          menuItemsData,
          ordersData,
        ] = await Promise.all([
          getRestaurantCategories(),
          getRestaurantMenuItems(),
          getRestaurantOrders(),
        ]);

        setCategories(categoriesData);
        setMenuItems(menuItemsData);
        setOrders(ordersData);
      } catch (err) {
        console.error(
          "Failed to load restaurant data:",
          err
        );

        setError(
          "Failed to load restaurant data."
        );
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    loadRestaurant();
  }, [loadRestaurant]);

  const addCategory = async (
    payload: CreateRestaurantCategoryPayload
  ) => {
    const category =
      await createRestaurantCategory(
        payload
      );

    setCategories((current) => [
      ...current,
      category,
    ]);

    return category;
  };

  const addMenuItem = async (
    payload: CreateRestaurantMenuItemPayload
  ) => {
    const menuItem =
      await createRestaurantMenuItem(
        payload
      );

    setMenuItems((current) => [
      ...current,
      menuItem,
    ]);

    return menuItem;
  };

  const createOrder = async () => {
    const order =
      await createRestaurantOrder();

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
    reload: loadRestaurant,
    addCategory,
    addMenuItem,
    createOrder,
  };
}