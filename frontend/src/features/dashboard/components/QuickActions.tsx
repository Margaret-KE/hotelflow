import {
  CalendarPlus,
  UserPlus,
  UtensilsCrossed,
  Building2,
  Tent,
  Trees,
} from "lucide-react";

const actions = [
  {
    title: "New Reservation",
    icon: CalendarPlus,
  },
  {
    title: "Walk-in Guest",
    icon: UserPlus,
  },
  {
    title: "Restaurant Order",
    icon: UtensilsCrossed,
  },
  {
    title: "Conference Booking",
    icon: Building2,
  },
  {
    title: "Camping Booking",
    icon: Tent,
  },
  {
    title: "Guest Activity",
    icon: Trees,
  },
];

export default function QuickActions() {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <h2 className="mb-6 text-xl font-bold text-slate-800">
        Quick Actions
      </h2>

      <div className="grid grid-cols-2 gap-4">
        {actions.map((action) => {
          const Icon = action.icon;

          return (
            <button
              key={action.title}
              className="rounded-xl border border-slate-200 p-4 transition hover:border-green-700 hover:bg-green-50"
            >
              <Icon
                size={26}
                className="mx-auto mb-3 text-green-700"
              />

              <p className="text-sm font-medium">
                {action.title}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}