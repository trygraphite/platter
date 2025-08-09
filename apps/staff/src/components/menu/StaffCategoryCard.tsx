"use client";
import { Button } from "@platter/ui/components/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@platter/ui/components/card";
import type { Category, MenuItem } from "@prisma/client";
import { Trash } from "lucide-react";
import { useState } from "react";
import { StaffEditCategoryModal } from "./StaffEditCategoryModal";
import {
  type MenuItemWithVarieties,
  StaffMenuItemsDialog,
} from "./StaffMenuItemsDialog";
import { useStaffMenu } from "./StaffMenuProvider";

interface CategoryCardProps {
  category: Category & { menuItems: MenuItemWithVarieties[] };
}

export function StaffCategoryCard({ category }: CategoryCardProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isMenuItemsOpen, setIsMenuItemsOpen] = useState(false);
  const { handleDeleteCategory, editMode } = useStaffMenu();

  const handleDelete = () => {
    if (
      window.confirm(
        `Are you sure you want to delete category "${category.name}"?`,
      )
    ) {
      handleDeleteCategory(category.id);
    }
  };

  return (
    <>
      <Card className="h-full flex flex-col">
        {/* Card Image */}
        <div className="relative w-full h-48 overflow-hidden">
          {category.image ? (
            <img
              src={category.image}
              alt={category.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center">
              <span className="text-muted-foreground">No image</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
            <h3 className="text-xl font-bold text-white p-4">
              {category.name}
            </h3>
          </div>
        </div>
        <CardContent className="flex-grow pt-4">
          <p className="text-sm text-muted-foreground">
            {category.description || "No description provided"}
          </p>
          <p className="text-sm mt-2">
            <span className="font-medium">{category.menuItems.length}</span>{" "}
            menu items
          </p>
        </CardContent>
        <CardFooter className="flex justify-between pt-0">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsMenuItemsOpen(true)}
          >
            View Items
          </Button>

          {editMode && (
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditModalOpen(true)}
              >
                Edit
              </Button>
              <Button variant="destructive" size="sm" onClick={handleDelete}>
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          )}
        </CardFooter>
      </Card>

      <StaffEditCategoryModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        category={category}
      />

      <StaffMenuItemsDialog
        isOpen={isMenuItemsOpen}
        onClose={() => setIsMenuItemsOpen(false)}
        category={category}
      />
    </>
  );
}
