import { NavLink } from "react-router-dom";
import { navigation } from "../../constants/navigation";

import logo from "../../assets/images/logo/greenwood-logo.png";

export default function Sidebar() {
  return (
    <aside className="flex h-screen w-72 flex-col overflow-y-auto bg-gradient-to-b from-green-900 via-green-800 to-green-950 text-white shadow-2xl">

      {/* Logo */}

      <div className="border-b border-green-700 p-6">

        <div className="flex flex-col items-center">

          <div className="rounded-2xl bg-white p-3 shadow-lg">
            <img
              src={logo}
              alt="Greenwood Hotel"
              className="h-24 w-auto object-contain"
            />
          </div>

          {/* System Status */}

          <div className="mt-6 flex items-center justify-center gap-2 rounded-xl bg-green-800/50 px-4 py-2">

            <span className="h-3 w-3 rounded-full bg-emerald-400 animate-pulse"></span>

            <span className="text-sm font-medium text-green-100">
              System Online
            </span>

          </div>

        </div>

      </div>

      {/* Navigation */}

      <nav className="flex-1 px-4 py-6">

        {navigation.map((group) => (
          <div
            key={group.section}
            className="mb-8"
          >
            <h3 className="mb-3 px-3 text-xs font-bold uppercase tracking-[0.2em] text-green-300">
              {group.section}
            </h3>

            {group.items.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.title}
                  to={item.path}
                  className={({ isActive }) =>
                    `mb-2 flex items-center gap-3 rounded-2xl px-4 py-3 transition-all duration-300 ${
                      isActive
                        ? "bg-white text-green-900 shadow-lg"
                        : "text-green-100 hover:bg-green-700 hover:translate-x-1"
                    }`
                  }
                >
                  <Icon size={20} />

                  <span className="font-medium">
                    {item.title}
                  </span>
                </NavLink>
              );
            })}
          </div>
        ))}

      </nav>

      {/* Footer */}

      <div className="border-t border-green-700 p-5">

        <p className="text-center text-xs text-green-400">
          Version 1.0
        </p>

      </div>

    </aside>
  );
}