import { Search, SlidersHorizontal, X } from "lucide-react";

import type { GuestFilters as GuestFilterValues } from "../types/guest.types";

interface GuestFiltersProps {
  filters: GuestFilterValues;
  search: string;
  onSearchChange: (value: string) => void;
  onFiltersChange: (filters: GuestFilterValues) => void;
  onClear: () => void;
}

const GuestFilters = ({
  filters,
  search,
  onSearchChange,
  onFiltersChange,
  onClear,
}: GuestFiltersProps) => {
  const hasFilters =
    search !== "" ||
    filters.vip !== undefined ||
    filters.blacklisted !== undefined;

  const handleVipChange = (value: string) => {
    const nextFilters = { ...filters };

    if (value === "") {
      delete nextFilters.vip;
    } else {
      nextFilters.vip = value === "true";
    }

    onFiltersChange(nextFilters);
  };

  const handleBlacklistedChange = (value: string) => {
    const nextFilters = { ...filters };

    if (value === "") {
      delete nextFilters.blacklisted;
    } else {
      nextFilters.blacklisted = value === "true";
    }

    onFiltersChange(nextFilters);
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-5 w-5 text-slate-500" />

          <h3 className="text-sm font-semibold text-slate-900">
            Guest Filters
          </h3>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <input
              type="text"
              value={search}
              onChange={(event) =>
                onSearchChange(event.target.value)
              }
              placeholder="Search guest name or phone..."
              className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-sm text-slate-700 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
            />
          </div>

          <select
            value={
              filters.vip === undefined
                ? ""
                : String(filters.vip)
            }
            onChange={(event) =>
              handleVipChange(event.target.value)
            }
            className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
          >
            <option value="">All VIP Statuses</option>
            <option value="true">VIP Guests</option>
            <option value="false">Regular Guests</option>
          </select>

          <select
            value={
              filters.blacklisted === undefined
                ? ""
                : String(filters.blacklisted)
            }
            onChange={(event) =>
              handleBlacklistedChange(event.target.value)
            }
            className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
          >
            <option value="">All Guest Statuses</option>
            <option value="false">Not Blacklisted</option>
            <option value="true">Blacklisted</option>
          </select>
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

export default GuestFilters;