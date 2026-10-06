export default function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-lg animate-pulse">
          <div className="h-52 bg-gray-200" />
          <div className="p-7 space-y-3">
            <div className="h-5 bg-gray-200 rounded w-3/4" />
            <div className="h-4 bg-gray-200 rounded w-1/2" />
            <div className="h-4 bg-gray-200 rounded w-1/3" />
            <div className="flex justify-between items-center pt-3">
              <div className="h-5 bg-gray-200 rounded w-20" />
              <div className="h-9 bg-gray-200 rounded-full w-24" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-lg animate-pulse">
      <div className="h-52 bg-gray-200" />
      <div className="p-7 space-y-3">
        <div className="h-5 bg-gray-200 rounded w-3/4" />
        <div className="h-4 bg-gray-200 rounded w-1/2" />
        <div className="flex justify-between items-center pt-3">
          <div className="h-5 bg-gray-200 rounded w-20" />
          <div className="h-9 bg-gray-200 rounded-full w-24" />
        </div>
      </div>
    </div>
  );
}
