import {
  Wine,
  DollarSign,
  Clock3,
  CheckCircle2,
} from "lucide-react";

export default function BarSummary() {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">

      <div className="mb-6 flex items-center gap-3">
        <div className="rounded-xl bg-purple-100 p-3">
          <Wine
            className="text-purple-600"
            size={24}
          />
        </div>

        <div>
          <h2 className="text-xl font-semibold text-slate-800">
            Bar
          </h2>

          <p className="text-sm text-slate-500">
            Today's performance
          </p>
        </div>
      </div>

      <div className="space-y-5">

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <DollarSign
              size={18}
              className="text-green-600"
            />

            <span className="text-slate-600">
              Revenue
            </span>
          </div>

          <span className="font-semibold">
            KES 26,800
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Wine
              size={18}
              className="text-purple-600"
            />

            <span className="text-slate-600">
              Orders
            </span>
          </div>

          <span className="font-semibold">
            54
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Clock3
              size={18}
              className="text-amber-600"
            />

            <span className="text-slate-600">
              Open Tabs
            </span>
          </div>

          <span className="font-semibold text-amber-600">
            11
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CheckCircle2
              size={18}
              className="text-emerald-600"
            />

            <span className="text-slate-600">
              Completed
            </span>
          </div>

          <span className="font-semibold text-emerald-600">
            43
          </span>
        </div>

      </div>

    </div>
  );
}