import { useEffect, useState } from "react";

import type {
  BarBill,
  BarPaymentMethod,
  BarPayment,
} from "../types/bar.types";

interface PaymentModalProps {
  isOpen: boolean;
  bill: BarBill | null;
  onClose: () => void;
  onSubmit: (
    amount: number,
    method: BarPaymentMethod,
    details: {
      reference?: string;
      transactionId?: string;
      receiptNumber?: string;
      notes?: string;
    }
  ) => Promise<BarPayment>;
}

export default function PaymentModal({
  isOpen,
  bill,
  onClose,
  onSubmit,
}: PaymentModalProps) {
  const [amount, setAmount] = useState("");
  const [method, setMethod] =
    useState<BarPaymentMethod>("CASH");
  const [reference, setReference] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [receiptNumber, setReceiptNumber] =
    useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen && bill) {
      setAmount(
        bill.balance > 0
          ? bill.balance.toFixed(2)
          : ""
      );
      setMethod("CASH");
      setReference("");
      setTransactionId("");
      setReceiptNumber("");
      setNotes("");
      setError("");
    }
  }, [isOpen, bill]);

  if (!isOpen || !bill) {
    return null;
  }

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
      maximumFractionDigits: 2,
    }).format(value);

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const numericAmount = Number(amount);

    if (
      !Number.isFinite(numericAmount) ||
      numericAmount <= 0
    ) {
      setError(
        "Enter a valid payment amount greater than zero."
      );
      return;
    }

    if (numericAmount > bill.balance) {
      setError(
        "Payment amount cannot exceed the outstanding balance."
      );
      return;
    }

    try {
      setSaving(true);
      setError("");

      await onSubmit(numericAmount, method, {
        reference: reference.trim() || undefined,
        transactionId:
          transactionId.trim() || undefined,
        receiptNumber:
          receiptNumber.trim() || undefined,
        notes: notes.trim() || undefined,
      });

      onClose();
    } catch (err) {
      console.error(
        "Failed to receive bar payment:",
        err
      );

      setError(
        "Failed to receive payment. Please check the payment details and try again."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/50 p-4">
      <div className="my-8 w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Receive Payment
            </p>

            <h2 className="mt-1 text-xl font-bold text-slate-900">
              {bill.orderNumber}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            aria-label="Close modal"
            className="rounded-lg px-3 py-2 text-slate-500 hover:bg-slate-100"
          >
            ✕
          </button>
        </div>

        <div className="mb-5 rounded-xl bg-slate-50 p-4">
          <div className="flex justify-between gap-4 text-sm">
            <span className="text-slate-500">
              Order Total
            </span>

            <span className="font-medium text-slate-800">
              {formatCurrency(bill.total)}
            </span>
          </div>

          <div className="mt-2 flex justify-between gap-4 text-sm">
            <span className="text-slate-500">
              Already Paid
            </span>

            <span className="font-medium text-emerald-700">
              {formatCurrency(bill.amountPaid)}
            </span>
          </div>

          <div className="mt-3 flex justify-between gap-4 border-t border-slate-200 pt-3">
            <span className="font-semibold text-slate-900">
              Outstanding
            </span>

            <span className="text-lg font-bold text-slate-900">
              {formatCurrency(bill.balance)}
            </span>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <div>
            <label
              htmlFor="bar-payment-amount"
              className="mb-1 block text-sm font-medium text-slate-700"
            >
              Payment Amount (KES)
            </label>

            <input
              id="bar-payment-amount"
              type="number"
              value={amount}
              onChange={(event) =>
                setAmount(event.target.value)
              }
              min="0.01"
              max={bill.balance}
              step="0.01"
              required
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-lg font-semibold outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
            />
          </div>

          <div>
            <label
              htmlFor="bar-payment-method"
              className="mb-1 block text-sm font-medium text-slate-700"
            >
              Payment Method
            </label>

            <select
              id="bar-payment-method"
              value={method}
              onChange={(event) =>
                setMethod(
                  event.target.value as BarPaymentMethod
                )
              }
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
            >
              <option value="CASH">Cash</option>
              <option value="MPESA">M-Pesa</option>
              <option value="CARD">Card</option>
              <option value="BANK_TRANSFER">
                Bank Transfer
              </option>
            </select>
          </div>

          {method === "MPESA" && (
            <div>
              <label
                htmlFor="bar-payment-transaction"
                className="mb-1 block text-sm font-medium text-slate-700"
              >
                M-Pesa Transaction ID
              </label>

              <input
                id="bar-payment-transaction"
                type="text"
                value={transactionId}
                onChange={(event) =>
                  setTransactionId(event.target.value)
                }
                placeholder="e.g. QWE123RTY4"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
              />
            </div>
          )}

          {(method === "CARD" ||
            method === "BANK_TRANSFER") && (
            <div>
              <label
                htmlFor="bar-payment-reference"
                className="mb-1 block text-sm font-medium text-slate-700"
              >
                Reference
              </label>

              <input
                id="bar-payment-reference"
                type="text"
                value={reference}
                onChange={(event) =>
                  setReference(event.target.value)
                }
                placeholder="Payment reference"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
              />
            </div>
          )}

          <div>
            <label
              htmlFor="bar-payment-receipt"
              className="mb-1 block text-sm font-medium text-slate-700"
            >
              Receipt Number
            </label>

            <input
              id="bar-payment-receipt"
              type="text"
              value={receiptNumber}
              onChange={(event) =>
                setReceiptNumber(event.target.value)
              }
              placeholder="Optional receipt number"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
            />
          </div>

          <div>
            <label
              htmlFor="bar-payment-notes"
              className="mb-1 block text-sm font-medium text-slate-700"
            >
              Notes
            </label>

            <textarea
              id="bar-payment-notes"
              value={notes}
              onChange={(event) =>
                setNotes(event.target.value)
              }
              rows={2}
              placeholder="Optional payment notes"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
            />
          </div>

          {error && (
            <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
              {error}
            </p>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="rounded-xl border border-slate-300 px-4 py-2.5 font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={
                saving || bill.balance <= 0
              }
              className="rounded-xl bg-emerald-700 px-5 py-2.5 font-semibold text-white hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving
                ? "Processing..."
                : "Receive Payment"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}