"use client";

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
import { Layers } from "lucide-react";
import { useState } from "react";
import { useStaffMenu } from "./StaffMenuProvider";

export function StaffAddCategoryGroupModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const { handleAddCategoryGroup } = useStaffMenu();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleAddCategoryGroup({ name, description });
    setName("");
    setDescription("");
    setIsOpen(false);
  };

  return (
    <>
      <Button onClick={() => setIsOpen(true)} variant="outline">
        <Layers className="h-4 w-4 mr-2" />
        Add Group
      </Button>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Category Group</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Group Name</Label>
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
                placeholder="Optional description for this group"
              />
            </div>
            <Button type="submit">Create Group</Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
