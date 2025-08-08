import { ChevronRight, Clock, MapPin, Star } from "@platter/ui/lib/icons";

export function RestaurantLandingSkeleton() {
  return (
    <>
      {/* Header Skeleton */}
      <div className="bg-gray-100 h-16 animate-pulse" />

      {/* Hero Section Skeleton */}
      <section className="relative min-h-[70vh] flex items-center justify-center bg-gradient-to-br from-background via-secondary to-accent overflow-hidden">
        {/* Background Image Skeleton */}
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />

        {/* Content */}
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          {/* Logo Skeleton */}
          <div className="mb-6">
            <div className="w-20 h-20 md:w-24 md:h-24 mx-auto rounded-full bg-gray-300 animate-pulse" />
          </div>

          {/* Restaurant Name Skeleton */}
          <div className="mb-4">
            <div className="h-12 md:h-16 bg-gray-300 rounded-lg animate-pulse max-w-md mx-auto" />
          </div>

          {/* Tagline Skeleton */}
          <div className="mb-8 max-w-2xl mx-auto">
            <div className="h-6 bg-gray-300 rounded animate-pulse mb-2" />
            <div className="h-6 bg-gray-300 rounded animate-pulse w-3/4 mx-auto" />
          </div>

          {/* Quick Info Cards Skeleton */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <div className="flex items-center gap-2 bg-card/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
              <MapPin className="w-4 h-4 text-gray-400" />
              <div className="w-24 h-4 bg-gray-300 rounded animate-pulse" />
            </div>

            <div className="flex items-center gap-2 bg-card/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
              <Clock className="w-4 h-4 text-gray-400" />
              <div className="w-20 h-4 bg-gray-300 rounded animate-pulse" />
              <ChevronRight className="w-3 h-3 text-gray-400" />
              <div className="w-12 h-3 bg-gray-300 rounded animate-pulse" />
            </div>

            <div className="flex items-center gap-2 bg-card/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
              <Star className="w-4 h-4 text-gray-400" />
              <div className="w-8 h-4 bg-gray-300 rounded animate-pulse" />
            </div>
          </div>

          {/* CTA Button Skeleton */}
          <div>
            <div className="w-32 h-12 bg-gray-300 rounded-md animate-pulse mx-auto" />
          </div>
        </div>
      </section>
    </>
  );
}
