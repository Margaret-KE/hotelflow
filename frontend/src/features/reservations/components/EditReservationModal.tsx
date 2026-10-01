import { useEffect, useState } from "react";
import { X, Save } from "lucide-react";

import type { Reservation } from "../types/reservation.types";

interface EditReservationModalProps {
  open: boolean;
  reservation: Reservation | null;
  onClose: () => void;
  onSave: (
    id: string,
    updates: Partial<Reservation>
  ) => void;
}

export default function EditReservationModal({
  open,
  reservation,
  onClose,
  onSave,
}: EditReservationModalProps) {
  const [guest, setGuest] = useState("");
  const [accommodation, setAccommodation] = useState("");
  const [stay, setStay] = useState("");
  const [nights, setNights] = useState(1);
  const [amount, setAmount] = useState("");
  const [payment, setPayment] = useState("Pending");
  const [status, setStatus] = useState("Reserved");

  useEffect(() => {
    if (!reservation) {
      return;
    }

    setGuest(reservation.guest);
    setAccommodation(reservation.accommodation);
    setStay(reservation.stay);
    setNights(reservation.nights);
    setAmount(reservation.amount);
    setPayment(reservation.payment);
    setStatus(reservation.status);
  }, [reservation]);

  if (!open || !reservation) {
    return null;
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    onSave(reservation.id, {
      guest,
      accommodation,
      stay,
      nights,
      amount,
      payment,
      status,
    });

    onClose();
  };

  return (
    <>
      {/* Overlay */}

      <div
        onClick={onClose}
        className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm"
      />

      {/* Modal */}

      <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
        <div className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl">
          {/* Header */}

          <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Edit Reservation
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Update reservation details for {reservation.guestNo}.
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

          {/* Form */}

          <form onSubmit={handleSubmit}>
            <div className="grid max-h-[70vh] gap-5 overflow-y-auto p-6 md:grid-cols-2">
              {/* Guest */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Guest Name
                </label>

                <input
                  type="text"
                  value={guest}
                  onChange={(event) =>
                    setGuest(event.target.value)
                  }
                  required
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
                />
              </div>

              {/* Accommodation */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Accommodation
                </label>

                <input
                  type="text"
                  value={accommodation}
                  onChange={(event) =>
                    setAccommodation(event.target.value)
                  }
                  required
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
                />
              </div>

              {/* Stay */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Stay
                </label>

                <input
                  type="text"
                  value={stay}
                  onChange={(event) =>
                    setStay(event.target.value)
                  }
                  required
                  placeholder="e.g. 24 Jul - 27 Jul"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
                />
              </div>

              {/* Nights */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Nights
                </label>

                <input
                  type="number"
                  min="1"
                  value={nights}
                  onChange={(event) =>
                    setNights(Number(event.target.value))
                  }
                  required
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
                />
              </div>

              {/* Amount */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Amount
                </label>

                <input
                  type="text"
                  value={amount}
                  onChange={(event) =>
                    setAmount(event.target.value)
                  }
                  required
                  placeholder="e.g. KES 36,000"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
                />
              </div>

              {/* Payment */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Payment
                </label>

                <select
                  value={payment}
                  onChange={(event) =>
                    setPayment(event.target.value)
                  }
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
                >
                  <option value="Paid">Paid</option>
                  <option value="Partial">Partial</option>
                  <option value="Pending">Pending</option>
                </select>
              </div>

              {/* Status */}

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Status
                </label>

                <select
                  value={status}
                  onChange={(event) =>
                    setStatus(event.target.value)
                  }
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
                >
                  <option value="Reserved">Reserved</option>
                  <option value="Pending">Pending</option>
                  <option value="Checked In">
                    Checked In
                  </option>
                  <option value="Checked Out">
                    Checked Out
                  </option>
                  <option value="Cancelled">
                    Cancelled
                  </option>
                </select>
              </div>
            </div>

            {/* Footer */}

            <div className="flex justify-end gap-3 border-t border-slate-200 bg-slate-50 px-6 py-4">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-slate-300 px-5 py-3 font-semibold text-slate-700 transition hover:bg-white"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="flex items-center gap-2 rounded-xl bg-green-700 px-5 py-3 font-semibold text-white transition hover:bg-green-800"
              >
                <Save size={18} />
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}