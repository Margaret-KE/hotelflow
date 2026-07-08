import type { ReactNode } from "react";

interface DashboardCardProps {
  title: string;
  children: ReactNode;
}

export default function DashboardCard({
  title,
  children,
}: DashboardCardProps) {
  return (
    <section className="rounded-2xl bg-white shadow-sm border border-slate-200">
      <div className="border-b border-slate-100 px-6 py-4">
        <h2 className="text-lg font-semibold text-slate-800">
          {title}
        </h2>
      </div>

      <div className="p-6">
        {children}
      </div>
    </section>
  );
}