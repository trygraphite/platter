import Image from "next/image"
import { useState } from "react"
import { cn } from "@platter/ui/lib/utils"
import { X, MinusCircle, PlusCircle, Check } from "@platter/ui/lib/icons"
import { Button } from "@platter/ui/components/button"
import type { MenuItem, MenuItemVariety, CartItem } from "@/types/menu"

interface MenuItemModalProps {
  item: MenuItem
  isOpen: boolean
  onClose: () => void
  inCart?: boolean
  quantity?: number
  cartItem?: CartItem
  onQuantityChange?: (item: MenuItem, increment: boolean, variety?: MenuItemVariety) => void
  formatPrice: (price: number | string | null | undefined) => string
}

export function MenuItemModal({
  item,
  isOpen,
  onClose,
  inCart = false,
  quantity = 0,
  cartItem,
  onQuantityChange,
  formatPrice
}: MenuItemModalProps) {
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

  if (!isOpen) return null

  // Format price to Naira with comma after every 3 zeros
  const formatPriceInternal = (price: number) => formatPrice(price)

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

  // Check if item has varieties
  const hasVarieties = item.varieties && item.varieties.length > 0
  const availableVarieties = item.varieties?.filter(v => v.isAvailable) || []

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

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">{item.name}</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8 hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Image */}
          {item.image && (
            <div className="relative h-64 w-full overflow-hidden rounded-lg mb-6">
              <Image
                src={item.image || "/placeholder.svg"}
                alt={item.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          )}

          {/* Price */}
          <div className="mb-4">
            <span className="text-2xl font-bold text-primary">
              {formatPriceInternal(getDisplayPrice())}
            </span>
          </div>

          {/* Full Description */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
            <p className="text-gray-600 leading-relaxed">
              {item.description || "No description available."}
            </p>
          </div>

          {/* Varieties Section */}
          {hasVarieties && (
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">Available Sizes</h3>
              <div className="space-y-2">
                {availableVarieties.map((variety) => (
                  <button
                    key={variety.id}
                    onClick={() => handleVarietySelect(variety)}
                    className={cn(
                      "flex justify-between items-center p-3 rounded-lg text-sm transition-all duration-200 w-full border-2",
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
                          <span className="bg-primary text-white text-xs px-2 py-1 rounded-full">
                            Default
                          </span>
                        )}
                      </div>
                      {variety.description && (
                        <p className="text-gray-600 text-sm mt-1">
                          {variety.description}
                        </p>
                      )}
                    </div>
                    <span className={cn(
                      "font-semibold whitespace-nowrap ml-3",
                      selectedVariety?.id === variety.id ? "text-primary" : "text-gray-700"
                    )}>
                      {formatPriceInternal(variety.price)}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer - Cart Controls */}
        {onQuantityChange && (
          <div className="sticky bottom-0 bg-white border-t px-6 py-4">
            {inCart ? (
              <div className="flex items-center justify-center gap-3 bg-gray-50 rounded-full border p-2">
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-10 w-10 hover:bg-red-50 hover:text-red-600 rounded-full"
                  onClick={() => handleQuantityChange(false)}
                >
                  <MinusCircle className="h-5 w-5" />
                </Button>
                <span className="w-12 text-center font-semibold text-lg px-3">
                  {quantity}
                </span>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-10 w-10 hover:bg-green-50 hover:text-green-600 rounded-full"
                  onClick={() => handleQuantityChange(true)}
                >
                  <PlusCircle className="h-5 w-5" />
                </Button>
              </div>
            ) : (
              <Button
                onClick={handleAddToCart}
                disabled={hasVarieties && !selectedVariety}
                className="w-full bg-primary hover:bg-primary/90 text-base h-12 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm transition-all duration-200"
              >
                {hasVarieties && !selectedVariety ? 'Select Size First' : 'Add to Cart'}
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}