// File: /app/api/admin/categories/route.ts (optional)
import db from "@platter/db";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");
  const includeDeleted = searchParams.get("includeDeleted") === "true";

  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }

  try {
    const categories = await db.category.findMany({
      where: { 
        userId,
        ...(includeDeleted ? {} : { deletedAt: null }), // Include deleted if requested
      },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        description: true,
        createdAt: true,
        updatedAt: true,
        deletedAt: true, // Include deletedAt for admin view
        isActive: true,
        menuItems: {
          where: includeDeleted ? {} : { deletedAt: null },
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
            deletedAt: true, // Include deletedAt for admin view
            varieties: {
              where: includeDeleted ? {} : { deletedAt: null },
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
                deletedAt: true, // Include deletedAt for admin view
              },
              orderBy: { position: "asc" },
            },
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