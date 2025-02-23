"use server";
import QRCode from "qrcode";
import db from "@platter/db";
import { UserRole } from "@prisma/client";
import getServerSession from "../auth/server";
import { z } from "zod";

// Add Zod schema for validation
const locationSchema = z.object({
  name: z.string().min(3),
  address: z.string().min(5),
  city: z.string().min(2),
  state: z.string().min(2),
  seatingCapacity: z.number().min(1,),
  description: z.string().optional(),
});

// LOCATION ACTIONS

export async function createLocation(data: z.infer<typeof locationSchema>) {
  try {
    const user = await getServerSession();
    if (!user?.user) return { error: "Authentication required!" };

    // Validate input with Zod
    const validatedData = locationSchema.parse(data);

    // Check admin role
    const dbUser = await db.user.findUnique({
      where: { id: user.user.id },
      select: { role: true },
    });

    if (dbUser?.role !== UserRole.ADMIN) {
      return { error: "Unauthorized!" };
    }

    // Create location
    await db.location.create({
      data: validatedData,
    });

    return { success: "Location created successfully!" };
  } catch (error) {
    if (error instanceof z.ZodError && error.errors.length > 0) {
      return { error: error.errors[0]?.message };
    }
    return { error: "Failed to create location" };
  }
}

export async function addRestaurantToLocation({
  locationId,
  restaurantId,
}: {
  locationId: string;
  restaurantId: string;
}) {
  try {
    const user = await getServerSession();
    if (!user?.user) return { error: "Authentication required!" };

    // Check if user is an admin
    const dbUser = await db.user.findUnique({
      where: { id: user.user.id },
      select: { role: true },
    });

    if (dbUser?.role !== UserRole.ADMIN) {
      return { error: "Unauthorized!" };
    }

    // Fetch location details
    const location = await db.location.findUnique({
      where: { id: locationId },
      select: { seatingCapacity: true, name: true },
    });

    if (!location) {
      return { error: "Location not found!" };
    }

    // Fetch restaurant details
    const restaurant = await db.user.findUnique({
      where: { id: restaurantId },
      select: { subdomain: true },
    });

    if (!restaurant || !restaurant.subdomain) {
      return { error: "Restaurant subdomain not found!" };
    }
    // Extract location name for URL
    const extractedLocationName = location.name
      .trim()
      .replace(/\s+/g, "-")
      .toLowerCase();

    // Define base URL
    const baseUrl = process.env.BASE_DOMAIN || "localhost";
    const isProduction = process.env.NODE_ENV === "production";
    const protocol = isProduction ? "https" : "http";
    const domain = isProduction ? baseUrl : "localhost:3000"; // Localhost for development

    // Update the restaurant's location
    await db.user.update({
      where: { id: restaurantId },
      data: { locationId },
    });

    // Generate tables and QR codes
    const seatingCapacity = location.seatingCapacity || 0;
    for (let i = 1; i <= seatingCapacity; i++) {
      // Create table
      const table = await db.table.create({
        data: {
          number: `${i}`,
          capacity: 4, // Default capacity
          isAvailable: true,
          userId: restaurantId,
          locationId,
        },
      });

      // Create QR code record
      const qrCodeRecord = await db.qRCode.create({
        data: {
          target: "location",
          targetNumber: table.number,
          userId: restaurantId,
          tableId: table.id,
          locationId,
        },
      });

      // Construct proper URL structure
      const targetUrl = `${protocol}://${domain}/location/${extractedLocationName}/${qrCodeRecord.id}`;

      // Generate QR code image
      const qrCodeUrl = await QRCode.toDataURL(targetUrl, {
        width: 300,
        margin: 2,
        color: {
          dark: "#000000",
          light: "#ffffff",
        },
      });

      // Update QR code record with the link
      await db.qRCode.update({
        where: { id: qrCodeRecord.id },
        data: { link: targetUrl },
      });
    }

    return {
      success: "Restaurant added to location, tables and QR codes generated!",
    };
  } catch (error) {
    console.error("Error adding restaurant to location:", error);
    return { error: "Failed to add restaurant and generate QR codes." };
  }
}

export async function removeRestaurantFromLocation(restaurantId: string) {
  try {
    const user = await getServerSession();
    if (!user?.user) return { error: "Authentication required!" };

    // Check admin role
    const dbUser = await db.user.findUnique({
      where: { id: user.user.id },
      select: { role: true },
    });

    if (dbUser?.role !== UserRole.ADMIN) {
      return { error: "Unauthorized!" };
    }

    await db.user.update({
      where: { id: restaurantId },
      data: { locationId: null },
    });

    return { success: "Restaurant removed from location!" };
  } catch (error) {
    return { error: "Failed to remove restaurant" };
  }
}
export async function leaveLocation() {
  const user = await getServerSession();
  if (!user?.user) return { error: "Authentication required!" };

  try {
    await db.user.update({
      where: { id: user.user.id },
      data: { locationId: null },
    });

    // Optional: Update any pending requests
    await db.joinRequest.updateMany({
      where: {
        userId: user.user.id,
        status: "APPROVED",
      },
      data: { status: "REJECTED" },
    });

    return { success: "Successfully left location!" };
  } catch (error) {
    return { error: "Failed to leave location" };
  }
}

