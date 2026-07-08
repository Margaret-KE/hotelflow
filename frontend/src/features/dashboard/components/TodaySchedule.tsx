const schedule = [
  {
    time: "09:00",
    event: "Conference - Aberdare Hall",
  },
  {
    time: "10:00",
    event: "Horse Riding",
  },
  {
    time: "11:00",
    event: "Kids Games",
  },
  {
    time: "14:00",
    event: "Nature Walk",
  },
  {
    time: "18:30",
    event: "Bonfire",
  },
];

export default function TodaySchedule() {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <h2 className="mb-6 text-xl font-bold text-slate-800">
        Today's Schedule
      </h2>

      <div className="space-y-4">
        {schedule.map((item) => (
          <div
            key={`${item.time}-${item.event}`}
            className="flex items-center justify-between border-b border-slate-100 pb-3"
          >
            <span className="font-semibold text-green-700">
              {item.time}
            </span>

            <span className="text-slate-700">
              {item.event}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}