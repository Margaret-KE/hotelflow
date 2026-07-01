import { ArrowRight } from "lucide-react";
import { BRAND } from "../../constants/branding";

export default function Hero() {
  return (
    <section className="bg-slate-50">
      <div className="mx-auto grid min-h-[85vh] max-w-7xl items-center gap-12 px-6 lg:grid-cols-2">
        <div>
          <span className="rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-700">
            {BRAND.productName} for {BRAND.hotelName}
          </span>

          <h1 className="mt-6 text-5xl font-extrabold leading-tight text-slate-900 lg:text-6xl">
            {BRAND.slogan}
          </h1>

          <p className="mt-8 max-w-xl text-lg leading-8 text-slate-600">
            {BRAND.description}
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <button className="flex items-center gap-2 rounded-xl bg-green-700 px-7 py-4 text-white transition hover:bg-green-800">
              Request Demo
              <ArrowRight size={18} />
            </button>

            <button className="rounded-xl border border-slate-300 px-7 py-4 transition hover:bg-white">
              Staff Login
            </button>
          </div>
        </div>

        <div className="flex items-center justify-center">
          <div className="flex h-[520px] w-full items-center justify-center rounded-3xl border border-dashed border-green-300 bg-white shadow-xl">
            <span className="text-center text-lg text-slate-500">
              Greenwood Hotel Image
              <br />
              (Coming Soon)
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}