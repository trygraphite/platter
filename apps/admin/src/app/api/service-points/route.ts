import db from "@platter/db";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }

  try {
    const servicePoints = await db.servicePoint.findMany({
      where: {
        userId,
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        description: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json(servicePoints);
  } catch (error) {
    console.error("Failed to fetch service points:", error);
    return NextResponse.json(
      { error: "Failed to fetch service points" },
      { status: 500 },
    );
  }
}
