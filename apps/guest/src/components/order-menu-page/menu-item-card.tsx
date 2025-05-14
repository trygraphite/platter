"use client"

import { Card } from "@platter/ui/components/card"
import { Button } from "@platter/ui/components/button"
import { MinusCircle, PlusCircle } from "@platter/ui/lib/icons"
import Image from "next/image"
import type { MenuItem } from "@/types/menu"

interface MenuItemCardProps {
  item: MenuItem
  inCart: boolean
  quantity: number
  onQuantityChange: (item: MenuItem, increment: boolean) => void
  formatPrice: (price: number | string | null | undefined) => string
}

export function MenuItemCard({ item, inCart, quantity, onQuantityChange, formatPrice }: MenuItemCardProps) {
    return (
      <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 group">
        <div className="flex flex-row p-3 md:p-4">
          <div className="flex-1 pr-3 md:pr-4 space-y-1 md:space-y-2">
            <h3 className="text-base md:text-lg font-semibold group-hover:text-primary transition-colors line-clamp-1">
              {item.name}
            </h3>
            <p className="text-muted-foreground text-xs md:text-sm line-clamp-2 md:line-clamp-3">{item.description}</p>
            <span className="text-base md:text-lg font-bold text-primary">₦{formatPrice(Number(item.price))}</span>
          </div>
          <div className="flex flex-col items-end justify-between">
            {item.image && (
              <div className="relative w-[80px] h-[60px] md:w-[120px] md:h-[90px] mb-2 md:mb-3 overflow-hidden rounded-md">
                <Image
                  src={item.image || "/placeholder.svg"}
                  alt={item.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            )}
  
            {inCart ? (
              <div className="flex items-center gap-1 md:gap-2">
                <Button
                  size="icon"
                  variant="outline"
                  className="h-7 w-7 md:h-8 md:w-8"
                  onClick={() => onQuantityChange(item, false)}
                >
                  <MinusCircle className="h-3 w-3 md:h-4 md:w-4" />
                </Button>
                <span className="w-6 md:w-8 text-center font-medium text-sm md:text-base">{quantity}</span>
                <Button
                  size="icon"
                  variant="outline"
                  className="h-7 w-7 md:h-8 md:w-8"
                  onClick={() => onQuantityChange(item, true)}
                >
                  <PlusCircle className="h-3 w-3 md:h-4 md:w-4" />
                </Button>
              </div>
            ) : (
              <Button
                onClick={() => onQuantityChange(item, true)}
                className="bg-primary hover:bg-primary/90 text-xs md:text-sm h-8 md:h-10"
              >
                Add to Cart
              </Button>
            )}
          </div>
        </div>
      </Card>
    )
  }