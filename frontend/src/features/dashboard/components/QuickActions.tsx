import {
  LogIn,
  LogOut,
  CalendarPlus,
  UtensilsCrossed,
  Wine,
  BedDouble,
  Users,
  BarChart3,
} from "lucide-react";

const actions = [
  {
    title: "Check In",
    icon: LogIn,
    color: "bg-emerald-100 text-emerald-700",
  },
  {
    title: "Check Out",
    icon: LogOut,
    color: "bg-red-100 text-red-700",
  },
  {
    title: "Reservation",
    icon: CalendarPlus,
    color: "bg-blue-100 text-blue-700",
  },
  {
    title: "Restaurant",
    icon: UtensilsCrossed,
    color: "bg-orange-100 text-orange-700",
  },
  {
    title: "Bar POS",
    icon: Wine,
    color: "bg-purple-100 text-purple-700",
  },
  {
    title: "Rooms",
    icon: BedDouble,
    color: "bg-cyan-100 text-cyan-700",
  },
  {
    title: "Guests",
    icon: Users,
    color: "bg-pink-100 text-pink-700",
  },
  {
    title: "Reports",
    icon: BarChart3,
    color: "bg-amber-100 text-amber-700",
  },
];

export default function QuickActions() {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <h2 className="mb-6 text-xl font-semibold text-slate-800">
        Quick Actions
      </h2>

      <div className="grid grid-cols-2 gap-4">
        {actions.map((action) => {
          const Icon = action.icon;

          return (
            <button
              key={action.title}
              className="group rounded-2xl border border-slate-200 bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:border-green-600 hover:shadow-lg"
            >
              <div
                className={`mx-auto flex h-14 w-14 items-center justify-center rounded-2xl ${action.color}`}
              >
                <Icon size={26} />
              </div>

              <p className="mt-4 text-sm font-semibold text-slate-700 group-hover:text-green-700">
                {action.title}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}