"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@platter/ui/components/button";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@platter/ui/components/select";
import { toast } from "@platter/ui/components/sonner";
import { Switch } from "@platter/ui/components/switch";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  getStaffById,
  type StaffMember,
  type UpdateStaffFormData,
  updateStaff,
} from "@/lib/actions/manage-staff";

const editStaffSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  email: z.string().email({ message: "Valid email is required" }),
  phone: z.string().optional(),
  canManageMenu: z.boolean().default(false),
  canManageOrders: z.boolean().default(false),
  canManageTables: z.boolean().default(false),
  canViewReports: z.boolean().default(false),
  role: z.enum(["STAFF", "MANAGER", "ADMIN"]).default("STAFF"),
  position: z.string().optional(),
});

type FormData = z.infer<typeof editStaffSchema>;

interface EditStaffModalProps {
  isOpen: boolean;
  onClose: () => void;
  staffId: string | null;
  onSuccess: () => void;
}

export default function EditStaffModal({
  isOpen,
  onClose,
  staffId,
  onSuccess,
}: EditStaffModalProps) {
  const [loading, setLoading] = useState(false);
  const [_staff, setStaff] = useState<StaffMember | null>(null);
  const [initialLoading, setInitialLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(editStaffSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      canManageMenu: false,
      canManageOrders: false,
      canManageTables: false,
      canViewReports: false,
      role: "STAFF",
      position: "",
    },
  });

  const watchRole = watch("role");

  // Load staff data when modal opens
  useEffect(() => {
    if (isOpen && staffId) {
      loadStaff();
    }
  }, [isOpen, staffId, loadStaff]);

  const loadStaff = async () => {
    if (!staffId) return;

    try {
      setInitialLoading(true);
      const staffData = await getStaffById(staffId);
      if (staffData) {
        setStaff(staffData);

        // Map StaffRole enum to form role
        let role: "STAFF" | "MANAGER" | "ADMIN";
        switch (staffData.staffRole) {
          case "ADMIN":
            role = "ADMIN";
            break;
          case "MANAGER":
            role = "MANAGER";
            break;
          default:
            role = "STAFF";
            break;
        }

        reset({
          name: staffData.name,
          email: staffData.email,
          phone: staffData.phone || "",
          canManageMenu: staffData.canManageMenu,
          canManageOrders: staffData.canManageOrders,
          canManageTables: staffData.canManageTables,
          canViewReports: staffData.canViewReports,
          role,
          position: staffData.position || "",
        });
      } else {
        toast.error("Staff member not found");
        onClose();
      }
    } catch (error) {
      console.error("Error loading staff:", error);
      toast.error("Failed to load staff member");
      onClose();
    } finally {
      setInitialLoading(false);
    }
  };

  // Auto-set permissions based on role selection
  const handleRoleChange = (value: string) => {
    setValue("role", value as "STAFF" | "MANAGER" | "ADMIN");

    if (value === "ADMIN") {
      setValue("canManageMenu", true);
      setValue("canManageOrders", true);
      setValue("canManageTables", true);
      setValue("canViewReports", true);
    } else if (value === "MANAGER") {
      setValue("canManageMenu", true);
      setValue("canManageOrders", true);
      setValue("canManageTables", true);
      setValue("canViewReports", true);
    }
    // For regular staff, don't auto-assign permissions - let user choose
  };

  const onSubmit = async (data: FormData) => {
    if (!staffId) return;

    try {
      setLoading(true);

      const result = await updateStaff(staffId, data as UpdateStaffFormData);

      if (result.error) {
        toast.error(result.error);
        return;
      }

      toast.success("Staff member updated successfully");
      onSuccess();
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Staff Member</DialogTitle>
          <DialogDescription>
            Update staff member information and permissions
          </DialogDescription>
        </DialogHeader>

        {initialLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" {...register("name")} />
                    {errors.name && (
                      <p className="text-sm text-red-500">
                        {errors.name.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" {...register("email")} />
                    {errors.email && (
                      <p className="text-sm text-red-500">
                        {errors.email.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone (Optional)</Label>
                    <Input id="phone" {...register("phone")} />
                    {errors.phone && (
                      <p className="text-sm text-red-500">
                        {errors.phone.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="position">Position (Optional)</Label>
                    <Input id="position" {...register("position")} />
                    {errors.position && (
                      <p className="text-sm text-red-500">
                        {errors.position.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Select
                    onValueChange={handleRoleChange}
                    defaultValue={watchRole}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="STAFF">Staff</SelectItem>
                      <SelectItem value="MANAGER">Manager</SelectItem>
                      <SelectItem value="ADMIN">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-base">Permissions</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="canManageMenu"
                        checked={watch("canManageMenu")}
                        onCheckedChange={(checked) =>
                          setValue("canManageMenu", checked)
                        }
                      />
                      <Label htmlFor="canManageMenu">Manage Menu</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="canManageOrders"
                        checked={watch("canManageOrders")}
                        onCheckedChange={(checked) =>
                          setValue("canManageOrders", checked)
                        }
                      />
                      <Label htmlFor="canManageOrders">Manage Orders</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="canManageTables"
                        checked={watch("canManageTables")}
                        onCheckedChange={(checked) =>
                          setValue("canManageTables", checked)
                        }
                      />
                      <Label htmlFor="canManageTables">Manage Tables</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="canViewReports"
                        checked={watch("canViewReports")}
                        onCheckedChange={(checked) =>
                          setValue("canViewReports", checked)
                        }
                      />
                      <Label htmlFor="canViewReports">View Reports</Label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter className="mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Updating..." : "Update Staff Member"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
