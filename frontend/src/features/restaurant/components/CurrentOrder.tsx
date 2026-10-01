import OrderItemRow from "./OrderItemRow";
import OrderSummary from "./OrderSummary";

import type {
  RestaurantOrder,
  RestaurantOrderItem,
} from "../types/restaurant.types";

interface CurrentOrderProps {
  order: RestaurantOrder | null;
  onIncrease: (item: RestaurantOrderItem) => void;
  onDecrease: (item: RestaurantOrderItem) => void;
  onRemove: (item: RestaurantOrderItem) => void;
  onPayment: () => void;
  onCancel: () => void;
}

export default function CurrentOrder({
  order,
  onIncrease,
  onDecrease,
  onRemove,
  onPayment,
  onCancel,
}: CurrentOrderProps) {
  return (
    <div className="flex h-full flex-col gap-4">
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 p-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Current Order
              </h2>

              {order && (
                <p className="mt-1 text-xs text-slate-500">
                  {order.orderNumber}
                </p>
              )}
            </div>

            {order && (
              <span
                className={`rounded-full px-3 py-1 text-xs font-medium ${
                  order.status === "OPEN"
                    ? "bg-green-100 text-green-700"
                    : order.status === "COMPLETED"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-red-100 text-red-700"
                }`}
              >
                {order.status.replace("_", " ")}
              </span>
            )}
          </div>
        </div>

        <div className="max-h-[420px] overflow-y-auto px-5">
          {!order || order.items.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-sm font-medium text-slate-500">
                No items in this order
              </p>

              <p className="mt-1 text-xs text-slate-400">
                Select a menu item to add it to the order.
              </p>
            </div>
          ) : (
            order.items.map((item) => (
              <OrderItemRow
                key={item.id}
                item={item}
                onIncrease={onIncrease}
                onDecrease={onDecrease}
                onRemove={onRemove}
              />
            ))
          )}
        </div>
      </div>

      <OrderSummary
        order={order}
        onPayment={onPayment}
        onCancel={onCancel}
      />
    </div>
  );
}