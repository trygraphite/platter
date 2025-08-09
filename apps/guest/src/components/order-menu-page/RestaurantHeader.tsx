import { Button } from "@platter/ui/components/button";
import { Home } from "@platter/ui/lib/icons";
import Image from "next/image";
import type { RestaurantDetails } from "@/types/menu";

interface RestaurantHeaderProps {
  restaurant: RestaurantDetails;
  qr: string;
  isLoading: boolean;
  onHomeClick?: () => void;
}

const RestaurantHeader: React.FC<RestaurantHeaderProps> = ({
  restaurant,
  qr,
  isLoading,
  onHomeClick,
}) => {
  if (isLoading) {
    return (
      <div className="relative w-full h-48 md:h-64 bg-gray-200 animate-pulse">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-gray-400">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {restaurant?.image?.startsWith("http") && (
        <div className="relative w-full h-48 md:h-64">
          <Image
            src={restaurant.image}
            alt={restaurant.name || "Restaurant"}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/40 to-transparent" />
          <div className="absolute inset-0 bg-black/20" />

          {/* Home Button */}
          <div className="absolute top-4 left-4 z-20">
            <Button
              variant="secondary"
              size="sm"
              onClick={onHomeClick}
              className="bg-white/90 hover:bg-white text-gray-800 shadow-lg backdrop-blur-sm"
            >
              <Home className="w-4 h-4 mr-2" />
              Home
            </Button>
          </div>
        </div>
      )}

      <div
        className={`container mx-auto p-4 ${
          restaurant?.image ? "relative -mt-24 md:-mt-32 z-10 text-white" : ""
        }`}
      >
        <h1 className="text-3xl md:text-4xl font-bold mb-2">
          {restaurant?.name || "Restaurant Menu"}
        </h1>
        <p
          className={`${
            restaurant?.image ? "text-white/90" : "text-muted-foreground"
          } max-w-2xl text-sm md:text-base`}
        >
          {restaurant?.description || ""}
        </p>
        <div className="flex gap-4 mt-3 text-xs md:text-sm">
          <span className={restaurant?.image ? "text-white/80" : ""}>
            {restaurant?.cuisine || ""}
          </span>
          {restaurant?.cuisine && restaurant?.openingHours && (
            <span className={restaurant?.image ? "text-white/80" : ""}>•</span>
          )}
          {restaurant?.openingHours && restaurant?.closingHours && (
            <span className={restaurant?.image ? "text-white/80" : ""}>
              {restaurant.openingHours} - {restaurant.closingHours}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default RestaurantHeader;
