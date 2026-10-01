import { useEffect, useState } from "react";
import type { FormEvent } from "react";

import type {
  CreateRestaurantMenuItemPayload,
  RestaurantCategory,
  RestaurantMenuItem,
} from "../types/restaurant.types";

interface MenuItemFormModalProps {
  isOpen: boolean;
  categories: RestaurantCategory[];
  menuItem?: RestaurantMenuItem | null;
  onClose: () => void;
  onSubmit: (payload: CreateRestaurantMenuItemPayload) => Promise<void>;
}

export default function MenuItemFormModal({
  isOpen,
  categories,
  menuItem,
  onClose,
  onSubmit,
}: MenuItemFormModalProps) {
  const [categoryId, setCategoryId] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [available, setAvailable] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const isEditing = Boolean(menuItem);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    if (menuItem) {
      setCategoryId(menuItem.categoryId);
      setName(menuItem.name);
      setDescription(menuItem.description || "");
      setPrice(String(menuItem.price));
      setImageUrl(menuItem.imageUrl || "");
      setAvailable(menuItem.available);
    } else {
      setCategoryId("");
      setName("");
      setDescription("");
      setPrice("");
      setImageUrl("");
      setAvailable(true);
    }

    setError("");
  }, [isOpen, menuItem]);

  if (!isOpen) {
    return null;
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!categoryId) {
      setError("Please select a category.");
      return;
    }

    if (!name.trim()) {
      setError("Menu item name is required.");
      return;
    }

    const numericPrice = Number(price);

    if (!price || Number.isNaN(numericPrice) || numericPrice <= 0) {
      setError("Please enter a valid price greater than zero.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      await onSubmit({
        categoryId,
        name: name.trim(),
        description: description.trim() || undefined,
        price: numericPrice,
        imageUrl: imageUrl.trim() || undefined,
        available,
      });

      onClose();
    } catch (err) {
      console.error("Failed to save restaurant menu item:", err);
      setError("Failed to save menu item. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              {isEditing ? "Edit Menu Item" : "Add Menu Item"}
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Add an item to the restaurant menu.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-xl leading-none text-slate-400 hover:text-slate-700"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 px-6 py-5">
            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <div>
              <label
                htmlFor="restaurant-menu-category"
                className="mb-1.5 block text-sm font-medium text-slate-700"
              >
                Category
              </label>

              <select
                id="restaurant-menu-category"
                value={categoryId}
                onChange={(event) => setCategoryId(event.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
              >
                <option value="">Select category</option>

                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="restaurant-menu-name"
                className="mb-1.5 block text-sm font-medium text-slate-700"
              >
                Item Name
              </label>

              <input
                id="restaurant-menu-name"
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="e.g. Grilled Chicken"
                maxLength={100}
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
              />
            </div>

            <div>
              <label
                htmlFor="restaurant-menu-description"
                className="mb-1.5 block text-sm font-medium text-slate-700"
              >
                Description
              </label>

              <textarea
                id="restaurant-menu-description"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Optional description"
                rows={3}
                className="w-full resize-none rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="restaurant-menu-price"
                  className="mb-1.5 block text-sm font-medium text-slate-700"
                >
                  Price (KES)
                </label>

                <input
                  id="restaurant-menu-price"
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={price}
                  onChange={(event) => setPrice(event.target.value)}
                  placeholder="0.00"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                />
              </div>

              <div>
                <label
                  htmlFor="restaurant-menu-image"
                  className="mb-1.5 block text-sm font-medium text-slate-700"
                >
                  Image URL
                </label>

                <input
                  id="restaurant-menu-image"
                  type="url"
                  value={imageUrl}
                  onChange={(event) => setImageUrl(event.target.value)}
                  placeholder="https://..."
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                />
              </div>
            </div>

            <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-slate-200 p-3">
              <input
                type="checkbox"
                checked={available}
                onChange={(event) => setAvailable(event.target.checked)}
                className="h-4 w-4 rounded border-slate-300"
              />

              <span>
                <span className="block text-sm font-medium text-slate-700">
                  Available for ordering
                </span>

                <span className="block text-xs text-slate-500">
                  Staff can add this item to restaurant orders.
                </span>
              </span>
            </label>
          </div>

          <div className="flex justify-end gap-3 border-t border-slate-200 px-6 py-4">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving || categories.length === 0}
              className="rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving
                ? "Saving..."
                : isEditing
                  ? "Save Changes"
                  : "Add Menu Item"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}