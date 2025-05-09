// File: /app/api/category-groups/route.ts
import getServerSession from "@/lib/auth/server";
import db from "@platter/db";
import { NextRequest, NextResponse } from "next/server";

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
      },
      include: {
        categories: {
          include: {
            menuItems: true,
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
      { status: 500 }
    );
  }
}