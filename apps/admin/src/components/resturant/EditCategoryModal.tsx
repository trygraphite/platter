"use client";

import { useRestaurant } from "@/context/resturant-context";
import { Button } from "@platter/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@platter/ui/components/dialog";
import { Input } from "@platter/ui/components/input";
import { Label } from "@platter/ui/components/label";
import { Textarea } from "@platter/ui/components/textarea";
import type { Category } from "@prisma/client";
import { useEffect, useState } from "react";

interface EditCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: Category;
}

export function EditCategoryModal({
  isOpen,
  onClose,
  category,
}: EditCategoryModalProps) {
  const [name, setName] = useState(category.name);
  const [description, setDescription] = useState(category.description || "");
  const { handleUpdateCategory } = useRestaurant();

  useEffect(() => {
    setName(category.name);
    setDescription(category.description || "");
  }, [category]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleUpdateCategory(category.id, { name, description });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Category</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Category Name</Label>
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
          <Button type="submit">Update Category</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
