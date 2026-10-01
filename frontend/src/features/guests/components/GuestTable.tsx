import {
  Eye,
  MoreHorizontal,
  Pencil,
  Trash2,
} from "lucide-react";

import type { Guest } from "../types/guest.types";

interface GuestTableProps {
  guests: Guest[];
  loading: boolean;
  onView: (guest: Guest) => void;
  onEdit: (guest: Guest) => void;
  onDelete: (guest: Guest) => void;
}

const formatDate = (date: string | null) => {
  if (!date) {
    return "—";
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "—";
  }

  return parsedDate.toLocaleDateString("en-KE", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const GuestTable = ({
  guests,
  loading,
  onView,
  onEdit,
  onDelete,
}: GuestTableProps) => {
  if (loading) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex min-h-[300px] items-center justify-center">
          <div className="text-sm text-slate-500">
            Loading guests...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Guest
              </th>

              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Contact
              </th>

              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                ID
              </th>

              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Nationality
              </th>

              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Status
              </th>

              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Registered
              </th>

              <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-200 bg-white">
            {guests.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-5 py-12 text-center"
                >
                  <div className="mx-auto max-w-sm">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                      <MoreHorizontal className="h-5 w-5 text-slate-400" />
                    </div>

                    <p className="mt-3 text-sm font-medium text-slate-900">
                      No guests found
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      Try changing your filters or add a new guest.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              guests.map((guest) => (
                <tr
                  key={guest.id}
                  className="transition hover:bg-slate-50"
                >
                  <td className="whitespace-nowrap px-5 py-4">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        {guest.firstName} {guest.lastName}
                      </p>

                      {guest.company && (
                        <p className="mt-1 text-xs text-slate-500">
                          {guest.company}
                        </p>
                      )}
                    </div>
                  </td>

                  <td className="whitespace-nowrap px-5 py-4">
                    <p className="text-sm text-slate-700">
                      {guest.phone}
                    </p>

                    {guest.email && (
                      <p className="mt-1 text-xs text-slate-500">
                        {guest.email}
                      </p>
                    )}
                  </td>

                  <td className="whitespace-nowrap px-5 py-4">
                    {guest.idType && guest.idNumber ? (
                      <div>
                        <p className="text-sm text-slate-700">
                          {guest.idNumber}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          {guest.idType.replace(/_/g, " ")}
                        </p>
                      </div>
                    ) : (
                      <span className="text-sm text-slate-400">
                        —
                      </span>
                    )}
                  </td>

                  <td className="whitespace-nowrap px-5 py-4 text-sm text-slate-600">
                    {guest.nationality || "—"}
                  </td>

                  <td className="whitespace-nowrap px-5 py-4">
                    <div className="flex flex-wrap gap-1.5">
                      {guest.vip && (
                        <span className="inline-flex rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700 ring-1 ring-inset ring-amber-600/20">
                          VIP
                        </span>
                      )}

                      {guest.blacklisted && (
                        <span className="inline-flex rounded-full bg-red-50 px-2.5 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/20">
                          Blacklisted
                        </span>
                      )}

                      {!guest.vip && !guest.blacklisted && (
                        <span className="inline-flex rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
                          Regular
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="whitespace-nowrap px-5 py-4 text-sm text-slate-600">
                    {formatDate(guest.createdAt)}
                  </td>

                  <td className="whitespace-nowrap px-5 py-4">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => onView(guest)}
                        title="View guest"
                        className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                      >
                        <Eye className="h-4 w-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => onEdit(guest)}
                        title="Edit guest"
                        className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => onDelete(guest)}
                        title="Deactivate guest"
                        className="rounded-lg p-2 text-slate-500 transition hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GuestTable;