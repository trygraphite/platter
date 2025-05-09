"use client";

import { useRestaurant } from "@/context/resturant-context";
import { Button } from "@platter/ui/components/button";
import { Checkbox } from "@platter/ui/components/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@platter/ui/components/dialog";
import { Label } from "@platter/ui/components/label";
import type { Category, MenuItem } from "@prisma/client";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { AddMenuItemModal } from "./AddMenuItemModal";
import { EditMenuItemModal } from "./EditMenuItemModal";

interface MenuItemsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  category: Category & { menuItems: MenuItem[] };
}

export function MenuItemsDialog({ isOpen, onClose, category }: MenuItemsDialogProps) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingMenuItem, setEditingMenuItem] = useState<MenuItem | null>(null);
  
  const { editMode, handleDeleteMenuItem, handleUpdateMenuItem } = useRestaurant();

  const toggleAvailability = async (item: MenuItem) => {
    const formData = new FormData();
    formData.append("name", item.name);
    formData.append("description", item.description || "");
    formData.append("price", item.price.toString());
    formData.append("isAvailable", (!item.isAvailable).toString());
    
    if (item.image) {
      formData.append("existingImage", item.image);
    }
    
    await handleUpdateMenuItem(item.id, formData);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">{category.name} Menu Items</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6 my-4">
            {category.menuItems.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No menu items in this category
              </div>
            ) : (
              category.menuItems.map((item) => (
                <div 
                  key={item.id} 
                  className={`border-b pb-4 ${!item.isAvailable ? 'bg-gray-100 rounded-md p-2' : ''}`}
                >
                  {!item.isAvailable && (
                    <div className="text-red-500 font-medium mb-2 text-sm">Not Available</div>
                  )}
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className={`w-full md:w-28 h-28 object-cover rounded-md ${!item.isAvailable ? 'opacity-60' : ''}`}
                      />
                    ) : (
                      <div className="w-28 h-28 bg-gray-200 rounded-md flex items-center justify-center">
                        <span className="text-gray-400">No image</span>
                      </div>
                    )}
                    <div className="flex-grow">
                      <h3 className={`font-semibold text-lg ${!item.isAvailable ? 'text-gray-500' : ''}`}>
                        {item.name}
                      </h3>
                      <p className={`text-sm ${!item.isAvailable ? 'text-gray-400' : 'text-gray-600'}`}>
                        {item.description || "No description"}
                      </p>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className={`font-bold text-lg ${!item.isAvailable ? 'text-gray-500' : ''}`}>
                        ₦{Number(item.price).toFixed(2)}
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
              ))
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