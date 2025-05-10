"use client";
import { Button } from "@platter/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@platter/ui/components/card";
import {
  Building2,
  UtensilsCrossed,
  MessageSquare,
  Star,
  ScreenShare,
} from "@platter/ui/lib/icons";
import Link from "next/link";
import Image from "next/image";
import { PageConfig } from "@/types/qr";
import resturantLogo from "../../../public/assets/serving-dish.png";

interface QRCodeViewProps {
  qrId: string;
  config: PageConfig;
}

export function QRCodeView({ qrId, config }: QRCodeViewProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <Card className="w-full max-w-md mx-auto backdrop-blur-sm bg-white/90 dark:bg-gray-800/90 shadow-xl">
          <CardHeader className="text-center space-y-2">
            {config.restaurantInfo.icon ? (
              <div className="mx-auto w-16 h-16 relative rounded-full overflow-hidden">
                <Image
                  src={config.restaurantInfo.icon}
                  alt={config.restaurantInfo.name}
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="mx-auto w-16 h-16  rounded-full flex items-center justify-center">
                <Image src={resturantLogo} alt="resturant-logo" className="w-16 h-16 text-primary" />
              </div>
            )}
            <CardTitle className="text-2xl font-bold">{config.title}</CardTitle>
            <CardDescription className="text-base">
              {config.description}
            </CardDescription>
            {(config.restaurantInfo.cuisine || config.restaurantInfo.hours) && (
              <div className="text-sm text-muted-foreground">
                {config.restaurantInfo.cuisine && (
                  <p className="mb-1">
                    Cuisine: {config.restaurantInfo.cuisine}
                  </p>
                )}
                {config.restaurantInfo.hours && (
                  <p>Hours: {config.restaurantInfo.hours}</p>
                )}
              </div>
            )}
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid gap-4">
              {config.buttons.map((button, index) => (
                <Link
                  key={index}
                  href={`/${qrId}${button.href}`}
                  className="block"
                >
                  <Button
                    className="w-full h-14 text-lg flex items-center justify-center gap-3 transition-all hover:scale-102 hover:shadow-md"
                    variant={button.variant}
                  >
                    {getButtonIcon(button.label)}
                    {button.label}
                  </Button>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function getButtonIcon(label: string) {
  switch (label.toLowerCase()) {
    case "restaurant menu":
      return <UtensilsCrossed className="w-5 h-5" />;
    case "submit review":
      return <Star className="w-5 h-5" />;
    case "submit complaint":
      return <MessageSquare className="w-5 h-5" />;
    case "view orders":
      return <ScreenShare className="w-5 h-5" />;
    default:
      return null;
  }
}
