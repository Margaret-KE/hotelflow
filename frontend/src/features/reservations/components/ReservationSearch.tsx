import { Search, Plus } from "lucide-react";

interface ReservationSearchProps {
  value: string;
  onChange: (value: string) => void;
  onNewReservation: () => void;
}

export default function ReservationSearch({
  value,
  onChange,
  onNewReservation,
}: ReservationSearchProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative flex-1">
          <Search
            size={20}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="text"
            value={value}
            onChange={(event) =>
              onChange(event.target.value)
            }
            placeholder="Search guest, room or reservation..."
            className="w-full rounded-xl border border-slate-300 py-3 pl-12 pr-4 text-slate-700 outline-none transition-all duration-300 focus:border-green-600 focus:ring-4 focus:ring-green-100"
          />
        </div>

        <button
          type="button"
          onClick={onNewReservation}
          className="flex items-center justify-center gap-2 rounded-xl bg-green-700 px-6 py-3 font-semibold text-white transition-all duration-300 hover:bg-green-800 hover:shadow-lg"
        >
          <Plus size={18} />
          New Reservation
        </button>
      </div>
    </div>
  );
}