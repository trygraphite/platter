// File: /app/api/categories/route.ts
import db from "@platter/db";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }

  try {
    const categories = await db.category.findMany({
      where: {
        userId,
        deletedAt: null, // Only get non-deleted categories
      },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        description: true,
        createdAt: true,
        updatedAt: true,
        menuItems: {
          where: {
            deletedAt: null, // Only get non-deleted menu items
          },
          select: {
            id: true,
            name: true,
            description: true,
            price: true,
            image: true,
            isAvailable: true,
            hasVarieties: true,
            position: true,
            createdAt: true,
            updatedAt: true,
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
            servicePoint: true,
          },
          orderBy: { position: "asc" },
        },
      },
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 },
    );
  }
}