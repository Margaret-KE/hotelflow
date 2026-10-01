import type { LucideIcon } from "lucide-react";

interface ReservationStatCardProps {
  title: string;
  value: string;
  subtitle: string;
  icon: LucideIcon;
  color: "green" | "amber" | "blue" | "rose";
}

const colors = {
  green: {
    bg: "bg-green-50",
    iconBg: "bg-green-100",
    icon: "text-green-700",
    border: "border-green-200",
  },

  amber: {
    bg: "bg-amber-50",
    iconBg: "bg-amber-100",
    icon: "text-amber-700",
    border: "border-amber-200",
  },

  blue: {
    bg: "bg-blue-50",
    iconBg: "bg-blue-100",
    icon: "text-blue-700",
    border: "border-blue-200",
  },

  rose: {
    bg: "bg-rose-50",
    iconBg: "bg-rose-100",
    icon: "text-rose-700",
    border: "border-rose-200",
  },
};

export default function ReservationStatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  color,
}: ReservationStatCardProps) {
  const style = colors[color];

  return (
    <div
      className={`rounded-2xl border ${style.border} ${style.bg} p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-600">
            {title}
          </p>

          <h2 className="mt-3 text-4xl font-bold text-slate-900">
            {value}
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            {subtitle}
          </p>
        </div>

        <div
          className={`rounded-2xl ${style.iconBg} p-4`}
        >
          <Icon
            size={30}
            className={style.icon}
          />
        </div>
      </div>
    </div>
  );
}