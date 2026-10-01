import { useMemo, useState } from "react";

import DashboardLayout from "../../../layouts/DashboardLayout";

import CategoryFormModal from "../components/CategoryFormModal";
import CurrentOrder from "../components/CurrentOrder";
import MenuItemCard from "../components/MenuItemCard";
import MenuItemFormModal from "../components/MenuItemFormModal";
import PaymentModal from "../components/PaymentModal";
import RestaurantCategoryTabs from "../components/RestaurantCategoryTabs";
import RestaurantStatCard from "../components/RestaurantStatCard";

import useRestaurant from "../hooks/useRestaurant";

import {
  addRestaurantOrderItem,
  cancelRestaurantOrder,
  cancelRestaurantOrderItem,
  createRestaurantCategory,
  createRestaurantMenuItem,
  createRestaurantOrder,
  getRestaurantBill,
  receiveRestaurantPayment,
  updateRestaurantOrderItemQuantity,
} from "../services/restaurant.service";

import type {
  CreateRestaurantCategoryPayload,
  CreateRestaurantMenuItemPayload,
  CreateRestaurantPaymentPayload,
  RestaurantBill,
  RestaurantCategory,
  RestaurantMenuItem,
  RestaurantOrder,
  RestaurantOrderItem,
} from "../types/restaurant.types";

