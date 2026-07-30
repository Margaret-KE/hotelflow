import DashboardLayout from "../../../layouts/DashboardLayout";

import StatCard from "../components/StatCard";
import QuickActions from "../components/QuickActions";
import AlertsCard from "../components/AlertsCard";
import OccupancyChart from "../components/OccupancyChart";
import RevenueChart from "../components/RevenueChart";
import ReservationsSummary from "../components/ReservationsSummary";
import RestaurantSummary from "../components/RestaurantSummary";
import BarSummary from "../components/BarSummary";

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
  const today = new Date().toLocaleDateString("en-KE", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
  <DashboardLayout>
    <div>

      {/* Welcome */}

      <div className="mb-10 rounded-3xl bg-gradient-to-r from-green-800 via-green-700 to-emerald-600 p-8 text-white shadow-lg">

        <h1 className="text-4xl font-bold">
          Hello
        </h1>

        <p className="mt-2 text-lg text-green-100">
          Welcome to Greenwood Hotel Staff Portal.
        </p>

        <p className="mt-3 text-sm text-green-200">
          {today}
        </p>

      </div>

        {/* Statistics */}

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

          <StatCard
            title="Occupancy Rate"
            value="82%"
            subtitle="41 of 50 rooms occupied"
            trend="+6% from yesterday"
            icon={BedDouble}
            color="emerald"
          />

          <StatCard
            title="Today's Revenue"
            value="KES 185,600"
            subtitle="Cash • Card • M-Pesa"
            trend="+15% from yesterday"
            icon={DollarSign}
            color="blue"
          />

          <StatCard
            title="Restaurant Revenue"
            value="KES 43,200"
            subtitle="87 orders served"
            trend="+9% from yesterday"
            icon={UtensilsCrossed}
            color="orange"
          />

          <StatCard
            title="Guests Checked In"
            value="126"
            subtitle="18 arrivals today"
            trend="+11 guests"
            icon={Users}
            color="purple"
          />

          <StatCard
            title="Guest Activities"
            value="18"
            subtitle="Horse riding & nature walk"
            trend="+4 bookings"
            icon={Trees}
            color="green"
          />

          <StatCard
            title="Camping Guests"
            value="9"
            subtitle="4 tents occupied"
            trend="+2 bookings"
            icon={Tent}
            color="yellow"
          />

          <StatCard
            title="Conference Bookings"
            value="3"
            subtitle="2 halls in use"
            trend="Full day events"
            icon={CalendarDays}
            color="indigo"
          />

          <StatCard
            title="Rooms to Clean"
            value="14"
            subtitle="Housekeeping queue"
            trend="5 completed"
            icon={ClipboardList}
            color="red"
          />

        </div>

{/* Analytics */}

<div className="mt-10 grid gap-8 xl:grid-cols-2">

  <OccupancyChart />

  <RevenueChart />

</div>

{/* Today's Arrivals */}

<div className="mt-10">
  <ReservationsSummary />
</div>

{/* Restaurant & Bar */}

<div className="mt-8 grid gap-8 lg:grid-cols-2">

  <RestaurantSummary />

  <BarSummary />

</div>

{/* Quick Actions & Alerts */}

<div className="mt-8 grid gap-8 lg:grid-cols-2">

  <QuickActions />

  <AlertsCard />

</div>

        </div>
    </DashboardLayout>

  );
}