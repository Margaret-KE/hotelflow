import { useEffect, useState } from "react";
import type { FormEvent } from "react";

import type {
  CreateRestaurantPaymentPayload,
  RestaurantBill,
  RestaurantPaymentMethod,
} from "../types/restaurant.types";

interface PaymentModalProps {
  isOpen: boolean;
  bill: RestaurantBill | null;
  onClose: () => void;
  onSubmit: (payload: CreateRestaurantPaymentPayload) => Promise<void>;
}

const paymentMethods: RestaurantPaymentMethod[] = [
  "CASH",
  "MPESA",
  "CARD",
  "BANK_TRANSFER",
];

export default function PaymentModal({
  isOpen,
  bill,
  onClose,
  onSubmit,
}: PaymentModalProps) {
  const [amount, setAmount] = useState("");
  const [method, setMethod] =
    useState<RestaurantPaymentMethod>("CASH");
  const [reference, setReference] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [receiptNumber, setReceiptNumber] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isOpen || !bill) {
      return;
    }

    setAmount(String(Number(bill.balance)));
    setMethod("CASH");
    setReference("");
    setTransactionId("");
    setReceiptNumber("");
    setNotes("");
    setError("");
  }, [isOpen, bill]);

  if (!isOpen || !bill) {
    return null;
  }

  const balance = Number(bill.balance);
  const total = Number(bill.total);
  const amountPaid = Number(bill.amountPaid);
  const numericAmount = Number(amount);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!amount || Number.isNaN(numericAmount) || numericAmount <= 0) {
      setError("Enter a valid payment amount.");
      return;
    }

    if (numericAmount > balance) {
      setError("Payment cannot be greater than the outstanding balance.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      await onSubmit({
        orderId: bill.orderId,
        amount: numericAmount,
        method,
        reference: reference.trim() || undefined,
        transactionId: transactionId.trim() || undefined,
        receiptNumber: receiptNumber.trim() || undefined,
        notes: notes.trim() || undefined,
      });

      onClose();
    } catch (err) {
      console.error("Failed to record restaurant payment:", err);
      setError("Failed to record payment. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Take Payment
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Order {bill.orderNumber}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="text-xl leading-none text-slate-400 hover:text-slate-700 disabled:opacity-50"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <div className="grid grid-cols-3 gap-3 border-b border-slate-200 px-6 py-4">
          <div>
            <p className="text-xs text-slate-500">Total</p>
            <p className="mt-1 text-sm font-semibold text-slate-900">
              KES {total.toLocaleString()}
            </p>
          </div>

          <div>
            <p className="text-xs text-slate-500">Paid</p>
            <p className="mt-1 text-sm font-semibold text-green-600">
              KES {amountPaid.toLocaleString()}
            </p>
          </div>

          <div>
            <p className="text-xs text-slate-500">Balance</p>
            <p className="mt-1 text-sm font-semibold text-red-600">
              KES {balance.toLocaleString()}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 px-6 py-5">
            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <div>
              <label
                htmlFor="restaurant-payment-amount"
                className="mb-1.5 block text-sm font-medium text-slate-700"
              >
                Amount (KES)
              </label>

              <input
                id="restaurant-payment-amount"
                type="number"
                min="0.01"
                max={balance}
                step="0.01"
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
              />
            </div>

            <div>
              <label
                htmlFor="restaurant-payment-method"
                className="mb-1.5 block text-sm font-medium text-slate-700"
              >
                Payment Method
              </label>

              <select
                id="restaurant-payment-method"
                value={method}
                onChange={(event) =>
                  setMethod(
                    event.target.value as RestaurantPaymentMethod
                  )
                }
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
              >
                {paymentMethods.map((paymentMethod) => (
                  <option key={paymentMethod} value={paymentMethod}>
                    {paymentMethod.replace("_", " ")}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="restaurant-payment-reference"
                className="mb-1.5 block text-sm font-medium text-slate-700"
              >
                Reference
              </label>

              <input
                id="restaurant-payment-reference"
                type="text"
                value={reference}
                onChange={(event) => setReference(event.target.value)}
                placeholder="Optional payment reference"
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="restaurant-payment-transaction"
                  className="mb-1.5 block text-sm font-medium text-slate-700"
                >
                  Transaction ID
                </label>

                <input
                  id="restaurant-payment-transaction"
                  type="text"
                  value={transactionId}
                  onChange={(event) =>
                    setTransactionId(event.target.value)
                  }
                  placeholder="Optional"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                />
              </div>

              <div>
                <label
                  htmlFor="restaurant-payment-receipt"
                  className="mb-1.5 block text-sm font-medium text-slate-700"
                >
                  Receipt Number
                </label>

                <input
                  id="restaurant-payment-receipt"
                  type="text"
                  value={receiptNumber}
                  onChange={(event) =>
                    setReceiptNumber(event.target.value)
                  }
                  placeholder="Optional"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="restaurant-payment-notes"
                className="mb-1.5 block text-sm font-medium text-slate-700"
              >
                Notes
              </label>

              <textarea
                id="restaurant-payment-notes"
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                placeholder="Optional payment notes"
                rows={2}
                className="w-full resize-none rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 border-t border-slate-200 px-6 py-4">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving || balance <= 0}
              className="rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              {saving ? "Processing..." : "Record Payment"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}