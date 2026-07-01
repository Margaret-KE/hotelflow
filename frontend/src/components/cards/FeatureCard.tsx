import type { Feature } from "../../types/feature";

interface FeatureCardProps {
  feature: Feature;
}

export default function FeatureCard({
  feature,
}: FeatureCardProps) {
  const Icon = feature.icon;

  return (
    <div className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
      <div className="mb-5 inline-flex rounded-xl bg-green-100 p-3 text-green-700">
        <Icon size={28} />
      </div>

      <h3 className="mb-3 text-xl font-semibold text-slate-900">
        {feature.title}
      </h3>

      <p className="leading-7 text-slate-600">
        {feature.description}
      </p>
    </div>
  );
}