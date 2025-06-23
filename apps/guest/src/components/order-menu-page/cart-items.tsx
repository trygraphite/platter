"use client"

import { Button } from "@platter/ui/components/button"
import { MinusCircle, PlusCircle, Trash2 } from "@platter/ui/lib/icons"
import Image from "next/image"
import type { CartItem as CartItemType, MenuItem, MenuItemVariety } from "@/types/menu"

interface CartItemProps {
  item: CartItemType
  formatPrice: (price: number | string | null | undefined) => string
  onQuantityChange: (item: MenuItem, increment: boolean, variety?: MenuItemVariety) => void
}

export const CartItem: React.FC<CartItemProps> = ({ item, formatPrice, onQuantityChange }) => {
  const handleQuantityChange = (increment: boolean) => {
    // Pass the selected variety if it exists
    if (item.selectedVariety) {
      onQuantityChange(item, increment, item.selectedVariety)
    } else {
      onQuantityChange(item, increment)
    }
  }

  // Calculate the actual price (variety price or base price)
  const actualPrice = item.selectedVariety ? item.selectedVariety.price : item.price
  const totalPrice = Number(actualPrice) * item.quantity

  return (
    <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0">
      {item.image && (
        <div className="relative w-14 h-14 md:w-16 md:h-16 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
          <Image 
            src={item.image || "/placeholder.svg"} 
            alt={item.name} 
            fill 
            className="object-cover" 
          />
        </div>
      )}

      <div className="flex-1 min-w-0 space-y-1">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-gray-900 truncate text-sm md:text-base">
              {item.name}
            </h4>
            
            {/* Show selected variety if exists */}
            {item.selectedVariety && (
              <div className="flex items-center gap-1 mt-1">
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                  {item.selectedVariety.name}
                </span>
                {item.selectedVariety.description && (
                  <span className="text-xs text-muted-foreground">
                    • {item.selectedVariety.description}
                  </span>
                )}
              </div>
            )}
            
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs md:text-sm text-muted-foreground">
                ₦{formatPrice(actualPrice)} × {item.quantity}
              </span>
            </div>
          </div>
          
          <div className="text-right ml-2">
            <p className="font-semibold text-sm md:text-base text-gray-900">
              ₦{formatPrice(totalPrice)}
            </p>
          </div>
        </div>

        {/* Quantity Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 bg-white rounded-full border shadow-sm px-1">
            <Button 
              size="icon" 
              variant="ghost" 
              className="h-6 w-6 hover:bg-red-50 hover:text-red-600 transition-colors" 
              onClick={() => handleQuantityChange(false)}
            >
              {item.quantity === 1 ? (
                <Trash2 className="h-3 w-3" />
              ) : (
                <MinusCircle className="h-3 w-3" />
              )}
            </Button>
            
            <span className="w-8 text-center text-xs md:text-sm font-medium px-1">
              {item.quantity}
            </span>
            
            <Button 
              size="icon" 
              variant="ghost" 
              className="h-6 w-6 hover:bg-green-50 hover:text-green-600 transition-colors" 
              onClick={() => handleQuantityChange(true)}
            >
              <PlusCircle className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}