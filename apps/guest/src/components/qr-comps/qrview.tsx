"use client"
import { Button } from "@platter/ui/components/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@platter/ui/components/card"
import { UtensilsCrossed, MessageSquare, Star, ScreenShare, ChevronUp, ChevronDown } from "@platter/ui/lib/icons"
import Link from "next/link"
import Image from "next/image"
import resturantLogo from "../../../public/assets/serving-dish.png"
import type { PageConfig } from "@/types/qr"
import { useState } from "react"
import { CallWaiterBell } from "./call-waiter-bell"

interface QRCodeViewProps {
  qrId: string
  config: PageConfig
  userId: string 
  tableNumber: string
}

export function QRCodeView({ qrId, config, userId, tableNumber }: QRCodeViewProps) {
  const [expanded, setExpanded] = useState(false)
  console.log("tableNumber", tableNumber)
  const detailedInfo = (
    <>
      {/* Restaurant Hours */}
      {((config.restaurantInfo.openingHours && config.restaurantInfo.closingHours) || config.restaurantInfo.hours) && (
        <div className="flex-1">
          <p className="font-medium">Hours</p>
          <p className="text-muted-foreground">
            {config.restaurantInfo.hours ||
              `${config.restaurantInfo.openingHours} - ${config.restaurantInfo.closingHours}`}
          </p>
        </div>
      )}

      {/* Cuisine */}
      {config.restaurantInfo.cuisine && (
        <div className="flex-1">
          <p className="font-medium">Cuisine</p>
          <p className="text-muted-foreground">{config.restaurantInfo.cuisine}</p>
        </div>
      )}
      {/* Address */}
      {(config.restaurantInfo.address ||
        config.restaurantInfo.city ||
        config.restaurantInfo.state ||
        config.restaurantInfo.zipCode) && (
        <div>
          <p className="font-medium">Location</p>
          <p className="text-muted-foreground">
            {config.restaurantInfo.address && `${config.restaurantInfo.address}, `}
            {config.restaurantInfo.city && `${config.restaurantInfo.city}, `}
            {config.restaurantInfo.state && `${config.restaurantInfo.state} `}
            {config.restaurantInfo.zipCode && config.restaurantInfo.zipCode}
          </p>
        </div>
      )}

      {/* Contact Info */}
      {(config.restaurantInfo.phone || config.restaurantInfo.email) && (
        <div>
          <p className="font-medium">Contact</p>
          {config.restaurantInfo.phone && <p className="text-muted-foreground">{config.restaurantInfo.phone}</p>}
          {config.restaurantInfo.email && <p className="text-muted-foreground">{config.restaurantInfo.email}</p>}
        </div>
      )}

      {/* Website */}
      {config.restaurantInfo.website && (
        <div>
          <p className="font-medium">Website</p>
          <a
            href={config.restaurantInfo.website}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            {config.restaurantInfo.website.replace(/^https?:\/\//, "")}
          </a>
        </div>
      )}

      {/* Seating Capacity */}
      {config.restaurantInfo.seatingCapacity && (
        <div>
          <p className="font-medium">Seating Capacity</p>
          <p className="text-muted-foreground">{config.restaurantInfo.seatingCapacity} guests</p>
        </div>
      )}
    </>
  )

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <Card className="w-full max-w-md mx-auto backdrop-blur-sm bg-white/90 dark:bg-gray-800/90 shadow-xl">
          <CardHeader className="text-center space-y-2">
            {config.restaurantInfo.icon ? (
              <div className="mx-auto w-20 h-20 relative rounded-full overflow-hidden">
                <Image
                  src={config.restaurantInfo.icon || "/placeholder.svg"}
                  alt={config.restaurantInfo.name}
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="mx-auto w-20 h-20 rounded-full flex items-center justify-center">
                <Image
                  src={resturantLogo || "/placeholder.svg"}
                  alt="resturant-logo"
                  className="w-16 h-16 text-primary"
                />
              </div>
            )}
            <CardTitle className="text-2xl font-bold">{config.title}</CardTitle>
            <CardDescription className="text-base">{config.description}</CardDescription>
          </CardHeader>

          <div className="px-6 ">
            <div className="text-center mr-2 font-semibold">Place an Order now!</div>
            <div className="text-sm  rounded-lg dark:bg-gray-900/50 p-4">
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  expanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <div className="space-y-3 pt-2">{detailedInfo}</div>
              </div>

              {/* Show More/Less Button */}
              <Button
                variant="ghost"
                className="w-full mt-1 flex items-center justify-center text-primary hover:text-primary/80"
                onClick={() => setExpanded(!expanded)}
              >
                <span>{expanded ? "Show Less" : "Show More"}</span>
                {expanded ? <ChevronUp className="ml-2 h-4 w-4" /> : <ChevronDown className="ml-2 h-4 w-4" />}
              </Button>
            </div>
          </div>

          <CardContent className="p-6">
            <div className="grid gap-4">
              {config.buttons.map((button, index) => (
                <Link key={index} href={`/${qrId}${button.href}`} className="block">
                  <Button
                    className="w-full h-14 text-lg flex items-center justify-center gap-3"
                    variant={button.variant}
                  >
                    {getButtonIcon(button.label)}
                    {button.label}
                  </Button>
                </Link>
              ))}
            </div>
          </CardContent>

          <CardFooter>
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
  )
}

function getButtonIcon(label: string) {
  switch (label.toLowerCase()) {
    case "restaurant menu":
      return <UtensilsCrossed className="w-5 h-5" />
    case "submit review":
      return <Star className="w-5 h-5" />
    case "submit complaint":
      return <MessageSquare className="w-5 h-5" />
    case "view orders":
      return <ScreenShare className="w-5 h-5" />
    default:
      return null
  }
}
