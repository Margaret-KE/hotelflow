import { Hotel, Menu } from "lucide-react";
import { BRAND } from "../../constants/branding";
import { LANDING_NAVIGATION } from "../../constants/landingNavigation";
import { Link } from "react-router-dom";
import { ROUTES } from "../../constants/routes";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-green-700 p-2 text-white">
            <Hotel size={24} />
          </div>

          <div>
            <h1 className="text-xl font-bold text-slate-900">
              {BRAND.hotelName}
            </h1>

            <p className="text-xs text-slate-500">
              {BRAND.slogan}
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="hidden items-center gap-8 md:flex">
          {LANDING_NAVIGATION.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="text-slate-600 transition hover:text-green-700"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Buttons */}
        <div className="hidden items-center gap-3 md:flex">
          <Link
  to={ROUTES.LOGIN}
  className="rounded-lg border border-green-700 px-5 py-2 text-green-700 transition hover:bg-green-50"
>
  Staff Login
</Link>

          <button className="rounded-lg bg-green-700 px-5 py-2 text-white transition hover:bg-green-800">
            Request Demo
          </button>
        </div>

        {/* Mobile Menu */}
        <button className="md:hidden">
          <Menu />
        </button>
      </div>
    </header>
  );
}