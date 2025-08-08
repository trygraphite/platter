"use client";

import { useCurrentStaff } from "@/hooks/useCurrentStaff";
import { Badge } from "@platter/ui/components/badge";
import { AlertCircle, Loader2, Package, User, Users } from "lucide-react";

export function CurrentStaffInfo() {
  const { staff, loading, error } = useCurrentStaff();

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <Loader2 className="h-4 w-4 animate-spin mr-2" />
        <span className="text-sm text-gray-600">Loading staff info...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center p-4 bg-red-50 border border-red-200 rounded-md">
        <AlertCircle className="h-4 w-4 text-red-600 mr-2" />
        <span className="text-sm text-red-600">{error}</span>
      </div>
    );
  }

  if (!staff) {
    return (
      <div className="flex items-center p-4 bg-yellow-50 border border-yellow-200 rounded-md">
        <AlertCircle className="h-4 w-4 text-yellow-600 mr-2" />
        <span className="text-sm text-yellow-600">Not logged in</span>
      </div>
    );
  }

  // Get role display name
  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case "ADMIN":
        return "Administrator";
      case "MANAGER":
        return "Manager";
      case "OPERATOR":
        return "Service Point Operator";
      default:
        return "Staff Member";
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
        <User className="h-5 w-5 mr-2 text-blue-600" />
        Current Staff Information
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-600">Name</p>
          <p className="text-sm font-medium text-gray-900">{staff.name}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Email</p>
          <p className="text-sm font-medium text-gray-900">{staff.email}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Role</p>
          <p className="text-sm font-medium text-gray-900">
            {getRoleDisplayName(staff.staffRole)}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Position</p>
          <p className="text-sm font-medium text-gray-900">
            {staff.position || "Not specified"}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Status</p>
          <p className="text-sm font-medium text-gray-900">
            {staff.isActive ? "Active" : "Inactive"}
          </p>
        </div>
        {/* <div>
          <p className="text-sm text-gray-600">Restaurant</p>
          <p className="text-sm font-medium text-gray-900">
            {staff.restaurantName}
          </p>
        </div> */}
      </div>

      {/* Assignments Section */}
      {(staff.assignedTables && staff.assignedTables.length > 0) ||
      (staff.assignedServicePoints &&
        staff.assignedServicePoints.length > 0) ? (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <h4 className="text-sm font-medium text-gray-900 mb-3">
            Assignments
          </h4>
          <div className="space-y-3">
            {staff.assignedTables && staff.assignedTables.length > 0 && (
              <div>
                <div className="flex items-center mb-2">
                  <Users className="h-4 w-4 mr-2 text-blue-600" />
                  <span className="text-sm font-medium text-gray-700">
                    Assigned Tables
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {staff.assignedTables.map((assignment) => (
                    <Badge
                      key={assignment.id}
                      variant="outline"
                      className="text-blue-600 border-blue-600"
                    >
                      Table {assignment.table.number} (
                      {assignment.table.capacity} seats)
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {staff.assignedServicePoints &&
              staff.assignedServicePoints.length > 0 && (
                <div>
                  <div className="flex items-center mb-2">
                    <Package className="h-4 w-4 mr-2 text-green-600" />
                    <span className="text-sm font-medium text-gray-700">
                      Service Points
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {staff.assignedServicePoints.map((assignment) => (
                      <Badge
                        key={assignment.id}
                        variant="outline"
                        className="text-green-600 border-green-600"
                      >
                        {assignment.servicePoint.name}
                        {assignment.servicePoint.description && (
                          <span className="ml-1 text-xs text-gray-500">
                            ({assignment.servicePoint.description})
                          </span>
                        )}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
          </div>
        </div>
      ) : null}

      <div className="mt-4 pt-4 border-t border-gray-200">
        <h4 className="text-sm font-medium text-gray-900 mb-2">Permissions</h4>
        <div className="grid grid-cols-2 gap-2">
          <div className="flex items-center">
            <div
              className={`w-2 h-2 rounded-full mr-2 ${staff.canManageOrders ? "bg-green-500" : "bg-gray-300"}`}
            />
            <span className="text-xs text-gray-600">Manage Orders</span>
          </div>
          <div className="flex items-center">
            <div
              className={`w-2 h-2 rounded-full mr-2 ${staff.canManageMenu ? "bg-green-500" : "bg-gray-300"}`}
            />
            <span className="text-xs text-gray-600">Manage Menu</span>
          </div>
          <div className="flex items-center">
            <div
              className={`w-2 h-2 rounded-full mr-2 ${staff.canManageTables ? "bg-green-500" : "bg-gray-300"}`}
            />
            <span className="text-xs text-gray-600">Manage Tables</span>
          </div>
          <div className="flex items-center">
            <div
              className={`w-2 h-2 rounded-full mr-2 ${staff.canViewReports ? "bg-green-500" : "bg-gray-300"}`}
            />
            <span className="text-xs text-gray-600">View Reports</span>
          </div>
        </div>
      </div>
    </div>
  );
}
