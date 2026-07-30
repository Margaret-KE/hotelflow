import {
  UtensilsCrossed,
  Clock3,
  CheckCircle2,
  DollarSign,
} from "lucide-react";

export default function RestaurantSummary() {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">

      <div className="mb-6 flex items-center gap-3">
        <div className="rounded-xl bg-orange-100 p-3">
          <UtensilsCrossed
            className="text-orange-600"
            size={24}
          />
        </div>

        <div>
          <h2 className="text-xl font-semibold text-slate-800">
            Restaurant
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
            KES 43,200
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <UtensilsCrossed
              size={18}
              className="text-orange-600"
            />

            <span className="text-slate-600">
              Orders
            </span>
          </div>

          <span className="font-semibold">
            87
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Clock3
              size={18}
              className="text-amber-600"
            />

            <span className="text-slate-600">
              Pending
            </span>
          </div>

          <span className="font-semibold text-amber-600">
            6
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
            81
          </span>
        </div>

      </div>

    </div>
  );
}