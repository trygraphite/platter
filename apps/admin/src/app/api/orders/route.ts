// get the last order
import { type NextRequest, NextResponse } from "next/server";
import db from "@platter/db";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const lastOrder = await db.order.findFirst({
    where: {
      userId: userId || "",
      createdAt: { gte: today },
    },
    orderBy: { orderNumber: "desc" },
    select: { orderNumber: true },
  });

  return NextResponse.json({
    lastOrderNumber: lastOrder?.orderNumber || 0,
  });
}