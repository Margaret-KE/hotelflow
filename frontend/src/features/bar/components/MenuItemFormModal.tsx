import { useEffect, useState } from "react";

import type {
  BarCategory,
  BarMenuItem,
  CreateBarMenuItemPayload,
  UpdateBarMenuItemPayload,
} from "../types/bar.types";

interface MenuItemFormModalProps {
  isOpen: boolean;
  menuItem: BarMenuItem | null;
  categories: BarCategory[];
  onClose: () => void;
  onSubmit: (
    payload: CreateBarMenuItemPayload | UpdateBarMenuItemPayload
  ) => Promise<void>;
}

export default function MenuItemFormModal({
  isOpen,
  menuItem,
  categories,
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

  useEffect(() => {
    if (isOpen) {
      setCategoryId(menuItem ? menuItem.categoryId : "");
      setName(menuItem ? menuItem.name : "");
      setDescription(
        menuItem && menuItem.description
          ? menuItem.description
          : ""
      );
      setPrice(
        menuItem ? String(menuItem.price) : ""
      );
      setImageUrl(
        menuItem && menuItem.imageUrl
          ? menuItem.imageUrl
          : ""
      );
      setAvailable(
        menuItem ? menuItem.available : true
      );
      setError("");
    }
  }, [isOpen, menuItem]);

  if (!isOpen) {
    return null;
  }

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const numericPrice = Number(price);

    if (!categoryId) {
      setError("Please select a category.");
      return;
    }

    if (name.trim().length < 2) {
      setError("Item name must contain at least 2 characters.");
      return;
    }

    if (!Number.isFinite(numericPrice) || numericPrice <= 0) {
      setError("Enter a valid price greater than zero.");
      return;
    }

    if (
      imageUrl.trim() &&
      !/^https?:\/\/.+/i.test(imageUrl.trim())
    ) {
      setError("Enter a valid image URL beginning with http:// or https://.");
      return;
    }

    const payload: CreateBarMenuItemPayload = {
      categoryId,
      name: name.trim(),
      description: description.trim(),
      price: numericPrice,
      available,
    };

    if (imageUrl.trim()) {
      payload.imageUrl = imageUrl.trim();
    }

    try {
      setSaving(true);
      setError("");

      await onSubmit(payload);
      onClose();
    } catch (err) {
      console.error("Failed to save bar menu item:", err);
      setError(
        "Failed to save menu item. Check the item name, category, and image URL."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/50 p-4">
      <div className="my-8 w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900">
            {menuItem ? "Edit Bar Item" : "Add Bar Item"}
          </h2>

          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            aria-label="Close modal"
            className="rounded-lg px-3 py-2 text-slate-500 hover:bg-slate-100"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="bar-item-category"
              className="mb-1 block text-sm font-medium text-slate-700"
            >
              Category
            </label>

            <select
              id="bar-item-category"
              value={categoryId}
              onChange={(event) =>
                setCategoryId(event.target.value)
              }
              required
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
            >
              <option value="">Select a category</option>

              {categories.map((category) => (
                <option
                  key={category.id}
                  value={category.id}
                >
                  {category.name}
                </option>
              ))}
            </select>

            {categories.length === 0 && (
              <p className="mt-1 text-xs text-amber-700">
                Create a category before adding menu items.
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="bar-item-name"
              className="mb-1 block text-sm font-medium text-slate-700"
            >
              Item Name
            </label>

            <input
              id="bar-item-name"
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
              minLength={2}
              maxLength={100}
              placeholder="e.g. Fresh Juice"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
            />
          </div>

          <div>
            <label
              htmlFor="bar-item-description"
              className="mb-1 block text-sm font-medium text-slate-700"
            >
              Description
            </label>

            <textarea
              id="bar-item-description"
              value={description}
              onChange={(event) =>
                setDescription(event.target.value)
              }
              rows={2}
              placeholder="Optional description"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
            />
          </div>

          <div>
            <label
              htmlFor="bar-item-price"
              className="mb-1 block text-sm font-medium text-slate-700"
            >
              Price (KES)
            </label>

            <input
              id="bar-item-price"
              type="number"
              value={price}
              onChange={(event) => setPrice(event.target.value)}
              required
              min="0.01"
              step="0.01"
              placeholder="0.00"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
            />
          </div>

          <div>
            <label
              htmlFor="bar-item-image"
              className="mb-1 block text-sm font-medium text-slate-700"
            >
              Image URL
            </label>

            <input
              id="bar-item-image"
              type="url"
              value={imageUrl}
              onChange={(event) => setImageUrl(event.target.value)}
              placeholder="https://example.com/drink.jpg"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
            />
          </div>

          <label className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">
            <input
              type="checkbox"
              checked={available}
              onChange={(event) =>
                setAvailable(event.target.checked)
              }
              className="h-4 w-4 accent-emerald-700"
            />

            <span className="text-sm font-medium text-slate-700">
              Available for ordering
            </span>
          </label>

          {error && (
            <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
              {error}
            </p>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="rounded-xl border border-slate-300 px-4 py-2.5 font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving || categories.length === 0}
              className="rounded-xl bg-emerald-700 px-5 py-2.5 font-medium text-white hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving
                ? "Saving..."
                : menuItem
                  ? "Save Changes"
                  : "Create Item"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 