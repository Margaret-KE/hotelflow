import {
  BedDouble,
  DoorOpen,
  Crown,
  DollarSign,
} from "lucide-react";

interface ReservationSummaryProps {
  occupancy: number;
  availableRooms: number;
  vipGuests: number;
  todayRevenue: number;
}

const colors = {
  green: {
    bg: "bg-green-50",
    icon: "text-green-700",
  },
  blue: {
    bg: "bg-blue-50",
    icon: "text-blue-700",
  },
  amber: {
    bg: "bg-amber-50",
    icon: "text-amber-700",
  },
  emerald: {
    bg: "bg-emerald-50",
    icon: "text-emerald-700",
  },
};

export default function ReservationSummary({
  occupancy,
  availableRooms,
  vipGuests,
  todayRevenue,
}: ReservationSummaryProps) {
  const summary = [
    {
      title: "Occupancy",
      value: `${occupancy}%`,
      icon: BedDouble,
      color: "green",
    },
    {
      title: "Available Rooms",
      value: String(availableRooms),
      icon: DoorOpen,
      color: "blue",
    },
    {
      title: "VIP Guests",
      value: String(vipGuests),
      icon: Crown,
      color: "amber",
    },
    {
      title: "Today's Revenue",
      value: `KES ${todayRevenue.toLocaleString("en-KE", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
      icon: DollarSign,
      color: "emerald",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {summary.map((item) => {
        const Icon = item.icon;
        const style =
          colors[item.color as keyof typeof colors];

        return (
          <div
            key={item.title}
            className={`flex items-center gap-4 rounded-2xl border border-slate-200 ${style.bg} p-5 shadow-sm transition hover:shadow-md`}
          >
            <div className="rounded-xl bg-white p-3 shadow-sm">
              <Icon
                size={24}
                className={style.icon}
              />
            </div>

            <div>
              <p className="text-sm text-slate-500">
                {item.title}
              </p>

              <h3 className="text-2xl font-bold text-slate-900">
                {item.value}
              </h3>
            </div>
          </div>
        );
      })}
    </div>
  );
}