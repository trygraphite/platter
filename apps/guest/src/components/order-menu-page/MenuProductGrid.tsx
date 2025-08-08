import { formatNaira } from "@/utils";
import { Button } from "@platter/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@platter/ui/components/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@platter/ui/components/drawer";
import { useIsMobile } from "@platter/ui/hooks/use-mobile";
import Image from "next/image";
import type React from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import ProductGrid from "./comps/ProductGrid";
import VarietyRadioGroup from "./comps/VarietyRadioGroup";

// Extend Variety type locally to include optional weight
type VarietyWithWeight = {
  _id: string;
  name: string;
  price: number;
  outOfStock?: boolean;
  weight?: string;
  description?: string;
};

interface MenuProductGridProps {
  menuItems: any[];
  categories: string[];
  activeCategory: string;
  setActiveCategory: (cat: string) => void;
  openModalWithProduct: (product: any) => void;
  modalIsOpen: boolean;
  closeModal: () => void;
  selectedProduct: any;
  handleCartQuantityChange: (
    product: any,
    increment: boolean,
    varietyId?: string,
  ) => void;
  isLoading?: boolean;
}

const MenuProductGrid: React.FC<MenuProductGridProps> = ({
  menuItems,
  categories,
  activeCategory,
  setActiveCategory,
  openModalWithProduct,
  modalIsOpen,
  closeModal,
  selectedProduct,
  handleCartQuantityChange,
  isLoading = false,
}) => {
  const [scrollActiveCategory, setScrollActiveCategory] =
    useState(activeCategory);
  const [scrolled, setScrolled] = useState(false);
  const categoryRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const isMobile = useIsMobile();
  const isDesktop = !isMobile;

  // Use useMemo to build filteredProductsByCategory at the top level
  const filteredProductsByCategory = useMemo(() => {
    const result: Record<string, any[]> = {};
    for (const category of categories) {
      result[category] = menuItems.filter(
        (item) => item.category?.name === category,
      );
    }
    return result;
  }, [categories, menuItems]);

  // Handle scroll to detect active category
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100; // Offset for header
      setScrolled(window.scrollY > 2);
      let currentActive = categories[0];
      for (const category of categories) {
        const element = categoryRefs.current[category];
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (
            scrollPosition >= offsetTop &&
            scrollPosition < offsetTop + offsetHeight
          ) {
            currentActive = category;
            break;
          }
        }
      }
      if (currentActive !== scrollActiveCategory) {
        setScrollActiveCategory(currentActive);
        setActiveCategory(currentActive);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [categories, scrollActiveCategory, setActiveCategory]);

  const scrollToCategory = (category: string) => {
    const element = categoryRefs.current[category];
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
      setScrollActiveCategory(category);
      setActiveCategory(category);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex gap-2 py-2 overflow-x-auto">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="h-10 w-24 bg-gray-200 rounded-lg animate-pulse"
            />
          ))}
        </div>
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="space-y-4">
              <div className="h-8 w-32 bg-gray-200 rounded animate-pulse" />
              <div className="grid grid-cols-2 gap-4">
                {Array.from({ length: 6 }).map((_, itemIndex) => (
                  <div
                    key={itemIndex}
                    className="h-48 bg-gray-200 rounded-lg animate-pulse"
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Fixed Category Navigation */}
      <div
        className={`sticky top-0 z-10 bg-background transition-all animate-in fade-in duration-700 ${
          scrolled ? "border-b shadow-sm" : ""
        }`}
      >
        <div className="flex gap-2 py-2 overflow-x-auto">
          {categories.map((category, index) => (
            <Button
              key={category}
              variant={
                scrollActiveCategory === category ? "default" : "outline"
              }
              size="lg"
              onClick={() => scrollToCategory(category)}
              className="whitespace-nowrap flex-shrink-0 text-xl rounded-2xl transition-all duration-200 hover:scale-105 active:scale-95"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* Category Sections */}
      <div className="space-y-8 mt-4">
        {categories.map((category, categoryIndex) => (
          <div
            key={category}
            ref={(el) => {
              categoryRefs.current[category] = el;
            }}
            id={`category-${category}`}
            className="scroll-mt-16 animate-in fade-in duration-700"
            style={{ animationDelay: `${categoryIndex * 0.2}s` }}
          >
            <ProductGrid
              category={category}
              products={filteredProductsByCategory[category]}
              onProductClick={openModalWithProduct}
              handleCartQuantityChange={handleCartQuantityChange}
              isLoading={isLoading}
            />
          </div>
        ))}
      </div>

      {/* Responsive Modal/Drawer for product details */}
      {isDesktop ? (
        <Dialog
          open={modalIsOpen}
          onOpenChange={(open) => {
            if (!open) closeModal();
          }}
        >
          <DialogContent className="w-[95vw] max-w-md md:max-w-2xl p-0 overflow-hidden max-h-[90vh] animate-in zoom-in duration-300">
            <DialogTitle className="sr-only">Product Details</DialogTitle>
            {selectedProduct && (
              <div className="flex flex-col md:flex-row h-full max-h-[90vh] overflow-hidden">
                <div className="w-full md:w-1/2 flex items-center justify-center p-4 md:p-6 bg-gray-50 flex-shrink-0">
                  <Image
                    src={selectedProduct.image || "/file.svg"}
                    alt={selectedProduct.name}
                    width={320}
                    height={224}
                    className="rounded-2xl w-full h-40 md:h-64 object-cover"
                  />
                </div>
                <div className="w-full md:w-1/2 p-4 md:p-6 flex flex-col overflow-y-auto">
                  <h2 className="text-xl md:text-2xl font-bold mb-2 md:mb-4 mt-2 md:mt-0 pr-8">
                    {selectedProduct.name}
                  </h2>
                  {selectedProduct.description && (
                    <p className="text-gray-600 text-sm mb-4">
                      {selectedProduct.description}
                    </p>
                  )}
                  {selectedProduct.varieties &&
                  selectedProduct.varieties.length > 0 ? (
                    <VarietyRadioGroup
                      varieties={
                        selectedProduct.varieties as VarietyWithWeight[]
                      }
                      product={selectedProduct}
                      addToCart={handleCartQuantityChange}
                      closeModal={closeModal}
                    />
                  ) : (
                    <div className="flex flex-col gap-4 flex-1">
                      <p className="text-gray-600 mb-4">
                        No varieties available for this product.
                      </p>
                      <Button
                        className="w-full rounded-xl py-6 text-lg font-semibold mt-auto bg-orange-500 hover:bg-orange-600 text-white"
                        onClick={() => {
                          handleCartQuantityChange(selectedProduct, true);
                          closeModal();
                        }}
                        disabled={selectedProduct.outOfStock}
                      >
                        {selectedProduct.outOfStock
                          ? "Out of Stock"
                          : `Add for ${formatNaira(selectedProduct.price)}`}
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      ) : (
        <Drawer
          open={modalIsOpen}
          onOpenChange={(open) => {
            if (!open) closeModal();
          }}
        >
          <DrawerContent className="h-[90vh] max-h-[95vh] w-full flex flex-col">
            {selectedProduct && (
              <>
                <DrawerHeader className="pb-2">
                  <DrawerTitle className="text-xl font-bold">
                    {selectedProduct.name}
                  </DrawerTitle>
                </DrawerHeader>
                <div className="flex flex-col w-full px-0 overflow-y-auto max-h-[calc(95vh-56px)] mb-6">
                  <Image
                    src={selectedProduct.image || "/file.svg"}
                    alt={selectedProduct.name}
                    width={320}
                    height={224}
                    className="rounded-2xl w-full h-60 sm:h-72 object-cover mb-2"
                  />
                  <div className="w-full px-4">
                    {selectedProduct.description && (
                      <p className="text-gray-600 text-md mb-4 w-full">
                        {selectedProduct.description}
                      </p>
                    )}
                    {selectedProduct.varieties &&
                    selectedProduct.varieties.length > 0 ? (
                      <div className="w-full">
                        <VarietyRadioGroup
                          varieties={
                            selectedProduct.varieties as VarietyWithWeight[]
                          }
                          product={selectedProduct}
                          addToCart={handleCartQuantityChange}
                          closeModal={closeModal}
                        />
                      </div>
                    ) : (
                      <div className="flex flex-col gap-4 flex-1 w-full">
                        <p className="text-gray-600 mb-4">
                          {selectedProduct.name}
                        </p>
                        <Button
                          className="w-full rounded-xl py-4 text-lg font-semibold mt-auto bg-orange-500 hover:bg-orange-600 text-white"
                          onClick={() => {
                            handleCartQuantityChange(selectedProduct, true);
                            closeModal();
                          }}
                          disabled={selectedProduct.outOfStock}
                        >
                          {selectedProduct.outOfStock
                            ? "Out of Stock"
                            : `Add for ${formatNaira(selectedProduct.price)}`}
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </DrawerContent>
        </Drawer>
      )}
    </>
  );
};

export default MenuProductGrid;
