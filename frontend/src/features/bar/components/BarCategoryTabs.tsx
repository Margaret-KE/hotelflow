import type { BarCategory } from "../types/bar.types";

interface BarCategoryTabsProps {
  categories: BarCategory[];
  selectedCategoryId: string;
  onSelect: (categoryId: string) => void;
}

export default function BarCategoryTabs({
  categories,
  selectedCategoryId,
  onSelect,
}: BarCategoryTabsProps) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2">
      <button
        type="button"
        onClick={() => onSelect("all")}
        className={`whitespace-nowrap rounded-xl px-4 py-2 text-sm font-medium transition ${
          selectedCategoryId === "all"
            ? "bg-slate-900 text-white"
            : "bg-white text-slate-600 hover:bg-slate-100"
        }`}
      >
        All Items
      </button>

      {categories.map((category) => (
        <button
          key={category.id}
          type="button"
          onClick={() => onSelect(category.id)}
          className={`whitespace-nowrap rounded-xl px-4 py-2 text-sm font-medium transition ${
            selectedCategoryId === category.id
              ? "bg-slate-900 text-white"
              : "bg-white text-slate-600 hover:bg-slate-100"
          }`}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
}