import type { RestaurantCategory } from "../types/restaurant.types";

interface RestaurantCategoryTabsProps {
  categories: RestaurantCategory[];
  selectedCategoryId: string;
  onSelect: (categoryId: string) => void;
}

export default function RestaurantCategoryTabs({
  categories,
  selectedCategoryId,
  onSelect,
}: RestaurantCategoryTabsProps) {
  return (
    <div className="flex gap-2 overflow-x-auto border-b border-slate-200 pb-3">
      <button
        type="button"
        onClick={() => onSelect("all")}
        className={`whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition ${
          selectedCategoryId === "all"
            ? "bg-slate-900 text-white"
            : "bg-slate-100 text-slate-700 hover:bg-slate-200"
        }`}
      >
        All Items
      </button>

      {categories.map((category) => (
        <button
          key={category.id}
          type="button"
          onClick={() => onSelect(category.id)}
          className={`whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition ${
            selectedCategoryId === category.id
              ? "bg-slate-900 text-white"
              : "bg-slate-100 text-slate-700 hover:bg-slate-200"
          }`}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
}