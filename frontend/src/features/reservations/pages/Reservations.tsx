import { useMemo, useState } from "react";

import DashboardLayout from "../../../layouts/DashboardLayout";

import ReservationStatCard from "../components/ReservationStatCard";
import ReservationSearch from "../components/ReservationSearch";
import ReservationFilters from "../components/ReservationFilters";
import ReservationSummary from "../components/ReservationSummary";
import ReservationTable from "../components/ReservationTable";
import ReservationDetailsDrawer from "../components/ReservationDetailsDrawer";
import EditReservationModal from "../components/EditReservationModal";
import ManageStayModal from "../components/ManageStayModal";
import ReservationInvoice from "../components/ReservationInvoice";
import NewReservationModal from "../components/NewReservationModal";
import RecordPaymentModal from "../components/RecordPaymentModal";

import {
  CalendarDays,
  LogIn,
  Hotel,
  Clock,
} from "lucide-react";

import { useReservations } from "../hooks/useReservations";

import type { Reservation } from "../types/reservation.types";

type ReservationFilter =
  | "All"
  | "Today"
  | "Upcoming"
  | "Checked In"
  | "Checked Out"
  | "Cancelled";

export default function Reservations() {
  const {
    reservations,
    refreshReservations,
    updateReservation,
    checkInReservation,
    checkOutReservation,
    cancelReservation,
    noShowReservation,
  } = useReservations();

  const [searchTerm, setSearchTerm] =
    useState("");

  const [activeFilter, setActiveFilter] =
    useState<ReservationFilter>("All");

  const [drawerOpen, setDrawerOpen] =
    useState(false);

  const [selectedReservation, setSelectedReservation] =
    useState<Reservation | null>(null);

  const [editModalOpen, setEditModalOpen] =
    useState(false);

  const [editingReservation, setEditingReservation] =
    useState<Reservation | null>(null);

  const [manageStayOpen, setManageStayOpen] =
    useState(false);

  const [stayReservation, setStayReservation] =
    useState<Reservation | null>(null);

  const [invoiceOpen, setInvoiceOpen] =
    useState(false);

  const [invoiceReservation, setInvoiceReservation] =
    useState<Reservation | null>(null);

  const [paymentModalOpen, setPaymentModalOpen] =
    useState(false);

  const [paymentReservation, setPaymentReservation] =
    useState<Reservation | null>(null);

  const [newReservationOpen, setNewReservationOpen] =
    useState(false);

  const today = useMemo(() => {
    const date = new Date();

    return new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    );
  }, []);

  const normalizeDate = (value: string) => {
    const date = new Date(value);

    return new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    );
  };

  const filteredReservations = useMemo(() => {
    const search =
      searchTerm.trim().toLowerCase();

    return reservations.filter(
      (reservation) => {
        const checkIn =
          normalizeDate(
            reservation.checkInDate
          );

        const checkOut =
          normalizeDate(
            reservation.checkOutDate
          );

        const matchesSearch =
          search === "" ||
          reservation.guest
            .toLowerCase()
            .includes(search) ||
          reservation.guestNo
            .toLowerCase()
            .includes(search) ||
          reservation.guestPhone
            .toLowerCase()
            .includes(search) ||
          reservation.accommodation
            .toLowerCase()
            .includes(search) ||
          reservation.stay
            .toLowerCase()
            .includes(search) ||
          reservation.source
            .toLowerCase()
            .includes(search);

        let matchesFilter = true;

        if (activeFilter === "Today") {
          matchesFilter =
            checkIn.getTime() ===
              today.getTime() ||
            checkOut.getTime() ===
              today.getTime();
        }

        if (activeFilter === "Upcoming") {
          matchesFilter =
            checkIn.getTime() >
              today.getTime() &&
            reservation.status ===
              "RESERVED";
        }

        if (activeFilter === "Checked In") {
          matchesFilter =
            reservation.status ===
            "CHECKED_IN";
        }

        if (activeFilter === "Checked Out") {
          matchesFilter =
            reservation.status ===
            "CHECKED_OUT";
        }

        if (activeFilter === "Cancelled") {
          matchesFilter =
            reservation.status ===
            "CANCELLED";
        }

        return (
          matchesSearch &&
          matchesFilter
        );
      }
    );
  }, [
    reservations,
    searchTerm,
    activeFilter,
    today,
  ]);

  const todayArrivals = useMemo(() => {
    return reservations.filter(
      (reservation) => {
        const checkIn =
          normalizeDate(
            reservation.checkInDate
          );

        return (
          checkIn.getTime() ===
            today.getTime() &&
          reservation.status ===
            "RESERVED"
        );
      }
    ).length;
  }, [reservations, today]);

  const todayDepartures = useMemo(() => {
    return reservations.filter(
      (reservation) => {
        const checkOut =
          normalizeDate(
            reservation.checkOutDate
          );

        return (
          checkOut.getTime() ===
            today.getTime() &&
          reservation.status ===
            "CHECKED_IN"
        );
      }
    ).length;
  }, [reservations, today]);

  const inHouse = useMemo(() => {
    return reservations.filter(
      (reservation) =>
        reservation.status ===
        "CHECKED_IN"
    ).length;
  }, [reservations]);

  const pending = useMemo(() => {
    return reservations.filter(
      (reservation) =>
        reservation.status ===
        "RESERVED"
    ).length;
  }, [reservations]);

  const occupancy = useMemo(() => {
    if (reservations.length === 0) {
      return 0;
    }

    return Math.round(
      (inHouse /
        reservations.length) *
        100
    );
  }, [
    reservations.length,
    inHouse,
  ]);

  const availableRooms = useMemo(() => {
    const occupiedRooms =
      new Set<string>();

    reservations.forEach(
      (reservation) => {
        if (
          reservation.status ===
          "CHECKED_IN"
        ) {
          occupiedRooms.add(
            reservation.accommodation
          );
        }
      }
    );

    const knownRooms =
      new Set<string>();

    reservations.forEach(
      (reservation) => {
        if (
          reservation.accommodation
        ) {
          knownRooms.add(
            reservation.accommodation
          );
        }
      }
    );

    return Math.max(
      knownRooms.size -
        occupiedRooms.size,
      0
    );
  }, [reservations]);

  const vipGuests = useMemo(() => {
    return 0;
  }, []);

  const todayRevenue = useMemo(() => {
    return reservations
      .filter((reservation) => {
        const checkIn =
          normalizeDate(
            reservation.checkInDate
          );

        return (
          checkIn.getTime() ===
          today.getTime()
        );
      })
      .reduce(
        (total, reservation) => {
          const amount = Number(
            reservation.amount.replace(
              /[^0-9.-]+/g,
              ""
            )
          );

          if (Number.isNaN(amount)) {
            return total;
          }

          return total + amount;
        },
        0
      );
  }, [reservations, today]);

  const handleView = (
    reservation: Reservation
  ) => {
    setSelectedReservation(
      reservation
    );

    setDrawerOpen(true);
  };

  const handleEdit = (
    reservation: Reservation
  ) => {
    setEditingReservation(
      reservation
    );

    setEditModalOpen(true);
  };

  const handleManageStay = (
    reservation: Reservation
  ) => {
    setStayReservation(
      reservation
    );

    setManageStayOpen(true);
  };

  const handleInvoice = (
    reservation: Reservation
  ) => {
    setInvoiceReservation(
      reservation
    );

    setInvoiceOpen(true);
  };

  const handleRecordPayment = (
    reservation: Reservation
  ) => {
    setPaymentReservation(
      reservation
    );

    setPaymentModalOpen(true);
  };

  const handleSaveEdit = (
    id: string,
    updates: Partial<Reservation>
  ) => {
    updateReservation(
      id,
      updates
    );

    setSelectedReservation(
      (current) => {
        if (
          !current ||
          current.id !== id
        ) {
          return current;
        }

        return {
          ...current,
          ...updates,
        };
      }
    );
  };

  const handleCheckIn = (
    reservation: Reservation
  ) => {
    checkInReservation(
      reservation.id
    );

    setSelectedReservation(
      (current) => {
        if (
          !current ||
          current.id !==
            reservation.id
        ) {
          return current;
        }

        return {
          ...current,
          status: "CHECKED_IN",
        };
      }
    );
  };

  const handleCheckOut = (
    reservation: Reservation
  ) => {
    const confirmed =
      window.confirm(
        `Check out ${reservation.guest} from ${reservation.accommodation}?`
      );

    if (!confirmed) {
      return;
    }

    checkOutReservation(
      reservation.id
    );

    setSelectedReservation(
      (current) => {
        if (
          !current ||
          current.id !==
            reservation.id
        ) {
          return current;
        }

        return {
          ...current,
          status: "CHECKED_OUT",
        };
      }
    );
  };

  const handleCancel = (
    reservation: Reservation
  ) => {
    const confirmed =
      window.confirm(
        `Cancel reservation ${reservation.guestNo} for ${reservation.guest}?`
      );

    if (!confirmed) {
      return;
    }

    cancelReservation(
      reservation.id
    );

    setSelectedReservation(
      (current) => {
        if (
          !current ||
          current.id !==
            reservation.id
        ) {
          return current;
        }

        return {
          ...current,
          status: "CANCELLED",
        };
      }
    );
  };

  const handleNoShow = (
    reservation: Reservation
  ) => {
    const confirmed =
      window.confirm(
        `Mark reservation ${reservation.guestNo} for ${reservation.guest} as a no-show?`
      );

    if (!confirmed) {
      return;
    }

    noShowReservation(
      reservation.id
    );

    setSelectedReservation(
      (current) => {
        if (
          !current ||
          current.id !==
            reservation.id
        ) {
          return current;
        }

        return {
          ...current,
          status: "NO_SHOW",
        };
      }
    );
  };

  const handlePaymentSuccess = async (
    updatedReservation: Reservation
  ) => {
    setSelectedReservation(
      updatedReservation
    );

    setPaymentReservation(
      updatedReservation
    );

    if (
      invoiceReservation &&
      invoiceReservation.id ===
        updatedReservation.id
    ) {
      setInvoiceReservation(
        updatedReservation
      );
    }

    await refreshReservations();
  };

  return (
    <DashboardLayout>
      <div>
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Reservations & Check-ins
            </h1>

            <p className="mt-2 text-slate-600">
              Manage bookings, arrivals and departures.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              setNewReservationOpen(
                true
              )
            }
            className="rounded-xl bg-green-700 px-6 py-3 font-semibold text-white transition hover:bg-green-800"
          >
            + New Reservation
          </button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          <ReservationStatCard
            title="Today's Arrivals"
            value={String(
              todayArrivals
            )}
            subtitle="Expected today"
            icon={CalendarDays}
            color="green"
          />

          <ReservationStatCard
            title="Today's Departures"
            value={String(
              todayDepartures
            )}
            subtitle="Checking out"
            icon={LogIn}
            color="amber"
          />

          <ReservationStatCard
            title="In House"
            value={String(
              inHouse
            )}
            subtitle="Current guests"
            icon={Hotel}
            color="blue"
          />

          <ReservationStatCard
            title="Pending"
            value={String(
              pending
            )}
            subtitle="Awaiting confirmation"
            icon={Clock}
            color="rose"
          />
        </div>

        <div className="mt-8">
          <ReservationSearch
            value={searchTerm}
            onChange={setSearchTerm}
            onNewReservation={() =>
              setNewReservationOpen(
                true
              )
            }
          />
        </div>

        <div className="mt-6">
          <ReservationFilters
            activeFilter={activeFilter}
            onChange={
              setActiveFilter
            }
          />
        </div>

        <div className="mt-8">
          <ReservationSummary
            occupancy={occupancy}
            availableRooms={
              availableRooms
            }
            vipGuests={vipGuests}
            todayRevenue={
              todayRevenue
            }
          />
        </div>

        <div className="mt-8">
          <ReservationTable
            reservations={
              filteredReservations
            }
            onView={handleView}
            onEdit={handleEdit}
            onCheckIn={
              handleCheckIn
            }
            onCheckOut={
              handleCheckOut
            }
            onCancel={
              handleCancel
            }
            onNoShow={
              handleNoShow
            }
            onManageStay={
              handleManageStay
            }
          />
        </div>

        <ReservationDetailsDrawer
          open={drawerOpen}
          reservation={
            selectedReservation
          }
          onClose={() => {
            setDrawerOpen(false);
            setSelectedReservation(
              null
            );
          }}
          onEdit={handleEdit}
          onInvoice={
            handleInvoice
          }
          onCheckIn={
            handleCheckIn
          }
          onCheckOut={
            handleCheckOut
          }
          onRecordPayment={
            handleRecordPayment
          }
        />

        <EditReservationModal
          open={editModalOpen}
          reservation={
            editingReservation
          }
          onClose={() => {
            setEditModalOpen(false);
            setEditingReservation(
              null
            );
          }}
          onSave={
            handleSaveEdit
          }
        />

        <ManageStayModal
          open={manageStayOpen}
          reservation={
            stayReservation
          }
          onClose={() => {
            setManageStayOpen(false);
            setStayReservation(
              null
            );
          }}
          onSave={(
            id,
            updates
          ) => {
            updateReservation(
              id,
              updates
            );

            setSelectedReservation(
              (current) => {
                if (
                  !current ||
                  current.id !== id
                ) {
                  return current;
                }

                return {
                  ...current,
                  ...updates,
                };
              }
            );
          }}
        />

        <ReservationInvoice
          open={invoiceOpen}
          reservation={
            invoiceReservation
          }
          onClose={() => {
            setInvoiceOpen(false);
            setInvoiceReservation(
              null
            );
          }}
        />

        <RecordPaymentModal
          open={
            paymentModalOpen
          }
          reservation={
            paymentReservation
          }
          onClose={() => {
            setPaymentModalOpen(
              false
            );
            setPaymentReservation(
              null
            );
          }}
          onSuccess={
            handlePaymentSuccess
          }
        />

        <NewReservationModal
          open={
            newReservationOpen
          }
          onClose={() =>
            setNewReservationOpen(
              false
            )
          }
          onCreated={
            refreshReservations
          }
        />
      </div>
    </DashboardLayout>
  );
}