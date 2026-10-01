interface BarStatCardProps {
  label: string;
  value: string | number;
  description?: string;
}

export default function BarStatCard({
  label,
  value,
  description,
}: BarStatCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="text-sm font-medium text-slate-500">
        {label}
      </div>

      <div className="mt-2 text-2xl font-bold text-slate-900">
        {value}
      </div>

      {description && (
        <div className="mt-1 text-xs text-slate-400">
          {description}
        </div>
      )}
    </div>
  );
}