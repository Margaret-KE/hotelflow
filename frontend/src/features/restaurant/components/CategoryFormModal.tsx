import { useEffect, useState } from "react";
import type { FormEvent } from "react";

import type {
  RestaurantCategory,
  CreateRestaurantCategoryPayload,
} from "../types/restaurant.types";

interface CategoryFormModalProps {
  isOpen: boolean;
  category?: RestaurantCategory | null;
  onClose: () => void;
  onSubmit: (payload: CreateRestaurantCategoryPayload) => Promise<void>;
}

export default function CategoryFormModal({
  isOpen,
  category,
  onClose,
  onSubmit,
}: CategoryFormModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const isEditing = Boolean(category);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    if (category) {
      setName(category.name);
      setDescription(category.description || "");
    } else {
      setName("");
      setDescription("");
    }

    setError("");
  }, [isOpen, category]);

  if (!isOpen) {
    return null;
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!name.trim()) {
      setError("Category name is required.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      await onSubmit({
        name: name.trim(),
        description: description.trim() || undefined,
      });

      onClose();
    } catch (err) {
      console.error("Failed to save restaurant category:", err);
      setError("Failed to save category. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              {isEditing ? "Edit Category" : "Add Category"}
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Organize your restaurant menu.
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
                htmlFor="restaurant-category-name"
                className="mb-1.5 block text-sm font-medium text-slate-700"
              >
                Category Name
              </label>

              <input
                id="restaurant-category-name"
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="e.g. Main Course"
                maxLength={100}
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
              />
            </div>

            <div>
              <label
                htmlFor="restaurant-category-description"
                className="mb-1.5 block text-sm font-medium text-slate-700"
              >
                Description
              </label>

              <textarea
                id="restaurant-category-description"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Optional description"
                maxLength={255}
                rows={3}
                className="w-full resize-none rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
              />
            </div>
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
              disabled={saving}
              className="rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving
                ? "Saving..."
                : isEditing
                  ? "Save Changes"
                  : "Add Category"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}