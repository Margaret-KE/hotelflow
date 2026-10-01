import type { RestaurantOrder } from "../types/restaurant.types";

interface OrderSummaryProps {
  order: RestaurantOrder | null;
  onPayment: () => void;
  onCancel: () => void;
}

export default function OrderSummary({
  order,
  onPayment,
  onCancel,
}: OrderSummaryProps) {
  if (!order) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-base font-semibold text-slate-900">
          Order Summary
        </h3>

        <p className="mt-4 text-sm text-slate-500">
          No active order selected.
        </p>
      </div>
    );
  }

  const subtotal = Number(order.subtotal);
  const tax = Number(order.tax);
  const serviceCharge = Number(order.serviceCharge);
  const discount = Number(order.discount);
  const total = Number(order.total);

  const canPay =
    order.status !== "CANCELLED" &&
    order.status !== "COMPLETED" &&
    total > 0;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-slate-900">
          Order Summary
        </h3>

        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
          {order.orderNumber}
        </span>
      </div>

      <div className="mt-5 space-y-3 text-sm">
        <div className="flex justify-between text-slate-600">
          <span>Subtotal</span>
          <span>KES {subtotal.toLocaleString()}</span>
        </div>

        <div className="flex justify-between text-slate-600">
          <span>VAT</span>
          <span>KES {tax.toLocaleString()}</span>
        </div>

        <div className="flex justify-between text-slate-600">
          <span>Service Charge</span>
          <span>KES {serviceCharge.toLocaleString()}</span>
        </div>

        {discount > 0 && (
          <div className="flex justify-between text-slate-600">
            <span>Discount</span>
            <span>- KES {discount.toLocaleString()}</span>
          </div>
        )}

        <div className="border-t border-slate-200 pt-3">
          <div className="flex justify-between text-base font-bold text-slate-900">
            <span>Total</span>
            <span>KES {total.toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={onCancel}
          disabled={order.status === "CANCELLED"}
          className="rounded-lg border border-red-200 px-4 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Cancel Order
        </button>

        <button
          type="button"
          onClick={onPayment}
          disabled={!canPay}
          className="rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          Take Payment
        </button>
      </div>
    </div>
  );
}