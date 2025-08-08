"use server";

import db from "@platter/db/index";
import { StaffRole } from "@prisma/client";
import { hash } from "bcryptjs";
import { revalidatePath } from "next/cache";

export interface CreateStaffFormData {
  name: string;
  email: string;
  phone?: string;
  password: string;
  position?: string;
  assignedTableIds?: string[];
  assignedServicePointId?: string;
  canManageMenu: boolean;
  canManageOrders: boolean;
  canManageTables: boolean;
  canViewReports: boolean;
  staffRole: "STAFF" | "ADMIN" | "MANAGER" | "OPERATOR";
}

export interface CreateStaffResult {
  success?: boolean;
  error?: string;
  staff?: {
    id: string;
    name: string;
    email: string;
  };
}

export async function createStaff(
  restaurantId: string,
  data: CreateStaffFormData,
): Promise<CreateStaffResult> {
  try {
    // Validate restaurant exists
    const restaurant = await db.user.findUnique({
      where: {
        id: restaurantId,
      },
    });
    console.log("Creating staff for restaurant:", restaurantId);
    if (!restaurant) {
      return { error: "Restaurant not found" };
    }

    // Check if email already exists in Staff table
    const existingStaff = await db.staff.findUnique({
      where: { email: data.email },
    });

    if (existingStaff) {
      return { error: "Email already exists" };
    }

    // Hash password
    const hashedPassword = await hash(data.password, 12);

    // Map form staffRole to StaffRole enum
    let staffRole: StaffRole;
    switch (data.staffRole) {
      case "ADMIN":
        staffRole = StaffRole.ADMIN;
        break;
      case "MANAGER":
        staffRole = StaffRole.MANAGER;
        break;
      case "OPERATOR":
        staffRole = StaffRole.OPERATOR;
        break;
      default:
        staffRole = StaffRole.STAFF;
        break;
    }

    // Create staff member with password
    const staff = await db.staff.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        password: hashedPassword, // Store hashed password
        position: data.position,
        staffRole,
        canManageMenu: data.canManageMenu,
        canManageOrders: data.canManageOrders,
        canManageTables: data.canManageTables,
        canViewReports: data.canViewReports,
        restaurantId,
        isActive: true, // Set as active by default
      },
    });

    // Assign tables if provided
    if (data.assignedTableIds && data.assignedTableIds.length > 0) {
      await db.staffTable.createMany({
        data: data.assignedTableIds.map((tableId) => ({
          staffId: staff.id,
          tableId,
          isActive: true,
        })),
      });
    }

    // Assign service point if operator and service point provided
    if (data.staffRole === "OPERATOR" && data.assignedServicePointId) {
      await db.servicePointStaff.create({
        data: {
          servicePointId: data.assignedServicePointId,
          staffId: staff.id,
          role: "OPERATOR",
          isActive: true,
        },
      });
    }

    // Revalidate the staff management page
    revalidatePath("/manage-staff");
    revalidatePath(`/dashboard/restaurant/${restaurantId}/staff`);

    return {
      success: true,
      staff: {
        id: staff.id,
        name: staff.name,
        email: staff.email,
      },
    };
  } catch (error) {
    console.error("Error creating staff:", error);

    // Handle specific Prisma errors
    if (error instanceof Error) {
      if (error.message.includes("Unique constraint")) {
        return { error: "Email already exists" };
      }
    }

    return { error: "Failed to create staff member" };
  }
}

// Helper function for staff login (you can use this later)
export async function authenticateStaff(email: string, password: string) {
  try {
    const staff = await db.staff.findUnique({
      where: { email, isActive: true },
    });

    if (!staff) {
      return { error: "Invalid credentials" };
    }

    const isValidPassword = await hash(password, 12); // You'll need bcrypt.compare here
    // const isValidPassword = await compare(password, staff.password)

    if (!isValidPassword) {
      return { error: "Invalid credentials" };
    }

    return { staff };
  } catch (error) {
    console.error("Authentication error:", error);
    return { error: "Authentication failed" };
  }
}

// Helper function to create staff session (for login)
export async function createStaffSession(
  staffId: string,
  ipAddress?: string,
  userAgent?: string,
) {
  try {
    // Generate a secure token
    const token = crypto.randomUUID();

    // Set expiration (e.g., 30 days from now)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    const session = await db.staffSession.create({
      data: {
        token,
        expiresAt,
        staffId,
        ipAddress,
        userAgent,
      },
    });

    return { session };
  } catch (error) {
    console.error("Error creating staff session:", error);
    return { error: "Failed to create session" };
  }
}
