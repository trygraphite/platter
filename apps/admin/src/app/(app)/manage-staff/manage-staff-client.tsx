"use client";

import EditStaffModal from "@/components/modules/edit-staff-modal";
import {
  type StaffMember,
  deleteStaff,
  getAllStaff,
} from "@/lib/actions/manage-staff";
import { Badge } from "@platter/ui/components/badge";
import { Button } from "@platter/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@platter/ui/components/card";
import { toast } from "@platter/ui/components/sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@platter/ui/components/table";
import {
  Calendar,
  Crown,
  Edit,
  Mail,
  Phone,
  Plus,
  Shield,
  Trash2,
  User,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface ManageStaffClientProps {
  restaurantId: string;
}

export default function ManageStaffClient({
  restaurantId,
}: ManageStaffClientProps): JSX.Element {
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedStaffId, setSelectedStaffId] = useState<string | null>(null);

  useEffect(() => {
    loadStaff();
  }, []);

  const loadStaff = async () => {
    try {
      setLoading(true);
      const staffData = await getAllStaff(restaurantId);
      setStaff(staffData);
    } catch (error) {
      console.error("Error loading staff:", error);
      toast.error("Failed to load staff members");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (staffId: string, staffName: string) => {
    if (!confirm(`Are you sure you want to delete ${staffName}?`)) {
      return;
    }

    try {
      setDeletingId(staffId);
      const result = await deleteStaff(staffId);

      if (result.error) {
        toast.error(result.error);
        return;
      }

      toast.success("Staff member deleted successfully");
      await loadStaff(); // Reload the list
    } catch (error) {
      console.error("Error deleting staff:", error);
      toast.error("Failed to delete staff member");
    } finally {
      setDeletingId(null);
    }
  };

  const handleEdit = (staffId: string) => {
    setSelectedStaffId(staffId);
    setEditModalOpen(true);
  };

  const handleEditSuccess = () => {
    loadStaff(); // Reload the list after successful edit
  };

  const handleEditClose = () => {
    setEditModalOpen(false);
    setSelectedStaffId(null);
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "ADMIN":
        return <Crown className="h-4 w-4 text-red-500" />;
      case "MANAGER":
        return <Shield className="h-4 w-4 text-blue-500" />;
      case "OPERATOR":
        return <Shield className="h-4 w-4 text-green-500" />;
      default:
        return <User className="h-4 w-4 text-gray-500" />;
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "ADMIN":
        return <Badge variant="destructive">Admin</Badge>;
      case "MANAGER":
        return <Badge variant="default">Manager</Badge>;
      case "OPERATOR":
        return (
          <Badge variant="default" className="bg-green-500">
            Operator
          </Badge>
        );
      default:
        return <Badge variant="secondary">Staff</Badge>;
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto py-10">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Staff Management</h1>
          <p className="text-muted-foreground mt-2">
            Manage your restaurant staff members and their permissions
          </p>
        </div>
        <Link href="/create-staff">
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Staff Member
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Staff Members</CardTitle>
          <CardDescription>
            {staff.length} active staff member{staff.length !== 1 ? "s" : ""}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {staff.length === 0 ? (
            <div className="text-center py-12">
              <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                No staff members yet
              </h3>
              <p className="text-muted-foreground mb-4">
                Get started by adding your first staff member
              </p>
              <Link href="/create-staff">
                <Button>Add Staff Member</Button>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Position</TableHead>
                    <TableHead>Assignments</TableHead>
                    <TableHead>Permissions</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {staff.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2">
                            {getRoleIcon(member.staffRole)}
                            <div>
                              <div className="font-medium">{member.name}</div>
                              <div className="text-sm text-muted-foreground">
                                {member.email}
                              </div>
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm">
                            <Mail className="h-3 w-3" />
                            {member.email}
                          </div>
                          {member.phone && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Phone className="h-3 w-3" />
                              {member.phone}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{getRoleBadge(member.staffRole)}</TableCell>
                      <TableCell>{member.position || "-"}</TableCell>
                      <TableCell>
                        {member.staffRole === "OPERATOR" &&
                        member.assignedServicePoints &&
                        member.assignedServicePoints.length > 0 ? (
                          <div className="space-y-1">
                            <Badge
                              variant="outline"
                              className="text-green-600 border-green-600"
                            >
                              Service Point Operator
                            </Badge>
                            {member.assignedServicePoints.map((assignment) => (
                              <div
                                key={assignment.id}
                                className="text-sm text-muted-foreground"
                              >
                                {assignment.servicePoint.name}
                              </div>
                            ))}
                          </div>
                        ) : member.assignedTables &&
                          member.assignedTables.length > 0 ? (
                          <div className="space-y-1">
                            <Badge
                              variant="outline"
                              className="text-blue-600 border-blue-600"
                            >
                              Table Assignment
                            </Badge>
                            <div className="text-sm text-muted-foreground">
                              {member.assignedTables
                                .map((assignment) => assignment.table.number)
                                .join(", ")}
                            </div>
                          </div>
                        ) : (
                          <span className="text-sm text-muted-foreground">
                            -
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {member.canManageMenu && (
                            <Badge variant="outline" className="text-xs">
                              Menu
                            </Badge>
                          )}
                          {member.canManageOrders && (
                            <Badge variant="outline" className="text-xs">
                              Orders
                            </Badge>
                          )}
                          {member.canManageTables && (
                            <Badge variant="outline" className="text-xs">
                              Tables
                            </Badge>
                          )}
                          {member.canViewReports && (
                            <Badge variant="outline" className="text-xs">
                              Reports
                            </Badge>
                          )}
                          {!member.canManageMenu &&
                            !member.canManageOrders &&
                            !member.canManageTables &&
                            !member.canViewReports && (
                              <span className="text-sm text-muted-foreground">
                                No permissions
                              </span>
                            )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          {formatDate(member.createdAt)}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(member.id)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(member.id, member.name)}
                            disabled={deletingId === member.id}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <EditStaffModal
        isOpen={editModalOpen}
        onClose={handleEditClose}
        staffId={selectedStaffId}
        onSuccess={handleEditSuccess}
      />
    </div>
  );
}
