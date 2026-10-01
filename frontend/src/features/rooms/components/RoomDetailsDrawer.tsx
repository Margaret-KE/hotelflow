import { X, Edit, BedDouble, Users, Building2, FileText } from "lucide-react";

import type { Room } from "../types/room.types";

interface RoomDetailsDrawerProps {
  isOpen: boolean;
  room: Room | null;
  onClose: () => void;
  onEdit: (room: Room) => void;
}

const RoomDetailsDrawer = ({
  isOpen,
  room,
  onClose,
  onEdit,
}: RoomDetailsDrawerProps) => {
  if (!isOpen || !room) {
    return null;
  }

  const formatStatus = (status: Room["status"]) => {
    return status
      .replace(/_/g, " ")
      .toLowerCase()
      .replace(/\b\w/g, (letter) => letter.toUpperCase());
  };

  const getStatusClasses = (status: Room["status"]) => {
    switch (status) {
      case "AVAILABLE":
        return "bg-emerald-50 text-emerald-700";

      case "OCCUPIED":
        return "bg-blue-50 text-blue-700";

      case "RESERVED":
        return "bg-amber-50 text-amber-700";

      case "CLEANING":
        return "bg-purple-50 text-purple-700";

      case "MAINTENANCE":
        return "bg-orange-50 text-orange-700";

      case "OUT_OF_SERVICE":
        return "bg-red-50 text-red-700";

      default:
        return "bg-slate-100 text-slate-600";
    }
  };

  const formatCategory = (category: Room["roomType"]["category"]) => {
    return category
      .replace(/_/g, " ")
      .toLowerCase()
      .replace(/\b\w/g, (letter) => letter.toUpperCase());
  };

  const formatPrice = (price: number | string | null) => {
    if (price === null) {
      return "Uses room type price";
    }

    const numericPrice = Number(price);

    if (!Number.isFinite(numericPrice)) {
      return String(price);
    }

    return `KES ${numericPrice.toLocaleString()}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button
        type="button"
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-slate-900/40"
        aria-label="Close room details"
      />

      <div className="relative z-10 flex h-full w-full max-w-lg flex-col bg-white shadow-2xl">
        <div className="flex items-start justify-between border-b border-slate-200 px-6 py-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Room Details
            </p>

            <h2 className="mt-1 text-xl font-semibold text-slate-900">
              Room {room.roomNumber}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {room.roomType.name}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
            aria-label="Close drawer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="border-b border-slate-200 px-6 py-5">
            <div className="flex items-center justify-between">
              <span
                className={`rounded-full px-3 py-1.5 text-xs font-medium ${getStatusClasses(
                  room.status
                )}`}
              >
                {formatStatus(room.status)}
              </span>

              <span
                className={
                  room.isActive
                    ? "text-xs font-medium text-emerald-600"
                    : "text-xs font-medium text-slate-400"
                }
              >
                {room.isActive ? "Active" : "Inactive"}
              </span>
            </div>
          </div>

          <div className="space-y-6 px-6 py-6">
            <section>
              <h3 className="mb-4 text-sm font-semibold text-slate-900">
                Room Information
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-xl bg-slate-50 p-4">
                  <div className="mb-2 flex items-center gap-2 text-slate-400">
                    <Building2 className="h-4 w-4" />

                    <span className="text-xs font-medium uppercase tracking-wide">
                      Floor
                    </span>
                  </div>

                  <p className="text-sm font-medium text-slate-900">
                    {room.floor || "Not specified"}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-4">
                  <div className="mb-2 flex items-center gap-2 text-slate-400">
                    <BedDouble className="h-4 w-4" />

                    <span className="text-xs font-medium uppercase tracking-wide">
                      Category
                    </span>
                  </div>

                  <p className="text-sm font-medium text-slate-900">
                    {formatCategory(room.roomType.category)}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-4">
                  <div className="mb-2 flex items-center gap-2 text-slate-400">
                    <Users className="h-4 w-4" />

                    <span className="text-xs font-medium uppercase tracking-wide">
                      Capacity
                    </span>
                  </div>

                  <p className="text-sm font-medium text-slate-900">
                    {room.roomType.capacity} guest
                    {room.roomType.capacity === 1 ? "" : "s"}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-4">
                  <div className="mb-2 flex items-center gap-2 text-slate-400">
                    <FileText className="h-4 w-4" />

                    <span className="text-xs font-medium uppercase tracking-wide">
                      Price
                    </span>
                  </div>

                  <p className="text-sm font-medium text-slate-900">
                    {formatPrice(room.price)}
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h3 className="mb-4 text-sm font-semibold text-slate-900">
                Room Type
              </h3>

              <div className="rounded-xl border border-slate-200 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-medium text-slate-900">
                      {room.roomType.name}
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      {formatCategory(room.roomType.category)}
                    </p>
                  </div>

                  <span className="text-sm font-semibold text-slate-900">
                    KES{" "}
                    {Number(room.roomType.basePrice).toLocaleString()}
                  </span>
                </div>

                {room.roomType.description && (
                  <p className="mt-4 border-t border-slate-100 pt-4 text-sm leading-6 text-slate-600">
                    {room.roomType.description}
                  </p>
                )}

                {room.roomType.bedType && (
                  <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
                    <span className="text-sm text-slate-500">
                      Bed Type
                    </span>

                    <span className="text-sm font-medium text-slate-900">
                      {room.roomType.bedType}
                    </span>
                  </div>
                )}
              </div>
            </section>

            {room.notes && (
              <section>
                <h3 className="mb-4 text-sm font-semibold text-slate-900">
                  Notes
                </h3>

                <div className="rounded-xl bg-amber-50 p-4">
                  <p className="text-sm leading-6 text-amber-900">
                    {room.notes}
                  </p>
                </div>
              </section>
            )}

            {room.roomType.amenities &&
              room.roomType.amenities.length > 0 && (
                <section>
                  <h3 className="mb-4 text-sm font-semibold text-slate-900">
                    Amenities
                  </h3>

                  <div className="grid grid-cols-2 gap-2">
                    {room.roomType.amenities.map((roomTypeAmenity) => (
                      <div
                        key={roomTypeAmenity.amenityId}
                        className="rounded-lg border border-slate-200 px-3 py-2.5"
                      >
                        <p className="text-sm font-medium text-slate-700">
                          {roomTypeAmenity.amenity.name}
                        </p>

                        {roomTypeAmenity.amenity.description && (
                          <p className="mt-1 text-xs text-slate-400">
                            {roomTypeAmenity.amenity.description}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )}
          </div>
        </div>

        <div className="border-t border-slate-200 bg-slate-50 px-6 py-4">
          <button
            type="button"
            onClick={() => onEdit(room)}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
          >
            <Edit className="h-4 w-4" />
            Edit Room
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoomDetailsDrawer;