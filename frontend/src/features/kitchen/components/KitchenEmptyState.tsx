interface KitchenEmptyStateProps {
  title?: string;
  description?: string;
}

export default function KitchenEmptyState({
  title = "Kitchen is clear",
  description = "There are no active food orders waiting in the kitchen.",
}: KitchenEmptyStateProps) {
  return (
    <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
        <span className="text-xl text-slate-500">
          ✓
        </span>
      </div>

      <h3 className="mt-4 text-sm font-semibold text-slate-900">
        {title}
      </h3>

      <p className="mx-auto mt-1 max-w-md text-sm text-slate-500">
        {description}
      </p>
    </div>
  );
}