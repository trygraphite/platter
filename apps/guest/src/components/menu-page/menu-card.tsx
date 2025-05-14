import Image from "next/image"
import { cn } from "@platter/ui/lib/utils"

interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  image: string | null
}

interface MenuCardProps {
  item: MenuItem
}

export function MenuCard({ item }: MenuCardProps) {
  // Format price to Naira with comma after every 3 zeros
  const formattedPrice = `₦${(item.price).toLocaleString('en-NG')}`

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
        </div>
      )}
      <div className={cn("flex-1 p-4", !item.image && "border-t-4 border-primary/20")}>
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-gray-800 group-hover:text-primary transition-colors duration-300">
            {item.name}
          </h3>
          <span className="font-semibold text-primary whitespace-nowrap ml-2">{formattedPrice}</span>
        </div>
        <p className="text-gray-600 text-sm line-clamp-3">{item.description}</p>
      </div>
    </div>
  )
}