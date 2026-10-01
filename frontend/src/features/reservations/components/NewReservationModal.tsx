import { useEffect, useMemo, useState } from "react";
import { X, Plus } from "lucide-react";

import { guestService } from "../services/guest.service";
import { roomService } from "../../rooms/services/room.service";
import { reservationService } from "../services/reservation.service";

interface Guest {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
}

interface Room {
  id: string;
  roomNumber: string;
  status: string;
  price: string | number | null;
  roomType?: {
    name: string;
  };
}

interface NewReservationModalProps {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}

const bookingSources = [
  { value: "WALK_IN", label: "Walk In" },
  { value: "PHONE", label: "Phone" },
  { value: "WEBSITE", label: "Website" },
  { value: "BOOKING_COM", label: "Booking.com" },
  { value: "EXPEDIA", label: "Expedia" },
  { value: "AIRBNB", label: "Airbnb" },
  { value: "AGENT", label: "Agent" },
];

export default function NewReservationModal({
  open,
  onClose,
  onCreated,
}: NewReservationModalProps) {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);

  const [guestId, setGuestId] = useState("");
  const [roomId, setRoomId] = useState("");

  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");

  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);

  const [source, setSource] = useState("WALK_IN");
  const [notes, setNotes] = useState("");

  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;

    async function loadData() {
      try {
        setLoadingData(true);
        setError("");

        const [guestData, roomData] = await Promise.all([
          guestService.getGuests(),
          roomService.getRooms(),
        ]);

        setGuests(guestData);
        setRooms(roomData);
      } catch (err) {
        console.error(err);
        setError(
          "Unable to load guests and rooms. Please try again."
        );
      } finally {
        setLoadingData(false);
      }
    }

    loadData();
  }, [open]);

  const availableRooms = useMemo(() => {
    return rooms.filter(
      (room) => room.status === "AVAILABLE"
    );
  }, [rooms]);

  const selectedRoom = rooms.find(
    (room) => room.id === roomId
  );

  const nights = useMemo(() => {
    if (!checkInDate || !checkOutDate) {
      return 0;
    }

    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);

    const difference =
      checkOut.getTime() - checkIn.getTime();

    return Math.ceil(
      difference / (1000 * 60 * 60 * 24)
    );
  }, [checkInDate, checkOutDate]);

  const estimatedTotal = useMemo(() => {
    if (!selectedRoom?.price || nights <= 0) {
      return 0;
    }

    return Number(selectedRoom.price) * nights;
  }, [selectedRoom, nights]);

  if (!open) {
    return null;
  }

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");

    if (!guestId) {
      setError("Please select a guest.");
      return;
    }

    if (!roomId) {
      setError("Please select a room.");
      return;
    }

    if (!checkInDate || !checkOutDate) {
      setError(
        "Please select both check-in and check-out dates."
      );
      return;
    }

    if (nights <= 0) {
      setError(
        "Check-out date must be after check-in date."
      );
      return;
    }

    try {
      setLoading(true);

      await reservationService.createReservation({
        guestId,
        roomId,
        checkInDate,
        checkOutDate,
        adults,
        children,
        source,
        notes: notes.trim() || undefined,
      });

      setGuestId("");
      setRoomId("");
      setCheckInDate("");
      setCheckOutDate("");
      setAdults(1);
      setChildren(0);
      setSource("WALK_IN");
      setNotes("");

      onCreated();
      onClose();
    } catch (err: any) {
      console.error(err);

      setError(
        err?.response?.data?.message ??
          "Failed to create reservation."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div
        onClick={onClose}
        className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm"
      />

      <div className="fixed inset-0 z-[70] flex items-center justify-center overflow-y-auto p-4">
        <div className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl">
          {/* Header */}

          <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                New Reservation
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Create a new guest reservation.
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
            >
              <X size={22} />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid max-h-[70vh] gap-5 overflow-y-auto p-6 md:grid-cols-2">
              {/* Error */}

              {error && (
                <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700 md:col-span-2">
                  {error}
                </div>
              )}

              {/* Guest */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Guest
                </label>

                <select
                  value={guestId}
                  onChange={(event) =>
                    setGuestId(event.target.value)
                  }
                  disabled={loadingData}
                  required
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
                >
                  <option value="">
                    {loadingData
                      ? "Loading guests..."
                      : "Select guest"}
                  </option>

                  {guests.map((guest) => (
                    <option
                      key={guest.id}
                      value={guest.id}
                    >
                      {guest.firstName}{" "}
                      {guest.lastName} — {guest.phone}
                    </option>
                  ))}
                </select>
              </div>

              {/* Room */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Room
                </label>

                <select
                  value={roomId}
                  onChange={(event) =>
                    setRoomId(event.target.value)
                  }
                  disabled={loadingData}
                  required
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
                >
                  <option value="">
                    {loadingData
                      ? "Loading rooms..."
                      : "Select available room"}
                  </option>

                  {availableRooms.map((room) => (
                    <option
                      key={room.id}
                      value={room.id}
                    >
                      Room {room.roomNumber}
                      {room.roomType?.name
                        ? ` — ${room.roomType.name}`
                        : ""}
                    </option>
                  ))}
                </select>
              </div>

              {/* Check In */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Check In
                </label>

                <input
                  type="date"
                  value={checkInDate}
                  onChange={(event) =>
                    setCheckInDate(event.target.value)
                  }
                  required
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
                />
              </div>

              {/* Check Out */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Check Out
                </label>

                <input
                  type="date"
                  value={checkOutDate}
                  min={checkInDate || undefined}
                  onChange={(event) =>
                    setCheckOutDate(event.target.value)
                  }
                  required
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
                />
              </div>

              {/* Adults */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Adults
                </label>

                <input
                  type="number"
                  min="1"
                  value={adults}
                  onChange={(event) =>
                    setAdults(
                      Math.max(
                        1,
                        Number(event.target.value)
                      )
                    )
                  }
                  required
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
                />
              </div>

              {/* Children */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Children
                </label>

                <input
                  type="number"
                  min="0"
                  value={children}
                  onChange={(event) =>
                    setChildren(
                      Math.max(
                        0,
                        Number(event.target.value)
                      )
                    )
                  }
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
                />
              </div>

              {/* Booking Source */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Booking Source
                </label>

                <select
                  value={source}
                  onChange={(event) =>
                    setSource(event.target.value)
                  }
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
                >
                  {bookingSources.map((item) => (
                    <option
                      key={item.value}
                      value={item.value}
                    >
                      {item.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Summary */}

              <div className="rounded-xl bg-green-50 p-4 md:col-span-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">
                    Nights
                  </span>

                  <span className="font-semibold text-slate-900">
                    {nights}
                  </span>
                </div>

                <div className="mt-2 flex items-center justify-between">
                  <span className="text-sm text-slate-600">
                    Estimated Total
                  </span>

                  <span className="text-lg font-bold text-green-700">
                    KES{" "}
                    {estimatedTotal.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Notes */}

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Notes
                </label>

                <textarea
                  value={notes}
                  onChange={(event) =>
                    setNotes(event.target.value)
                  }
                  rows={3}
                  placeholder="Special requests, guest notes, etc."
                  className="w-full resize-none rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
                />
              </div>
            </div>

            {/* Footer */}

            <div className="flex justify-end gap-3 border-t border-slate-200 bg-slate-50 px-6 py-4">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="rounded-xl border border-slate-300 px-5 py-3 font-semibold text-slate-700 transition hover:bg-white disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading || loadingData}
                className="flex items-center gap-2 rounded-xl bg-green-700 px-5 py-3 font-semibold text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Plus size={18} />

                {loading
                  ? "Creating..."
                  : "Create Reservation"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}