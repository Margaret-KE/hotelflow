import { useEffect } from "react";

import { X, Printer } from "lucide-react";

import type { Reservation } from "../types/reservation.types";

interface ReservationInvoiceProps {
  open: boolean;
  reservation: Reservation | null;
  onClose: () => void;
}

function formatCurrency(amount: number) {
  return `KES ${amount.toLocaleString("en-KE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function getPaymentStatusClass(status: string) {
  if (status === "Paid") {
    return "bg-green-100 text-green-700";
  }

  if (status === "Partial") {
    return "bg-blue-100 text-blue-700";
  }

  return "bg-amber-100 text-amber-700";
}

export default function ReservationInvoice({
  open,
  reservation,
  onClose,
}: ReservationInvoiceProps) {
  useEffect(() => {
    if (!open) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  if (!open || !reservation) {
    return null;
  }

  const subtotal = reservation.totalAmount;
  const vat = Math.round(subtotal * 0.16);
  const total = subtotal + vat;

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      {/* Screen overlay */}
      <div
        onClick={onClose}
        className="fixed inset-0 z-[80] bg-black/40 backdrop-blur-sm print:hidden"
      />

      {/* Invoice modal */}
      <div className="fixed inset-0 z-[90] flex items-center justify-center overflow-y-auto p-4 print:static print:block print:p-0">
        <div className="w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-2xl print:max-w-none print:rounded-none print:shadow-none">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5 print:hidden">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Reservation Invoice
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {reservation.guestNo}
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100"
            >
              <X size={22} />
            </button>
          </div>

          {/* Invoice */}
          <div className="max-h-[80vh] overflow-y-auto p-8 print:max-h-none print:overflow-visible">
            {/* Hotel heading */}
            <div className="flex flex-col justify-between gap-6 border-b border-slate-200 pb-6 sm:flex-row">
              <div>
                <h1 className="text-3xl font-bold text-green-800">
                  Greenwood Hotel
                </h1>

                <p className="mt-1 text-sm text-slate-500">
                  Greenwood Ecolodge
                </p>

                <p className="mt-3 text-sm text-slate-600">Kenya</p>

                <p className="text-sm text-slate-600">
                  Phone: +254 700 000 000
                </p>
              </div>

              <div className="text-left sm:text-right">
                <h2 className="text-2xl font-bold text-slate-900">
                  INVOICE
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                  Reservation No.
                </p>

                <p className="font-semibold text-slate-800">
                  {reservation.guestNo}
                </p>

                <p className="mt-2 text-sm text-slate-500">Date</p>

                <p className="text-sm font-medium text-slate-700">
                  {new Date().toLocaleDateString("en-KE")}
                </p>
              </div>
            </div>

            {/* Guest */}
            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Billed To
                </p>

                <p className="mt-2 font-semibold text-slate-900">
                  {reservation.guest}
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  Guest No: {reservation.guestNo}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Accommodation
                </p>

                <p className="mt-2 font-semibold text-slate-900">
                  {reservation.accommodation}
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  {reservation.nights}{" "}
                  {reservation.nights === 1 ? "night" : "nights"}
                </p>
              </div>
            </div>

            {/* Stay */}
            <div className="mt-8 rounded-xl border border-slate-200">
              <div className="grid grid-cols-2 gap-4 border-b border-slate-200 bg-slate-50 px-5 py-4 text-sm font-semibold text-slate-600 sm:grid-cols-4">
                <span>Description</span>
                <span>Stay</span>
                <span>Payment</span>
                <span className="text-right">Amount</span>
              </div>

              <div className="grid grid-cols-2 gap-4 px-5 py-5 text-sm sm:grid-cols-4">
                <div>
                  <p className="font-semibold text-slate-800">
                    Accommodation
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Room / stay
                  </p>
                </div>

                <div className="text-slate-600">{reservation.stay}</div>

                <div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${getPaymentStatusClass(
                      reservation.payment
                    )}`}
                  >
                    {reservation.payment}
                  </span>
                </div>

                <div className="text-right font-semibold text-slate-800">
                  {formatCurrency(reservation.totalAmount)}
                </div>
              </div>
            </div>

            {/* Totals */}
            <div className="mt-8 flex justify-end">
              <div className="w-full max-w-sm space-y-3">
                <div className="flex justify-between text-sm text-slate-600">
                  <span>Subtotal</span>

                  <span>{formatCurrency(subtotal)}</span>
                </div>

                <div className="flex justify-between text-sm text-slate-600">
                  <span>VAT (16%)</span>

                  <span>{formatCurrency(vat)}</span>
                </div>

                <div className="flex justify-between border-t border-slate-200 pt-4 text-lg font-bold text-slate-900">
                  <span>Total</span>

                  <span className="text-green-700">
                    {formatCurrency(total)}
                  </span>
                </div>

                <div className="flex justify-between text-sm font-semibold text-green-700">
                  <span>Paid</span>

                  <span>{formatCurrency(reservation.paidAmount)}</span>
                </div>

                <div className="flex justify-between border-t border-slate-200 pt-3 text-sm font-bold text-orange-700">
                  <span>Balance</span>

                  <span>{formatCurrency(reservation.balanceAmount)}</span>
                </div>
              </div>
            </div>

            {/* Payment details */}
            <div className="mt-8 rounded-xl border border-slate-200 p-5">
              <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                <div>
                  <p className="text-sm font-semibold text-slate-800">
                    Payment Details
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    Method: {reservation.paymentMethod}
                  </p>
                </div>

                <span
                  className={`inline-flex w-fit rounded-full px-3 py-1 text-sm font-semibold ${getPaymentStatusClass(
                    reservation.payment
                  )}`}
                >
                  {reservation.payment}
                </span>
              </div>

              {reservation.payments.length > 0 ? (
                <div className="mt-5 space-y-3">
                  {reservation.payments.map((payment) => (
                    <div
                      key={payment.id}
                      className="rounded-xl bg-slate-50 p-4"
                    >
                      <div className="grid gap-3 sm:grid-cols-4">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                            Receipt
                          </p>

                          <p className="mt-1 text-sm font-semibold text-slate-800">
                            {payment.receiptNumber}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                            Method
                          </p>

                          <p className="mt-1 text-sm text-slate-700">
                            {payment.method}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                            Amount
                          </p>

                          <p className="mt-1 text-sm font-semibold text-slate-800">
                            {formatCurrency(payment.amount)}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                            Status
                          </p>

                          <p className="mt-1 text-sm font-semibold text-slate-700">
                            {payment.status}
                          </p>
                        </div>
                      </div>

                      <div className="mt-3 flex flex-col gap-1 text-xs text-slate-500 sm:flex-row sm:justify-between">
                        <span>
                          {new Date(payment.paidAt).toLocaleString("en-KE")}
                        </span>

                        {payment.transactionReference && (
                          <span>
                            Reference: {payment.transactionReference}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-4 text-sm text-slate-500">
                  No payment records have been recorded yet.
                </p>
              )}
            </div>

            {/* Payment status */}
            <div className="mt-8 rounded-xl bg-green-50 p-5">
              <p className="text-sm font-semibold text-green-800">
                Payment Status
              </p>

              <p className="mt-1 text-sm text-green-700">
                {reservation.payment} — {formatCurrency(reservation.paidAmount)}{" "}
                paid, {formatCurrency(reservation.balanceAmount)} remaining.
              </p>
            </div>

            {/* Footer */}
            <div className="mt-10 border-t border-slate-200 pt-6 text-center">
              <p className="font-semibold text-slate-800">
                Thank you for choosing Greenwood Hotel.
              </p>

              <p className="mt-1 text-sm text-slate-500">
                We look forward to welcoming you again.
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 border-t border-slate-200 bg-slate-50 px-6 py-4 print:hidden">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-300 px-5 py-3 font-semibold text-slate-700 transition hover:bg-white"
            >
              Close
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-2 rounded-xl bg-green-700 px-5 py-3 font-semibold text-white transition hover:bg-green-800"
            >
              <Printer size={18} />
              Print Invoice
            </button>
          </div>
        </div>
      </div>
    </>
  );
}