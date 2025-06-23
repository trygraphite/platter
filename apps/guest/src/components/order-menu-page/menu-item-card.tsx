import Image from "next/image"
import { useState } from "react"
import { cn } from "@platter/ui/lib/utils"
import { ChevronDown, ChevronUp, MinusCircle, PlusCircle, Check } from "@platter/ui/lib/icons"
import { Button } from "@platter/ui/components/button"
import type { MenuItem, MenuItemVariety, CartItem } from "@/types/menu"
import { MenuItemModal } from "./menu-item-model"

interface MenuCardProps {
  item: MenuItem
  inCart?: boolean
  quantity?: number
  cartItem?: CartItem
  onQuantityChange?: (item: MenuItem, increment: boolean, variety?: MenuItemVariety) => void
  formatPrice: (price: number | string | null | undefined) => string
}

export function MenuCard({ 
  item, 
  inCart = false, 
  quantity = 0, 
  cartItem,
  onQuantityChange,
  formatPrice 
}: MenuCardProps) {
  const [showVarieties, setShowVarieties] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedVariety, setSelectedVariety] = useState<MenuItemVariety | null>(
    () => {
      if (item.varieties?.length) {
        // If there's a cart item, use its selected variety
        if (cartItem?.selectedVariety) {
          return cartItem.selectedVariety
        }
        // Otherwise, find the default variety or use the first one
        return item.varieties.find(v => v.isDefault) ?? item.varieties[0] ?? null
      }
      return null
    }
  )
  
  // Format price to Naira with comma after every 3 zeros
  const formatPriceInternal = (price: number) => formatPrice(price)

  // Truncate description to about 20 characters
  const truncateDescription = (text: string, maxLength: number = 15) => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + "..."
  }

  // Get the display price - use selected variety price or base price
  const getDisplayPrice = () => {
    if (selectedVariety) {
      return selectedVariety.price
    }
    if (item.varieties && item.varieties.length > 0) {
      const defaultVariety = item.varieties.find(v => v.isDefault)
      return defaultVariety ? defaultVariety.price : (item.varieties[0]?.price ?? item.price)
    }
    return item.price
  }

  // Check if item has multiple varieties
  const hasMultipleVarieties = item.varieties && item.varieties.length > 1
  const hasVarieties = item.varieties && item.varieties.length > 0
  const availableVarieties = item.varieties?.filter(v => v.isAvailable) || []

  // Get price range for multiple varieties
  const getPriceRange = () => {
    if (!item.varieties || item.varieties.length <= 1) return null
    
    const prices = item.varieties.map(v => v.price)
    const minPrice = Math.min(...prices)
    const maxPrice = Math.max(...prices)
    
    return minPrice === maxPrice 
      ? formatPriceInternal(minPrice)
      : `${formatPriceInternal(minPrice)} - ${formatPriceInternal(maxPrice)}`
  }

  const displayPrice = hasMultipleVarieties && !selectedVariety 
    ? getPriceRange() 
    : formatPriceInternal(getDisplayPrice())

  // Get the current variety for this item in cart
  const currentVariety = cartItem?.selectedVariety || selectedVariety

  const handleAddToCart = () => {
    if (!onQuantityChange) return
    
    if (hasVarieties && selectedVariety) {
      onQuantityChange(item, true, selectedVariety)
    } else {
      onQuantityChange(item, true)
    }
  }

  const handleQuantityChange = (increment: boolean) => {
    if (!onQuantityChange) return
    
    if (hasVarieties && currentVariety) {
      onQuantityChange(item, increment, currentVariety)
    } else {
      onQuantityChange(item, increment)
    }
  }

  const handleVarietySelect = (variety: MenuItemVariety) => {
    setSelectedVariety(variety)
  }

  const handleCardClick = () => {
    setIsModalOpen(true)
  }

  return (
    <>
      <div 
        className="group relative bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 flex flex-col h-full transform hover:-translate-y-1 cursor-pointer"
        onClick={handleCardClick}
      >
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
          
          <div className="mb-3">
            <p className="text-gray-600 text-sm">
              {truncateDescription(item.description || "")}
            </p>
            {item.description && item.description.length > 20 && (
              <button className="text-primary text-xs hover:underline mt-1">
                View details
              </button>
            )}
          </div>

          {/* Varieties Section */}
          {hasVarieties && (
            <div className="mt-3 border-t pt-3" onClick={(e) => e.stopPropagation()}>
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
                {availableVarieties.map((variety) => (
                  <button
                    key={variety.id}
                    onClick={() => handleVarietySelect(variety)}
                    className={cn(
                      "flex justify-between items-center p-2 rounded-md text-sm transition-all duration-200 w-full border-2",
                      selectedVariety?.id === variety.id 
                        ? "bg-primary/10 border-primary/20 shadow-sm" 
                        : "bg-gray-50 hover:bg-gray-100 border-transparent hover:border-gray-200"
                    )}
                  >
                    <div className="flex-1 text-left">
                      <div className="flex items-center gap-2">
                        <span className={cn(
                          "font-medium",
                          selectedVariety?.id === variety.id ? "text-primary" : "text-gray-900"
                        )}>
                          {variety.name}
                        </span>
                        {selectedVariety?.id === variety.id && (
                          <Check className="h-4 w-4 text-primary" />
                        )}
                        {variety.isDefault && selectedVariety?.id !== variety.id && (
                          <span className="bg-primary text-white text-xs px-1.5 py-0.5 rounded-full">
                            Default
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
                      selectedVariety?.id === variety.id ? "text-primary" : "text-gray-700"
                    )}>
                      {formatPriceInternal(variety.price)}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Cart Controls */}
          {onQuantityChange && (
            <div className="mt-4 pt-3 border-t" onClick={(e) => e.stopPropagation()}>
              {inCart ? (
                <div className="flex items-center justify-center gap-2 bg-gray-50 rounded-full border p-1">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 hover:bg-red-50 hover:text-red-600 rounded-full"
                    onClick={() => handleQuantityChange(false)}
                  >
                    <MinusCircle className="h-4 w-4" />
                  </Button>
                  <span className="w-8 text-center font-medium text-base px-2">
                    {quantity}
                  </span>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 hover:bg-green-50 hover:text-green-600 rounded-full"
                    onClick={() => handleQuantityChange(true)}
                  >
                    <PlusCircle className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={handleAddToCart}
                  disabled={hasVarieties && !selectedVariety}
                  className="w-full bg-primary hover:bg-primary/90 text-sm h-10 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm transition-all duration-200"
                >
                  {hasVarieties && !selectedVariety ? 'Select Size First' : 'Add to Cart'}
                </Button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      <MenuItemModal
        item={item}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        inCart={inCart}
        quantity={quantity}
        cartItem={cartItem}
        onQuantityChange={onQuantityChange}
        formatPrice={formatPrice}
      />
    </>
  )
}