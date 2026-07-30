import {
  Bell,
  CalendarDays,
  Search,
  UserCircle,
} from "lucide-react";

import { useLocation } from "react-router-dom";

export default function TopBar() {
  const location = useLocation();

  const today = new Date().toLocaleDateString(
    "en-KE",
    {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }
  );

  const pageTitle =
    location.pathname === "/dashboard"
      ? "Dashboard"
      : location.pathname
          .split("/")
          .filter(Boolean)
          .pop()
          ?.replace(/-/g, " ")
          .replace(/\b\w/g, (letter) =>
            letter.toUpperCase()
          ) || "Dashboard";

  return (
    <header className="flex h-20 items-center justify-between border-b border-slate-200 bg-white px-8 shadow-sm">

      {/* Left */}

      <div>
        <p className="text-sm text-slate-500">
          Welcome back 👋
        </p>

        <h1 className="text-2xl font-bold text-slate-800">
          {pageTitle}
        </h1>

        <p className="mt-1 flex items-center gap-2 text-sm text-slate-500">
          <CalendarDays size={16} />
          {today}
        </p>
      </div>

      {/* Right */}

      <div className="flex items-center gap-6">

        {/* Search */}

        <div className="relative hidden lg:block">

          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="text"
            placeholder="Search guests, rooms, reservations..."
            className="w-80 rounded-xl border border-slate-300 py-2 pl-10 pr-4 outline-none transition focus:border-green-600"
          />

        </div>

        {/* Notifications */}

        <button className="relative rounded-full p-2 transition hover:bg-slate-100">

          <Bell size={22} />

          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-xs font-semibold text-white">
            3
          </span>

        </button>

        {/* User */}

        <div className="flex items-center gap-3">

          <UserCircle
            size={40}
            className="text-green-700"
          />

          <div>

            <p className="font-semibold text-slate-800">
              Margaret Wanjiru
            </p>

            <p className="text-sm text-slate-500">
              Reception
            </p>

          </div>

        </div>

      </div>

    </header>
  );
}