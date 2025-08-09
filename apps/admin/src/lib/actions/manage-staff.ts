"use server";

import db from "@platter/db/index";
import { StaffRole } from "@prisma/client";
import { revalidatePath } from "next/cache";

export interface StaffMember {
  id: string;
  name: string;
  email: string;
  phone?: string;
  staffRole: StaffRole;
  canManageMenu: boolean;
  canManageOrders: boolean;
  canManageTables: boolean;
  canViewReports: boolean;
  isActive: boolean;
  createdAt: Date;
  position?: string;
  assignedTables?: Array<{
    id: string;
    tableId: string;
    table: {
      id: string;
      number: string;
      capacity: number;
    };
  }>;
  assignedServicePoints?: Array<{
    id: string;
    servicePointId: string;
    servicePoint: {
      id: string;
      name: string;
      description?: string;
    };
  }>;
}

export interface UpdateStaffFormData {
  name: string;
  email: string;
  phone?: string;
  canManageMenu: boolean;
  canManageOrders: boolean;
  canManageTables: boolean;
  canViewReports: boolean;
  role: "STAFF" | "MANAGER" | "ADMIN" | "OPERATOR";
  position?: string;
}

export interface ManageStaffResult {
  success?: boolean;
  error?: string;
  staff?: StaffMember;
}

// Helper types derived from Prisma query return types
type StaffFindManyResult = Awaited<ReturnType<typeof db.staff.findMany>>;
type RawStaff = StaffFindManyResult[number];

// Fetch all staff members for a restaurant
export async function getAllStaff(
  restaurantId: string,
): Promise<StaffMember[]> {
  try {
    const staff = await db.staff.findMany({
      where: {
        restaurantId,
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        staffRole: true,
        canManageMenu: true,
        canManageOrders: true,
        canManageTables: true,
        canViewReports: true,
        isActive: true,
        createdAt: true,
        position: true,
        assignedTables: {
          select: {
            id: true,
            tableId: true,
            table: {
              select: {
                id: true,
                number: true,
                capacity: true,
              },
            },
          },
        },
        servicePointStaff: {
          select: {
            id: true,
            servicePointId: true,
            servicePoint: {
              select: {
                id: true,
                name: true,
                description: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Transform the data to match the interface
    return staff.map((member: RawStaff) => ({
      ...member,
      assignedServicePoints: member.servicePointStaff,
    }));
  } catch (error) {
    console.error("Error fetching staff:", error);
    return [];
  }
}

// Update staff member
export async function updateStaff(
  staffId: string,
  data: UpdateStaffFormData,
): Promise<ManageStaffResult> {
  try {
    // Check if staff exists
    const existingStaff = await db.staff.findUnique({
      where: { id: staffId },
    });

    if (!existingStaff) {
      return { error: "Staff member not found" };
    }

    // Check if email already exists for another staff member
    const emailExists = await db.staff.findFirst({
      where: {
        email: data.email,
        id: { not: staffId },
      },
    });

    if (emailExists) {
      return { error: "Email already exists" };
    }

    // Map form role to StaffRole enum
    let staffRole: StaffRole;
    switch (data.role) {
      case "ADMIN":
        staffRole = StaffRole.ADMIN;
        break;
      case "MANAGER":
        staffRole = StaffRole.MANAGER;
        break;
      case "OPERATOR":
        staffRole = StaffRole.OPERATOR;
        break;
      case "STAFF":
        staffRole = StaffRole.STAFF;
        break;
      default:
        staffRole = StaffRole.STAFF;
        break;
    }

    // Update staff member
    const updatedStaff = await db.staff.update({
      where: { id: staffId },
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        staffRole,
        canManageMenu: data.canManageMenu,
        canManageOrders: data.canManageOrders,
        canManageTables: data.canManageTables,
        canViewReports: data.canViewReports,
        position: data.position,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        staffRole: true,
        canManageMenu: true,
        canManageOrders: true,
        canManageTables: true,
        canViewReports: true,
        isActive: true,
        createdAt: true,
        position: true,
        assignedTables: {
          select: {
            id: true,
            tableId: true,
            table: {
              select: {
                id: true,
                number: true,
                capacity: true,
              },
            },
          },
        },
        servicePointStaff: {
          select: {
            id: true,
            servicePointId: true,
            servicePoint: {
              select: {
                id: true,
                name: true,
                description: true,
              },
            },
          },
        },
      },
    });

    // Revalidate the staff management page
    revalidatePath("/manage-staff");

    return {
      success: true,
      staff: {
        ...updatedStaff,
        assignedServicePoints: updatedStaff.servicePointStaff,
      },
    };
  } catch (error) {
    console.error("Error updating staff:", error);
    return { error: "Failed to update staff member" };
  }
}

// Delete staff member (soft delete by setting isActive to false)
export async function deleteStaff(staffId: string): Promise<ManageStaffResult> {
  try {
    // Check if staff exists
    const existingStaff = await db.staff.findUnique({
      where: { id: staffId },
    });

    if (!existingStaff) {
      return { error: "Staff member not found" };
    }

    // Soft delete by setting isActive to false
    const deletedStaff = await db.staff.update({
      where: { id: staffId },
      data: { isActive: false },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        staffRole: true,
        canManageMenu: true,
        canManageOrders: true,
        canManageTables: true,
        canViewReports: true,
        isActive: true,
        createdAt: true,
        position: true,
        assignedTables: {
          select: {
            id: true,
            tableId: true,
            table: {
              select: {
                id: true,
                number: true,
                capacity: true,
              },
            },
          },
        },
        servicePointStaff: {
          select: {
            id: true,
            servicePointId: true,
            servicePoint: {
              select: {
                id: true,
                name: true,
                description: true,
              },
            },
          },
        },
      },
    });

    // Revalidate the staff management page
    revalidatePath("/manage-staff");

    return {
      success: true,
      staff: {
        ...deletedStaff,
        assignedServicePoints: deletedStaff.servicePointStaff,
      },
    };
  } catch (error) {
    console.error("Error deleting staff:", error);
    return { error: "Failed to delete staff member" };
  }
}

// Get staff member by ID
export async function getStaffById(
  staffId: string,
): Promise<StaffMember | null> {
  try {
    const staff = await db.staff.findUnique({
      where: { id: staffId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        staffRole: true,
        canManageMenu: true,
        canManageOrders: true,
        canManageTables: true,
        canViewReports: true,
        isActive: true,
        createdAt: true,
        position: true,
        assignedTables: {
          select: {
            id: true,
            tableId: true,
            table: {
              select: {
                id: true,
                number: true,
                capacity: true,
              },
            },
          },
        },
        servicePointStaff: {
          select: {
            id: true,
            servicePointId: true,
            servicePoint: {
              select: {
                id: true,
                name: true,
                description: true,
              },
            },
          },
        },
      },
    });

    if (!staff) return null;

    return {
      ...staff,
      assignedServicePoints: staff.servicePointStaff,
    };
  } catch (error) {
    console.error("Error fetching staff by ID:", error);
    return null;
  }
}