export async function getLocations(search?: string) {
  return db.location.findMany({
    include: { users: true },
  });
}


// REQUESTS ACTIONS

export async function getPendingRequests() {
  const user = await getServerSession();
  if (!user?.user) return [];

  // Check admin role
  const dbUser = await db.user.findUnique({
    where: { id: user.user.id },
    select: { role: true },
  });

  if (dbUser?.role !== UserRole.ADMIN) return [];

  return db.joinRequest.findMany({
    where: { status: "PENDING" },
    include: {
      user: true,
      location: true,
    },
  });
}

export async function approveRequest(requestId: string) {
  try {
    const user = await getServerSession();
    if (!user?.user) return { error: "Authentication required!" };

    // Check admin role
    const dbUser = await db.user.findUnique({
      where: { id: user.user.id },
      select: { role: true },
    });

    if (dbUser?.role !== UserRole.ADMIN) {
      return { error: "Unauthorized!" };
    }

    // Approve the request and fetch the request details
    const request = await db.joinRequest.update({
      where: { id: requestId },
      data: { status: "APPROVED" },
      include: { user: true, location: true },
    });

    // Update user's location
    await db.user.update({
      where: { id: request.userId },
      data: { locationId: request.locationId },
    });

    // Fetch location details including name
    const location = await db.location.findUnique({
      where: { id: request.locationId },
      select: { seatingCapacity: true, name: true },
    });

    if (!location) {
      return { error: "Location not found!" };
    }

    // URL configuration
    const baseUrl = process.env.BASE_DOMAIN || "localhost";
    const isProduction = process.env.NODE_ENV === "production";
    const protocol = isProduction ? "https" : "http";
    const domain = isProduction ? baseUrl : "localhost:3000";

    // Format location name for URL
    const extractedLocationName = location.name
      .trim()
      .replace(/\s+/g, "-")
      .toLowerCase();

    // Generate tables and QR codes
    const seatingCapacity = location.seatingCapacity || 0;
    for (let i = 1; i <= seatingCapacity; i++) {
      // Create table
      const table = await db.table.create({
        data: {
          number: `${i}`,
          capacity: 4,
          isAvailable: true,
          userId: request.userId,
          locationId: request.locationId,
        },
      });

      // Create QR code record
      const qrCodeRecord = await db.qRCode.create({
        data: {
          target: "location",
          targetNumber: table.number,
          userId: request.userId,
          tableId: table.id,
          locationId: request.locationId,
        },
      });

      // Construct QR code URL
      const targetUrl = `${protocol}://${domain}/location/${extractedLocationName}/${qrCodeRecord.id}`;

      // Generate QR code image
      const qrCodeUrl = await QRCode.toDataURL(targetUrl, {
        width: 300,
        margin: 2,
        color: { dark: "#000000", light: "#ffffff" },
      });

      // Update QR code with generated URL
      await db.qRCode.update({
        where: { id: qrCodeRecord.id },
        data: { link: targetUrl },
      });
    }

    return {
      success:
        "Request approved, restaurant added to location, tables and QR codes generated!",
    };
  } catch (error) {
    console.error("Error approving request:", error);
    return { error: "Failed to approve request" };
  }
}

export async function rejectRequest(requestId: string) {
  try {
    const user = await getServerSession();
    if (!user?.user) return { error: "Authentication required!" };

    // Check admin role
    const dbUser = await db.user.findUnique({
      where: { id: user.user.id },
      select: { role: true },
    });

    if (dbUser?.role !== UserRole.ADMIN) {
      return { error: "Unauthorized!" };
    }

    await db.joinRequest.update({
      where: { id: requestId },
      data: { status: "REJECTED" },
    });

    return { success: "Request rejected!" };
  } catch (error) {
    return { error: "Failed to reject request" };
  }
}

// Modified requestToJoinLocation
export async function requestToJoinLocation(locationId: string) {
  const user = await getServerSession();
  if (!user?.user) return { error: "Authentication required!" };

  try {
    // Check for existing request
    const existingRequest = await db.joinRequest.findFirst({
      where: {
        userId: user.user.id,
        locationId,
        status: "PENDING",
      },
    });

    if (existingRequest) {
      return { error: "You already have a pending request for this location" };
    }

    await db.joinRequest.create({
      data: {
        userId: user.user.id,
        locationId,
        status: "PENDING",
      },
    });

    return { success: "Join request submitted!" };
  } catch (error) {
    return { error: "Failed to submit request" };
  }
}


