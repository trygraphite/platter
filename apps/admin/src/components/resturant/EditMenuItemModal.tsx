"use client";

import { useRestaurant } from "@/context/resturant-context";
import { Button } from "@platter/ui/components/button";
import { Checkbox } from "@platter/ui/components/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@platter/ui/components/dialog";
import { Input } from "@platter/ui/components/input";
import { Label } from "@platter/ui/components/label";
import { Textarea } from "@platter/ui/components/textarea";
import type { MenuItem } from "@prisma/client";
import { useEffect, useState } from "react";

interface EditMenuItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  menuItem: MenuItem;
}

export function EditMenuItemModal({
  isOpen,
  onClose,
  menuItem,
}: EditMenuItemModalProps) {
  const [name, setName] = useState(menuItem.name);
  const [description, setDescription] = useState(menuItem.description || "");
  const [price, setPrice] = useState(menuItem.price.toString());
  const [isAvailable, setIsAvailable] = useState(menuItem.isAvailable);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    menuItem.image || null,
  );
  const [isLoading, setIsLoading] = useState(false);
  const { handleUpdateMenuItem } = useRestaurant();

  useEffect(() => {
    setName(menuItem.name);
    setDescription(menuItem.description || "");
    setPrice(menuItem.price.toString());
    setIsAvailable(menuItem.isAvailable);
    setImagePreview(menuItem.image || null);
    setImage(null); // Reset image when menuItem changes
  }, [menuItem]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("isAvailable", isAvailable.toString());

      if (image) {
        formData.append("image", image);
      } else if (imagePreview) {
        // If there's an existing image but no new upload
        formData.append("existingImage", imagePreview);
      }

      await handleUpdateMenuItem(menuItem.id, formData);
      onClose();
    } catch (error) {
      console.error("Error updating menu item:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Menu Item</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Item Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="price">Price</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="image">Image</Label>
            <Input
              id="image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Preview"
                className="mt-2 max-w-full h-32 object-cover"
              />
            )}
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="isAvailable" 
              checked={isAvailable}
              onCheckedChange={(checked) => setIsAvailable(checked === true)}
            />
            <Label htmlFor="isAvailable">Available</Label>
          </div>
          <Button
            type="submit"
            disabled={isLoading}
            className={isLoading ? "opacity-70 cursor-not-allowed" : ""}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Updating...
              </span>
            ) : (
              "Update Menu Item"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}