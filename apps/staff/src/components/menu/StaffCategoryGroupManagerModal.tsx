"use client";

import { Button } from "@platter/ui/components/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@platter/ui/components/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@platter/ui/components/dialog";
import { Input } from "@platter/ui/components/input";
import { Label } from "@platter/ui/components/label";
import { Textarea } from "@platter/ui/components/textarea";
import { Edit, Plus, Trash } from "lucide-react";
import { useState } from "react";
import { useStaffMenu } from "./StaffMenuProvider";

interface StaffCategoryGroupManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function StaffCategoryGroupManagerModal({
  isOpen,
  onClose,
}: StaffCategoryGroupManagerModalProps) {
  const {
    categoryGroups,
    handleUpdateCategoryGroup,
    handleDeleteCategoryGroup,
    handleAddCategoryGroup,
  } = useStaffMenu();

  const [editGroupId, setEditGroupId] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", description: "" });

  const handleEditGroup = (groupId: string) => {
    const group = categoryGroups.find((g) => g.id === groupId);
    if (group) {
      setFormData({
        name: group.name,
        description: group.description || "",
      });
      setEditGroupId(groupId);
    }
  };

  const handleSaveGroup = async () => {
    if (editGroupId) {
      await handleUpdateCategoryGroup(editGroupId, formData);
      setEditGroupId(null);
    }
  };

  const handleAddGroup = async () => {
    await handleAddCategoryGroup(formData);
    setIsAddModalOpen(false);
    setFormData({ name: "", description: "" });
  };

  const handleDeleteGroup = async (groupId: string) => {
    if (
      window.confirm("Are you sure you want to delete this category group?")
    ) {
      await handleDeleteCategoryGroup(groupId);
    }
  };

  return (
    <>
      {/* Main Group Manager Modal */}
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Manage Category Groups</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="flex justify-end">
              <Button
                onClick={() => {
                  setFormData({ name: "", description: "" });
                  setIsAddModalOpen(true);
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add New Group
              </Button>
            </div>

            {categoryGroups.length === 0 ? (
              <div className="text-center py-12 border rounded-lg">
                <p className="text-muted-foreground">No category groups yet</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {categoryGroups.map((group) => (
                  <Card key={group.id} className="relative">
                    <CardHeader>
                      <h3 className="text-xl font-semibold">{group.name}</h3>
                      {group.description && (
                        <p className="text-sm text-muted-foreground">
                          {group.description}
                        </p>
                      )}
                    </CardHeader>
                    <CardContent>
                      <p>
                        <span className="font-medium">
                          {group.categories?.length || 0}
                        </span>{" "}
                        categories
                      </p>
                    </CardContent>
                    <CardFooter className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditGroup(group.id)}
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteGroup(group.id)}
                      >
                        <Trash className="w-4 h-4" />
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Group Dialog */}
      <Dialog
        open={!!editGroupId}
        onOpenChange={(open) => !open && setEditGroupId(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Category Group</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-group-name">Name</Label>
              <Input
                id="edit-group-name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Group name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-group-description">
                Description (optional)
              </Label>
              <Textarea
                id="edit-group-description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Group description"
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setEditGroupId(null)}>
              Cancel
            </Button>
            <Button onClick={handleSaveGroup} disabled={!formData.name.trim()}>
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Group Dialog */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Category Group</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="add-group-name">Name</Label>
              <Input
                id="add-group-name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Group name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="add-group-description">
                Description (optional)
              </Label>
              <Textarea
                id="add-group-description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Group description"
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddGroup} disabled={!formData.name.trim()}>
              Add Group
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
