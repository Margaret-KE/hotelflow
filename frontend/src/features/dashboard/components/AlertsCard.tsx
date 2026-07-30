import {
  AlertTriangle,
  Info,
  CircleCheckBig,
} from "lucide-react";

const alerts = [
  {
    title: "Room 204 requires housekeeping",
    type: "warning",
    icon: AlertTriangle,
    color: "bg-amber-100 text-amber-700",
  },
  {
    title: "Conference booking starts at 2:00 PM",
    type: "info",
    icon: Info,
    color: "bg-blue-100 text-blue-700",
  },
  {
    title: "Restaurant stock successfully updated",
    type: "success",
    icon: CircleCheckBig,
    color: "bg-emerald-100 text-emerald-700",
  },
  {
    title: "VIP guest arriving today",
    type: "info",
    icon: Info,
    color: "bg-purple-100 text-purple-700",
  },
];

export default function AlertsCard() {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <h2 className="mb-6 text-xl font-semibold text-slate-800">
        Alerts & Notifications
      </h2>

      <div className="space-y-4">
        {alerts.map((alert, index) => {
          const Icon = alert.icon;

          return (
            <div
              key={index}
              className="flex items-start gap-4 rounded-xl border border-slate-200 p-4 transition hover:bg-slate-50"
            >
              <div
                className={`flex h-11 w-11 items-center justify-center rounded-xl ${alert.color}`}
              >
                <Icon size={20} />
              </div>

              <div>
                <p className="font-medium text-slate-800">
                  {alert.title}
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  Just now
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}