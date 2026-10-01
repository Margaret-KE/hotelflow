import type { BarOrder } from "../types/bar.types";

interface OpenOrdersPanelProps {
  orders: BarOrder[];
  selectedOrderId: string | null;
  onSelect: (orderId: string) => void;
  onNewOrder: () => void;
}

export default function OpenOrdersPanel({
  orders,
  selectedOrderId,
  onSelect,
  onNewOrder,
}: OpenOrdersPanelProps) {
  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
      maximumFractionDigits: 2,
    }).format(amount);

  const openOrders = orders.filter(
    (order) => order.status === "OPEN"
  );

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h2 className="font-semibold text-slate-900">
            Open Orders
          </h2>

          <p className="mt-1 text-xs text-slate-500">
            Select an active bar order
          </p>
        </div>

        <button
          type="button"
          onClick={onNewOrder}
          className="rounded-xl bg-emerald-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-800"
        >
          + New Order
        </button>
      </div>

      {openOrders.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-5 text-center">
          <p className="text-sm font-medium text-slate-700">
            No open orders
          </p>

          <p className="mt-1 text-xs text-slate-500">
            Create a new order to start serving customers.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {openOrders.map((order) => {
            const isSelected =
              selectedOrderId === order.id;

            const itemCount = order.items.reduce(
              (total, item) => total + item.quantity,
              0
            );

            return (
              <button
                key={order.id}
                type="button"
                onClick={() => onSelect(order.id)}
                className={`w-full rounded-xl border p-3 text-left transition ${
                  isSelected
                    ? "border-emerald-600 bg-emerald-50 ring-1 ring-emerald-600"
                    : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="font-semibold text-slate-900">
                      {order.orderNumber}
                    </div>

                    {order.guest ? (
                      <div className="mt-1 truncate text-xs text-slate-500">
                        {order.guest.firstName}{" "}
                        {order.guest.lastName}
                      </div>
                    ) : (
                      <div className="mt-1 text-xs text-slate-400">
                        Walk-in customer
                      </div>
                    )}
                  </div>

                  <span
                    className={`shrink-0 rounded-full px-2 py-1 text-xs font-medium ${
                      order.paymentStatus === "PAID"
                        ? "bg-emerald-100 text-emerald-700"
                        : order.paymentStatus === "PARTIAL"
                          ? "bg-amber-100 text-amber-700"
                          : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {order.paymentStatus}
                  </span>
                </div>

                <div className="mt-3 flex items-center justify-between gap-3 text-xs">
                  <span className="text-slate-500">
                    {itemCount}{" "}
                    {itemCount === 1 ? "item" : "items"}
                  </span>

                  <span className="font-semibold text-slate-800">
                    {formatCurrency(order.total)}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}