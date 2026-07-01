import type { Stat } from "../../types/stat";

interface StatCardProps {
  stat: Stat;
}

export default function StatCard({ stat }: StatCardProps) {
  const Icon = stat.icon;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="mb-4 flex items-center justify-between">
        <div className="rounded-xl bg-green-100 p-3">
          <Icon className="text-green-700" size={24} />
        </div>
      </div>

      <h3 className="text-sm text-slate-500">
        {stat.title}
      </h3>

      <p className="mt-2 text-3xl font-bold text-slate-900">
        {stat.value}
      </p>

      <p className="mt-2 text-sm text-slate-500">
        {stat.subtitle}
      </p>
    </div>
  );
}