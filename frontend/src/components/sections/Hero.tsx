import { ArrowRight } from "lucide-react";
import { BRAND } from "../../constants/branding";
import heroImage from "../../assets/images/hero/hero-1.jpg";

export default function Hero() {
  return (
    <section className="bg-gradient-to-br from-green-50 via-white to-yellow-50">
      <div className="mx-auto grid min-h-[85vh] max-w-7xl items-center gap-16 px-6 py-16 lg:grid-cols-2">
        {/* Left Content */}
        <div>
          <span className="inline-flex rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-700">
            {BRAND.productName} for {BRAND.hotelName}
          </span>

          <h1 className="mt-6 text-5xl font-extrabold leading-tight text-slate-900 lg:text-6xl">
            {BRAND.slogan}
          </h1>

          <p className="mt-8 max-w-xl text-lg leading-8 text-slate-600">
            {BRAND.description}
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <button className="flex items-center gap-2 rounded-xl bg-green-700 px-7 py-4 font-medium text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-green-800">
              Request Demo
              <ArrowRight size={18} />
            </button>

            <button className="rounded-xl border border-slate-300 bg-white px-7 py-4 font-medium text-slate-700 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-green-700 hover:text-green-700">
              Staff Login
            </button>
          </div>
        </div>

        {/* Right Image */}
        <div className="relative">
          <div className="overflow-hidden rounded-3xl shadow-2xl">
            <img
              src={heroImage}
              alt="Greenwood Hotel"
              className="h-[560px] w-full object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
          </div>

          {/* Floating Card 1 */}
          <div className="absolute -left-6 top-8 rounded-2xl bg-white p-5 shadow-xl">
            <p className="text-sm text-slate-500">Occupancy</p>
            <h3 className="text-3xl font-bold text-green-700">86%</h3>
          </div>

          {/* Floating Card 2 */}
          <div className="absolute -right-6 bottom-10 rounded-2xl bg-white p-5 shadow-xl">
            <p className="text-sm text-slate-500">Today's Revenue</p>
            <h3 className="text-2xl font-bold text-slate-900">
              KES 185K
            </h3>
          </div>

          {/* Floating Card 3 */}
          <div className="absolute left-10 bottom-20 rounded-2xl bg-white p-5 shadow-xl">
            <p className="text-sm text-slate-500">Check-ins</p>
            <h3 className="text-3xl font-bold text-green-700">24</h3>
          </div>
        </div>
      </div>
    </section>
  );
}