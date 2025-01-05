"use server";

import QRCode from "qrcode";
import db from "@platter/db";
import { QRCodeResponse } from "@/types/qr-code";
import getServerSession from "../auth/server";

export async function createQRCodeAction(
  tableNumber: number,
): Promise<QRCodeResponse> {
  try {
    const session = await getServerSession();

    if (!session?.user?.id) {
      return {
        success: false,
        error: "Not authenticated",
      };
    }
    // Fetch user (restaurant) details, including subdomain
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

    // Construct the table URL
    const baseUrl = process.env.BASE_DOMAIN;
    const isProduction = process.env.NODE_ENV === "production";
    const protocol = isProduction ? "https" : "http";
    const domain = isProduction
      ? `${restaurant.subdomain}.${baseUrl}`
      : `${restaurant.subdomain}.localhost:3000`;
    const tableUrl = `${protocol}://${domain}/table/${tableNumber}`;

    // Generate QR code data URL
    const qrCodeUrl = await QRCode.toDataURL(tableUrl, {
      width: 300,
      margin: 2,
      color: {
        dark: "#000000",
        light: "#ffffff",
      },
    });
    // Save the QR code data in the database
    const qrCodeRecord = await db.qRCode.create({
      data: {
        target: "table",
        targetNumber: tableNumber.toString(),
        link: tableUrl,
        userId: session.user.id,
      },
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
