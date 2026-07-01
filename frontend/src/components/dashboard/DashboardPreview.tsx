import { DASHBOARD_STATS } from "../../constants/dashboard";
import StatCard from "../dashboard/StatCard";

export default function DashboardPreview() {
  return (
    <section className="bg-slate-50 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-16 text-center">
          <span className="rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-700">
            Dashboard Preview
          </span>

          <h2 className="mt-6 text-4xl font-bold text-slate-900">
            Monitor Your Hotel in Real Time
          </h2>

          <p className="mt-6 text-lg text-slate-600">
            View occupancy, revenue, reservations, restaurant,
            bar, conference bookings and camping activity from
            one central dashboard.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {DASHBOARD_STATS.map((stat) => (
            <StatCard
              key={stat.title}
              stat={stat}
            />
          ))}
        </div>
      </div>
    </section>
  );
}