// lib/staff-auth.ts

import db from "@platter/db/index";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export interface StaffUser {
  id: string;
  name: string;
  email: string;
  position?: string;
  staffRole: "STAFF" | "ADMIN" | "MANAGER" | "OPERATOR";
  restaurantId: string;
  restaurantName: string;
  canManageMenu: boolean;
  canManageOrders: boolean;
  canManageTables: boolean;
  canViewReports: boolean;
  isActive: boolean;
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

export async function staffLogin(
  email: string,
  password: string,
): Promise<{ success: boolean; user?: StaffUser; error?: string }> {
  try {
    // Find staff by email
    const staff = await db.staff.findUnique({
      where: { email },
      include: {
        restaurant: {
          select: {
            id: true,
            name: true,
          },
        },
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

    if (!staff) {
      return { success: false, error: "Invalid email or password" };
    }

    if (!staff.isActive) {
      return { success: false, error: "Account is deactivated" };
    }

    // Verify password
    if (!staff.password) {
      return { success: false, error: "Invalid email or password" };
    }

    const isValidPassword = await bcrypt.compare(password, staff.password);
    if (!isValidPassword) {
      return { success: false, error: "Invalid email or password" };
    }

    // Create session
    const session = await db.staffSession.create({
      data: {
        staffId: staff.id,
        token: generateToken(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
        ipAddress: "127.0.0.1", // You can get this from request
        userAgent: "Staff App", // You can get this from request
      },
    });

    // Set session cookie
    const cookieStore = await cookies();
    cookieStore.set("staff-session", session.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60, // 24 hours
    });

    const user: StaffUser = {
      id: staff.id,
      name: staff.name,
      email: staff.email,
      position: staff.position || undefined,
      staffRole: staff.staffRole,
      restaurantId: staff.restaurantId,
      restaurantName: staff.restaurant?.name || "Restaurant",
      canManageMenu: staff.canManageMenu,
      canManageOrders: staff.canManageOrders,
      canManageTables: staff.canManageTables,
      canViewReports: staff.canViewReports,
      isActive: staff.isActive,
      assignedTables: staff.assignedTables,
      assignedServicePoints: staff.servicePointStaff,
    };

    return { success: true, user };
  } catch (error) {
    console.error("Staff login error:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

export async function getCurrentStaff(): Promise<StaffUser | null> {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("staff-session")?.value;

    if (!sessionToken) {
      return null;
    }

    const session = await db.staffSession.findUnique({
      where: { token: sessionToken },
      include: {
        staff: {
          include: {
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
            restaurant: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    if (!session || session.expiresAt < new Date()) {
      // Session expired, clean it up
      if (session) {
        await db.staffSession.delete({ where: { id: session.id } });
      }
      return null;
    }

    const staff = session.staff;
    return {
      id: staff.id,
      name: staff.name,
      email: staff.email,
      position: staff.position || undefined,
      staffRole: staff.staffRole,
      restaurantId: staff.restaurantId,
      restaurantName: staff.restaurant?.name || "Restaurant",
      canManageMenu: staff.canManageMenu,
      canManageOrders: staff.canManageOrders,
      canManageTables: staff.canManageTables,
      canViewReports: staff.canViewReports,
      isActive: staff.isActive,
      assignedTables: staff.assignedTables,
      assignedServicePoints: staff.servicePointStaff,
    };
  } catch (error) {
    console.error("Get current staff error:", error);
    return null;
  }
}

export async function staffLogout(): Promise<void> {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("staff-session")?.value;

    if (sessionToken) {
      // Delete session from database
      await db.staffSession.deleteMany({
        where: { token: sessionToken },
      });
    }

    // Clear cookie
    cookieStore.delete("staff-session");
  } catch (error) {
    console.error("Staff logout error:", error);
  }
}

export async function requireAuth(): Promise<StaffUser> {
  const user = await getCurrentStaff();
  if (!user) {
    redirect("/login");
  }
  return user;
}

function generateToken(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}
