import {
  Eye,
  MoreHorizontal,
  Pencil,
  Trash2,
} from "lucide-react";

import type { Room } from "../types/room.types";

interface RoomTableProps {
  rooms: Room[];
  loading: boolean;
  onView: (room: Room) => void;
  onEdit: (room: Room) => void;
  onDelete: (room: Room) => void;
}

const statusStyles: Record<
  Room["status"],
  {
    label: string;
    className: string;
  }
> = {
  AVAILABLE: {
    label: "Available",
    className:
      "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20",
  },
  OCCUPIED: {
    label: "Occupied",
    className:
      "bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-600/20",
  },
  RESERVED: {
    label: "Reserved",
    className:
      "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/20",
  },
  CLEANING: {
    label: "Cleaning",
    className:
      "bg-purple-50 text-purple-700 ring-1 ring-inset ring-purple-600/20",
  },
  MAINTENANCE: {
    label: "Maintenance",
    className:
      "bg-orange-50 text-orange-700 ring-1 ring-inset ring-orange-600/20",
  },
  OUT_OF_SERVICE: {
    label: "Out of Service",
    className:
      "bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/20",
  },
};

const formatPrice = (price: number | string | null) => {
  if (price === null) {
    return "—";
  }

  const numericPrice = Number(price);

  if (Number.isNaN(numericPrice)) {
    return String(price);
  }

  return `KES ${numericPrice.toLocaleString("en-KE")}`;
};

const RoomTable = ({
  rooms,
  loading,
  onView,
  onEdit,
  onDelete,
}: RoomTableProps) => {
  if (loading) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex min-h-[300px] items-center justify-center">
          <div className="text-sm text-slate-500">
            Loading rooms...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Room
              </th>

              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Type
              </th>

              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Floor
              </th>

              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Status
              </th>

              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Price
              </th>

              <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-200 bg-white">
            {rooms.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-5 py-12 text-center"
                >
                  <div className="mx-auto max-w-sm">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                      <MoreHorizontal className="h-5 w-5 text-slate-400" />
                    </div>

                    <p className="mt-3 text-sm font-medium text-slate-900">
                      No rooms found
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      Try changing your filters or add a new room.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              rooms.map((room) => {
                const status = statusStyles[room.status];

                return (
                  <tr
                    key={room.id}
                    className="transition hover:bg-slate-50"
                  >
                    <td className="whitespace-nowrap px-5 py-4">
                      <div>
                        <p className="text-sm font-semibold text-slate-900">
                          {room.roomNumber}
                        </p>

                        {room.notes && (
                          <p className="mt-1 max-w-[220px] truncate text-xs text-slate-500">
                            {room.notes}
                          </p>
                        )}
                      </div>
                    </td>

                    <td className="whitespace-nowrap px-5 py-4">
                      <p className="text-sm text-slate-700">
                        {room.roomType.name}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        {room.roomType.category.replace(
                          /_/g,
                          " "
                        )}
                      </p>
                    </td>

                    <td className="whitespace-nowrap px-5 py-4 text-sm text-slate-600">
                      {room.floor || "—"}
                    </td>

                    <td className="whitespace-nowrap px-5 py-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${status.className}`}
                      >
                        {status.label}
                      </span>
                    </td>

                    <td className="whitespace-nowrap px-5 py-4 text-sm font-medium text-slate-900">
                      {formatPrice(
                        room.price !== null
                          ? room.price
                          : room.roomType.basePrice
                      )}
                    </td>

                    <td className="whitespace-nowrap px-5 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => onView(room)}
                          title="View room"
                          className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                        >
                          <Eye className="h-4 w-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => onEdit(room)}
                          title="Edit room"
                          className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => onDelete(room)}
                          title="Delete room"
                          className="rounded-lg p-2 text-slate-500 transition hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RoomTable;