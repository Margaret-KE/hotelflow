import { useEffect, useState } from "react";

import type {
  BarCategory,
  CreateBarCategoryPayload,
  UpdateBarCategoryPayload,
} from "../types/bar.types";

interface CategoryFormModalProps {
  isOpen: boolean;
  category: BarCategory | null;
  onClose: () => void;
  onSubmit: (
    payload: CreateBarCategoryPayload | UpdateBarCategoryPayload
  ) => Promise<void>;
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

  useEffect(() => {
    if (isOpen) {
      setName(category ? category.name : "");
      setDescription(
        category && category.description
          ? category.description
          : ""
      );
      setError("");
    }
  }, [isOpen, category]);

  if (!isOpen) {
    return null;
  }

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (name.trim().length < 2) {
      setError("Category name must contain at least 2 characters.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      await onSubmit({
        name: name.trim(),
        description: description.trim(),
      });

      onClose();
    } catch (err) {
      console.error("Failed to save bar category:", err);
      setError("Failed to save category. Check whether the name already exists.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900">
            {category ? "Edit Bar Category" : "Add Bar Category"}
          </h2>

          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="rounded-lg px-3 py-2 text-slate-500 hover:bg-slate-100"
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="bar-category-name"
              className="mb-1 block text-sm font-medium text-slate-700"
            >
              Category Name
            </label>

            <input
              id="bar-category-name"
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
              minLength={2}
              maxLength={100}
              placeholder="e.g. Cocktails, Wines, Soft Drinks"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
            />
          </div>

          <div>
            <label
              htmlFor="bar-category-description"
              className="mb-1 block text-sm font-medium text-slate-700"
            >
              Description
            </label>

            <textarea
              id="bar-category-description"
              value={description}
              onChange={(event) =>
                setDescription(event.target.value)
              }
              rows={3}
              placeholder="Optional category description"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
            />
          </div>

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
              disabled={saving}
              className="rounded-xl bg-emerald-700 px-5 py-2.5 font-medium text-white hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving
                ? "Saving..."
                : category
                  ? "Save Changes"
                  : "Create Category"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}