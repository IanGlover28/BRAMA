export default function Loader({
  count = 1,
  className = "",
}: {
  count?: number;
  className?: string;
}) {
  return (
    <div
      className={`grid gap-6 ${
        count > 1 ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "max-w-sm mx-auto"
      } ${className}`}
    >
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