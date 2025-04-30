"use server";

import QRCode from "qrcode";
import db from "@platter/db";
import type { QRCodeResponse } from "@/types/qr-code";
import getServerSession from "../auth/server";

type QRCodeTarget = "table" | "menu" | "location";

export async function createQRCodeAction(
  tableNumber?: number,
  target: QRCodeTarget = "table",
  capacity = 4,
  locationName?: string,
): Promise<QRCodeResponse> {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return { success: false, error: "Not authenticated" };
    }

    const restaurant = await db.user.findUnique({
      where: { id: session.user.id },
      select: { id: true, subdomain: true },
    });

    if (!restaurant?.subdomain) {
      return { success: false, error: "Restaurant subdomain not found" };
    }

    let userLocation;
    let extractedLocationName = "";

    // Location validation logic
    if (target === "location") {
      if (!tableNumber) {
        return {
          success: false,
          error: "Table number is required for location QR codes",
        };
      }

      // Get user's location
      userLocation = await db.location.findFirst({
        where: { users: { some: { id: session.user.id } } },
        include: { table: true },
      });

      if (!userLocation) {
        return { success: false, error: "Restaurant location not found" };
      }

      // Validate table exists in location
      const tableExists = userLocation.table.some(
        (t: { number: string; }) => t.number === tableNumber.toString(),
      );

      if (!tableExists) {
        return {
          success: false,
          error: `Table ${tableNumber} not found in this location`,
        };
      }

      // Format location name for URL
      extractedLocationName = userLocation.name
        .trim()
        .replace(/\s+/g, "-")
        .toLowerCase();
    }

    // QR Code handling
    let qrCodeRecord;
    if (target === "table" && tableNumber) {
      // Existing table QR code logic
      const existingTable = await db.table.findFirst({
        where: { number: tableNumber.toString(), userId: session.user.id },
      });

      const tableRecord =
        existingTable ||
        (await db.table.create({
          data: {
            number: tableNumber.toString(),
            capacity,
            userId: session.user.id,
            isAvailable: true,
          },
        }));

      const existingQR = await db.qRCode.findFirst({
        where: {
          tableId: tableRecord.id,
          target: "table",
          userId: session.user.id,
        },
      });

      qrCodeRecord =
        existingQR ||
        (await db.qRCode.create({
          data: {
            target: "table",
            targetNumber: tableNumber.toString(),
            userId: session.user.id,
            tableId: tableRecord.id,
          },
        }));
    } else if (target === "location") {
      // Check for existing location QR code for this table
      qrCodeRecord = await db.qRCode.findFirst({
        where: {
          locationId: userLocation?.id,
          target: "location",
          targetNumber: tableNumber?.toString(),
          userId: session.user.id,
        },
      });

      if (!qrCodeRecord) {
        return {
          success: false,
          error: "QR code not found for this location table combination",
        };
      }
    } else if (target === "menu") {
      // Menu QR code logic
      const existingQR = await db.qRCode.findFirst({
        where: { target: "menu", userId: session.user.id },
      });

      qrCodeRecord =
        existingQR ||
        (await db.qRCode.create({
          data: { target: "menu", userId: session.user.id },
        }));
    }

    // URL construction
    const baseUrl = process.env.BASE_DOMAIN || "localhost";
    const isProduction = process.env.NODE_ENV === "production";
    const protocol = isProduction ? "https" : "http";

    const domain =
      target === "location"
        ? isProduction
          ? baseUrl
          : "localhost:3001"
        : `${restaurant.subdomain}.${isProduction ? baseUrl : "localhost:3001"}`;

    const path =
      target === "location"
        ? `${extractedLocationName}/${tableNumber}`
        : target === "menu"
          ? "menu"
          : qrCodeRecord?.id;

    const targetUrl = `${protocol}://${domain}/${path}`;
    if (!targetUrl) throw new Error("Failed to construct target URL");

    // Generate QR code image
    const qrCodeUrl = await QRCode.toDataURL(targetUrl, {
      width: 300,
      margin: 2,
      color: { dark: "#000000", light: "#ffffff" },
    });

    // Update QR code link if changed (only for non-location targets)
    if (target !== "location" && qrCodeRecord?.link !== targetUrl) {
      await db.qRCode.update({
        where: { id: qrCodeRecord?.id },
        data: { link: targetUrl },
      });
    }

    return {
      success: true,
      qrCodeUrl,
      locationName: extractedLocationName,
    };
  } catch (error) {
    console.error("QR Code generation error:", error);
    return { success: false, error: "Failed to generate QR code" };
  }
}