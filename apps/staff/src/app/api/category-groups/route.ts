import db from "@platter/db/index";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { requireAuth } from "@/utils/auth";

export async function GET() {
  try {
    const staff = await requireAuth();

    if (!staff.canManageMenu) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    const categoryGroups = await db.categoryGroup.findMany({
      where: {
        userId: staff.restaurantId,
        deletedAt: null,
      },
      include: {
        categories: {
          where: {
            deletedAt: null,
          },
          include: {
            menuItems: {
              where: {
                deletedAt: null,
              },
              include: {
                varieties: true,
                servicePoint: {
                  select: {
                    id: true,
                    name: true,
                    description: true,
                    isActive: true,
                  },
                },
              },
            },
          },
          orderBy: {
            position: "asc",
          },
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

export async function POST(request: NextRequest) {
  try {
    const staff = await requireAuth();

    if (!staff.canManageMenu) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    const body = await request.json();
    const { name, description } = body;

    // Get the highest position for new group
    const maxPosition = await db.categoryGroup.aggregate({
      where: {
        userId: staff.restaurantId,
        deletedAt: null,
      },
      _max: {
        position: true,
      },
    });

    const newPosition = (maxPosition._max.position || 0) + 1;

    const categoryGroup = await db.categoryGroup.create({
      data: {
        name,
        description,
        position: newPosition,
        userId: staff.restaurantId,
      },
    });

    return NextResponse.json(categoryGroup);
  } catch (error) {
    console.error("Error creating category group:", error);
    return NextResponse.json(
      { error: "Failed to create category group" },
      { status: 500 },
    );
  }
}
