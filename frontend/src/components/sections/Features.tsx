import FeatureCard from "../cards/FeatureCard";
import { FEATURES } from "../../constants/features";

export default function Features() {
  return (
    <section
      id="features"
      className="bg-white py-24"
    >
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <span className="rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-700">
            Core Modules
          </span>

          <h2 className="mt-6 text-4xl font-bold text-slate-900">
            Everything Greenwood Hotel Needs
          </h2>

          <p className="mt-6 text-lg text-slate-600">
            HotelFlow brings together every essential hotel
            operation into one integrated platform.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {FEATURES.map((feature) => (
            <FeatureCard
              key={feature.title}
              feature={feature}
            />
          ))}
        </div>
      </div>
    </section>
  );
}