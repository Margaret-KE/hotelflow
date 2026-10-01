import type { Reservation } from "../types/reservation.types";

import {
  X,
  User,
  BedDouble,
  CalendarDays,
  CreditCard,
  ClipboardList,
  FileText,
  Pencil,
  BadgeCheck,
  Printer,
  LogOut,
  Banknote,
} from "lucide-react";

interface ReservationDetailsDrawerProps {
  open: boolean;
  reservation: Reservation | null;
  onClose: () => void;
  onEdit: (reservation: Reservation) => void;
  onInvoice: (reservation: Reservation) => void;
  onCheckIn: (reservation: Reservation) => void;
  onCheckOut: (reservation: Reservation) => void;
  onRecordPayment: (reservation: Reservation) => void;
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatCurrency(amount: number) {
  return `KES ${amount.toLocaleString("en-KE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export default function ReservationDetailsDrawer({
  open,
  reservation,
  onClose,
  onEdit,
  onInvoice,
  onCheckIn,
  onCheckOut,
  onRecordPayment,
}: ReservationDetailsDrawerProps) {
  if (!open) return null;
  if (!reservation) return null;

  const guestCount = reservation.adults + reservation.children;

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 z-50 flex h-screen w-full max-w-xl flex-col bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Reservation {reservation.guestNo}
            </h2>

            <p className="text-sm text-slate-500">
              Reservation Details
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 transition hover:bg-slate-100"
          >
            <X size={22} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 space-y-6 overflow-y-auto p-6">
          {/* Guest */}
          <section className="rounded-2xl border border-slate-200 p-5">
            <div className="mb-4 flex items-center gap-2">
              <User className="text-green-700" size={20} />

              <h3 className="font-semibold text-slate-800">
                Guest
              </h3>
            </div>

            <p className="font-semibold text-slate-900">
              {reservation.guest}
            </p>

            <p className="text-slate-500">
              Confirmation #{reservation.guestNo}
            </p>

            <p className="mt-2 text-slate-600">
              {reservation.guestPhone}
            </p>
          </section>

          {/* Stay */}
          <section className="rounded-2xl border border-slate-200 p-5">
            <div className="mb-4 flex items-center gap-2">
              <BedDouble className="text-green-700" size={20} />

              <h3 className="font-semibold text-slate-800">
                Stay Details
              </h3>
            </div>

            <div className="space-y-2">
              <p>
                <strong>Room:</strong> {reservation.accommodation}
              </p>

              <p>
                <strong>Guests:</strong> {guestCount}{" "}
                {guestCount === 1 ? "Guest" : "Guests"}
              </p>

              <p>
                <strong>Adults:</strong> {reservation.adults}
              </p>

              <p>
                <strong>Children:</strong> {reservation.children}
              </p>

              <p>
                <strong>Nights:</strong> {reservation.nights}
              </p>

              <p>
                <strong>Booking Source:</strong> {reservation.source}
              </p>
            </div>
          </section>

          {/* Dates */}
          <section className="rounded-2xl border border-slate-200 p-5">
            <div className="mb-4 flex items-center gap-2">
              <CalendarDays className="text-green-700" size={20} />

              <h3 className="font-semibold text-slate-800">
                Dates
              </h3>
            </div>

            <div className="space-y-2">
              <p>
                <strong>Check In:</strong>{" "}
                {formatDate(reservation.checkInDate)}
              </p>

              <p>
                <strong>Check Out:</strong>{" "}
                {formatDate(reservation.checkOutDate)}
              </p>
            </div>
          </section>

          {/* Payment */}
          <section className="rounded-2xl border border-slate-200 p-5">
            <div className="mb-4 flex items-center gap-2">
              <CreditCard className="text-green-700" size={20} />

              <h3 className="font-semibold text-slate-800">
                Payment
              </h3>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Total Amount
                </p>

                <p className="mt-1 text-xl font-bold text-slate-900">
                  {formatCurrency(reservation.totalAmount)}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-xl bg-green-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-green-700">
                    Paid
                  </p>

                  <p className="mt-1 text-lg font-bold text-green-800">
                    {formatCurrency(reservation.paidAmount)}
                  </p>
                </div>

                <div className="rounded-xl bg-orange-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-orange-700">
                    Balance
                  </p>

                  <p className="mt-1 text-lg font-bold text-orange-800">
                    {formatCurrency(reservation.balanceAmount)}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`rounded-full px-3 py-1 text-sm font-semibold ${
                    reservation.payment === "Paid"
                      ? "bg-green-100 text-green-700"
                      : reservation.payment === "Partial"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-amber-100 text-amber-700"
                  }`}
                >
                  {reservation.payment}
                </span>

                <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700">
                  {reservation.paymentMethod}
                </span>
              </div>

              {/* Record Payment */}
              {reservation.balanceAmount > 0 &&
                reservation.status !== "CANCELLED" && (
                  <button
                    type="button"
                    onClick={() => onRecordPayment(reservation)}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-700 py-3 font-semibold text-white transition hover:bg-green-800"
                  >
                    <Banknote size={18} />
                    Record Payment
                  </button>
                )}

              {reservation.payments.length > 0 && (
                <div className="border-t border-slate-200 pt-4">
                  <p className="mb-3 text-sm font-semibold text-slate-800">
                    Payment Records
                  </p>

                  <div className="space-y-3">
                    {reservation.payments.map((payment) => (
                      <div
                        key={payment.id}
                        className="rounded-xl border border-slate-200 bg-slate-50 p-3"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="font-semibold text-slate-800">
                              {formatCurrency(payment.amount)}
                            </p>

                            <p className="mt-1 text-xs text-slate-500">
                              {payment.receiptNumber}
                            </p>

                            <p className="mt-1 text-xs text-slate-500">
                              {payment.method}
                            </p>
                          </div>

                          <span
                            className={`rounded-full px-2 py-1 text-xs font-semibold ${
                              payment.status === "COMPLETED"
                                ? "bg-green-100 text-green-700"
                                : payment.status === "REFUNDED"
                                  ? "bg-red-100 text-red-700"
                                  : payment.status === "FAILED"
                                    ? "bg-red-100 text-red-700"
                                    : "bg-amber-100 text-amber-700"
                            }`}
                          >
                            {payment.status}
                          </span>
                        </div>

                        <p className="mt-2 text-xs text-slate-500">
                          {new Date(payment.paidAt).toLocaleString("en-KE")}
                        </p>

                        {payment.transactionReference && (
                          <p className="mt-1 text-xs text-slate-500">
                            Ref: {payment.transactionReference}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Notes */}
          <section className="rounded-2xl border border-slate-200 p-5">
            <div className="mb-4 flex items-center gap-2">
              <ClipboardList className="text-green-700" size={20} />

              <h3 className="font-semibold text-slate-800">
                Notes
              </h3>
            </div>

            <p className="text-slate-600">
              {reservation.notes}
            </p>
          </section>

          {/* Timeline */}
          <section className="rounded-2xl border border-slate-200 p-5">
            <div className="mb-4 flex items-center gap-2">
              <FileText className="text-green-700" size={20} />

              <h3 className="font-semibold text-slate-800">
                Timeline
              </h3>
            </div>

            <div className="space-y-3 text-sm">
              <p className="text-green-700">
                ✓ Reservation Created
              </p>

              {reservation.status === "RESERVED" && (
                <p className="text-slate-500">
                  → Awaiting Check In
                </p>
              )}

              {reservation.status === "CHECKED_IN" && (
                <>
                  <p className="text-green-700">
                    ✓ Guest Checked In
                  </p>

                  <p className="text-slate-500">
                    → Awaiting Check Out
                  </p>
                </>
              )}

              {reservation.status === "CHECKED_OUT" && (
                <>
                  <p className="text-green-700">
                    ✓ Guest Checked In
                  </p>

                  <p className="text-green-700">
                    ✓ Guest Checked Out
                  </p>
                </>
              )}

              {reservation.status === "CANCELLED" && (
                <p className="text-red-600">
                  ✕ Reservation Cancelled
                </p>
              )}

              {reservation.status === "NO_SHOW" && (
                <p className="text-orange-600">
                  • Guest marked as No Show
                </p>
              )}
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-200 p-5">
          <div className="grid grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => onEdit(reservation)}
              className="flex items-center justify-center gap-2 rounded-xl border border-slate-300 py-3 font-medium transition hover:bg-slate-100"
            >
              <Pencil size={18} />
              Edit
            </button>

            {reservation.status === "RESERVED" && (
              <button
                type="button"
                onClick={() => onCheckIn(reservation)}
                className="flex items-center justify-center gap-2 rounded-xl bg-green-700 py-3 font-medium text-white transition hover:bg-green-800"
              >
                <BadgeCheck size={18} />
                Check In
              </button>
            )}

            {reservation.status === "CHECKED_IN" && (
              <button
                type="button"
                onClick={() => onCheckOut(reservation)}
                className="flex items-center justify-center gap-2 rounded-xl bg-blue-700 py-3 font-medium text-white transition hover:bg-blue-800"
              >
                <LogOut size={18} />
                Check Out
              </button>
            )}

            {reservation.status === "CHECKED_OUT" && (
              <div className="flex items-center justify-center gap-2 rounded-xl bg-slate-100 py-3 font-medium text-slate-500">
                <BadgeCheck size={18} />
                Checked Out
              </div>
            )}

            <button
              type="button"
              onClick={() => onInvoice(reservation)}
              className="flex items-center justify-center gap-2 rounded-xl border border-slate-300 py-3 font-medium transition hover:bg-slate-100"
            >
              <Printer size={18} />
              Invoice
            </button>
          </div>
        </div>
      </div>
    </>
  );
}