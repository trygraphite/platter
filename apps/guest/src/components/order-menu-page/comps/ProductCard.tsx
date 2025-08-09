import { Button } from "@platter/ui/components/button";
import { ChevronRight } from "@platter/ui/lib/icons";
import Image from "next/image";
import type React from "react";
import { formatNaira } from "@/utils";

interface ProductCardProps {
  product: any;
  onClick: () => void;
  handleCartQuantityChange: (
    product: any,
    increment: boolean,
    varietyId?: string,
  ) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onClick,
  handleCartQuantityChange,
}) => {
  const hasMultipleVarieties =
    product.varieties && product.varieties.length > 1;

  const handleButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hasMultipleVarieties) {
      onClick(); // Open modal for multiple varieties
    } else {
      // Add single variety or base product directly
      const varietyId =
        product.varieties && product.varieties.length === 1
          ? product.varieties[0]._id
          : undefined;
      handleCartQuantityChange(product, true, varietyId);
    }
  };

  const handleCardClick = (e: React.MouseEvent) => {
    if (!(e.target as HTMLElement).closest("button")) {
      onClick();
    }
  };

  return (
    <div
      className="overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer border rounded-xl bg-gradient-to-br from-white to-orange-100 hover:scale-105 active:scale-95"
      onClick={handleCardClick}
    >
      <div className="relative">
        {product.image && (
          <Image
            src={product.image}
            alt={product.name}
            width={400}
            height={200}
            className="w-full h-32 sm:h-40 md:h-60 object-cover transition-transform duration-300 hover:scale-105"
          />
        )}
        {product.outOfStock && (
          <span className="absolute top-3 left-3 bg-gray-200 px-2 py-1 rounded text-xs">
            Out of stock
          </span>
        )}
      </div>
      <div className="p-2 sm:p-2 md:p-3">
        <div className="flex items-start justify-between mb-0.5 sm:mb-1">
          <div className="flex-1">
            <div className="font-bold text-base sm:text-lg mb-0.5">
              {product.varieties && product.varieties.length > 1 ? "from " : ""}
              {formatNaira(product.price)}
            </div>
            <h3 className="font-medium text-sm sm:text-base mb-0.5">
              {product.name}
            </h3>
          </div>
        </div>
        <div className="flex items-center justify-between mt-1 sm:mt-2">
          <div />
          <Button
            size="sm"
            className={`rounded-full w-8 h-8 p-0 transition-all duration-200 hover:scale-110 active:scale-95 ${product.outOfStock ? "bg-gray-400 cursor-not-allowed" : "hover:shadow-md"}`}
            onClick={handleButtonClick}
            disabled={product.outOfStock}
            aria-label={
              product.outOfStock
                ? "Out of stock"
                : hasMultipleVarieties
                  ? `Select ${product.name} options`
                  : `Add ${product.name} to cart`
            }
          >
            {hasMultipleVarieties ? <ChevronRight className="w-4 h-4" /> : "+"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
