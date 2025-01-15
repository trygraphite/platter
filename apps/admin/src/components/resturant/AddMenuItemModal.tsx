"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@platter/ui/components/dialog";
import { Label } from "@platter/ui/components/label";
import { Input } from "@platter/ui/components/input";
import { Textarea } from "@platter/ui/components/textarea";
import { Button } from "@platter/ui/components/button";
import { useRestaurant } from "@/app/(app)/context/resturant-context";

interface AddMenuItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  categoryId: string;
}

export function AddMenuItemModal({
  isOpen,
  onClose,
  categoryId,
}: AddMenuItemModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { handleAddMenuItem } = useRestaurant();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await handleAddMenuItem(categoryId, {
        name,
        description,
        categoryId,
        price: parseFloat(price),
        image: image as string | null,
        isAvailable: true,
      });
      setName("");
      setDescription("");
      setPrice("");
      setImage(null);
      setImagePreview(null);
      onClose();
    } catch (error) {
      console.error("Error adding menu item:", error);
      // Handle error here if needed
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Menu Item</DialogTitle>
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
          <Button
            type="submit"
            disabled={isLoading}
            variant={isLoading ? "secondary" : "default"}
            className={isLoading ? "opacity-70 cursor-not-allowed" : ""}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-red-500"
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
                Adding Menu Item...
              </span>
            ) : (
              "Add Menu Item"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
