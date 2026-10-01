import DashboardLayout from "../../../layouts/DashboardLayout";

import KitchenEmptyState from "../components/KitchenEmptyState";
import KitchenOrderCard from "../components/KitchenOrderCard";
import KitchenStatCard from "../components/KitchenStatCard";

import useKitchen from "../hooks/useKitchen";

export default function Kitchen() {
  const {
    items,
    pendingItems,
    preparingItems,
    readyItems,
    loading,
    actionLoading,
    error,
    reload,
    startPreparing,
    markReady,
    markServed,
  } = useKitchen();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Kitchen Display
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Manage restaurant orders from preparation to serving.
            </p>
          </div>

          <button
            type="button"
            onClick={reload}
            disabled={loading}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Refreshing..." : "Refresh Kitchen"}
          </button>
        </div>

        {error && (
          <div className="flex flex-col gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-red-700">{error}</p>

            <button
              type="button"
              onClick={reload}
              className="text-sm font-medium text-red-700 underline hover:text-red-800"
            >
              Try Again
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
          <KitchenStatCard
            label="Active Items"
            value={items.length}
            description="Items currently in kitchen"
          />

          <KitchenStatCard
            label="Pending"
            value={pendingItems.length}
            description="Waiting to be prepared"
          />

          <KitchenStatCard
            label="Preparing"
            value={preparingItems.length}
            description="Currently being prepared"
          />

          <KitchenStatCard
            label="Ready"
            value={readyItems.length}
            description="Ready to be served"
          />
        </div>

        {loading ? (
          <div className="rounded-xl border border-slate-200 bg-white p-10 text-center">
            <p className="text-sm text-slate-500">
              Loading kitchen orders...
            </p>
          </div>
        ) : items.length === 0 ? (
          <KitchenEmptyState />
        ) : (
          <div className="space-y-8">
            {pendingItems.length > 0 && (
              <section>
                <div className="mb-4">
                  <h2 className="text-lg font-semibold text-slate-900">
                    Pending Orders
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Orders waiting to be prepared.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
                  {pendingItems.map((item) => (
                    <KitchenOrderCard
                      key={item.id}
                      item={item}
                      onStartPreparing={startPreparing}
                      onMarkReady={markReady}
                      onMarkServed={markServed}
                      actionLoading={actionLoading}
                    />
                  ))}
                </div>
              </section>
            )}

            {preparingItems.length > 0 && (
              <section>
                <div className="mb-4">
                  <h2 className="text-lg font-semibold text-slate-900">
                    Preparing
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Orders currently being prepared by the kitchen.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
                  {preparingItems.map((item) => (
                    <KitchenOrderCard
                      key={item.id}
                      item={item}
                      onStartPreparing={startPreparing}
                      onMarkReady={markReady}
                      onMarkServed={markServed}
                      actionLoading={actionLoading}
                    />
                  ))}
                </div>
              </section>
            )}

            {readyItems.length > 0 && (
              <section>
                <div className="mb-4">
                  <h2 className="text-lg font-semibold text-slate-900">
                    Ready to Serve
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Orders that have been prepared and are waiting to be
                    served.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
                  {readyItems.map((item) => (
                    <KitchenOrderCard
                      key={item.id}
                      item={item}
                      onStartPreparing={startPreparing}
                      onMarkReady={markReady}
                      onMarkServed={markServed}
                      actionLoading={actionLoading}
                    />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}