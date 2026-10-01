import {
  Building2,
  CalendarDays,
  CreditCard,
  Edit,
  Mail,
  MapPin,
  Phone,
  ShieldAlert,
  User,
  Users,
  X,
} from "lucide-react";

import type { Guest } from "../types/guest.types";

interface GuestDetailsDrawerProps {
  isOpen: boolean;
  guest: Guest | null;
  onClose: () => void;
  onEdit: (guest: Guest) => void;
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
    month: "long",
    day: "numeric",
  });
};

const formatValue = (value: string | null) => {
  return value && value.trim() ? value : "—";
};

const GuestDetailsDrawer = ({
  isOpen,
  guest,
  onClose,
  onEdit,
}: GuestDetailsDrawerProps) => {
  if (!isOpen || !guest) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-40">
      <div
        className="absolute inset-0 bg-slate-950/40"
        onClick={onClose}
      />

      <aside className="absolute right-0 top-0 flex h-full w-full max-w-xl flex-col bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Guest Details
            </p>

            <h2 className="mt-1 text-xl font-semibold text-slate-900">
              {guest.firstName} {guest.lastName}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            title="Close"
            className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="space-y-6 p-6">
            <div className="flex flex-wrap gap-2">
              {guest.vip && (
                <span className="inline-flex rounded-full bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700 ring-1 ring-inset ring-amber-600/20">
                  VIP Guest
                </span>
              )}

              {guest.blacklisted && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700 ring-1 ring-inset ring-red-600/20">
                  <ShieldAlert className="h-3.5 w-3.5" />
                  Blacklisted
                </span>
              )}

              {!guest.vip && !guest.blacklisted && (
                <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
                  Regular Guest
                </span>
              )}
            </div>

            <section className="rounded-xl border border-slate-200 bg-slate-50 p-5">
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-slate-500" />

                <h3 className="text-sm font-semibold text-slate-900">
                  Personal Information
                </h3>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-medium text-slate-500">
                    Full Name
                  </p>

                  <p className="mt-1 text-sm text-slate-900">
                    {guest.firstName} {guest.lastName}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium text-slate-500">
                    Gender
                  </p>

                  <p className="mt-1 text-sm text-slate-900">
                    {formatValue(guest.gender)}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium text-slate-500">
                    Date of Birth
                  </p>

                  <p className="mt-1 text-sm text-slate-900">
                    {formatDate(guest.dateOfBirth)}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium text-slate-500">
                    Nationality
                  </p>

                  <p className="mt-1 text-sm text-slate-900">
                    {formatValue(guest.nationality)}
                  </p>
                </div>
              </div>
            </section>

            <section className="rounded-xl border border-slate-200 bg-white p-5">
              <div className="flex items-center gap-2">
                <Phone className="h-5 w-5 text-slate-500" />

                <h3 className="text-sm font-semibold text-slate-900">
                  Contact Information
                </h3>
              </div>

              <div className="mt-4 space-y-3">
                <div className="flex items-start gap-3">
                  <Phone className="mt-0.5 h-4 w-4 text-slate-400" />

                  <div>
                    <p className="text-xs font-medium text-slate-500">
                      Phone
                    </p>

                    <p className="mt-1 text-sm text-slate-900">
                      {guest.phone}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="mt-0.5 h-4 w-4 text-slate-400" />

                  <div>
                    <p className="text-xs font-medium text-slate-500">
                      Email
                    </p>

                    <p className="mt-1 text-sm text-slate-900">
                      {formatValue(guest.email)}
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section className="rounded-xl border border-slate-200 bg-white p-5">
              <div className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-slate-500" />

                <h3 className="text-sm font-semibold text-slate-900">
                  Identification
                </h3>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-medium text-slate-500">
                    ID Type
                  </p>

                  <p className="mt-1 text-sm text-slate-900">
                    {guest.idType
                      ? guest.idType.replace(/_/g, " ")
                      : "—"}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium text-slate-500">
                    ID Number
                  </p>

                  <p className="mt-1 text-sm text-slate-900">
                    {formatValue(guest.idNumber)}
                  </p>
                </div>
              </div>
            </section>

            <section className="rounded-xl border border-slate-200 bg-white p-5">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-slate-500" />

                <h3 className="text-sm font-semibold text-slate-900">
                  Address
                </h3>
              </div>

              <div className="mt-4 space-y-3">
                <div>
                  <p className="text-xs font-medium text-slate-500">
                    Address
                  </p>

                  <p className="mt-1 text-sm text-slate-900">
                    {formatValue(guest.address)}
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-xs font-medium text-slate-500">
                      City
                    </p>

                    <p className="mt-1 text-sm text-slate-900">
                      {formatValue(guest.city)}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-medium text-slate-500">
                      Country
                    </p>

                    <p className="mt-1 text-sm text-slate-900">
                      {formatValue(guest.country)}
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section className="rounded-xl border border-slate-200 bg-white p-5">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-slate-500" />

                <h3 className="text-sm font-semibold text-slate-900">
                  Emergency Contact
                </h3>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-medium text-slate-500">
                    Name
                  </p>

                  <p className="mt-1 text-sm text-slate-900">
                    {formatValue(guest.emergencyName)}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium text-slate-500">
                    Phone
                  </p>

                  <p className="mt-1 text-sm text-slate-900">
                    {formatValue(guest.emergencyPhone)}
                  </p>
                </div>
              </div>
            </section>

            <section className="rounded-xl border border-slate-200 bg-white p-5">
              <div className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-slate-500" />

                <h3 className="text-sm font-semibold text-slate-900">
                  Additional Information
                </h3>
              </div>

              <div className="mt-4 space-y-4">
                <div>
                  <p className="text-xs font-medium text-slate-500">
                    Company
                  </p>

                  <p className="mt-1 text-sm text-slate-900">
                    {formatValue(guest.company)}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium text-slate-500">
                    Notes
                  </p>

                  <p className="mt-1 whitespace-pre-wrap text-sm text-slate-700">
                    {formatValue(guest.notes)}
                  </p>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <CalendarDays className="h-4 w-4" />
                  Registered {formatDate(guest.createdAt)}
                </div>
              </div>
            </section>
          </div>
        </div>

        <div className="border-t border-slate-200 bg-slate-50 px-6 py-4">
          <button
            type="button"
            onClick={() => onEdit(guest)}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
          >
            <Edit className="h-4 w-4" />
            Edit Guest
          </button>
        </div>
      </aside>
    </div>
  );
};

export default GuestDetailsDrawer;