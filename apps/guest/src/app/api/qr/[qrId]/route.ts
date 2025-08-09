import db from "@platter/db";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ qrId: string }> },
) {
  try {
    const { qrId } = await params;

    const qrCodeData = await db.qRCode.findUnique({
      where: {
        id: qrId,
      },
      select: {
        id: true,
        tableId: true,
        table: {
          select: {
            id: true,
            number: true,
            capacity: true,
            isAvailable: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            description: true,
            image: true,
            cuisine: true,
            subdomain: true,
          },
        },
      },
    });

    if (!qrCodeData) {
      return NextResponse.json(
        { success: false, error: "QR code not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        qrId: qrCodeData.id,
        tableId: qrCodeData.tableId,
        table: qrCodeData.table,
        restaurant: qrCodeData.user,
      },
    });
  } catch (error) {
    console.error("Error fetching QR code data:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}
