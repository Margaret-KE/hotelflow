import { Search, SlidersHorizontal, X } from "lucide-react";

import type {
  RoomFilters as RoomFilterValues,
  RoomStatus,
  RoomType,
} from "../types/room.types";

interface RoomFiltersProps {
  filters: RoomFilterValues;
  roomTypes: RoomType[];
  search: string;
  onSearchChange: (value: string) => void;
  onFiltersChange: (filters: RoomFilterValues) => void;
  onClear: () => void;
}

const RoomFilters = ({
  filters,
  roomTypes,
  search,
  onSearchChange,
  onFiltersChange,
  onClear,
}: RoomFiltersProps) => {
  const hasFilters =
    search !== "" ||
    Boolean(filters.status) ||
    Boolean(filters.roomTypeId) ||
    Boolean(filters.floor);

  const handleStatusChange = (value: string) => {
    const nextFilters = { ...filters };

    if (value === "") {
      delete nextFilters.status;
    } else {
      nextFilters.status = value as RoomStatus;
    }

    onFiltersChange(nextFilters);
  };

  const handleRoomTypeChange = (value: string) => {
    const nextFilters = { ...filters };

    if (value === "") {
      delete nextFilters.roomTypeId;
    } else {
      nextFilters.roomTypeId = value;
    }

    onFiltersChange(nextFilters);
  };

  const handleFloorChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value;
    const nextFilters = { ...filters };

    if (value === "") {
      delete nextFilters.floor;
    } else {
      nextFilters.floor = value;
    }

    onFiltersChange(nextFilters);
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-5 w-5 text-slate-500" />

          <h3 className="text-sm font-semibold text-slate-900">
            Room Filters
          </h3>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <input
              type="text"
              value={search}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Search room number..."
              className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-sm text-slate-700 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
            />
          </div>

          <select
            value={filters.status || ""}
            onChange={(event) =>
              handleStatusChange(event.target.value)
            }
            className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
          >
            <option value="">All Statuses</option>
            <option value="AVAILABLE">Available</option>
            <option value="OCCUPIED">Occupied</option>
            <option value="RESERVED">Reserved</option>
            <option value="CLEANING">Cleaning</option>
            <option value="MAINTENANCE">Maintenance</option>
            <option value="OUT_OF_SERVICE">
              Out of Service
            </option>
          </select>

          <select
            value={filters.roomTypeId || ""}
            onChange={(event) =>
              handleRoomTypeChange(event.target.value)
            }
            className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
          >
            <option value="">All Room Types</option>

            {roomTypes.map((roomType) => (
              <option key={roomType.id} value={roomType.id}>
                {roomType.name}
              </option>
            ))}
          </select>

          <input
            type="text"
            value={filters.floor || ""}
            onChange={handleFloorChange}
            placeholder="Filter by floor..."
            className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
          />
        </div>

        {hasFilters && (
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClear}
              className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
            >
              <X className="h-4 w-4" />
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoomFilters;