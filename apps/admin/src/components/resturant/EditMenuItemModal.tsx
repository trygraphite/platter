"use client";

import { useState, useEffect } from "react";
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
import type { MenuItem } from "@prisma/client";
import { useRestaurant } from "@/app/(app)/context/resturant-context";

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
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    menuItem.image || null,
  );
  const { handleUpdateMenuItem } = useRestaurant();

  useEffect(() => {
    setName(menuItem.name);
    setDescription(menuItem.description || "");
    setPrice(menuItem.price.toString());
    setImagePreview(menuItem.image || null);
  }, [menuItem]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const updatedData: Partial<MenuItem> = {
      name,
      description,
      price: parseFloat(price),
    };
    if (image) {
      const reader = new FileReader();
      const base64String = await new Promise<string>((resolve) => {
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(image);
      });
      updatedData.image = base64String;
    }
    await handleUpdateMenuItem(menuItem.id, updatedData);
    onClose();
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
          <Button type="submit">Update Menu Item</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
