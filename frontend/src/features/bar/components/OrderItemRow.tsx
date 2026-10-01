import type { BarOrderItem } from "../types/bar.types";

interface OrderItemRowProps {
  item: BarOrderItem;
  onQuantityChange: (
    item: BarOrderItem,
    quantity: number
  ) => void;
  onRemove: (item: BarOrderItem) => void;
  disabled?: boolean;
}

export default function OrderItemRow({
  item,
  onQuantityChange,
  onRemove,
  disabled = false,
}: OrderItemRowProps) {
  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
      maximumFractionDigits: 2,
    }).format(amount);

  const canEdit =
    !disabled && item.status === "PENDING";

  return (
    <div className="border-b border-slate-100 py-3 last:border-b-0">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h4 className="font-medium text-slate-800">
            {item.menuItem.name}
          </h4>

          <p className="mt-1 text-xs text-slate-500">
            {formatCurrency(item.unitPrice)} each
          </p>

          <span
            className={`mt-2 inline-flex rounded-full px-2 py-1 text-xs font-medium ${
              item.status === "SERVED"
                ? "bg-emerald-100 text-emerald-700"
                : item.status === "READY"
                  ? "bg-blue-100 text-blue-700"
                  : item.status === "PREPARING"
                    ? "bg-amber-100 text-amber-700"
                    : item.status === "CANCELLED"
                      ? "bg-red-100 text-red-700"
                      : "bg-slate-100 text-slate-600"
            }`}
          >
            {item.status.replace("_", " ")}
          </span>
        </div>

        <div className="text-right">
          <p className="font-semibold text-slate-900">
            {formatCurrency(item.total)}
          </p>

          {canEdit && (
            <button
              type="button"
              onClick={() => onRemove(item)}
              className="mt-2 text-xs font-medium text-red-600 hover:text-red-700"
            >
              Remove
            </button>
          )}
        </div>
      </div>

      <div className="mt-3 flex items-center gap-3">
        <button
          type="button"
          onClick={() =>
            onQuantityChange(item, item.quantity - 1)
          }
          disabled={!canEdit || item.quantity <= 1}
          aria-label={`Decrease ${item.menuItem.name} quantity`}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
        >
          −
        </button>

        <span className="min-w-6 text-center text-sm font-semibold text-slate-800">
          {item.quantity}
        </span>

        <button
          type="button"
          onClick={() =>
            onQuantityChange(item, item.quantity + 1)
          }
          disabled={!canEdit}
          aria-label={`Increase ${item.menuItem.name} quantity`}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
        >
          +
        </button>
      </div>
    </div>
  );
}