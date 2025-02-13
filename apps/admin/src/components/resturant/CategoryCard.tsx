"use client";

import { useRestaurant } from "@/context/resturant-context";
import { Button } from "@platter/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@platter/ui/components/card";
import type { Category, MenuItem } from "@prisma/client";
import { Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { AddMenuItemModal } from "./AddMenuItemModal";
import { EditCategoryModal } from "./EditCategoryModal";
import { EditMenuItemModal } from "./EditMenuItemModal";

interface CategoryCardProps {
  category: Category & { menuItems: MenuItem[] };
  className?: string;
}

export function CategoryCard({ category, className = "" }: CategoryCardProps) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditCategoryModalOpen, setIsEditCategoryModalOpen] = useState(false);
  const [editingMenuItem, setEditingMenuItem] = useState<MenuItem | null>(null);

  const { editMode, handleDeleteCategory, handleDeleteMenuItem } =
    useRestaurant();

  // Determine the grid span based on the number of menu items
  const getGridSpan = (itemCount: number) => {
    if (itemCount <= 1) return "col-span-4 row-span-1";
    if (itemCount <= 4) return "col-span-4 row-span-1";
    return "col-span-4 row-span-1";
  };

  const gridSpan = getGridSpan(category.menuItems.length);

  return (
    <Card className={`w-full ${gridSpan}`}>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>{category.name}</CardTitle>
          <CardDescription>{category.description}</CardDescription>
        </div>
        {editMode && (
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditCategoryModalOpen(true)}
            >
              <Pencil className="w-4 h-4 mr-2" />
              Edit
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => handleDeleteCategory(category.id)}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {category.menuItems?.map((item) => (
            <div key={item.id} className="border-b pb-4">
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                {item.image && (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full md:w-28 h-28 object-cover rounded-md"
                  />
                )}
                <div className="flex-grow">
                  <h3 className="font-semibold text-lg">{item.name}</h3>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </div>
                <div className="flex flex-col items-end">
                  <span className="font-bold text-lg">
                    ₦{Number(item.price).toFixed(2)}
                  </span>
                  {editMode && (
                    <div className="flex space-x-2 mt-2">
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
          ))}
        </div>
        <Button onClick={() => setIsAddModalOpen(true)} className="mt-6">
          Add Menu Item
        </Button>
      </CardContent>
      <AddMenuItemModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        categoryId={category.id}
      />
      <EditCategoryModal
        isOpen={isEditCategoryModalOpen}
        onClose={() => setIsEditCategoryModalOpen(false)}
        category={category}
      />
      {editingMenuItem && (
        <EditMenuItemModal
          isOpen={!!editingMenuItem}
          onClose={() => setEditingMenuItem(null)}
          menuItem={editingMenuItem}
        />
      )}
    </Card>
  );
}
