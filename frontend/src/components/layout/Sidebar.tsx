import { NavLink } from "react-router-dom";
import { navigation } from "../../constants/navigation";

export default function Sidebar() {
  return (
    <aside className="flex h-screen w-72 flex-col overflow-y-auto bg-green-900 text-white">
      <div className="border-b border-green-800 p-6">
        <h1 className="text-2xl font-bold">Greenwood Hotel</h1>

        <p className="mt-1 text-sm text-green-200">
          Staff Portal
        </p>
      </div>

      <nav className="flex-1 px-3 py-4">
        {navigation.map((group) => (
          <div
            key={group.section}
            className="mb-8"
          >
            <h3 className="mb-3 px-4 text-xs font-bold tracking-widest text-green-300">
              {group.section}
            </h3>

            {group.items.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.title}
                  to={item.path}
                  className={({ isActive }) =>
                    `mb-1 flex items-center gap-3 rounded-xl px-4 py-3 transition ${
                      isActive
                        ? "bg-green-700 text-white"
                        : "hover:bg-green-800"
                    }`
                  }
                >
                  <Icon size={20} />

                  <span>{item.title}</span>
                </NavLink>
              );
            })}
          </div>
        ))}
      </nav>
    </aside>
  );
}