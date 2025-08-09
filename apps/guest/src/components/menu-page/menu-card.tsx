import Image from "next/image"
import { useState } from "react"
import { cn } from "@platter/ui/lib/utils"
import { ChevronDown, ChevronUp } from "@platter/ui/lib/icons"
import { MenuItemVariety } from "@platter/db/client"


interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  image: string | null
  varieties?: MenuItemVariety[]
}

interface MenuCardProps {
  item: MenuItem
}

export function MenuCard({ item }: MenuCardProps): JSX.Element {
  const [showVarieties, setShowVarieties] = useState(false)
  
  // Format price to Naira with comma after every 3 zeros
  const formatPrice = (price: number) => `₦${price.toLocaleString('en-NG')}`

  // Get the display price - use default variety if available, otherwise base price or first variety
  const getDisplayPrice = () => {
    if (item.varieties && item.varieties.length > 0) {
      const defaultVariety = item.varieties.find(v => v.isDefault)
      return defaultVariety ? defaultVariety.price : (item.varieties[0]?.price ?? item.price)
    }
    return item.price
  }

  // Check if item has multiple varieties
  const hasMultipleVarieties = item.varieties && item.varieties.length > 1
  const hasVarieties = item.varieties && item.varieties.length > 0

  // Get price range for multiple varieties
  const getPriceRange = () => {
    if (!item.varieties || item.varieties.length <= 1) return null
    
    const prices = item.varieties.map(v => v.price)
    const minPrice = Math.min(...prices)
    const maxPrice = Math.max(...prices)
    
    return minPrice === maxPrice 
      ? formatPrice(minPrice)
      : `${formatPrice(minPrice)} - ${formatPrice(maxPrice)}`
  }

  const displayPrice = hasMultipleVarieties ? getPriceRange() : formatPrice(getDisplayPrice())

  return (
    <div className="group relative bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 flex flex-col h-full transform hover:-translate-y-1">
      {item.image && (
        <div className="relative h-48 w-full overflow-hidden">
          <Image
            src={item.image || "/placeholder.svg"}
            alt={item.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Multiple sizes badge */}
          {hasMultipleVarieties && (
            <div className="absolute top-3 right-3">
              <span className="bg-primary text-white text-xs px-2 py-1 rounded-full font-medium shadow-md">
                Multiple varieties
              </span>
            </div>
          )}
        </div>
      )}
      
      <div className={cn("flex-1 p-4", !item.image && "border-t-4 border-primary/20")}>
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-gray-800 group-hover:text-primary transition-colors duration-300 flex-1 pr-2">
            {item.name}
          </h3>
          <span className="font-semibold text-primary whitespace-nowrap text-right">
            {displayPrice}
          </span>
        </div>
        
        <p className="text-gray-600 text-sm line-clamp-3 mb-3">{item.description}</p>

        {/* Varieties Section */}
        {hasVarieties && (
          <div className="mt-3 border-t pt-3">
            {hasMultipleVarieties && (
              <button
                onClick={() => setShowVarieties(!showVarieties)}
                className="flex items-center justify-between w-full text-sm text-primary hover:text-primary/80 transition-colors duration-200 mb-2"
              >
                <span className="font-medium">
                  {showVarieties ? 'Hide sizes' : 'View all sizes'}
                </span>
                {showVarieties ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </button>
            )}

            {/* Varieties List */}
            <div className={cn(
              "space-y-2 transition-all duration-300 overflow-hidden",
              hasMultipleVarieties && !showVarieties ? "max-h-0 opacity-0" : "max-h-96 opacity-100"
            )}>
              {item.varieties?.map((variety, index) => (
                <div
                  key={variety.id}
                  className={cn(
                    "flex justify-between items-center p-2 rounded-md text-sm transition-colors duration-200",
                    variety.isDefault 
                      ? "bg-primary/10 border border-primary/20" 
                      : "bg-gray-50 hover:bg-gray-100",
                    !variety.isAvailable && "opacity-60"
                  )}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className={cn(
                        "font-medium",
                        variety.isDefault && "text-primary"
                      )}>
                        {variety.name}
                      </span>
                      {variety.isDefault && (
                        <span className="bg-primary text-white text-xs px-1.5 py-0.5 rounded-full">
                          Default
                        </span>
                      )}
                      {!variety.isAvailable && (
                        <span className="bg-red-100 text-red-700 text-xs px-1.5 py-0.5 rounded-full">
                          Unavailable
                        </span>
                      )}
                    </div>
                    {variety.description && (
                      <p className="text-gray-600 text-xs mt-1">
                        {variety.description}
                      </p>
                    )}
                  </div>
                  <span className={cn(
                    "font-semibold whitespace-nowrap ml-2",
                    variety.isDefault ? "text-primary" : "text-gray-700"
                  )}>
                    {formatPrice(variety.price)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}