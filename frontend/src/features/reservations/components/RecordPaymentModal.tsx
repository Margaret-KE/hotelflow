import { useEffect, useState } from "react";

import { CreditCard, X } from "lucide-react";

import {
  reservationService,
  type PaymentMethod,
} from "../services/reservation.service";

import type { Reservation } from "../types/reservation.types";

interface RecordPaymentModalProps {
  open: boolean;
  reservation: Reservation | null;
  onClose: () => void;
  onSuccess: (reservation: Reservation) => void;
}

const paymentMethods: {
  value: PaymentMethod;
  label: string;
}[] = [
  {
    value: "CASH",
    label: "Cash",
  },
  {
    value: "MPESA",
    label: "M-Pesa",
  },
  {
    value: "CARD",
    label: "Card",
  },
  {
    value: "BANK_TRANSFER",
    label: "Bank Transfer",
  },
];

export default function RecordPaymentModal({
  open,
  reservation,
  onClose,
  onSuccess,
}: RecordPaymentModalProps) {
  const [amount, setAmount] = useState("");
  const [method, setMethod] =
    useState<PaymentMethod>("CASH");
  const [transactionReference, setTransactionReference] =
    useState("");
  const [notes, setNotes] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open || !reservation) {
      return;
    }

    setAmount(
      reservation.balanceAmount > 0
        ? String(reservation.balanceAmount)
        : ""
    );

    setMethod("CASH");
    setTransactionReference("");
    setNotes("");
    setError("");
  }, [open, reservation]);

  if (!open || !reservation) {
    return null;
  }

  const handleClose = () => {
    if (loading) {
      return;
    }

    onClose();
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");

    const paymentAmount =
      Number(amount);

    if (
      !Number.isFinite(paymentAmount) ||
      paymentAmount <= 0
    ) {
      setError(
        "Please enter a valid payment amount."
      );
      return;
    }

    if (
      paymentAmount >
      reservation.balanceAmount
    ) {
      setError(
        `Payment cannot exceed the outstanding balance of KES ${reservation.balanceAmount.toLocaleString()}.`
      );
      return;
    }

    if (
      method === "MPESA" &&
      !transactionReference.trim()
    ) {
      setError(
        "Please enter the M-Pesa transaction reference."
      );
      return;
    }

    try {
      setLoading(true);

      await reservationService.createPayment({
        reservationId:
          reservation.id,
        amount: paymentAmount,
        method,
        transactionReference:
          transactionReference.trim() ||
          undefined,
        notes:
          notes.trim() ||
          undefined,
      });

      const updatedReservation =
        await reservationService.getReservation(
          reservation.id
        );

      onSuccess(updatedReservation);
      onClose();
    } catch (error) {
      console.error(error);

      let message =
        "Failed to record payment.";

      if (
        error &&
        typeof error === "object" &&
        "response" in error
      ) {
        const response =
          (
            error as {
              response?: {
                data?: {
                  message?: string;
                };
              };
            }
          ).response;

        if (
          response &&
          response.data &&
          response.data.message
        ) {
          message =
            response.data.message;
        }
      }

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div
        onClick={handleClose}
        className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm"
      />

      <div className="fixed inset-0 z-[110] flex items-center justify-center overflow-y-auto p-4">
        <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">
          <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-green-100 p-3 text-green-700">
                <CreditCard size={22} />
              </div>

              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Record Payment
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {reservation.guest}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <X size={22} />
            </button>
          </div>

          <form
            onSubmit={handleSubmit}
            className="p-6"
          >
            <div className="mb-6 grid grid-cols-2 gap-4">
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Reservation Total
                </p>

                <p className="mt-2 text-lg font-bold text-slate-900">
                  KES{" "}
                  {reservation.totalAmount.toLocaleString()}
                </p>
              </div>

              <div className="rounded-xl bg-orange-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-orange-600">
                  Outstanding Balance
                </p>

                <p className="mt-2 text-lg font-bold text-orange-700">
                  KES{" "}
                  {reservation.balanceAmount.toLocaleString()}
                </p>
              </div>
            </div>

            {error && (
              <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                {error}
              </div>
            )}

            <div className="space-y-5">
              <div>
                <label
                  htmlFor="payment-amount"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Payment Amount
                </label>

                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-500">
                    KES
                  </span>

                  <input
                    id="payment-amount"
                    type="number"
                    min="0.01"
                    max={reservation.balanceAmount}
                    step="0.01"
                    value={amount}
                    onChange={(event) =>
                      setAmount(
                        event.target.value
                      )
                    }
                    className="w-full rounded-xl border border-slate-300 py-3 pl-14 pr-4 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
                    placeholder="0.00"
                    disabled={
                      loading ||
                      reservation.balanceAmount <= 0
                    }
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="payment-method"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Payment Method
                </label>

                <select
                  id="payment-method"
                  value={method}
                  onChange={(event) =>
                    setMethod(
                      event.target.value as PaymentMethod
                    )
                  }
                  disabled={loading}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
                >
                  {paymentMethods.map(
                    (paymentMethod) => (
                      <option
                        key={
                          paymentMethod.value
                        }
                        value={
                          paymentMethod.value
                        }
                      >
                        {paymentMethod.label}
                      </option>
                    )
                  )}
                </select>
              </div>

              {method === "MPESA" && (
                <div>
                  <label
                    htmlFor="transaction-reference"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    M-Pesa Transaction Reference
                  </label>

                  <input
                    id="transaction-reference"
                    type="text"
                    value={
                      transactionReference
                    }
                    onChange={(event) =>
                      setTransactionReference(
                        event.target.value
                      )
                    }
                    disabled={loading}
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
                    placeholder="e.g. QH72ABC123"
                  />
                </div>
              )}

              {method !== "MPESA" && (
                <div>
                  <label
                    htmlFor="transaction-reference"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Transaction Reference
                    <span className="ml-1 font-normal text-slate-400">
                      (Optional)
                    </span>
                  </label>

                  <input
                    id="transaction-reference"
                    type="text"
                    value={
                      transactionReference
                    }
                    onChange={(event) =>
                      setTransactionReference(
                        event.target.value
                      )
                    }
                    disabled={loading}
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
                    placeholder="Reference number"
                  />
                </div>
              )}

              <div>
                <label
                  htmlFor="payment-notes"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Notes
                  <span className="ml-1 font-normal text-slate-400">
                    (Optional)
                  </span>
                </label>

                <textarea
                  id="payment-notes"
                  rows={3}
                  value={notes}
                  onChange={(event) =>
                    setNotes(event.target.value)
                  }
                  disabled={loading}
                  className="w-full resize-none rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
                  placeholder="Add payment notes..."
                />
              </div>
            </div>

            <div className="mt-8 flex justify-end gap-3">
              <button
                type="button"
                onClick={handleClose}
                disabled={loading}
                className="rounded-xl border border-slate-300 px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={
                  loading ||
                  reservation.balanceAmount <= 0
                }
                className="rounded-xl bg-green-700 px-6 py-3 font-semibold text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:bg-slate-400"
              >
                {loading
                  ? "Recording..."
                  : "Record Payment"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}