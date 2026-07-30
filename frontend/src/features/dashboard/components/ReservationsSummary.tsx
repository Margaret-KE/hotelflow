import {
  LogIn,
  LogOut,
  Clock,
} from "lucide-react";

const arrivals = [
  {
    guest: "John Kamau",
    room: "101",
    time: "09:00 AM",
  },
  {
    guest: "Alice Wanjiku",
    room: "Cottage 4",
    time: "11:30 AM",
  },
  {
    guest: "Peter Mwangi",
    room: "Tent 2",
    time: "02:00 PM",
  },
];

const departures = [
  {
    guest: "Grace Njeri",
    room: "205",
    time: "10:00 AM",
  },
  {
    guest: "David Kariuki",
    room: "103",
    time: "12:00 PM",
  },
];

export default function ReservationsSummary() {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">

      <h2 className="mb-8 text-xl font-semibold text-slate-800">
        Today's Arrivals & Departures
      </h2>

      {/* Arrivals */}

      <div>

        <div className="mb-4 flex items-center gap-2">
          <LogIn
            size={20}
            className="text-emerald-600"
          />

          <h3 className="font-semibold text-slate-800">
            Today's Arrivals
          </h3>
        </div>

        <div className="space-y-3">

          {arrivals.map((guest) => (
            <div
              key={guest.guest}
              className="flex items-center justify-between rounded-xl border border-slate-200 p-4 transition hover:bg-slate-50"
            >
              <div>
                <h4 className="font-semibold text-slate-800">
                  {guest.guest}
                </h4>

                <p className="text-sm text-slate-500">
                  Room {guest.room}
                </p>
              </div>

              <div className="flex items-center gap-2 text-sm text-slate-500">
                <Clock size={16} />
                {guest.time}
              </div>
            </div>
          ))}

        </div>

      </div>

      {/* Divider */}

      <div className="my-8 border-t border-slate-200"></div>

      {/* Departures */}

      <div>

        <div className="mb-4 flex items-center gap-2">
          <LogOut
            size={20}
            className="text-red-600"
          />

          <h3 className="font-semibold text-slate-800">
            Today's Departures
          </h3>
        </div>

        <div className="space-y-3">

          {departures.map((guest) => (
            <div
              key={guest.guest}
              className="flex items-center justify-between rounded-xl border border-slate-200 p-4 transition hover:bg-slate-50"
            >
              <div>
                <h4 className="font-semibold text-slate-800">
                  {guest.guest}
                </h4>

                <p className="text-sm text-slate-500">
                  Room {guest.room}
                </p>
              </div>

              <div className="flex items-center gap-2 text-sm text-slate-500">
                <Clock size={16} />
                {guest.time}
              </div>
            </div>
          ))}

        </div>

      </div>

    </div>
  );
}