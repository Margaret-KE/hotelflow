import { useMemo, useState } from "react";

import DashboardLayout from "../../../layouts/DashboardLayout";

import BarCategoryTabs from "../components/BarCategoryTabs";
import BarStatCard from "../components/BarStatCard";
import CategoryFormModal from "../components/CategoryFormModal";
import CurrentOrder from "../components/CurrentOrder";
import MenuItemCard from "../components/MenuItemCard";
import MenuItemFormModal from "../components/MenuItemFormModal";
import OpenOrdersPanel from "../components/OpenOrdersPanel";
import PaymentModal from "../components/PaymentModal";

import useBar from "../hooks/useBar";

import {
  addBarOrderItem,
  cancelBarOrder,
  cancelBarOrderItem,
  createBarOrder,
  deleteBarCategory,
  deleteBarMenuItem,
  getBarBill,
  getBarOrder,
  receiveBarPayment,
  updateBarCategory,
  updateBarMenuItem,
  updateBarOrderItemQuantity,
} from "../services/bar.service";

import type {
  BarBill,
  BarCategory,
  BarMenuItem,
  BarOrderItem,
  BarPayment,
  BarPaymentMethod,
  CreateBarCategoryPayload,
  CreateBarMenuItemPayload,
  UpdateBarCategoryPayload,
  UpdateBarMenuItemPayload,
} from "../types/bar.types";

export default function Bar() {
  const {
    categories,
    menuItems,
    orders,
    loading,
    error,
    reload,
    addCategory,
    addMenuItem,
  } = useBar();

  const [selectedCategoryId, setSelectedCategoryId] =
    useState("all");

  const [currentOrderId, setCurrentOrderId] =
    useState<string | null>(null);

  const [paymentBill, setPaymentBill] =
    useState<BarBill | null>(null);

  const [paymentOpen, setPaymentOpen] =
    useState(false);

  const [categoryModalOpen, setCategoryModalOpen] =
    useState(false);

  const [editingCategory, setEditingCategory] =
    useState<BarCategory | null>(null);

  const [menuItemModalOpen, setMenuItemModalOpen] =
    useState(false);

  const [editingMenuItem, setEditingMenuItem] =
    useState<BarMenuItem | null>(null);

  const [saving, setSaving] = useState(false);
  const [actionError, setActionError] = useState("");

  const currentOrder = useMemo(() => {
    if (!currentOrderId) {
      return null;
    }

    return (
      orders.find(
        (order) => order.id === currentOrderId
      ) || null
    );
  }, [orders, currentOrderId]);

  const openOrders = useMemo(
    () =>
      orders.filter(
        (order) => order.status === "OPEN"
      ),
    [orders]
  );

  const activeMenuItems = useMemo(() => {
    if (selectedCategoryId === "all") {
      return menuItems;
    }

    return menuItems.filter(
      (item) =>
        item.categoryId === selectedCategoryId
    );
  }, [menuItems, selectedCategoryId]);

  const availableMenuItems = useMemo(
    () =>
      menuItems.filter(
        (item) => item.available
      ),
    [menuItems]
  );

  const totalSales = useMemo(
    () =>
      orders
        .filter(
          (order) =>
            order.status !== "CANCELLED"
        )
        .reduce(
          (total, order) =>
            total + order.total,
          0
        ),
    [orders]
  );

  const paidOrders = useMemo(
    () =>
      orders.filter(
        (order) =>
          order.paymentStatus === "PAID"
      ).length,
    [orders]
  );

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
      maximumFractionDigits: 2,
    }).format(amount);

  const handleNewOrder = async () => {
    try {
      setSaving(true);
      setActionError("");

      const order = await createBarOrder();

      await reload();

      setCurrentOrderId(order.id);
    } catch (err) {
      console.error(
        "Failed to create bar order:",
        err
      );

      setActionError(
        "Failed to create a new bar order."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleAddItem = async (
    menuItem: BarMenuItem
  ) => {
    try {
      setSaving(true);
      setActionError("");

      let order = currentOrder;

      if (!order || order.status !== "OPEN") {
        order = await createBarOrder();
        setCurrentOrderId(order.id);
      }

      const updatedOrder =
        await addBarOrderItem({
          orderId: order.id,
          menuItemId: menuItem.id,
          quantity: 1,
        });

      await reload();

      setCurrentOrderId(updatedOrder.id);
    } catch (err) {
      console.error(
        "Failed to add bar item:",
        err
      );

      setActionError(
        "Failed to add item to the order."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleQuantityChange = async (
    item: BarOrderItem,
    quantity: number
  ) => {
    if (quantity <= 0) {
      return;
    }

    try {
      setSaving(true);
      setActionError("");

      await updateBarOrderItemQuantity(
        item.id,
        { quantity }
      );

      await reload();
    } catch (err) {
      console.error(
        "Failed to update bar order item:",
        err
      );

      setActionError(
        "Failed to update item quantity."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleRemoveItem = async (
    item: BarOrderItem
  ) => {
    const confirmed = window.confirm(
      `Remove ${item.menuItem.name} from this order?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setSaving(true);
      setActionError("");

      await cancelBarOrderItem(item.id);

      await reload();
    } catch (err) {
      console.error(
        "Failed to remove bar order item:",
        err
      );

      setActionError(
        "Failed to remove the item."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!currentOrder) {
      return;
    }

    const confirmed = window.confirm(
      `Cancel order ${currentOrder.orderNumber}?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setSaving(true);
      setActionError("");

      await cancelBarOrder(
        currentOrder.id
      );

      setCurrentOrderId(null);

      await reload();
    } catch (err) {
      console.error(
        "Failed to cancel bar order:",
        err
      );

      setActionError(
        "Failed to cancel the order."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleOpenPayment = async () => {
    if (!currentOrder) {
      return;
    }

    try {
      setSaving(true);
      setActionError("");

      const bill = await getBarBill(
        currentOrder.id
      );

      setPaymentBill(bill);
      setPaymentOpen(true);
    } catch (err) {
      console.error(
        "Failed to load bar bill:",
        err
      );

      setActionError(
        "Failed to load the order bill."
      );
    } finally {
      setSaving(false);
    }
  };

  const handlePayment = async (
    amount: number,
    method: BarPaymentMethod,
    details: {
      reference?: string;
      transactionId?: string;
      receiptNumber?: string;
      notes?: string;
    }
  ): Promise<BarPayment> => {
    if (!currentOrder) {
      throw new Error(
        "No current bar order selected."
      );
    }

    const result =
      await receiveBarPayment({
        orderId: currentOrder.id,
        amount,
        method,
        reference: details.reference,
        transactionId:
          details.transactionId,
        receiptNumber:
          details.receiptNumber,
        notes: details.notes,
      });

    await reload();

    const updatedOrder =
      await getBarOrder(
        currentOrder.id
      );

    setCurrentOrderId(updatedOrder.id);

    setPaymentBill(result.bill);

    return result.payment;
  };

  const handleCategorySubmit = async (
    payload:
      | CreateBarCategoryPayload
      | UpdateBarCategoryPayload
  ) => {
    if (editingCategory) {
      await updateBarCategory(
        editingCategory.id,
        payload as UpdateBarCategoryPayload
      );
    } else {
      await addCategory(
        payload as CreateBarCategoryPayload
      );
    }

    await reload();

    setEditingCategory(null);
  };

  const handleDeleteCategory = async (
    category: BarCategory
  ) => {
    const confirmed = window.confirm(
      `Delete bar category "${category.name}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setSaving(true);
      setActionError("");

      await deleteBarCategory(
        category.id
      );

      if (
        selectedCategoryId ===
        category.id
      ) {
        setSelectedCategoryId("all");
      }

      await reload();
    } catch (err) {
      console.error(
        "Failed to delete bar category:",
        err
      );

      setActionError(
        "Failed to delete the category."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleMenuItemSubmit = async (
    payload:
      | CreateBarMenuItemPayload
      | UpdateBarMenuItemPayload
  ) => {
    if (editingMenuItem) {
      await updateBarMenuItem(
        editingMenuItem.id,
        payload as UpdateBarMenuItemPayload
      );
    } else {
      await addMenuItem(
        payload as CreateBarMenuItemPayload
      );
    }

    await reload();

    setEditingMenuItem(null);
  };

  const handleDeleteMenuItem = async (
    menuItem: BarMenuItem
  ) => {
    const confirmed = window.confirm(
      `Delete bar item "${menuItem.name}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setSaving(true);
      setActionError("");

      await deleteBarMenuItem(
        menuItem.id
      );

      await reload();
    } catch (err) {
      console.error(
        "Failed to delete bar menu item:",
        err
      );

      setActionError(
        "Failed to delete the menu item."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleSelectOrder = async (
    orderId: string
  ) => {
    try {
      setSaving(true);
      setActionError("");

      const order =
        await getBarOrder(orderId);

      setCurrentOrderId(order.id);
    } catch (err) {
      console.error(
        "Failed to load bar order:",
        err
      );

      setActionError(
        "Failed to load the selected order."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="text-sm font-medium text-slate-500">
            Loading bar...
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Bar
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Manage bar orders, drinks, payments,
              and service.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => {
                setEditingCategory(null);
                setCategoryModalOpen(true);
              }}
              disabled={saving}
              className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
            >
              + Category
            </button>

            <button
              type="button"
              onClick={() => {
                setEditingMenuItem(null);
                setMenuItemModalOpen(true);
              }}
              disabled={
                saving ||
                categories.length === 0
              }
              className="rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              + Bar Item
            </button>
          </div>
        </div>

        {(error || actionError) && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {actionError || error}
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <BarStatCard
            label="Open Orders"
            value={openOrders.length}
            description="Currently active bar orders"
          />

          <BarStatCard
            label="Menu Items"
            value={menuItems.length}
            description={`${availableMenuItems.length} available`}
          />

          <BarStatCard
            label="Paid Orders"
            value={paidOrders}
            description="Orders fully paid"
          />

          <BarStatCard
            label="Sales"
            value={formatCurrency(totalSales)}
            description="Current loaded orders"
          />
        </div>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
          <div className="min-w-0 space-y-5">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <BarCategoryTabs
                categories={categories}
                selectedCategoryId={
                  selectedCategoryId
                }
                onSelect={
                  setSelectedCategoryId
                }
              />
            </div>

            {activeMenuItems.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
                <h3 className="font-semibold text-slate-800">
                  No bar items found
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Add bar categories and menu
                  items to start taking orders.
                </p>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {activeMenuItems.map(
                  (menuItem) => (
                    <MenuItemCard
                      key={menuItem.id}
                      menuItem={menuItem}
                      onAdd={
                        handleAddItem
                      }
                      disabled={saving}
                    />
                  )
                )}
              </div>
            )}
          </div>

          <div className="space-y-5">
            <OpenOrdersPanel
              orders={orders}
              selectedOrderId={
                currentOrderId
              }
              onSelect={
                handleSelectOrder
              }
              onNewOrder={
                handleNewOrder
              }
            />

            <CurrentOrder
              order={currentOrder}
              onQuantityChange={
                handleQuantityChange
              }
              onRemoveItem={
                handleRemoveItem
              }
              onPay={
                handleOpenPayment
              }
              onCancelOrder={
                handleCancelOrder
              }
              onNewOrder={
                handleNewOrder
              }
              disabled={saving}
            />

            {categories.length > 0 && (
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="mb-3 flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-slate-900">
                      Bar Categories
                    </h3>

                    <p className="mt-1 text-xs text-slate-500">
                      Manage your bar menu
                      categories.
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  {categories.map(
                    (category) => (
                      <div
                        key={category.id}
                        className="flex items-center justify-between gap-3 rounded-xl bg-slate-50 p-3"
                      >
                        <div className="min-w-0">
                          <p className="font-medium text-slate-800">
                            {category.name}
                          </p>

                          {category.description && (
                            <p className="mt-1 truncate text-xs text-slate-500">
                              {
                                category.description
                              }
                            </p>
                          )}
                        </div>

                        <div className="flex shrink-0 gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingCategory(
                                category
                              );
                              setCategoryModalOpen(
                                true
                              );
                            }}
                            disabled={saving}
                            className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-white"
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              handleDeleteCategory(
                                category
                              )
                            }
                            disabled={saving}
                            className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            )}

            {menuItems.length > 0 && (
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="mb-3">
                  <h3 className="font-semibold text-slate-900">
                    Bar Menu
                  </h3>

                  <p className="mt-1 text-xs text-slate-500">
                    Edit availability, pricing,
                    and item details.
                  </p>
                </div>

                <div className="space-y-2">
                  {menuItems.map(
                    (menuItem) => (
                      <div
                        key={menuItem.id}
                        className="flex items-center justify-between gap-3 rounded-xl bg-slate-50 p-3"
                      >
                        <div className="min-w-0">
                          <p className="truncate font-medium text-slate-800">
                            {menuItem.name}
                          </p>

                          <p className="mt-1 text-xs text-slate-500">
                            {menuItem.category
                              ? menuItem
                                  .category
                                  .name
                              : "No category"}{" "}
                            ·{" "}
                            {formatCurrency(
                              menuItem.price
                            )}
                          </p>
                        </div>

                        <div className="flex shrink-0 gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingMenuItem(
                                menuItem
                              );
                              setMenuItemModalOpen(
                                true
                              );
                            }}
                            disabled={saving}
                            className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-white"
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              handleDeleteMenuItem(
                                menuItem
                              )
                            }
                            disabled={saving}
                            className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <CategoryFormModal
        isOpen={categoryModalOpen}
        category={editingCategory}
        onClose={() => {
          if (!saving) {
            setCategoryModalOpen(false);
            setEditingCategory(null);
          }
        }}
        onSubmit={handleCategorySubmit}
      />

      <MenuItemFormModal
        isOpen={menuItemModalOpen}
        menuItem={editingMenuItem}
        categories={categories}
        onClose={() => {
          if (!saving) {
            setMenuItemModalOpen(false);
            setEditingMenuItem(null);
          }
        }}
        onSubmit={handleMenuItemSubmit}
      />

      <PaymentModal
        isOpen={paymentOpen}
        bill={paymentBill}
        onClose={() => {
          if (!saving) {
            setPaymentOpen(false);
            setPaymentBill(null);
          }
        }}
        onSubmit={handlePayment}
      />
    </DashboardLayout>
  );
}