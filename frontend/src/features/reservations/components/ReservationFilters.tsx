type ReservationFilter =
  | "All"
  | "Today"
  | "Upcoming"
  | "Checked In"
  | "Checked Out"
  | "Cancelled";

interface ReservationFiltersProps {
  activeFilter: ReservationFilter;
  onChange: (filter: ReservationFilter) => void;
}

const filters: ReservationFilter[] = [
  "All",
  "Today",
  "Upcoming",
  "Checked In",
  "Checked Out",
  "Cancelled",
];

export default function ReservationFilters({
  activeFilter,
  onChange,
}: ReservationFiltersProps) {
  return (
    <div className="flex flex-wrap gap-3">
      {filters.map((filter) => (
        <button
          key={filter}
          type="button"
          onClick={() => onChange(filter)}
          className={`rounded-full px-5 py-2 text-sm font-semibold transition-all duration-300 ${
            activeFilter === filter
              ? "bg-green-700 text-white shadow-md"
              : "border border-slate-300 bg-white text-slate-600 hover:border-green-600 hover:text-green-700"
          }`}
        >
          {filter}
        </button>
      ))}
    </div>
  );
}