import type { BarMenuItem } from "../types/bar.types";

interface MenuItemCardProps {
  menuItem: BarMenuItem;
  onAdd: (menuItem: BarMenuItem) => void;
  disabled?: boolean;
}

export default function MenuItemCard({
  menuItem,
  onAdd,
  disabled = false,
}: MenuItemCardProps) {
  const formattedPrice = new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    maximumFractionDigits: 2,
  }).format(menuItem.price);

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      {menuItem.imageUrl ? (
        <img
          src={menuItem.imageUrl}
          alt={menuItem.name}
          className="h-36 w-full object-cover"
        />
      ) : (
        <div className="flex h-36 items-center justify-center bg-slate-100 text-4xl">
          <span aria-hidden="true">🥤</span>
        </div>
      )}

      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-slate-900">
            {menuItem.name}
          </h3>

          {!menuItem.available && (
            <span className="shrink-0 rounded-full bg-red-50 px-2 py-1 text-xs font-medium text-red-600">
              Unavailable
            </span>
          )}
        </div>

        {menuItem.description && (
          <p className="mt-1 line-clamp-2 text-sm text-slate-500">
            {menuItem.description}
          </p>
        )}

        <div className="mt-4 flex items-center justify-between gap-3">
          <span className="font-bold text-slate-900">
            {formattedPrice}
          </span>

          <button
            type="button"
            onClick={() => onAdd(menuItem)}
            disabled={disabled || !menuItem.available}
            className="rounded-lg bg-emerald-700 px-3 py-2 text-sm font-medium text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            Add to Order
          </button>
        </div>
      </div>
    </div>
  );
}