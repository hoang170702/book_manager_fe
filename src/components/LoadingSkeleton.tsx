export default function LoadingSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-2xl overflow-hidden border border-gray-200 dark:border-surface-700">
          <div className="aspect-[3/4] skeleton" />
          <div className="p-4 space-y-3">
            <div className="h-4 skeleton rounded w-3/4" />
            <div className="h-3 skeleton rounded w-1/2" />
            <div className="h-3 skeleton rounded w-1/4" />
            <div className="h-5 skeleton rounded w-2/5" />
          </div>
        </div>
      ))}
    </div>
  );
}
