import { useEffect, useState } from "react";
import { X, Save } from "lucide-react";

import type {
  CreateRoomDto,
  Room,
  RoomStatus,
  RoomType,
  UpdateRoomDto,
} from "../types/room.types";

interface RoomFormModalProps {
  isOpen: boolean;
  room: Room | null;
  roomTypes: RoomType[];
  onClose: () => void;
  onSubmit: (
    data: CreateRoomDto | UpdateRoomDto,
    roomId?: string
  ) => Promise<void>;
}

const ROOM_STATUSES: RoomStatus[] = [
  "AVAILABLE",
  "OCCUPIED",
  "RESERVED",
  "CLEANING",
  "MAINTENANCE",
  "OUT_OF_SERVICE",
];

const RoomFormModal = ({
  isOpen,
  room,
  roomTypes,
  onClose,
  onSubmit,
}: RoomFormModalProps) => {
  const isEditMode = room !== null;

  const [roomNumber, setRoomNumber] = useState("");
  const [roomTypeId, setRoomTypeId] = useState("");
  const [floor, setFloor] = useState("");
  const [status, setStatus] = useState<RoomStatus>("AVAILABLE");
  const [notes, setNotes] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    if (room) {
      setRoomNumber(room.roomNumber);
      setRoomTypeId(room.roomTypeId);
      setFloor(room.floor || "");
      setStatus(room.status);
      setNotes(room.notes || "");
      setIsActive(room.isActive);
    } else {
      setRoomNumber("");
      setRoomTypeId("");
      setFloor("");
      setStatus("AVAILABLE");
      setNotes("");
      setIsActive(true);
    }

    setError("");
  }, [isOpen, room]);

  if (!isOpen) {
    return null;
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");

    if (!roomNumber.trim()) {
      setError("Room number is required.");
      return;
    }

    if (!roomTypeId) {
      setError("Please select a room type.");
      return;
    }

    setIsSubmitting(true);

    try {
      if (isEditMode && room) {
        const updateData: UpdateRoomDto = {
          roomNumber: roomNumber.trim(),
          roomTypeId,
          floor: floor.trim() || undefined,
          status,
          notes: notes.trim() || undefined,
          isActive,
        };

        await onSubmit(updateData, room.id);
      } else {
        const createData: CreateRoomDto = {
          roomNumber: roomNumber.trim(),
          roomTypeId,
          floor: floor.trim() || undefined,
          notes: notes.trim() || undefined,
        };

        await onSubmit(createData);
      }

      onClose();
    } catch (submitError) {
      if (submitError instanceof Error) {
        setError(submitError.message);
      } else {
        setError("Failed to save room. Please try again.");
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
              {isEditMode ? "Edit Room" : "Add Room"}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {isEditMode
                ? "Update the room information below."
                : "Add a new room to your property."}
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
                  htmlFor="roomNumber"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Room Number
                </label>

                <input
                  id="roomNumber"
                  type="text"
                  value={roomNumber}
                  onChange={(event) => setRoomNumber(event.target.value)}
                  placeholder="e.g. 101"
                  disabled={isSubmitting}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-200 disabled:bg-slate-100"
                />
              </div>

              <div>
                <label
                  htmlFor="roomType"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Room Type
                </label>

                <select
                  id="roomType"
                  value={roomTypeId}
                  onChange={(event) => setRoomTypeId(event.target.value)}
                  disabled={isSubmitting}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200 disabled:bg-slate-100"
                >
                  <option value="">Select room type</option>

                  {roomTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="floor"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Floor
                </label>

                <input
                  id="floor"
                  type="text"
                  value={floor}
                  onChange={(event) => setFloor(event.target.value)}
                  placeholder="e.g. Ground Floor"
                  disabled={isSubmitting}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-200 disabled:bg-slate-100"
                />
              </div>

              <div>
                <label
                  htmlFor="status"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Status
                </label>

                <select
                  id="status"
                  value={status}
                  onChange={(event) =>
                    setStatus(event.target.value as RoomStatus)
                  }
                  disabled={isSubmitting}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200 disabled:bg-slate-100"
                >
                  {ROOM_STATUSES.map((roomStatus) => (
                    <option key={roomStatus} value={roomStatus}>
                      {roomStatus.replace(/_/g, " ")}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center">
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
                      Active Room
                    </span>

                    <span className="block text-xs text-slate-400">
                      Available for normal hotel operations
                    </span>
                  </span>
                </label>
              </div>

              <div className="md:col-span-2">
                <label
                  htmlFor="notes"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Notes
                </label>

                <textarea
                  id="notes"
                  value={notes}
                  onChange={(event) => setNotes(event.target.value)}
                  placeholder="Add any notes about this room..."
                  rows={4}
                  disabled={isSubmitting}
                  className="w-full resize-none rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-200 disabled:bg-slate-100"
                />
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
                  ? "Update Room"
                  : "Create Room"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RoomFormModal;