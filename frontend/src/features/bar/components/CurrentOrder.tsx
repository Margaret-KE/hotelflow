import type {
  BarOrder,
  BarOrderItem,
} from "../types/bar.types";

import OrderItemRow from "./OrderItemRow";

interface CurrentOrderProps {
  order: BarOrder | null;
  onQuantityChange: (
    item: BarOrderItem,
    quantity: number
  ) => void;
  onRemoveItem: (item: BarOrderItem) => void;
  onPay: () => void;
  onCancelOrder: () => void;
  onNewOrder: () => void;
  disabled?: boolean;
}

export default function CurrentOrder({
  order,
  onQuantityChange,
  onRemoveItem,
  onPay,
  onCancelOrder,
  onNewOrder,
  disabled = false,
}: CurrentOrderProps) {
  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
      maximumFractionDigits: 2,
    }).format(amount);

  if (!order) {
    return (
      <div className="flex h-full min-h-[420px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-3xl">
          +
        </div>

        <h3 className="text-lg font-semibold text-slate-900">
          No Active Order
        </h3>

        <p className="mt-1 max-w-xs text-sm text-slate-500">
          Create a new bar order to start adding drinks and
          other bar items.
        </p>

        <button
          type="button"
          onClick={onNewOrder}
          disabled={disabled}
          className="mt-5 rounded-xl bg-emerald-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          New Bar Order
        </button>
      </div>
    );
  }

  const isOpen = order.status === "OPEN";
  const hasItems = order.items.length > 0;

  return (
    <div className="flex h-full min-h-[420px] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Current Order
            </p>

            <h3 className="mt-1 text-lg font-bold text-slate-900">
              {order.orderNumber}
            </h3>

            {order.guest && (
              <p className="mt-1 text-sm text-slate-500">
                {order.guest.firstName}{" "}
                {order.guest.lastName}
              </p>
            )}
          </div>

          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              order.paymentStatus === "PAID"
                ? "bg-emerald-100 text-emerald-700"
                : order.paymentStatus === "PARTIAL"
                  ? "bg-amber-100 text-amber-700"
                  : order.status === "CANCELLED"
                    ? "bg-red-100 text-red-700"
                    : "bg-slate-100 text-slate-600"
            }`}
          >
            {order.paymentStatus.replace("_", " ")}
          </span>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-5">
        {!hasItems ? (
          <div className="flex min-h-[240px] items-center justify-center text-center">
            <div>
              <p className="font-medium text-slate-700">
                No items yet
              </p>

              <p className="mt-1 text-sm text-slate-400">
                Select a bar item to add it to this order.
              </p>
            </div>
          </div>
        ) : (
          <div>
            {order.items.map((item) => (
              <OrderItemRow
                key={item.id}
                item={item}
                onQuantityChange={onQuantityChange}
                onRemove={onRemoveItem}
                disabled={!isOpen || disabled}
              />
            ))}
          </div>
        )}
      </div>

      <div className="border-t border-slate-200 bg-slate-50 p-5">
        <div className="space-y-2 text-sm">
          <div className="flex justify-between gap-4">
            <span className="text-slate-500">
              Subtotal
            </span>

            <span className="font-medium text-slate-800">
              {formatCurrency(order.subtotal)}
            </span>
          </div>

          <div className="flex justify-between gap-4">
            <span className="text-slate-500">
              VAT
            </span>

            <span className="font-medium text-slate-800">
              {formatCurrency(order.tax)}
            </span>
          </div>

          <div className="flex justify-between gap-4">
            <span className="text-slate-500">
              Service Charge
            </span>

            <span className="font-medium text-slate-800">
              {formatCurrency(order.serviceCharge)}
            </span>
          </div>

          {order.discount > 0 && (
            <div className="flex justify-between gap-4">
              <span className="text-slate-500">
                Discount
              </span>

              <span className="font-medium text-red-600">
                -{formatCurrency(order.discount)}
              </span>
            </div>
          )}

          <div className="flex justify-between gap-4 border-t border-slate-200 pt-3">
            <span className="font-semibold text-slate-900">
              Total
            </span>

            <span className="text-lg font-bold text-slate-900">
              {formatCurrency(order.total)}
            </span>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={onCancelOrder}
            disabled={
              disabled ||
              !isOpen ||
              order.paymentStatus === "PAID"
            }
            className="rounded-xl border border-red-200 px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Cancel Order
          </button>

          <button
            type="button"
            onClick={onPay}
            disabled={
              disabled ||
              !isOpen ||
              !hasItems ||
              order.paymentStatus === "PAID"
            }
            className="rounded-xl bg-emerald-700 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {order.paymentStatus === "PARTIAL"
              ? "Complete Payment"
              : "Receive Payment"}
          </button>
        </div>

        <button
          type="button"
          onClick={onNewOrder}
          disabled={disabled}
          className="mt-3 w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          New Order
        </button>
      </div>
    </div>
  );
}