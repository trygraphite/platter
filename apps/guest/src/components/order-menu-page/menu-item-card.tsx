"use client"

import { Card } from "@platter/ui/components/card"
import { Button } from "@platter/ui/components/button"
import { MinusCircle, PlusCircle, Check } from "@platter/ui/lib/icons"
import Image from "next/image"
import { useState } from "react"
import type { MenuItem, MenuItemVariety, CartItem } from "@/types/menu"

interface MenuItemCardProps {
  item: MenuItem
  inCart: boolean
  quantity: number
  cartItem?: CartItem // Full cart item to check selected variety
  onQuantityChange: (item: MenuItem, increment: boolean, variety?: MenuItemVariety) => void
  formatPrice: (price: number | string | null | undefined) => string
}

export function MenuItemCard({ 
  item, 
  inCart, 
  quantity, 
  cartItem,
  onQuantityChange, 
  formatPrice 
}: MenuItemCardProps) {
  const [showVarieties, setShowVarieties] = useState(false)
  console.log(item)
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

  const hasVarieties = item.varieties && item.varieties.length > 0
  const availableVarieties = item.varieties?.filter(v => v.isAvailable) || []
  
  // Get the price to display (variety price or base item price)
  const displayPrice = selectedVariety ? selectedVariety.price : item.price
  
  // Get the current variety for this item in cart
  const currentVariety = cartItem?.selectedVariety || selectedVariety

  const handleAddToCart = () => {
    if (hasVarieties && selectedVariety) {
      onQuantityChange(item, true, selectedVariety)
    } else {
      onQuantityChange(item, true)
    }
  }

  const handleQuantityChange = (increment: boolean) => {
    if (hasVarieties && currentVariety) {
      onQuantityChange(item, increment, currentVariety)
    } else {
      onQuantityChange(item, increment)
    }
  }

  const handleVarietySelect = (variety: MenuItemVariety) => {
    setSelectedVariety(variety)
    setShowVarieties(false)
  }

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 group">
      <div className="flex flex-row p-3 md:p-4">
        <div className="flex-1 pr-3 md:pr-4 space-y-2 md:space-y-3">
          <h3 className="text-base md:text-lg font-semibold group-hover:text-primary transition-colors line-clamp-1">
            {item.name}
          </h3>
          <p className="text-muted-foreground text-xs md:text-sm line-clamp-2 md:line-clamp-3">
            {item.description}
          </p>
          
          {/* Varieties Selector - Improved Design */}
          {hasVarieties && availableVarieties.length > 0 && (
            <div className="space-y-2">
              {availableVarieties.length === 1 ? (
                // Single variety - show as badge
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                  <span>{availableVarieties[0]?.name}</span>
                  {availableVarieties[0]?.description && (
                    <span className="ml-1 text-muted-foreground">• {availableVarieties[0].description}</span>
                  )}
                </div>
              ) : (
                // Multiple varieties - show as selection
                <div className="space-y-2">
                  <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Choose Size
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                    {availableVarieties.map((variety) => (
                      <button
                        key={variety.id}
                        onClick={() => handleVarietySelect(variety)}
                        className={`flex items-center justify-between p-3 rounded-lg border-2 transition-all duration-200 text-left ${
                          selectedVariety?.id === variety.id 
                            ? 'border-primary bg-primary/5 shadow-sm' 
                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className={`font-medium text-sm ${
                              selectedVariety?.id === variety.id ? 'text-primary' : 'text-gray-900'
                            }`}>
                              {variety.name}
                            </span>
                            {selectedVariety?.id === variety.id && (
                              <Check className="h-4 w-4 text-primary" />
                            )}
                          </div>
                          {variety.description && (
                            <div className="text-xs text-muted-foreground mt-0.5">
                              {variety.description}
                            </div>
                          )}
                        </div>
                        <span className={`font-semibold text-sm ${
                          selectedVariety?.id === variety.id ? 'text-primary' : 'text-gray-900'
                        }`}>
                          ₦{formatPrice(variety.price)}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
          
          <div className="flex items-center justify-between">
            <span className="text-lg md:text-xl font-bold text-primary">
              ₦{formatPrice(displayPrice)}
            </span>
            {selectedVariety && availableVarieties.length > 1 && (
              <span className="text-xs text-muted-foreground bg-gray-100 px-2 py-1 rounded-full">
                {selectedVariety.name}
              </span>
            )}
          </div>
        </div>
        
        <div className="flex flex-col items-end justify-between">
          {item.image && (
            <div className="relative w-[80px] h-[60px] md:w-[120px] md:h-[90px] mb-2 md:mb-3 overflow-hidden rounded-lg">
              <Image
                src={item.image || "/placeholder.svg"}
                alt={item.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
          )}

          {inCart ? (
            <div className="flex items-center gap-1 md:gap-2 bg-white rounded-full border shadow-sm px-1">
              <Button
                size="icon"
                variant="ghost"
                className="h-7 w-7 md:h-8 md:w-8 hover:bg-red-50 hover:text-red-600"
                onClick={() => handleQuantityChange(false)}
              >
                <MinusCircle className="h-3 w-3 md:h-4 md:w-4" />
              </Button>
              <span className="w-6 md:w-8 text-center font-medium text-sm md:text-base px-2">
                {quantity}
              </span>
              <Button
                size="icon"
                variant="ghost"
                className="h-7 w-7 md:h-8 md:w-8 hover:bg-green-50 hover:text-green-600"
                onClick={() => handleQuantityChange(true)}
              >
                <PlusCircle className="h-3 w-3 md:h-4 md:w-4" />
              </Button>
            </div>
          ) : (
            <Button
              onClick={handleAddToCart}
              disabled={hasVarieties && !selectedVariety}
              className="bg-primary hover:bg-primary/90 text-xs md:text-sm h-8 md:h-10 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            >
              {hasVarieties && !selectedVariety ? 'Select Size' : 'Add to Cart'}
            </Button>
          )}
        </div>
      </div>
    </Card>
  )
}