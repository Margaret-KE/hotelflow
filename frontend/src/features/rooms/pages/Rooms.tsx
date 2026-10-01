import { useMemo, useState } from "react";
import {
  BedDouble,
  Building2,
  CheckCircle2,
  Plus,
  Settings,
  Wrench,
} from "lucide-react";

import DashboardLayout from "../../../layouts/DashboardLayout";

import RoomStatCard from "../components/RoomStatCard";
import RoomFilters from "../components/RoomFilters";
import RoomTable from "../components/RoomTable";
import RoomFormModal from "../components/RoomFormModal";
import RoomDetailsDrawer from "../components/RoomDetailsDrawer";
import RoomTypesPanel from "../components/RoomTypesPanel";

import { useRooms } from "../hooks/useRooms";

import { roomService } from "../services/room.service";
import { roomTypeService } from "../services/roomType.service";

import type {
  CreateRoomDto,
  CreateRoomTypeDto,
  Room,
  RoomFilters as RoomFilterValues,
  UpdateRoomDto,
  UpdateRoomTypeDto,
} from "../types/room.types";

const Rooms = () => {
  const [filters, setFilters] = useState<RoomFilterValues>({});
  const [search, setSearch] = useState("");

  const [isRoomModalOpen, setIsRoomModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [detailsRoom, setDetailsRoom] = useState<Room | null>(null);

  const [actionError, setActionError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const {
    rooms,
    roomTypes,
    loading,
    error,
    refresh,
  } = useRooms(filters);

  const filteredRooms = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    if (!searchValue) {
      return rooms;
    }

    return rooms.filter((room) => {
      const roomNumber = room.roomNumber.toLowerCase();
      const roomTypeName = room.roomType.name.toLowerCase();
      const floor = room.floor
        ? room.floor.toLowerCase()
        : "";

      return (
        roomNumber.includes(searchValue) ||
        roomTypeName.includes(searchValue) ||
        floor.includes(searchValue)
      );
    });
  }, [rooms, search]);

  const roomStats = useMemo(() => {
    let available = 0;
    let occupied = 0;
    let reserved = 0;
    let cleaning = 0;
    let maintenance = 0;
    let outOfService = 0;

    rooms.forEach((room) => {
      switch (room.status) {
        case "AVAILABLE":
          available += 1;
          break;

        case "OCCUPIED":
          occupied += 1;
          break;

        case "RESERVED":
          reserved += 1;
          break;

        case "CLEANING":
          cleaning += 1;
          break;

        case "MAINTENANCE":
          maintenance += 1;
          break;

        case "OUT_OF_SERVICE":
          outOfService += 1;
          break;

        default:
          break;
      }
    });

    return {
      total: rooms.length,
      available,
      occupied,
      reserved,
      cleaning,
      maintenance,
      outOfService,
    };
  }, [rooms]);

  const openCreateRoom = () => {
    setSelectedRoom(null);
    setActionError("");
    setIsRoomModalOpen(true);
  };

  const openEditRoom = (room: Room) => {
    setSelectedRoom(room);
    setActionError("");
    setIsRoomModalOpen(true);
  };

  const closeRoomModal = () => {
    if (isSaving) {
      return;
    }

    setIsRoomModalOpen(false);
    setSelectedRoom(null);
  };

  const openRoomDetails = (room: Room) => {
    setDetailsRoom(room);
    setIsDetailsOpen(true);
  };

  const closeRoomDetails = () => {
    setIsDetailsOpen(false);
    setDetailsRoom(null);
  };

  const handleRoomSubmit = async (
    data: CreateRoomDto | UpdateRoomDto,
    roomId?: string
  ) => {
    setActionError("");
    setIsSaving(true);

    try {
      if (roomId) {
        await roomService.updateRoom(
          roomId,
          data as UpdateRoomDto
        );
      } else {
        await roomService.createRoom(
          data as CreateRoomDto
        );
      }

      setIsRoomModalOpen(false);
      setSelectedRoom(null);

      await refresh();
    } catch (submitError) {
      if (submitError instanceof Error) {
        setActionError(submitError.message);
      } else {
        setActionError(
          "Failed to save room. Please try again."
        );
      }

      throw submitError;
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteRoom = async (room: Room) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete room ${room.roomNumber}?`
    );

    if (!confirmed) {
      return;
    }

    setActionError("");

    try {
      await roomService.deleteRoom(room.id);

      if (
        detailsRoom &&
        detailsRoom.id === room.id
      ) {
        closeRoomDetails();
      }

      await refresh();
    } catch (deleteError) {
      if (deleteError instanceof Error) {
        setActionError(deleteError.message);
      } else {
        setActionError(
          "Failed to delete room. Please try again."
        );
      }
    }
  };

  const handleCreateRoomType = async (
    data: CreateRoomTypeDto
  ) => {
    setActionError("");

    try {
      await roomTypeService.createRoomType(data);
      await refresh();
    } catch (createError) {
      if (createError instanceof Error) {
        setActionError(createError.message);
      } else {
        setActionError(
          "Failed to create room type. Please try again."
        );
      }

      throw createError;
    }
  };

  const handleUpdateRoomType = async (
    id: string,
    data: UpdateRoomTypeDto
  ) => {
    setActionError("");

    try {
      await roomTypeService.updateRoomType(id, data);
      await refresh();
    } catch (updateError) {
      if (updateError instanceof Error) {
        setActionError(updateError.message);
      } else {
        setActionError(
          "Failed to update room type. Please try again."
        );
      }

      throw updateError;
    }
  };

  const handleDeleteRoomType = async (id: string) => {
    setActionError("");

    try {
      await roomTypeService.deleteRoomType(id);
      await refresh();
    } catch (deleteError) {
      if (deleteError instanceof Error) {
        setActionError(deleteError.message);
      } else {
        setActionError(
          "Failed to delete room type. Please try again."
        );
      }

      throw deleteError;
    }
  };

  const handleClearFilters = () => {
    setSearch("");
    setFilters({});
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">
              Property Management
            </p>

            <h1 className="mt-1 text-2xl font-semibold text-slate-900">
              Rooms
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Manage rooms, room types, availability, and
              pricing.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={openCreateRoom}
              disabled={loading || roomTypes.length === 0}
              className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Plus className="h-4 w-4" />
              Add Room
            </button>
          </div>
        </div>

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {actionError && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {actionError}
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <RoomStatCard
            title="Total Rooms"
            value={roomStats.total}
            icon={Building2}
            description="All rooms"
          />

          <RoomStatCard
            title="Available"
            value={roomStats.available}
            icon={CheckCircle2}
            description="Ready for guests"
          />

          <RoomStatCard
            title="Occupied"
            value={roomStats.occupied}
            icon={BedDouble}
            description="Currently occupied"
          />

          <RoomStatCard
            title="Maintenance"
            value={roomStats.maintenance}
            icon={Wrench}
            description={
              roomStats.maintenance +
              roomStats.outOfService >
              0
                ? "Requires attention"
                : "No maintenance rooms"
            }
          />
        </div>

        <RoomFilters
          filters={filters}
          roomTypes={roomTypes}
          search={search}
          onSearchChange={setSearch}
          onFiltersChange={setFilters}
          onClear={handleClearFilters}
        />

        <RoomTable
          rooms={filteredRooms}
          loading={loading}
          onView={openRoomDetails}
          onEdit={openEditRoom}
          onDelete={handleDeleteRoom}
        />

        <RoomTypesPanel
          roomTypes={roomTypes}
          onCreate={handleCreateRoomType}
          onUpdate={handleUpdateRoomType}
          onDelete={handleDeleteRoomType}
          isLoading={loading}
        />

        {roomTypes.length === 0 && !loading && (
          <div className="rounded-xl border border-amber-200 bg-amber-50 px-5 py-4">
            <div className="flex items-start gap-3">
              <Settings className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />

              <div>
                <p className="text-sm font-semibold text-amber-900">
                  Create a room type first
                </p>

                <p className="mt-1 text-sm text-amber-800">
                  Rooms must belong to a room type. Use the
                  Room Types section above to create one before
                  adding rooms.
                </p>
              </div>
            </div>
          </div>
        )}

        <RoomFormModal
          isOpen={isRoomModalOpen}
          room={selectedRoom}
          roomTypes={roomTypes}
          onClose={closeRoomModal}
          onSubmit={handleRoomSubmit}
        />

        <RoomDetailsDrawer
          isOpen={isDetailsOpen}
          room={detailsRoom}
          onClose={closeRoomDetails}
          onEdit={openEditRoom}
        />
      </div>
    </DashboardLayout>
  );
};

export default Rooms;