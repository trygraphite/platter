"use client";

import { Badge } from "@platter/ui/components/badge";
import { Button } from "@platter/ui/components/button";
import { Card, CardContent } from "@platter/ui/components/card";
import {
  ChefHat,
  ChevronRight,
  Clock,
  ExternalLink,
  Facebook,
  Globe,
  Instagram,
  MapPin,
  MessageSquare,
  Phone,
  Star,
} from "@platter/ui/lib/icons";
import { useState } from "react";

interface RestaurantInfoProps {
  restaurantDetails: {
    name: string;
    openingHours: string | null;
    closingHours: string | null;
    address: string | null;
    city: string | null;
    state: string | null;
    zipCode: string | null;
    phone: string | null;
    website: string | null;
    googleReviewLink?: string | null;
    cuisine?: string | null;
    rating?: number | null;
    reviewSnippet?: string | null;
    socialMedia?: {
      website?: string | null;
      instagram?: string | null;
      facebook?: string | null;
      twitter?: string | null;
    };
  };
  isLoading?: boolean;
}

export function RestaurantInfo({
  restaurantDetails,
  isLoading = false,
}: RestaurantInfoProps) {
  const [isHoursModalOpen, setIsHoursModalOpen] = useState(false);

  if (isLoading) {
    return <RestaurantInfoSkeleton />;
  }

  // Format location string
  const location = restaurantDetails.address
    ? `${restaurantDetails.address}${restaurantDetails.city ? `, ${restaurantDetails.city}` : ""}${restaurantDetails.state ? `, ${restaurantDetails.state}` : ""}${restaurantDetails.zipCode ? ` ${restaurantDetails.zipCode}` : ""}`
    : "Location not available";

  // Format hours string
  const openingHours =
    restaurantDetails.openingHours && restaurantDetails.closingHours
      ? `${restaurantDetails.openingHours} - ${restaurantDetails.closingHours}`
      : "Hours not available";

  return (
    <section className="py-16 px-4 bg-gradient-to-br from-background via-secondary/20 to-accent/20">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12 animate-in fade-in duration-1000">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            About {restaurantDetails.name}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Everything you need to know about us
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Location Card */}
          <Card className="group hover:shadow-lg transition-all duration-300 animate-in slide-in-from-bottom-4">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                  <MapPin className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">
                    Location
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {location}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Hours Card */}
          <Card
            className="group hover:shadow-lg transition-all duration-300 animate-in slide-in-from-bottom-4 cursor-pointer hover:scale-105"
            style={{ animationDelay: "0.1s" }}
            onClick={() => setIsHoursModalOpen(true)}
          >
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                  <Clock className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-foreground">Hours</h3>
                    <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <p className="text-muted-foreground text-sm">
                    {openingHours}
                  </p>
                  <p className="text-xs text-primary mt-1 group-hover:font-medium transition-all">
                    Click to view all hours
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Cuisine Card */}
          {restaurantDetails.cuisine && (
            <Card
              className="group hover:shadow-lg transition-all duration-300 animate-in slide-in-from-bottom-4"
              style={{ animationDelay: "0.2s" }}
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                    <ChefHat className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">
                      Cuisine
                    </h3>
                    <Badge variant="secondary" className="text-xs">
                      {restaurantDetails.cuisine}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Rating Card */}
          {(restaurantDetails.rating || restaurantDetails.reviewSnippet) && (
            <Card
              className="group hover:shadow-lg transition-all duration-300 animate-in slide-in-from-bottom-4 md:col-span-2 lg:col-span-2"
              style={{ animationDelay: "0.3s" }}
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                    <Star className="w-6 h-6 text-primary fill-current" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-foreground">Reviews</h3>
                      {restaurantDetails.rating && (
                        <Badge variant="default">
                          {restaurantDetails.rating}/5 ⭐
                        </Badge>
                      )}
                    </div>
                    {restaurantDetails.reviewSnippet && (
                      <p className="text-muted-foreground text-sm italic leading-relaxed">
                        &quot;{restaurantDetails.reviewSnippet}&quot;
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Contact Info Card */}
          {(restaurantDetails.phone ||
            restaurantDetails.website ||
            restaurantDetails.googleReviewLink) && (
            <Card
              className="group hover:shadow-lg transition-all duration-300 animate-in slide-in-from-bottom-4"
              style={{ animationDelay: "0.4s" }}
            >
              <CardContent className="p-6">
                <h3 className="font-semibold text-foreground mb-4">
                  Contact Us
                </h3>
                <div className="space-y-3">
                  {restaurantDetails.phone && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={`tel:${restaurantDetails.phone}`}>
                        <Phone className="w-4 h-4 mr-2" />
                        {restaurantDetails.phone}
                      </a>
                    </Button>
                  )}
                  {restaurantDetails.website && (
                    <Button variant="outline" size="sm" asChild>
                      <a
                        href={restaurantDetails.website}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Globe className="w-4 h-4 mr-2" />
                        <ExternalLink className="w-3 h-3 ml-1" />
                        {restaurantDetails.website.replace(/^https?:\/\//, "")}
                      </a>
                    </Button>
                  )}
                  {restaurantDetails.googleReviewLink && (
                    <Button variant="outline" size="sm" asChild>
                      <a
                        href={restaurantDetails.googleReviewLink}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <MessageSquare className="w-4 h-4 mr-2" />
                        <ExternalLink className="w-3 h-3 ml-1" />
                        Leave a Review
                      </a>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Social Links Card */}
          {restaurantDetails.socialMedia && (
            <Card
              className="group hover:shadow-lg transition-all duration-300 animate-in slide-in-from-bottom-4"
              style={{ animationDelay: "0.5s" }}
            >
              <CardContent className="p-6">
                <h3 className="font-semibold text-foreground mb-4">
                  Connect With Us
                </h3>
                <div className="flex flex-wrap gap-2">
                  {restaurantDetails.socialMedia.website && (
                    <Button variant="outline" size="sm" asChild>
                      <a
                        href={restaurantDetails.socialMedia.website}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Globe className="w-4 h-4" />
                        <ExternalLink className="w-3 h-3 ml-1" />
                      </a>
                    </Button>
                  )}
                  {restaurantDetails.socialMedia.instagram && (
                    <Button variant="outline" size="sm" asChild>
                      <a
                        href={restaurantDetails.socialMedia.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Instagram className="w-4 h-4" />
                      </a>
                    </Button>
                  )}
                  {restaurantDetails.socialMedia.facebook && (
                    <Button variant="outline" size="sm" asChild>
                      <a
                        href={restaurantDetails.socialMedia.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Facebook className="w-4 h-4" />
                      </a>
                    </Button>
                  )}
                  {restaurantDetails.socialMedia.twitter && (
                    <Button variant="outline" size="sm" asChild>
                      <a
                        href={restaurantDetails.socialMedia.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                        </svg>
                      </a>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Hours Modal - Placeholder for future implementation */}
      {isHoursModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Restaurant Hours</h3>
            <p className="text-muted-foreground mb-4">{openingHours}</p>
            <Button onClick={() => setIsHoursModalOpen(false)}>Close</Button>
          </div>
        </div>
      )}
    </section>
  );
}

// Skeleton component
function RestaurantInfoSkeleton() {
  return (
    <section className="py-16 px-4 bg-gradient-to-br from-background via-secondary/20 to-accent/20">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <div className="h-8 bg-gray-300 rounded animate-pulse max-w-md mx-auto mb-4" />
          <div className="h-4 bg-gray-300 rounded animate-pulse max-w-lg mx-auto" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card
            className="animate-in slide-in-from-bottom-4"
            style={{ animationDelay: "0.1s" }}
          >
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-gray-200 rounded-lg animate-pulse">
                  <div className="w-6 h-6 bg-gray-300 rounded" />
                </div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-300 rounded animate-pulse mb-2" />
                  <div className="h-3 bg-gray-300 rounded animate-pulse w-3/4" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card
            className="animate-in slide-in-from-bottom-4"
            style={{ animationDelay: "0.2s" }}
          >
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-gray-200 rounded-lg animate-pulse">
                  <div className="w-6 h-6 bg-gray-300 rounded" />
                </div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-300 rounded animate-pulse mb-2" />
                  <div className="h-3 bg-gray-300 rounded animate-pulse w-3/4" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card
            className="animate-in slide-in-from-bottom-4"
            style={{ animationDelay: "0.3s" }}
          >
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-gray-200 rounded-lg animate-pulse">
                  <div className="w-6 h-6 bg-gray-300 rounded" />
                </div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-300 rounded animate-pulse mb-2" />
                  <div className="h-3 bg-gray-300 rounded animate-pulse w-3/4" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card
            className="animate-in slide-in-from-bottom-4"
            style={{ animationDelay: "0.4s" }}
          >
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-gray-200 rounded-lg animate-pulse">
                  <div className="w-6 h-6 bg-gray-300 rounded" />
                </div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-300 rounded animate-pulse mb-2" />
                  <div className="h-3 bg-gray-300 rounded animate-pulse w-3/4" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card
            className="animate-in slide-in-from-bottom-4"
            style={{ animationDelay: "0.5s" }}
          >
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-gray-200 rounded-lg animate-pulse">
                  <div className="w-6 h-6 bg-gray-300 rounded" />
                </div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-300 rounded animate-pulse mb-2" />
                  <div className="h-3 bg-gray-300 rounded animate-pulse w-3/4" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card
            className="animate-in slide-in-from-bottom-4"
            style={{ animationDelay: "0.6s" }}
          >
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-gray-200 rounded-lg animate-pulse">
                  <div className="w-6 h-6 bg-gray-300 rounded" />
                </div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-300 rounded animate-pulse mb-2" />
                  <div className="h-3 bg-gray-300 rounded animate-pulse w-3/4" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
