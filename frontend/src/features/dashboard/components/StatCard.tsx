import type { LucideIcon } from "lucide-react";
import { ArrowUpRight } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  subtitle?: string;
  trend?: string;

  color?:
    | "emerald"
    | "blue"
    | "orange"
    | "purple"
    | "red"
    | "yellow"
    | "indigo"
    | "green";
}

const colors = {
  emerald: {
    bg: "bg-emerald-100",
    text: "text-emerald-700",
    hover: "group-hover:bg-emerald-700",
  },

  blue: {
    bg: "bg-blue-100",
    text: "text-blue-700",
    hover: "group-hover:bg-blue-700",
  },

  orange: {
    bg: "bg-orange-100",
    text: "text-orange-700",
    hover: "group-hover:bg-orange-700",
  },

  purple: {
    bg: "bg-purple-100",
    text: "text-purple-700",
    hover: "group-hover:bg-purple-700",
  },

  red: {
    bg: "bg-red-100",
    text: "text-red-700",
    hover: "group-hover:bg-red-700",
  },

  yellow: {
    bg: "bg-yellow-100",
    text: "text-yellow-700",
    hover: "group-hover:bg-yellow-700",
  },

  indigo: {
    bg: "bg-indigo-100",
    text: "text-indigo-700",
    hover: "group-hover:bg-indigo-700",
  },

  green: {
    bg: "bg-green-100",
    text: "text-green-700",
    hover: "group-hover:bg-green-700",
  },
};

export default function StatCard({
  title,
  value,
  icon: Icon,
  subtitle,
  trend,
  color = "green",
}: StatCardProps) {
  const theme = colors[color];

  return (
    <div className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">

      <div className="flex items-start justify-between">

        <div>

          <p className="text-sm font-medium uppercase tracking-wide text-slate-500">
            {title}
          </p>

          <h2 className="mt-3 text-3xl font-bold text-slate-900">
            {value}
          </h2>

          {subtitle && (
            <p className="mt-2 text-sm text-slate-500">
              {subtitle}
            </p>
          )}

        </div>

        <div
          className={`rounded-2xl p-4 transition ${theme.bg} ${theme.hover}`}
        >
          <Icon
            size={28}
            className={`${theme.text} transition group-hover:text-white`}
          />
        </div>

      </div>

      {trend && (
        <div className="mt-6 flex items-center gap-2 text-sm font-medium text-emerald-600">

          <ArrowUpRight size={16} />

          <span>{trend}</span>

        </div>
      )}

    </div>
  );
}