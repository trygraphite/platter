"use client";

import { Badge } from "@platter/ui/components/badge";

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  category: string;
  popular?: boolean;
  varieties?: Array<{
    id: string;
    name: string;
    price: number;
  }>;
}

interface MenuItemDetailsModalProps {
  open: boolean;
  onClose: () => void;
  item: MenuItem | null;
  isDesktop: boolean;
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

export const MenuItemDetailsModal = ({
  open,
  onClose,
  item,
  isDesktop,
}: MenuItemDetailsModalProps) => {
  if (!item || !open) return null;

  const content = (
    <div className="flex flex-col md:flex-row h-full max-h-[90vh] overflow-hidden">
      {item.image && (
        <div className="w-full md:w-1/2 flex items-center justify-center p-4 md:p-6 bg-gray-50 flex-shrink-0">
          <img
            src={item.image}
            alt={item.name}
            className="rounded-2xl w-full h-40 md:h-64 object-cover"
          />
        </div>
      )}
      <div className="w-full md:w-1/2 p-4 md:p-6 flex flex-col overflow-y-auto">
        <h2 className="text-xl md:text-2xl font-bold mb-2 md:mb-4 mt-2 md:mt-0 pr-8">
          {item.name}
        </h2>
        {item.description && (
          <p className="text-muted-foreground text-sm mb-4">
            {item.description}
          </p>
        )}
        <div className="mb-4">
          <span className="font-bold text-primary text-lg">
            {formatPrice(item.price)}
          </span>
        </div>
        {item.varieties && item.varieties.length > 1 && (
          <div className="mb-4">
            <p className="text-xs text-muted-foreground mb-2">Available in:</p>
            <div className="flex flex-wrap gap-2">
              {item.varieties.slice(1).map((variety) => (
                <Badge key={variety.id} variant="outline" className="text-xs">
                  {variety.name} - {formatPrice(variety.price)}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  if (isDesktop) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg w-[95vw] max-w-md md:max-w-2xl p-0 overflow-hidden max-h-[90vh]">
          <div className="flex justify-between items-center p-4 border-b">
            <h3 className="text-lg font-semibold">Menu Item Details</h3>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
          {content}
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end z-50">
      <div className="bg-white rounded-t-lg w-full h-[95vh] max-h-[95vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-xl font-bold">{item.name}</h3>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        <div className="flex flex-col w-full px-0 overflow-y-auto max-h-[calc(95vh-56px)] mb-6">
          {content}
        </div>
      </div>
    </div>
  );
};
