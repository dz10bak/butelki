"use client";

export function SkeletonCard() {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-800 animate-pulse">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-xl" />
          <div className="space-y-2">
            <div className="w-16 h-4 bg-gray-200 dark:bg-gray-700 rounded" />
            <div className="w-12 h-3 bg-gray-200 dark:bg-gray-700 rounded" />
          </div>
        </div>
        <div className="w-16 h-5 bg-gray-200 dark:bg-gray-700 rounded-full" />
      </div>
      <div className="w-3/4 h-3 bg-gray-200 dark:bg-gray-700 rounded mb-3" />
      <div className="w-20 h-4 bg-gray-200 dark:bg-gray-700 rounded" />
    </div>
  );
}

export function SkeletonDetail() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="w-full h-48 bg-gray-200 dark:bg-gray-700 rounded-2xl" />
      <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 border border-gray-100 dark:border-gray-800 space-y-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex justify-between">
            <div className="w-16 h-3 bg-gray-200 dark:bg-gray-700 rounded" />
            <div className="w-24 h-3 bg-gray-200 dark:bg-gray-700 rounded" />
          </div>
        ))}
      </div>
      <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 border border-gray-100 dark:border-gray-800 space-y-3">
        <div className="w-28 h-4 bg-gray-200 dark:bg-gray-700 rounded" />
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex justify-between">
            <div className="w-20 h-3 bg-gray-200 dark:bg-gray-700 rounded" />
            <div className="w-16 h-3 bg-gray-200 dark:bg-gray-700 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function SkeletonList({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {[...Array(count)].map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
