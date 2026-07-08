import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
}

export default function StatCard({
  title,
  value,
  icon: Icon,
}: StatCardProps) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm transition hover:shadow-md">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">
            {title}
          </p>

          <h2 className="mt-3 text-3xl font-bold text-slate-900">
            {value}
          </h2>
        </div>

        <div className="rounded-2xl bg-green-100 p-4">
          <Icon
            size={28}
            className="text-green-700"
          />
        </div>
      </div>
    </div>
  );
}