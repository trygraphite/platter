import type React from "react";

const MenuPageSkeleton: React.FC = () => {
  return (
    <div className="min-h-screen bg-background animate-in fade-in duration-1000">
      {/* Header Skeleton */}
      <div className="relative">
        <div className="relative w-full h-48 md:h-64 bg-gray-200 animate-pulse">
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-transparent" />
        </div>
        <div className="container mx-auto p-4 relative -mt-24 md:-mt-32 z-10">
          <div className="h-8 w-64 bg-gray-200 rounded animate-pulse mb-2" />
          <div className="h-4 w-96 bg-gray-200 rounded animate-pulse mb-3" />
          <div className="h-3 w-48 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>

      {/* Category Navigation Skeleton */}
      <div className="sticky top-0 z-10 bg-background border-b">
        <div className="flex gap-2 py-2 overflow-x-auto">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="h-10 w-24 bg-gray-200 rounded-lg animate-pulse flex-shrink-0"
            />
          ))}
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="max-w-4xl mx-auto px-4 pb-4">
        <div className="space-y-8 mt-4">
          {Array.from({ length: 3 }).map((_, categoryIndex) => (
            <div key={categoryIndex} className="space-y-4">
              <div className="h-8 w-32 bg-gray-200 rounded animate-pulse" />
              <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, itemIndex) => (
                  <div
                    key={itemIndex}
                    className="h-48 bg-gray-200 rounded-lg animate-pulse"
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cart Button Skeleton */}
      <div className="fixed bottom-20 right-10 z-40">
        <div className="h-16 w-64 bg-gray-200 rounded-xl animate-pulse" />
      </div>
    </div>
  );
};

export default MenuPageSkeleton;
