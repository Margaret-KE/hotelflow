import {
  Eye,
  Pencil,
  BadgeCheck,
  Clock3,
  XCircle,
  LogOut,
  UserX,
} from "lucide-react";

import type { Reservation } from "../types/reservation.types";

interface ReservationTableProps {
  reservations: Reservation[];
  onView: (reservation: Reservation) => void;
  onEdit: (reservation: Reservation) => void;
  onCheckIn: (reservation: Reservation) => void;
  onCheckOut: (reservation: Reservation) => void;
  onCancel: (reservation: Reservation) => void;
  onNoShow: (reservation: Reservation) => void;
  onManageStay: (reservation: Reservation) => void;
}

function StatusBadge({ status }: { status: string }) {
  switch (status) {
    case "CHECKED_IN":
      return (
        <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
          Checked In
        </span>
      );

    case "RESERVED":
      return (
        <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
          Reserved
        </span>
      );

    case "Pending":
      return (
        <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
          Pending
        </span>
      );

    case "CHECKED_OUT":
      return (
        <span className="rounded-full bg-slate-200 px-3 py-1 text-xs font-semibold text-slate-700">
          Checked Out
        </span>
      );

    case "CANCELLED":
      return (
        <span className="rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-700">
          Cancelled
        </span>
      );

    case "NO_SHOW":
      return (
        <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700">
          No-Show
        </span>
      );

    default:
      return (
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
          {status}
        </span>
      );
  }
}

function PaymentBadge({ payment }: { payment: string }) {
  const styles =
    payment === "Paid"
      ? "bg-green-100 text-green-700"
      : payment === "Partial"
        ? "bg-blue-100 text-blue-700"
        : "bg-amber-100 text-amber-700";

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold ${styles}`}
    >
      {payment}
    </span>
  );
}

export default function ReservationTable({
  reservations,
  onView,
  onEdit,
  onCheckIn,
  onCheckOut,
  onCancel,
  onNoShow,
  onManageStay,
}: ReservationTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* Header */}
      <div className="border-b border-slate-200 px-6 py-5">
        <h2 className="text-lg font-bold text-slate-800">
          Reservation List
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          View and manage all guest reservations.
        </p>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                Guest
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                Accommodation
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                Stay
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                Payment
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                Status
              </th>

              <th className="px-6 py-4 text-center text-sm font-semibold text-slate-600">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {reservations.map((reservation) => (
              <tr
                key={reservation.id}
                className="border-b border-slate-100 transition hover:bg-green-50"
              >
                {/* Guest */}
                <td className="px-6 py-5">
                  <div>
                    <p className="font-semibold text-slate-800">
                      {reservation.guest}
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      {reservation.guestNo}
                    </p>
                  </div>
                </td>

                {/* Accommodation */}
                <td className="px-6 py-5 text-slate-600">
                  {reservation.accommodation}
                </td>

                {/* Stay */}
                <td className="px-6 py-5">
                  <div>
                    <p className="text-slate-600">
                      {reservation.stay}
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      {reservation.nights}{" "}
                      {reservation.nights === 1
                        ? "night"
                        : "nights"}
                    </p>
                  </div>
                </td>

                {/* Payment */}
                <td className="px-6 py-5">
                  <div>
                    <PaymentBadge
                      payment={reservation.payment}
                    />

                    <p className="mt-2 text-xs font-medium text-slate-500">
                      {reservation.amount}
                    </p>
                  </div>
                </td>

                {/* Status */}
                <td className="px-6 py-5">
                  <StatusBadge
                    status={reservation.status}
                  />
                </td>

                {/* Actions */}
                <td className="px-6 py-5">
                  <div className="flex justify-center gap-2">
                    {/* View */}
                    <button
                      type="button"
                      title="View reservation"
                      onClick={() => onView(reservation)}
                      className="rounded-lg p-2 text-blue-600 transition hover:bg-blue-100"
                    >
                      <Eye size={18} />
                    </button>

                    {/* Edit */}
                    <button
                      type="button"
                      title="Edit reservation"
                      onClick={() => onEdit(reservation)}
                      className="rounded-lg p-2 text-green-700 transition hover:bg-green-100"
                    >
                      <Pencil size={18} />
                    </button>

                    {/* Manage Stay */}
                    <button
                      type="button"
                      title="Manage stay"
                      onClick={() => onManageStay(reservation)}
                      className="rounded-lg p-2 text-amber-600 transition hover:bg-amber-100"
                    >
                      <Clock3 size={18} />
                    </button>

                    {/* Check In */}
                    {reservation.status === "RESERVED" && (
                      <button
                        type="button"
                        title="Check in"
                        onClick={() => onCheckIn(reservation)}
                        className="rounded-lg p-2 text-emerald-600 transition hover:bg-emerald-100"
                      >
                        <BadgeCheck size={18} />
                      </button>
                    )}

                    {/* Check Out */}
                    {reservation.status === "CHECKED_IN" && (
                      <button
                        type="button"
                        title="Check out"
                        onClick={() => onCheckOut(reservation)}
                        className="rounded-lg p-2 text-indigo-600 transition hover:bg-indigo-100"
                      >
                        <LogOut size={18} />
                      </button>
                    )}

                    {/* No-Show */}
                    {reservation.status === "RESERVED" && (
                      <button
                        type="button"
                        title="Mark as no-show"
                        onClick={() => onNoShow(reservation)}
                        className="rounded-lg p-2 text-orange-600 transition hover:bg-orange-100"
                      >
                        <UserX size={18} />
                      </button>
                    )}

                    {/* Cancel */}
                    <button
                      type="button"
                      title="Cancel reservation"
                      disabled={
                        reservation.status === "CHECKED_OUT" ||
                        reservation.status === "CANCELLED" ||
                        reservation.status === "CHECKED_IN"
                      }
                      onClick={() => onCancel(reservation)}
                      className="rounded-lg p-2 text-rose-600 transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-30"
                    >
                      <XCircle size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {reservations.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-12 text-center text-slate-500"
                >
                  No reservations found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}