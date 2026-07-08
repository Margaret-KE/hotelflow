import DashboardLayout from "../../../layouts/DashboardLayout";

import StatCard from "../components/StatCard";

import QuickActions from "../components/QuickActions";

import TodaySchedule from "../components/TodaySchedule";

import AlertsCard from "../components/AlertsCard";

import {
  BedDouble,
  DollarSign,
  UtensilsCrossed,
  Trees,
  Tent,
  CalendarDays,
  Users,
  ClipboardList,
} from "lucide-react";

export default function Dashboard() {
  return (
    <DashboardLayout>
      <div>
        <h1 className="text-3xl font-bold text-slate-900">
          Good Morning
        </h1>

        <p className="mt-2 text-slate-600">
          Welcome to Greenwood Hotel Staff Portal.
        </p>

        {/* Statistics */}
        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Occupancy"
            value="82%"
            icon={BedDouble}
          />

          <StatCard
            title="Today's Revenue"
            value="KES 185,600"
            icon={DollarSign}
          />

          <StatCard
            title="Restaurant Sales"
            value="KES 43,200"
            icon={UtensilsCrossed}
          />

          <StatCard
            title="Guest Activities"
            value="18"
            icon={Trees}
          />

          <StatCard
            title="Camping"
            value="9"
            icon={Tent}
          />

          <StatCard
            title="Conference Bookings"
            value="3"
            icon={CalendarDays}
          />

          <StatCard
            title="Today's Guests"
            value="126"
            icon={Users}
          />

          <StatCard
            title="Rooms to Clean"
            value="14"
            icon={ClipboardList}
          />
        </div>

        {/* Lower Dashboard */}
        <div className="mt-10 grid gap-8 xl:grid-cols-12">
          <div className="xl:col-span-3">
            <QuickActions />
          </div>

          <div className="xl:col-span-6">
            <TodaySchedule />
          </div>

          <div className="xl:col-span-3">
            <AlertsCard />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}