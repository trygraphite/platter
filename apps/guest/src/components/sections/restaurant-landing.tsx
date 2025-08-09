"use client";

import { ChevronRight, Clock, MapPin, Star } from "@platter/ui/lib/icons";
import Image from "next/image";
import { useState } from "react";
import { RestaurantLandingSkeleton } from "./restaurant-landing-skeleton";

interface RestaurantLandingProps {
  restaurantDetails: {
    id: string;
    name: string;
    description: string | null;
    image: string | null;
    icon: string | null;
    googleReviewLink: string | null;
    openingHours?: string | null;
    closingHours?: string | null;
    address?: string | null;
    city?: string | null;
    state?: string | null;
    rating?: number | null;
  };
  isLoading?: boolean;
}

export function RestaurantLanding({
  restaurantDetails,
  isLoading = false,
}: RestaurantLandingProps) {
  const [_isHoursModalOpen, setIsHoursModalOpen] = useState(false);

  if (isLoading) {
    return <RestaurantLandingSkeleton />;
  }

  // Format location string
  const location = restaurantDetails.address
    ? `${restaurantDetails.address}${restaurantDetails.city ? `, ${restaurantDetails.city}` : ""}${restaurantDetails.state ? `, ${restaurantDetails.state}` : ""}`
    : "Location not available";

  // Format hours string
  const openingHours =
    restaurantDetails.openingHours && restaurantDetails.closingHours
      ? `${restaurantDetails.openingHours} - ${restaurantDetails.closingHours}`
      : "Hours not available";

  return (
    <>
      {/* <Header
        restaurantName={restaurantDetails.name}
        reviewLink={restaurantDetails.googleReviewLink || undefined}
      /> */}

      {/* Header Section with background image and gradient */}
      <section className="relative min-h-[70vh] flex items-center justify-center bg-gradient-to-br from-background via-secondary to-accent overflow-hidden">
        {/* Background Image */}
        {(restaurantDetails.image || restaurantDetails.icon) && (
          <div
            className="absolute inset-0 bg-cover bg-center opacity-40"
            style={{
              backgroundImage: `url(${restaurantDetails.image || restaurantDetails.icon})`,
            }}
          />
        )}

        {/* Content */}
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto animate-in fade-in duration-1000">
          {/* Logo */}
          {(restaurantDetails.icon || restaurantDetails.image) && (
            <div className="mb-6 animate-in zoom-in duration-700">
              <Image
                src={
                  restaurantDetails.icon ||
                  restaurantDetails.image ||
                  "/default-restaurant.png"
                }
                alt={`${restaurantDetails.name} logo`}
                width={96}
                height={96}
                className="w-20 h-20 md:w-24 md:h-24 mx-auto rounded-full object-cover shadow-lg"
                onError={() => {
                  console.error(
                    "Logo failed to load:",
                    restaurantDetails.icon || restaurantDetails.image,
                  );
                }}
              />
            </div>
          )}

          {/* Restaurant Name */}
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-4 animate-in slide-in-from-bottom-4 duration-700">
            {restaurantDetails.name?.charAt(0).toUpperCase() +
              restaurantDetails.name?.slice(1) || "Restaurant"}
          </h1>

          {/* Tagline */}
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto animate-in fade-in duration-1000 delay-300">
            {restaurantDetails.description || "Welcome to our restaurant"}
          </p>

          {/* Quick Info Cards */}
          <div className="flex flex-wrap justify-center gap-4 mb-8 animate-in slide-in-from-bottom-4 duration-700 delay-500">
            <div className="flex items-center gap-2 bg-card/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
              <MapPin className="w-4 h-4 text-primary" />
              <span className="text-sm text-card-foreground">{location}</span>
            </div>

            <button
              className="flex items-center gap-2 bg-card/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm cursor-pointer hover:bg-card/90 transition-all duration-200 hover:scale-105 group"
              onClick={() => setIsHoursModalOpen(true)}
              type="button"
            >
              <Clock className="w-4 h-4 text-primary" />
              <span className="text-sm text-card-foreground">
                {openingHours}
              </span>
              <ChevronRight className="w-3 h-3 text-muted-foreground group-hover:text-primary transition-colors" />
              <span className="text-xs text-muted-foreground group-hover:text-primary transition-colors">
                View All
              </span>
            </button>

            {restaurantDetails.rating && (
              <div className="flex items-center gap-2 bg-card/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
                <Star className="w-4 h-4 text-primary fill-current" />
                <span className="text-sm text-card-foreground">
                  {restaurantDetails.rating}/5
                </span>
              </div>
            )}
          </div>

          {/* CTA Button */}
          <div className="animate-in zoom-in duration-700 delay-600">
            <button
              type="button"
              onClick={(e) => {
                // Add immediate visual feedback
                const button = e.currentTarget;
                button.style.transform = "scale(0.95)";
                button.style.opacity = "0.8";

                // Reset after animation
                setTimeout(() => {
                  button.style.transform = "";
                  button.style.opacity = "";
                }, 150);

                // Scroll to menu section
                const menuSection = document.querySelector('[id^="category-"]');
                if (menuSection) {
                  menuSection.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                  });
                } else {
                  // Fallback: scroll to the menu section by finding the first category
                  const menuContainer = document.querySelector(
                    ".py-16.px-4.bg-background",
                  );
                  if (menuContainer) {
                    menuContainer.scrollIntoView({
                      behavior: "smooth",
                      block: "start",
                    });
                  }
                }
              }}
              className="bg-primary text-primary-foreground hover:bg-primary/90 active:bg-primary/80 active:scale-95 text-lg px-8 py-3 rounded-md shadow-lg hover:shadow-xl active:shadow-md transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2"
            >
              View Menu
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
