"use client";

import { Button } from "@platter/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@platter/ui/components/card";
import { CallWaiterBell } from "./call-waiter-bell";

interface EnhancedQRViewProps {
  qrId: string;
  config: {
    title: string;
    description: string;
    restaurantInfo: {
      name: string;
      icon?: string;
      image?: string;
      cuisine?: string;
      openingHours?: string;
      closingHours?: string;
      googleReviewLink?: string;
      address?: string;
      city?: string;
      state?: string;
      zipCode?: string;
      phone?: string;
      email?: string;
      website?: string;
      seatingCapacity?: number;
      hours?: string;
    };
    buttons: {
      label: string;
      href: string;
      variant: "default" | "outline" | "secondary";
    }[];
  };
  userId: string;
  tableNumber: string;
}

export function EnhancedQRView({
  qrId,
  config,
  userId,
  tableNumber,
}: EnhancedQRViewProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-start justify-center p-4 pt-[15%] md:pt-[10%]">
      <div className="w-full max-w-md">
        <Card className="shadow-xl border-0 bg-white/95 backdrop-blur-sm">
          {/* Background Image - covers the entire card */}
          {config.restaurantInfo.image && (
            <div
              className="absolute inset-0 bg-cover bg-center opacity-30 rounded-lg"
              style={{ backgroundImage: `url(${config.restaurantInfo.image})` }}
            />
          )}

          {/* Content overlay */}
          <div className="relative z-10">
            <CardHeader className="text-center pb-4">
              {/* Restaurant Logo */}
              {config.restaurantInfo.icon && (
                <div className="mx-auto mb-4">
                  <img
                    src={config.restaurantInfo.icon}
                    alt={config.restaurantInfo.name}
                    className="w-16 h-16 rounded-full object-cover shadow-lg"
                  />
                </div>
              )}

              <CardTitle className="text-2xl font-bold text-gray-900">
                {config.restaurantInfo.name}
              </CardTitle>
              <CardDescription className="text-gray-600">
                {config.description}
              </CardDescription>

              {/* Table Info */}
              <div className="inline-flex items-center justify-center bg-blue-50 text-blue-700 px-4 py-2 rounded-full font-medium mt-3">
                <span className="text-lg">Table:</span>
                <span className="ml-2 text-lg font-semibold">
                  {tableNumber.toUpperCase()}
                </span>
              </div>
            </CardHeader>
          </div>

          <CardContent className="p-6">
            <div className="grid gap-4">
              {config.buttons.map((button, index) => (
                <a
                  key={`${button.label}-${button.href}`}
                  href={`/${qrId}${button.href}`}
                  className="block relative z-20"
                >
                  <Button
                    className={`w-full h-14 text-lg flex items-center justify-start gap-3 transition-all duration-200 transform hover:scale-105 active:scale-95 px-6 ${
                      index === 0
                        ? "bg-black text-white hover:bg-gray-800 border-2 border-black hover:border-gray-800"
                        : "bg-white border-2 border-gray-200 hover:border-gray-300 text-gray-900 hover:bg-gray-50"
                    }`}
                    variant={button.variant}
                  >
                    <span className="text-xl">
                      {getButtonIcon(button.label)}
                    </span>
                    <span className="font-medium">{button.label}</span>
                  </Button>
                </a>
              ))}
            </div>
          </CardContent>

          <CardFooter className="p-6 pt-0 relative z-20">
            <CallWaiterBell
              tableNumber={tableNumber}
              tableId={qrId}
              userId={userId}
              restaurantName={config.restaurantInfo.name || config.title}
            />
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

function getButtonIcon(label: string) {
  switch (label.toLowerCase()) {
    case "restaurant menu":
      return "🍽️";
    case "view orders":
      return "📋";
    case "submit review":
      return "⭐";
    case "submit complaint":
      return "💬";
    default:
      return "📱";
  }
}
