const alerts = [
  "4 rooms awaiting housekeeping",
  "Kitchen has 6 pending orders",
  "Inventory: Milk running low",
  "2 guests checking in after 8 PM",
];

export default function AlertsCard() {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <h2 className="mb-6 text-xl font-bold text-slate-800">
        Alerts
      </h2>

      <ul className="space-y-3">
        {alerts.map((alert) => (
          <li
            key={alert}
            className="rounded-lg bg-yellow-50 p-3 text-sm text-slate-700"
          >
            {alert}
          </li>
        ))}
      </ul>
    </div>
  );
}