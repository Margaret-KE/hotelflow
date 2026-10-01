import type { RestaurantOrderItem } from "../types/restaurant.types";

interface OrderItemRowProps {
  item: RestaurantOrderItem;
  onIncrease: (item: RestaurantOrderItem) => void;
  onDecrease: (item: RestaurantOrderItem) => void;
  onRemove: (item: RestaurantOrderItem) => void;
}

export default function OrderItemRow({
  item,
  onIncrease,
  onDecrease,
  onRemove,
}: OrderItemRowProps) {
  const isCancelled = item.status === "CANCELLED";

  return (
    <div className="border-b border-slate-100 py-4 last:border-b-0">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h4 className="truncate font-medium text-slate-900">
            {item.menuItem.name}
          </h4>

          <p className="mt-1 text-xs text-slate-500">
            KES {Number(item.unitPrice).toLocaleString()} each
          </p>

          {isCancelled && (
            <span className="mt-1 inline-block text-xs font-medium text-red-600">
              Cancelled
            </span>
          )}
        </div>

        <p className="whitespace-nowrap text-sm font-semibold text-slate-900">
          KES {Number(item.total).toLocaleString()}
        </p>
      </div>

      {!isCancelled && (
        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center rounded-lg border border-slate-200">
            <button
              type="button"
              onClick={() => onDecrease(item)}
              className="px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
            >
              −
            </button>

            <span className="min-w-9 text-center text-sm font-medium text-slate-900">
              {item.quantity}
            </span>

            <button
              type="button"
              onClick={() => onIncrease(item)}
              className="px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
            >
              +
            </button>
          </div>

          <button
            type="button"
            onClick={() => onRemove(item)}
            className="text-xs font-medium text-red-600 hover:text-red-700"
          >
            Remove
          </button>
        </div>
      )}
    </div>
  );
}