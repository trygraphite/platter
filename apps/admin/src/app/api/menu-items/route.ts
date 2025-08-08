// File: /app/api/menu-items/route.ts
import db from "@platter/db";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");
  const categoryId = searchParams.get("categoryId");

  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }

  try {
    const menuItems = await db.menuItem.findMany({
      where: {
        userId,
        deletedAt: null, // Only get non-deleted menu items
        ...(categoryId && {
          categoryId,
          category: {
            deletedAt: null, // Ensure the category is also not deleted
          },
        }),
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            description: true,
          },
        },
        varieties: {
          where: {
            deletedAt: null, // Only get non-deleted varieties
          },
          select: {
            id: true,
            name: true,
            description: true,
            price: true,
            position: true,
            isAvailable: true,
            isDefault: true,
            createdAt: true,
            updatedAt: true,
          },
          orderBy: { position: "asc" },
        },
        servicePoint: {
          select: {
            id: true,
            name: true,
            description: true,
            isActive: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(menuItems);
  } catch (error) {
    console.error("Failed to fetch menu items:", error);
    return NextResponse.json(
      { error: "Failed to fetch menu items" },
      { status: 500 },
    );
  }
}
