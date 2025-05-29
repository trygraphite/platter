"use client";

import { useRestaurant } from "@/context/resturant-context";
import { Button } from "@platter/ui/components/button";
import { Checkbox } from "@platter/ui/components/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@platter/ui/components/dialog";
import { Label } from "@platter/ui/components/label";
import { Badge } from "@platter/ui/components/badge";
import type { Category, MenuItem, MenuItemVariety } from "@prisma/client";
import { Pencil, Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { useState, Suspense } from "react";
import Image from "next/image";
import { AddMenuItemModal } from "./AddMenuItemModal";
import { EditMenuItemModal } from "./EditMenuItemModal";
import { ImageLoadingPlaceholder, NoImagePlaceholder, OptimizedMenuItemImage } from "utils";

export interface MenuItemWithVarieties extends MenuItem {
  varieties?: MenuItemVariety[];
}

interface MenuItemsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  category: Category & { menuItems: MenuItemWithVarieties[] };
}


export function MenuItemsDialog({ isOpen, onClose, category }: MenuItemsDialogProps) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingMenuItem, setEditingMenuItem] = useState<MenuItemWithVarieties | null>(null);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  
  // console.log("MenuItemsDialog category", category);
  
  const { editMode, handleDeleteMenuItem, handleUpdateMenuItem } = useRestaurant();

  const toggleAvailability = async (item: MenuItemWithVarieties) => {
    const formData = new FormData();
    formData.append("name", item.name);
    formData.append("description", item.description || "");
    formData.append("price", item.price.toString());
    formData.append("isAvailable", (!item.isAvailable).toString());
    
    if (item.image) {
      formData.append("existingImage", item.image);
    }
    // Add existing varieties data
    if (item.varieties && item.varieties.length > 0) {
      formData.append("varietyCount", item.varieties.length.toString());
      item.varieties.forEach((variety, index) => {
        formData.append(`variety_${index}_id`, variety.id);
        formData.append(`variety_${index}_name`, variety.name);
        formData.append(`variety_${index}_description`, variety.description || "");
        formData.append(`variety_${index}_price`, variety.price.toString());
        formData.append(`variety_${index}_position`, variety.position.toString());
        formData.append(`variety_${index}_isAvailable`, variety.isAvailable.toString());
        formData.append(`variety_${index}_isDefault`, variety.isDefault.toString());
      });
    } else {
      formData.append("varietyCount", "0");
    }
    
    await handleUpdateMenuItem(item.id, formData);
  };

  const toggleItemExpansion = (itemId: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId);
    } else {
      newExpanded.add(itemId);
    }
    setExpandedItems(newExpanded);
  };

  const itemHasVarieties = (item: MenuItemWithVarieties) => {
    return item.varieties && item.varieties.length > 0;
  };

  const getDisplayPrice = (item: MenuItemWithVarieties) => {
    const formatPrice = (price: number) => {
      return `₦${price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
    };
  
    if (!itemHasVarieties(item)) {
      return formatPrice(item.price);
    }
  
    const prices = item.varieties!.map(v => v.price).sort((a, b) => a - b);
    if (prices.length === 0) {
      return formatPrice(0);
    }
    
    const minPrice = prices[0] ?? 0;
    const maxPrice = prices[prices.length - 1] ?? 0;
  
    if (minPrice === maxPrice) {
      return formatPrice(minPrice);
    }
  
    return `${formatPrice(minPrice)} - ${formatPrice(maxPrice)}`;
  };

  const getVarietyDisplayPrice = (variety: MenuItemVariety) => {
    return `₦${variety.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">{category.name} Menu Items</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6 my-4">
            {category.menuItems.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No menu items in this category
              </div>
            ) : (
              category.menuItems.map((item) => {
                const hasVarieties = itemHasVarieties(item);
                
                return (
                  <div 
                    key={item.id} 
                    className={`border rounded-lg ${!item.isAvailable ? 'bg-gray-50' : 'bg-white'}`}
                  >
                    {!item.isAvailable && (
                      <div className="text-red-500 font-medium mb-2 text-sm px-4 pt-2">Not Available</div>
                    )}
                    
                    {/* Main Item Display */}
                    <div className="p-4">
                      <div className="flex flex-col md:flex-row md:items-center gap-4">
                        {item.image ? (
                          <Suspense fallback={<ImageLoadingPlaceholder />}>
                            <OptimizedMenuItemImage 
                              src={item.image}
                              alt={item.name}
                              isAvailable={item.isAvailable}
                            />
                          </Suspense>
                        ) : (
                          <NoImagePlaceholder />
                        )}
                        
                        <div className="flex-grow">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className={`font-semibold text-lg ${!item.isAvailable ? 'text-gray-500' : ''}`}>
                                {item.name}
                              </h3>
                              <p className={`text-sm ${!item.isAvailable ? 'text-gray-400' : 'text-gray-600'}`}>
                                {item.description || "No description"}
                              </p>
                              
                              {/* Varieties Count and Expand Button */}
                              {hasVarieties && (
                                <div className="flex items-center gap-2 mt-2">
                                  <Badge variant="secondary">
                                    {item.varieties!.length} varieties
                                  </Badge>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => toggleItemExpansion(item.id)}
                                    className="p-1 h-6"
                                  >
                                    {expandedItems.has(item.id) ? (
                                      <ChevronUp className="w-4 h-4" />
                                    ) : (
                                      <ChevronDown className="w-4 h-4" />
                                    )}
                                  </Button>
                                </div>
                              )}
                            </div>
                            
                            <div className="flex flex-col items-end">
                              <span className={`font-bold text-lg ${!item.isAvailable ? 'text-gray-500' : ''}`}>
                                {getDisplayPrice(item)}
                              </span>
                              {editMode && (
                                <div className="flex space-x-2 mt-2">
                                  <div className="flex items-center space-x-2 mr-2">
                                    <Checkbox 
                                      id={`available-dialog-${item.id}`}
                                      checked={item.isAvailable}
                                      onCheckedChange={() => toggleAvailability(item)}
                                    />
                                    <Label 
                                      htmlFor={`available-dialog-${item.id}`}
                                      className="text-sm"
                                    >
                                      Available
                                    </Label>
                                  </div>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setEditingMenuItem(item)}
                                  >
                                    <Pencil className="w-4 h-4 mr-2" />
                                    Edit
                                  </Button>
                                  <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => handleDeleteMenuItem(item.id)}
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Expanded Varieties View */}
                    {expandedItems.has(item.id) && hasVarieties && (
                      <div className="border-t bg-gray-50 p-4">
                        <h4 className="font-medium mb-3 text-gray-700">Available Varieties:</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {item.varieties!
                            .sort((a, b) => a.position - b.position)
                            .map((variety) => (
                              <div 
                                key={variety.id} 
                                className={`p-3 rounded-lg border ${
                                  variety.isAvailable ? 'bg-white border-gray-200' : 'bg-gray-100 border-gray-300'
                                }`}
                              >
                                <div className="flex items-start justify-between">
                                  <div>
                                    <div className="flex items-center gap-2">
                                      <span className={`font-medium ${!variety.isAvailable ? 'text-gray-500' : ''}`}>
                                        {variety.name}
                                      </span>
                                      {variety.isDefault && (
                                        <Badge variant="outline" className="text-xs">Default</Badge>
                                      )}
                                      {!variety.isAvailable && (
                                        <Badge variant="destructive" className="text-xs">Unavailable</Badge>
                                      )}
                                    </div>
                                    {variety.description && (
                                      <p className={`text-sm mt-1 ${!variety.isAvailable ? 'text-gray-400' : 'text-gray-600'}`}>
                                        {variety.description}
                                      </p>
                                    )}
                                  </div>
                                  <span className={`font-semibold ${!variety.isAvailable ? 'text-gray-500' : 'text-green-600'}`}>
                                    {getVarietyDisplayPrice(variety)}
                                  </span>
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
          
          <div className="flex justify-between mt-4">
            <Button onClick={() => setIsAddModalOpen(true)} className="flex items-center">
              <Plus className="w-4 h-4 mr-2" />
              Add Menu Item
            </Button>
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <AddMenuItemModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        categoryId={category.id}
      />
      
      {editingMenuItem && (
        <EditMenuItemModal
          isOpen={!!editingMenuItem}
          onClose={() => setEditingMenuItem(null)}
          menuItem={editingMenuItem}
        />
      )}
    </>
  );
}