"use client"

import { Button } from "@platter/ui/components/button"
import { MinusCircle, PlusCircle, Trash2 } from "@platter/ui/lib/icons"
import Image from "next/image"
import type { CartItem as CartItemType, MenuItem } from "@/types/menu"

interface CartItemProps {
  item: CartItemType
  formatPrice: (price: number | string | null | undefined) => string
  onQuantityChange: (item: MenuItem, increment: boolean) => void
}

export function CartItem({ item, formatPrice, onQuantityChange }: CartItemProps) {
  return (
    <div className="flex items-start gap-2 md:gap-3 p-2 rounded-md hover:bg-gray-50 transition-colors">
      {item.image && (
        <div className="relative w-14 h-14 md:w-16 md:h-16 rounded-md overflow-hidden flex-shrink-0">
          <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
        </div>
      )}

      <div className="flex-1 min-w-0">
        <p className="font-medium text-gray-800 truncate text-sm md:text-base">{item.name}</p>
        <p className="text-xs md:text-sm text-muted-foreground">
          ₦{formatPrice(Number(item.price))} × {item.quantity}
        </p>

        <div className="flex items-center gap-1 mt-1">
          <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => onQuantityChange(item, false)}>
            {item.quantity === 1 ? <Trash2 className="h-3 w-3 text-red-500" /> : <MinusCircle className="h-3 w-3" />}
          </Button>
          <span className="w-6 text-center text-xs md:text-sm">{item.quantity}</span>
          <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => onQuantityChange(item, true)}>
            <PlusCircle className="h-3 w-3" />
          </Button>
        </div>
      </div>

      <p className="font-semibold text-right text-sm md:text-base">
        ₦{formatPrice(Number(item.price) * item.quantity)}
      </p>
    </div>
  )
}