export default function Restaurant() {
  const {
    categories,
    menuItems,
    orders,
    loading,
    error,
    reload,
  } = useRestaurant();

  const [selectedCategoryId, setSelectedCategoryId] = useState("all");
  const [currentOrderId, setCurrentOrderId] = useState("");
  const [currentOrder, setCurrentOrder] =
    useState<RestaurantOrder | null>(null);

  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [menuItemModalOpen, setMenuItemModalOpen] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);

  const [editingCategory, setEditingCategory] =
    useState<RestaurantCategory | null>(null);
  const [editingMenuItem, setEditingMenuItem] =
    useState<RestaurantMenuItem | null>(null);

  const [bill, setBill] = useState<RestaurantBill | null>(null);
  const [actionError, setActionError] = useState("");

  const activeCategories = useMemo(() => {
    return categories.filter((category) => category.isActive);
  }, [categories]);

  const activeMenuItems = useMemo(() => {
    return menuItems.filter((item) => {
      if (!item.isActive) {
        return false;
      }

      if (selectedCategoryId === "all") {
        return true;
      }

      return item.categoryId === selectedCategoryId;
    });
  }, [menuItems, selectedCategoryId]);

  const openOrders = useMemo(() => {
    return orders.filter((order) => order.status === "OPEN");
  }, [orders]);

  const totalSales = useMemo(() => {
    return orders
      .filter((order) => order.paymentStatus === "PAID")
      .reduce((sum, order) => sum + Number(order.total), 0);
  }, [orders]);

  const handleCreateCategory = async (
    payload: CreateRestaurantCategoryPayload
  ) => {
    await createRestaurantCategory(payload);
    await reload();
  };

  const handleCreateMenuItem = async (
    payload: CreateRestaurantMenuItemPayload
  ) => {
    await createRestaurantMenuItem(payload);
    await reload();
  };

  const handleCreateOrder = async () => {
    try {
      setActionError("");

      const order = await createRestaurantOrder();

      setCurrentOrderId(order.id);
      setCurrentOrder(order);

      await reload();
    } catch (err) {
      console.error("Failed to create restaurant order:", err);
      setActionError("Failed to create order.");
    }
  };

  const handleSelectOrder = (order: RestaurantOrder) => {
    setCurrentOrderId(order.id);
    setCurrentOrder(order);
  };

  const handleAddItem = async (item: RestaurantMenuItem) => {
    try {
      setActionError("");

      let order = currentOrder;

      if (!order) {
        order = await createRestaurantOrder();
        setCurrentOrderId(order.id);
        setCurrentOrder(order);
      }

      const updatedOrder = await addRestaurantOrderItem({
        orderId: order.id,
        menuItemId: item.id,
        quantity: 1,
      });

      setCurrentOrder(updatedOrder);

      await reload();
    } catch (err) {
      console.error("Failed to add restaurant item:", err);
      setActionError("Failed to add item to order.");
    }
  };

  const handleIncrease = async (item: RestaurantOrderItem) => {
    try {
      setActionError("");

      const updatedItem = await updateRestaurantOrderItemQuantity(
        item.id,
        {
          quantity: item.quantity + 1,
        }
      );

      if (currentOrder) {
        const updatedItems = currentOrder.items.map((currentItem) => {
          if (currentItem.id === updatedItem.id) {
            return updatedItem;
          }

          return currentItem;
        });

        const updatedOrder = {
          ...currentOrder,
          items: updatedItems,
          subtotal: updatedItems.reduce(
            (sum, currentItem) => sum + Number(currentItem.total),
            0
          ),
        };

        setCurrentOrder(updatedOrder);
      }

      await reload();
    } catch (err) {
      console.error("Failed to increase item quantity:", err);
      setActionError("Failed to update item quantity.");
    }
  };

  const handleDecrease = async (item: RestaurantOrderItem) => {
    if (item.quantity <= 1) {
      await handleRemove(item);
      return;
    }

    try {
      setActionError("");

      const updatedItem = await updateRestaurantOrderItemQuantity(
        item.id,
        {
          quantity: item.quantity - 1,
        }
      );

      if (currentOrder) {
        const updatedItems = currentOrder.items.map((currentItem) => {
          if (currentItem.id === updatedItem.id) {
            return updatedItem;
          }

          return currentItem;
        });

        setCurrentOrder({
          ...currentOrder,
          items: updatedItems,
        });
      }

      await reload();
    } catch (err) {
      console.error("Failed to decrease item quantity:", err);
      setActionError("Failed to update item quantity.");
    }
  };

  const handleRemove = async (item: RestaurantOrderItem) => {
    try {
      setActionError("");

      await cancelRestaurantOrderItem(item.id);

      if (currentOrder) {
        const updatedItems = currentOrder.items.map((currentItem) => {
          if (currentItem.id === item.id) {
            return {
              ...currentItem,
              status: "CANCELLED" as const,
            };
          }

          return currentItem;
        });

        setCurrentOrder({
          ...currentOrder,
          items: updatedItems,
        });
      }

      await reload();
    } catch (err) {
      console.error("Failed to remove restaurant item:", err);
      setActionError("Failed to remove item.");
    }
  };

  const handleOpenPayment = async () => {
    if (!currentOrder) {
      return;
    }

    try {
      setActionError("");

      const orderBill = await getRestaurantBill(currentOrder.id);

      setBill(orderBill);
      setPaymentModalOpen(true);
    } catch (err) {
      console.error("Failed to load restaurant bill:", err);
      setActionError("Failed to load order bill.");
    }
  };

  const handlePayment = async (
    payload: CreateRestaurantPaymentPayload
  ) => {
    await receiveRestaurantPayment(payload);

    const updatedBill = await getRestaurantBill(payload.orderId);

    setBill(updatedBill);

    const matchingOrder = orders.find(
      (order) => order.id === payload.orderId
    );

    if (matchingOrder) {
      setCurrentOrder({
        ...matchingOrder,
        paymentStatus: updatedBill.paymentStatus,
      });
    }

    await reload();
  };

  const handleCancelOrder = async () => {
    if (!currentOrder) {
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to cancel this order?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setActionError("");

      const cancelledOrder = await cancelRestaurantOrder(
        currentOrder.id
      );

      setCurrentOrder(cancelledOrder);

      await reload();
    } catch (err) {
      console.error("Failed to cancel restaurant order:", err);
      setActionError("Failed to cancel order.");
    }
  };

  const handleNewOrder = async () => {
    await handleCreateOrder();
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Restaurant POS
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Manage restaurant orders, menu items, and payments.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => {
                setEditingCategory(null);
                setCategoryModalOpen(true);
              }}
              className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Add Category
            </button>

            <button
              type="button"
              onClick={() => {
                setEditingMenuItem(null);
                setMenuItemModalOpen(true);
              }}
              disabled={activeCategories.length === 0}
              className="rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              Add Menu Item
            </button>

            <button
              type="button"
              onClick={handleNewOrder}
              className="rounded-lg bg-green-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-green-700"
            >
              New Order
            </button>
          </div>
        </div>

        {(error || actionError) && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {actionError || error}
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <RestaurantStatCard
            label="Menu Items"
            value={menuItems.filter((item) => item.isActive).length}
            description="Active menu items"
          />

          <RestaurantStatCard
            label="Categories"
            value={activeCategories.length}
            description="Active categories"
          />

          <RestaurantStatCard
            label="Open Orders"
            value={openOrders.length}
            description="Orders awaiting completion"
          />

          <RestaurantStatCard
            label="Paid Sales"
            value={`KES ${totalSales.toLocaleString()}`}
            description="Paid orders currently loaded"
          />
        </div>

        {loading ? (
          <div className="rounded-xl border border-slate-200 bg-white p-10 text-center shadow-sm">
            <p className="text-sm text-slate-500">
              Loading restaurant...
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
            <div className="space-y-5">
              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <RestaurantCategoryTabs
                  categories={activeCategories}
                  selectedCategoryId={selectedCategoryId}
                  onSelect={setSelectedCategoryId}
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {activeMenuItems.length === 0 ? (
                  <div className="col-span-full rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center">
                    <p className="text-sm font-medium text-slate-600">
                      No menu items found
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      Add menu items or choose another category.
                    </p>
                  </div>
                ) : (
                  activeMenuItems.map((item) => (
                    <MenuItemCard
                      key={item.id}
                      item={item}
                      onAdd={handleAddItem}
                    />
                  ))
                )}
              </div>
            </div>

            <div className="space-y-4">
              {openOrders.length > 0 && (
                <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                  <p className="mb-3 text-sm font-semibold text-slate-900">
                    Open Orders
                  </p>

                  <div className="flex gap-2 overflow-x-auto">
                    {openOrders.map((order) => (
                      <button
                        key={order.id}
                        type="button"
                        onClick={() => handleSelectOrder(order)}
                        className={`whitespace-nowrap rounded-lg px-3 py-2 text-xs font-medium ${
                          currentOrderId === order.id
                            ? "bg-slate-900 text-white"
                            : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                        }`}
                      >
                        {order.orderNumber}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <CurrentOrder
                order={currentOrder}
                onIncrease={handleIncrease}
                onDecrease={handleDecrease}
                onRemove={handleRemove}
                onPayment={handleOpenPayment}
                onCancel={handleCancelOrder}
              />
            </div>
          </div>
        )}
      </div>

      <CategoryFormModal
        isOpen={categoryModalOpen}
        category={editingCategory}
        onClose={() => {
          setCategoryModalOpen(false);
          setEditingCategory(null);
        }}
        onSubmit={handleCreateCategory}
      />

      <MenuItemFormModal
        isOpen={menuItemModalOpen}
        categories={activeCategories}
        menuItem={editingMenuItem}
        onClose={() => {
          setMenuItemModalOpen(false);
          setEditingMenuItem(null);
        }}
        onSubmit={handleCreateMenuItem}
      />

      <PaymentModal
        isOpen={paymentModalOpen}
        bill={bill}
        onClose={() => {
          setPaymentModalOpen(false);
          setBill(null);
        }}
        onSubmit={handlePayment}
      />
    </DashboardLayout>
  );
}