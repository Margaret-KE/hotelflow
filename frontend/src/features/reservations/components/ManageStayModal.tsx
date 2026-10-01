import { useEffect, useState } from "react";
import { X, Save, Plus, Minus } from "lucide-react";

import type { Reservation } from "../types/reservation.types";

interface ManageStayModalProps {
  open: boolean;
  reservation: Reservation | null;
  onClose: () => void;
  onSave: (
    id: string,
    updates: Partial<Reservation>
  ) => void;
}

export default function ManageStayModal({
  open,
  reservation,
  onClose,
  onSave,
}: ManageStayModalProps) {
  const [stay, setStay] = useState("");
  const [nights, setNights] = useState(1);

  useEffect(() => {
    if (!reservation) {
      return;
    }

    setStay(reservation.stay);
    setNights(reservation.nights);
  }, [reservation]);

  if (!open || !reservation) {
    return null;
  }

  const increaseNights = () => {
    setNights((current) => current + 1);
  };

  const decreaseNights = () => {
    setNights((current) => Math.max(1, current - 1));
  };

  const handleSubmit = (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    onSave(reservation.id, {
      stay,
      nights,
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
        <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">
          {/* Header */}

          <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Manage Stay
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {reservation.guest} · {reservation.guestNo}
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

          {/* Content */}

          <form onSubmit={handleSubmit}>
            <div className="space-y-6 p-6">
              {/* Accommodation */}

              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Accommodation
                </p>

                <p className="mt-1 font-semibold text-slate-800">
                  {reservation.accommodation}
                </p>
              </div>

              {/* Stay */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Stay Period
                </label>

                <input
                  type="text"
                  value={stay}
                  onChange={(event) =>
                    setStay(event.target.value)
                  }
                  placeholder="e.g. 24 Jul - 27 Jul"
                  required
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
                />
              </div>

              {/* Nights */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Number of Nights
                </label>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={decreaseNights}
                    className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-300 text-slate-600 transition hover:bg-slate-100"
                  >
                    <Minus size={18} />
                  </button>

                  <div className="flex h-11 flex-1 items-center justify-center rounded-xl border border-slate-300 bg-slate-50 font-bold text-slate-800">
                    {nights}{" "}
                    {nights === 1 ? "night" : "nights"}
                  </div>

                  <button
                    type="button"
                    onClick={increaseNights}
                    className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-300 text-slate-600 transition hover:bg-slate-100"
                  >
                    <Plus size={18} />
                  </button>
                </div>
              </div>

              {/* Current status */}

              <div className="rounded-xl border border-slate-200 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Current Status
                </p>

                <p className="mt-1 font-semibold text-slate-800">
                  {reservation.status}
                </p>
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
                Save Stay
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}