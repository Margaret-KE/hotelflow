import { useEffect, useState } from "react";
import { X, Save } from "lucide-react";

import type {
  CreateRoomTypeDto,
  RoomType,
  RoomTypeCategory,
  UpdateRoomTypeDto,
} from "../types/room.types";

interface RoomTypeFormModalProps {
  isOpen: boolean;
  roomType: RoomType | null;
  onClose: () => void;
  onSubmit: (
    data: CreateRoomTypeDto | UpdateRoomTypeDto,
    roomTypeId?: string
  ) => Promise<void>;
}

const ROOM_TYPE_CATEGORIES: RoomTypeCategory[] = [
  "ROOM",
  "COTTAGE",
  "TENT",
  "CAMPING_SITE",
  "CONFERENCE_HALL",
];

const RoomTypeFormModal = ({
  isOpen,
  roomType,
  onClose,
  onSubmit,
}: RoomTypeFormModalProps) => {
  const isEditMode = roomType !== null;

  const [name, setName] = useState("");
  const [category, setCategory] = useState<RoomTypeCategory>("ROOM");
  const [description, setDescription] = useState("");
  const [capacity, setCapacity] = useState("");
  const [basePrice, setBasePrice] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    if (roomType) {
      setName(roomType.name);
      setCategory(roomType.category);
      setDescription(roomType.description || "");
      setCapacity(String(roomType.capacity));
      setBasePrice(String(roomType.basePrice));
      setIsActive(roomType.isActive);
    } else {
      setName("");
      setCategory("ROOM");
      setDescription("");
      setCapacity("");
      setBasePrice("");
      setIsActive(true);
    }

    setError("");
  }, [isOpen, roomType]);

  if (!isOpen) {
    return null;
  }

  const formatCategory = (value: RoomTypeCategory) => {
    return value
      .replace(/_/g, " ")
      .toLowerCase()
      .replace(/\b\w/g, (letter) => letter.toUpperCase());
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");

    if (!name.trim()) {
      setError("Room type name is required.");
      return;
    }

    if (!capacity.trim()) {
      setError("Capacity is required.");
      return;
    }

    const capacityValue = Number(capacity);

    if (!Number.isFinite(capacityValue) || capacityValue <= 0) {
      setError("Capacity must be greater than 0.");
      return;
    }

    if (!basePrice.trim()) {
      setError("Base price is required.");
      return;
    }

    const basePriceValue = Number(basePrice);

    if (!Number.isFinite(basePriceValue) || basePriceValue < 0) {
      setError("Base price must be 0 or greater.");
      return;
    }

    setIsSubmitting(true);

    try {
      if (isEditMode && roomType) {
        const updateData: UpdateRoomTypeDto = {
          name: name.trim(),
          category,
          description: description.trim() || undefined,
          capacity: capacityValue,
          basePrice: basePriceValue,
          isActive,
        };

        await onSubmit(updateData, roomType.id);
      } else {
        const createData: CreateRoomTypeDto = {
          name: name.trim(),
          category,
          description: description.trim() || undefined,
          capacity: capacityValue,
          basePrice: basePriceValue,
          isActive,
        };

        await onSubmit(createData);
      }

      onClose();
    } catch (submitError) {
      if (submitError instanceof Error) {
        setError(submitError.message);
      } else {
        setError("Failed to save room type. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
      <div className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              {isEditMode ? "Edit Room Type" : "Add Room Type"}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {isEditMode
                ? "Update the room type information below."
                : "Create a new room type for your property."}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="max-h-[70vh] overflow-y-auto px-6 py-6">
            {error && (
              <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div>
                <label
                  htmlFor="roomTypeName"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Name
                </label>

                <input
                  id="roomTypeName"
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="e.g. Deluxe Room"
                  disabled={isSubmitting}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-200 disabled:bg-slate-100"
                />
              </div>

              <div>
                <label
                  htmlFor="roomTypeCategory"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Category
                </label>

                <select
                  id="roomTypeCategory"
                  value={category}
                  onChange={(event) =>
                    setCategory(event.target.value as RoomTypeCategory)
                  }
                  disabled={isSubmitting}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200 disabled:bg-slate-100"
                >
                  {ROOM_TYPE_CATEGORIES.map((roomCategory) => (
                    <option key={roomCategory} value={roomCategory}>
                      {formatCategory(roomCategory)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="roomTypeCapacity"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Capacity
                </label>

                <input
                  id="roomTypeCapacity"
                  type="number"
                  min="1"
                  step="1"
                  value={capacity}
                  onChange={(event) => setCapacity(event.target.value)}
                  placeholder="e.g. 2"
                  disabled={isSubmitting}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-200 disabled:bg-slate-100"
                />

                <p className="mt-1.5 text-xs text-slate-400">
                  Maximum number of guests.
                </p>
              </div>

              <div>
                <label
                  htmlFor="roomTypeBasePrice"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Base Price
                </label>

                <input
                  id="roomTypeBasePrice"
                  type="number"
                  min="0"
                  step="0.01"
                  value={basePrice}
                  onChange={(event) => setBasePrice(event.target.value)}
                  placeholder="e.g. 5000"
                  disabled={isSubmitting}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-200 disabled:bg-slate-100"
                />

                <p className="mt-1.5 text-xs text-slate-400">
                  Default price for rooms of this type.
                </p>
              </div>

              <div className="md:col-span-2">
                <label
                  htmlFor="roomTypeDescription"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Description
                </label>

                <textarea
                  id="roomTypeDescription"
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  placeholder="Describe this room type..."
                  rows={4}
                  disabled={isSubmitting}
                  className="w-full resize-none rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-200 disabled:bg-slate-100"
                />
              </div>

              <div className="md:col-span-2">
                <label className="flex cursor-pointer items-center gap-3">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(event) => setIsActive(event.target.checked)}
                    disabled={isSubmitting}
                    className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-300"
                  />

                  <span>
                    <span className="block text-sm font-medium text-slate-700">
                      Active Room Type
                    </span>

                    <span className="block text-xs text-slate-400">
                      Allow rooms of this type to be used normally.
                    </span>
                  </span>
                </label>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 border-t border-slate-200 bg-slate-50 px-6 py-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Save className="h-4 w-4" />

              {isSubmitting
                ? "Saving..."
                : isEditMode
                  ? "Update Room Type"
                  : "Create Room Type"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RoomTypeFormModal;