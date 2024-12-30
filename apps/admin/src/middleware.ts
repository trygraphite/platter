import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    const isAuthPage =
      request.nextUrl.pathname.startsWith("/login") ||
      request.nextUrl.pathname.startsWith("/register");

    if (!session && !isAuthPage) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    if (session && isAuthPage) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  } catch (error) {
    // If session validation fails, treat as no session
    const isAuthPage =
      request.nextUrl.pathname.startsWith("/login") ||
      request.nextUrl.pathname.startsWith("/register");
    
    if (!isAuthPage) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return response;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
