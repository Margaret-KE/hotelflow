import { useMemo, useState } from "react";

import {
  Mail,
  Plus,
  ShieldAlert,
  Star,
  UserCheck,
  Users,
} from "lucide-react";

import DashboardLayout from "../../../layouts/DashboardLayout";

import GuestDetailsDrawer from "../components/GuestDetailsDrawer";
import GuestFilters from "../components/GuestFilters";
import GuestFormModal from "../components/GuestFormModal";
import GuestStatCard from "../components/GuestStatCard";
import GuestTable from "../components/GuestTable";

import { guestService } from "../services/guest.service";

import { useGuests } from "../hooks/useGuests";

import type {
  CreateGuestDto,
  Guest,
  GuestFilters as GuestFilterValues,
  UpdateGuestDto,
} from "../types/guest.types";

const Guests = () => {
  const [filters, setFilters] = useState<GuestFilterValues>({});
  const [search, setSearch] = useState("");

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingGuest, setEditingGuest] = useState<Guest | null>(null);

  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);

  const [actionError, setActionError] = useState("");

  const {
    guests,
    loading,
    error,
    refresh,
  } = useGuests(filters);

  const filteredGuests = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return guests;
    }

    return guests.filter((guest) => {
      const fullName =
        `${guest.firstName} ${guest.lastName}`.toLowerCase();

      const phone = guest.phone.toLowerCase();
      const email = guest.email
        ? guest.email.toLowerCase()
        : "";
      const idNumber = guest.idNumber
        ? guest.idNumber.toLowerCase()
        : "";
      const company = guest.company
        ? guest.company.toLowerCase()
        : "";

      return (
        fullName.includes(query) ||
        phone.includes(query) ||
        email.includes(query) ||
        idNumber.includes(query) ||
        company.includes(query)
      );
    });
  }, [guests, search]);

  const totalGuests = guests.length;

  const vipGuests = guests.filter(
    (guest) => guest.vip
  ).length;

  const blacklistedGuests = guests.filter(
    (guest) => guest.blacklisted
  ).length;

  const guestsWithEmail = guests.filter(
    (guest) => Boolean(guest.email)
  ).length;

  const openCreateGuest = () => {
    setActionError("");
    setEditingGuest(null);
    setIsFormOpen(true);
  };

  const openEditGuest = (guest: Guest) => {
    setActionError("");
    setSelectedGuest(null);
    setIsDetailsOpen(false);
    setEditingGuest(guest);
    setIsFormOpen(true);
  };

  const closeGuestForm = () => {
    setIsFormOpen(false);
    setEditingGuest(null);
  };

  const openGuestDetails = (guest: Guest) => {
    setActionError("");
    setSelectedGuest(guest);
    setIsDetailsOpen(true);
  };

  const closeGuestDetails = () => {
    setIsDetailsOpen(false);
    setSelectedGuest(null);
  };

  const handleGuestSubmit = async (
    data: CreateGuestDto | UpdateGuestDto
  ) => {
    try {
      setActionError("");

      if (editingGuest) {
        await guestService.updateGuest(
          editingGuest.id,
          data as UpdateGuestDto
        );
      } else {
        await guestService.createGuest(
          data as CreateGuestDto
        );
      }

      await refresh();
      closeGuestForm();
    } catch (err) {
      console.error("Failed to save guest:", err);

      setActionError(
        "Failed to save guest. Please check the details and try again."
      );

      throw err;
    }
  };

  const handleDeleteGuest = async (guest: Guest) => {
    const confirmed = window.confirm(
      `Are you sure you want to deactivate ${guest.firstName} ${guest.lastName}?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setActionError("");

      await guestService.deleteGuest(guest.id);

      if (
        selectedGuest &&
        selectedGuest.id === guest.id
      ) {
        closeGuestDetails();
      }

      await refresh();
    } catch (err) {
      console.error("Failed to deactivate guest:", err);

      setActionError(
        "Failed to deactivate guest. Please try again."
      );
    }
  };

  const handleClearFilters = () => {
    setSearch("");
    setFilters({});
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">
              Front Office
            </p>

            <h1 className="mt-1 text-3xl font-bold text-slate-900">
              Guests
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Manage guest profiles, identification, contacts,
              and guest status.
            </p>
          </div>

          <button
            type="button"
            onClick={openCreateGuest}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
          >
            <Plus className="h-4 w-4" />
            Add Guest
          </button>
        </div>

        {/* Error */}
        {(error || actionError) && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {actionError || error}
          </div>
        )}

        {/* Statistics */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <GuestStatCard
            title="Total Guests"
            value={totalGuests}
            icon={Users}
            description="Active guest profiles"
          />

          <GuestStatCard
            title="VIP Guests"
            value={vipGuests}
            icon={Star}
            description="Guests marked as VIP"
          />

          <GuestStatCard
            title="Blacklisted"
            value={blacklistedGuests}
            icon={ShieldAlert}
            description="Restricted guest profiles"
          />

          <GuestStatCard
            title="Email Profiles"
            value={guestsWithEmail}
            icon={Mail}
            description="Guests with email addresses"
          />
        </div>

        {/* Filters */}
        <GuestFilters
          filters={filters}
          search={search}
          onSearchChange={setSearch}
          onFiltersChange={setFilters}
          onClear={handleClearFilters}
        />

        {/* Results Summary */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-900">
              Guest Directory
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Showing {filteredGuests.length} of {guests.length} guests
            </p>
          </div>

          <div className="flex items-center gap-2 text-sm text-slate-500">
            <UserCheck className="h-4 w-4" />
            Active guests only
          </div>
        </div>

        {/* Guest Table */}
        <GuestTable
          guests={filteredGuests}
          loading={loading}
          onView={openGuestDetails}
          onEdit={openEditGuest}
          onDelete={handleDeleteGuest}
        />
      </div>

      {/* Guest Form */}
      <GuestFormModal
        isOpen={isFormOpen}
        guest={editingGuest}
        onClose={closeGuestForm}
        onSubmit={handleGuestSubmit}
      />

      {/* Guest Details */}
      <GuestDetailsDrawer
        isOpen={isDetailsOpen}
        guest={selectedGuest}
        onClose={closeGuestDetails}
        onEdit={openEditGuest}
      />
    </DashboardLayout>
  );
};

export default Guests;