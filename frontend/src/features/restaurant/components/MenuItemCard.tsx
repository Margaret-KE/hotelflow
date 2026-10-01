import type { RestaurantMenuItem } from "../types/restaurant.types";

interface MenuItemCardProps {
  item: RestaurantMenuItem;
  onAdd: (item: RestaurantMenuItem) => void;
}

export default function MenuItemCard({
  item,
  onAdd,
}: MenuItemCardProps) {
  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md">
      {item.imageUrl ? (
        <img
          src={item.imageUrl}
          alt={item.name}
          className="h-40 w-full object-cover"
        />
      ) : (
        <div className="flex h-40 w-full items-center justify-center bg-slate-100">
          <span className="text-sm text-slate-400">No image</span>
        </div>
      )}

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="font-semibold text-slate-900">
              {item.name}
            </h3>

            {item.description && (
              <p className="mt-1 line-clamp-2 text-sm text-slate-500">
                {item.description}
              </p>
            )}
          </div>

          <span className="whitespace-nowrap text-sm font-semibold text-slate-900">
            KES {Number(item.price).toLocaleString()}
          </span>
        </div>

        <div className="mt-auto pt-4">
          <button
            type="button"
            onClick={() => onAdd(item)}
            disabled={!item.available || !item.isActive}
            className="w-full rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {!item.isActive
              ? "Unavailable"
              : !item.available
                ? "Not Available"
                : "Add to Order"}
          </button>
        </div>
      </div>
    </div>
  );
}