import { requireAuth } from "@/utils/auth";
import db from "@platter/db/index";
import { type NextRequest, NextResponse } from "next/server";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const staff = await requireAuth();

    if (!staff.canManageMenu) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    const body = await request.json();
    const { name, description } = body;

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    // Verify the category group belongs to the staff's restaurant
    const existingGroup = await db.categoryGroup.findFirst({
      where: {
        id: params.id,
        userId: staff.restaurantId,
      },
    });

    if (!existingGroup) {
      return NextResponse.json(
        { error: "Category group not found or access denied" },
        { status: 404 },
      );
    }

    const categoryGroup = await db.categoryGroup.update({
      where: { id: params.id },
      data: {
        name,
        description: description || "",
      },
    });

    return NextResponse.json(categoryGroup);
  } catch (error) {
    console.error("Error updating category group:", error);
    return NextResponse.json(
      { error: "Failed to update category group" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const staff = await requireAuth();

    if (!staff.canManageMenu) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    // Verify the category group belongs to the staff's restaurant
    const existingGroup = await db.categoryGroup.findFirst({
      where: {
        id: params.id,
        userId: staff.restaurantId,
      },
    });

    if (!existingGroup) {
      return NextResponse.json(
        { error: "Category group not found or access denied" },
        { status: 404 },
      );
    }

    // Soft delete the category group
    await db.categoryGroup.update({
      where: { id: params.id },
      data: { deletedAt: new Date() },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting category group:", error);
    return NextResponse.json(
      { error: "Failed to delete category group" },
      { status: 500 },
    );
  }
}
