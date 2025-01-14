"use server";

import QRCode from "qrcode";
import db from "@platter/db";
import { QRCodeResponse } from "@/types/qr-code";
import getServerSession from "../auth/server";

type QRCodeTarget = "table" | "menu";

export async function createQRCodeAction(
  tableNumber?: number,
  target: QRCodeTarget = "table",
  capacity: number = 4 // Default capacity if not provided
): Promise<QRCodeResponse> {
  try {
    const session = await getServerSession();

    if (!session?.user?.id) {
      return {
        success: false,
        error: "Not authenticated",
      };
    }

    const restaurant = await db.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        subdomain: true,
      },
    });

    if (!restaurant || !restaurant.subdomain) {
      return {
        success: false,
        error: "Restaurant subdomain not found",
      };
    }

    // If this is a table QR code, create or update the table record
    let tableRecord;
    if (target === "table" && tableNumber) {
      // Check if table already exists
      const existingTable = await db.table.findUnique({
        where: {
          number: tableNumber.toString(),
          userId: session.user.id,
        },
      });

      if (existingTable) {
        tableRecord = existingTable;
      } else {
        // Create new table record
        tableRecord = await db.table.create({
          data: {
            number: tableNumber.toString(),
            capacity: capacity,
            userId: session.user.id,
            isAvailable: true,
          },
        });
      }
    }

    // Create the QR code record in the database
    const qrCodeRecord = await db.qRCode.create({
      data: {
        target,
        targetNumber: tableNumber?.toString() || null,
        userId: session.user.id,
        tableId: tableRecord?.id,
      },
    });

    // Construct the base URL
    const baseUrl = process.env.BASE_DOMAIN;
    const isProduction = process.env.NODE_ENV === "production";
    const protocol = isProduction ? "https" : "http";
    const domain = isProduction
      ? `${restaurant.subdomain}.${baseUrl}`
      : `${restaurant.subdomain}.localhost:3000`;

    // Use the database ID in the URL
    const targetUrl = `${protocol}://${domain}/${qrCodeRecord.id}`;

    // Generate QR code data URL
    const qrCodeUrl = await QRCode.toDataURL(targetUrl, {
      width: 300,
      margin: 2,
      color: {
        dark: "#000000",
        light: "#ffffff",
      },
    });

    // Update the QR code record with the generated link
    await db.qRCode.update({
      where: { id: qrCodeRecord.id },
      data: { link: targetUrl },
    });

    return {
      success: true,
      qrCodeUrl,
    };
  } catch (error) {
    console.error("QR Code generation error:", error);
    return {
      success: false,
      error: "Failed to generate QR code",
    };
  }
}