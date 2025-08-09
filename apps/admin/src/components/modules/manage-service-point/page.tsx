"use client";

import { Badge } from "@platter/ui/components/badge";
import { Button } from "@platter/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@platter/ui/components/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@platter/ui/components/dialog";
import { Input } from "@platter/ui/components/input";
import { Label } from "@platter/ui/components/label";
import { toast } from "@platter/ui/components/sonner";
import { Switch } from "@platter/ui/components/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@platter/ui/components/table";
import { Textarea } from "@platter/ui/components/textarea";
import { Building2, Edit, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  deleteServicePoint,
  getServicePoints,
  type ServicePointData,
  updateServicePoint,
} from "@/lib/actions/manage-service-points";

export default function ManageServicePointPage({
  params,
}: {
  params: { restaurantId: string };
}) {
  const _router = useRouter();
  const [servicePoints, setServicePoints] = useState<ServicePointData[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingServicePoint, setEditingServicePoint] =
    useState<ServicePointData | null>(null);
  const [editForm, setEditForm] = useState({
    name: "",
    description: "",
    isActive: true,
  });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [servicePointToDelete, setServicePointToDelete] =
    useState<ServicePointData | null>(null);

  useEffect(() => {
    fetchServicePoints();
  }, [fetchServicePoints]);

  const fetchServicePoints = async () => {
    try {
      const data = await getServicePoints(params.restaurantId);
      setServicePoints(data);
    } catch (error) {
      console.error("Error fetching service points:", error);
      toast.error("Failed to load service points");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (servicePoint: ServicePointData) => {
    setEditingServicePoint(servicePoint);
    setEditForm({
      name: servicePoint.name,
      description: servicePoint.description || "",
      isActive: servicePoint.isActive,
    });
  };

  const handleUpdate = async () => {
    if (!editingServicePoint) return;

    try {
      const result = await updateServicePoint(editingServicePoint.id, editForm);

      if (result.error) {
        toast.error(result.error);
        return;
      }

      toast.success("Service point updated successfully");
      setEditingServicePoint(null);
      fetchServicePoints();
    } catch (error) {
      console.error("Error updating service point:", error);
      toast.error("Failed to update service point");
    }
  };

  const handleDelete = async () => {
    if (!servicePointToDelete) return;

    try {
      const result = await deleteServicePoint(servicePointToDelete.id);

      if (result.error) {
        toast.error(result.error);
        return;
      }

      toast.success("Service point deleted successfully");
      setDeleteDialogOpen(false);
      setServicePointToDelete(null);
      fetchServicePoints();
    } catch (error) {
      console.error("Error deleting service point:", error);
      toast.error("Failed to delete service point");
    }
  };

  const openDeleteDialog = (servicePoint: ServicePointData) => {
    setServicePointToDelete(servicePoint);
    setDeleteDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="container mx-auto py-10">
        <div className="text-center">
          <p>Loading service points...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Service Points</h1>
          <p className="text-muted-foreground">
            Manage your service points for menu organization and staff
            assignments
          </p>
        </div>
        <Button asChild>
          <Link href="/create-service-point">
            <Plus className="mr-2 h-4 w-4" />
            Create Service Point
          </Link>
        </Button>
      </div>

      {servicePoints.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Building2 className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              No service points yet
            </h3>
            <p className="text-muted-foreground text-center mb-4">
              Create your first service point to organize menu items and staff
              assignments
            </p>
            <Button asChild>
              <Link href="/create-service-point">
                <Plus className="mr-2 h-4 w-4" />
                Create Service Point
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Service Points ({servicePoints.length})</CardTitle>
            <CardDescription>
              View and manage your service points
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Menu Items</TableHead>
                  <TableHead>Staff</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {servicePoints.map((servicePoint) => (
                  <TableRow key={servicePoint.id}>
                    <TableCell className="font-medium">
                      {servicePoint.name}
                    </TableCell>
                    <TableCell>
                      {servicePoint.description || (
                        <span className="text-muted-foreground">
                          No description
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          servicePoint.isActive ? "default" : "secondary"
                        }
                      >
                        {servicePoint.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {servicePoint._count.menuItems} items
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {servicePoint._count.staff} staff
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(servicePoint)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openDeleteDialog(servicePoint)}
                          disabled={
                            servicePoint._count.menuItems > 0 ||
                            servicePoint._count.staff > 0
                          }
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Edit Dialog */}
      {editingServicePoint && (
        <Dialog
          open={!!editingServicePoint}
          onOpenChange={() => setEditingServicePoint(null)}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Service Point</DialogTitle>
              <DialogDescription>
                Update the service point details
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Name</Label>
                <Input
                  id="edit-name"
                  value={editForm.name}
                  onChange={(e) =>
                    setEditForm({ ...editForm, name: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={editForm.description}
                  onChange={(e) =>
                    setEditForm({ ...editForm, description: e.target.value })
                  }
                  rows={3}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="edit-active"
                  checked={editForm.isActive}
                  onCheckedChange={(checked) =>
                    setEditForm({ ...editForm, isActive: checked })
                  }
                />
                <Label htmlFor="edit-active">Active</Label>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setEditingServicePoint(null)}
              >
                Cancel
              </Button>
              <Button onClick={handleUpdate}>Update</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Service Point</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{servicePointToDelete?.name}"?
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
