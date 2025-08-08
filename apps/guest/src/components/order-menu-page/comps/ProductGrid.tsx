import type React from "react";
import ProductCard from "./ProductCard";

interface ProductGridProps {
  category: string;
  products: any[];
  onProductClick: (product: any) => void;
  handleCartQuantityChange: (
    product: any,
    increment: boolean,
    varietyId?: string,
  ) => void;
  isLoading?: boolean;
}

const ProductGrid: React.FC<ProductGridProps> = ({
  category,
  products,
  onProductClick,
  handleCartQuantityChange,
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-32 bg-gray-200 rounded animate-pulse" />
        <div className="grid grid-cols-2 gap-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="h-48 bg-gray-200 rounded-lg animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-700">
      <h2 className="text-2xl font-bold mb-4 capitalize animate-in slide-in-from-bottom-4 duration-500">
        {category}
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product: any, index: number) => (
          <div
            key={product._id}
            className="animate-in fade-in duration-500"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <ProductCard
              product={product}
              onClick={() => onProductClick(product)}
              handleCartQuantityChange={handleCartQuantityChange}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductGrid;
