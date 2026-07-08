import { Bell, CalendarDays, Search, UserCircle } from "lucide-react";

export default function Topbar() {
  const today = new Date().toLocaleDateString("en-KE", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <header className="flex h-20 items-center justify-between border-b border-slate-200 bg-white px-8 shadow-sm">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">
          Dashboard
        </h1>

        <p className="mt-1 flex items-center gap-2 text-sm text-slate-500">
          <CalendarDays size={16} />
          {today}
        </p>
      </div>

      <div className="flex items-center gap-6">
        <div className="relative hidden md:block">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="text"
            placeholder="Search..."
            className="w-72 rounded-xl border border-slate-300 py-2 pl-10 pr-4 outline-none transition focus:border-green-600"
          />
        </div>

        <button className="rounded-full p-2 transition hover:bg-slate-100">
          <Bell size={22} />
        </button>

        <div className="flex items-center gap-3">
          <UserCircle size={38} className="text-green-700" />

          <div>
            <p className="font-semibold text-slate-800">
              Staff User
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