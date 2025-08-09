import db from "@platter/db";
import { NextResponse } from "next/server";
import getServerSession from "@/lib/auth/server";

export async function GET() {
  try {
    const session = await getServerSession();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        address: true,
        city: true,
        seatingCapacity: true,
        location: {
          select: {
            id: true,
            name: true,
            address: true,
            seatingCapacity: true,
            city: true,
            state: true,
            zipCode: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      ...user,
      location: user.location || {
        name: user.address,
        address: user.address,
        city: user.city,
        seatingCapacity: user.seatingCapacity,
      },
    });
  } catch (_error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
