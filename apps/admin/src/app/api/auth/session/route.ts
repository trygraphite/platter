import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });
    return NextResponse.json({ session });
  } catch (error) {
    console.error("Session validation error:", error);
    return NextResponse.json({ session: null }, { status: 401 });
  }
}
