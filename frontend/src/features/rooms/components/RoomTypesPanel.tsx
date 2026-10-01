import { useState } from "react";
import { Edit, Plus, Trash2 } from "lucide-react";

import type {
  CreateRoomTypeDto,
  RoomType,
  UpdateRoomTypeDto,
} from "../types/room.types";

import RoomTypeFormModal from "./RoomTypeFormModal";

interface RoomTypesPanelProps {
  roomTypes: RoomType[];
  onCreate: (data: CreateRoomTypeDto) => Promise<void>;
  onUpdate: (id: string, data: UpdateRoomTypeDto) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  isLoading?: boolean;
}

const RoomTypesPanel = ({
  roomTypes,
  onCreate,
  onUpdate,
  onDelete,
  isLoading = false,
}: RoomTypesPanelProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRoomType, setSelectedRoomType] = useState<RoomType | null>(
    null
  );
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const openCreateModal = () => {
    setSelectedRoomType(null);
    setError("");
    setIsModalOpen(true);
  };

  const openEditModal = (roomType: RoomType) => {
    setSelectedRoomType(roomType);
    setError("");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedRoomType(null);
  };

  const handleSubmit = async (
    data: CreateRoomTypeDto | UpdateRoomTypeDto,
    roomTypeId?: string
  ) => {
    setError("");

    try {
      if (roomTypeId) {
        await onUpdate(roomTypeId, data as UpdateRoomTypeDto);
      } else {
        await onCreate(data as CreateRoomTypeDto);
      }
    } catch (submitError) {
      if (submitError instanceof Error) {
        throw submitError;
      }

      throw new Error("Failed to save room type. Please try again.");
    }
  };

  const handleDelete = async (roomType: RoomType) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${roomType.name}"?`
    );

    if (!confirmed) {
      return;
    }

    setError("");
    setDeletingId(roomType.id);

    try {
      await onDelete(roomType.id);
    } catch (deleteError) {
      if (deleteError instanceof Error) {
        setError(deleteError.message);
      } else {
        setError("Failed to delete room type. Please try again.");
      }
    } finally {
      setDeletingId(null);
    }
  };

  const formatCategory = (category: RoomType["category"]) => {
    return category
      .replace(/_/g, " ")
      .toLowerCase()
      .replace(/\b\w/g, (letter) => letter.toUpperCase());
  };

  const formatPrice = (price: number | string) => {
    const numericPrice = Number(price);

    if (!Number.isFinite(numericPrice)) {
      return String(price);
    }

    return numericPrice.toLocaleString();
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-col gap-4 border-b border-slate-200 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            Room Types
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Manage room categories, capacity, and pricing.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          disabled={isLoading}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Plus className="h-4 w-4" />
          Add Room Type
        </button>
      </div>

      <div className="p-6">
        {error && (
          <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="py-12 text-center">
            <p className="text-sm text-slate-500">
              Loading room types...
            </p>
          </div>
        ) : roomTypes.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 px-6 py-12 text-center">
            <h3 className="text-sm font-semibold text-slate-900">
              No room types yet
            </h3>

            <p className="mx-auto mt-1 max-w-md text-sm text-slate-500">
              Create your first room type before adding rooms.
            </p>

            <button
              type="button"
              onClick={openCreateModal}
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
            >
              <Plus className="h-4 w-4" />
              Add Room Type
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px]">
              <thead>
                <tr className="border-b border-slate-200 text-left">
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Room Type
                  </th>

                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Category
                  </th>

                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Capacity
                  </th>

                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Base Price
                  </th>

                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Status
                  </th>

                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {roomTypes.map((roomType) => (
                  <tr
                    key={roomType.id}
                    className="transition hover:bg-slate-50"
                  >
                    <td className="px-4 py-4">
                      <div>
                        <p className="font-medium text-slate-900">
                          {roomType.name}
                        </p>

                        {roomType.description && (
                          <p className="mt-1 max-w-xs truncate text-xs text-slate-500">
                            {roomType.description}
                          </p>
                        )}
                      </div>
                    </td>

                    <td className="px-4 py-4 text-sm text-slate-600">
                      {formatCategory(roomType.category)}
                    </td>

                    <td className="px-4 py-4 text-sm text-slate-600">
                      {roomType.capacity} guest
                      {roomType.capacity === 1 ? "" : "s"}
                    </td>

                    <td className="px-4 py-4 text-sm font-medium text-slate-900">
                      KES {formatPrice(roomType.basePrice)}
                    </td>

                    <td className="px-4 py-4">
                      <span
                        className={
                          roomType.isActive
                            ? "inline-flex rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700"
                            : "inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600"
                        }
                      >
                        {roomType.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>

                    <td className="px-4 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => openEditModal(roomType)}
                          disabled={deletingId === roomType.id}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <Edit className="h-3.5 w-3.5" />
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(roomType)}
                          disabled={deletingId === roomType.id}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-2 text-xs font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <Trash2 className="h-3.5 w-3.5" />

                          {deletingId === roomType.id
                            ? "Deleting..."
                            : "Delete"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <RoomTypeFormModal
        isOpen={isModalOpen}
        roomType={selectedRoomType}
        onClose={closeModal}
        onSubmit={handleSubmit}
      />
    </section>
  );
};

export default RoomTypesPanel;