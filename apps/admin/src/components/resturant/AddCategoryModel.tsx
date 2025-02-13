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
import { useState } from "react";

export function AddCategoryModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const { handleAddCategory } = useRestaurant();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleAddCategory({ name, description });
    setName("");
    setDescription("");
    setIsOpen(false);
  };

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Add Category</Button>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Category</DialogTitle>
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
            <Button type="submit">Add Category</Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
