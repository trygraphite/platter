import db from "@platter/db";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }

  try {
    const tables = await db.table.findMany({
      where: {
        userId,
        isAvailable: true,
      },
      select: {
        id: true,
        number: true,
        capacity: true,
        isAvailable: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        number: "asc",
      },
    });

    return NextResponse.json(tables);
  } catch (error) {
    console.error("Failed to fetch tables:", error);
    return NextResponse.json(
      { error: "Failed to fetch tables" },
      { status: 500 },
    );
  }
}
