// File: /app/api/category-groups/route.ts

import db from "@platter/db";
import { type NextRequest, NextResponse } from "next/server";
import getServerSession from "@/lib/auth/server";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 });
    }

    // Security check: ensure the user can only access their own data
    if (userId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const categoryGroups = await db.categoryGroup.findMany({
      where: {
        userId,
        deletedAt: null, // Only get non-deleted category groups
      },
      include: {
        categories: {
          where: {
            deletedAt: null, // Only get non-deleted categories
          },
          include: {
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
              },
              orderBy: { position: "asc" },
            },
          },
          orderBy: { position: "asc" },
        },
      },
      orderBy: {
        position: "asc",
      },
    });

    return NextResponse.json(categoryGroups);
  } catch (error) {
    console.error("Error fetching category groups:", error);
    return NextResponse.json(
      { error: "Failed to fetch category groups" },
      { status: 500 },
    );
  }
}
